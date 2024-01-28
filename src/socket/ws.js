import { decode, encode } from 'base64-arraybuffer';
import { proxy, wrap } from 'comlink';

// eslint-disable-next-line import/no-webpack-loader-syntax
import Worker from 'worker-loader!./worker';

/* eslint-disable no-use-before-define */

// eslint-disable-next-line max-len,import/prefer-default-export
export async function socketConnect(channelId, sessionId, pluginPublicKey, callbacks) {
  // generate public/private keypair for the editor
  const keys = await loadKeys() || await generateKeys();

  // decode and import the plugin public key
  const pluginKey = await importKey('spki', pluginPublicKey, ['verify']);

  const { userAgent } = window.navigator;
  const socket = wrap(new Worker());
  await socket.socketConnect(channelId, sessionId, keys, pluginKey, userAgent, proxy({
    connect: proxy(() => {
      callbacks.connect({ socket });
    }),
    trust: proxy((nonce) => {
      callbacks.trust({ nonce });
    }),
    trusted: proxy(() => {
      callbacks.trusted();
    }),
    reused: proxy(() => {
      callbacks.reused();
    }),
    close: proxy(() => {
      callbacks.close();
    }),
  }));
  return socket;
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
