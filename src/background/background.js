const DB_NAME = 'ComicTrackDB';
const DB_VERSION = 1;
const COMICS_STORE = 'comics';
const SELECTED_STORE = 'selected';

export function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(COMICS_STORE)) {
        db.createObjectStore(COMICS_STORE, { keyPath: 'itemId' });
      }
      if (!db.objectStoreNames.contains(SELECTED_STORE)) {
        db.createObjectStore(SELECTED_STORE, { keyPath: 'itemId' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveComic(comic) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([COMICS_STORE], 'readwrite');
    const store = transaction.objectStore(COMICS_STORE);
    
    // Remove DOM element if present
    const { startTimeElem, ...comicData } = comic;

    const getRequest = store.get(comicData.itemId);

    getRequest.onsuccess = () => {
      const existing = getRequest.result;
      if (existing) {
        const updated = { ...existing, ...comicData };
        store.put(updated);
      } else {
        store.add(comicData);
      }
    };

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

async function toggleSelected(itemId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([SELECTED_STORE], 'readwrite');
    const store = transaction.objectStore(SELECTED_STORE);
    
    const getRequest = store.get(itemId);
    
    getRequest.onsuccess = () => {
      if (getRequest.result) {
        store.delete(itemId);
      } else {
        store.add({ itemId });
      }
    };
    
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

async function isSelected(itemId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([SELECTED_STORE], 'readonly');
    const store = transaction.objectStore(SELECTED_STORE);
    const request = store.get(itemId);
    
    request.onsuccess = () => resolve(!!request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getSelectedComics() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const selectedTx = db.transaction([SELECTED_STORE], 'readonly');
    const selectedStore = selectedTx.objectStore(SELECTED_STORE);
    const getAllSelected = selectedStore.getAll();

    getAllSelected.onsuccess = async () => {
      const selectedItems = getAllSelected.result;
      if (selectedItems.length === 0) {
        resolve([]);
        return;
      }

      const comicTx = db.transaction([COMICS_STORE], 'readonly');
      const comicStore = comicTx.objectStore(COMICS_STORE);
      
      const comics = await Promise.all(selectedItems.map(item => {
        return new Promise((res) => {
          const req = comicStore.get(item.itemId);
          req.onsuccess = () => res(req.result);
          req.onerror = () => res(null);
        });
      }));
      
      resolve(comics.filter(c => c !== null));
    };
    
    getAllSelected.onerror = () => reject(getAllSelected.error);
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SAVE_COMIC') {
    saveComic(message.comic).then(() => sendResponse({ success: true }));
    return true;
  }
  if (message.type === 'TOGGLE_SELECTED') {
    toggleSelected(message.itemId).then(() => sendResponse({ success: true }));
    return true;
  }
  if (message.type === 'IS_SELECTED') {
    isSelected(message.itemId).then((selected) => sendResponse({ selected }));
    return true;
  }
  if (message.type === 'GET_SELECTED_COMICS') {
    getSelectedComics().then((comics) => sendResponse({ comics }));
    return true;
  }
});

console.log('Comic Track background worker loaded (Vite) with DB');
