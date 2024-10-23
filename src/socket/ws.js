import { decode, encode } from 'base64-arraybuffer';
import { proxy, wrap } from 'comlink';

import Worker from 'worker-loader!./worker';

/* eslint-disable no-use-before-define */

export async function socketConnect(protocolVersion, channelId, sessionId, pluginPublicKey, callbacks) {
  const cryptoHelper = new CryptoHelper(protocolVersion);

  // generate public/private keypair for the editor
  const keys = await cryptoHelper.loadKeys() || await cryptoHelper.generateKeys();

  // decode and import the plugin public key
  const pluginKey = await cryptoHelper.importKey('spki', pluginPublicKey, ['verify']);

  const { userAgent } = window.navigator;
  const socket = wrap(new Worker());
  await socket.socketConnect(channelId, sessionId, cryptoHelper.signVerifyAlgorithm, keys, pluginKey, userAgent, proxy({
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

class CryptoHelper {
  constructor(protocolVersion) {
    if (protocolVersion === 1 ) {
      this.publicKeyVariable = 'editor-public-key'
      this.privateKeyVariable = 'editor-private-key'
      this.importAlgorithm = {
        name: 'RSASSA-PKCS1-v1_5',
        hash: 'SHA-256',
      }
      this.generateAlgorithm = {
        name: 'RSASSA-PKCS1-v1_5',
        hash: 'SHA-256',
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
      }
      this.signVerifyAlgorithm = {
        name: 'RSASSA-PKCS1-v1_5',
      }

    } else if (protocolVersion === 2) {
      this.publicKeyVariable = 'editor-public-key-v2'
      this.privateKeyVariable = 'editor-private-key-v2'
      this.importAlgorithm = {
        name: 'ECDSA',
        namedCurve: 'P-256',
      }
      this.generateAlgorithm = {
        name: 'ECDSA',
        namedCurve: 'P-256',
      }
      this.signVerifyAlgorithm = {
        name: 'ECDSA',
        hash: 'SHA-256',
      }
    } else {
      throw new Error(`Unsupported protocol version: ${protocolVersion}`);
    }
  }

  async loadKeys() {
    const encodedPublicKey = localStorage.getItem(this.publicKeyVariable);
    const encodedPrivateKey = localStorage.getItem(this.privateKeyVariable);

    if (encodedPublicKey && encodedPrivateKey) {
      const publicKey = await this.importKey('spki', encodedPublicKey, []);
      const privateKey = await this.importKey('pkcs8', encodedPrivateKey, ['sign']);
      return {
        publicKey,
        privateKey,
        encodedPublicKey,
        encodedPrivateKey,
      };
    }

    return null;
  }

  importKey(format, encoded, keyUsages) {
    return crypto.subtle.importKey(format, decode(encoded), this.importAlgorithm, false, keyUsages);
  }

  async exportKey(format, key, storageKey) {
    const exported = await crypto.subtle.exportKey(format, key);
    const encoded = encode(exported);
    localStorage.setItem(storageKey, encoded);
    return encoded;
  }

  async generateKeys() {
    const { publicKey, privateKey } = await crypto.subtle.generateKey(this.generateAlgorithm, true, ['sign']);

    const encodedPublicKey = await this.exportKey('spki', publicKey, this.publicKeyVariable);
    const encodedPrivateKey = await this.exportKey('pkcs8', privateKey, this.privateKeyVariable);

    return {
      publicKey,
      privateKey,
      encodedPublicKey,
      encodedPrivateKey,
    };
  }
}
