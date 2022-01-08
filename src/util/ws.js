import JSEncrypt from 'jsencrypt';
import sha256 from 'crypto-js/sha256';

const uuid = require('uuid/v4');

const KEEP_LISTENING = true;
const STOP_LISTENING = false;

export function socketConnect(url, pluginPublicKey, connectCallback) {
  const socket = new WebSocket(url);
  const keys = new JSEncrypt({
    default_key_size: '4096',
  });
  const publicKey = keys.getPublicKeyB64();

  const socketInterface = {
    socket,
    sendRaw: (msg) => {
      socket.send(JSON.stringify(msg));
    },
    send: (msg) => {
      const encoded = JSON.stringify(msg);
      const signature = keys.sign(encoded, sha256, 'sha256');
      socket.send(JSON.stringify({ type: 'msg', msg: encoded, signature }));
    },
    listeners: [],
  };

  socket.onopen = () => {
    const nonce = uuid();

    function onMessage(msg) {
      if (msg.type === 'hello-reply' && msg.nonce === nonce) {
        if (msg.accepted) {
          // yay, we're connected and communicating with the plugin
          // run the connect callback to store the socket in the vuex store
          connectCallback({ socket: socketInterface });
        } else {
          // this is a secondary session - disconnect.
          socket.close();
        }
        return STOP_LISTENING;
      }
      return KEEP_LISTENING;
    }

    // add a listener to await a reply
    socketInterface.listeners.push(onMessage);

    // send our public key once the socket is connected
    socketInterface.sendRaw({
      type: 'hello',
      publicKey,
      auth: 'todo-token', // todo: parse the token from the url & send it here
      nonce,
    });
  };

  const pluginKeys = new JSEncrypt();
  pluginKeys.setPublicKey(pluginPublicKey);

  socket.onmessage = (event) => {
    const frame = JSON.parse(event.data);
    if (frame.type !== 'msg') {
      return;
    }

    const { msg: innerMsg, signature } = frame;
    if (!innerMsg || !signature) {
      return;
    }

    if (!pluginKeys.verify(innerMsg, signature, sha256)) {
      return;
    }

    const msg = JSON.parse(innerMsg);
    socketInterface.listeners = socketInterface.listeners.filter(listener => listener(msg));
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
