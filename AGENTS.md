# Agent Guidelines: Comic Track

This document provides essential information for autonomous agents working on the Comic Track Chrome Extension.

## 🛠 Build & Development

This project uses **React** and **Mantine** with a **Vite** build pipeline.

### Build Commands
- `npm run dev`: Start Vite development server.
- `npm run build`: Build the extension into the `/dist` directory.

### Development Workflow
1. Run `npm run build`.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode**.
4. Click **Load unpacked** and select the `/dist` directory.
5. To apply changes:
   - Run `npm run build`.
   - **Background Scripts/Manifest:** Click the refresh icon on the extension card in `chrome://extensions/`.
   - **Popup:** Close and reopen the popup.
   - **Content Scripts:** Refresh the target webpage.

### Testing
There are currently no automated tests. Manual verification in Chrome is required.
- **Inspect Popup:** Right-click the extension icon and select "Inspect popup".
- **Inspect Background Worker:** Click the "service worker" link in `chrome://extensions/`.
- **Inspect Content Scripts:** Open DevTools on a webpage where the script is injected.

## 📝 Code Style & Conventions

### JavaScript/React
- **Version:** ES6+ with React 19.
- **Components:** Functional components using Hooks.
- **UI Framework:** [Mantine v8](https://mantine.dev/). Use Mantine components for layout and UI elements.
- **Naming:** 
  - Components: `PascalCase`.
  - Variables and functions: `camelCase`.
  - Constants: `UPPER_SNAKE_CASE`.
- **Asynchronous Operations:** 
  - Use `async/await` for Chrome APIs.
  - Always handle potential errors in async calls.

### Manifest V3
- The source manifest is located at `src/manifest.json`.
- The build process copies this to `dist/manifest.json`.
- Maintain strict Manifest V3 compliance.

### Styling
- Primary styling via **Mantine** themes and system props.
- Global styles are imported in `src/popup/index.jsx`.

## 📁 Project Structure
- `src/manifest.json`: Extension configuration.
- `src/background/`: Service worker logic.
- `src/content/`: Content scripts and parsing logic.
- `src/popup/`: React-based popup UI.
- `dist/`: Compiled extension output.
- `samples/`: HTML snippets and examples of target pages for parser verification.

## 🔍 Scraping & Parsing

### Target Sites
- **ComicLink:** Primary target. Focus on `/auctions/preview.asp`.
  - Selector: `#auctionData table table p b a`
  - Data points: `itemId`, `title`, `link`, `grade`, `notes`, `ended`, `endTime`, `currentPrice`.

### Parser Convention
- Parsing logic must be isolated in `src/content/parser.js`.
- Functions should be pure where possible, taking DOM elements or HTML strings as input.
- Use the `samples/` directory to store real-world HTML examples for testing the parser.

## 🤖 AI Instructions
- Always run `npm run build` after making changes to verify the build pipeline.
- Ensure all new UI elements use Mantine components to maintain consistency.
- When adding new files, update `vite.config.js` if they need to be entry points.
- Prioritize security and performance: avoid `dangerouslySetInnerHTML`, use state management for UI updates.
