import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { useAppStore } from '../../stores/useAppStore';
import type { StickyNote } from '../../types/stickyNote';
// import type { Task } from '../../types/task';

// 付箋管理の設定
export interface StickyNoteManagerConfig {
  maxNotes: number;                    // 最大付箋数
  autoSave: boolean;                   // 自動保存
  autoSaveInterval: number;            // 自動保存間隔（ミリ秒）
  enableCollision: boolean;            // 衝突検知
  enableSnapping: boolean;             // グリッドスナップ
  gridSize: number;                    // グリッドサイズ
  enableGrouping: boolean;             // グループ化機能
  enableTagging: boolean;              // タグ機能
  enableSearch: boolean;               // 検索機能
  persistenceMode: 'localStorage' | 'sessionStorage' | 'memory';
}

// デフォルト設定
const DEFAULT_CONFIG: StickyNoteManagerConfig = {
  maxNotes: 50,
  autoSave: true,
  autoSaveInterval: 5000,
  enableCollision: true,
  enableSnapping: false,
  gridSize: 10,
  enableGrouping: true,
  enableTagging: true,
  enableSearch: true,
  persistenceMode: 'localStorage',
};

// 拡張付箋型（内部管理用）
interface ExtendedStickyNote extends StickyNote {
  tags?: string[];
  groupId?: string;
  isSelected?: boolean;
  lastAccessed: Date;
  priority: 'low' | 'medium' | 'high';
  category: string;
  attachments?: Array<{
    id: string;
    name: string;
    type: 'link' | 'file' | 'image';
    url: string;
  }>;
  metadata: {
    version: number;
    editCount: number;
    collaborators: string[];
    isPublic: boolean;
    hasChanges: boolean;
  };
}

// 付箋グループ
interface StickyNoteGroup {
  id: string;
  name: string;
  color: string;
  noteIds: string[];
  position: { x: number; y: number };
  isCollapsed: boolean;
  createdAt: Date;
}

// 付箋操作ログ
interface StickyNoteAction {
  id: string;
  type: 'create' | 'update' | 'delete' | 'move' | 'resize' | 'group' | 'ungroup';
  noteId: string;
  userId: string;
  timestamp: Date;
  previousState?: Partial<ExtendedStickyNote>;
  newState?: Partial<ExtendedStickyNote>;
}

// 付箋管理API
export interface StickyNoteManagerAPI {
  // 基本CRUD
  createNote: (note: Partial<ExtendedStickyNote>) => string;
  updateNote: (id: string, updates: Partial<ExtendedStickyNote>) => boolean;
  deleteNote: (id: string) => boolean;
  duplicateNote: (id: string) => string | null;
  
  // 位置・サイズ管理
  moveNote: (id: string, position: { x: number; y: number }) => boolean;
  resizeNote: (id: string, size: { width: number; height: number }) => boolean;
  snapToGrid: (id: string) => boolean;
  autoArrange: (algorithm: 'grid' | 'cluster' | 'timeline') => void;
  
  // 表示管理
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
  toggleMinimize: (id: string) => void;
  toggleVisibility: (id: string) => void;
  
  // 選択・操作
  selectNote: (id: string, multiSelect?: boolean) => void;
  selectAll: () => void;
  clearSelection: () => void;
  deleteSelected: () => void;
  groupSelected: (groupName: string) => string | null;
  ungroupSelected: () => void;
  
  // グループ管理
  createGroup: (name: string, noteIds: string[]) => string;
  updateGroup: (id: string, updates: Partial<StickyNoteGroup>) => boolean;
  deleteGroup: (id: string) => boolean;
  addToGroup: (groupId: string, noteIds: string[]) => boolean;
  removeFromGroup: (groupId: string, noteIds: string[]) => boolean;
  
  // 検索・フィルタリング
  searchNotes: (query: string) => ExtendedStickyNote[];
  filterByTag: (tags: string[]) => ExtendedStickyNote[];
  filterByCategory: (category: string) => ExtendedStickyNote[];
  filterByPriority: (priority: ExtendedStickyNote['priority']) => ExtendedStickyNote[];
  filterByDateRange: (start: Date, end: Date) => ExtendedStickyNote[];
  
  // タグ管理
  addTag: (noteId: string, tag: string) => boolean;
  removeTag: (noteId: string, tag: string) => boolean;
  getAllTags: () => string[];
  getTagUsage: () => Record<string, number>;
  
  // インポート・エクスポート
  exportNotes: (format: 'json' | 'csv' | 'markdown') => string;
  importNotes: (data: string, format: 'json' | 'csv') => boolean;
  
  // 履歴・元に戻す
  undo: () => boolean;
  redo: () => boolean;
  getHistory: () => StickyNoteAction[];
  clearHistory: () => void;
  
  // 統計・分析
  getStatistics: () => {
    totalNotes: number;
    notesByCategory: Record<string, number>;
    notesByPriority: Record<string, number>;
    averageSize: { width: number; height: number };
    mostUsedTags: Array<{ tag: string; count: number }>;
    creationTrend: Array<{ date: string; count: number }>;
  };
  
  // 永続化
  save: () => boolean;
  load: () => boolean;
  clear: () => void;
  
  // 状態取得
  getAllNotes: () => ExtendedStickyNote[];
  getSelectedNotes: () => ExtendedStickyNote[];
  getVisibleNotes: () => ExtendedStickyNote[];
  getNote: (id: string) => ExtendedStickyNote | null;
  getGroups: () => StickyNoteGroup[];
  hasUnsavedChanges: () => boolean;
}

interface StickyNoteManagerProps {
  config?: Partial<StickyNoteManagerConfig>;
  initialNotes?: ExtendedStickyNote[];
  onNotesChange?: (notes: ExtendedStickyNote[]) => void;
  onSelectionChange?: (selectedIds: string[]) => void;
  children: (api: StickyNoteManagerAPI) => React.ReactNode;
}

export const StickyNoteManager: React.FC<StickyNoteManagerProps> = ({
  config: configOverrides = {},
  initialNotes = [],
  onNotesChange,
  onSelectionChange,
  children,
}) => {
  const config: StickyNoteManagerConfig = { ...DEFAULT_CONFIG, ...configOverrides };
  
  // 状態管理
  const [notes, setNotes] = useState<ExtendedStickyNote[]>(initialNotes);
  const [groups, setGroups] = useState<StickyNoteGroup[]>([]);
  const [selectedNoteIds, setSelectedNoteIds] = useState<Set<string>>(new Set());
  const [history, setHistory] = useState<StickyNoteAction[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [maxZIndex, setMaxZIndex] = useState(1);
  const [hasChanges, setHasChanges] = useState(false);
  
  // 自動保存タイマー
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const { selectedProjectId } = useAppStore();

  // 変更通知
  useEffect(() => {
    onNotesChange?.(notes);
  }, [notes, onNotesChange]);

  useEffect(() => {
    onSelectionChange?.(Array.from(selectedNoteIds));
  }, [selectedNoteIds, onSelectionChange]);

  // 自動保存
  useEffect(() => {
    if (config.autoSave && hasChanges) {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      
      autoSaveTimerRef.current = setTimeout(() => {
        save();
        setHasChanges(false);
      }, config.autoSaveInterval);
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [hasChanges, config.autoSave, config.autoSaveInterval]);

  // 履歴アクションの追加
  const addToHistory = useCallback((action: Omit<StickyNoteAction, 'id' | 'timestamp'>) => {
    const newAction: StickyNoteAction = {
      ...action,
      id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };

    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(newAction);
      return newHistory.slice(-100); // 最新100件まで保持
    });
    
    setHistoryIndex(prev => prev + 1);
    setHasChanges(true);
  }, [historyIndex]);

  // 基本CRUD操作
  const createNote = useCallback((noteData: Partial<ExtendedStickyNote>): string => {
    if (notes.length >= config.maxNotes) {
      console.warn('Maximum number of notes reached');
      return '';
    }

    const newNote: ExtendedStickyNote = {
      id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: '',
      content: '',
      color: '#FFE082',
      position: { x: 100, y: 100 },
      size: { width: 250, height: 200 },
      createdBy: 'current_user', // TODO: 実際のユーザー情報
      createdAt: new Date(),
      updatedAt: new Date(),
      isMinimized: false,
      zIndex: maxZIndex + 1,
      lastAccessed: new Date(),
      priority: 'medium',
      category: 'general',
      tags: [],
      metadata: {
        version: 1,
        editCount: 0,
        collaborators: [],
        isPublic: false,
        hasChanges: false,
      },
      ...noteData,
    };

    setNotes(prev => [...prev, newNote]);
    setMaxZIndex(prev => prev + 1);
    
    addToHistory({
      type: 'create',
      noteId: newNote.id,
      userId: 'current_user',
      newState: newNote,
    });

    console.log('StickyNoteManager: Created note', newNote.id);
    return newNote.id;
  }, [notes.length, config.maxNotes, maxZIndex, addToHistory]);

  const updateNote = useCallback((id: string, updates: Partial<ExtendedStickyNote>): boolean => {
    const existingNote = notes.find(note => note.id === id);
    if (!existingNote) return false;

    const updatedNote = {
      ...existingNote,
      ...updates,
      updatedAt: new Date(),
      lastAccessed: new Date(),
      metadata: {
        ...existingNote.metadata,
        ...updates.metadata,
        editCount: existingNote.metadata.editCount + 1,
        hasChanges: true,
      },
    };

    setNotes(prev => prev.map(note => note.id === id ? updatedNote : note));
    
    addToHistory({
      type: 'update',
      noteId: id,
      userId: 'current_user',
      previousState: existingNote,
      newState: updates,
    });

    return true;
  }, [notes, addToHistory]);

  const deleteNote = useCallback((id: string): boolean => {
    const noteToDelete = notes.find(note => note.id === id);
    if (!noteToDelete) return false;

    setNotes(prev => prev.filter(note => note.id !== id));
    setSelectedNoteIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });

    addToHistory({
      type: 'delete',
      noteId: id,
      userId: 'current_user',
      previousState: noteToDelete,
    });

    console.log('StickyNoteManager: Deleted note', id);
    return true;
  }, [notes, addToHistory]);

  const duplicateNote = useCallback((id: string): string | null => {
    const originalNote = notes.find(note => note.id === id);
    if (!originalNote) return null;

    const duplicatedNote = {
      ...originalNote,
      id: undefined, // createNoteで新しいIDが生成される
      title: `${originalNote.title} (コピー)`,
      position: {
        x: originalNote.position.x + 20,
        y: originalNote.position.y + 20,
      },
    };

    return createNote(duplicatedNote);
  }, [notes, createNote]);

  // 位置・サイズ管理
  const moveNote = useCallback((id: string, position: { x: number; y: number }): boolean => {
    const note = notes.find(n => n.id === id);
    if (!note) return false;

    // グリッドスナップ
    let finalPosition = position;
    if (config.enableSnapping) {
      finalPosition = {
        x: Math.round(position.x / config.gridSize) * config.gridSize,
        y: Math.round(position.y / config.gridSize) * config.gridSize,
      };
    }

    // 衝突検知
    if (config.enableCollision) {
      const wouldCollide = notes.some(otherNote => {
        if (otherNote.id === id) return false;
        
        const overlap = !(
          finalPosition.x + note.size.width < otherNote.position.x ||
          finalPosition.x > otherNote.position.x + otherNote.size.width ||
          finalPosition.y + note.size.height < otherNote.position.y ||
          finalPosition.y > otherNote.position.y + otherNote.size.height
        );
        
        return overlap;
      });

      if (wouldCollide) {
        console.warn('Move would cause collision');
        return false;
      }
    }

    return updateNote(id, { position: finalPosition });
  }, [notes, config.enableSnapping, config.enableCollision, config.gridSize, updateNote]);

  const resizeNote = useCallback((id: string, size: { width: number; height: number }): boolean => {
    const minSize = { width: 150, height: 100 };
    const maxSize = { width: 800, height: 600 };
    
    const constrainedSize = {
      width: Math.max(minSize.width, Math.min(maxSize.width, size.width)),
      height: Math.max(minSize.height, Math.min(maxSize.height, size.height)),
    };

    return updateNote(id, { size: constrainedSize });
  }, [updateNote]);

  // 表示管理
  const bringToFront = useCallback((id: string) => {
    const newZIndex = maxZIndex + 1;
    setMaxZIndex(newZIndex);
    updateNote(id, { zIndex: newZIndex });
  }, [maxZIndex, updateNote]);

  const sendToBack = useCallback((id: string) => {
    updateNote(id, { zIndex: 1 });
  }, [updateNote]);

  const toggleMinimize = useCallback((id: string) => {
    const note = notes.find(n => n.id === id);
    if (note) {
      updateNote(id, { isMinimized: !note.isMinimized });
    }
  }, [notes, updateNote]);

  // 選択管理
  const selectNote = useCallback((id: string, multiSelect = false) => {
    setSelectedNoteIds(prev => {
      const newSet: Set<string> = multiSelect ? new Set(prev) : new Set<string>();
      
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      
      return newSet;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedNoteIds(new Set(notes.map(note => note.id)));
  }, [notes]);

  const clearSelection = useCallback(() => {
    setSelectedNoteIds(new Set());
  }, []);

  // 検索機能
  const searchNotes = useCallback((query: string): ExtendedStickyNote[] => {
    if (!query.trim()) return notes;
    
    const lowercaseQuery = query.toLowerCase();
    return notes.filter(note => 
      note.title.toLowerCase().includes(lowercaseQuery) ||
      note.content.toLowerCase().includes(lowercaseQuery) ||
      note.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
      note.category.toLowerCase().includes(lowercaseQuery)
    );
  }, [notes]);

  // 統計情報
  const getStatistics = useCallback(() => {
    const stats = {
      totalNotes: notes.length,
      notesByCategory: {} as Record<string, number>,
      notesByPriority: {} as Record<string, number>,
      averageSize: { width: 0, height: 0 },
      mostUsedTags: [] as Array<{ tag: string; count: number }>,
      creationTrend: [] as Array<{ date: string; count: number }>,
    };

    // カテゴリ別集計
    notes.forEach(note => {
      stats.notesByCategory[note.category] = (stats.notesByCategory[note.category] || 0) + 1;
      stats.notesByPriority[note.priority] = (stats.notesByPriority[note.priority] || 0) + 1;
    });

    // 平均サイズ
    if (notes.length > 0) {
      const totalWidth = notes.reduce((sum, note) => sum + note.size.width, 0);
      const totalHeight = notes.reduce((sum, note) => sum + note.size.height, 0);
      stats.averageSize = {
        width: totalWidth / notes.length,
        height: totalHeight / notes.length,
      };
    }

    // タグ使用統計
    const tagCounts: Record<string, number> = {};
    notes.forEach(note => {
      note.tags?.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    
    stats.mostUsedTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return stats;
  }, [notes]);

  // 永続化
  const save = useCallback((): boolean => {
    try {
      const data = {
        notes: notes.map(note => ({ ...note, isSelected: false })),
        groups,
        metadata: {
          version: '1.0',
          savedAt: new Date().toISOString(),
          projectId: selectedProjectId,
        },
      };

      const key = `sticky-notes-${selectedProjectId || 'default'}`;
      
      switch (config.persistenceMode) {
        case 'localStorage':
          localStorage.setItem(key, JSON.stringify(data));
          break;
        case 'sessionStorage':
          sessionStorage.setItem(key, JSON.stringify(data));
          break;
        case 'memory':
          // メモリ内保存は何もしない
          break;
      }

      console.log('StickyNoteManager: Data saved successfully');
      return true;
    } catch (error) {
      console.error('Failed to save sticky notes:', error);
      return false;
    }
  }, [notes, groups, selectedProjectId, config.persistenceMode]);

  const load = useCallback((): boolean => {
    try {
      const key = `sticky-notes-${selectedProjectId || 'default'}`;
      let dataString = '';

      switch (config.persistenceMode) {
        case 'localStorage':
          dataString = localStorage.getItem(key) || '';
          break;
        case 'sessionStorage':
          dataString = sessionStorage.getItem(key) || '';
          break;
        case 'memory':
          return false; // メモリ内保存では読み込み不可
      }

      if (dataString) {
        const data = JSON.parse(dataString);
        setNotes(data.notes || []);
        setGroups(data.groups || []);
        
        // zIndexの最大値を更新
        const maxZ = Math.max(...(data.notes?.map((n: ExtendedStickyNote) => n.zIndex) || [0]));
        setMaxZIndex(maxZ);
        
        console.log('StickyNoteManager: Data loaded successfully');
        return true;
      }
    } catch (error) {
      console.error('Failed to load sticky notes:', error);
    }
    
    return false;
  }, [selectedProjectId, config.persistenceMode]);

  // 初期化時にデータを読み込み
  useEffect(() => {
    if (initialNotes.length === 0) {
      load();
    }
  }, [load]);

  // API構築
  const api: StickyNoteManagerAPI = useMemo(() => ({
    // 基本CRUD
    createNote,
    updateNote,
    deleteNote,
    duplicateNote,
    
    // 位置・サイズ管理
    moveNote,
    resizeNote,
    snapToGrid: (id: string) => {
      const note = notes.find(n => n.id === id);
      if (!note) return false;
      return moveNote(id, note.position); // moveNoteでスナップ処理
    },
    autoArrange: (algorithm) => {
      console.log('Auto arrange not implemented:', algorithm);
    },
    
    // 表示管理
    bringToFront,
    sendToBack,
    toggleMinimize,
    toggleVisibility: toggleMinimize, // エイリアス
    
    // 選択・操作
    selectNote,
    selectAll,
    clearSelection,
    deleteSelected: () => {
      selectedNoteIds.forEach(id => deleteNote(id));
      clearSelection();
    },
    groupSelected: () => null, // TODO: 実装
    ungroupSelected: () => {}, // TODO: 実装
    
    // グループ管理（簡易実装）
    createGroup: () => '', // TODO: 実装
    updateGroup: () => false, // TODO: 実装
    deleteGroup: () => false, // TODO: 実装
    addToGroup: () => false, // TODO: 実装
    removeFromGroup: () => false, // TODO: 実装
    
    // 検索・フィルタリング
    searchNotes,
    filterByTag: (tags) => notes.filter(note => 
      tags.some(tag => note.tags?.includes(tag))
    ),
    filterByCategory: (category) => notes.filter(note => note.category === category),
    filterByPriority: (priority) => notes.filter(note => note.priority === priority),
    filterByDateRange: (start, end) => notes.filter(note => 
      note.createdAt >= start && note.createdAt <= end
    ),
    
    // タグ管理
    addTag: (noteId, tag) => {
      const note = notes.find(n => n.id === noteId);
      if (!note) return false;
      const newTags = [...(note.tags || []), tag];
      return updateNote(noteId, { tags: newTags });
    },
    removeTag: (noteId, tag) => {
      const note = notes.find(n => n.id === noteId);
      if (!note) return false;
      const newTags = (note.tags || []).filter(t => t !== tag);
      return updateNote(noteId, { tags: newTags });
    },
    getAllTags: () => {
      const allTags = new Set<string>();
      notes.forEach(note => {
        note.tags?.forEach(tag => allTags.add(tag));
      });
      return Array.from(allTags);
    },
    getTagUsage: () => {
      const usage: Record<string, number> = {};
      notes.forEach(note => {
        note.tags?.forEach(tag => {
          usage[tag] = (usage[tag] || 0) + 1;
        });
      });
      return usage;
    },
    
    // インポート・エクスポート
    exportNotes: (format) => {
      switch (format) {
        case 'json':
          return JSON.stringify(notes, null, 2);
        case 'csv':
          // CSV形式の実装（簡易版）
          const headers = 'ID,Title,Content,Category,Priority,Created\n';
          const rows = notes.map(note => 
            `"${note.id}","${note.title}","${note.content}","${note.category}","${note.priority}","${note.createdAt.toISOString()}"`
          ).join('\n');
          return headers + rows;
        case 'markdown':
          return notes.map(note => 
            `# ${note.title}\n\n${note.content}\n\n---\n`
          ).join('\n');
        default:
          return '';
      }
    },
    importNotes: () => false, // TODO: 実装
    
    // 履歴・元に戻す
    undo: () => false, // TODO: 実装
    redo: () => false, // TODO: 実装
    getHistory: () => history,
    clearHistory: () => setHistory([]),
    
    // 統計・分析
    getStatistics,
    
    // 永続化
    save,
    load,
    clear: () => {
      setNotes([]);
      setGroups([]);
      setSelectedNoteIds(new Set());
      setHistory([]);
      setHistoryIndex(-1);
    },
    
    // 状態取得
    getAllNotes: () => notes,
    getSelectedNotes: () => notes.filter(note => selectedNoteIds.has(note.id)),
    getVisibleNotes: () => notes.filter(note => !note.isMinimized),
    getNote: (id) => notes.find(note => note.id === id) || null,
    getGroups: () => groups,
    hasUnsavedChanges: () => hasChanges,
  }), [
    notes, groups, selectedNoteIds, history, hasChanges,
    createNote, updateNote, deleteNote, duplicateNote,
    moveNote, resizeNote, bringToFront, sendToBack, toggleMinimize,
    selectNote, selectAll, clearSelection, searchNotes, getStatistics,
    save, load
  ]);

  return <>{children(api)}</>;
};