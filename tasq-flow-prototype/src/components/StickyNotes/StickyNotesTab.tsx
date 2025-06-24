import React from 'react';
import {
  Box,
  Fab,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
} from '@mui/material';

import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { StickyNote } from './StickyNote';
import type { StickyNote as StickyNoteType } from '../../types/stickyNote';

const initialNotes: StickyNoteType[] = [
  {
    id: '1',
    title: 'プロジェクト進捗',
    content: '要件定義が完了。次は設計フェーズに移行する予定。',
    color: '#FFE082',
    position: { x: 100, y: 100 },
    size: { width: 250, height: 200 },
    createdBy: '田中太郎',
    createdAt: new Date(),
    updatedAt: new Date(),
    isMinimized: false,
    zIndex: 1,
  },
  {
    id: '2',
    title: 'レビュー依頼',
    content: 'UI設計書のレビューをお願いします。締切は金曜日まで。',
    color: '#FFAB91',
    position: { x: 400, y: 150 },
    size: { width: 250, height: 150 },
    createdBy: '佐藤花子',
    createdAt: new Date(),
    updatedAt: new Date(),
    isMinimized: false,
    zIndex: 2,
  },
  {
    id: '3',
    title: 'バグ報告',
    content: 'ログイン機能で問題発生中。調査が必要。',
    color: '#F8BBD9',
    position: { x: 700, y: 200 },
    size: { width: 200, height: 120 },
    createdBy: '鈴木次郎',
    createdAt: new Date(),
    updatedAt: new Date(),
    isMinimized: true,
    zIndex: 3,
  },
];

export const StickyNotesTab: React.FC = () => {
  const [notes, setNotes] = React.useState<StickyNoteType[]>(initialNotes);
  const [showNotesList, setShowNotesList] = React.useState(false);
  const [maxZIndex, setMaxZIndex] = React.useState(3);

  const createNewNote = () => {
    const newNote: StickyNoteType = {
      id: Date.now().toString(),
      title: '',
      content: '',
      color: '#FFE082',
      position: { x: 50 + Math.random() * 200, y: 50 + Math.random() * 200 },
      size: { width: 250, height: 200 },
      createdBy: '現在のユーザー',
      createdAt: new Date(),
      updatedAt: new Date(),
      isMinimized: false,
      zIndex: maxZIndex + 1,
    };

    setNotes(prev => [...prev, newNote]);
    setMaxZIndex(prev => prev + 1);
  };

  const updateNote = (updatedNote: StickyNoteType) => {
    setNotes(prev => prev.map(note => 
      note.id === updatedNote.id ? updatedNote : note
    ));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const bringToFront = (id: string) => {
    const newZIndex = maxZIndex + 1;
    setMaxZIndex(newZIndex);
    setNotes(prev => prev.map(note =>
      note.id === id ? { ...note, zIndex: newZIndex } : note
    ));
  };

  const toggleNoteVisibility = (id: string) => {
    setNotes(prev => prev.map(note =>
      note.id === id ? { ...note, isMinimized: !note.isMinimized } : note
    ));
  };

  return (
    <Box sx={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
      {/* 付箋表示エリア */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(45deg, #f5f5f5 25%, transparent 25%), linear-gradient(-45deg, #f5f5f5 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f5f5f5 75%), linear-gradient(-45deg, transparent 75%, #f5f5f5 75%)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
        }}
      >
        {notes.map(note => (
          <StickyNote
            key={note.id}
            note={note}
            onUpdate={updateNote}
            onDelete={deleteNote}
            onBringToFront={bringToFront}
          />
        ))}
      </Box>

      {/* 付箋一覧サイドパネル */}
      {showNotesList && (
        <Paper
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 300,
            height: '100%',
            p: 2,
            zIndex: 1000,
            boxShadow: 3,
          }}
        >
          <Typography variant="h6" gutterBottom>
            付箋一覧
          </Typography>
          <List dense>
            {notes.map(note => (
              <ListItem key={note.id}>
                <ListItemText
                  primary={note.title || '無題'}
                  secondary={
                    <Box>
                      <Typography variant="caption" display="block">
                        作成者: {note.createdBy}
                      </Typography>
                      <Typography variant="caption" display="block">
                        {note.content.substring(0, 50)}...
                      </Typography>
                      <Chip
                        label={note.isMinimized ? '最小化' : '表示中'}
                        size="small"
                        color={note.isMinimized ? 'default' : 'primary'}
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    size="small"
                    onClick={() => toggleNoteVisibility(note.id)}
                  >
                    {note.isMinimized ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => deleteNote(note.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* FAB */}
      <Box sx={{ position: 'fixed', bottom: 16, right: 16, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Fab
          color="primary"
          aria-label="add sticky note"
          onClick={createNewNote}
          size="medium"
        >
          <AddIcon />
        </Fab>
        <Fab
          color="secondary"
          aria-label="toggle notes list"
          onClick={() => setShowNotesList(!showNotesList)}
          size="small"
        >
          <VisibilityIcon />
        </Fab>
      </Box>
    </Box>
  );
};