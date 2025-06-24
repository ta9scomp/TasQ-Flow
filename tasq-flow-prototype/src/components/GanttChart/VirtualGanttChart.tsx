import React from 'react';
import { Box, Paper, Tooltip, IconButton, Typography } from '@mui/material';
import { ZoomIn, ZoomOut, Restore } from '@mui/icons-material';
import type { Task, TaskFog } from '../../types/task';
import { TaskBar } from './TaskBar';
import { TaskFog as TaskFogComponent } from './TaskFog';
import { TimeScale } from './TimeScale';
import { TaskList } from './TaskList';
import { CompositeBar } from './CompositeBar';
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
}) => {
  const [zoomLevel, setZoomLevel] = React.useState(1);
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

  const visibleTasks = organizeTasksHierarchy(tasks);
  const taskMap = new Map(tasks.map(task => [task.id, task]));

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
    <Paper sx={{ overflow: 'hidden', height: '100%', position: 'relative' }}>
      {/* ズームコントロール */}
      <Box sx={{ 
        position: 'absolute', 
        top: 16, 
        right: 16, 
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        backgroundColor: 'background.paper',
        borderRadius: 1,
        boxShadow: 2,
        p: 0.5
      }}>
        <Typography variant="caption" sx={{ px: 1 }}>
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
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        borderRadius: 1,
        px: 2,
        py: 1,
        fontSize: '0.75rem',
      }}>
        Ctrl + マウスホイール / Ctrl + ±キーでズーム
      </Box>

      <Box sx={{ display: 'flex', height: '100%' }}>
        {/* タスクリスト（左側） */}
        <Box sx={{ 
          width: 300, 
          borderRight: 1, 
          borderColor: 'divider', 
          overflow: 'auto',
          backgroundColor: 'background.paper',
          zIndex: 2,
        }}>
          <TaskList 
            tasks={visibleTasks} 
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
          <Box sx={{ position: 'sticky', top: 0, zIndex: 3, backgroundColor: 'background.paper' }}>
            <TimeScale
              startDate={chartStartDate}
              totalDays={totalDays}
              dayWidth={dayWidth}
              showWeekends={true}
              showToday={true}
            />
          </Box>

          {/* チャートエリア */}
          <Box 
            ref={chartAreaRef}
            sx={{ 
              position: 'relative', 
              minHeight: visibleTasks.length * rowHeight,
              width: totalDays * dayWidth,
              backgroundColor: 'background.default',
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
                    left: todayOffset * dayWidth + dayWidth / 2,
                    top: 0,
                    bottom: 0,
                    width: 2,
                    backgroundColor: 'error.main',
                    zIndex: 3,
                    opacity: 0.8,
                    pointerEvents: 'none',
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
                    backgroundColor: 'grey.100',
                    opacity: 0.5,
                    zIndex: 0,
                    pointerEvents: 'none',
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
                  backgroundColor: 'divider',
                  opacity: 0.5,
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
                  chartHeight={visibleTasks.length * rowHeight}
                  left={fogLeft}
                  width={fogWidth}
                  onClick={() => console.log('Task fog clicked:', fog)}
                />
              );
            })}

            {/* 合成バー（グループタスク） */}
            {visibleTasks.map((task, index) => {
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
            {visibleTasks.map((task, index) => {
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