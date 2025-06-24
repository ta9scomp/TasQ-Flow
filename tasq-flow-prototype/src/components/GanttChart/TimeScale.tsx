import React from 'react';
import { Box, Typography } from '@mui/material';

import { format, addDays } from 'date-fns';
import { ja } from 'date-fns/locale';

interface TimeScaleProps {
  startDate: Date;
  totalDays: number;
  dayWidth: number;
  showWeekends?: boolean;
  showToday?: boolean;
}

export const TimeScale: React.FC<TimeScaleProps> = ({ 
  startDate, 
  totalDays, 
  dayWidth,
  showWeekends = true,
  showToday = true 
}) => {
  const months: { month: string; days: number; startDay: number }[] = [];
  let currentMonth = '';
  let monthDays = 0;
  let monthStartDay = 0;

  // 月ごとにグループ化
  for (let i = 0; i < totalDays; i++) {
    const date = addDays(startDate, i);
    const monthStr = format(date, 'yyyy年M月', { locale: ja });
    
    if (monthStr !== currentMonth) {
      if (currentMonth) {
        months.push({ month: currentMonth, days: monthDays, startDay: monthStartDay });
      }
      currentMonth = monthStr;
      monthDays = 1;
      monthStartDay = i;
    } else {
      monthDays++;
    }
  }
  
  if (currentMonth) {
    months.push({ month: currentMonth, days: monthDays, startDay: monthStartDay });
  }

  return (
    <Box sx={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: 'background.paper' }}>
      {/* 月表示 */}
      <Box sx={{ display: 'flex', borderBottom: 1, borderColor: 'divider' }}>
        {months.map((month, index) => (
          <Box
            key={index}
            sx={{
              width: month.days * dayWidth,
              borderRight: 1,
              borderColor: 'divider',
              px: 1,
              py: 0.5,
              backgroundColor: 'grey.50',
            }}
          >
            <Typography variant="caption" fontWeight="bold">
              {month.month}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* 日付表示 */}
      <Box sx={{ display: 'flex', borderBottom: 2, borderColor: 'divider' }}>
        {Array.from({ length: totalDays }).map((_, dayIndex) => {
          const date = addDays(startDate, dayIndex);
          const dayOfWeek = format(date, 'E', { locale: ja });
          const isWeekend = dayOfWeek === '土' || dayOfWeek === '日';
          const isToday = showToday && format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
          
          return (
            <Box
              key={dayIndex}
              sx={{
                width: dayWidth,
                textAlign: 'center',
                borderRight: 1,
                borderColor: 'divider',
                py: 0.5,
                backgroundColor: isToday 
                  ? 'error.light' 
                  : isWeekend && showWeekends 
                  ? 'grey.100' 
                  : 'background.paper',
                position: 'relative'
              }}
            >
              {isToday && (
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  border: 2,
                  borderColor: 'error.main',
                  borderRadius: 1,
                  pointerEvents: 'none'
                }} />
              )}
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  fontWeight: isToday ? 'bold' : isWeekend ? 'bold' : 'normal',
                  color: isToday ? 'error.main' : isWeekend ? 'text.secondary' : 'text.primary',
                }}
              >
                {format(date, 'd')}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  fontSize: '0.65rem',
                  color: isToday 
                    ? 'error.main'
                    : dayOfWeek === '日' 
                    ? 'error.main' 
                    : dayOfWeek === '土' 
                    ? 'info.main' 
                    : 'text.secondary',
                }}
              >
                {dayOfWeek}
              </Typography>
            </Box>
          );
        })}
        
        {/* 今日のインジケーター線 */}
        {showToday && (
          <Box sx={{
            position: 'absolute',
            left: (() => {
              const today = new Date();
              const todayStr = format(today, 'yyyy-MM-dd');
              for (let i = 0; i < totalDays; i++) {
                const date = addDays(startDate, i);
                if (format(date, 'yyyy-MM-dd') === todayStr) {
                  return i * dayWidth + dayWidth / 2;
                }
              }
              return -1000; // 範囲外の場合は非表示
            })(),
            top: 0,
            bottom: 0,
            width: 2,
            backgroundColor: 'error.main',
            zIndex: 10,
            opacity: 0.8
          }} />
        )}
      </Box>
    </Box>
  );
};