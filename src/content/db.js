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

export function getSelectedComics() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: 'GET_SELECTED_COMICS' }, (response) => {
      resolve(response?.comics || []);
    });
  });
}
