# 付箋タブ一覧の背景作成 学習ガイド

**対象**: React・CSS基礎を学んだ開発者  
**難易度**: ⭐⭐⭐☆☆（中級）  
**学習時間**: 約3-4時間

---

## 📚 このガイドで学べること

- 付箋風UIコンポーネントの設計と実装
- タブレイアウトでの美しい背景デザイン
- 実用的な付箋機能（作成、編集、削除、移動）
- ドラッグ&ドロップ機能の実装
- 付箋の色分けとカテゴリー管理
- レスポンシブ対応の付箋レイアウト

---

## 🎯 完成イメージ

```
┌─────────────────────────────────────────────────────┐
│ 🗒️ 付箋管理システム                    [+ 新規追加] │
├─────────────────────────────────────────────────────┤
│ [📋 すべて] [🔴 重要] [🟡 通常] [🟢 完了] [⚙️ 設定] │
├─────────────────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐             │
│  │ 🔴 重要  │  │ 🟡 アイデア│  │ 🟢 完了済み│             │
│  │ UI修正   │  │ 新機能検討 │  │ バグ修正   │             │
│  │ 優先度:高│  │ 明日まで   │  │ ✓ 完了    │             │
│  └─────────┘  └─────────┘  └─────────┘             │
│                                                     │
│  ┌─────────┐  ┌─────────┐                          │
│  │ 🟦 メモ  │  │ 🟣 質問   │                          │
│  │ 会議内容 │  │ 技術相談   │                          │
│  │ 2時間前  │  │ レビュー待ち│                          │
│  └─────────┘  └─────────┘                          │
└─────────────────────────────────────────────────────┘
```

---

## 🏗️ Step 1: 基本コンポーネント構造の設計

### 1.1 付箋データ型の定義

```typescript
// types/stickyNote.ts
export interface StickyNote {
  id: string;
  title: string;
  content: string;
  color: 'red' | 'yellow' | 'green' | 'blue' | 'purple' | 'orange';
  category: 'important' | 'normal' | 'completed' | 'memo' | 'question';
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  priority: 'high' | 'medium' | 'low';
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  tags: string[];
  isCompleted: boolean;
}

export interface StickyNotesFilter {
  category?: string;
  color?: string;
  priority?: string;
  searchQuery?: string;
}
```

### 1.2 付箋ストアの設計

```typescript
// stores/useStickyNotesStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StickyNote, StickyNotesFilter } from '../types/stickyNote';

interface StickyNotesState {
  notes: StickyNote[];
  selectedNoteId: string | null;
  filter: StickyNotesFilter;
  draggedNote: StickyNote | null;
  isCreateDialogOpen: boolean;
  isEditDialogOpen: boolean;
}

interface StickyNotesActions {
  // CRUD操作
  addNote: (note: Omit<StickyNote, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<StickyNote>) => void;
  deleteNote: (id: string) => void;
  
  // 選択・フィルタリング
  selectNote: (id: string | null) => void;
  setFilter: (filter: Partial<StickyNotesFilter>) => void;
  clearFilter: () => void;
  
  // ドラッグ&ドロップ
  setDraggedNote: (note: StickyNote | null) => void;
  moveNote: (id: string, newPosition: { x: number; y: number }) => void;
  
  // ダイアログ制御
  openCreateDialog: () => void;
  closeCreateDialog: () => void;
  openEditDialog: (noteId: string) => void;
  closeEditDialog: () => void;
  
  // ユーティリティ
  getFilteredNotes: () => StickyNote[];
  getNotesByCategory: (category: string) => StickyNote[];
  searchNotes: (query: string) => StickyNote[];
}

export const useStickyNotesStore = create<StickyNotesState & StickyNotesActions>()(
  persist(
    (set, get) => ({
      // 初期状態
      notes: [],
      selectedNoteId: null,
      filter: {},
      draggedNote: null,
      isCreateDialogOpen: false,
      isEditDialogOpen: false,
      
      // CRUD操作
      addNote: (noteData) => {
        const newNote: StickyNote = {
          id: `note-${Date.now()}`,
          ...noteData,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        set((state) => ({
          notes: [...state.notes, newNote]
        }));
      },
      
      updateNote: (id, updates) => {
        set((state) => ({
          notes: state.notes.map(note =>
            note.id === id
              ? { ...note, ...updates, updatedAt: new Date() }
              : note
          )
        }));
      },
      
      deleteNote: (id) => {
        set((state) => ({
          notes: state.notes.filter(note => note.id !== id),
          selectedNoteId: state.selectedNoteId === id ? null : state.selectedNoteId
        }));
      },
      
      // 選択・フィルタリング
      selectNote: (id) => set({ selectedNoteId: id }),
      
      setFilter: (newFilter) => {
        set((state) => ({
          filter: { ...state.filter, ...newFilter }
        }));
      },
      
      clearFilter: () => set({ filter: {} }),
      
      // ドラッグ&ドロップ
      setDraggedNote: (note) => set({ draggedNote: note }),
      
      moveNote: (id, newPosition) => {
        set((state) => ({
          notes: state.notes.map(note =>
            note.id === id
              ? { ...note, position: newPosition, updatedAt: new Date() }
              : note
          )
        }));
      },
      
      // ダイアログ制御
      openCreateDialog: () => set({ isCreateDialogOpen: true }),
      closeCreateDialog: () => set({ isCreateDialogOpen: false }),
      openEditDialog: (noteId) => {
        set({ 
          isEditDialogOpen: true, 
          selectedNoteId: noteId 
        });
      },
      closeEditDialog: () => set({ isEditDialogOpen: false }),
      
      // ユーティリティ
      getFilteredNotes: () => {
        const { notes, filter } = get();
        let filteredNotes = [...notes];
        
        if (filter.category) {
          filteredNotes = filteredNotes.filter(note => note.category === filter.category);
        }
        
        if (filter.color) {
          filteredNotes = filteredNotes.filter(note => note.color === filter.color);
        }
        
        if (filter.priority) {
          filteredNotes = filteredNotes.filter(note => note.priority === filter.priority);
        }
        
        if (filter.searchQuery) {
          const query = filter.searchQuery.toLowerCase();
          filteredNotes = filteredNotes.filter(note =>
            note.title.toLowerCase().includes(query) ||
            note.content.toLowerCase().includes(query) ||
            note.tags.some(tag => tag.toLowerCase().includes(query))
          );
        }
        
        return filteredNotes;
      },
      
      getNotesByCategory: (category) => {
        const { notes } = get();
        return notes.filter(note => note.category === category);
      },
      
      searchNotes: (query) => {
        const { notes } = get();
        const searchQuery = query.toLowerCase();
        
        return notes.filter(note =>
          note.title.toLowerCase().includes(searchQuery) ||
          note.content.toLowerCase().includes(searchQuery) ||
          note.tags.some(tag => tag.toLowerCase().includes(searchQuery))
        );
      }
    }),
    {
      name: 'sticky-notes-storage',
      partialize: (state) => ({
        notes: state.notes,
        filter: state.filter
      })
    }
  )
);
```

### 1.3 カラーパレットの定義

```typescript
// utils/stickyNoteColors.ts
export const STICKY_COLORS = {
  red: {
    background: 'linear-gradient(135deg, #ffeb3b 0%, #ffc107 50%, #ff9800 100%)',
    border: '#ff6b6b',
    shadow: 'rgba(255, 107, 107, 0.3)',
    text: '#2c3e50'
  },
  yellow: {
    background: 'linear-gradient(135deg, #fff9c4 0%, #fff176 50%, #ffeb3b 100%)',
    border: '#fbc02d',
    shadow: 'rgba(251, 192, 45, 0.3)',
    text: '#2c3e50'
  },
  green: {
    background: 'linear-gradient(135deg, #c8e6c9 0%, #81c784 50%, #4caf50 100%)',
    border: '#4caf50',
    shadow: 'rgba(76, 175, 80, 0.3)',
    text: '#2c3e50'
  },
  blue: {
    background: 'linear-gradient(135deg, #e3f2fd 0%, #90caf9 50%, #2196f3 100%)',
    border: '#2196f3',
    shadow: 'rgba(33, 150, 243, 0.3)',
    text: '#2c3e50'
  },
  purple: {
    background: 'linear-gradient(135deg, #f3e5f5 0%, #ce93d8 50%, #9c27b0 100%)',
    border: '#9c27b0',
    shadow: 'rgba(156, 39, 176, 0.3)',
    text: '#ffffff'
  },
  orange: {
    background: 'linear-gradient(135deg, #fff3e0 0%, #ffb74d 50%, #ff9800 100%)',
    border: '#ff9800',
    shadow: 'rgba(255, 152, 0, 0.3)',
    text: '#2c3e50'
  }
} as const;

export const CATEGORY_ICONS = {
  important: '🔴',
  normal: '🟡',
  completed: '🟢',
  memo: '🟦',
  question: '🟣'
} as const;

export const PRIORITY_COLORS = {
  high: '#f44336',
  medium: '#ff9800',
  low: '#4caf50'
} as const;
```

---

## 🏗️ Step 2: メイン付箋ページコンポーネント

### 2.1 付箋ページレイアウト

```typescript
// components/StickyNotes/StickyNotesPage.tsx
import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  Tabs,
  Tab,
  Paper,
  Container
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useStickyNotesStore } from '../../stores/useStickyNotesStore';
import { StickyNoteGrid } from './StickyNoteGrid';
import { StickyNoteFilters } from './StickyNoteFilters';
import { CreateNoteDialog } from './CreateNoteDialog';
import { EditNoteDialog } from './EditNoteDialog';
import { CATEGORY_ICONS } from '../../utils/stickyNoteColors';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div hidden={value !== index} style={{ height: '100%' }}>
      {value === index && children}
    </div>
  );
}

export const StickyNotesPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const {
    openCreateDialog,
    isCreateDialogOpen,
    isEditDialogOpen,
    getNotesByCategory,
    filter,
    setFilter
  } = useStickyNotesStore();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    
    // タブに応じてフィルターを設定
    const categories = ['', 'important', 'normal', 'completed', 'memo', 'question'];
    const selectedCategory = categories[newValue];
    
    if (selectedCategory) {
      setFilter({ category: selectedCategory });
    } else {
      setFilter({ category: undefined });
    }
  };

  const getCategoryCount = (category: string) => {
    return getNotesByCategory(category).length;
  };

  return (
    <Container maxWidth="xl" sx={{ height: '100vh', py: 2 }}>
      {/* ヘッダー */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          🗒️ 付箋管理システム
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreateDialog}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 'bold'
          }}
        >
          新規追加
        </Button>
      </Box>

      {/* フィルターコンポーネント */}
      <StickyNoteFilters />

      {/* タブナビゲーション */}
      <Paper elevation={2} sx={{ mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 'bold',
              fontSize: '1rem'
            }
          }}
        >
          <Tab 
            label={`📋 すべて (${getNotesByCategory('').length})`}
            sx={{ minWidth: 120 }}
          />
          <Tab 
            label={`🔴 重要 (${getCategoryCount('important')})`}
            sx={{ minWidth: 120 }}
          />
          <Tab 
            label={`🟡 通常 (${getCategoryCount('normal')})`}
            sx={{ minWidth: 120 }}
          />
          <Tab 
            label={`🟢 完了 (${getCategoryCount('completed')})`}
            sx={{ minWidth: 120 }}
          />
          <Tab 
            label={`🟦 メモ (${getCategoryCount('memo')})`}
            sx={{ minWidth: 120 }}
          />
          <Tab 
            label={`🟣 質問 (${getCategoryCount('question')})`}
            sx={{ minWidth: 120 }}
          />
        </Tabs>
      </Paper>

      {/* タブコンテンツ */}
      <Box sx={{ flexGrow: 1, height: 'calc(100vh - 250px)' }}>
        <TabPanel value={tabValue} index={0}>
          <StickyNoteGrid showAll />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <StickyNoteGrid category="important" />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <StickyNoteGrid category="normal" />
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
          <StickyNoteGrid category="completed" />
        </TabPanel>
        <TabPanel value={tabValue} index={4}>
          <StickyNoteGrid category="memo" />
        </TabPanel>
        <TabPanel value={tabValue} index={5}>
          <StickyNoteGrid category="question" />
        </TabPanel>
      </Box>

      {/* ダイアログ */}
      <CreateNoteDialog />
      <EditNoteDialog />
    </Container>
  );
};
```

### 2.2 付箋フィルターコンポーネント

```typescript
// components/StickyNotes/StickyNoteFilters.tsx
import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Paper
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { useStickyNotesStore } from '../../stores/useStickyNotesStore';
import { STICKY_COLORS, PRIORITY_COLORS } from '../../utils/stickyNoteColors';

export const StickyNoteFilters: React.FC = () => {
  const { filter, setFilter, clearFilter } = useStickyNotesStore();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({ searchQuery: event.target.value });
  };

  const handleColorChange = (event: any) => {
    setFilter({ color: event.target.value || undefined });
  };

  const handlePriorityChange = (event: any) => {
    setFilter({ priority: event.target.value || undefined });
  };

  const hasActiveFilters = Boolean(
    filter.searchQuery || filter.color || filter.priority
  );

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
      <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
        {/* 検索ボックス */}
        <TextField
          placeholder="付箋を検索..."
          value={filter.searchQuery || ''}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />
          }}
          sx={{ minWidth: 250 }}
          size="small"
        />

        {/* カラーフィルター */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>色</InputLabel>
          <Select
            value={filter.color || ''}
            onChange={handleColorChange}
            label="色"
          >
            <MenuItem value="">すべて</MenuItem>
            {Object.entries(STICKY_COLORS).map(([color, colorConfig]) => (
              <MenuItem key={color} value={color}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      background: colorConfig.background,
                      border: `1px solid ${colorConfig.border}`
                    }}
                  />
                  {color}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* 優先度フィルター */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>優先度</InputLabel>
          <Select
            value={filter.priority || ''}
            onChange={handlePriorityChange}
            label="優先度"
          >
            <MenuItem value="">すべて</MenuItem>
            <MenuItem value="high">
              <Box display="flex" alignItems="center" gap={1}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: PRIORITY_COLORS.high
                  }}
                />
                高
              </Box>
            </MenuItem>
            <MenuItem value="medium">
              <Box display="flex" alignItems="center" gap={1}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: PRIORITY_COLORS.medium
                  }}
                />
                中
              </Box>
            </MenuItem>
            <MenuItem value="low">
              <Box display="flex" alignItems="center" gap={1}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: PRIORITY_COLORS.low
                  }}
                />
                低
              </Box>
            </MenuItem>
          </Select>
        </FormControl>

        {/* フィルタークリアボタン */}
        {hasActiveFilters && (
          <IconButton
            onClick={clearFilter}
            color="secondary"
            size="small"
            sx={{
              backgroundColor: 'action.selected',
              '&:hover': {
                backgroundColor: 'action.hover'
              }
            }}
          >
            <ClearIcon />
          </IconButton>
        )}
      </Box>

      {/* アクティブフィルターの表示 */}
      {hasActiveFilters && (
        <Box mt={1} display="flex" gap={1} flexWrap="wrap">
          {filter.searchQuery && (
            <Chip
              label={`検索: ${filter.searchQuery}`}
              onDelete={() => setFilter({ searchQuery: undefined })}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
          {filter.color && (
            <Chip
              label={`色: ${filter.color}`}
              onDelete={() => setFilter({ color: undefined })}
              size="small"
              color="secondary"
              variant="outlined"
            />
          )}
          {filter.priority && (
            <Chip
              label={`優先度: ${filter.priority}`}
              onDelete={() => setFilter({ priority: undefined })}
              size="small"
              color="info"
              variant="outlined"
            />
          )}
        </Box>
      )}
    </Paper>
  );
};
```

---

## 🏗️ Step 3: 付箋表示コンポーネント

### 3.1 付箋グリッドコンポーネント

```typescript
// components/StickyNotes/StickyNoteGrid.tsx
import React, { useMemo } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Zoom
} from '@mui/material';
import { useStickyNotesStore } from '../../stores/useStickyNotesStore';
import { StickyNoteCard } from './StickyNoteCard';
import { EmptyState } from './EmptyState';

interface StickyNoteGridProps {
  category?: string;
  showAll?: boolean;
}

export const StickyNoteGrid: React.FC<StickyNoteGridProps> = ({ 
  category, 
  showAll = false 
}) => {
  const { getFilteredNotes, getNotesByCategory } = useStickyNotesStore();

  const notes = useMemo(() => {
    if (showAll) {
      return getFilteredNotes();
    }
    if (category) {
      return getNotesByCategory(category);
    }
    return [];
  }, [showAll, category, getFilteredNotes, getNotesByCategory]);

  if (notes.length === 0) {
    return (
      <EmptyState 
        message={category ? `${category}カテゴリの付箋がありません` : '付箋がありません'}
        category={category}
      />
    );
  }

  return (
    <Box sx={{ height: '100%', overflow: 'auto', p: 1 }}>
      <Grid container spacing={2}>
        {notes.map((note, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={note.id}>
            <Zoom in timeout={200 + index * 50}>
              <div>
                <StickyNoteCard note={note} />
              </div>
            </Zoom>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
```

### 3.2 付箋カードコンポーネント

```typescript
// components/StickyNotes/StickyNoteCard.tsx
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  Fade
} from '@mui/material';
import {
  MoreVert as MoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
  Schedule as ScheduleIcon,
  Flag as FlagIcon
} from '@mui/icons-material';
import { StickyNote } from '../../types/stickyNote';
import { useStickyNotesStore } from '../../stores/useStickyNotesStore';
import { STICKY_COLORS, CATEGORY_ICONS, PRIORITY_COLORS } from '../../utils/stickyNoteColors';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';

interface StickyNoteCardProps {
  note: StickyNote;
}

export const StickyNoteCard: React.FC<StickyNoteCardProps> = ({ note }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { openEditDialog, deleteNote, selectNote } = useStickyNotesStore();

  const colorConfig = STICKY_COLORS[note.color];
  const categoryIcon = CATEGORY_ICONS[note.category];
  const priorityColor = PRIORITY_COLORS[note.priority];

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    openEditDialog(note.id);
    handleMenuClose();
  };

  const handleDelete = () => {
    if (window.confirm('この付箋を削除しますか？')) {
      deleteNote(note.id);
    }
    handleMenuClose();
  };

  const handleCardClick = () => {
    selectNote(note.id);
  };

  const formatDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: ja
    });
  };

  return (
    <Card
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      sx={{
        height: note.size.height || 200,
        width: '100%',
        cursor: 'pointer',
        position: 'relative',
        background: colorConfig.background,
        border: `2px solid ${colorConfig.border}`,
        boxShadow: `0 4px 8px ${colorConfig.shadow}`,
        transition: 'all 0.3s ease',
        transform: isHovered ? 'translateY(-4px) rotate(1deg)' : 'rotate(0deg)',
        '&:hover': {
          boxShadow: `0 8px 16px ${colorConfig.shadow}`
        },
        ...(note.isCompleted && {
          opacity: 0.7,
          filter: 'grayscale(0.3)'
        })
      }}
    >
      {/* ドラッグハンドル */}
      <Fade in={isHovered}>
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            zIndex: 1
          }}
        >
          <DragIcon sx={{ color: 'action.active', fontSize: 16 }} />
        </Box>
      </Fade>

      {/* メニューボタン */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 2
        }}
      >
        <Fade in={isHovered}>
          <IconButton
            size="small"
            onClick={handleMenuClick}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.95)'
              }
            }}
          >
            <MoreIcon fontSize="small" />
          </IconButton>
        </Fade>
      </Box>

      {/* メニュー */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          編集
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          削除
        </MenuItem>
      </Menu>

      <CardContent sx={{ height: '100%', p: 2, position: 'relative' }}>
        {/* カテゴリーアイコンと優先度 */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Typography variant="h6" component="div" sx={{ fontSize: '1.2rem' }}>
            {categoryIcon}
          </Typography>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: priorityColor
            }}
          />
        </Box>

        {/* タイトル */}
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 'bold',
            color: colorConfig.text,
            mb: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            ...(note.isCompleted && {
              textDecoration: 'line-through'
            })
          }}
        >
          {note.title}
        </Typography>

        {/* 内容 */}
        <Typography
          variant="body2"
          sx={{
            color: colorConfig.text,
            opacity: 0.8,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            mb: 2
          }}
        >
          {note.content}
        </Typography>

        {/* フッター情報 */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 8,
            left: 16,
            right: 16,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {/* タグ */}
          <Box display="flex" gap={0.5} flexWrap="wrap">
            {note.tags.slice(0, 2).map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                sx={{
                  height: 18,
                  fontSize: '0.7rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.7)'
                }}
              />
            ))}
            {note.tags.length > 2 && (
              <Chip
                label={`+${note.tags.length - 2}`}
                size="small"
                sx={{
                  height: 18,
                  fontSize: '0.7rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.7)'
                }}
              />
            )}
          </Box>

          {/* 期限と更新日時 */}
          <Box display="flex" flexDirection="column" alignItems="flex-end">
            {note.dueDate && (
              <Tooltip title="期限">
                <Box display="flex" alignItems="center" gap={0.5}>
                  <ScheduleIcon sx={{ fontSize: 12, color: colorConfig.text }} />
                  <Typography
                    variant="caption"
                    sx={{
                      color: colorConfig.text,
                      fontSize: '0.7rem'
                    }}
                  >
                    {formatDate(note.dueDate)}
                  </Typography>
                </Box>
              </Tooltip>
            )}
            <Typography
              variant="caption"
              sx={{
                color: colorConfig.text,
                opacity: 0.6,
                fontSize: '0.65rem'
              }}
            >
              {formatDate(note.updatedAt)}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
```

---

## 🏗️ Step 4: 付箋作成・編集ダイアログ

### 4.1 付箋作成ダイアログ

```typescript
// components/StickyNotes/CreateNoteDialog.tsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  Typography,
  IconButton
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useStickyNotesStore } from '../../stores/useStickyNotesStore';
import { STICKY_COLORS, CATEGORY_ICONS } from '../../utils/stickyNoteColors';
import { StickyNote } from '../../types/stickyNote';

interface FormData {
  title: string;
  content: string;
  color: StickyNote['color'];
  category: StickyNote['category'];
  priority: StickyNote['priority'];
  tags: string[];
  dueDate?: Date;
}

export const CreateNoteDialog: React.FC = () => {
  const { isCreateDialogOpen, closeCreateDialog, addNote } = useStickyNotesStore();
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    color: 'yellow',
    category: 'normal',
    priority: 'medium',
    tags: [],
    dueDate: undefined
  });
  
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleClose = () => {
    setFormData({
      title: '',
      content: '',
      color: 'yellow',
      category: 'normal',
      priority: 'medium',
      tags: [],
      dueDate: undefined
    });
    setErrors({});
    setNewTag('');
    closeCreateDialog();
  };

  const handleInputChange = (field: keyof FormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSelectChange = (field: keyof FormData) => (event: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleAddTag();
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'タイトルは必須です';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = '内容は必須です';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    const newNote = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      color: formData.color,
      category: formData.category,
      priority: formData.priority,
      tags: formData.tags,
      dueDate: formData.dueDate,
      position: {
        x: Math.random() * 100,
        y: Math.random() * 100
      },
      size: {
        width: 250,
        height: 200
      },
      isCompleted: false
    };
    
    addNote(newNote);
    handleClose();
  };

  return (
    <Dialog
      open={isCreateDialogOpen}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="div">
          📝 新しい付箋を作成
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* タイトル */}
          <Grid item xs={12}>
            <TextField
              label="タイトル"
              value={formData.title}
              onChange={handleInputChange('title')}
              error={Boolean(errors.title)}
              helperText={errors.title}
              fullWidth
              required
            />
          </Grid>
          
          {/* 内容 */}
          <Grid item xs={12}>
            <TextField
              label="内容"
              value={formData.content}
              onChange={handleInputChange('content')}
              error={Boolean(errors.content)}
              helperText={errors.content}
              fullWidth
              required
              multiline
              rows={4}
            />
          </Grid>
          
          {/* カテゴリーと優先度 */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>カテゴリー</InputLabel>
              <Select
                value={formData.category}
                onChange={handleSelectChange('category')}
                label="カテゴリー"
              >
                {Object.entries(CATEGORY_ICONS).map(([category, icon]) => (
                  <MenuItem key={category} value={category}>
                    <Box display="flex" alignItems="center" gap={1}>
                      {icon}
                      <Typography>
                        {category === 'important' ? '重要' :
                         category === 'normal' ? '通常' :
                         category === 'completed' ? '完了' :
                         category === 'memo' ? 'メモ' :
                         category === 'question' ? '質問' : category}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>優先度</InputLabel>
              <Select
                value={formData.priority}
                onChange={handleSelectChange('priority')}
                label="優先度"
              >
                <MenuItem value="high">🔴 高</MenuItem>
                <MenuItem value="medium">🟡 中</MenuItem>
                <MenuItem value="low">🟢 低</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          {/* 色選択 */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              付箋の色
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {Object.entries(STICKY_COLORS).map(([color, colorConfig]) => (
                <Box
                  key={color}
                  onClick={() => setFormData(prev => ({ ...prev, color: color as any }))}
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1,
                    background: colorConfig.background,
                    border: formData.color === color ? `3px solid ${colorConfig.border}` : `2px solid ${colorConfig.border}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.1)'
                    }
                  }}
                />
              ))}
            </Box>
          </Grid>
          
          {/* タグ */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              タグ
            </Typography>
            <Box display="flex" gap={1} mb={1} flexWrap="wrap">
              {formData.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  onDelete={() => handleRemoveTag(tag)}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
            <Box display="flex" gap={1}>
              <TextField
                placeholder="新しいタグを入力"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                size="small"
                sx={{ flexGrow: 1 }}
              />
              <Button
                onClick={handleAddTag}
                disabled={!newTag.trim()}
                startIcon={<AddIcon />}
                variant="outlined"
                size="small"
              >
                追加
              </Button>
            </Box>
          </Grid>
          
          {/* 期限 */}
          <Grid item xs={12}>
            <DatePicker
              label="期限（オプション）"
              value={formData.dueDate}
              onChange={(date) => setFormData(prev => ({ ...prev, dueDate: date || undefined }))}
              slotProps={{
                textField: {
                  fullWidth: true
                }
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} color="inherit">
          キャンセル
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{ minWidth: 100 }}
        >
          作成
        </Button>
      </DialogActions>
    </Dialog>
  );
};
```

### 4.2 付箋編集ダイアログ

```typescript
// components/StickyNotes/EditNoteDialog.tsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  Typography,
  IconButton,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useStickyNotesStore } from '../../stores/useStickyNotesStore';
import { STICKY_COLORS, CATEGORY_ICONS } from '../../utils/stickyNoteColors';
import { StickyNote } from '../../types/stickyNote';

interface FormData {
  title: string;
  content: string;
  color: StickyNote['color'];
  category: StickyNote['category'];
  priority: StickyNote['priority'];
  tags: string[];
  dueDate?: Date;
  isCompleted: boolean;
}

export const EditNoteDialog: React.FC = () => {
  const { 
    isEditDialogOpen, 
    closeEditDialog, 
    updateNote, 
    selectedNoteId,
    notes 
  } = useStickyNotesStore();
  
  const selectedNote = notes.find(note => note.id === selectedNoteId);
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    color: 'yellow',
    category: 'normal',
    priority: 'medium',
    tags: [],
    dueDate: undefined,
    isCompleted: false
  });
  
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<Partial<FormData>>({});

  // 選択された付箋の情報をフォームに設定
  useEffect(() => {
    if (selectedNote) {
      setFormData({
        title: selectedNote.title,
        content: selectedNote.content,
        color: selectedNote.color,
        category: selectedNote.category,
        priority: selectedNote.priority,
        tags: [...selectedNote.tags],
        dueDate: selectedNote.dueDate,
        isCompleted: selectedNote.isCompleted
      });
    }
  }, [selectedNote]);

  const handleClose = () => {
    setErrors({});
    setNewTag('');
    closeEditDialog();
  };

  const handleInputChange = (field: keyof FormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSelectChange = (field: keyof FormData) => (event: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleCheckboxChange = (field: keyof FormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.checked
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleAddTag();
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'タイトルは必須です';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = '内容は必須です';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm() || !selectedNoteId) return;
    
    const updates = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      color: formData.color,
      category: formData.category,
      priority: formData.priority,
      tags: formData.tags,
      dueDate: formData.dueDate,
      isCompleted: formData.isCompleted
    };
    
    updateNote(selectedNoteId, updates);
    handleClose();
  };

  if (!selectedNote) {
    return null;
  }

  return (
    <Dialog
      open={isEditDialogOpen}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="div">
          ✏️ 付箋を編集
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* 完了チェックボックス */}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isCompleted}
                  onChange={handleCheckboxChange('isCompleted')}
                  color="success"
                />
              }
              label="完了済み"
            />
          </Grid>
          
          {/* タイトル */}
          <Grid item xs={12}>
            <TextField
              label="タイトル"
              value={formData.title}
              onChange={handleInputChange('title')}
              error={Boolean(errors.title)}
              helperText={errors.title}
              fullWidth
              required
            />
          </Grid>
          
          {/* 内容 */}
          <Grid item xs={12}>
            <TextField
              label="内容"
              value={formData.content}
              onChange={handleInputChange('content')}
              error={Boolean(errors.content)}
              helperText={errors.content}
              fullWidth
              required
              multiline
              rows={4}
            />
          </Grid>
          
          {/* カテゴリーと優先度 */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>カテゴリー</InputLabel>
              <Select
                value={formData.category}
                onChange={handleSelectChange('category')}
                label="カテゴリー"
              >
                {Object.entries(CATEGORY_ICONS).map(([category, icon]) => (
                  <MenuItem key={category} value={category}>
                    <Box display="flex" alignItems="center" gap={1}>
                      {icon}
                      <Typography>
                        {category === 'important' ? '重要' :
                         category === 'normal' ? '通常' :
                         category === 'completed' ? '完了' :
                         category === 'memo' ? 'メモ' :
                         category === 'question' ? '質問' : category}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>優先度</InputLabel>
              <Select
                value={formData.priority}
                onChange={handleSelectChange('priority')}
                label="優先度"
              >
                <MenuItem value="high">🔴 高</MenuItem>
                <MenuItem value="medium">🟡 中</MenuItem>
                <MenuItem value="low">🟢 低</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          {/* 色選択 */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              付箋の色
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {Object.entries(STICKY_COLORS).map(([color, colorConfig]) => (
                <Box
                  key={color}
                  onClick={() => setFormData(prev => ({ ...prev, color: color as any }))}
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1,
                    background: colorConfig.background,
                    border: formData.color === color ? `3px solid ${colorConfig.border}` : `2px solid ${colorConfig.border}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.1)'
                    }
                  }}
                />
              ))}
            </Box>
          </Grid>
          
          {/* タグ */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              タグ
            </Typography>
            <Box display="flex" gap={1} mb={1} flexWrap="wrap">
              {formData.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  onDelete={() => handleRemoveTag(tag)}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
            <Box display="flex" gap={1}>
              <TextField
                placeholder="新しいタグを入力"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                size="small"
                sx={{ flexGrow: 1 }}
              />
              <Button
                onClick={handleAddTag}
                disabled={!newTag.trim()}
                startIcon={<AddIcon />}
                variant="outlined"
                size="small"
              >
                追加
              </Button>
            </Box>
          </Grid>
          
          {/* 期限 */}
          <Grid item xs={12}>
            <DatePicker
              label="期限（オプション）"
              value={formData.dueDate}
              onChange={(date) => setFormData(prev => ({ ...prev, dueDate: date || undefined }))}
              slotProps={{
                textField: {
                  fullWidth: true
                }
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} color="inherit">
          キャンセル
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{ minWidth: 100 }}
        >
          更新
        </Button>
      </DialogActions>
    </Dialog>
  );
};
```

---

## 🏗️ Step 5: 空状態とユーティリティコンポーネント

### 5.1 空状態コンポーネント

```typescript
// components/StickyNotes/EmptyState.tsx
import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper
} from '@mui/material';
import {
  NoteAdd as NoteAddIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { useStickyNotesStore } from '../../stores/useStickyNotesStore';
import { CATEGORY_ICONS } from '../../utils/stickyNoteColors';

interface EmptyStateProps {
  message: string;
  category?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message, category }) => {
  const { openCreateDialog, clearFilter, filter } = useStickyNotesStore();
  
  const hasFilters = Boolean(
    filter.searchQuery || filter.color || filter.priority
  );
  
  const categoryIcon = category ? CATEGORY_ICONS[category] : '📋';
  const categoryName = category ? {
    important: '重要',
    normal: '通常',
    completed: '完了',
    memo: 'メモ',
    question: '質問'
  }[category] || category : '';

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100%"
      minHeight={400}
      sx={{ textAlign: 'center' }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          backgroundColor: 'grey.50',
          borderRadius: 2,
          maxWidth: 400
        }}
      >
        {/* アイコン */}
        <Box mb={2}>
          <Typography
            sx={{
              fontSize: '4rem',
              filter: 'grayscale(0.3)',
              opacity: 0.7
            }}
          >
            {hasFilters ? '🔍' : categoryIcon}
          </Typography>
        </Box>
        
        {/* メッセージ */}
        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          sx={{ color: 'text.secondary' }}
        >
          {hasFilters ? '検索結果が見つかりません' : message}
        </Typography>
        
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary', mb: 3 }}
        >
          {hasFilters 
            ? '検索条件を変更して再度お試しください'
            : category 
              ? `${categoryName}カテゴリの付箋を作成して、アイデアを整理しましょう`
              : '新しい付箋を作成して、アイデアやタスクを整理しましょう'
          }
        </Typography>
        
        {/* アクションボタン */}
        <Box display="flex" gap={2} justifyContent="center">
          {hasFilters ? (
            <Button
              variant="outlined"
              onClick={clearFilter}
              startIcon={<SearchIcon />}
            >
              フィルターをクリア
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={openCreateDialog}
              startIcon={<NoteAddIcon />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'bold'
              }}
            >
              最初の付箋を作成
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
};
```

---

## 🏗️ Step 6: ドラッグ&ドロップ機能（上級）

### 6.1 ドラッグ対応付箋カード

```typescript
// components/StickyNotes/DraggableStickyNote.tsx
import React, { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { StickyNoteCard } from './StickyNoteCard';
import { StickyNote } from '../../types/stickyNote';
import { useStickyNotesStore } from '../../stores/useStickyNotesStore';

interface DraggableStickyNoteProps {
  note: StickyNote;
  onMove?: (draggedId: string, hoveredId: string) => void;
}

export const DraggableStickyNote: React.FC<DraggableStickyNoteProps> = ({ 
  note, 
  onMove 
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { moveNote } = useStickyNotesStore();
  
  const [{ isDragging }, drag] = useDrag({
    type: 'sticky-note',
    item: { id: note.id, type: 'sticky-note' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });
  
  const [, drop] = useDrop({
    accept: 'sticky-note',
    hover: (draggedItem: { id: string }) => {
      if (draggedItem.id !== note.id && onMove) {
        onMove(draggedItem.id, note.id);
      }
    }
  });
  
  drag(drop(ref));
  
  return (
    <div
      ref={ref}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
    >
      <StickyNoteCard note={note} />
    </div>
  );
};
```

---

## 🏆 レベルアップチャレンジ

### 初級（⭐）
1. 基本的な付箋作成・表示機能を実装しよう
2. カテゴリ別フィルタリングを追加しよう

### 中級（⭐⭐）
1. 付箋の編集・削除機能を実装しよう
2. タグ機能と検索機能を追加しよう
3. 期限表示とアラート機能を実装しよう

### 上級（⭐⭐⭐）
1. ドラッグ&ドロップによる並び替え機能を実装しよう
2. 付箋のサイズ変更機能を追加しよう
3. エクスポート・インポート機能を実装しよう
4. リアルタイム同期機能を検討しよう

---

## 🎨 CSS カスタマイズのヒント

### 付箋風アニメーション

```css
/* 付箋の影効果 */
.sticky-note {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center center;
}

.sticky-note:hover {
  transform: translateY(-8px) rotate(2deg) scale(1.02);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.2);
}

/* ペラペラ効果 */
.sticky-note::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 20px;
  height: 20px;
  background: linear-gradient(
    135deg,
    transparent 50%,
    rgba(0, 0, 0, 0.1) 50%
  );
  clip-path: polygon(0 0, 100% 0, 100% 100%);
}

/* フェードイン アニメーション */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.sticky-note-enter {
  animation: fadeInUp 0.4s ease-out;
}
```

---

## 📚 まとめ

付箋機能の実装により、以下のスキルを習得できます：

### 技術的スキル
- ✅ **状態管理**：Zustandによる複雑な状態管理
- ✅ **UI/UX設計**：直感的なインターフェース設計
- ✅ **フォーム処理**：バリデーション付きフォーム
- ✅ **ファイル構造**：コンポーネントの適切な分割
- ✅ **パフォーマンス**：最適化されたレンダリング

### 実践的スキル
- ✅ **ドラッグ&ドロップ**：react-dnd による操作性向上
- ✅ **検索・フィルタリング**：ユーザビリティの向上
- ✅ **データの永続化**：localStorageとの連携
- ✅ **レスポンシブ対応**：あらゆるデバイスで快適

付箋機能は見た目以上に奥が深く、実装を通じてReactの様々な概念を学ぶことができます！

---

## 🔗 次のステップ

- TasQ Flowの他の機能と連携してみよう
- リアルタイム更新機能を追加してみよう  
- モバイル対応を強化してみよう
- アクセシビリティを向上させてみよう

## 💡 参考リソース

- [Material-UI Grid System](https://mui.com/system/grid/)
- [React DnD](https://react-dnd.github.io/react-dnd/)
- [Zustand Best Practices](https://zustand-demo.pmnd.rs/)
- [React Hook Form](https://react-hook-form.com/)
- [Date-fns Formatting](https://date-fns.org/docs/Getting-Started)