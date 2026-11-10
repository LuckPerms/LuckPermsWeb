const DATABASE_NAME = 'luckperms-editor';
const DATABASE_VERSION = 1;
const STORE_NAME = 'signing-keys';

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB is not available'));
      return;
    }

    const request = window.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('IndexedDB upgrade was blocked'));
  });
}

function getRecord(protocolVersion) {
  return openDatabase().then(database => new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readonly');
    const request = transaction.objectStore(STORE_NAME).get(String(protocolVersion));

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => database.close();
    transaction.onerror = () => {
      database.close();
      reject(transaction.error || request.error);
    };
  }));
}

function writeRecord(method, protocolVersion, record) {
  return openDatabase().then(database => new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite');
    const request = transaction.objectStore(STORE_NAME)[method](
      record,
      String(protocolVersion),
    );
    let requestError = null;

    request.onerror = () => {
      requestError = request.error;
    };
    transaction.oncomplete = () => {
      database.close();
      resolve();
    };
    transaction.onerror = () => {
      database.close();
      reject(transaction.error || requestError || request.error);
    };
    transaction.onabort = () => {
      database.close();
      reject(transaction.error || requestError || request.error);
    };
  }));
}

export function loadSigningKey(protocolVersion) {
  return getRecord(protocolVersion);
}

export function addSigningKey(protocolVersion, record) {
  return writeRecord('add', protocolVersion, record);
}

export function updateSigningKey(protocolVersion, record) {
  return writeRecord('put', protocolVersion, record);
}

export function deleteSigningKey(protocolVersion) {
  return openDatabase().then(database => new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite');
    transaction.objectStore(STORE_NAME).delete(String(protocolVersion));

    transaction.oncomplete = () => {
      database.close();
      resolve();
    };
    transaction.onerror = () => {
      database.close();
      reject(transaction.error);
    };
    transaction.onabort = () => {
      database.close();
      reject(transaction.error);
    };
  }));
}
