import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider, Text, Stack, Card, Group, Badge, ScrollArea, Anchor } from '@mantine/core';
import '@mantine/core/styles.css';
import { getSelectedComics } from '../content/db';

function App() {
  const [selectedComics, setSelectedComics] = useState([]);

  useEffect(() => {
    async function loadComics() {
      try {
        const comics = await getSelectedComics();
        setSelectedComics(comics);
      } catch (err) {
        console.error('Failed to load selected comics:', err);
      }
    }
    loadComics();
  }, []);

  return (
    <MantineProvider defaultColorScheme="light">
      <Stack p="md" w={400} h={500}>
        <Text size="xl" fw={700}>Tracked Auctions</Text>
        
        {selectedComics.length === 0 ? (
          <Text size="sm" c="dimmed">No comics tracked yet. Star some on ComicLink!</Text>
        ) : (
          <ScrollArea h={400} offsetScrollbars>
            <Stack gap="xs">
              {selectedComics.map((comic) => (
                <Card key={comic.itemId} withBorder padding="sm" radius="md">
                  <Stack gap={4}>
                    <Anchor href={comic.link} target="_blank" fw={600} size="sm" lineClamp={1}>
                      {comic.title}
                    </Anchor>
                    
                    <Group justify="space-between">
                      <Badge color="blue" variant="light">
                        {comic.grade?.provider} {comic.grade?.grade}
                      </Badge>
                      <Text fw={700} size="sm" c="green">
                        {comic.currentPrice}
                      </Text>
                    </Group>
                    
                    <Text size="xs" c="dimmed">
                      Ends: {comic.endTime}
                    </Text>
                  </Stack>
                </Card>
              ))}
            </Stack>
          </ScrollArea>
        )}
      </Stack>
    </MantineProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
