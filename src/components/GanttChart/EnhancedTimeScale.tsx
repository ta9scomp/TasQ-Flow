import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Box, Typography, IconButton, Menu, MenuItem, Divider } from '@mui/material';
import { Language as LanguageIcon } from '@mui/icons-material';
import { addDays, format, startOfMonth, endOfMonth, differenceInDays } from 'date-fns';
import { useTranslation } from '../../i18n';
import type { MonthSnapState, ScrollState, CalendarDayCell } from '../../types/calendar';

interface EnhancedTimeScaleProps {
  startDate: Date;
  totalDays: number;
  dayWidth: number;
  showWeekends?: boolean;
  showToday?: boolean;
  scrollContainer?: HTMLElement | null;
  onMonthChange?: (monthStart: Date, monthEnd: Date) => void;
  holidays?: Array<{ date: Date; name: string; color: string }>;
  events?: Array<{ startDate: Date; endDate?: Date; name: string; color: string }>;
}

export const EnhancedTimeScale: React.FC<EnhancedTimeScaleProps> = ({ 
  startDate, 
  totalDays, 
  dayWidth,
  showToday = true,
  scrollContainer,
  onMonthChange,
  holidays = [],
  events = []
}) => {
  const { language, setLanguage, formatMonth, formatDate, t } = useTranslation();
  const [monthSnapState, setMonthSnapState] = useState<MonthSnapState>({
    currentMonth: '',
    isSnapping: false,
    snapDirection: null,
    snapTarget: null,
  });
  const [scrollState, setScrollState] = useState<ScrollState>({
    scrollLeft: 0,
    scrollDirection: null,
    isScrolling: false,
    velocity: 0,
  });
  const [languageMenuAnchor, setLanguageMenuAnchor] = useState<HTMLElement | null>(null);
  
  const monthsRef = useRef<Map<string, { element: HTMLElement; startDay: number; endDay: number }>>(new Map());
  const snapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastScrollRef = useRef(0);
  const scrollVelocityRef = useRef(0);

  // 月データの生成
  const months = React.useMemo(() => {
    const monthList: Array<{ 
      month: string; 
      days: number; 
      startDay: number;
      startDate: Date;
      endDate: Date;
    }> = [];
    let currentMonth = '';
    let monthDays = 0;
    let monthStartDay = 0;
    let monthStartDate: Date | null = null;

    for (let i = 0; i < totalDays; i++) {
      const date = addDays(startDate, i);
      const monthStr = formatMonth(date);
      
      if (monthStr !== currentMonth) {
        if (currentMonth && monthStartDate) {
          const endDate = addDays(startDate, i - 1);
          monthList.push({ 
            month: currentMonth, 
            days: monthDays, 
            startDay: monthStartDay,
            startDate: monthStartDate,
            endDate
          });
        }
        currentMonth = monthStr;
        monthDays = 1;
        monthStartDay = i;
        monthStartDate = date;
      } else {
        monthDays++;
      }
    }
    
    if (currentMonth && monthStartDate) {
      const endDate = addDays(startDate, totalDays - 1);
      monthList.push({ 
        month: currentMonth, 
        days: monthDays, 
        startDay: monthStartDay,
        startDate: monthStartDate,
        endDate
      });
    }

    return monthList;
  }, [startDate, totalDays, formatMonth]);

  // 仮想化用の可視範囲計算
  const [visibleRange, setVisibleRange] = React.useState({ start: 0, end: 100 });
  
  React.useEffect(() => {
    if (!scrollContainer) return;
    
    const updateVisibleRange = () => {
      const scrollLeft = scrollContainer.scrollLeft;
      const containerWidth = scrollContainer.clientWidth;
      const buffer = 30; // バッファ日数
      
      const start = Math.max(0, Math.floor(scrollLeft / dayWidth) - buffer);
      const end = Math.min(totalDays, Math.ceil((scrollLeft + containerWidth) / dayWidth) + buffer);
      
      setVisibleRange({ start, end });
    };
    
    updateVisibleRange();
    scrollContainer.addEventListener('scroll', updateVisibleRange, { passive: true });
    
    return () => {
      scrollContainer.removeEventListener('scroll', updateVisibleRange);
    };
  }, [scrollContainer, dayWidth, totalDays]);

  // 日付セルデータの生成（祝日・イベント情報含む、仮想化対応）
  const dayCells = React.useMemo((): CalendarDayCell[] => {
    const { start, end } = visibleRange;
    const visibleDays = end - start;
    
    return Array.from({ length: visibleDays }).map((_, offset) => {
      const dayIndex = start + offset;
      if (dayIndex >= totalDays) return null;
      const date = addDays(startDate, dayIndex);
      const dayOfWeek = formatDate(date, 'E');
      const isWeekend = dayOfWeek === '土' || dayOfWeek === '日';
      const isToday = showToday && format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
      
      // その日の祝日を検索
      const dayHolidays = holidays.filter(holiday => 
        format(holiday.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      );
      
      // その日のイベントを検索
      const dayEvents = events.filter(event => {
        const eventStart = format(event.startDate, 'yyyy-MM-dd');
        const eventEnd = event.endDate ? format(event.endDate, 'yyyy-MM-dd') : eventStart;
        const currentDay = format(date, 'yyyy-MM-dd');
        return currentDay >= eventStart && currentDay <= eventEnd;
      });

      // カラー表示の決定
      const accentColors: string[] = [];
      if (dayHolidays.length > 0) {
        accentColors.push(...dayHolidays.map(h => h.color));
      }
      if (dayEvents.length > 0) {
        accentColors.push(...dayEvents.map(e => e.color));
      }

      return {
        date,
        holidays: dayHolidays.map(h => ({
          id: format(h.date, 'yyyy-MM-dd'),
          name: h.name,
          date: h.date,
          color: h.color,
          isRecurring: false,
          isCustom: false,
        })),
        events: dayEvents.map(e => ({
          id: `${format(e.startDate, 'yyyy-MM-dd')}_${e.name}`,
          name: e.name,
          startDate: e.startDate,
          endDate: e.endDate,
          color: e.color,
          isRecurring: false,
          userId: 'current',
          isPublic: true,
          tags: [],
        })),
        tasks: [], // 今後実装
        isWeekend,
        isToday,
        colorDisplay: {
          accentColors,
          showText: dayWidth > 40, // セル幅に応じて文字表示制御
        },
      };
    }).filter(Boolean) as CalendarDayCell[];
  }, [startDate, totalDays, holidays, events, showToday, dayWidth, formatDate, visibleRange]);

  // スクロール監視とスナップ処理
  useEffect(() => {
    if (!scrollContainer) return;

    const handleScroll = () => {
      const currentScrollLeft = scrollContainer.scrollLeft;
      const currentTime = Date.now();
      const timeDelta = currentTime - lastScrollRef.current;
      
      if (timeDelta > 0) {
        scrollVelocityRef.current = Math.abs(currentScrollLeft - scrollState.scrollLeft) / timeDelta;
      }
      
      const direction = currentScrollLeft > scrollState.scrollLeft ? 'right' : 'left';
      
      setScrollState({
        scrollLeft: currentScrollLeft,
        scrollDirection: direction,
        isScrolling: true,
        velocity: scrollVelocityRef.current,
      });

      lastScrollRef.current = currentTime;

      // スナップ処理のタイマーリセット
      if (snapTimeoutRef.current !== null) {
        clearTimeout(snapTimeoutRef.current);
      }

      snapTimeoutRef.current = setTimeout(() => {
        setScrollState(prev => ({ ...prev, isScrolling: false }));
        handleMonthSnap(currentScrollLeft, direction);
      }, 150); // スクロール停止判定時間
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      if (snapTimeoutRef.current !== null) {
        clearTimeout(snapTimeoutRef.current);
      }
    };
  }, [scrollContainer, scrollState.scrollLeft]);

  // 月スナップ処理
  const handleMonthSnap = useCallback((scrollLeft: number, direction: 'left' | 'right') => {
    const containerWidth = scrollContainer?.clientWidth || 0;
    const centerX = scrollLeft + containerWidth / 2;
    const centerDayIndex = Math.floor(centerX / dayWidth);
    
    if (centerDayIndex < 0 || centerDayIndex >= totalDays) return;

    const centerDate = addDays(startDate, centerDayIndex);
    const monthStart = startOfMonth(centerDate);
    const monthEnd = endOfMonth(centerDate);
    
    // スナップ対象の決定
    const snapTarget = direction === 'right' ? 'firstDay' : 'lastDay';
    let targetDayIndex: number;
    
    if (snapTarget === 'firstDay') {
      targetDayIndex = differenceInDays(monthStart, startDate);
    } else {
      targetDayIndex = differenceInDays(monthEnd, startDate);
    }
    
    if (targetDayIndex >= 0 && targetDayIndex < totalDays) {
      const targetScrollLeft = targetDayIndex * dayWidth - containerWidth / 2 + dayWidth / 2;
      
      setMonthSnapState({
        currentMonth: formatMonth(centerDate),
        isSnapping: true,
        snapDirection: direction,
        snapTarget,
      });

      // スムーズスクロール
      scrollContainer?.scrollTo({
        left: Math.max(0, targetScrollLeft),
        behavior: 'smooth'
      });

      // スナップ完了後の状態リセット
      setTimeout(() => {
        setMonthSnapState(prev => ({ ...prev, isSnapping: false }));
        onMonthChange?.(monthStart, monthEnd);
      }, 300);
    }
  }, [scrollContainer, dayWidth, totalDays, startDate, formatMonth, onMonthChange]);

  // 言語切り替えハンドラ
  const handleLanguageChange = (newLanguage: 'ja' | 'en') => {
    setLanguage(newLanguage);
    setLanguageMenuAnchor(null);
  };

  // 右クリックメニューハンドラ
  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setLanguageMenuAnchor(event.currentTarget as HTMLElement);
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

      {/* 月表示 */}
      <Box sx={{ display: 'flex', borderBottom: 1, borderColor: 'divider' }} onContextMenu={handleContextMenu}>
        {months.map((month, index) => (
          <Box
            key={index}
            ref={(el: HTMLDivElement | null) => {
              if (el) {
                monthsRef.current.set(month.month, {
                  element: el,
                  startDay: month.startDay,
                  endDay: month.startDay + month.days - 1
                });
              }
            }}
            sx={{
              width: month.days * dayWidth,
              borderRight: 1,
              borderColor: 'divider',
              px: 1,
              py: 0.5,
              backgroundColor: monthSnapState.currentMonth === month.month && monthSnapState.isSnapping
                ? 'primary.light'
                : 'transparent',
              transition: 'background-color 0.3s ease',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography 
              variant="caption" 
              fontWeight="bold"
              sx={{
                transform: monthSnapState.currentMonth === month.month && monthSnapState.isSnapping
                  ? 'scale(1.05)'
                  : 'scale(1)',
                transition: 'transform 0.3s ease',
              }}
            >
              {month.month}
            </Typography>
            {monthSnapState.currentMonth === month.month && monthSnapState.isSnapping && (
              <Box sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 2,
                backgroundColor: 'primary.main',
                animation: 'pulse 1s infinite',
              }} />
            )}
          </Box>
        ))}
      </Box>

      {/* 日付表示 */}
      <Box sx={{ display: 'flex', borderBottom: 2, borderColor: 'divider' }}>
        {/* 左側の非表示部分のスペーサー */}
        <Box sx={{ width: visibleRange.start * dayWidth, flexShrink: 0 }} />
        
        {dayCells.map((cell, index) => {
          const actualDayIndex = visibleRange.start + index;
          return (
            <Box
              key={actualDayIndex}
              sx={{
                width: dayWidth,
                textAlign: 'center',
                borderRight: 1,
                borderColor: 'divider',
                py: 0.5,
                backgroundColor: 'background.paper',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
            {/* 祝日・イベントの色表示 */}
            {cell.colorDisplay.accentColors.length > 0 && (
              <Box sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 3,
                background: cell.colorDisplay.accentColors.length === 1 
                  ? cell.colorDisplay.accentColors[0]
                  : `linear-gradient(90deg, ${cell.colorDisplay.accentColors.join(', ')})`,
                opacity: 0.8,
              }} />
            )}

            {cell.isToday && (
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
                fontWeight: cell.isToday ? 'bold' : cell.isWeekend ? 'bold' : 'normal',
                color: cell.isToday ? 'error.main' : cell.isWeekend ? 'text.secondary' : 'text.primary',
                opacity: cell.colorDisplay.showText ? 1 : 0.7,
                transition: 'opacity 0.3s ease',
              }}
            >
              {format(cell.date, 'd')}
            </Typography>
            
            {cell.colorDisplay.showText && (
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  fontSize: '0.65rem',
                  color: cell.isToday 
                    ? 'error.main'
                    : formatDate(cell.date, 'E') === '日' 
                    ? 'error.main' 
                    : formatDate(cell.date, 'E') === '土' 
                    ? 'info.main' 
                    : 'text.secondary',
                  opacity: dayWidth > 60 ? 1 : 0,
                  transition: 'opacity 0.3s ease',
                }}
              >
                {formatDate(cell.date, 'E')}
              </Typography>
            )}
            </Box>
          );
        })}
        
        {/* 右側の非表示部分のスペーサー */}
        <Box sx={{ width: (totalDays - visibleRange.end) * dayWidth, flexShrink: 0 }} />
        
        {/* 今日のインジケーター線 */}
        {showToday && (() => {
          const today = new Date();
          const todayStr = format(today, 'yyyy-MM-dd');
          for (let i = 0; i < totalDays; i++) {
            const date = addDays(startDate, i);
            if (format(date, 'yyyy-MM-dd') === todayStr) {
              return (
                <Box sx={{
                  position: 'absolute',
                  left: i * dayWidth + dayWidth / 2 - 1,
                  top: 0,
                  bottom: 0,
                  width: 2,
                  backgroundColor: 'error.main',
                  zIndex: 10,
                  opacity: 0.8,
                  pointerEvents: 'none',
                }} />
              );
            }
          }
          return null;
        })()}
      </Box>

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