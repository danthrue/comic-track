import React, { useEffect, useState } from 'react';
import { Text, Stack, Card, Group, Badge, ScrollArea, Anchor, TextInput, NumberInput } from '@mantine/core';
import { getSelectedComics, updateComicField } from '../content/db';
import { IconSearch } from '@tabler/icons-react';
import { useDebouncedCallback } from '@mantine/hooks';

export function ComicList({ height = 400 }) {
  const [selectedComics, setSelectedComics] = useState([]);
  const [search, setSearch] = useState('');

  const loadComics = async (query = '') => {
    try {
      const comics = await getSelectedComics(query);
      setSelectedComics(comics);
    } catch (err) {
      console.error('Failed to load selected comics:', err);
    }
  };

  useEffect(() => {
    loadComics(search);
    
    const listener = (message) => {
      if (message.type === 'TOGGLE_SELECTED' || message.type === 'SAVE_COMIC') {
        loadComics(search);
      }
    };
    chrome.runtime.onMessage.addListener(listener);
    return () => chrome.runtime.onMessage.removeListener(listener);
  }, [search]);

  const handleExpectedValueChange = (itemId, value) => {
    // Update local state immediately for responsiveness
    setSelectedComics(prev => prev.map(c => 
      c.itemId === itemId ? { ...c, expectedValue: value } : c
    ));
    // Persist to DB
    debouncedUpdate(itemId, value);
  };

  const debouncedUpdate = useDebouncedCallback(async (itemId, value) => {
    await updateComicField(itemId, 'expectedValue', value);
  }, 500);

  return (
    <Stack gap="md" h="100%">
      <Text size="xl" fw={700}>Tracked Auctions</Text>
      
      <TextInput
        placeholder="Filter by title..."
        leftSection={<IconSearch size={16} />}
        value={search}
        onChange={(event) => setSearch(event.currentTarget.value)}
      />

      {selectedComics.length === 0 ? (
        <Text size="sm" c="dimmed">
          {search === '' 
            ? "No comics tracked yet. Star some on ComicLink!" 
            : "No comics match your search."}
        </Text>
      ) : (
        <ScrollArea h={height} offsetScrollbars>
          <Stack gap="xs">
            {selectedComics.map((comic) => (
              <Card key={comic.itemId} withBorder padding="sm" radius="md">
                <Stack gap={4}>
                  <Group justify="space-between" align="flex-start" wrap="nowrap">
                    <Group gap={4} wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
                      <Anchor href={comic.link} target="_blank" fw={600} size="sm" lineClamp={1}>
                        {comic.title}
                      </Anchor>
                      {comic.year && (
                        <Text size="xs" c="dimmed" shrink={0}>
                          ({comic.year})
                        </Text>
                      )}
                    </Group>
                    <Anchor href={`https://comics.gpanalysis.com/analyse-prices?_ct_q=${encodeURIComponent(comic.title)}`} target="_blank" shrink={0}>
                      <img 
                        src={chrome.runtime.getURL('assets/gpa-logo.svg')} 
                        alt="GPA" 
                        style={{ height: '14px', display: 'block' }} 
                      />
                    </Anchor>
                  </Group>
                  
                  <Group justify="space-between">
                    <Badge color="blue" variant="light">
                      {comic.grade?.provider} {comic.grade?.grade}
                    </Badge>
                    <Text fw={700} size="sm" c="green">
                      {comic.currentPrice}
                    </Text>
                  </Group>
                  
                  <Group justify="space-between" align="center" mt={4}>
                    <Text size="xs" c="dimmed">
                      Ends: {comic.endTime}
                    </Text>
                    <NumberInput
                      placeholder="Expected $"
                      prefix="$ "
                      size="xs"
                      hideControls
                      styles={{ 
                        input: { width: '100px', textAlign: 'right' },
                        wrapper: { marginBottom: 0 }
                      }}
                      value={comic.expectedValue || ''}
                      onChange={(val) => handleExpectedValueChange(comic.itemId, val)}
                      thousandSeparator=","
                      decimalScale={2}
                    />
                  </Group>
                </Stack>
              </Card>
            ))}
          </Stack>
        </ScrollArea>
      )}
    </Stack>
  );
}
