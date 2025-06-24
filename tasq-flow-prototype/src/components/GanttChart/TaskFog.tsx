import React from 'react';
import { Box, Tooltip, Typography } from '@mui/material';

import type { TaskFog as TaskFogType } from '../../types/task';
import { autoAdjustColor, getContrastColor } from '../../utils/colorUtils';

interface TaskFogProps {
  fog: TaskFogType;
  chartHeight: number;
  left: number;
  width: number;
  onClick?: () => void;
}

export const TaskFog: React.FC<TaskFogProps> = ({
  fog,
  chartHeight,
  left,
  width,
  onClick,
}) => {
  const adjustedColor = autoAdjustColor(fog.color);
  const borderColor = fog.borderStyle?.color || getContrastColor(adjustedColor);

  return (
    <Tooltip
      title={
        <Box>
          <Typography variant="body2">タスクフォグ</Typography>
          <Typography variant="caption">作成者: {fog.userId}</Typography>
          <Typography variant="caption" display="block">
            期間: {fog.startDate.toLocaleDateString()} - {fog.endDate.toLocaleDateString()}
          </Typography>
        </Box>
      }
    >
      <Box
        onClick={onClick}
        sx={{
          position: 'absolute',
          left,
          top: 0,
          width,
          height: chartHeight,
          background: `repeating-linear-gradient(
            45deg,
            ${adjustedColor}40,
            ${adjustedColor}40 10px,
            ${adjustedColor}20 10px,
            ${adjustedColor}20 20px
          )`,
          border: fog.borderStyle ? `${fog.borderStyle.width} ${fog.borderStyle.style} ${borderColor}` : 'none',
          cursor: 'pointer',
          zIndex: 0,
          opacity: 0.7,
          transition: 'opacity 0.2s ease',
          '&:hover': {
            opacity: 0.9,
          },
          // 網掛け・斜線パターン
          backgroundImage: `
            linear-gradient(45deg, transparent 40%, ${adjustedColor}30 50%, transparent 60%),
            linear-gradient(-45deg, transparent 40%, ${adjustedColor}20 50%, transparent 60%)
          `,
          backgroundSize: '20px 20px',
        }}
      />
    </Tooltip>
  );
};