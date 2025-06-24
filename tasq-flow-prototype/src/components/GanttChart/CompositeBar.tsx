import React from 'react';
import { Box, Tooltip, Typography } from '@mui/material';

import type { Task } from '../../types/task';
import { autoAdjustColor, getContrastColor } from '../../utils/colorUtils';
import { differenceInDays, startOfDay } from 'date-fns';

interface CompositeBarProps {
  groupTask: Task;
  childTasks: Task[];
  top: number;
  left: number;
  width: number;
  height: number;
  dayWidth: number;
  chartStartDate: Date;
  onClick?: () => void;
  isSelected?: boolean;
}

export const CompositeBar: React.FC<CompositeBarProps> = ({
  groupTask,
  childTasks,
  top,
  height,
  dayWidth,
  chartStartDate,
  onClick,
  isSelected = false,
}) => {
  // 子タスクの期間から合成期間を計算
  const calculateCompositeSpan = () => {
    if (childTasks.length === 0) {
      return {
        startDate: groupTask.startDate,
        endDate: groupTask.endDate,
        progress: groupTask.progress,
      };
    }

    const startDates = childTasks.map(task => task.startDate);
    const endDates = childTasks.map(task => task.endDate);
    const startDate = new Date(Math.min(...startDates.map(d => d.getTime())));
    const endDate = new Date(Math.max(...endDates.map(d => d.getTime())));
    
    // 全体進捗を子タスクの加重平均で計算
    const totalDuration = childTasks.reduce((sum, task) => 
      sum + differenceInDays(task.endDate, task.startDate) + 1, 0);
    const weightedProgress = childTasks.reduce((sum, task) => {
      const taskDuration = differenceInDays(task.endDate, task.startDate) + 1;
      return sum + (task.progress * taskDuration);
    }, 0);
    
    const averageProgress = totalDuration > 0 ? Math.round(weightedProgress / totalDuration) : 0;

    return { startDate, endDate, progress: averageProgress };
  };

  const { startDate, endDate, progress } = calculateCompositeSpan();
  
  // 合成バーの位置とサイズを計算
  const compositeLeft = differenceInDays(startOfDay(startDate), chartStartDate) * dayWidth;
  const compositeWidth = (differenceInDays(endDate, startDate) + 1) * dayWidth;

  // プリセット薄緑色
  const compositeColor = '#A8E6CF'; // 薄緑色
  const adjustedColor = autoAdjustColor(compositeColor);
  const borderColor = groupTask.borderStyle?.color || getContrastColor(adjustedColor);
  const textColor = getContrastColor(adjustedColor);

  // 子タスクの統計情報
  const completedTasks = childTasks.filter(task => task.status === 'completed').length;
  const inProgressTasks = childTasks.filter(task => task.status === 'inProgress').length;
  const totalTasks = childTasks.length;

  return (
    <Tooltip
      title={
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {groupTask.title} (グループ)
          </Typography>
          <Typography variant="caption" display="block">
            期間: {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
          </Typography>
          <Typography variant="caption" display="block">
            進捗: {progress}%
          </Typography>
          <Typography variant="caption" display="block">
            タスク: {completedTasks}完了 / {totalTasks}総数
          </Typography>
          {inProgressTasks > 0 && (
            <Typography variant="caption" display="block">
              進行中: {inProgressTasks}件
            </Typography>
          )}
          <Typography variant="caption" display="block">
            担当者: {groupTask.assignees.join(', ')}
          </Typography>
        </Box>
      }
    >
      <Box
        onClick={onClick}
        sx={{
          position: 'absolute',
          left: compositeLeft,
          top: top,
          width: compositeWidth,
          height: height,
          background: `linear-gradient(90deg, ${adjustedColor} ${progress}%, ${adjustedColor}40 ${progress}%)`,
          border: isSelected 
            ? '2px solid #2196F3'
            : groupTask.borderStyle 
              ? `${groupTask.borderStyle.width} ${groupTask.borderStyle.style} ${borderColor}` 
              : `1px solid ${borderColor}`,
          borderRadius: 4,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
          opacity: 0.8,
          transition: 'opacity 0.2s ease, transform 0.1s ease',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          '&:hover': {
            opacity: 1,
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
          },
          // グループタスクを示すパターン
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 8px,
            rgba(255,255,255,0.1) 8px,
            rgba(255,255,255,0.1) 16px
          )`,
        }}
      >
        {/* 進捗テキスト */}
        {compositeWidth > 60 && (
          <Typography
            variant="caption"
            sx={{
              color: textColor,
              fontWeight: 'bold',
              fontSize: '0.7rem',
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
              userSelect: 'none',
            }}
          >
            {progress}%
          </Typography>
        )}

        {/* 子タスクの小さなインジケーター */}
        <Box
          sx={{
            position: 'absolute',
            top: 2,
            right: 4,
            display: 'flex',
            gap: 0.5,
          }}
        >
          {childTasks.slice(0, 3).map((task) => (
            <Box
              key={task.id}
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                bgcolor: task.color || task.status === 'completed' ? '#4CAF50' : 
                        task.status === 'inProgress' ? '#2196F3' : '#9E9E9E',
                border: '1px solid rgba(255,255,255,0.8)',
              }}
            />
          ))}
          {childTasks.length > 3 && (
            <Typography
              variant="caption"
              sx={{
                color: textColor,
                fontSize: '0.6rem',
                fontWeight: 'bold',
              }}
            >
              +{childTasks.length - 3}
            </Typography>
          )}
        </Box>
      </Box>
    </Tooltip>
  );
};