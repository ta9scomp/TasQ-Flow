import React, { useRef, useEffect, useCallback, useState, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { TaskBar } from './TaskBar';
import { TaskFog as TaskFogComponent } from './TaskFog';
import { CompositeBar } from './CompositeBar';
import { differenceInDays, startOfDay, addDays } from 'date-fns';
import type { Task, TaskFog } from '../../types/task';

interface VirtualizedGanttAreaProps {
  tasks: Task[];
  centerDate: Date;
  dayWidth: number;
  rowHeight: number;
  containerWidth: number;
  containerHeight: number;
  scrollLeft: number;
  scrollTop: number;
  onTaskClick?: (task: Task) => void;
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
  taskFogs?: TaskFog[];
  showTaskFogs?: boolean;
  selectedTaskIds?: string[];
  onTaskSelect?: (taskId: string, isMultiSelect: boolean) => void;
  onTaskCreate?: (startDate: Date, endDate: Date, rowIndex: number) => void;
}

// 仮想化のための定数
const VIRTUAL_BUFFER_ROWS = 5; // 上下のバッファ行数
const VIRTUAL_BUFFER_DAYS = 30; // 左右のバッファ日数

export const VirtualizedGanttArea: React.FC<VirtualizedGanttAreaProps> = ({
  tasks,
  centerDate,
  dayWidth,
  rowHeight,
  containerWidth,
  containerHeight,
  scrollLeft,
  scrollTop,
  onTaskClick,
  onTaskUpdate,
  taskFogs = [],
  showTaskFogs = true,
  selectedTaskIds = [],
  onTaskCreate,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<{
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

  // タスクを階層構造に整理
  const organizedTasks = useMemo(() => {
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
  }, [tasks]);

  // 可視範囲の計算
  const visibleRange = useMemo(() => {
    const visibleStartRow = Math.max(0, Math.floor(scrollTop / rowHeight) - VIRTUAL_BUFFER_ROWS);
    const visibleEndRow = Math.min(
      organizedTasks.length,
      Math.ceil((scrollTop + containerHeight) / rowHeight) + VIRTUAL_BUFFER_ROWS
    );
    
    const visibleStartDay = Math.floor(scrollLeft / dayWidth) - VIRTUAL_BUFFER_DAYS;
    const visibleEndDay = Math.ceil((scrollLeft + containerWidth) / dayWidth) + VIRTUAL_BUFFER_DAYS;
    
    return {
      startRow: visibleStartRow,
      endRow: visibleEndRow,
      startDay: visibleStartDay,
      endDay: visibleEndDay,
    };
  }, [scrollTop, scrollLeft, containerHeight, containerWidth, rowHeight, dayWidth, organizedTasks.length]);

  // 可視範囲内のタスクのみ取得
  const visibleTasks = useMemo(() => {
    return organizedTasks.slice(visibleRange.startRow, visibleRange.endRow);
  }, [organizedTasks, visibleRange.startRow, visibleRange.endRow]);

  // タスクの位置を計算
  const calculateTaskPosition = useCallback((task: Task) => {
    const startDays = differenceInDays(startOfDay(task.startDate), centerDate);
    const endDays = differenceInDays(startOfDay(task.endDate), centerDate);
    const duration = endDays - startDays + 1;
    
    return {
      left: startDays * dayWidth,
      width: duration * dayWidth,
    };
  }, [centerDate, dayWidth]);

  // 今日の線の位置計算
  const todayPosition = useMemo(() => {
    const today = new Date();
    const todayOffset = differenceInDays(startOfDay(today), centerDate);
    return todayOffset * dayWidth + dayWidth / 2;
  }, [centerDate, dayWidth]);

  // グリッド線の計算
  const gridLines = useMemo(() => {
    const lines: number[] = [];
    const startWeek = Math.floor(visibleRange.startDay / 7);
    const endWeek = Math.ceil(visibleRange.endDay / 7);
    
    for (let week = startWeek; week <= endWeek; week++) {
      lines.push(week * 7 * dayWidth);
    }
    
    return lines;
  }, [visibleRange.startDay, visibleRange.endDay, dayWidth]);

  // 週末のハイライト計算
  const weekendHighlights = useMemo(() => {
    const highlights: { left: number; width: number }[] = [];
    
    for (let day = visibleRange.startDay; day <= visibleRange.endDay; day++) {
      const date = addDays(centerDate, day);
      const dayOfWeek = date.getDay();
      
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        highlights.push({
          left: day * dayWidth,
          width: dayWidth,
        });
      }
    }
    
    return highlights;
  }, [visibleRange.startDay, visibleRange.endDay, centerDate, dayWidth]);

  // ドラッグハンドリング
  const handleTaskMouseDown = useCallback((
    task: Task, 
    isResizeHandle: boolean, 
    resizeType?: 'start' | 'end'
  ) => {
    const position = calculateTaskPosition(task);
    setDragState({
      isDragging: true,
      taskId: task.id,
      startLeft: position.left,
      isResizing: isResizeHandle,
      resizeHandle: resizeType,
      ghostPosition: position,
    });
  }, [calculateTaskPosition]);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!dragState.isDragging || !dragState.taskId || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left + scrollLeft;
    
    if (dragState.startX === undefined) {
      setDragState(prev => ({ ...prev, startX: mouseX }));
      return;
    }

    const deltaX = mouseX - dragState.startX;
    const newLeft = Math.max(0, dragState.startLeft! + deltaX);
    
    // 日付グリッドにスナップ
    const snappedLeft = Math.round(newLeft / dayWidth) * dayWidth;
    
    if (dragState.isResizing && dragState.resizeHandle) {
      const currentTask = organizedTasks.find(t => t.id === dragState.taskId);
      if (!currentTask) return;
      
      const currentPosition = calculateTaskPosition(currentTask);
      let newWidth = currentPosition.width;
      let adjustedLeft = currentPosition.left;
      
      if (dragState.resizeHandle === 'start') {
        adjustedLeft = snappedLeft;
        newWidth = currentPosition.left + currentPosition.width - snappedLeft;
      } else {
        newWidth = snappedLeft - currentPosition.left + dayWidth;
      }
      
      if (newWidth < dayWidth) return;
      
      setDragState(prev => ({
        ...prev,
        ghostPosition: {
          left: adjustedLeft,
          width: newWidth,
        },
      }));
    } else {
      const currentPosition = dragState.ghostPosition!;
      setDragState(prev => ({
        ...prev,
        ghostPosition: {
          left: snappedLeft,
          width: currentPosition.width,
        },
      }));
    }
  }, [dragState, scrollLeft, dayWidth, organizedTasks, calculateTaskPosition]);

  const handleMouseUp = useCallback(() => {
    if (!dragState.isDragging || !dragState.taskId || !dragState.ghostPosition) {
      setDragState({ isDragging: false });
      return;
    }

    const task = organizedTasks.find(t => t.id === dragState.taskId);
    if (!task) {
      setDragState({ isDragging: false });
      return;
    }

    // 新しい日付を計算
    const newStartDays = Math.round(dragState.ghostPosition.left / dayWidth);
    const newDurationDays = Math.round(dragState.ghostPosition.width / dayWidth);
    
    const newStartDate = addDays(centerDate, newStartDays);
    const newEndDate = addDays(newStartDate, newDurationDays - 1);

    // タスクを更新
    onTaskUpdate?.(task.id, { 
      startDate: newStartDate, 
      endDate: newEndDate 
    });

    setDragState({ isDragging: false });
  }, [dragState, centerDate, dayWidth, organizedTasks, onTaskUpdate]);

  // マウスイベントリスナーの設定
  useEffect(() => {
    if (dragState.isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        handleMouseMove(e as any);
      };
      const handleGlobalMouseUp = () => {
        handleMouseUp();
      };

      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [dragState.isDragging, handleMouseMove, handleMouseUp]);

  // ダブルクリックによるタスク作成
  const handleDoubleClick = useCallback((event: React.MouseEvent) => {
    if (!onTaskCreate || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left + scrollLeft;
    const mouseY = event.clientY - rect.top + scrollTop;

    const clickedDay = Math.floor(mouseX / dayWidth);
    const startDate = addDays(centerDate, clickedDay);
    const endDate = addDays(startDate, 0);

    const rowIndex = Math.floor(mouseY / rowHeight);

    onTaskCreate(startDate, endDate, rowIndex);
  }, [onTaskCreate, scrollLeft, scrollTop, dayWidth, rowHeight, centerDate]);

  return (
    <Box
      ref={containerRef}
      sx={{ 
        position: 'relative', 
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        cursor: dragState.isDragging ? 'grabbing' : 'default',
        userSelect: 'none',
      }}
      onDoubleClick={handleDoubleClick}
    >
      {/* 背景グリッド */}
      <Box sx={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
      }}>
        {/* 週末のハイライト */}
        {weekendHighlights.map((highlight, index) => (
          <Box
            key={`weekend-${index}`}
            sx={{
              position: 'absolute',
              left: highlight.left,
              top: 0,
              width: highlight.width,
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.02)',
              pointerEvents: 'none',
            }}
          />
        ))}

        {/* グリッド線 */}
        {gridLines.map((lineX, index) => (
          <Box
            key={`grid-${index}`}
            sx={{
              position: 'absolute',
              left: lineX,
              top: 0,
              width: 1,
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              pointerEvents: 'none',
            }}
          />
        ))}

        {/* 今日の線 */}
        <Box
          sx={{
            position: 'absolute',
            left: todayPosition,
            top: 0,
            width: 3,
            height: '100%',
            background: 'linear-gradient(180deg, #ef4444 0%, #dc2626 100%)',
            pointerEvents: 'none',
            boxShadow: '0 0 8px rgba(239, 68, 68, 0.5)',
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
          }}
        />
      </Box>

      {/* タスクフォグ（背景） */}
      {showTaskFogs && taskFogs.map((fog) => {
        const fogLeft = differenceInDays(startOfDay(fog.startDate), centerDate) * dayWidth;
        const fogWidth = (differenceInDays(fog.endDate, fog.startDate) + 1) * dayWidth;
        
        // 可視範囲チェック
        if (fogLeft + fogWidth < scrollLeft - VIRTUAL_BUFFER_DAYS * dayWidth || 
            fogLeft > scrollLeft + containerWidth + VIRTUAL_BUFFER_DAYS * dayWidth) {
          return null;
        }
        
        return (
          <TaskFogComponent
            key={fog.id}
            fog={fog}
            chartHeight={organizedTasks.length * rowHeight}
            left={fogLeft}
            width={fogWidth}
            onClick={() => console.log('Task fog clicked:', fog)}
          />
        );
      })}

      {/* 合成バー（グループタスク） */}
      {visibleTasks.map((task, index) => {
        if (!task.isGroup || !task.children) return null;
        
        const actualIndex = visibleRange.startRow + index;
        const childTasks = task.children
          .map(childId => organizedTasks.find(t => t.id === childId))
          .filter(Boolean) as Task[];
        const { left, width } = calculateTaskPosition(task);
        
        return (
          <CompositeBar
            key={`composite-${task.id}`}
            groupTask={task}
            childTasks={childTasks}
            top={actualIndex * rowHeight + 5}
            left={left}
            width={width}
            height={rowHeight - 10}
            dayWidth={dayWidth}
            chartStartDate={centerDate}
            onClick={() => onTaskClick?.(task)}
            isSelected={selectedTaskIds.includes(task.id)}
          />
        );
      })}

      {/* ドラッグ中のゴーストバー */}
      {dragState.isDragging && dragState.ghostPosition && (
        <Box
          sx={{
            position: 'absolute',
            top: (organizedTasks.findIndex(t => t.id === dragState.taskId) * rowHeight) + 5,
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
      {visibleTasks.map((task, index) => {
        if (task.isGroup) return null;
        
        const actualIndex = visibleRange.startRow + index;
        const { left, width } = calculateTaskPosition(task);
        const isDraggingThis = dragState.isDragging && dragState.taskId === task.id;
        
        return (
          <TaskBar
            key={task.id}
            task={task}
            top={actualIndex * rowHeight + 5}
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

      {/* 空のメッセージ */}
      {organizedTasks.length === 0 && (
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
    </Box>
  );
};