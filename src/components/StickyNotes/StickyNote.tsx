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
  const [_isEditing, setIsEditing] = React.useState(false);
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
        backgroundColor: alpha(note.color, 0.25),
        backdropFilter: 'blur(16px) saturate(160%)',
        border: '1px solid',
        borderColor: alpha('#ffffff', 0.2),
        boxShadow: `
          0 8px 32px 0 ${alpha(note.color, 0.25)},
          inset 0 1px 0 0 ${alpha('#ffffff', 0.3)},
          inset 0 -1px 0 0 ${alpha('#000000', 0.1)}
        `,
        background: `
          linear-gradient(135deg, 
            ${alpha(note.color, 0.2)} 0%, 
            ${alpha(note.color, 0.1)} 50%, 
            ${alpha(note.color, 0.05)} 100%
          ),
          linear-gradient(45deg, 
            ${alpha('#ffffff', 0.1)} 0%, 
            transparent 50%, 
            ${alpha('#ffffff', 0.05)} 100%
          )
        `,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: `linear-gradient(90deg, 
            transparent 0%, 
            ${alpha('#ffffff', 0.4)} 50%, 
            transparent 100%
          )`,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '1px',
          bottom: 0,
          background: `linear-gradient(180deg, 
            transparent 0%, 
            ${alpha('#ffffff', 0.3)} 50%, 
            transparent 100%
          )`,
        },
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: note.zIndex,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'background-color 0.2s ease, backdrop-filter 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease',
        willChange: 'background-color, backdrop-filter, transform, box-shadow',
        '&:hover': {
          transform: 'translateY(-2px)',
          backgroundColor: alpha(note.color, 0.15),
          backdropFilter: 'blur(20px) saturate(180%)',
          boxShadow: `
            0 12px 40px 0 ${alpha(note.color, 0.35)},
            inset 0 1px 0 0 ${alpha('#ffffff', 0.4)},
            inset 0 -1px 0 0 ${alpha('#000000', 0.15)}
          `,
        },
        '&:active': {
          transform: 'translateY(0px)',
          transition: 'all 0.1s ease',
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
          borderColor: alpha('#ffffff', 0.15),
          background: `linear-gradient(135deg, 
            ${alpha('#ffffff', 0.15)} 0%, 
            ${alpha('#ffffff', 0.05)} 100%
          )`,
          backdropFilter: 'blur(10px)',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: `linear-gradient(90deg, 
              transparent 0%, 
              ${alpha('#ffffff', 0.3)} 50%, 
              transparent 100%
            )`,
          },
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
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: `
              0 8px 32px 0 rgba(0, 0, 0, 0.15),
              inset 0 1px 0 0 rgba(255, 255, 255, 0.3)
            `,
            '& .MuiMenuItem-root': {
              borderRadius: 1,
              margin: '2px 4px',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
              },
            },
          },
        }}
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
                backgroundColor: alpha(color, 0.3),
                backdropFilter: 'blur(8px)',
                borderRadius: '50%',
                cursor: 'pointer',
                border: note.color === color ? 
                  `2px solid ${alpha('#ffffff', 0.8)}` : 
                  `1px solid ${alpha('#ffffff', 0.3)}`,
                boxShadow: `
                  0 2px 8px 0 ${alpha(color, 0.3)},
                  inset 0 1px 0 0 ${alpha('#ffffff', 0.3)}
                `,
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.1)',
                  backgroundColor: alpha(color, 0.5),
                  boxShadow: `
                    0 4px 12px 0 ${alpha(color, 0.4)},
                    inset 0 1px 0 0 ${alpha('#ffffff', 0.4)}
                  `,
                },
              }}
              onClick={() => handleColorChange(color)}
            />
          ))}
        </Box>
      </Menu>
    </Paper>
  );
};