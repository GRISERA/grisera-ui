export default class IndexedDB {

    static openIndexedDB(databaseName, storeName) {
        return new Promise((resolve, reject) => {
          const request = indexedDB.open(databaseName);
      
          request.onupgradeneeded = function (event) {
            const db = event.target.result;
            db.createObjectStore(storeName, { keyPath: 'id' });
          };
      
          request.onsuccess = function (event) {
            resolve(event.target.result);
          };
      
          request.onerror = function (event) {
            reject(event.target.error);
          };
        });
      }

    static async saveFileToIndexedDB(file, key) {
        try {
          const db = await IndexedDB.openIndexedDB('recordings', 'recordings');
          const transaction = db.transaction('recordings', 'readwrite');
          const store = transaction.objectStore('recordings');
          store.put({ id: key, name: file.name, file: file });
        } catch (error) {
          console.error('Error saving file to IndexedDB:', error);
        }
      }
        
      static async readFileFromIndexedDB(key) {
        try {
          const db = await IndexedDB.openIndexedDB('recordings', 'recordings');
          const transaction = db.transaction('recordings', 'readonly');
          const store = transaction.objectStore('recordings');
          const request = store.get(key);
      
          return new Promise((resolve, reject) => {
            request.onsuccess = function (event) {
              resolve(event.target.result);
            };
      
            request.onerror = function (event) {
              reject(event.target.error);
            };
          });
        } catch (error) {
          console.error('Error reading file from IndexedDB:', error);
          return null;
        }
      }            
};