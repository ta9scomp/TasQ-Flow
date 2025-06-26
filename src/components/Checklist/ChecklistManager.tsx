import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  TextField,
  IconButton,
  Button,
  Typography,
  Menu,
  MenuItem,
} from '@mui/material';

import {
  Add as AddIcon,
  DragIndicator as DragIndicatorIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import type { ChecklistItem } from '../../types/task';

interface ChecklistManagerProps {
  checklist: ChecklistItem[];
  onChange: (checklist: ChecklistItem[]) => void;
  readOnly?: boolean;
}

export const ChecklistManager: React.FC<ChecklistManagerProps> = ({
  checklist = [],
  onChange,
  readOnly = false,
}) => {
  const [newItemText, setNewItemText] = React.useState('');
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editingText, setEditingText] = React.useState('');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedItemId, setSelectedItemId] = React.useState<string | null>(null);

  const sortedChecklist = [...checklist].sort((a, b) => a.order - b.order);

  const addItem = () => {
    if (newItemText.trim()) {
      const newItem: ChecklistItem = {
        id: Date.now().toString(),
        text: newItemText.trim(),
        completed: false,
        order: Math.max(...checklist.map(item => item.order), 0) + 1,
      };
      onChange([...checklist, newItem]);
      setNewItemText('');
    }
  };

  const toggleItem = (id: string) => {
    const updatedChecklist = checklist.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    onChange(updatedChecklist);
  };

  const deleteItem = (id: string) => {
    const updatedChecklist = checklist.filter(item => item.id !== id);
    onChange(updatedChecklist);
    setAnchorEl(null);
  };

  const startEdit = (item: ChecklistItem) => {
    setEditingId(item.id);
    setEditingText(item.text);
    setAnchorEl(null);
  };

  const saveEdit = () => {
    if (editingId && editingText.trim()) {
      const updatedChecklist = checklist.map(item =>
        item.id === editingId ? { ...item, text: editingText.trim() } : item
      );
      onChange(updatedChecklist);
    }
    setEditingId(null);
    setEditingText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  // const moveItem = (fromIndex: number, toIndex: number) => {
  //   const newChecklist = [...sortedChecklist];
  //   const [movedItem] = newChecklist.splice(fromIndex, 1);
  //   newChecklist.splice(toIndex, 0, movedItem);
  //   
  //   // 順序を再計算
  //   const updatedChecklist = newChecklist.map((item, index) => ({
  //     ...item,
  //     order: index + 1,
  //   }));
  //   onChange(updatedChecklist);
  // };

  const getProgress = () => {
    if (checklist.length === 0) return 0;
    const completed = checklist.filter(item => item.completed).length;
    return Math.round((completed / checklist.length) * 100);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, itemId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedItemId(itemId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItemId(null);
  };

  return (
    <Box>
      {/* プログレス表示 */}
      {checklist.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary">
            進捗: {checklist.filter(item => item.completed).length}/{checklist.length} ({getProgress()}%)
          </Typography>
        </Box>
      )}

      {/* チェックリスト */}
      <List dense>
        {sortedChecklist.map((item) => (
          <ListItem
            key={item.id}
            sx={{
              pl: 0,
              '&:hover .drag-handle': {
                opacity: 1,
              },
            }}
          >
            {!readOnly && (
              <ListItemIcon sx={{ minWidth: 24 }}>
                <DragIndicatorIcon
                  className="drag-handle"
                  sx={{
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    cursor: 'grab',
                    fontSize: '1rem',
                  }}
                />
              </ListItemIcon>
            )}
            
            <ListItemIcon sx={{ minWidth: 36 }}>
              <Checkbox
                checked={item.completed}
                onChange={() => toggleItem(item.id)}
                size="small"
                disabled={readOnly}
              />
            </ListItemIcon>

            <ListItemText
              sx={{ flex: 1 }}
              primary={
                editingId === item.id ? (
                  <TextField
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onBlur={saveEdit}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit();
                      if (e.key === 'Escape') cancelEdit();
                    }}
                    size="small"
                    variant="standard"
                    autoFocus
                    fullWidth
                    InputProps={{
                      disableUnderline: false,
                    }}
                  />
                ) : (
                  <Typography
                    variant="body2"
                    sx={{
                      color: item.completed ? 'text.secondary' : 'text.primary',
                      cursor: readOnly ? 'default' : 'pointer',
                    }}
                    onClick={() => !readOnly && startEdit(item)}
                  >
                    {item.text}
                  </Typography>
                )
              }
            />

            {!readOnly && editingId !== item.id && (
              <IconButton
                size="small"
                onClick={(e) => handleMenuOpen(e, item.id)}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            )}
          </ListItem>
        ))}
      </List>

      {/* 新規アイテム追加 */}
      {!readOnly && (
        <Box sx={{ mt: 1 }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <TextField
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') addItem();
              }}
              placeholder="新しいチェック項目を追加..."
              size="small"
              variant="outlined"
              fullWidth
              InputProps={{
                style: { fontSize: '0.875rem' },
              }}
            />
            <Button
              onClick={addItem}
              disabled={!newItemText.trim()}
              size="small"
              variant="contained"
              sx={{ minWidth: 'auto', px: 1 }}
            >
              <AddIcon fontSize="small" />
            </Button>
          </Box>
        </Box>
      )}

      {/* メニュー */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            const item = checklist.find(item => item.id === selectedItemId);
            if (item) startEdit(item);
          }}
        >
          編集
        </MenuItem>
        <MenuItem
          onClick={() => selectedItemId && deleteItem(selectedItemId)}
        >
          削除
        </MenuItem>
      </Menu>
    </Box>
  );
};