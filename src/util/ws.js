import { decode, encode } from 'base64-arraybuffer';

const config = require('../../config');

const KEEP_LISTENING = true;
const STOP_LISTENING = false;

function importKey(format, encoded, keyUsages) {
  return crypto.subtle.importKey(format, decode(encoded), {
    name: 'RSASSA-PKCS1-v1_5',
    hash: 'SHA-256',
  }, false, keyUsages);
}

async function exportKey(format, key, storageKey) {
  const exported = await crypto.subtle.exportKey(format, key);
  const encoded = encode(exported);
  localStorage.setItem(storageKey, encoded);
  return encoded;
}

async function loadKeys() {
  const encodedPublicKey = localStorage.getItem('editor-public-key');
  const encodedPrivateKey = localStorage.getItem('editor-private-key');

  if (encodedPublicKey && encodedPrivateKey) {
    const publicKey = await importKey('spki', encodedPublicKey, []);
    const privateKey = await importKey('pkcs8', encodedPrivateKey, ['sign']);
    return {
      publicKey,
      privateKey,
      encodedPublicKey,
      encodedPrivateKey,
    };
  }

  return null;
}

async function generateKeys() {
  const { publicKey, privateKey } = await crypto.subtle.generateKey({
    name: 'RSASSA-PKCS1-v1_5',
    modulusLength: 4096,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: 'SHA-256',
  }, true, ['sign']);

  const encodedPublicKey = await exportKey('spki', publicKey, 'editor-public-key');
  const encodedPrivateKey = await exportKey('pkcs8', privateKey, 'editor-private-key');

  return {
    publicKey,
    privateKey,
    encodedPublicKey,
    encodedPrivateKey,
  };
}

function startKeepalive(socket) {
  /* eslint-disable no-param-reassign */
  function onMessage(msg) {
    if (msg.type === 'pong') {
      if (!msg.ok) {
        console.log('[WS] Plugin closed the connection, disconnecting...');
        socket.socket.close();
        return STOP_LISTENING;
      }

      socket.lastPong = Date.now();
    }
    return KEEP_LISTENING;
  }

  socket.listeners.push(onMessage);

  socket.keepaliveTask = setInterval(() => {
    if (socket.socket.readyState !== 1) {
      clearInterval(socket.keepaliveTask);
      return;
    }

    if (socket.lastPing !== 0 && Date.now() - socket.lastPong > 11000) {
      console.log('[WS] Plugin stopped responding to keepalive, disconnecting');
      socket.socket.close();
      return;
    }

    socket.lastPing = Date.now();
    socket.send({
      type: 'ping',
    });
  }, 10000);
  /* eslint-enable no-param-reassign */
}

function randomString(len) {
  function dec2hex(dec) {
    return dec.toString(16).padStart(2, '0');
  }

  const arr = new Uint8Array((len || 40) / 2);
  crypto.getRandomValues(arr);
  return Array.from(arr, dec2hex).join('');
}

function initConnection(socket, sessionId, encodedPublicKey, callbacks) {
  const nonce = `${randomString(4)}-${randomString(4)}`;

  function onMessage(msg) {
    if (msg.type === 'hello-reply' && msg.nonce === nonce) {
      if (msg.state === 'accepted' || msg.state === 'trusted') {
        // we're connected and communicating with the plugin
        // run the connect callback to store the socket in the vuex store
        console.log('[WS] Established connection with plugin!');

        if (msg.state === 'trusted') {
          socket.send({
            type: 'connected',
          });
          callbacks.trusted();
        }

        startKeepalive(socket);
        callbacks.connect({ socket });
        return STOP_LISTENING;
      }

      if (msg.state === 'untrusted') {
        callbacks.trust({ nonce });
        return KEEP_LISTENING;
      }

      if (msg.state === 'invalid') {
        // the session is has already been completed!
        // TODO: warn user?
        console.log('[WS] Session data has expired, disconnecting.');
        socket.socket.close();
        return STOP_LISTENING;
      }

      if (msg.state === 'rejected') {
        // this is a secondary session - disconnect
        console.log('[WS] Rejected by plugin, disconnecting.');
        socket.socket.close();
        return STOP_LISTENING;
      }

      throw new Error(`unknown state: ${msg.state}`);
    }

    return KEEP_LISTENING;
  }

  // add a listener to await a reply
  socket.listeners.push(onMessage);

  // send our public key once the socket is connected
  socket.send({
    type: 'hello',
    nonce,
    sessionId,
    browser: window.navigator.userAgent,
    publicKey: encodedPublicKey,
  });
}

// eslint-disable-next-line max-len
export async function socketConnect(channelId, sessionId, pluginPublicKey, callbacks) {
  // generate public/private keypair for the editor
  const keys = await loadKeys() || await generateKeys();

  // decode and import the plugin public key
  const pluginKey = await importKey('spki', pluginPublicKey, ['verify']);

  console.log('[WS] Generated keys and decoded plugin public key');

  // create a websocket
  // important that no async/await occurs after this point
  const socket = new WebSocket(`wss://${config.bytesocks_host}/${channelId}`);

  // the socket interface that is exported to other parts of the code
  const socketInterface = {
    socket,
    listeners: [],
    lastPing: 0,
    lastPong: 0,
    keepaliveTask: null,

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
          msg: encoded,
          signature: encode(signature),
        }));
      });
    },
  };

  // Listen to messages from the socket.
  socket.onmessage = (event) => {
    const frame = JSON.parse(event.data);

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

        const toRemove = [];
        socketInterface.listeners.forEach((listener, i) => {
          const resp = listener(msg);
          if (resp === STOP_LISTENING) {
            toRemove.unshift(i);
          }
        });
        toRemove.forEach(i => socketInterface.listeners.splice(i, 1));
      }
    });
  };

  // Wait for the socket to open, then initialise a connection
  socket.onopen = () => {
    console.log('[WS] Socket open, initialising connection...');
    initConnection(socketInterface, sessionId, keys.encodedPublicKey, callbacks);
  };

  // Call the close callback if the socket closes
  socket.onclose = () => {
    callbacks.close();
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
      if (msg.type === 'change-response') {
        if (msg.state === 'accepted') {
          clearTimeout(timeout);

          // wait a further 10 seconds for the plugin to apply the change
          timeout = setTimeout(() => {
            reject(new Error('Timeout waiting for plugin to reply with new code'));
          }, 10000);

          return KEEP_LISTENING;
        }
        if (msg.state === 'applied') {
          clearTimeout(timeout);
          resolve(msg.newSessionCode);
          return STOP_LISTENING;
        }
      }
      return KEEP_LISTENING;
    }

    // register reply listener
    socket.listeners.push(onMessage);

    // send the apply change request
    socket.send({
      type: 'change-request',
      code: bytebinCode,
    });
  });
}
