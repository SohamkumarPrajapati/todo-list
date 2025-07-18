const DB_NAME = 'todoAppDB';
const DB_VERSION = 1;
const STORE_NAME = 'tasks';

export function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, {
                    keyPath: 'id',
                    autoIncrement: true
                });
                store.createIndex('dueDate', 'dueDate', { unique: false });
            }
        };

        request.onsuccess = function (event) {
            resolve(event.target.result);
        };

        request.onerror = function (event) {
            reject('Error opening IndexedDB:', event.target.error);
        };
    });
}

export function addTask(task) {
    return openDB().then(db => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.add(task);

            request.onsuccess = function () {
                resolve(request.result); // the auto-generated task ID
            };

            request.onerror = function (event) {
                reject('Error adding task:', event.target.error);
            };
        });
    });
}
