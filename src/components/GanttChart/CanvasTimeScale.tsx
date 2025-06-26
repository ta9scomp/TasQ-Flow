import React, { useRef, useEffect, useCallback, useState } from 'react';
import { Box, IconButton, Menu, MenuItem, Divider, Typography } from '@mui/material';
import { Language as LanguageIcon } from '@mui/icons-material';
import { addDays, format, startOfMonth, endOfMonth, differenceInDays } from 'date-fns';
import { useTranslation } from '../../i18n';

interface CanvasTimeScaleProps {
  centerDate: Date; // 表示の中心日付
  dayWidth: number;
  containerWidth: number;
  scrollOffset: number; // ピクセル単位のスクロールオフセット
  onDateClick?: (date: Date) => void;
  holidays?: Array<{ date: Date; name: string; color: string }>;
  events?: Array<{ startDate: Date; endDate?: Date; name: string; color: string }>;
}

// 動的範囲設定
const INITIAL_RANGE_DAYS = 180; // 初期表示範囲（中心±180日）
const EXTEND_THRESHOLD = 30; // 端から30日以内でスクロールした時に拡張
const EXTEND_DAYS = 90; // 拡張時に追加する日数

export const CanvasTimeScale: React.FC<CanvasTimeScaleProps> = ({
  centerDate,
  dayWidth,
  containerWidth,
  scrollOffset,
  onDateClick,
  holidays = [],
  events = []
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const monthCanvasRef = useRef<HTMLCanvasElement>(null);
  const { language, setLanguage, formatMonth, formatDate, t } = useTranslation();
  const [languageMenuAnchor, setLanguageMenuAnchor] = useState<HTMLElement | null>(null);
  
  // 動的範囲管理
  const [visibleRange, setVisibleRange] = useState(() => {
    const start = addDays(centerDate, -INITIAL_RANGE_DAYS);
    const end = addDays(centerDate, INITIAL_RANGE_DAYS);
    return { start, end };
  });

  // 表示範囲の動的拡張
  const updateVisibleRange = useCallback((currentScrollOffset: number) => {
    const viewportStart = currentScrollOffset / dayWidth;
    const viewportEnd = (currentScrollOffset + containerWidth) / dayWidth;
    
    const rangeStartDays = differenceInDays(visibleRange.start, centerDate);
    const rangeEndDays = differenceInDays(visibleRange.end, centerDate);
    
    let needsUpdate = false;
    let newStart = visibleRange.start;
    let newEnd = visibleRange.end;
    
    // 左端に近づいたら範囲を拡張
    if (viewportStart - rangeStartDays < EXTEND_THRESHOLD) {
      newStart = addDays(visibleRange.start, -EXTEND_DAYS);
      needsUpdate = true;
    }
    
    // 右端に近づいたら範囲を拡張
    if (rangeEndDays - viewportEnd < EXTEND_THRESHOLD) {
      newEnd = addDays(visibleRange.end, EXTEND_DAYS);
      needsUpdate = true;
    }
    
    if (needsUpdate) {
      setVisibleRange({ start: newStart, end: newEnd });
    }
  }, [visibleRange, centerDate, dayWidth, containerWidth]);

  // スクロール監視
  useEffect(() => {
    updateVisibleRange(scrollOffset);
  }, [scrollOffset, updateVisibleRange]);

  // 月データの生成
  const months = React.useMemo(() => {
    const monthList: Array<{ 
      month: string; 
      startDate: Date;
      endDate: Date;
      startX: number;
      width: number;
    }> = [];
    
    let currentDate = new Date(visibleRange.start);
    
    while (currentDate <= visibleRange.end) {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      
      // 可視範囲内の部分のみ計算
      const displayStart = monthStart > visibleRange.start ? monthStart : visibleRange.start;
      const displayEnd = monthEnd < visibleRange.end ? monthEnd : visibleRange.end;
      
      if (displayStart <= displayEnd) {
        const startOffsetDays = differenceInDays(displayStart, centerDate);
        const durationDays = differenceInDays(displayEnd, displayStart) + 1;
        
        monthList.push({
          month: formatMonth(monthStart),
          startDate: displayStart,
          endDate: displayEnd,
          startX: startOffsetDays * dayWidth,
          width: durationDays * dayWidth,
        });
      }
      
      // 次の月へ
      currentDate = addDays(endOfMonth(currentDate), 1);
    }
    
    return monthList;
  }, [visibleRange, centerDate, dayWidth, formatMonth]);

  // 日付データの生成
  const days = React.useMemo(() => {
    const totalDays = differenceInDays(visibleRange.end, visibleRange.start) + 1;
    const dayList: Array<{
      date: Date;
      x: number;
      isWeekend: boolean;
      isToday: boolean;
      hasHoliday: boolean;
      hasEvent: boolean;
      holidayColor?: string;
      eventColor?: string;
    }> = [];

    for (let i = 0; i < totalDays; i++) {
      const date = addDays(visibleRange.start, i);
      const offsetFromCenter = differenceInDays(date, centerDate);
      const x = offsetFromCenter * dayWidth;
      
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
      
      // 祝日チェック
      const dayHoliday = holidays.find(h => 
        format(h.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      );
      
      // イベントチェック
      const dayEvent = events.find(e => {
        const eventStart = format(e.startDate, 'yyyy-MM-dd');
        const eventEnd = e.endDate ? format(e.endDate, 'yyyy-MM-dd') : eventStart;
        const currentDay = format(date, 'yyyy-MM-dd');
        return currentDay >= eventStart && currentDay <= eventEnd;
      });
      
      dayList.push({
        date,
        x,
        isWeekend,
        isToday,
        hasHoliday: !!dayHoliday,
        hasEvent: !!dayEvent,
        holidayColor: dayHoliday?.color,
        eventColor: dayEvent?.color,
      });
    }
    
    return dayList;
  }, [visibleRange, centerDate, dayWidth, holidays, events]);

  // 月ヘッダーの描画
  const drawMonthHeader = useCallback(() => {
    const canvas = monthCanvasRef.current;
    if (!canvas) {
      console.warn('Month canvas not found');
      return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.warn('Month canvas context not found');
      return;
    }
    
    console.log('Drawing month header START', { 
      months: months.length, 
      containerWidth, 
      scrollOffset,
      canvasSize: { width: canvas.width, height: canvas.height },
      styleSize: { width: canvas.style.width, height: canvas.style.height }
    });
    
    const canvasWidth = canvas.width / (window.devicePixelRatio || 1);
    const canvasHeight = canvas.height / (window.devicePixelRatio || 1);
    
    console.log('Canvas dimensions', { canvasWidth, canvasHeight, devicePixelRatio: window.devicePixelRatio });
    
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    console.log('Background drawn, processing months:', months.map(m => ({ month: m.month, startX: m.startX, width: m.width })));
    
    // 月の境界線と月名を描画
    months.forEach((month, index) => {
      const x = month.startX - scrollOffset;
      
      console.log(`Month ${index}: ${month.month}`, { x, startX: month.startX, width: month.width, scrollOffset, visible: x + month.width > 0 && x < containerWidth });
      
      if (x + month.width > 0 && x < containerWidth) {
        // 境界線
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvasHeight);
        ctx.stroke();
        
        // 月名
        ctx.fillStyle = '#333';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(
          month.month,
          x + month.width / 2,
          canvasHeight / 2 + 4
        );
        
        console.log(`Drew month ${month.month} at x=${x}, text at ${x + month.width / 2}`);
      }
    });
    
    console.log('Drawing month header COMPLETE');
  }, [months, scrollOffset, containerWidth]);

  // 日付カレンダーの描画
  const drawDayCalendar = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.warn('Day canvas not found');
      return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.warn('Day canvas context not found');
      return;
    }
    
    console.log('Drawing day calendar START', { 
      days: days.length, 
      containerWidth, 
      dayWidth,
      canvasSize: { width: canvas.width, height: canvas.height },
      styleSize: { width: canvas.style.width, height: canvas.style.height }
    });
    
    const canvasWidth = canvas.width / (window.devicePixelRatio || 1);
    const canvasHeight = canvas.height / (window.devicePixelRatio || 1);
    
    console.log('Day canvas dimensions', { canvasWidth, canvasHeight });
    
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    console.log('Day background drawn, processing days...');
    
    days.forEach((day) => {
      const x = day.x - scrollOffset;
      
      if (x + dayWidth > 0 && x < containerWidth) {
        // 背景色
        if (day.isWeekend) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
          ctx.fillRect(x, 0, dayWidth, canvas.height);
        }
        
        // 今日のハイライト
        if (day.isToday) {
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2;
          ctx.strokeRect(x + 1, 1, dayWidth - 2, canvas.height - 2);
        }
        
        // 日付テキスト
        ctx.fillStyle = day.isToday ? '#ef4444' : day.isWeekend ? '#666' : '#333';
        ctx.font = `${day.isToday ? 'bold' : 'normal'} 11px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(
          format(day.date, 'd'),
          x + dayWidth / 2,
          20
        );
        
        // 曜日（幅が十分な場合のみ）
        if (dayWidth > 25) {
          ctx.fillStyle = day.isToday ? '#ef4444' : '#999';
          ctx.font = '9px sans-serif';
          ctx.fillText(
            formatDate(day.date, 'E'),
            x + dayWidth / 2,
            35
          );
        }
        
        // 祝日・イベントのアクセント
        if (day.hasHoliday || day.hasEvent) {
          const colors = [];
          if (day.hasHoliday && day.holidayColor) colors.push(day.holidayColor);
          if (day.hasEvent && day.eventColor) colors.push(day.eventColor);
          
          if (colors.length > 0) {
            const barHeight = 3;
            const barY = canvas.height - barHeight;
            
            colors.forEach((color, index) => {
              ctx.fillStyle = color;
              ctx.fillRect(
                x + (dayWidth / colors.length) * index, 
                barY, 
                dayWidth / colors.length, 
                barHeight
              );
            });
          }
        }
        
        // 縦の境界線
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + dayWidth, 0);
        ctx.lineTo(x + dayWidth, canvas.height);
        ctx.stroke();
      }
    });
    
    // 今日の縦線
    const today = new Date();
    const todayOffset = differenceInDays(today, centerDate);
    const todayX = todayOffset * dayWidth - scrollOffset + dayWidth / 2;
    
    if (todayX > 0 && todayX < containerWidth) {
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(todayX, 0);
      ctx.lineTo(todayX, canvas.height);
      ctx.stroke();
    }
  }, [days, scrollOffset, containerWidth, dayWidth, centerDate, formatDate]);

  // キャンバスサイズ設定
  useEffect(() => {
    const monthCanvas = monthCanvasRef.current;
    const dayCanvas = canvasRef.current;
    
    console.log('Canvas setup effect', { 
      monthCanvas: !!monthCanvas, 
      dayCanvas: !!dayCanvas, 
      containerWidth,
      months: months.length,
      days: days.length 
    });
    
    if (monthCanvas && dayCanvas && containerWidth > 0) {
      // デバイスピクセル比を考慮したサイズ設定
      const devicePixelRatio = window.devicePixelRatio || 1;
      
      console.log('Setting canvas dimensions', { 
        containerWidth, 
        devicePixelRatio,
        monthCanvasSize: { width: containerWidth * devicePixelRatio, height: 35 * devicePixelRatio },
        dayCanvasSize: { width: containerWidth * devicePixelRatio, height: 45 * devicePixelRatio }
      });
      
      monthCanvas.width = containerWidth * devicePixelRatio;
      monthCanvas.height = 35 * devicePixelRatio;
      monthCanvas.style.width = `${containerWidth}px`;
      monthCanvas.style.height = '35px';
      
      dayCanvas.width = containerWidth * devicePixelRatio;
      dayCanvas.height = 45 * devicePixelRatio;
      dayCanvas.style.width = `${containerWidth}px`;
      dayCanvas.style.height = '45px';
      
      // Canvas contextのスケール調整
      const monthCtx = monthCanvas.getContext('2d');
      const dayCtx = dayCanvas.getContext('2d');
      
      if (monthCtx) {
        monthCtx.scale(devicePixelRatio, devicePixelRatio);
        console.log('Month context scaled', { devicePixelRatio });
      }
      if (dayCtx) {
        dayCtx.scale(devicePixelRatio, devicePixelRatio);
        console.log('Day context scaled', { devicePixelRatio });
      }
      
      // 再描画
      console.log('Triggering initial draw');
      drawMonthHeader();
      drawDayCalendar();
    } else {
      console.warn('Canvas setup failed', { 
        monthCanvas: !!monthCanvas, 
        dayCanvas: !!dayCanvas, 
        containerWidth 
      });
    }
  }, [containerWidth, drawMonthHeader, drawDayCalendar]);

  // Canvas更新（スクロール時）
  useEffect(() => {
    if (containerWidth > 0) {
      drawMonthHeader();
      drawDayCalendar();
    }
  }, [scrollOffset, dayWidth, drawMonthHeader, drawDayCalendar, containerWidth]);

  // クリックハンドリング
  const handleDayClick = useCallback((event: React.MouseEvent) => {
    if (!onDateClick) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left + scrollOffset;
    const dayIndex = Math.floor(clickX / dayWidth);
    const clickedDate = addDays(centerDate, dayIndex);
    
    onDateClick(clickedDate);
  }, [onDateClick, scrollOffset, dayWidth, centerDate]);

  // 言語切り替えハンドラ
  const handleLanguageChange = (newLanguage: 'ja' | 'en') => {
    setLanguage(newLanguage);
    setLanguageMenuAnchor(null);
  };

  return (
    <Box sx={{ position: 'sticky', top: 0, zIndex: 3, backgroundColor: 'background.paper' }}>
      {/* 言語切り替えボタン */}
      <Box sx={{ 
        position: 'absolute', 
        top: 8, 
        right: 8, 
        zIndex: 4,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}>
        <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
          {language.toUpperCase()}
        </Typography>
        <IconButton 
          size="small" 
          onClick={(e) => setLanguageMenuAnchor(e.currentTarget)}
          sx={{ p: 0.5 }}
        >
          <LanguageIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* 月ヘッダーCanvas */}
      <canvas
        ref={monthCanvasRef}
        style={{
          display: 'block',
          width: '100%',
          borderBottom: '1px solid #e0e0e0',
        }}
      />
      
      {/* 日付カレンダーCanvas */}
      <canvas
        ref={canvasRef}
        onClick={handleDayClick}
        style={{
          display: 'block',
          width: '100%',
          borderBottom: '2px solid #e0e0e0',
          cursor: 'pointer',
        }}
      />

      {/* 言語切り替えメニュー */}
      <Menu
        anchorEl={languageMenuAnchor}
        open={Boolean(languageMenuAnchor)}
        onClose={() => setLanguageMenuAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem 
          onClick={() => handleLanguageChange('ja')}
          selected={language === 'ja'}
        >
          日本語 (YYYY年MM月)
        </MenuItem>
        <MenuItem 
          onClick={() => handleLanguageChange('en')}
          selected={language === 'en'}
        >
          English (YYYY/MM)
        </MenuItem>
        <Divider />
        <MenuItem disabled>
          <Typography variant="caption" color="text.secondary">
            {t('ui.actions.close')}: ESC
          </Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};