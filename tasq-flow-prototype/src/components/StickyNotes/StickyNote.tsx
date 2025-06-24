import React from 'react';
import {
  Paper,
  IconButton,
  TextField,
  Box,
  Typography,
  Menu,
  MenuItem,
} from '@mui/material';

import {
  Close as CloseIcon,
  MoreVert as MoreVertIcon,
  Minimize as MinimizeIcon,
  Fullscreen as FullscreenIcon,
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import type { StickyNote as StickyNoteType } from '../../types/stickyNote';

interface StickyNoteProps {
  note: StickyNoteType;
  onUpdate: (note: StickyNoteType) => void;
  onDelete: (id: string) => void;
  onBringToFront: (id: string) => void;
}

export const StickyNote: React.FC<StickyNoteProps> = ({
  note,
  onUpdate,
  onDelete,
  onBringToFront,
}) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
  const [isEditing, setIsEditing] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMouseDown = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget || (event.target as HTMLElement).tagName === 'DIV') {
      setIsDragging(true);
      setDragStart({
        x: event.clientX - note.position.x,
        y: event.clientY - note.position.y,
      });
      onBringToFront(note.id);
    }
  };

  const handleMouseMove = React.useCallback((event: MouseEvent) => {
    if (isDragging) {
      const newPosition = {
        x: event.clientX - dragStart.x,
        y: event.clientY - dragStart.y,
      };
      
      onUpdate({
        ...note,
        position: newPosition,
      });
    }
  }, [isDragging, dragStart, note, onUpdate]);

  const handleMouseUp = React.useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleContentChange = (field: 'title' | 'content', value: string) => {
    onUpdate({
      ...note,
      [field]: value,
      updatedAt: new Date(),
    });
  };

  const handleColorChange = (color: string) => {
    onUpdate({
      ...note,
      color,
      updatedAt: new Date(),
    });
    setAnchorEl(null);
  };

  const toggleMinimize = () => {
    onUpdate({
      ...note,
      isMinimized: !note.isMinimized,
    });
  };

  const stickyColors = [
    '#FFE082', // 黄色
    '#FFAB91', // オレンジ
    '#F8BBD9', // ピンク
    '#E1BEE7', // 紫
    '#B39DDB', // 薄紫
    '#90CAF9', // 青
    '#81C784', // 緑
    '#A5D6A7', // 薄緑
  ];

  return (
    <Paper
      sx={{
        position: 'absolute',
        left: note.position.x,
        top: note.position.y,
        width: note.size.width,
        height: note.isMinimized ? 40 : note.size.height,
        backgroundColor: alpha(note.color, 0.9),
        backdropFilter: 'blur(10px)',
        border: '1px solid',
        borderColor: alpha(note.color, 0.5),
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: note.zIndex,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s ease',
        '&:hover': {
          boxShadow: 6,
        },
      }}
      onMouseDown={handleMouseDown}
      elevation={3}
    >
      {/* ヘッダー */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 1,
          minHeight: 40,
          borderBottom: note.isMinimized ? 'none' : '1px solid',
          borderColor: alpha(note.color, 0.3),
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontWeight: 'bold',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1,
          }}
        >
          {note.title || '無題'}
        </Typography>
        
        <Box sx={{ display: 'flex' }}>
          <IconButton size="small" onClick={toggleMinimize}>
            {note.isMinimized ? <FullscreenIcon fontSize="small" /> : <MinimizeIcon fontSize="small" />}
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onDelete(note.id)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* コンテンツ */}
      {!note.isMinimized && (
        <Box sx={{ flex: 1, p: 1, display: 'flex', flexDirection: 'column' }}>
          <TextField
            fullWidth
            variant="standard"
            placeholder="タイトル"
            value={note.title}
            onChange={(e) => handleContentChange('title', e.target.value)}
            InputProps={{
              disableUnderline: true,
              sx: { fontSize: '0.875rem', fontWeight: 'bold' },
            }}
            onFocus={() => setIsEditing(true)}
            onBlur={() => setIsEditing(false)}
            sx={{ mb: 1 }}
          />
          
          <TextField
            fullWidth
            multiline
            variant="standard"
            placeholder="メモを入力..."
            value={note.content}
            onChange={(e) => handleContentChange('content', e.target.value)}
            InputProps={{
              disableUnderline: true,
              sx: { fontSize: '0.75rem' },
            }}
            onFocus={() => setIsEditing(true)}
            onBlur={() => setIsEditing(false)}
            sx={{ flex: 1 }}
          />
        </Box>
      )}

      {/* メニュー */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => setAnchorEl(null)}>
          <Typography variant="caption">色を変更</Typography>
        </MenuItem>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, p: 1, maxWidth: 120 }}>
          {stickyColors.map((color) => (
            <Box
              key={color}
              sx={{
                width: 20,
                height: 20,
                backgroundColor: color,
                borderRadius: '50%',
                cursor: 'pointer',
                border: note.color === color ? '2px solid black' : '1px solid gray',
              }}
              onClick={() => handleColorChange(color)}
            />
          ))}
        </Box>
      </Menu>
    </Paper>
  );
};