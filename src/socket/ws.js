import { decode, encode } from 'base64-arraybuffer';
import { proxy, wrap } from 'comlink';

import Worker from 'worker-loader!./worker';
import {
  addSigningKey,
  deleteSigningKey,
  loadSigningKey,
  updateSigningKey,
} from './key_store';

/* eslint-disable no-use-before-define */

const LEGACY_KEY_VARIABLES = [
  'editor-public-key',
  'editor-private-key',
  'editor-public-key-v2',
  'editor-private-key-v2',
];

export async function socketConnect(protocolVersion, channelId, sessionId, pluginPublicKey, callbacks) {
  const cryptoHelper = new CryptoHelper(protocolVersion);

  // Load or create the editor keypair. Legacy localStorage keys are never reused.
  const keys = await cryptoHelper.getOrCreateKeys();

  // decode and import the plugin public key
  const pluginKey = await cryptoHelper.importKey('spki', pluginPublicKey, ['verify']);

  const { userAgent } = window.navigator;
  const { href } = window.location;
  const socket = wrap(new Worker());
  await socket.socketConnect(channelId, sessionId, cryptoHelper.signVerifyAlgorithm, keys, pluginKey, userAgent, href, proxy({
    connect: proxy(() => {
      cryptoHelper.markTrusted().catch(error => {
        console.warn('Unable to persist editor key state', error);
      });
      callbacks.connect({ socket });
    }),
    trust: proxy((nonce) => {
      callbacks.trust({
        nonce,
        keyStorageUpgrade: keys.migrationPending,
        keyStorageUnavailable: !keys.persistent,
      });
    }),
    trusted: proxy(() => {
      cryptoHelper.markTrusted().catch(error => {
        console.warn('Unable to persist editor key state', error);
      });
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
    this.protocolVersion = protocolVersion;

    if (protocolVersion === 1 ) {
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

  hasLegacyKeys() {
    try {
      return LEGACY_KEY_VARIABLES.some(variable => localStorage.getItem(variable) !== null);
    } catch (error) {
      console.warn('Unable to inspect legacy editor keys', error);
      return false;
    }
  }

  clearLegacyKeys() {
    LEGACY_KEY_VARIABLES.forEach(variable => localStorage.removeItem(variable));

    if (LEGACY_KEY_VARIABLES.some(variable => localStorage.getItem(variable) !== null)) {
      throw new Error('Unable to remove legacy editor keys');
    }
  }

  importKey(format, encoded, keyUsages) {
    return crypto.subtle.importKey(format, decode(encoded), this.importAlgorithm, false, keyUsages);
  }

  async exportKey(format, key) {
    const exported = await crypto.subtle.exportKey(format, key);
    return encode(exported);
  }

  async generateKeys() {
    const { publicKey, privateKey } = await crypto.subtle.generateKey(
      this.generateAlgorithm,
      false,
      ['sign'],
    );

    const encodedPublicKey = await this.exportKey('spki', publicKey);

    return {
      publicKey,
      privateKey,
      encodedPublicKey,
    };
  }

  keyRecord(keys, migrationPending) {
    return {
      publicKey: keys.publicKey,
      privateKey: keys.privateKey,
      encodedPublicKey: keys.encodedPublicKey,
      migrationPending,
      createdAt: Date.now(),
    };
  }

  keysFromRecord(record) {
    if (
      !record
      || !record.publicKey
      || !record.privateKey
      || !record.encodedPublicKey
      || record.privateKey.extractable !== false
    ) {
      return null;
    }

    return {
      publicKey: record.publicKey,
      privateKey: record.privateKey,
      encodedPublicKey: record.encodedPublicKey,
      migrationPending: Boolean(record.migrationPending),
      persistent: true,
    };
  }

  async getOrCreateKeys() {
    let storedRecord = null;

    try {
      storedRecord = await loadSigningKey(this.protocolVersion);
    } catch (error) {
      console.warn('Unable to load editor key from IndexedDB', error);
    }

    const storedKeys = this.keysFromRecord(storedRecord);
    if (storedKeys) {
      this.clearLegacyKeys();
      return storedKeys;
    }

    if (storedRecord) {
      try {
        await deleteSigningKey(this.protocolVersion);
      } catch (error) {
        console.warn('Unable to remove invalid editor key record', error);
      }
    }

    const hadLegacyKeys = this.hasLegacyKeys();
    let keys;

    try {
      keys = await this.generateKeys();
      const record = this.keyRecord(keys, hadLegacyKeys);

      try {
        await addSigningKey(this.protocolVersion, record);
      } catch (error) {
        if (error && error.name === 'ConstraintError') {
          const concurrentRecord = await loadSigningKey(this.protocolVersion);
          const concurrentKeys = this.keysFromRecord(concurrentRecord);
          if (!concurrentKeys) {
            throw error;
          }
          keys = concurrentKeys;
        } else {
          throw error;
        }
      }

      this.clearLegacyKeys();

      return {
        ...keys,
        migrationPending: keys.migrationPending || hadLegacyKeys,
        persistent: true,
      };
    } catch (error) {
      console.warn('Unable to persist editor key in IndexedDB', error);

      if (!keys) {
        keys = await this.generateKeys();
      }

      this.clearLegacyKeys();

      return {
        ...keys,
        migrationPending: hadLegacyKeys,
        persistent: false,
      };
    }
  }

  async markTrusted() {
    const record = await loadSigningKey(this.protocolVersion);
    if (!record || !record.migrationPending) {
      return;
    }

    await updateSigningKey(this.protocolVersion, {
      ...record,
      migrationPending: false,
    });
  }
}
