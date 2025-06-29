import React, { useMemo } from 'react';
import { Box, Tooltip, Typography, Paper } from '@mui/material';
import Grid from '@mui/material/Grid';
import { format, getDay, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { ja } from 'date-fns/locale';
import type { WorkloadData } from './MemberWorkloadCalculator';

// ヒートマップの表示モード
export type HeatmapDisplayMode = 
  | 'calendar'     // カレンダー形式
  | 'timeline'     // タイムライン形式
  | 'compact'      // コンパクト表示
  | 'detailed'     // 詳細表示
  | 'github-style'; // GitHub風表示

// ヒートマップの色スキーム
export type HeatmapColorScheme = 
  | 'default'      // デフォルト（緑系）
  | 'heat'         // ヒート（赤-オレンジ-黄色）
  | 'cool'         // クール（青系）
  | 'monochrome'   // モノクローム
  | 'custom';      // カスタム

// ヒートマップの設定
export interface HeatmapConfig {
  displayMode: HeatmapDisplayMode;
  colorScheme: HeatmapColorScheme;
  showValues: boolean;        // 数値表示
  showLabels: boolean;        // ラベル表示
  showTooltips: boolean;      // ツールチップ表示
  cellSize: 'small' | 'medium' | 'large';
  showWeekends: boolean;      // 週末表示
  showPrivate: boolean;       // プライベートタスク表示
  customColors?: {
    low: string;
    medium: string;
    high: string;
    overload: string;
    private: string;
    unavailable: string;
  };
  animation: {
    enabled: boolean;
    duration: number;
    stagger: boolean;
  };
}

// デフォルト設定
const DEFAULT_CONFIG: HeatmapConfig = {
  displayMode: 'calendar',
  colorScheme: 'default',
  showValues: false,
  showLabels: true,
  showTooltips: true,
  cellSize: 'medium',
  showWeekends: true,
  showPrivate: true,
  animation: {
    enabled: true,
    duration: 300,
    stagger: true,
  },
};

// 色スキーム定義
const COLOR_SCHEMES = {
  default: {
    low: '#e8f5e8',
    medium: '#c8e6c9',
    high: '#a5d6a7',
    overload: '#ef5350',
    private: 'repeating-linear-gradient(45deg, #e0e0e0, #e0e0e0 2px, #f5f5f5 2px, #f5f5f5 6px)',
    unavailable: '#f5f5f5',
  },
  heat: {
    low: '#fff3e0',
    medium: '#ffcc80',
    high: '#ff9800',
    overload: '#d32f2f',
    private: 'repeating-linear-gradient(45deg, #e0e0e0, #e0e0e0 2px, #f5f5f5 2px, #f5f5f5 6px)',
    unavailable: '#f5f5f5',
  },
  cool: {
    low: '#e3f2fd',
    medium: '#90caf9',
    high: '#2196f3',
    overload: '#1565c0',
    private: 'repeating-linear-gradient(45deg, #e0e0e0, #e0e0e0 2px, #f5f5f5 2px, #f5f5f5 6px)',
    unavailable: '#f5f5f5',
  },
  monochrome: {
    low: '#f5f5f5',
    medium: '#bdbdbd',
    high: '#757575',
    overload: '#424242',
    private: 'repeating-linear-gradient(45deg, #e0e0e0, #e0e0e0 2px, #f5f5f5 2px, #f5f5f5 6px)',
    unavailable: '#f5f5f5',
  },
  custom: {
    low: '#e8f5e8',
    medium: '#c8e6c9',
    high: '#a5d6a7',
    overload: '#ef5350',
    private: 'repeating-linear-gradient(45deg, #e0e0e0, #e0e0e0 2px, #f5f5f5 2px, #f5f5f5 6px)',
    unavailable: '#f5f5f5',
  },
};

// セルサイズ定義
const CELL_SIZES = {
  small: { width: 24, height: 24, fontSize: '0.6rem' },
  medium: { width: 36, height: 36, fontSize: '0.7rem' },
  large: { width: 48, height: 48, fontSize: '0.8rem' },
};

interface HeatmapRendererProps {
  workloadData: WorkloadData[];
  config?: Partial<HeatmapConfig>;
  onCellClick?: (data: WorkloadData) => void;
  onCellHover?: (data: WorkloadData | null) => void;
}

export const HeatmapRenderer: React.FC<HeatmapRendererProps> = ({
  workloadData,
  config: configOverrides = {},
  onCellClick,
  onCellHover,
}) => {
  const config: HeatmapConfig = { ...DEFAULT_CONFIG, ...configOverrides };
  
  // 色を取得する関数
  const getColor = (data: WorkloadData): string => {
    const colors = config.customColors || COLOR_SCHEMES[config.colorScheme];
    
    // プライベートタスクの場合
    if (data.activeTasks.some(task => task.tags?.includes('private')) && !config.showPrivate) {
      return colors.private;
    }
    
    // 稼働率に基づく色分け
    if (data.capacity === 0) return colors.unavailable;
    if (data.capacity <= 25) return colors.low;
    if (data.capacity <= 75) return colors.medium;
    if (data.capacity <= 100) return colors.high;
    return colors.overload;
  };

  // セルサイズを取得
  const cellSize = CELL_SIZES[config.cellSize];

  // ツールチップ内容の生成
  const generateTooltipContent = (data: WorkloadData) => (
    <Box>
      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
        {format(data.date, 'yyyy年MM月dd日 (E)', { locale: ja })}
      </Typography>
      <Typography variant="caption" display="block">
        稼働率: {Math.round(data.capacity)}%
      </Typography>
      <Typography variant="caption" display="block">
        状態: {getAvailabilityLabel(data.availability)}
      </Typography>
      {data.totalTasks > 0 && (
        <>
          <Typography variant="caption" display="block">
            タスク数: {data.totalTasks}件
          </Typography>
          {data.activeTasks.slice(0, 3).map(task => (
            <Typography key={task.id} variant="caption" display="block" sx={{ pl: 1 }}>
              • {task.title}
            </Typography>
          ))}
          {data.activeTasks.length > 3 && (
            <Typography variant="caption" display="block" sx={{ pl: 1 }}>
              他 {data.activeTasks.length - 3} 件...
            </Typography>
          )}
        </>
      )}
      {data.isOverloaded && (
        <Typography variant="caption" display="block" color="error">
          ⚠️ 過負荷状態
        </Typography>
      )}
    </Box>
  );

  // セルのレンダリング
  const renderCell = (data: WorkloadData, index: number) => {
    const color = getColor(data);
    const animationDelay = config.animation.stagger ? index * 20 : 0;

    const cellElement = (
      <Box
        key={data.date.toISOString()}
        onClick={() => onCellClick?.(data)}
        onMouseEnter={() => onCellHover?.(data)}
        onMouseLeave={() => onCellHover?.(null)}
        sx={{
          width: cellSize.width,
          height: cellSize.height,
          background: color,
          border: data.isOverloaded ? '2px solid #d32f2f' : '1px solid rgba(0,0,0,0.1)',
          borderRadius: config.displayMode === 'github-style' ? 0.5 : 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          position: 'relative',
          transition: config.animation.enabled 
            ? `all ${config.animation.duration}ms ease-out`
            : 'none',
          animationDelay: config.animation.enabled ? `${animationDelay}ms` : undefined,
          '&:hover': {
            transform: 'scale(1.1)',
            zIndex: 10,
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          },
          // 週末のスタイル調整
          ...(getDay(data.date) === 0 || getDay(data.date) === 6 ? {
            opacity: config.showWeekends ? 1 : 0.5,
          } : {}),
        }}
      >
        {/* 値表示 */}
        {config.showValues && (
          <Typography 
            variant="caption" 
            sx={{ 
              fontSize: cellSize.fontSize,
              fontWeight: 'bold',
              color: data.capacity > 50 ? 'white' : 'black',
            }}
          >
            {config.displayMode === 'calendar' ? format(data.date, 'd') : Math.round(data.capacity)}
          </Typography>
        )}

        {/* 過負荷インジケーター */}
        {data.isOverloaded && (
          <Box
            sx={{
              position: 'absolute',
              top: 1,
              right: 1,
              width: 6,
              height: 6,
              backgroundColor: '#d32f2f',
              borderRadius: '50%',
            }}
          />
        )}

        {/* 高優先度タスクインジケーター */}
        {data.highPriorityTasks.length > 0 && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 1,
              left: 1,
              width: 4,
              height: 4,
              backgroundColor: '#ff9800',
              borderRadius: '50%',
            }}
          />
        )}
      </Box>
    );

    return config.showTooltips ? (
      <Tooltip
        key={data.date.toISOString()}
        title={generateTooltipContent(data)}
        placement="top"
        arrow
      >
        {cellElement}
      </Tooltip>
    ) : cellElement;
  };

  // 表示モード別のレンダリング
  const renderHeatmap = () => {
    switch (config.displayMode) {
      case 'calendar':
        return renderCalendarMode();
      case 'timeline':
        return renderTimelineMode();
      case 'compact':
        return renderCompactMode();
      case 'detailed':
        return renderDetailedMode();
      case 'github-style':
        return renderGithubStyleMode();
      default:
        return renderCalendarMode();
    }
  };

  // カレンダーモード
  const renderCalendarMode = () => {
    if (workloadData.length === 0) return null;

    const firstDate = workloadData[0].date;
    const lastDate = workloadData[workloadData.length - 1].date;
    const weekStart = startOfWeek(firstDate, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(lastDate, { weekStartsOn: 0 });
    const allDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    // 週ごとにグループ化
    const weeks: Date[][] = [];
    for (let i = 0; i < allDays.length; i += 7) {
      weeks.push(allDays.slice(i, i + 7));
    }

    return (
      <Box>
        {config.showLabels && (
          <Grid container sx={{ mb: 1 }}>
            {['日', '月', '火', '水', '木', '金', '土'].map(day => (
              <Grid size='grow' key={day} sx={{ textAlign: 'center' }}>
                <Typography variant="caption" fontWeight="bold">
                  {day}
                </Typography>
              </Grid>
            ))}
          </Grid>
        )}

        {weeks.map((week, weekIndex) => (
          <Grid container key={weekIndex} sx={{ mb: 0.5, justifyContent: 'center' }}>
            {week.map((date, dayIndex) => {
              const dayData = workloadData.find(d => 
                d.date.toDateString() === date.toDateString()
              );
              
              return (
                <Grid key={dayIndex} sx={{ textAlign: 'center', p: 0.25 }}>
                  {dayData ? (
                    renderCell(dayData, weekIndex * 7 + dayIndex)
                  ) : (
                    <Box
                      sx={{
                        width: cellSize.width,
                        height: cellSize.height,
                        backgroundColor: 'transparent',
                      }}
                    />
                  )}
                </Grid>
              );
            })}
          </Grid>
        ))}
      </Box>
    );
  };

  // タイムラインモード
  const renderTimelineMode = () => (
    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', justifyContent: 'center' }}>
      {workloadData.map((data, index) => renderCell(data, index))}
    </Box>
  );

  // コンパクトモード
  const renderCompactMode = () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(20px, 1fr))', gap: 0.25 }}>
      {workloadData.map((data, index) => renderCell(data, index))}
    </Box>
  );

  // 詳細モード
  const renderDetailedMode = () => (
    <Box>
      {workloadData.map((data, index) => (
        <Box key={data.date.toISOString()} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          {renderCell(data, index)}
          <Box sx={{ ml: 2, flex: 1 }}>
            <Typography variant="body2">
              {format(data.date, 'yyyy/MM/dd (E)', { locale: ja })}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              稼働率: {Math.round(data.capacity)}% | タスク: {data.totalTasks}件
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );

  // GitHub風モード
  const renderGithubStyleMode = () => {
    const weeksData = useMemo(() => {
      const weeks: WorkloadData[][] = [];
      let currentWeek: WorkloadData[] = [];
      
      workloadData.forEach(data => {
        if (getDay(data.date) === 0 && currentWeek.length > 0) {
          weeks.push(currentWeek);
          currentWeek = [];
        }
        currentWeek.push(data);
      });
      
      if (currentWeek.length > 0) {
        weeks.push(currentWeek);
      }
      
      return weeks;
    }, [workloadData]);

    return (
      <Box sx={{ display: 'flex', gap: 0.25, overflowX: 'auto' }}>
        {weeksData.map((week, weekIndex) => (
          <Box key={weekIndex} sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
            {week.map((data, dayIndex) => renderCell(data, weekIndex * 7 + dayIndex))}
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Paper sx={{ p: 2 }}>
      {renderHeatmap()}
    </Paper>
  );
};

// ヘルパー関数
function getAvailabilityLabel(availability: WorkloadData['availability']): string {
  switch (availability) {
    case 'available': return '余裕あり';
    case 'busy': return '忙しい';
    case 'overloaded': return '過負荷';
    case 'unavailable': return '利用不可';
    default: return '不明';
  }
}

// カラーパレット生成ユーティリティ
export function generateCustomColorPalette(
  baseColor: string,
  _intensity: 'light' | 'normal' | 'dark' = 'normal'
): HeatmapConfig['customColors'] {
  // HSLカラーから段階的なパレットを生成
  // 実装は簡略化
  return {
    low: `${baseColor}30`,
    medium: `${baseColor}60`,
    high: `${baseColor}90`,
    overload: '#ef5350',
    private: 'repeating-linear-gradient(45deg, #e0e0e0, #e0e0e0 2px, #f5f5f5 2px, #f5f5f5 6px)',
    unavailable: '#f5f5f5',
  };
}

// レスポンシブ設定生成
export function getResponsiveHeatmapConfig(screenWidth: number): Partial<HeatmapConfig> {
  if (screenWidth < 600) {
    return {
      cellSize: 'small',
      displayMode: 'compact',
      showValues: false,
      showLabels: false,
    };
  } else if (screenWidth < 900) {
    return {
      cellSize: 'medium',
      displayMode: 'calendar',
      showValues: true,
      showLabels: true,
    };
  } else {
    return {
      cellSize: 'large',
      displayMode: 'detailed',
      showValues: true,
      showLabels: true,
    };
  }
}