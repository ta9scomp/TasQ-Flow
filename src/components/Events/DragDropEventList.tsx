import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Chip,
  Paper,
  TextField,
  InputAdornment,
  Tooltip,
  Menu,
  MenuItem,
  Divider,
  // Button,
  // Dialog,
  // DialogTitle,
  // DialogContent,
  // DialogActions,
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel,
  Avatar,
  Collapse,
} from '@mui/material';
import {
  DragIndicator as DragIcon,
  Event as EventIcon,
  Today as HolidayIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreIcon,
  // FilterList as FilterIcon,
  // Visibility as VisibilityIcon,
  // VisibilityOff as VisibilityOffIcon,
  // Group as GroupIcon,
  ExpandLess,
  ExpandMore,
  Warning as ConflictIcon,
  Schedule as RecurringIcon,
  CheckBox as CheckboxIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import type { EventManagerAPI } from './EventGroupManager';
import type { Event, Holiday } from '../../types/calendar';

// ドラッグ&ドロップの状態
interface DragState {
  isDragging: boolean;
  draggedItem: {
    type: 'event' | 'holiday';
    id: string;
    data: Event | Holiday;
  } | null;
  dropZone: string | null;
}

// フィルター設定
interface FilterState {
  query: string;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  tags: string[];
  users: string[];
  eventTypes: Array<'event' | 'holiday'>;
  showCompleted: boolean;
  showRecurring: boolean;
  showConflicts: boolean;
}

// 表示設定
interface DisplaySettings {
  groupBy: 'none' | 'date' | 'tag' | 'user' | 'group';
  sortBy: 'date' | 'name' | 'created' | 'priority';
  sortOrder: 'asc' | 'desc';
  itemsPerPage: number;
  showDetails: boolean;
  compactMode: boolean;
}

interface DragDropEventListProps {
  api: EventManagerAPI;
  onEventSelect?: (event: Event) => void;
  onHolidaySelect?: (holiday: Holiday) => void;
  onEventDrop?: (eventId: string, targetDate: Date) => boolean;
  enableDragDrop?: boolean;
  enableGrouping?: boolean;
  enableFiltering?: boolean;
  height?: string | number;
  maxHeight?: string | number;
}

export const DragDropEventList: React.FC<DragDropEventListProps> = ({
  api,
  onEventSelect,
  onHolidaySelect,
  // onEventDrop,
  enableDragDrop = true,
  // enableGrouping = true,
  enableFiltering = true,
  height = '100%',
  maxHeight = '800px',
}) => {
  // 状態管理
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedItem: null,
    dropZone: null,
  });

  const [filterState, setFilterState] = useState<FilterState>({
    query: '',
    dateRange: { start: null, end: null },
    tags: [],
    users: [],
    eventTypes: ['event', 'holiday'],
    showCompleted: true,
    showRecurring: true,
    showConflicts: true,
  });

  const [displaySettings, setDisplaySettings] = useState<DisplaySettings>({
    groupBy: 'date',
    sortBy: 'date',
    sortOrder: 'asc',
    itemsPerPage: 50,
    showDetails: true,
    compactMode: false,
  });

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    itemId: string;
    itemType: 'event' | 'holiday';
  } | null>(null);

  const listRef = useRef<HTMLDivElement>(null);

  // データ取得
  const events = api.getAllEvents();
  const holidays = api.getAllHolidays();
  const eventGroups = api.getEventGroups();
  const holidayGroups = api.getHolidayGroups();
  const conflicts = api.detectConflicts();

  // フィルタリング済みデータ
  const filteredItems = useMemo(() => {
    let items: Array<{
      type: 'event' | 'holiday';
      data: Event | Holiday;
      conflicts: string[];
    }> = [];

    // イベントの追加
    if (filterState.eventTypes.includes('event')) {
      events.forEach(event => {
        const eventConflicts = conflicts
          .filter(c => c.eventIds.includes(event.id))
          .map(c => c.id);

        items.push({
          type: 'event',
          data: event,
          conflicts: eventConflicts,
        });
      });
    }

    // 祝日の追加
    if (filterState.eventTypes.includes('holiday')) {
      holidays.forEach(holiday => {
        items.push({
          type: 'holiday',
          data: holiday,
          conflicts: [],
        });
      });
    }

    // クエリフィルタリング
    if (filterState.query) {
      const query = filterState.query.toLowerCase();
      items = items.filter(item => 
        item.data.name.toLowerCase().includes(query) ||
        (item.data.description && item.data.description.toLowerCase().includes(query)) ||
        (item.type === 'event' && (item.data as Event).tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }

    // 日付範囲フィルタリング
    if (filterState.dateRange.start && filterState.dateRange.end) {
      items = items.filter(item => {
        const itemDate = item.type === 'event' ? (item.data as Event).startDate : (item.data as Holiday).date;
        return itemDate >= filterState.dateRange.start! && itemDate <= filterState.dateRange.end!;
      });
    }

    // タグフィルタリング
    if (filterState.tags.length > 0) {
      items = items.filter(item => 
        item.type === 'event' && 
        filterState.tags.some(tag => (item.data as Event).tags.includes(tag))
      );
    }

    // 完了済みフィルタリング
    if (!filterState.showCompleted) {
      items = items.filter(item => 
        item.type === 'holiday' || 
        !(item.data as Event).isCompleted
      );
    }

    // 繰り返しフィルタリング
    if (!filterState.showRecurring) {
      items = items.filter(item => !item.data.isRecurring);
    }

    // 競合フィルタリング
    if (!filterState.showConflicts) {
      items = items.filter(item => item.conflicts.length === 0);
    }

    return items;
  }, [events, holidays, conflicts, filterState]);

  // ソート
  const sortedItems = useMemo(() => {
    const sorted = [...filteredItems].sort((a, b) => {
      let comparison = 0;

      switch (displaySettings.sortBy) {
        case 'date': {
          const dateA = a.type === 'event' ? (a.data as Event).startDate : (a.data as Holiday).date;
          const dateB = b.type === 'event' ? (b.data as Event).startDate : (b.data as Holiday).date;
          comparison = dateA.getTime() - dateB.getTime();
          break;
        }
        case 'name':
          comparison = a.data.name.localeCompare(b.data.name);
          break;
        case 'created': {
          const eventA = a.data as Event & { metadata?: { createdAt?: Date } };
          const eventB = b.data as Event & { metadata?: { createdAt?: Date } };
          const createdA = a.type === 'event' ? eventA.metadata?.createdAt || new Date(0) : new Date(0);
          const createdB = b.type === 'event' ? eventB.metadata?.createdAt || new Date(0) : new Date(0);
          comparison = createdA.getTime() - createdB.getTime();
          break;
        }
        default:
          comparison = 0;
      }

      return displaySettings.sortOrder === 'desc' ? -comparison : comparison;
    });

    return sorted;
  }, [filteredItems, displaySettings.sortBy, displaySettings.sortOrder]);

  // グループ化
  const groupedItems = useMemo(() => {
    if (displaySettings.groupBy === 'none') {
      return [{ key: 'all', items: sortedItems }];
    }

    const groups = new Map<string, typeof sortedItems>();

    sortedItems.forEach(item => {
      let groupKey = '';

      switch (displaySettings.groupBy) {
        case 'date': {
          const itemDate = item.type === 'event' ? (item.data as Event).startDate : (item.data as Holiday).date;
          groupKey = format(itemDate, 'yyyy-MM-dd');
          break;
        }
        case 'tag':
          if (item.type === 'event') {
            const tags = (item.data as Event).tags;
            groupKey = tags.length > 0 ? tags[0] : '未分類';
          } else {
            groupKey = '祝日';
          }
          break;
        case 'user':
          groupKey = item.type === 'event' ? (item.data as Event).userId : 'システム';
          break;
        case 'group':
          if (item.type === 'event') {
            const eventGroup = eventGroups.find(g => g.eventIds.includes(item.data.id));
            groupKey = eventGroup ? eventGroup.name : '未分類';
          } else {
            const holidayGroup = holidayGroups.find(g => g.holidayIds.includes(item.data.id));
            groupKey = holidayGroup ? holidayGroup.name : '祝日';
          }
          break;
        default:
          groupKey = 'その他';
      }

      if (!groups.has(groupKey)) {
        groups.set(groupKey, []);
      }
      groups.get(groupKey)!.push(item);
    });

    return Array.from(groups.entries())
      .map(([key, items]) => ({ key, items }))
      .sort((a, b) => a.key.localeCompare(b.key));
  }, [sortedItems, displaySettings.groupBy, eventGroups, holidayGroups]);

  // ドラッグ開始
  const handleDragStart = useCallback((e: React.DragEvent, item: typeof filteredItems[0]) => {
    if (!enableDragDrop) return;

    setDragState({
      isDragging: true,
      draggedItem: {
        type: item.type,
        id: item.data.id,
        data: item.data,
      },
      dropZone: null,
    });

    // ドラッグデータを設定
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: item.type,
      id: item.data.id,
      data: item.data,
    }));

    e.dataTransfer.effectAllowed = 'move';
  }, [enableDragDrop]);

  // ドラッグ終了
  const handleDragEnd = useCallback(() => {
    setDragState({
      isDragging: false,
      draggedItem: null,
      dropZone: null,
    });
  }, []);

  // アイテム選択
  const handleItemClick = useCallback((item: typeof filteredItems[0]) => {
    if (item.type === 'event') {
      onEventSelect?.(item.data as Event);
    } else {
      onHolidaySelect?.(item.data as Holiday);
    }
  }, [onEventSelect, onHolidaySelect]);

  // 右クリックメニュー
  const handleContextMenu = useCallback((e: React.MouseEvent, item: typeof filteredItems[0]) => {
    e.preventDefault();
    setContextMenu({
      mouseX: e.clientX - 2,
      mouseY: e.clientY - 4,
      itemId: item.data.id,
      itemType: item.type,
    });
  }, []);

  // アイテムレンダリング
  const renderItem = useCallback((item: typeof filteredItems[0]) => {
    const isEvent = item.type === 'event';
    const eventData = item.data as Event;
    const holidayData = item.data as Holiday;
    const hasConflicts = item.conflicts.length > 0;

    const itemDate = isEvent ? eventData.startDate : holidayData.date;
    const itemIcon = isEvent ? <EventIcon /> : <HolidayIcon />;

    return (
      <ListItem
        key={item.data.id}
        draggable={enableDragDrop}
        onDragStart={(e) => handleDragStart(e, item)}
        onDragEnd={handleDragEnd}
        onClick={() => handleItemClick(item)}
        onContextMenu={(e) => handleContextMenu(e, item)}
        sx={{
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          mb: 0.5,
          backgroundColor: 'background.paper',
          opacity: dragState.isDragging && dragState.draggedItem?.id === item.data.id ? 0.5 : 1,
          cursor: enableDragDrop ? 'grab' : 'pointer',
          '&:hover': {
            backgroundColor: 'action.hover',
          },
          '&:active': {
            cursor: enableDragDrop ? 'grabbing' : 'pointer',
          },
        }}
      >
        {enableDragDrop && (
          <ListItemIcon sx={{ minWidth: 32 }}>
            <DragIcon color="action" />
          </ListItemIcon>
        )}

        <ListItemIcon sx={{ minWidth: 40 }}>
          <Avatar
            sx={{
              bgcolor: item.data.color,
              width: 32,
              height: 32,
            }}
          >
            {itemIcon}
          </Avatar>
        </ListItemIcon>

        <ListItemText
          primary={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                {item.data.name}
              </Typography>
              
              {/* 状態インジケーター */}
              {isEvent && eventData.isRecurring && (
                <Tooltip title="繰り返しイベント">
                  <RecurringIcon fontSize="small" color="info" />
                </Tooltip>
              )}
              
              {isEvent && eventData.hasCheckbox && (
                <Tooltip title={eventData.isCompleted ? '完了' : '未完了'}>
                  <CheckboxIcon 
                    fontSize="small" 
                    color={eventData.isCompleted ? 'success' : 'disabled'} 
                  />
                </Tooltip>
              )}
              
              {hasConflicts && (
                <Tooltip title={`${item.conflicts.length}件の競合`}>
                  <ConflictIcon fontSize="small" color="warning" />
                </Tooltip>
              )}
            </Box>
          }
          secondary={
            displaySettings.showDetails && (
              <Box sx={{ mt: 0.5 }}>
                <Typography variant="caption" display="block" color="text.secondary">
                  {format(itemDate, 'yyyy年MM月dd日 (E)', { locale: ja })}
                </Typography>
                
                {isEvent && eventData.endDate && (
                  <Typography variant="caption" display="block" color="text.secondary">
                    {format(eventData.startDate, 'HH:mm')} - {format(eventData.endDate, 'HH:mm')}
                  </Typography>
                )}
                
                {item.data.description && (
                  <Typography variant="caption" display="block" color="text.secondary">
                    {item.data.description.substring(0, 50)}...
                  </Typography>
                )}
                
                {isEvent && eventData.tags.length > 0 && (
                  <Box sx={{ mt: 0.5, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {eventData.tags.slice(0, 3).map(tag => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        variant="outlined"
                        sx={{ height: 16, fontSize: '0.6rem' }}
                      />
                    ))}
                    {eventData.tags.length > 3 && (
                      <Typography variant="caption" color="text.secondary">
                        +{eventData.tags.length - 3}
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            )
          }
        />

        <ListItemSecondaryAction>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleContextMenu(e, item);
            }}
          >
            <MoreIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  }, [
    enableDragDrop, displaySettings.showDetails, dragState,
    handleDragStart, handleDragEnd, handleItemClick, handleContextMenu
  ]);

  // フィルターコントロール
  const renderFilterControls = () => {
    if (!enableFiltering) return null;

    return (
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <TextField
          fullWidth
          size="small"
          placeholder="イベント・祝日を検索..."
          value={filterState.query}
          onChange={(e) => setFilterState(prev => ({ ...prev, query: e.target.value }))}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>グループ化</InputLabel>
            <Select
              value={displaySettings.groupBy}
              label="グループ化"
              onChange={(e) => setDisplaySettings(prev => ({ 
                ...prev, 
                groupBy: e.target.value as DisplaySettings['groupBy'] 
              }))}
            >
              <MenuItem value="none">なし</MenuItem>
              <MenuItem value="date">日付</MenuItem>
              <MenuItem value="tag">タグ</MenuItem>
              <MenuItem value="user">ユーザー</MenuItem>
              <MenuItem value="group">グループ</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>ソート</InputLabel>
            <Select
              value={displaySettings.sortBy}
              label="ソート"
              onChange={(e) => setDisplaySettings(prev => ({ 
                ...prev, 
                sortBy: e.target.value as DisplaySettings['sortBy'] 
              }))}
            >
              <MenuItem value="date">日付</MenuItem>
              <MenuItem value="name">名前</MenuItem>
              <MenuItem value="created">作成日</MenuItem>
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={filterState.showCompleted}
                onChange={(e) => setFilterState(prev => ({ 
                  ...prev, 
                  showCompleted: e.target.checked 
                }))}
              />
            }
            label="完了済み"
          />

          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={filterState.showRecurring}
                onChange={(e) => setFilterState(prev => ({ 
                  ...prev, 
                  showRecurring: e.target.checked 
                }))}
              />
            }
            label="繰り返し"
          />
        </Box>
      </Box>
    );
  };

  return (
    <Paper sx={{ height, maxHeight, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {renderFilterControls()}

      <Box sx={{ flex: 1, overflow: 'auto' }} ref={listRef}>
        {groupedItems.map((group) => (
          <Box key={group.key}>
            {displaySettings.groupBy !== 'none' && (
              <Box
                sx={{
                  p: 1,
                  backgroundColor: 'action.hover',
                  borderBottom: 1,
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  const newExpanded = new Set(expandedGroups);
                  if (newExpanded.has(group.key)) {
                    newExpanded.delete(group.key);
                  } else {
                    newExpanded.add(group.key);
                  }
                  setExpandedGroups(newExpanded);
                }}
              >
                {expandedGroups.has(group.key) ? <ExpandLess /> : <ExpandMore />}
                <Typography variant="subtitle2" sx={{ ml: 1 }}>
                  {group.key} ({group.items.length})
                </Typography>
              </Box>
            )}

            <Collapse in={displaySettings.groupBy === 'none' || expandedGroups.has(group.key)}>
              <List sx={{ p: 1 }}>
                {group.items.map((item) => renderItem(item))}
              </List>
            </Collapse>
          </Box>
        ))}

        {groupedItems.length === 0 && (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              条件に一致するアイテムが見つかりません
            </Typography>
          </Box>
        )}
      </Box>

      {/* 右クリックメニュー */}
      <Menu
        open={contextMenu !== null}
        onClose={() => setContextMenu(null)}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={() => {
          console.log('Edit action triggered for:', contextMenu?.itemId);
          setContextMenu(null);
        }}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          <ListItemText>編集</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={() => {
          // 複製
          if (contextMenu?.itemType === 'event' && contextMenu.itemId) {
            api.duplicateEvent(contextMenu.itemId);
          }
          setContextMenu(null);
        }}>
          <ListItemIcon><AddIcon fontSize="small" /></ListItemIcon>
          <ListItemText>複製</ListItemText>
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={() => {
          // 削除
          if (contextMenu?.itemType === 'event' && contextMenu.itemId) {
            api.deleteEvent(contextMenu.itemId);
          } else if (contextMenu?.itemId) {
            api.deleteHoliday(contextMenu.itemId);
          }
          setContextMenu(null);
        }}>
          <ListItemIcon><DeleteIcon fontSize="small" /></ListItemIcon>
          <ListItemText>削除</ListItemText>
        </MenuItem>
      </Menu>

      {/* 統計情報 */}
      <Box sx={{ p: 1, borderTop: 1, borderColor: 'divider', backgroundColor: 'background.default' }}>
        <Typography variant="caption" color="text.secondary">
          表示中: {filteredItems.length}件 | 
          イベント: {events.length}件 | 
          祝日: {holidays.length}件
          {conflicts.length > 0 && ` | 競合: ${conflicts.length}件`}
        </Typography>
      </Box>
    </Paper>
  );
};