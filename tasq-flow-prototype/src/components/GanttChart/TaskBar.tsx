import React from 'react';
import { Box, Tooltip, Typography } from '@mui/material';

import type { Task } from '../../types/task';
import { getPriorityColor, autoAdjustColor, getContrastColor } from '../../utils/colorUtils';

interface TaskBarProps {
  task: Task;
  top: number;
  left: number;
  width: number;
  height: number;
  onClick?: () => void;
  onMouseDown?: (isResizeHandle: boolean, handle?: 'start' | 'end') => void;
  isHighlighted?: boolean;
  isSelected?: boolean;
  isDragging?: boolean;
  isResizing?: boolean;
  showResizeHandles?: boolean;
}

export const TaskBar: React.FC<TaskBarProps> = ({
  task,
  top,
  left,
  width,
  height,
  onClick,
  onMouseDown,
  isHighlighted = false,
  isSelected = false,
  isDragging = false,
  isResizing = false,
  showResizeHandles = false,
}) => {
  const baseColor = task.color || getPriorityColor(task.priority);
  const adjustedColor = autoAdjustColor(baseColor);
  const borderColor = task.borderStyle?.color || getContrastColor(adjustedColor);

  const getStatusIcon = () => {
    switch (task.status) {
      case 'completed': return '✓';
      case 'inProgress': return '●';
      case 'onHold': return '⏸';
      default: return '';
    }
  };

  return (
    <Tooltip
      title={
        <Box>
          <Typography variant="body2">{task.title}</Typography>
          <Typography variant="caption">優先度: {task.priority}</Typography>
          <Typography variant="caption" display="block">
            進捗: {task.progress}%
          </Typography>
        </Box>
      }
    >
      <Box
        onClick={onClick}
        onMouseDown={(e) => {
          e.preventDefault();
          onMouseDown?.(false);
        }}
        sx={{
          position: 'absolute',
          top,
          left,
          width,
          height,
          backgroundColor: adjustedColor,
          border: isSelected 
            ? `3px solid ${borderColor}` 
            : task.borderStyle 
            ? `${task.borderStyle.width} ${task.borderStyle.style} ${borderColor}` 
            : 'none',
          borderRadius: 1,
          cursor: isDragging ? 'grabbing' : 'grab',
          display: 'flex',
          alignItems: 'center',
          px: 1,
          overflow: 'hidden',
          transition: isDragging || isResizing ? 'none' : 'all 0.2s ease',
          transform: isDragging ? 'scale(1.05)' : 'none',
          opacity: isDragging || isResizing ? 0.8 : isHighlighted ? 1 : 1,
          zIndex: isSelected ? 10 : isDragging || isResizing ? 20 : 1,
          boxShadow: isSelected ? 3 : 'none',
          '&:hover': !isDragging && !isResizing ? {
            transform: 'translateY(-2px)',
            boxShadow: 3,
          } : {},
          '&:active': !isDragging && !isResizing ? {
            transform: 'translateY(0)',
          } : {},
        }}
      >
        {/* 優先度インジケーター */}
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 4,
            backgroundColor: getPriorityColor(task.priority),
          }}
        />

        {/* 進捗バー */}
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            height: 3,
            width: `${task.progress}%`,
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
          }}
        />

        {/* タスク名とステータス */}
        <Typography
          variant="caption"
          sx={{
            color: getContrastColor(adjustedColor),
            fontWeight: 500,
            ml: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {getStatusIcon()} {task.title}
        </Typography>

        {/* リサイズハンドル */}
        {showResizeHandles && (
          <>
            {/* 開始日リサイズハンドル */}
            <Box
              onMouseDown={(e) => {
                e.stopPropagation();
                onMouseDown?.(true, 'start');
              }}
              sx={{
                position: 'absolute',
                left: -2,
                top: 0,
                bottom: 0,
                width: 4,
                backgroundColor: 'primary.main',
                cursor: 'ew-resize',
                opacity: 0.8,
                '&:hover': {
                  opacity: 1,
                  width: 6,
                },
              }}
            />
            
            {/* 終了日リサイズハンドル */}
            <Box
              onMouseDown={(e) => {
                e.stopPropagation();
                onMouseDown?.(true, 'end');
              }}
              sx={{
                position: 'absolute',
                right: -2,
                top: 0,
                bottom: 0,
                width: 4,
                backgroundColor: 'primary.main',
                cursor: 'ew-resize',
                opacity: 0.8,
                '&:hover': {
                  opacity: 1,
                  width: 6,
                },
              }}
            />
          </>
        )}
      </Box>
    </Tooltip>
  );
};