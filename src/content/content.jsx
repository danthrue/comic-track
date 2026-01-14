import React from 'react';
import ReactDOM from 'react-dom/client';
import { scrapePage } from './parser';
import { StarToggle } from './StarToggle';
import { saveComic } from './db';

console.log('Comic Track content script loaded (Vite)');

async function injectStarIcons(comics) {
  for (const comic of comics) {
    // Save to IndexedDB
    try {
      await saveComic(comic);
    } catch (err) {
      console.error('Failed to save comic to IDB:', err);
    }

    if (comic.startTimeElem && comic.itemId) {
      // Create a container for the React component
      const container = document.createElement('span');
      container.id = `comic-track-star-${comic.itemId}`;
      comic.startTimeElem.appendChild(container);

      // Mount the StarToggle component
      const root = ReactDOM.createRoot(container);
      root.render(<StarToggle itemId={comic.itemId} />);
    }
  }
}

function init() {
  const comics = scrapePage();
  if (comics.length > 0) {
    console.log(`Found ${comics.length} comic elements`);
    injectStarIcons(comics);
  }
}

if (document.readyState === 'complete') {
  init();
} else {
  window.addEventListener('load', init);
}
