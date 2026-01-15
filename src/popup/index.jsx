import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider, Stack, Button, Group } from '@mantine/core';
import '@mantine/core/styles.css';
import { ComicList } from '../components/ComicList';

function App() {
  const toggleSidePanel = async () => {
    try {
      const window = await chrome.windows.getCurrent();
      await chrome.sidePanel.open({ windowId: window.id });
    } catch (error) {
      console.error('Failed to open side panel:', error);
    }
  };

  return (
    <MantineProvider defaultColorScheme="light">
      <Stack p="md" w={400} h={500}>
        <Group justify="space-between">
          <Button variant="light" size="xs" onClick={toggleSidePanel}>
            Open Side Panel
          </Button>
        </Group>
        <ComicList height={400} />
      </Stack>
    </MantineProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
