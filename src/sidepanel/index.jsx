import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { ComicList } from '../components/ComicList';

function App() {
  return (
    <MantineProvider defaultColorScheme="light">
      <div style={{ padding: '16px', height: '100vh', boxSizing: 'border-border-box' }}>
        <ComicList height="calc(100vh - 80px)" />
      </div>
    </MantineProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
