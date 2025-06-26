import React from 'react';
import { Box, Paper, Tooltip, IconButton, Typography } from '@mui/material';
import { ZoomIn, ZoomOut, Restore, GetApp as ExportIcon } from '@mui/icons-material';
import type { Task, TaskFog } from '../../types/task';
import type { Holiday, Event } from '../../types/calendar';
import { TaskBar } from './TaskBar';
import { TaskFog as TaskFogComponent } from './TaskFog';
import { EnhancedTimeScale } from './EnhancedTimeScale';
import { CompositeBar } from './CompositeBar';
import { SearchBox } from '../Search/SearchBox';
import { SearchResultOverlay } from '../Search/SearchResultOverlay';
import { TaskProjectSidebarNested } from './TaskProjectSidebarNested';
import { TaskList } from './TaskList';
import { differenceInDays, startOfDay, addDays } from 'date-fns';
import { useAppStore } from '../../stores/useAppStore';
import { GanttExportDialog } from '../Export/GanttExportDialog';
import { getProjectById } from '../../data/sampleProjectTeams';

interface ProjectGanttChartProps {
  tasks: Task[];
  startDate: Date;
  endDate: Date;
  onTaskClick?: (task: Task) => void;
  taskFogs?: TaskFog[];
  showTaskFogs?: boolean;
  selectedTaskIds?: string[];
  onTaskSelect?: (taskId: string, isMultiSelect: boolean) => void;
  holidays?: Holiday[];
  events?: Event[];
  useEnhancedTimeScale?: boolean;
  onMonthChange?: (monthStart: Date, monthEnd: Date) => void;
  // プロジェクト選択用
  selectedTeamId?: string;
  selectedProjectId?: string;
  onProjectSelect?: (projectId: string) => void;
  // タスク作成用
  onTaskCreate?: (startDate: Date, endDate: Date, rowIndex?: number) => void;
}

interface SearchFilter {
  type: 'member' | 'tag' | 'progress' | 'priority' | 'status' | 'capacity';
  value: string;
  label: string;
}

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.25;
const DEFAULT_DAY_WIDTH = 30;

// カレンダー期間設定（2020-2040の20年間）
const CALENDAR_START_YEAR = 2020;
const CALENDAR_END_YEAR = 2040;

export const ProjectGanttChart: React.FC<ProjectGanttChartProps> = ({
  tasks,
  // startDate,  // 現在は拡張カレンダー範囲を使用
  // endDate,    // 現在は拡張カレンダー範囲を使用
  onTaskClick,
  taskFogs = [],
  showTaskFogs = true,
  selectedTaskIds = [],
  onTaskSelect,
  holidays = [],
  events = [],
  useEnhancedTimeScale = true,
  onMonthChange,
  // selectedTeamId, // 使用されていないためコメントアウト
  selectedProjectId,
  onProjectSelect,
  onTaskCreate,
}) => {
  const { updateTask } = useAppStore();
  const [zoomLevel, setZoomLevel] = React.useState(1);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchFilters, setSearchFilters] = React.useState<SearchFilter[]>([]);
  const chartContainerRef = React.useRef<HTMLDivElement>(null);
  const chartAreaRef = React.useRef<HTMLDivElement>(null);
  const [exportDialogOpen, setExportDialogOpen] = React.useState(false);
  
  // 検索結果オーバーレイの状態
  const [searchResultsVisible, setSearchResultsVisible] = React.useState(false);
  const [currentSearchIndex, setCurrentSearchIndex] = React.useState(0);
  
  // ドラッグ&ドロップ状態管理
  const [dragState, setDragState] = React.useState<{
    isDragging: boolean;
    taskId?: string;
    startX?: number;
    startLeft?: number;
    isResizing?: boolean;
    resizeHandle?: 'start' | 'end';
    ghostPosition?: { left: number; width: number };
  }>({
    isDragging: false,
  });
  
  // カレンダー期間を拡張（2020-2040の20年間）
  const extendedStartDate = new Date(CALENDAR_START_YEAR, 0, 1);
  const extendedEndDate = new Date(CALENDAR_END_YEAR, 11, 31);
  const chartStartDate = startOfDay(extendedStartDate);
  const totalDays = differenceInDays(extendedEndDate, chartStartDate) + 1;
  const dayWidth = DEFAULT_DAY_WIDTH * zoomLevel;
  const rowHeight = 40;

  // 仮想化のための可視範囲計算
  const [scrollLeft, setScrollLeft] = React.useState(0);
  const [containerWidth, setContainerWidth] = React.useState(0);
  
  // 可視範囲のバッファ（パフォーマンス向上のため）
  const VIRTUAL_BUFFER_DAYS = 30;
  const visibleStartDay = Math.max(0, Math.floor(scrollLeft / dayWidth) - VIRTUAL_BUFFER_DAYS);
  const visibleEndDay = Math.min(totalDays, Math.ceil((scrollLeft + containerWidth) / dayWidth) + VIRTUAL_BUFFER_DAYS);
  const visibleDays = visibleEndDay - visibleStartDay;

  // タスクを階層構造に整理
  const organizeTasksHierarchy = (tasks: Task[]) => {
    const rootTasks = tasks.filter(task => !task.parentId);
    const taskMap = new Map(tasks.map(task => [task.id, task]));
    
    const result: Task[] = [];
    
    rootTasks.forEach(rootTask => {
      result.push(rootTask);
      
      if (rootTask.isGroup && rootTask.children) {
        rootTask.children.forEach(childId => {
          const childTask = taskMap.get(childId);
          if (childTask) {
            result.push(childTask);
          }
        });
      }
    });
    
    return result;
  };

  // タスクフィルタリング機能
  const isTaskMatched = (task: Task) => {
    if (!searchQuery && searchFilters.length === 0) return true;

    // テキスト検索
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !task.title.toLowerCase().includes(query) &&
        !task.assignees.some(assignee => assignee.toLowerCase().includes(query)) &&
        !task.tags.some(tag => tag.toLowerCase().includes(query))
      ) {
        return false;
      }
    }

    // フィルタ検索
    for (const filter of searchFilters) {
      switch (filter.type) {
        case 'member':
          if (!task.assignees.some(assignee => 
            assignee.toLowerCase().includes(filter.value.toLowerCase())
          )) {
            return false;
          }
          break;
        case 'tag':
          if (!task.tags.some(tag => 
            tag.toLowerCase().includes(filter.value.toLowerCase())
          )) {
            return false;
          }
          break;
        case 'progress': {
          const progressMatch = filter.value.match(/([<>=]+)?(\d+)(-(\d+))?/);
          if (progressMatch) {
            const operator = progressMatch[1] || '=';
            const value1 = parseInt(progressMatch[2]);
            const value2 = progressMatch[4] ? parseInt(progressMatch[4]) : null;
            
            if (value2) {
              // 範囲指定
              if (task.progress < value1 || task.progress > value2) return false;
            } else {
              // 比較演算子
              switch (operator) {
                case '>':
                  if (task.progress <= value1) return false;
                  break;
                case '>=':
                  if (task.progress < value1) return false;
                  break;
                case '<':
                  if (task.progress >= value1) return false;
                  break;
                case '<=':
                  if (task.progress > value1) return false;
                  break;
                default:
                  if (task.progress !== value1) return false;
              }
            }
          }
          break;
        }
        case 'priority': {
          const priorityMatch = filter.value.match(/([<>=]+)?(\d+)(-(\d+))?/);
          if (priorityMatch) {
            const operator = priorityMatch[1] || '=';
            const value1 = parseInt(priorityMatch[2]);
            const value2 = priorityMatch[4] ? parseInt(priorityMatch[4]) : null;
            
            if (value2) {
              // 範囲指定
              if (task.priority < value1 || task.priority > value2) return false;
            } else {
              // 比較演算子
              switch (operator) {
                case '>':
                  if (task.priority <= value1) return false;
                  break;
                case '>=':
                  if (task.priority < value1) return false;
                  break;
                case '<':
                  if (task.priority >= value1) return false;
                  break;
                case '<=':
                  if (task.priority > value1) return false;
                  break;
                default:
                  if (task.priority !== value1) return false;
              }
            }
          }
          break;
        }
        case 'status':
          if (task.status !== filter.value) return false;
          break;
      }
    }

    return true;
  };

  const visibleTasks = organizeTasksHierarchy(tasks);
  const filteredTasks = visibleTasks.filter(isTaskMatched);
  const taskMap = new Map(tasks.map(task => [task.id, task]));

  // 検索がアクティブかどうか
  const isSearchActive = searchQuery || searchFilters.length > 0;
  const displayTasks = isSearchActive ? filteredTasks : visibleTasks;

  // 検索結果ナビゲーション
  const handleSearchResultNavigate = (direction: 'prev' | 'next') => {
    if (filteredTasks.length === 0) return;
    
    let newIndex = currentSearchIndex;
    if (direction === 'prev') {
      newIndex = currentSearchIndex > 0 ? currentSearchIndex - 1 : filteredTasks.length - 1;
    } else {
      newIndex = currentSearchIndex < filteredTasks.length - 1 ? currentSearchIndex + 1 : 0;
    }
    
    setCurrentSearchIndex(newIndex);
    
    // 選択されたタスクにスクロール
    const selectedTask = filteredTasks[newIndex];
    if (selectedTask && chartContainerRef.current) {
      const taskPosition = calculateTaskPosition(selectedTask);
      const containerWidth = chartContainerRef.current.clientWidth;
      const scrollLeft = Math.max(0, taskPosition.left - containerWidth / 2);
      
      chartContainerRef.current.scrollTo({
        left: scrollLeft,
        behavior: 'smooth',
      });
    }
  };

  // 検索実行時の処理
  const handleSearch = (query: string, filters: SearchFilter[]) => {
    setSearchQuery(query);
    setSearchFilters(filters);
    setCurrentSearchIndex(0);
    
    // 検索結果があり、検索クエリまたはフィルターがある場合にオーバーレイ表示
    const hasResults = filteredTasks.length > 0;
    const hasSearchCriteria = query.trim().length > 0 || filters.length > 0;
    setSearchResultsVisible(hasResults && hasSearchCriteria);
  };

  // ブラウザズーム制御のためのイベントリスナー
  React.useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    const handleWheelEvent = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey) {
        // ブラウザのズームを無効化
        event.preventDefault();
        
        const rect = container.getBoundingClientRect();
        const mouseX = event.clientX - rect.left + container.scrollLeft;
        
        // 現在のズーム中心での相対位置を計算
        const relativeX = mouseX / (totalDays * dayWidth);
        
        // ズーム量を計算
        const delta = event.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
        const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoomLevel + delta));
        
        if (newZoom !== zoomLevel) {
          setZoomLevel(newZoom);
          
          // マウス位置を中心にスクロール位置を調整
          requestAnimationFrame(() => {
            const newDayWidth = DEFAULT_DAY_WIDTH * newZoom;
            const newMouseX = relativeX * (totalDays * newDayWidth);
            const scrollX = newMouseX - (event.clientX - rect.left);
            container.scrollLeft = Math.max(0, scrollX);
          });
        }
      } else {
        // 通常のスクロール（横スクロールも可能に）
        if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
          event.preventDefault();
          container.scrollLeft += event.deltaX;
        }
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+Plus/Minusでのブラウザズームを無効化
      if ((event.ctrlKey || event.metaKey) && (event.key === '+' || event.key === '-' || event.key === '=' || event.key === '0')) {
        event.preventDefault();
        
        if (event.key === '+' || event.key === '=') {
          setZoomLevel(prev => Math.min(MAX_ZOOM, prev + ZOOM_STEP * 2));
        } else if (event.key === '-') {
          setZoomLevel(prev => Math.max(MIN_ZOOM, prev - ZOOM_STEP * 2));
        } else if (event.key === '0') {
          setZoomLevel(1);
        }
      }
    };

    // passive: falseでpreventDefaultを有効化
    container.addEventListener('wheel', handleWheelEvent, { passive: false });
    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('wheel', handleWheelEvent);
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [zoomLevel, totalDays, dayWidth]);

  // React用の空のハンドラー（実際の処理はuseEffectで行う）
  const handleWheel = () => {
    // useEffectのイベントリスナーで処理されるため、ここでは何もしない
  };

  // ズームコントロール
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(MAX_ZOOM, prev + ZOOM_STEP * 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(MIN_ZOOM, prev - ZOOM_STEP * 2));
  };

  const handleZoomReset = () => {
    setZoomLevel(1);
  };

  const calculateTaskPosition = (task: Task) => {
    const taskStart = startOfDay(task.startDate);
    const left = differenceInDays(taskStart, chartStartDate) * dayWidth;
    const width = Math.max((differenceInDays(task.endDate, taskStart) + 1) * dayWidth, dayWidth);
    return { left, width };
  };

  // ドラッグ&ドロップハンドラー
  const handleTaskMouseDown = (task: Task, isResizeHandle: boolean, resizeType?: 'start' | 'end') => {
    const taskPosition = calculateTaskPosition(task);
    
    setDragState({
      isDragging: true,
      taskId: task.id,
      startX: 0, // マウス移動時に設定
      startLeft: taskPosition.left,
      isResizing: isResizeHandle,
      resizeHandle: resizeType,
      ghostPosition: {
        left: taskPosition.left,
        width: taskPosition.width,
      },
    });
  };

  // マウス移動ハンドラー
  const handleMouseMove = React.useCallback((event: MouseEvent) => {
    if (!dragState.isDragging || !dragState.taskId || !chartContainerRef.current) return;

    const containerRect = chartContainerRef.current.getBoundingClientRect();
    const mouseX = event.clientX - containerRect.left + chartContainerRef.current.scrollLeft;
    
    if (dragState.startX === 0) {
      setDragState(prev => ({ ...prev, startX: mouseX }));
      return;
    }

    const deltaX = mouseX - dragState.startX!;
    const newLeft = Math.max(0, dragState.startLeft! + deltaX);
    
    // 日付グリッドにスナップ
    const snappedLeft = Math.round(newLeft / dayWidth) * dayWidth;
    
    if (dragState.isResizing && dragState.resizeHandle) {
      // リサイズ処理
      const currentTask = tasks.find(t => t.id === dragState.taskId);
      if (!currentTask) return;
      
      const currentPosition = calculateTaskPosition(currentTask);
      let newWidth = currentPosition.width;
      let adjustedLeft = currentPosition.left;
      
      if (dragState.resizeHandle === 'start') {
        // 開始日のリサイズ
        adjustedLeft = snappedLeft;
        newWidth = currentPosition.left + currentPosition.width - snappedLeft;
      } else {
        // 終了日のリサイズ
        newWidth = snappedLeft - currentPosition.left + dayWidth;
      }
      
      // 最小幅をdayWidthに制限
      if (newWidth < dayWidth) return;
      
      setDragState(prev => ({
        ...prev,
        ghostPosition: {
          left: adjustedLeft,
          width: newWidth,
        },
      }));
    } else {
      // 通常のドラッグ処理
      const currentPosition = dragState.ghostPosition!;
      setDragState(prev => ({
        ...prev,
        ghostPosition: {
          left: snappedLeft,
          width: currentPosition.width,
        },
      }));
    }
  }, [dragState, dayWidth, tasks, chartStartDate]);

  // マウスアップハンドラー
  const handleMouseUp = React.useCallback(() => {
    if (!dragState.isDragging || !dragState.taskId || !dragState.ghostPosition) {
      setDragState({ isDragging: false });
      return;
    }

    const task = tasks.find(t => t.id === dragState.taskId);
    if (!task) {
      setDragState({ isDragging: false });
      return;
    }

    // 新しい日付を計算
    const newStartDays = Math.round(dragState.ghostPosition.left / dayWidth);
    const newDurationDays = Math.round(dragState.ghostPosition.width / dayWidth);
    
    const newStartDate = addDays(chartStartDate, newStartDays);
    const newEndDate = addDays(newStartDate, newDurationDays - 1);

    // タスクを更新
    console.log('タスク更新:', {
      taskId: task.id,
      oldStart: task.startDate,
      oldEnd: task.endDate,
      newStart: newStartDate,
      newEnd: newEndDate,
    });

    updateTask(task.id, { 
      startDate: newStartDate, 
      endDate: newEndDate 
    });

    setDragState({ isDragging: false });
  }, [dragState, dayWidth, chartStartDate, tasks]);

  // マウスイベントリスナーの設定
  React.useEffect(() => {
    if (dragState.isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragState.isDragging, handleMouseMove, handleMouseUp]);

  // スクロール同期機能とスクロール位置の監視
  React.useEffect(() => {
    const chartContainer = chartContainerRef.current;
    const sidebarContainer = document.getElementById('task-sidebar-scroll-container');
    
    if (!chartContainer || !sidebarContainer) return;

    let isSyncing = false;

    const syncScrollTop = (source: HTMLElement, target: HTMLElement) => {
      if (isSyncing) return;
      isSyncing = true;
      target.scrollTop = source.scrollTop;
      requestAnimationFrame(() => {
        isSyncing = false;
      });
    };

    const handleChartScroll = () => {
      syncScrollTop(chartContainer, sidebarContainer);
      // 仮想化のための水平スクロール位置を更新
      setScrollLeft(chartContainer.scrollLeft);
    };

    const handleSidebarScroll = () => {
      syncScrollTop(sidebarContainer, chartContainer);
    };

    // コンテナサイズの監視
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    resizeObserver.observe(chartContainer);

    chartContainer.addEventListener('scroll', handleChartScroll, { passive: true });
    sidebarContainer.addEventListener('scroll', handleSidebarScroll, { passive: true });

    // 初期値の設定
    setContainerWidth(chartContainer.clientWidth);
    setScrollLeft(chartContainer.scrollLeft);

    return () => {
      chartContainer.removeEventListener('scroll', handleChartScroll);
      sidebarContainer.removeEventListener('scroll', handleSidebarScroll);
      resizeObserver.disconnect();
    };
  }, [selectedProjectId]); // プロジェクト変更時に再同期

  // ダブルクリックによるタスク作成
  const handleChartDoubleClick = (event: React.MouseEvent) => {
    if (!onTaskCreate || !chartContainerRef.current || !selectedProjectId) return;

    const rect = chartContainerRef.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left + chartContainerRef.current.scrollLeft;
    const mouseY = event.clientY - rect.top;

    // クリック位置を日付に変換
    const clickedDay = Math.floor(mouseX / dayWidth);
    const startDate = addDays(chartStartDate, clickedDay);
    const endDate = addDays(startDate, 0); // 1日のタスクとして作成

    // クリック位置から行インデックスを計算
    const rowIndex = Math.floor(mouseY / rowHeight);

    console.log('新しいタスクを作成:', {
      startDate,
      endDate,
      rowIndex,
      clickPosition: { x: mouseX, y: mouseY },
    });

    onTaskCreate(startDate, endDate, rowIndex);
  };

  return (
    <Paper sx={{ 
      overflow: 'hidden', 
      height: '100%', 
      position: 'relative',
      background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      margin: 0, // マージンを完全にリセット
      borderRadius: 0, // 角丸を無効化して完全接着
      borderLeft: 'none', // 左側の境界線を除去
    }}>
      {/* ズームコントロール */}
      <Box sx={{ 
        position: 'absolute', 
        top: 16, 
        right: 16, 
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
        borderRadius: 2,
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        border: '1px solid rgba(0,0,0,0.08)',
        p: 1
      }}>
        <Typography variant="caption" sx={{ 
          px: 1,
          fontWeight: 'bold',
          color: 'primary.main',
          minWidth: 40,
          textAlign: 'center',
        }}>
          {Math.round(zoomLevel * 100)}%
        </Typography>
        <Tooltip title="ズームアウト">
          <IconButton size="small" onClick={handleZoomOut} disabled={zoomLevel <= MIN_ZOOM}>
            <ZoomOut />
          </IconButton>
        </Tooltip>
        <Tooltip title="リセット">
          <IconButton size="small" onClick={handleZoomReset}>
            <Restore />
          </IconButton>
        </Tooltip>
        <Tooltip title="ズームイン">
          <IconButton size="small" onClick={handleZoomIn} disabled={zoomLevel >= MAX_ZOOM}>
            <ZoomIn />
          </IconButton>
        </Tooltip>
        {selectedProjectId && (
          <Tooltip title="エクスポート">
            <IconButton size="small" onClick={() => setExportDialogOpen(true)}>
              <ExportIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* ズームヒント */}
      <Box sx={{
        position: 'absolute',
        bottom: 16,
        right: 16,
        zIndex: 10,
        background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 100%)',
        color: 'white',
        borderRadius: 2,
        px: 2,
        py: 1.5,
        fontSize: '0.75rem',
        fontWeight: 'medium',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}>
        🔍 Ctrl + マウスホイール / Ctrl + ±キーでズーム
      </Box>

      {/* 検索ボックス */}
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
        <SearchBox
          onSearch={handleSearch}
          onFiltersChange={setSearchFilters}
        />
      </Box>

      {/* 検索結果表示 */}
      {isSearchActive && (
        <Box sx={{ 
          px: 2, 
          py: 1, 
          backgroundColor: filteredTasks.length > 0 ? '#e3f2fd' : '#ffebee',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}>
          <Typography variant="caption" sx={{ 
            color: filteredTasks.length > 0 ? '#1976d2' : '#d32f2f',
            fontWeight: 'bold',
          }}>
            🔍 {filteredTasks.length}件のタスクが見つかりました
          </Typography>
          {searchFilters.length > 0 && (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              • {searchFilters.length}個のフィルタ適用中
            </Typography>
          )}
        </Box>
      )}

      <Box sx={{ display: 'flex', height: isSearchActive ? 'calc(100% - 120px)' : 'calc(100% - 80px)' }}>
        {/* タスク・プロジェクトサイドバー（左側） */}
        <TaskProjectSidebarNested 
          rowHeight={rowHeight}
          onProjectSelect={onProjectSelect}
          selectedProjectId={selectedProjectId}
        />

        {/* ガントチャート（中央） */}
        <Box 
          ref={chartContainerRef}
          sx={{ 
            flex: 1, 
            overflow: 'auto', 
            position: 'relative',
            cursor: zoomLevel !== 1 ? 'grab' : 'default',
            background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
            // ブラウザズーム制御のためのCSS
            touchAction: 'manipulation', // タッチデバイスでのピンチズーム無効化
            userSelect: 'none', // テキスト選択無効化
            '&:active': {
              cursor: zoomLevel !== 1 ? 'grabbing' : 'default',
            },
            // フォーカス可能にしてキーボードイベントを受け取る
            tabIndex: 0,
            outline: 'none',
          }}
          onWheel={handleWheel}
        >
          {/* タイムスケール（固定ヘッダー） */}
          {useEnhancedTimeScale ? (
            <EnhancedTimeScale
              startDate={chartStartDate}
              totalDays={totalDays}
              dayWidth={dayWidth}
              showWeekends={true}
              showToday={true}
              scrollContainer={chartContainerRef.current}
              onMonthChange={onMonthChange}
              holidays={holidays}
              events={events}
            />
          ) : (
            <Box sx={{ position: 'sticky', top: 0, zIndex: 3, backgroundColor: 'background.paper' }}>
              {/* 従来のTimeScaleを使用する場合 */}
            </Box>
          )}

          {/* チャートエリア */}
          <Box 
            ref={chartAreaRef}
            onDoubleClick={handleChartDoubleClick}
            sx={{ 
              position: 'relative', 
              minHeight: Math.max(displayTasks.length * rowHeight, 400), // 最小高さを確保
              width: totalDays * dayWidth,
              background: 'linear-gradient(90deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)',
            }}
          >
            {/* プロジェクト未選択時のメッセージ */}
            {!selectedProjectId && (
              <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                color: 'text.secondary',
                zIndex: 2,
              }}>
                <Typography variant="h6" sx={{ mb: 1, opacity: 0.7 }}>
                  📊 プロジェクトを選択してガントチャートを表示
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.5 }}>
                  左側のプロジェクト一覧からプロジェクトを選択してください
                </Typography>
              </Box>
            )}
            {/* 今日の線 */}
            {(() => {
              const today = new Date();
              const todayOffset = differenceInDays(startOfDay(today), chartStartDate);
              if (todayOffset >= 0 && todayOffset <= totalDays) {
                return (
                  <Box sx={{
                    position: 'absolute',
                    left: todayOffset * dayWidth + dayWidth / 2 - 1,
                    top: 0,
                    bottom: 0,
                    width: 3,
                    background: 'linear-gradient(180deg, #ef4444 0%, #dc2626 100%)',
                    zIndex: 3,
                    boxShadow: '0 0 8px rgba(239, 68, 68, 0.5)',
                    pointerEvents: 'none',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 8,
                      height: 8,
                      backgroundColor: '#ef4444',
                      borderRadius: '50%',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }
                  }} />
                );
              }
              return null;
            })()}

            {/* 週末のハイライト（仮想化対応） */}
            {Array.from({ length: visibleDays }).map((_, offset) => {
              const dayIndex = visibleStartDay + offset;
              if (dayIndex >= totalDays) return null;
              
              const date = addDays(chartStartDate, dayIndex);
              const isWeekend = date.getDay() === 0 || date.getDay() === 6;
              
              if (!isWeekend) return null;
              
              return (
                <Box
                  key={`weekend-${dayIndex}`}
                  sx={{
                    position: 'absolute',
                    left: dayIndex * dayWidth,
                    top: 0,
                    bottom: 0,
                    width: dayWidth,
                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                    zIndex: 0,
                    pointerEvents: 'none',
                  }}
                />
              );
            })}

            {/* グリッド線（仮想化対応） */}
            {(() => {
              const startWeek = Math.floor(visibleStartDay / 7);
              const endWeek = Math.ceil(visibleEndDay / 7);
              const visibleWeeks = endWeek - startWeek;
              
              return Array.from({ length: visibleWeeks }).map((_, offset) => {
                const weekIndex = startWeek + offset;
                return (
                  <Box
                    key={`week-${weekIndex}`}
                    sx={{
                      position: 'absolute',
                      left: weekIndex * 7 * dayWidth,
                      top: 0,
                      bottom: 0,
                      width: 1,
                      backgroundColor: 'rgba(0, 0, 0, 0.1)',
                      zIndex: 1,
                      pointerEvents: 'none',
                    }}
                  />
                );
              });
            })()}

            {/* タスクフォグ（背景） */}
            {showTaskFogs && taskFogs.map((fog) => {
              const fogLeft = differenceInDays(startOfDay(fog.startDate), chartStartDate) * dayWidth;
              const fogWidth = (differenceInDays(fog.endDate, fog.startDate) + 1) * dayWidth;
              return (
                <TaskFogComponent
                  key={fog.id}
                  fog={fog}
                  chartHeight={displayTasks.length * rowHeight}
                  left={fogLeft}
                  width={fogWidth}
                  onClick={() => console.log('Task fog clicked:', fog)}
                />
              );
            })}

            {/* 合成バー（グループタスク） */}
            {displayTasks.map((task, index) => {
              if (task.isGroup && task.children) {
                const childTasks = task.children
                  .map(childId => taskMap.get(childId))
                  .filter(Boolean) as Task[];
                const { left, width } = calculateTaskPosition(task);
                
                return (
                  <CompositeBar
                    key={`composite-${task.id}`}
                    groupTask={task}
                    childTasks={childTasks}
                    top={index * rowHeight + 5}
                    left={left}
                    width={width}
                    height={rowHeight - 10}
                    dayWidth={dayWidth}
                    chartStartDate={chartStartDate}
                    onClick={() => onTaskClick?.(task)}
                    isSelected={selectedTaskIds.includes(task.id)}
                  />
                );
              }
              return null;
            })}

            {/* ドラッグ中のゴーストバー */}
            {dragState.isDragging && dragState.ghostPosition && (
              <Box
                sx={{
                  position: 'absolute',
                  top: displayTasks.findIndex(t => t.id === dragState.taskId) * rowHeight + 5,
                  left: dragState.ghostPosition.left,
                  width: dragState.ghostPosition.width,
                  height: rowHeight - 10,
                  backgroundColor: 'primary.main',
                  opacity: 0.5,
                  borderRadius: 1,
                  border: '2px dashed #ffffff',
                  zIndex: 30,
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>
                  {dragState.isResizing ? 'リサイズ中' : '移動中'}
                </Typography>
              </Box>
            )}

            {/* タスクバー（前景） */}
            {displayTasks.map((task, index) => {
              if (task.isGroup) return null; // グループタスクは合成バーで表示
              
              const { left, width } = calculateTaskPosition(task);
              const isDraggingThis = dragState.isDragging && dragState.taskId === task.id;
              
              return (
                <TaskBar
                  key={task.id}
                  task={task}
                  top={index * rowHeight + 5}
                  left={left}
                  width={width}
                  height={rowHeight - 10}
                  onClick={() => onTaskClick?.(task)}
                  onMouseDown={(isResizeHandle, resizeType) => 
                    handleTaskMouseDown(task, isResizeHandle, resizeType)
                  }
                  isSelected={selectedTaskIds.includes(task.id)}
                  isDragging={isDraggingThis}
                  isResizing={isDraggingThis && dragState.isResizing}
                  showResizeHandles={selectedTaskIds.includes(task.id) && !dragState.isDragging}
                />
              );
            })}
          </Box>
        </Box>

        {/* タスク一覧サイドバー（右側） */}
        {selectedProjectId && displayTasks.length > 0 && (
          <Box sx={{ 
            width: 280, 
            borderLeft: '2px solid rgba(0,0,0,0.08)', 
            overflow: 'auto',
            background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
            zIndex: 2,
            boxShadow: 'inset -1px 0 0 rgba(255,255,255,0.8), -2px 0 8px rgba(0,0,0,0.05)',
          }}>
            <TaskList 
              tasks={displayTasks} 
              rowHeight={rowHeight}
              selectedTaskIds={selectedTaskIds}
              onTaskSelect={onTaskSelect}
            />
          </Box>
        )}
      </Box>

      {/* エクスポートダイアログ */}
      <GanttExportDialog
        open={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
        projectName={selectedProjectId ? getProjectById(selectedProjectId)?.name : undefined}
      />

      {/* 検索結果オーバーレイ */}
      <SearchResultOverlay
        isVisible={searchResultsVisible}
        searchQuery={searchQuery}
        matchedTasks={filteredTasks}
        currentIndex={currentSearchIndex}
        onNavigate={handleSearchResultNavigate}
        onClose={() => setSearchResultsVisible(false)}
        onTaskSelect={onTaskClick}
      />
    </Paper>
  );
};