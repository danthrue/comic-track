# Comic Track Chrome Extension

A Chrome extension for tracking comics, built with **React 19**, **Mantine v8**, and **Vite**.

## 🚀 Features
- **Modern UI:** Built using Mantine component library.
- **Fast Development:** Powered by Vite for near-instant builds.
- **Manifest V3:** Fully compliant with the latest Chrome extension standards.

## 🛠 Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [NPM](https://www.npmjs.com/)

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Build the Extension
```bash
npm run build
```
The compiled extension will be available in the `dist/` directory.

### 3. Load into Chrome
1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** (toggle in the top right).
3. Click **Load unpacked**.
4. Select the `dist/` folder in this project directory.

## 🏗 Development Workflow

### Making Changes
1. Modify files in the `src/` directory:
   - `src/popup/`: The extension popup UI (React + Mantine).
   - `src/content/`: Content scripts that run on web pages.
   - `src/background/`: Background service worker logic.
2. Run `npm run build` to update the `dist/` folder.
3. In `chrome://extensions/`, click the **Refresh** icon on the Comic Track card.
4. For Popup changes, simply close and reopen the extension popup.

### Development Commands
- `npm run build`: Production build.
- `npm run dev`: Starts Vite dev server (useful for UI prototyping, but extension features require `npm run build`).

## 📁 Project Structure
- `src/manifest.json`: Extension configuration.
- `src/popup/`: React entry point and components.
- `src/content/`: Scripts injected into web pages.
- `src/background/`: Extension background logic.
- `public/`: Static assets and the base manifest.
- `dist/`: Compiled output (load this into Chrome).

## 📝 Code Style
- Use **Mantine** components for all UI elements.
- Follow **ES6+** syntax and React **Hooks**.
- Ensure all new files are added to `vite.config.js` if they are entry points.
