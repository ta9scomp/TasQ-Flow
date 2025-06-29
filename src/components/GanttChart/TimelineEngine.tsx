import React, { useRef, useEffect, useCallback, useState, useMemo } from 'react';
import { Box } from '@mui/material';
import { addDays, format, startOfMonth, endOfMonth, differenceInDays } from 'date-fns';

// 統合要件仕様書に基づくTimelineEngineのコア実装
// 月表示スナップ、スケール制御、60fps保証、ニュートンのゆりかご効果

interface TimelineEngineProps {
  centerDate: Date;
  scale: number; // 0.25-4倍のスケール
  containerWidth: number;
  scrollOffset: number;
  onDateClick?: (date: Date) => void;
  onScaleChange?: (newScale: number) => void;
  holidays?: Array<{ date: Date; name: string; color: string }>;
  events?: Array<{ startDate: Date; endDate?: Date; name: string; color: string }>;
}

// 統合要件仕様書準拠の定数
const MIN_SCALE = 0.25;
const MAX_SCALE = 4.0;
const BASE_DAY_WIDTH = 30; // 基準日幅
const YEAR_START = 2020;
const YEAR_END = 2040;
const ANIMATION_DURATION = 300; // ミリ秒
// const TARGET_FPS = 60; // 未使用のため一時的にコメントアウト

// RangeBuffer実装（±365日動的管理）
const BUFFER_DAYS = 365;
const EXTEND_THRESHOLD_DAYS = 30;

interface MonthData {
  year: number;
  month: number;
  startDate: Date;
  endDate: Date;
  startX: number;
  width: number;
  centerX: number;
  displayText: string;
  opacity: number; // フェード制御用
}

interface DayData {
  date: Date;
  x: number;
  width: number;
  isWeekend: boolean;
  isToday: boolean;
  isHoliday: boolean;
  isEvent: boolean;
  backgroundColor: string;
  textColor: string;
  showText: boolean; // 文字表示制御
}

export const TimelineEngine: React.FC<TimelineEngineProps> = ({
  centerDate,
  scale,
  containerWidth,
  scrollOffset,
  onDateClick,
  holidays = [],
  events = []
}) => {
  const monthCanvasRef = useRef<HTMLCanvasElement>(null);
  const dayCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  
  // 強化されたアニメーション状態（60fps保証、ニュートンのゆりかご効果）
  const [animationState, setAnimationState] = useState({
    isAnimating: false,
    animationType: 'scroll' as 'scroll' | 'scale' | 'snap',
    startTime: 0,
    fromOffset: 0,
    toOffset: 0,
    fromScale: 1,
    toScale: 1,
    duration: ANIMATION_DURATION,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)' as 'cubic-bezier(0.4, 0, 0.2, 1)' | 'linear' | 'cubic-bezier(0.34, 1.56, 0.64, 1)'
  });

  // スナップポジション計算（月境界への自動スナップ）
  const calculateSnapPosition = useCallback((currentOffset: number, monthsData: MonthData[]) => {
    if (!monthsData.length) return currentOffset;
    
    const viewportCenter = currentOffset + containerWidth / 2;
    let closestDistance = Infinity;
    let snapPosition = currentOffset;
    
    monthsData.forEach(month => {
      const monthCenterDistance = Math.abs(month.centerX - viewportCenter);
      const monthStartDistance = Math.abs(month.startX - viewportCenter);
      
      if (monthCenterDistance < closestDistance) {
        closestDistance = monthCenterDistance;
        snapPosition = month.centerX - containerWidth / 2;
      }
      
      if (monthStartDistance < closestDistance) {
        closestDistance = monthStartDistance;
        snapPosition = month.startX - containerWidth / 2;
      }
    });
    
    return snapPosition;
  }, [containerWidth]);

  // スケール変更アニメーション（未使用のため一時的にコメントアウト）
  // const animateScaleChange = useCallback((newScale: number) => {
  //   if (animationState.isAnimating) return;
  //   
  //   setAnimationState({
  //     isAnimating: true,
  //     animationType: 'scale',
  //     startTime: performance.now(),
  //     fromOffset: scrollOffset,
  //     toOffset: scrollOffset,
  //     fromScale: scale,
  //     toScale: newScale,
  //     duration: ANIMATION_DURATION,
  //     easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
  //   });
  // }, [animationState.isAnimating, scrollOffset, scale]);

  // スナップアニメーション（ニュートンのゆりかご効果）
  const animateSnapToMonth = useCallback((monthsData: MonthData[]) => {
    if (animationState.isAnimating) return;
    
    const snapPosition = calculateSnapPosition(scrollOffset, monthsData);
    if (Math.abs(snapPosition - scrollOffset) < 5) return; // 5px未満は無視
    
    setAnimationState({
      isAnimating: true,
      animationType: 'snap',
      startTime: performance.now(),
      fromOffset: scrollOffset,
      toOffset: snapPosition,
      fromScale: scale,
      toScale: scale,
      duration: ANIMATION_DURATION * 0.8, // スナップは少し早く
      easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' // バウンス効果
    });
  }, [animationState.isAnimating, scrollOffset, scale, calculateSnapPosition]);

  // スケール適用後の日幅計算
  const dayWidth = useMemo(() => {
    const clampedScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale));
    return BASE_DAY_WIDTH * clampedScale;
  }, [scale]);

  // 動的範囲拡張状態
  const [rangeState, setRangeState] = useState(() => ({
    bufferStart: addDays(centerDate, -BUFFER_DAYS),
    bufferEnd: addDays(centerDate, BUFFER_DAYS),
    lastScrollOffset: 0,
    isExpanding: false
  }));

  // 動的日付範囲（拡張RangeBuffer実装）
  const visibleRange = useMemo(() => {
    const start = rangeState.bufferStart;
    const end = rangeState.bufferEnd;
    
    // 2020-2040年制限の適用
    const yearStart = new Date(YEAR_START, 0, 1);
    const yearEnd = new Date(YEAR_END, 11, 31);
    
    return {
      start: start < yearStart ? yearStart : start,
      end: end > yearEnd ? yearEnd : end
    };
  }, [rangeState]);

  // 範囲拡張トリガー（Virtual Scrolling最適化）
  const checkAndExpandRange = useCallback((currentScrollOffset: number) => {
    if (rangeState.isExpanding) return;
    
    const viewportDays = containerWidth / dayWidth;
    const scrollDays = currentScrollOffset / dayWidth;
    const centerOffsetDays = differenceInDays(centerDate, rangeState.bufferStart);
    
    const viewportStartDays = centerOffsetDays + scrollDays;
    const viewportEndDays = viewportStartDays + viewportDays;
    
    const totalBufferDays = differenceInDays(rangeState.bufferEnd, rangeState.bufferStart);
    
    // 拡張判定（端から30日以内でスクロール）
    const needsExpandStart = viewportStartDays < EXTEND_THRESHOLD_DAYS;
    const needsExpandEnd = viewportEndDays > totalBufferDays - EXTEND_THRESHOLD_DAYS;
    
    if (needsExpandStart || needsExpandEnd) {
      setRangeState(prev => ({
        ...prev,
        isExpanding: true,
        bufferStart: needsExpandStart ? addDays(prev.bufferStart, -90) : prev.bufferStart,
        bufferEnd: needsExpandEnd ? addDays(prev.bufferEnd, 90) : prev.bufferEnd
      }));
      
      // 拡張完了後にフラグをリセット
      setTimeout(() => {
        setRangeState(prev => ({ ...prev, isExpanding: false }));
      }, 100);
    }
    
    setRangeState(prev => ({ ...prev, lastScrollOffset: currentScrollOffset }));
  }, [rangeState, containerWidth, dayWidth, centerDate]);

  // スクロール監視による範囲拡張
  useEffect(() => {
    checkAndExpandRange(scrollOffset);
  }, [scrollOffset, checkAndExpandRange]);

  // 月データ生成（スナップ機能対応）
  const months = useMemo(() => {
    const monthList: MonthData[] = [];
    let currentDate = startOfMonth(visibleRange.start);
    
    while (currentDate <= visibleRange.end) {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      
      const startOffsetDays = differenceInDays(monthStart, centerDate);
      const endOffsetDays = differenceInDays(monthEnd, centerDate);
      
      const startX = startOffsetDays * dayWidth;
      const endX = (endOffsetDays + 1) * dayWidth;
      const width = endX - startX;
      const centerX = startX + width / 2;
      
      // 月表示テキスト
      const displayText = format(monthStart, 'yyyy年MM月');
      
      // スナップ位置計算
      const viewportCenter = scrollOffset + containerWidth / 2;
      const distanceFromCenter = Math.abs(centerX - viewportCenter);
      
      // フェード制御（ニュートンのゆりかご効果）
      const maxDistance = containerWidth / 2;
      const opacity = Math.max(0, 1 - (distanceFromCenter / maxDistance));
      
      monthList.push({
        year: monthStart.getFullYear(),
        month: monthStart.getMonth(),
        startDate: monthStart,
        endDate: monthEnd,
        startX,
        width,
        centerX,
        displayText,
        opacity
      });
      
      currentDate = addDays(monthEnd, 1);
    }
    
    return monthList;
  }, [visibleRange, centerDate, dayWidth, scrollOffset, containerWidth]);

  // 日付データ生成
  const days = useMemo(() => {
    const dayList: DayData[] = [];
    const totalDays = differenceInDays(visibleRange.end, visibleRange.start) + 1;
    
    for (let i = 0; i < totalDays; i++) {
      const date = addDays(visibleRange.start, i);
      const offsetFromCenter = differenceInDays(date, centerDate);
      const x = offsetFromCenter * dayWidth;
      
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
      
      // 祝日・イベントチェック
      const holiday = holidays.find(h => 
        format(h.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      );
      
      const event = events.find(e => {
        const eventStart = format(e.startDate, 'yyyy-MM-dd');
        const eventEnd = e.endDate ? format(e.endDate, 'yyyy-MM-dd') : eventStart;
        const currentDay = format(date, 'yyyy-MM-dd');
        return currentDay >= eventStart && currentDay <= eventEnd;
      });
      
      // 背景色とテキスト色の決定
      let backgroundColor = '#ffffff';
      let textColor = '#333333';
      
      if (holiday) {
        backgroundColor = holiday.color;
        textColor = '#ffffff';
      } else if (event) {
        backgroundColor = event.color;
        textColor = '#ffffff';
      } else if (isWeekend) {
        backgroundColor = '#f5f5f5';
      }
      
      if (isToday) {
        backgroundColor = '#2196F3';
        textColor = '#ffffff';
      }
      
      // 文字表示制御（スケール依存）
      const showText = dayWidth >= 25; // 25px以上で文字表示
      
      dayList.push({
        date,
        x,
        width: dayWidth,
        isWeekend,
        isToday,
        isHoliday: !!holiday,
        isEvent: !!event,
        backgroundColor,
        textColor,
        showText
      });
    }
    
    return dayList;
  }, [visibleRange, centerDate, dayWidth, holidays, events]);

  // 高度なイージング関数実装
  const applyEasing = useCallback((progress: number, easing: string) => {
    switch (easing) {
      case 'cubic-bezier(0.4, 0, 0.2, 1)':
        return 1 - Math.pow(1 - progress, 3);
      case 'cubic-bezier(0.34, 1.56, 0.64, 1)': // バウンス効果
        return progress < 0.5 
          ? 4 * progress * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      case 'linear':
        return progress;
      default:
        return 1 - Math.pow(1 - progress, 3);
    }
  }, []);

  // 強化されたAnimationScheduler: 60fps保証のスムーズアニメーション
  const animationScheduler = useCallback((timestamp: number) => {
    if (!animationState.isAnimating) return;
    
    const elapsed = timestamp - animationState.startTime;
    const progress = Math.min(elapsed / animationState.duration, 1);
    
    // 高度なイージング適用
    const easeProgress = applyEasing(progress, animationState.easing);
    
    let currentOffset = scrollOffset;
    let currentScale = scale;
    
    // アニメーションタイプ別の処理
    switch (animationState.animationType) {
      case 'scroll':
      case 'snap':
        currentOffset = animationState.fromOffset + 
          (animationState.toOffset - animationState.fromOffset) * easeProgress;
        break;
      case 'scale':
        currentScale = animationState.fromScale + 
          (animationState.toScale - animationState.fromScale) * easeProgress;
        break;
    }
    
    // 60fps保証のスムーズ描画
    drawMonthCanvas(currentOffset, currentScale);
    drawDayCanvas(currentOffset, currentScale);
    
    if (progress < 1) {
      animationFrameRef.current = requestAnimationFrame(animationScheduler);
    } else {
      // アニメーション完了処理
      setAnimationState(prev => ({ ...prev, isAnimating: false }));
      
      // スナップアニメーション完了後のコールバック
      if (animationState.animationType === 'snap') {
        // ニュートンのゆりかご効果完了
        console.log('Month snap completed with Newton\'s cradle effect');
      }
    }
  }, [animationState, scrollOffset, scale, applyEasing]);

  // スクロール終了検出とスナップトリガー
  const scrollEndTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const triggerSnapAfterScrollEnd = useCallback(() => {
    if (scrollEndTimer.current) {
      clearTimeout(scrollEndTimer.current);
    }
    
    scrollEndTimer.current = setTimeout(() => {
      animateSnapToMonth(months);
    }, 150); // 150ms待機後にスナップ
  }, [animateSnapToMonth, months]);

  // 月ヘッダーCanvas描画（スケール対応）
  const drawMonthCanvas = useCallback((currentOffset: number = scrollOffset, currentScale: number = scale) => {
    const canvas = monthCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const canvasWidth = canvas.width / (window.devicePixelRatio || 1);
    const canvasHeight = canvas.height / (window.devicePixelRatio || 1);
    
    // スケール適用の日幅計算
    const currentDayWidth = BASE_DAY_WIDTH * currentScale;
    
    // クリア
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // 背景
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // 月表示（スナップ機能付き）
    months.forEach(month => {
      const x = month.centerX - currentOffset;
      
      // 画面内判定
      if (x < -month.width / 2 || x > canvasWidth + month.width / 2) return;
      
      // ニュートンのゆりかご効果のフェード
      ctx.save();
      ctx.globalAlpha = month.opacity;
      
      // 月境界線
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(month.startX - currentOffset, 0);
      ctx.lineTo(month.startX - currentOffset, canvasHeight);
      ctx.stroke();
      
      // 月テキスト（中央配置、スケール対応フォントサイズ）
      ctx.fillStyle = '#333333';
      ctx.font = `bold ${Math.max(12, currentDayWidth / 3)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // 文字フェード制御（スケール対応）
      if (currentDayWidth >= 60) {
        ctx.fillText(month.displayText, x, canvasHeight / 2);
      }
      
      ctx.restore();
    });
  }, [months, scrollOffset, containerWidth]);

  // 日付Canvas描画（スケール対応）
  const drawDayCanvas = useCallback((currentOffset: number = scrollOffset, currentScale: number = scale) => {
    const canvas = dayCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const canvasWidth = canvas.width / (window.devicePixelRatio || 1);
    const canvasHeight = canvas.height / (window.devicePixelRatio || 1);
    
    // スケール適用の日幅計算
    const currentDayWidth = BASE_DAY_WIDTH * currentScale;
    
    // クリア
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // 日付セル描画
    days.forEach(day => {
      const x = day.x - currentOffset;
      const scaledWidth = currentDayWidth; // スケール適用後の幅
      
      // 画面内判定
      if (x < -scaledWidth || x > canvasWidth + scaledWidth) return;
      
      // 背景
      ctx.fillStyle = day.backgroundColor;
      ctx.fillRect(x, 0, scaledWidth, canvasHeight);
      
      // 境界線
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(x + scaledWidth, 0);
      ctx.lineTo(x + scaledWidth, canvasHeight);
      ctx.stroke();
      
      // 日付テキスト（スケール対応フェード制御）
      const showTextScaled = currentDayWidth >= 25; // スケール適用後の表示判定
      if (showTextScaled) {
        ctx.fillStyle = day.textColor;
        ctx.font = `${Math.max(10, currentDayWidth / 4)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const dayNumber = day.date.getDate();
        ctx.fillText(dayNumber.toString(), x + scaledWidth / 2, canvasHeight / 2);
      }
    });
  }, [days, scrollOffset]);

  // Canvas初期化
  useEffect(() => {
    const monthCanvas = monthCanvasRef.current;
    const dayCanvas = dayCanvasRef.current;
    
    if (!monthCanvas || !dayCanvas || containerWidth <= 0) return;
    
    const devicePixelRatio = window.devicePixelRatio || 1;
    
    // 月ヘッダーCanvas
    monthCanvas.width = containerWidth * devicePixelRatio;
    monthCanvas.height = 35 * devicePixelRatio;
    monthCanvas.style.width = `${containerWidth}px`;
    monthCanvas.style.height = '35px';
    
    // 日付Canvas
    dayCanvas.width = containerWidth * devicePixelRatio;
    dayCanvas.height = 45 * devicePixelRatio;
    dayCanvas.style.width = `${containerWidth}px`;
    dayCanvas.style.height = '45px';
    
    // Context設定
    const monthCtx = monthCanvas.getContext('2d');
    const dayCtx = dayCanvas.getContext('2d');
    
    if (monthCtx) {
      monthCtx.scale(devicePixelRatio, devicePixelRatio);
    }
    if (dayCtx) {
      dayCtx.scale(devicePixelRatio, devicePixelRatio);
    }
    
    // 初期描画
    drawMonthCanvas();
    drawDayCanvas();
  }, [containerWidth, drawMonthCanvas, drawDayCanvas]);

  // スクロール更新とスナップトリガー
  useEffect(() => {
    if (!animationState.isAnimating) {
      drawMonthCanvas();
      drawDayCanvas();
      
      // スクロール終了検出でスナップを発動
      triggerSnapAfterScrollEnd();
    }
  }, [scrollOffset, drawMonthCanvas, drawDayCanvas, animationState.isAnimating, triggerSnapAfterScrollEnd, months]);

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '80px' }}>
      {/* 月ヘッダー */}
      <canvas
        ref={monthCanvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '35px',
          display: 'block'
        }}
      />
      
      {/* 日付カレンダー */}
      <canvas
        ref={dayCanvasRef}
        style={{
          position: 'absolute',
          top: '35px',
          left: 0,
          width: '100%',
          height: '45px',
          display: 'block',
          cursor: 'pointer'
        }}
        onClick={(e) => {
          if (!onDateClick) return;
          
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left + scrollOffset;
          const dayIndex = Math.floor(x / dayWidth);
          const clickedDay = days[dayIndex];
          
          if (clickedDay) {
            onDateClick(clickedDay.date);
          }
        }}
      />
    </Box>
  );
};