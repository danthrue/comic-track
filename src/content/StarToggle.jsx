import React, { useState, useEffect } from 'react';
import { IconStar, IconStarFilled } from '@tabler/icons-react';
import { isSelected, toggleSelected } from './db';

export function StarToggle({ itemId }) {
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    async function checkStatus() {
      const status = await isSelected(itemId);
      setSelected(status);
    }
    checkStatus();
  }, [itemId]);

  const onToggle = async () => {
    try {
      await toggleSelected(itemId);
      setSelected(!selected);
    } catch (err) {
      console.error('Failed to toggle selection:', err);
    }
  };

  const starStyle = {
    cursor: 'pointer',
    verticalAlign: 'middle',
    marginLeft: '5px',
    display: 'inline-flex',
    alignItems: 'center'
  };

  return (
    <span onClick={onToggle} style={starStyle} title={selected ? "Remove from tracking" : "Add to tracking"}>
      {selected ? (
        <IconStarFilled size={18} color="#fab005" />
      ) : (
        <IconStar size={18} color="#ccc" />
      )}
    </span>
  );
}
