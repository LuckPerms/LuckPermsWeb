import { decode, encode } from 'base64-arraybuffer';
import Bowser from 'bowser';
import { expose } from 'comlink';

const config = require('../../config');

const KEEP_LISTENING = true;
const STOP_LISTENING = false;

/* eslint-disable no-use-before-define */

let globalSocket;

class SocketInterface {
  constructor(socket, keys, pluginKey) {
    this.socket = socket;
    this.keys = keys;
    this.pluginKey = pluginKey;

    this.listeners = [];
    this.lastPing = 0;
    this.lastPong = 0;
    this.keepaliveTask = null;
  }

  /**
   * Sends a message to the socket
   * @param msg the message to send
   */
  async send(msg) {
    const encoded = JSON.stringify(msg);

    // sign the message with the editor private key
    const signature = await crypto.subtle.sign(
      'RSASSA-PKCS1-v1_5',
      this.keys.privateKey,
      new TextEncoder().encode(encoded),
    );

    // send the original message along with the signature
    this.socket.send(JSON.stringify({
      msg: encoded,
      signature: encode(signature),
    }));
  }

  /**
   * Register a listener with the socket.
   *
   * Listeners must return a boolean indicating if the
   * subscription should continue.
   *
   * @param listener the listener
   */
  registerListener(listener) {
    this.listeners.push(listener);
  }

  /**
   * Handles an incoming message from the socket.
   *
   * @param frame the message frame
   */
  async onReceive(frame) {
    const { msg: encodedMessage, signature } = frame;
    if (!encodedMessage || !signature) {
      return;
    }

    // verify that the message was sent by the plugin
    // (check it was signed with the plugin public key)
    const verified = await crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5',
      this.pluginKey,
      decode(signature),
      new TextEncoder().encode(encodedMessage),
    );

    if (!verified) {
      return;
    }

    const msg = JSON.parse(encodedMessage);

    // if verification passes, forward the inner message onto listeners
    const toRemove = [];
    this.listeners.forEach((listener, i) => {
      const resp = listener(msg);
      if (resp === STOP_LISTENING) {
        toRemove.unshift(i);
      }
    });
    toRemove.forEach(i => this.listeners.splice(i, 1));
  }
}

// eslint-disable-next-line max-len
function socketConnect(channelId, sessionId, keys, pluginKey, userAgent, callbacks) {
  console.log('[WS] Creating socket...');

  // create a websocket
  // important that no async/await occurs between here and the listener registrations
  const socket = new WebSocket(`wss://${config.bytesocks_host}/${channelId}`);
  const socketInterface = new SocketInterface(socket, keys, pluginKey);

  socket.onmessage = (event) => {
    const frame = JSON.parse(event.data);
    socketInterface.onReceive(frame);
  };

  socket.onopen = () => {
    console.log('[WS] Socket open, initialising connection...');
    initConnection(socketInterface, sessionId, keys.encodedPublicKey, userAgent, callbacks);
  };

  socket.onclose = () => {
    callbacks.close();
  };

  globalSocket = socketInterface;
}

function initConnection(socket, sessionId, encodedPublicKey, userAgent, callbacks) {
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
        callbacks.connect();
        return STOP_LISTENING;
      }

      if (msg.state === 'untrusted') {
        callbacks.trust(nonce);
        return KEEP_LISTENING;
      }

      if (msg.state === 'invalid') {
        // the session is has already been completed!
        console.log('[WS] Session data has expired, disconnecting.');
        callbacks.reused();
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
  socket.registerListener(onMessage);

  const { browser, os } = Bowser.parse(userAgent);

  // send our public key once the socket is connected
  socket.send({
    type: 'hello',
    nonce,
    sessionId,
    browser: `${browser.name} on ${os.name}`,
    publicKey: encodedPublicKey,
  });
}

function sendChangesViaSocket(bytebinCode) {
  const socket = globalSocket;

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
          console.log(`[WS] Applying new session data: ${msg.newSessionCode}`);
          return STOP_LISTENING;
        }
      }
      return KEEP_LISTENING;
    }

    // register reply listener
    socket.registerListener(onMessage);

    // send the apply change request
    socket.send({
      type: 'change-request',
      code: bytebinCode,
    });
  });
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

  socket.registerListener(onMessage);

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

expose({ socketConnect, sendChangesViaSocket });
