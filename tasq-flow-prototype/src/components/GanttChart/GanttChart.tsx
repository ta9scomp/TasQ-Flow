import React from 'react';
import { Box, Paper } from '@mui/material';

import type { Task, TaskFog } from '../../types/task';
import { TaskBar } from './TaskBar';
import { TaskFog as TaskFogComponent } from './TaskFog';
import { TimeScale } from './TimeScale';
import { TaskList } from './TaskList';
import { CompositeBar } from './CompositeBar';
import { differenceInDays, startOfDay } from 'date-fns';
import { sampleTaskFogs } from '../../data/sampleTaskFogs';

interface GanttChartProps {
  tasks: Task[];
  startDate: Date;
  endDate: Date;
  onTaskClick?: (task: Task) => void;
  taskFogs?: TaskFog[];
  showTaskFogs?: boolean;
}

export const GanttChart: React.FC<GanttChartProps> = ({
  tasks,
  startDate,
  endDate,
  onTaskClick,
  taskFogs = sampleTaskFogs,
  showTaskFogs = true,
}) => {
  const chartStartDate = startOfDay(startDate);
  const totalDays = differenceInDays(endDate, chartStartDate) + 1;
  const dayWidth = 30; // 1日あたりのピクセル幅
  const rowHeight = 40; // 1行の高さ

  const calculateTaskPosition = (task: Task) => {
    const taskStart = startOfDay(task.startDate);
    const left = differenceInDays(taskStart, chartStartDate) * dayWidth;
    const width = (differenceInDays(task.endDate, taskStart) + 1) * dayWidth;
    return { left, width };
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
  const taskMap = new Map(tasks.map(task => [task.id, task]));

  return (
    <Paper sx={{ overflow: 'hidden', height: '100%' }}>
      <Box sx={{ display: 'flex', height: '100%' }}>
        {/* タスクリスト（左側） */}
        <Box sx={{ width: 300, borderRight: 1, borderColor: 'divider', overflow: 'auto' }}>
          <TaskList tasks={tasks} rowHeight={rowHeight} />
        </Box>

        {/* ガントチャート（右側） */}
        <Box sx={{ flex: 1, overflow: 'auto', position: 'relative' }}>
          {/* タイムスケール */}
          <TimeScale
            startDate={chartStartDate}
            totalDays={totalDays}
            dayWidth={dayWidth}
          />

          {/* タスクバー表示エリア */}
          <Box sx={{ position: 'relative', minHeight: visibleTasks.length * rowHeight }}>
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
                />
              );
            })}

            {/* グリッド線 */}
            {Array.from({ length: totalDays }).map((_, dayIndex) => (
              <Box
                key={dayIndex}
                sx={{
                  position: 'absolute',
                  left: dayIndex * dayWidth,
                  top: 0,
                  bottom: 0,
                  width: 1,
                  bgcolor: 'divider',
                  opacity: 0.3,
                  zIndex: 1,
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};