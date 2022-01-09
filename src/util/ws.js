import { decode, encode } from 'base64-arraybuffer';

const uuid = require('uuid/v4');

const KEEP_LISTENING = true;
const STOP_LISTENING = false;

export async function socketConnect(urlMaybeHttp, pluginPublicKey, connectCallback) {
  // generate public/private keypair for the editor
  const keys = await crypto.subtle.generateKey({
    name: 'RSASSA-PKCS1-v1_5',
    modulusLength: 4096,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: 'SHA-256',
  }, true, ['sign']);

  // export and encode the editor public key
  const publicKey = encode(await crypto.subtle.exportKey('spki', keys.publicKey));

  // decode and import the plugin public key
  const pluginKey = await crypto.subtle.importKey('spki', decode(pluginPublicKey), {
    name: 'RSASSA-PKCS1-v1_5',
    hash: 'SHA-256',
  }, false, ['verify']);

  console.log('[WS] Generated keys and decoded plugin public key');

  // create a websocket
  // important that no async/await occurs after this point
  const socket = new WebSocket(
    urlMaybeHttp.startsWith('https')
      ? `wss${urlMaybeHttp.substring(5)}`
      : urlMaybeHttp,
  );

  // the socket interface that is exported to other parts of the code
  const socketInterface = {
    socket,
    listeners: [],

    // sends a raw (unsigned) message to the socket
    sendRaw: (msg) => {
      socket.send(JSON.stringify(msg));
    },

    // sends a signed message to the socket
    send: (msg) => {
      const encoded = JSON.stringify(msg);

      // sign the message with the editor private key
      const signPromise = crypto.subtle.sign(
        'RSASSA-PKCS1-v1_5',
        keys.privateKey,
        new TextEncoder().encode(encoded),
      );

      // send the signed+encoded message to the socket
      signPromise.then((signature) => {
        socket.send(JSON.stringify({
          type: 'msg',
          msg: encoded,
          signature: encode(signature),
        }));
      });
    },
  };

  // Listen to messages from the socket.
  socket.onmessage = (event) => {
    const frame = JSON.parse(event.data);
    if (frame.type !== 'msg') {
      return;
    }

    const { msg: innerMsg, signature } = frame;
    if (!innerMsg || !signature) {
      return;
    }

    // verify that the message was sent by the plugin
    // (check it was signed with the plugin public key)
    const verifyPromise = crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5',
      pluginKey,
      decode(signature),
      new TextEncoder().encode(innerMsg),
    );

    // if verification passes, forward the inner message onto listeners
    verifyPromise.then((verified) => {
      if (verified) {
        const msg = JSON.parse(innerMsg);
        socketInterface.listeners = socketInterface.listeners.filter(listener => listener(msg));
      }
    });
  };

  // Wait for the socket to open, then initialise a connection
  socket.onopen = () => {
    console.log('[WS] Socket open, initialising connection...');

    const nonce = uuid();

    function onMessage(msg) {
      if (msg.type === 'hello-reply' && msg.nonce === nonce) {
        if (msg.accepted) {
          // we're connected and communicating with the plugin
          // run the connect callback to store the socket in the vuex store
          console.log('[WS] Established connection with plugin!');
          connectCallback({ socket: socketInterface });
        } else {
          // this is a secondary session - disconnect
          console.log('[WS] Rejected by plugin, disconnecting.');
          socket.close();
        }
        return STOP_LISTENING;
      }
      return KEEP_LISTENING;
    }

    // add a listener to await a reply
    socketInterface.listeners.push(onMessage);

    // todo: move this and remove authSecret from url
    const secret = new URLSearchParams(window.location.search).get('authSecret');

    // send our public key once the socket is connected
    socketInterface.sendRaw({
      type: 'hello',
      publicKey,
      auth: secret,
      nonce,
    });
  };
}

export function sendChangesViaSocket(socket, bytebinCode) {
  return new Promise((resolve, reject) => {
    // is the socket isn't open, don't bother
    if (!socket || socket.socket.readyState !== 1) {
      reject(new Error('Socket closed'));
      return;
    }

    // wait 2 seconds for the plugin to accept the change
    let timeout = setTimeout(() => {
      reject(new Error('Timeout waiting for plugin to ack change'));
    }, 2000);

    // await a response
    function onMessage(msg) {
      if (msg.type === 'change-accepted') {
        clearTimeout(timeout);

        // wait a further 10 seconds for the plugin to apply the change
        timeout = setTimeout(() => {
          reject(new Error('Timeout waiting for plugin to reply with new code'));
        }, 10000);

        return KEEP_LISTENING;
      }
      if (msg.type === 'new-session-data') {
        clearTimeout(timeout);
        resolve(msg.newSessionCode);
        return STOP_LISTENING;
      }
      return KEEP_LISTENING;
    }

    // register reply listener
    socket.listeners.push(onMessage);

    // send the apply change request
    socket.send({
      type: 'apply-change',
      code: bytebinCode,
    });
  });
}
