export function saveComic(comic) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: 'SAVE_COMIC', comic }, resolve);
  });
}

export function toggleSelected(itemId) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: 'TOGGLE_SELECTED', itemId }, resolve);
  });
}

export function isSelected(itemId) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: 'IS_SELECTED', itemId }, (response) => {
      resolve(response?.selected || false);
    });
  });
}

export function getSelectedComics(query = '') {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: 'GET_SELECTED_COMICS', query }, (response) => {
      resolve(response?.comics || []);
    });
  });
}

export function updateComicField(itemId, field, value) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: 'UPDATE_COMIC_FIELD', itemId, field, value }, resolve);
  });
}
