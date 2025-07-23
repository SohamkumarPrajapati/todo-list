const DB_NAME = 'todoAppDB';
const DB_VERSION = 1;
const TASK_STORE = 'tasks';
const GROUP_STORE = 'groups';

export async function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(TASK_STORE)) {
                const store = db.createObjectStore(TASK_STORE, {
                    keyPath: 'id',
                    autoIncrement: true
                });
            }
            /*store the each group seperately whose object will only
             contain name property which holds the unique name to group
            */
            if (!db.objectStoreNames.contains(GROUP_STORE)) {
                const store = db.createObjectStore(GROUP_STORE, {
                    keyPath: 'name',
                });
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
        const transaction = db.transaction(TASK_STORE, 'readwrite');
        const store = transaction.objectStore(TASK_STORE);
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
        const transaction = db.transaction(TASK_STORE, 'readonly');
        const store = transaction.objectStore(TASK_STORE);
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
            if (filter.dueDate) {
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
        const transaction = db.transaction(TASK_STORE, 'readwrite');
        const store = transaction.objectStore(TASK_STORE);
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
        const transaction = db.transaction(TASK_STORE, 'readwrite');
        const store = transaction.objectStore(TASK_STORE);
        const putReq = store.put(task);
        putReq.onsuccess = () => resolve();
        putReq.onerror = (e) => reject(e);
    });
}


export async function deleteTask(id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(TASK_STORE, 'readwrite');
        const store = transaction.objectStore(TASK_STORE);
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = (e) => reject(e);
    });
}

/**
 * 
 * @param {String} groupName 
 * @returns Promise
 */
export async function addGroup(groupName) {
    if (groupName === '') {
        return;
    }
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(GROUP_STORE, 'readwrite');
        const store = transaction.objectStore(GROUP_STORE);
        // Check if group already exists
        const getReq = store.get(groupName);
        getReq.onsuccess = function () {
            if (getReq.result) {
                resolve('Group already exists');
            } else {
                const addReq = store.add({
                    name: groupName,
                    filters: {
                        completion: '',
                        priority: '',
                        dueDate: ''
                    },
                    sort: ''
                });
                addReq.onsuccess = () => resolve();
                addReq.onerror = (e) => reject(e);
            }
        };
        getReq.onerror = (e) => reject(e);
    });
}

/**
 * 
 * @returns array of strings where each string is a name of the group
 */
export async function getAllGroups() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(GROUP_STORE, 'readonly');
        const store = transaction.objectStore(GROUP_STORE);
        const request = store.getAll();

        request.onsuccess = function () {
            const groups = request.result || [];
            const groupsArray = [];

            for (let group of groups) {
                groupsArray.push(group.name);
            }

            resolve(groupsArray);
        }

        request.onerror = function (event) {
            reject('Error getting groups', event.target.error);
        }
    })
}


/**
 * gets the filter set for the group
 * @param {String} group - groupName 
 * @returns Promise
 */
export async function getFilters(group) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(GROUP_STORE, 'readonly');
        const store = transaction.objectStore(GROUP_STORE);
        const request = store.get(group);

        request.onsuccess = function () {
            if (request.result) {
                resolve(request.result.filters);
            }
            else { // rerturn empty filter if the group don't exist
                resolve({
                    completion: '',
                    priority: '',
                    dueDate: ''
                })
            }
        }

        request.onerror = function(error) {
            reject('Error getting group', event.target.error);
        }
    });
}

/**
 * sets the filters to the group
 * @param {String} groupName 
 * @param {Object} groupFilters - filter object holding filter values 
 * @returns {Promise}
 */
export async function setFilters(groupName,groupFilters) {
    const db = await openDB();
    return new Promise((resolve,reject) => {
        const transaction = db.transaction(GROUP_STORE,"readwrite");
        const store = transaction.objectStore(GROUP_STORE);
        const getRequest = store.get(groupName);

        getRequest.onsuccess = function() {
            const group = getRequest.result;
            let groupOnModifiedFilters = {
                name: group.name,
                filters: groupFilters,
                sort: group.sort,
            }

            const putRequest = store.put(groupOnModifiedFilters);
            putRequest.onsuccess = () => resolve();
            putRequest.onerror = (e) => reject(e.target.error);
        }
        getRequest.onerror = function(event) {
            reject('Error getting group',event.target.error);
        }
    });
}


/**
 * gets  the sorting applied to group
 * @param {String} groupName 
 * @returns {Promise}
 */
export async function getSorting(groupName) {
    const db = await openDB();
    return new Promise((resolve,reject) => {
        const transaction = db.transaction(GROUP_STORE,'readonly');
        const store = transaction.objectStore(GROUP_STORE);
        const request = store.get(groupName);

        request.onsuccess = function() {
            if(request.result) {
                resolve(request.result.sort);
            }
            else {
                resolve('');
            }
        }

        request.onerror = function(event) {
            reject('Error getting group', event.target.error);
        }
    });
}


/**
 * 
 * @param {String} groupName 
 * @param {String} groupSorting |-> values can be 'priority' or 'duedate'
 * @returns 
 */
export async function setSorting(groupName,groupSorting) {
    const db = await openDB();
    return new Promise((resolve,reject) => {
        const transaction = db.transaction(GROUP_STORE,'readwrite');
        const store = db.objectStore(GROUP_STORE);
        const getRequest = store.get(groupName);

        getRequest.onsuccess = function() {
            const group = getRequest.result;
            let groupOnModifiedSort = {
                name: groupName,
                filters: group.filters,
                sort: groupSorting
            };
            const putRequest = store.put(groupOnModifiedSort);
            putRequest.onsuccess = () => resolve();
            putRequest.onerror = (e) => reject(e);
        }
        getRequest.onerror = function(event) {
            reject('Error getting group', event.target.error);
        }
    });
}