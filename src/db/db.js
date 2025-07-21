const DB_NAME = 'todoAppDB';
const DB_VERSION = 1;
const STORE_NAME = 'tasks';

export async function openDB() {
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

export async function addTask(task) {
    const db = await openDB();
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
}


export async function getTasksByFilter(filter) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = function () {
            let tasks = request.result || [];
            if (filter.completion) {
                tasks = tasks.filter(task =>
                    filter.completion === 'Completed' ? task.completed : !task.completed
                );
            }
            if (filter.group) {
                tasks = tasks.filter(task => task.group === filter.group);
            }
            if (filter.priority) {
                tasks = tasks.filter(task => task.priority === filter.priority);
            }
            if(filter.dueDate) {
                tasks = tasks.filter(task => task.dueDate === filter.dueDate);
            }
            resolve(tasks);
        };

        request.onerror = function (event) {
            reject('Error fetching tasks:', event.target.error);
        };
    });
}

export async function updateTaskCompletion(id, completed) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const getReq = store.get(id);
        getReq.onsuccess = function () {
            const task = getReq.result;
            if (task) {
                task.completed = completed;
                const putReq = store.put(task);
                putReq.onsuccess = () => resolve();
                putReq.onerror = (e) => reject(e);
            } else {
                reject('Task not found');
            }
        };
        getReq.onerror = (e) => reject(e);
    });
}

export async function updateTask(task) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const putReq = store.put(task);
        putReq.onsuccess = () => resolve();
        putReq.onerror = (e) => reject(e);
    });
}


export async function deleteTask(id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = (e) => reject(e);
    });
}