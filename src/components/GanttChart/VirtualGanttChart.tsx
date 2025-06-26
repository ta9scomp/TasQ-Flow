import React from 'react';
import { Box, Paper, Tooltip, IconButton, Typography } from '@mui/material';
import { ZoomIn, ZoomOut, Restore } from '@mui/icons-material';
import type { Task, TaskFog } from '../../types/task';
import type { Holiday, Event } from '../../types/calendar';
import { TaskBar } from './TaskBar';
import { TaskFog as TaskFogComponent } from './TaskFog';
import { TimeScale } from './TimeScale';
import { EnhancedTimeScale } from './EnhancedTimeScale';
import { TaskList } from './TaskList';
import { CompositeBar } from './CompositeBar';
import { SearchBox } from '../Search/SearchBox';
import { differenceInDays, startOfDay, addDays } from 'date-fns';

interface VirtualGanttChartProps {
  tasks: Task[];
  startDate: Date;
  endDate: Date;
  onTaskClick?: (task: Task) => void;
  taskFogs?: TaskFog[];
  showTaskFogs?: boolean;
  selectedTaskIds?: string[];
  onTaskSelect?: (taskId: string, isMultiSelect: boolean) => void;
  // カレンダー統合機能
  holidays?: Holiday[];
  events?: Event[];
  useEnhancedTimeScale?: boolean;
  onMonthChange?: (monthStart: Date, monthEnd: Date) => void;
}

interface SearchFilter {
  type: 'member' | 'tag' | 'progress' | 'priority' | 'status' | 'capacity';
  value: string;
  label: string;
}

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 5;
const ZOOM_STEP = 0.1;
const DEFAULT_DAY_WIDTH = 30;

export const VirtualGanttChart: React.FC<VirtualGanttChartProps> = ({
  tasks,
  startDate,
  endDate,
  onTaskClick,
  taskFogs = [],
  showTaskFogs = true,
  selectedTaskIds = [],
  onTaskSelect,
  holidays = [],
  events = [],
  useEnhancedTimeScale = true,
  onMonthChange,
}) => {
  const [zoomLevel, setZoomLevel] = React.useState(1);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchFilters, setSearchFilters] = React.useState<SearchFilter[]>([]);
  const chartContainerRef = React.useRef<HTMLDivElement>(null);
  const chartAreaRef = React.useRef<HTMLDivElement>(null);
  
  const chartStartDate = startOfDay(startDate);
  const totalDays = differenceInDays(endDate, chartStartDate) + 1;
  const dayWidth = DEFAULT_DAY_WIDTH * zoomLevel;
  const rowHeight = 40;

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
        case 'progress':
          const progressMatch = filter.value.match(/([<>=]+)?(\\d+)(-(\\d+))?/);
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
        case 'priority':
          const priorityMatch = filter.value.match(/([<>=]+)?(\\d+)(-(\\d+))?/);
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

  return (
    <Paper sx={{ 
      overflow: 'hidden', 
      height: '100%', 
      position: 'relative',
      background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
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
          onSearch={(query, filters) => {
            setSearchQuery(query);
            setSearchFilters(filters);
          }}
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
        {/* タスクリスト（左側） */}
        <Box sx={{ 
          width: 300, 
          borderRight: '2px solid rgba(0,0,0,0.08)', 
          overflow: 'auto',
          background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
          zIndex: 2,
          boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
        }}>
          <TaskList 
            tasks={displayTasks} 
            rowHeight={rowHeight}
            selectedTaskIds={selectedTaskIds}
            onTaskSelect={onTaskSelect}
          />
        </Box>

        {/* ガントチャート（右側） */}
        <Box 
          ref={chartContainerRef}
          sx={{ 
            flex: 1, 
            overflow: 'auto', 
            position: 'relative',
            cursor: zoomLevel !== 1 ? 'grab' : 'default',
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
              <TimeScale
                startDate={chartStartDate}
                totalDays={totalDays}
                dayWidth={dayWidth}
                showWeekends={true}
                showToday={true}
              />
            </Box>
          )}

          {/* チャートエリア */}
          <Box 
            ref={chartAreaRef}
            sx={{ 
              position: 'relative', 
              minHeight: displayTasks.length * rowHeight,
              width: totalDays * dayWidth,
              background: 'linear-gradient(90deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)',
            }}
          >
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

            {/* 週末のハイライト */}
            {Array.from({ length: totalDays }).map((_, dayIndex) => {
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
                    background: 'linear-gradient(180deg, rgba(148, 163, 184, 0.15) 0%, rgba(148, 163, 184, 0.25) 100%)',
                    zIndex: 0,
                    pointerEvents: 'none',
                    borderLeft: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRight: '1px solid rgba(148, 163, 184, 0.2)',
                  }}
                />
              );
            })}

            {/* グリッド線 */}
            {Array.from({ length: Math.ceil(totalDays / 7) }).map((_, weekIndex) => (
              <Box
                key={`week-${weekIndex}`}
                sx={{
                  position: 'absolute',
                  left: weekIndex * 7 * dayWidth,
                  top: 0,
                  bottom: 0,
                  width: 1,
                  background: 'linear-gradient(180deg, rgba(148, 163, 184, 0.3) 0%, rgba(148, 163, 184, 0.6) 100%)',
                  zIndex: 1,
                  pointerEvents: 'none',
                }}
              />
            ))}

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

            {/* タスクバー（前景） */}
            {displayTasks.map((task, index) => {
              if (task.isGroup) return null; // グループタスクは合成バーで表示
              
              const { left, width } = calculateTaskPosition(task);
              return (
                <TaskBar
                  key={task.id}
                  task={task}
                  top={index * rowHeight + 5}
                  left={left}
                  width={width}
                  height={rowHeight - 10}
                  onClick={() => onTaskClick?.(task)}
                  isSelected={selectedTaskIds.includes(task.id)}
                  showResizeHandles={selectedTaskIds.includes(task.id)}
                />
              );
            })}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};