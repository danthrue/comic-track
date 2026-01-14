import { scrapePage } from './parser';

console.log('Comic Track content script loaded (Vite)');

function init() {
  const comics = scrapePage();
  if (comics.length > 0) {
    console.log(`Found ${comics.length} comic elements`);
    comics.forEach(comic => console.log('Scraped Comic:', comic));
  }
}

if (document.readyState === 'complete') {
  init();
} else {
  window.addEventListener('load', init);
}
