import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider, Button, Group, Text, Stack } from '@mantine/core';
import '@mantine/core/styles.css';

function App() {
  return (
    <MantineProvider defaultColorScheme="light">
      <Stack p="md" w={300}>
        <Text size="xl" fw={700}>Comic Track</Text>
        <Text size="sm">Mantine is now integrated!</Text>
        <Group grow>
          <Button variant="filled" onClick={() => console.log('Clicked')}>
            Action
          </Button>
        </Group>
      </Stack>
    </MantineProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
