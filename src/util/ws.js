import { decode, encode } from 'base64-arraybuffer';

const uuid = require('uuid/v4');

const KEEP_LISTENING = true;
const STOP_LISTENING = false;

export async function socketConnect(urlMaybeHttp, pluginPublicKey, connectCallback) {
  const keys = await crypto.subtle.generateKey({
    name: 'RSASSA-PKCS1-v1_5',
    modulusLength: 4096,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: 'SHA-256',
  }, true, ['sign']);

  const pluginKey = await crypto.subtle.importKey('spki', decode(pluginPublicKey), {
    name: 'RSASSA-PKCS1-v1_5',
    hash: 'SHA-256',
  }, false, ['verify']);

  const publicKey = encode(await crypto.subtle.exportKey('spki', keys.publicKey));
  console.log('generated keys');

  let url;
  if (urlMaybeHttp.startsWith('https')) { // todo fix this in LP wtf
    url = `wss${urlMaybeHttp.substring(5)}`;
  } else {
    url = urlMaybeHttp;
  }
  const socket = new WebSocket(url);
  console.log('setup socket');

  const socketInterface = {
    socket,
    sendRaw: (msg) => {
      socket.send(JSON.stringify(msg));
      console.log('sent msg');
    },
    send: (msg) => {
      const encoded = JSON.stringify(msg);
      console.log('sending signed');

      crypto.subtle.sign('RSASSA-PKCS1-v1_5', keys.privateKey, new TextEncoder().encode(encoded)).then((sign) => {
        socket.send(JSON.stringify({ type: 'msg', msg: encoded, signature: encode(sign) }));
        console.log('sent signed msg');
      });
    },
    listeners: [],
  };

  socket.onopen = () => {
    const nonce = uuid();

    console.log('socket open');

    function onMessage(msg) {
      console.log('listener got it');
      if (msg.type === 'hello-reply' && msg.nonce === nonce) {
        console.log('listener 2');
        if (msg.accepted) {
          console.log('listener YESSS');
          // yay, we're connected and communicating with the plugin
          // run the connect callback to store the socket in the vuex store
          connectCallback({ socket: socketInterface });
        } else {
          console.log('listener 3');
          // this is a secondary session - disconnect.
          socket.close();
        }
        return STOP_LISTENING;
      }
      return KEEP_LISTENING;
    }

    // add a listener to await a reply
    socketInterface.listeners.push(onMessage);

    // todo: move this
    const secret = new URLSearchParams(window.location.search).get('authSecret');
    console.log('using secret ', secret);

    // send our public key once the socket is connected
    socketInterface.sendRaw({
      type: 'hello',
      publicKey,
      auth: secret,
      nonce,
    });

    console.log('sent initial');
  };

  socket.onmessage = (event) => {
    console.log('got msg');
    const frame = JSON.parse(event.data);
    if (frame.type !== 'msg') {
      console.log('discarding frame not msg');
      return;
    }

    const { msg: innerMsg, signature } = frame;
    if (!innerMsg || !signature) {
      console.log('discarding frame no sig');
      return;
    }

    crypto.subtle.verify('RSASSA-PKCS1-v1_5', pluginKey, decode(signature), new TextEncoder().encode(innerMsg)).then((verified) => {
      if (verified) {
        const msg = JSON.parse(innerMsg);
        console.log('passing to listeners');
        socketInterface.listeners = socketInterface.listeners.filter(listener => listener(msg));
      } else {
        console.log('no veorfy');
      }
    });
  };
}

export function sendChangesViaSocket(socket, bytebinCode, callback) {
  // is the socket isn't open, don't bother
  if (socket.socket.readyState !== 1) {
    callback(null);
    return;
  }

  // wait 2 seconds for the plugin to accept the change
  let timeout = setTimeout(() => {
    callback(null);
  }, 2000);

  // await a response
  function onMessage(msg) {
    if (msg.type === 'change-accepted') {
      clearTimeout(timeout);

      // wait a further 10 seconds for the plugin to apply the change
      timeout = setTimeout(() => {
        callback(null);
      }, 10000);

      return KEEP_LISTENING;
    }
    if (msg.time === 'new-session-data') {
      clearTimeout(timeout);
      callback(msg.newSessionCode);
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
}
