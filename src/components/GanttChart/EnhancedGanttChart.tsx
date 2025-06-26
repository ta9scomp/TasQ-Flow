import React from 'react';
import { Box, Paper, Tooltip, IconButton } from '@mui/material';
import { ZoomIn, ZoomOut } from '@mui/icons-material';
import type { Task, TaskFog } from '../../types/task';
import { TaskBar } from './TaskBar';
import { TaskFog as TaskFogComponent } from './TaskFog';
import { TimeScale } from './TimeScale';
import { TaskList } from './TaskList';
import { CompositeBar } from './CompositeBar';
import { differenceInDays, startOfDay, addDays } from 'date-fns';

interface EnhancedGanttChartProps {
  tasks: Task[];
  startDate: Date;
  endDate: Date;
  onTaskClick?: (task: Task) => void;
  taskFogs?: TaskFog[];
  showTaskFogs?: boolean;
  searchQuery?: string;
  searchFilters?: Array<{
    type: 'member' | 'tag' | 'progress' | 'priority' | 'status' | 'capacity';
    value: string;
    label: string;
  }>;
  selectedTaskIds?: string[];
  onTaskSelect?: (taskId: string, isMultiSelect: boolean) => void;
  onTaskDrop?: (taskId: string, newStartDate: Date, newEndDate: Date) => void;
  onTaskResize?: (taskId: string, newStartDate: Date, newEndDate: Date) => void;
}

export const EnhancedGanttChart: React.FC<EnhancedGanttChartProps> = ({
  tasks,
  startDate,
  endDate,
  onTaskClick,
  taskFogs = [],
  showTaskFogs = true,
  searchQuery = '',
  searchFilters = [],
  selectedTaskIds = [],
  onTaskSelect,
}) => {
  const [zoomLevel, setZoomLevel] = React.useState(1);
  const [draggedTask, setDraggedTask] = React.useState<string | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isResizing, setIsResizing] = React.useState(false);

  const chartStartDate = startOfDay(startDate);
  const totalDays = differenceInDays(endDate, chartStartDate) + 1;
  const baseDayWidth = 30;
  const dayWidth = baseDayWidth * zoomLevel;
  const rowHeight = 40;

  // 検索・フィルタ機能
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

  const calculateTaskPosition = (task: Task) => {
    const taskStart = startOfDay(task.startDate);
    const left = differenceInDays(taskStart, chartStartDate) * dayWidth;
    const width = Math.max((differenceInDays(task.endDate, taskStart) + 1) * dayWidth, dayWidth);
    return { left, width };
  };

  // ズーム機能
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev / 1.2, 0.5));
  };

  // ドラッグ＆ドロップ機能
  const handleTaskMouseDown = (task: Task, isResizeHandle: boolean) => {
    if (isResizeHandle) {
      setIsResizing(true);
    } else {
      setIsDragging(true);
    }
    setDraggedTask(task.id);
  };

  const handleMouseMove = () => {
    if (!draggedTask || (!isDragging && !isResizing)) return;

    // ここでドラッグ/リサイズのプレビューを表示
  };

  const handleMouseUp = () => {
    if (draggedTask && (isDragging || isResizing)) {
      // ドロップまたはリサイズの処理
      setDraggedTask(null);
      setIsDragging(false);
      setIsResizing(false);
    }
  };

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
  const filteredTasks = visibleTasks.filter(isTaskMatched);
  const taskMap = new Map(tasks.map(task => [task.id, task]));

  // 検索ハイライト用のCSSクラス
  const isSearchActive = searchQuery || searchFilters.length > 0;

  return (
    <Paper sx={{ overflow: 'hidden', height: '100%', position: 'relative' }}>
      {/* ズームコントロール */}
      <Box sx={{ 
        position: 'absolute', 
        top: 16, 
        right: 16, 
        zIndex: 10,
        display: 'flex',
        gap: 1
      }}>
        <Tooltip title="ズームイン">
          <IconButton size="small" onClick={handleZoomIn}>
            <ZoomIn />
          </IconButton>
        </Tooltip>
        <Tooltip title="ズームアウト">
          <IconButton size="small" onClick={handleZoomOut}>
            <ZoomOut />
          </IconButton>
        </Tooltip>
      </Box>

      {/* 検索オーバーレイ */}
      {isSearchActive && (
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          zIndex: 5,
          pointerEvents: 'none',
        }} />
      )}

      <Box sx={{ display: 'flex', height: '100%' }}>
        {/* タスクリスト（左側） */}
        <Box sx={{ 
          width: 300, 
          borderRight: 1, 
          borderColor: 'divider', 
          overflow: 'auto',
          zIndex: isSearchActive ? 6 : 1
        }}>
          <TaskList 
            tasks={isSearchActive ? filteredTasks : visibleTasks} 
            rowHeight={rowHeight}
            selectedTaskIds={selectedTaskIds}
            onTaskSelect={onTaskSelect}
          />
        </Box>

        {/* ガントチャート（右側） */}
        <Box 
          sx={{ 
            flex: 1, 
            overflow: 'auto', 
            position: 'relative',
            zIndex: isSearchActive ? 6 : 1
          }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* タイムスケール */}
          <TimeScale
            startDate={chartStartDate}
            totalDays={totalDays}
            dayWidth={dayWidth}
            showWeekends={true}
            showToday={true}
          />

          {/* タスクバー表示エリア */}
          <Box sx={{ 
            position: 'relative', 
            minHeight: (isSearchActive ? filteredTasks : visibleTasks).length * rowHeight,
            minWidth: totalDays * dayWidth
          }}>
            {/* 今日の線 */}
            <Box sx={{
              position: 'absolute',
              left: differenceInDays(startOfDay(new Date()), chartStartDate) * dayWidth,
              top: 0,
              bottom: 0,
              width: 2,
              backgroundColor: 'error.main',
              zIndex: 3,
              opacity: 0.8
            }} />

            {/* タスクフォグ（背景） */}
            {showTaskFogs && taskFogs.map((fog) => {
              const fogLeft = differenceInDays(startOfDay(fog.startDate), chartStartDate) * dayWidth;
              const fogWidth = (differenceInDays(fog.endDate, fog.startDate) + 1) * dayWidth;
              return (
                <TaskFogComponent
                  key={fog.id}
                  fog={fog}
                  chartHeight={(isSearchActive ? filteredTasks : visibleTasks).length * rowHeight}
                  left={fogLeft}
                  width={fogWidth}
                  onClick={() => console.log('Task fog clicked:', fog)}
                />
              );
            })}

            {/* 合成バー（グループタスク） */}
            {(isSearchActive ? filteredTasks : visibleTasks).map((task, index) => {
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
            {(isSearchActive ? filteredTasks : visibleTasks).map((task, index) => {
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
                  onMouseDown={(isResizeHandle) => handleTaskMouseDown(task, isResizeHandle)}
                  isSelected={selectedTaskIds.includes(task.id)}
                  isDragging={draggedTask === task.id && isDragging}
                  isResizing={draggedTask === task.id && isResizing}
                  showResizeHandles={selectedTaskIds.includes(task.id)}
                />
              );
            })}

            {/* グリッド線 */}
            {Array.from({ length: totalDays }).map((_, dayIndex) => {
              const date = addDays(chartStartDate, dayIndex);
              const isWeekend = date.getDay() === 0 || date.getDay() === 6;
              
              return (
                <Box
                  key={dayIndex}
                  sx={{
                    position: 'absolute',
                    left: dayIndex * dayWidth,
                    top: 0,
                    bottom: 0,
                    width: 1,
                    backgroundColor: isWeekend ? 'warning.light' : 'divider',
                    opacity: 0.3,
                    zIndex: 1,
                  }}
                />
              );
            })}

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
                  }}
                />
              );
            })}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};