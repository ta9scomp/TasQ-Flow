import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  Slider,
  Alert,
  Button,
  Divider,
  FormGroup,
  Chip,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Speed as SpeedIcon,
  Memory as MemoryIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';

export interface PerformanceSettings {
  // 仮想スクロール
  enableVirtualScrolling: boolean;
  virtualScrollBuffer: number; // 画面外に保持する要素数
  
  // Canvas最適化
  enableCanvasOptimization: boolean;
  canvasPixelRatio: number;
  enableCanvasCache: boolean;
  
  // DOM最適化
  enableLazyLoading: boolean;
  enableDOMRecycling: boolean;
  maxVisibleTasks: number;
  
  // アニメーション
  enableSmoothAnimations: boolean;
  animationThreshold: number; // FPS閾値
  reducedMotion: boolean;
  
  // データ管理
  enableDataPagination: boolean;
  pageSize: number;
  enableMemoization: boolean;
  
  // デバッグ
  showPerformanceOverlay: boolean;
  logPerformanceMetrics: boolean;
}

const DEFAULT_SETTINGS: PerformanceSettings = {
  enableVirtualScrolling: true,
  virtualScrollBuffer: 5,
  enableCanvasOptimization: true,
  canvasPixelRatio: window.devicePixelRatio || 1,
  enableCanvasCache: true,
  enableLazyLoading: true,
  enableDOMRecycling: true,
  maxVisibleTasks: 100,
  enableSmoothAnimations: true,
  animationThreshold: 30,
  reducedMotion: false,
  enableDataPagination: false,
  pageSize: 500,
  enableMemoization: true,
  showPerformanceOverlay: false,
  logPerformanceMetrics: false,
};

interface Props {
  onSettingsChange?: (settings: PerformanceSettings) => void;
}

export const PerformanceOptimizationSettings: React.FC<Props> = ({ onSettingsChange }) => {
  const [settings, setSettings] = useState<PerformanceSettings>(DEFAULT_SETTINGS);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const updateSetting = <K extends keyof PerformanceSettings>(
    key: K,
    value: PerformanceSettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange?.(newSettings);
  };
  
  const applyPreset = (preset: 'performance' | 'quality' | 'balanced') => {
    let newSettings: PerformanceSettings;
    
    switch (preset) {
      case 'performance':
        newSettings = {
          ...DEFAULT_SETTINGS,
          enableVirtualScrolling: true,
          virtualScrollBuffer: 3,
          enableCanvasOptimization: true,
          canvasPixelRatio: 1,
          enableCanvasCache: true,
          enableLazyLoading: true,
          enableDOMRecycling: true,
          maxVisibleTasks: 50,
          enableSmoothAnimations: false,
          reducedMotion: true,
          enableDataPagination: true,
          pageSize: 200,
        };
        break;
        
      case 'quality':
        newSettings = {
          ...DEFAULT_SETTINGS,
          enableVirtualScrolling: false,
          virtualScrollBuffer: 10,
          enableCanvasOptimization: true,
          canvasPixelRatio: window.devicePixelRatio || 2,
          enableCanvasCache: false,
          enableLazyLoading: false,
          enableDOMRecycling: false,
          maxVisibleTasks: 1000,
          enableSmoothAnimations: true,
          reducedMotion: false,
          enableDataPagination: false,
          pageSize: 1000,
        };
        break;
        
      case 'balanced':
      default:
        newSettings = DEFAULT_SETTINGS;
        break;
    }
    
    setSettings(newSettings);
    onSettingsChange?.(newSettings);
  };
  
  const getPerformanceScore = (): number => {
    let score = 0;
    
    if (settings.enableVirtualScrolling) score += 20;
    if (settings.enableCanvasOptimization) score += 15;
    if (settings.enableLazyLoading) score += 15;
    if (settings.enableDOMRecycling) score += 10;
    if (settings.enableMemoization) score += 10;
    if (settings.reducedMotion) score += 5;
    if (settings.enableDataPagination) score += 10;
    if (settings.maxVisibleTasks <= 100) score += 10;
    if (settings.virtualScrollBuffer <= 5) score += 5;
    
    return score;
  };
  
  const performanceScore = getPerformanceScore();
  
  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <SettingsIcon sx={{ mr: 1 }} />
        <Typography variant="h6">
          パフォーマンス最適化設定
        </Typography>
        <Box sx={{ ml: 'auto' }}>
          <Chip
            icon={<SpeedIcon />}
            label={`パフォーマンススコア: ${performanceScore}/100`}
            color={performanceScore >= 70 ? 'success' : performanceScore >= 50 ? 'warning' : 'error'}
          />
        </Box>
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          プリセット
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" onClick={() => applyPreset('performance')}>
            最高速
          </Button>
          <Button variant="outlined" onClick={() => applyPreset('balanced')}>
            バランス
          </Button>
          <Button variant="outlined" onClick={() => applyPreset('quality')}>
            高品質
          </Button>
        </Box>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <FormGroup>
        <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <VisibilityIcon sx={{ mr: 1, fontSize: 20 }} />
          表示最適化
        </Typography>
        
        <FormControlLabel
          control={
            <Switch
              checked={settings.enableVirtualScrolling}
              onChange={(e) => updateSetting('enableVirtualScrolling', e.target.checked)}
            />
          }
          label="仮想スクロール"
        />
        
        {settings.enableVirtualScrolling && (
          <Box sx={{ ml: 4, mb: 2 }}>
            <Typography variant="caption" color="text.secondary">
              バッファサイズ: {settings.virtualScrollBuffer} 画面
            </Typography>
            <Slider
              value={settings.virtualScrollBuffer}
              onChange={(_, value) => updateSetting('virtualScrollBuffer', value as number)}
              min={1}
              max={10}
              marks
              size="small"
            />
          </Box>
        )}
        
        <FormControlLabel
          control={
            <Switch
              checked={settings.enableLazyLoading}
              onChange={(e) => updateSetting('enableLazyLoading', e.target.checked)}
            />
          }
          label="遅延読み込み"
        />
        
        <FormControlLabel
          control={
            <Switch
              checked={settings.enableDOMRecycling}
              onChange={(e) => updateSetting('enableDOMRecycling', e.target.checked)}
            />
          }
          label="DOM要素の再利用"
        />
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary">
            最大表示タスク数: {settings.maxVisibleTasks}
          </Typography>
          <Slider
            value={settings.maxVisibleTasks}
            onChange={(_, value) => updateSetting('maxVisibleTasks', value as number)}
            min={50}
            max={1000}
            step={50}
            marks={[
              { value: 50, label: '50' },
              { value: 500, label: '500' },
              { value: 1000, label: '1000' },
            ]}
            size="small"
          />
        </Box>
      </FormGroup>
      
      <Divider sx={{ my: 2 }} />
      
      <FormGroup>
        <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <SpeedIcon sx={{ mr: 1, fontSize: 20 }} />
          Canvas最適化
        </Typography>
        
        <FormControlLabel
          control={
            <Switch
              checked={settings.enableCanvasOptimization}
              onChange={(e) => updateSetting('enableCanvasOptimization', e.target.checked)}
            />
          }
          label="Canvas最適化"
        />
        
        <FormControlLabel
          control={
            <Switch
              checked={settings.enableCanvasCache}
              onChange={(e) => updateSetting('enableCanvasCache', e.target.checked)}
            />
          }
          label="Canvasキャッシュ"
        />
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary">
            ピクセル比: {settings.canvasPixelRatio.toFixed(1)}
          </Typography>
          <Slider
            value={settings.canvasPixelRatio}
            onChange={(_, value) => updateSetting('canvasPixelRatio', value as number)}
            min={0.5}
            max={2}
            step={0.1}
            marks={[
              { value: 0.5, label: '0.5' },
              { value: 1, label: '1.0' },
              { value: 2, label: '2.0' },
            ]}
            size="small"
          />
        </Box>
      </FormGroup>
      
      <Divider sx={{ my: 2 }} />
      
      <FormGroup>
        <Typography variant="subtitle2" gutterBottom>
          アニメーション
        </Typography>
        
        <FormControlLabel
          control={
            <Switch
              checked={settings.enableSmoothAnimations}
              onChange={(e) => updateSetting('enableSmoothAnimations', e.target.checked)}
            />
          }
          label="スムーズアニメーション"
        />
        
        <FormControlLabel
          control={
            <Switch
              checked={settings.reducedMotion}
              onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
            />
          }
          label="モーション削減"
        />
      </FormGroup>
      
      <Button
        variant="text"
        onClick={() => setShowAdvanced(!showAdvanced)}
        sx={{ mt: 2 }}
      >
        {showAdvanced ? '詳細設定を隠す' : '詳細設定を表示'}
      </Button>
      
      {showAdvanced && (
        <>
          <Divider sx={{ my: 2 }} />
          
          <FormGroup>
            <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <MemoryIcon sx={{ mr: 1, fontSize: 20 }} />
              データ管理
            </Typography>
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.enableDataPagination}
                  onChange={(e) => updateSetting('enableDataPagination', e.target.checked)}
                />
              }
              label="データページング"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.enableMemoization}
                  onChange={(e) => updateSetting('enableMemoization', e.target.checked)}
                />
              }
              label="計算結果のキャッシュ"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.showPerformanceOverlay}
                  onChange={(e) => updateSetting('showPerformanceOverlay', e.target.checked)}
                />
              }
              label="パフォーマンスオーバーレイ表示"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.logPerformanceMetrics}
                  onChange={(e) => updateSetting('logPerformanceMetrics', e.target.checked)}
                />
              }
              label="パフォーマンスログ出力"
            />
          </FormGroup>
        </>
      )}
      
      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="caption">
          パフォーマンス設定は、使用環境やデータ量によって最適値が異なります。
          実際の使用状況に合わせて調整してください。
        </Typography>
      </Alert>
    </Paper>
  );
};