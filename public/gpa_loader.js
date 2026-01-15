(async () => {
  const src = chrome.runtime.getURL('gpa.js');
  await import(src);
})();
