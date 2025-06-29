import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  ButtonGroup,
  LinearProgress,
  Chip,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  IconButton,
  Collapse,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  PlayArrow as StartIcon,
  Stop as StopIcon,
  RestartAlt as ResetIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
  Speed as SpeedIcon,
  Assessment as ReportIcon,
  GetApp as ExportIcon,
} from '@mui/icons-material';
import { 
  runPerformanceTest, 
  performanceTestScenarios,
  measureMemoryUsage
} from '../../data/performanceTestData';
import { useAppStore } from '../../stores/useAppStore';
import { performanceTestRunner } from '../../utils/performanceTestRunner';
import { 
  StyledCard, 
  SectionHeader, 
  PrimaryActionButton, 
  SecondaryActionButton,
  StatusChip 
} from '../../styles/commonStyles';

interface PerformanceMetrics {
  renderTime: number;
  updateTime: number;
  scrollFPS: number;
  memoryUsage: ReturnType<typeof measureMemoryUsage>;
  taskCount: number;
  visibleElements: number;
  canvasDrawCalls: number;
}

interface TestResult {
  scenario: keyof typeof performanceTestScenarios;
  metrics: PerformanceMetrics;
  timestamp: Date;
  duration: number;
}

export const PerformanceTestPanel: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentScenario, setCurrentScenario] = useState<keyof typeof performanceTestScenarios>('small');
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<TestResult[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [currentMetrics, setCurrentMetrics] = useState<PerformanceMetrics | null>(null);
  
  const { setTasks, setMembers, tasks } = useAppStore();
  
  // デバッグログ
  React.useEffect(() => {
    console.log('🔧 PerformanceTestPanel mounted');
    console.log('Available scenarios:', Object.keys(performanceTestScenarios));
    console.log('Performance test runner available:', !!performanceTestRunner);
  }, []);
  
  // FPS測定 (unused)
  // const measureFPS = useCallback(() => { ... }, [isRunning]);
  
  // レンダリング時間の測定 (unused)
  // const measureRenderTime = useCallback(async () => { ... }, []);
  
  // パフォーマンステストの実行
  const runTest = useCallback(async (scenario: keyof typeof performanceTestScenarios) => {
    console.log('🚀 Starting performance test:', scenario);
    setIsRunning(true);
    setProgress(0);
    
    const testStartTime = performance.now();
    
    try {
      // データ生成
      setProgress(10);
      console.log('📊 Generating test data for scenario:', scenario);
      const data = runPerformanceTest(scenario);
      console.log('✅ Data generated:', { 
        tasks: data.tasks.length, 
        members: data.members.length,
        events: data.events.length 
      });
      
      // データ適用
      setProgress(30);
      console.log('🔄 Applying data to store...');
      setTasks(data.tasks);
      setMembers(data.members);
      console.log('✅ Data applied to store');
      
      // レンダリング待機
      setProgress(50);
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 実際のパフォーマンス測定
      setProgress(70);
      console.log('📈 Running browser performance test...');
      const browserResult = await performanceTestRunner.runTest(
        scenario,
        data.tasks.length,
        (progress) => setProgress(70 + (progress * 0.2)) // 70-90%
      );
      console.log('✅ Browser performance test completed:', browserResult);
      
      // 従来のメトリクスも測定
      const memoryUsage = measureMemoryUsage();
      const visibleElements = document.querySelectorAll('[data-testid]').length;
      const allElements = document.querySelectorAll('*').length;
      
      // 結果記録
      const metrics: PerformanceMetrics = {
        renderTime: browserResult.renderTime,
        updateTime: 0,
        scrollFPS: browserResult.fps,
        memoryUsage,
        taskCount: data.tasks.length,
        visibleElements: visibleElements || allElements,
        canvasDrawCalls: document.querySelectorAll('canvas').length * browserResult.fps,
      };
      
      setCurrentMetrics(metrics);
      
      const result: TestResult = {
        scenario,
        metrics,
        timestamp: new Date(),
        duration: performance.now() - testStartTime,
      };
      
      setResults(prev => [...prev, result]);
      setProgress(100);
      
      // 完了後の待機
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error('❌ Performance test failed:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    } finally {
      console.log('🏁 Performance test finished');
      setIsRunning(false);
      setProgress(0);
    }
  }, [setTasks, setMembers]);
  
  // 自動スクロールテスト
  const runScrollTest = useCallback(async () => {
    if (tasks.length === 0) {
      console.warn('スクロールテストを実行するには、まずパフォーマンステストを実行してください');
      return;
    }
    
    try {
      // ガントチャートコンテナを探す
      const ganttContainer = document.querySelector('[data-testid="gantt-container"]') ||
                            document.querySelector('.gantt-container') ||
                            document.querySelector('[class*="gantt"]');
      
      if (!ganttContainer) {
        console.warn('Gantt container not found. Available containers:', 
                    Array.from(document.querySelectorAll('[data-testid]')).map(el => el.getAttribute('data-testid')));
        return;
      }
      
      const scrollResult = await performanceTestRunner.runScrollTest(
        ganttContainer.tagName.toLowerCase() + (ganttContainer.className ? '.' + ganttContainer.className.split(' ')[0] : '')
      );
      
      console.log('Scroll Test Results:', scrollResult);
      
      // 現在のメトリクスを更新
      if (currentMetrics) {
        const updatedMetrics: PerformanceMetrics = {
          ...currentMetrics,
          scrollFPS: scrollResult.fps,
          updateTime: scrollResult.smoothness * 100
        };
        setCurrentMetrics(updatedMetrics);
      }
      
    } catch (error) {
      console.error('Scroll test failed:', error);
    }
  }, [tasks.length, currentMetrics]);
  
  // メトリクスの表示
  const renderMetrics = (metrics: PerformanceMetrics) => (
    <TableContainer>
      <Table size="small">
        <TableBody>
          <TableRow>
            <TableCell>レンダリング時間</TableCell>
            <TableCell align="right">
              <Chip 
                label={`${metrics.renderTime.toFixed(2)} ms`}
                color={metrics.renderTime < 100 ? 'success' : metrics.renderTime < 200 ? 'warning' : 'error'}
                size="small"
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>タスク数</TableCell>
            <TableCell align="right">{metrics.taskCount.toLocaleString()}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>DOM要素数</TableCell>
            <TableCell align="right">{metrics.visibleElements.toLocaleString()}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>推定FPS</TableCell>
            <TableCell align="right">
              <Chip 
                label={`${metrics.scrollFPS} fps`}
                color={metrics.scrollFPS >= 50 ? 'success' : metrics.scrollFPS >= 30 ? 'warning' : 'error'}
                size="small"
              />
            </TableCell>
          </TableRow>
          {metrics.memoryUsage && (
            <>
              <TableRow>
                <TableCell>使用メモリ</TableCell>
                <TableCell align="right">{metrics.memoryUsage.usedJSHeapSize}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>総メモリ</TableCell>
                <TableCell align="right">{metrics.memoryUsage.totalJSHeapSize}</TableCell>
              </TableRow>
            </>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
  
  return (
    <StyledCard sx={{ m: 2 }}>
      <SectionHeader>
        <Typography variant="h5" component="h2" sx={{ display: 'flex', alignItems: 'center' }}>
          <SpeedIcon sx={{ mr: 1, color: 'primary.main' }} />
          🚀 パフォーマンステスト
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isRunning && <StatusChip status="warning">実行中</StatusChip>}
          <IconButton onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? <CollapseIcon /> : <ExpandIcon />}
          </IconButton>
        </Box>
      </SectionHeader>
      
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2" gutterBottom>
            テストシナリオ
          </Typography>
          <ButtonGroup fullWidth variant="outlined" sx={{ mb: 2 }}>
            {Object.keys(performanceTestScenarios).map((scenario) => (
              <Button
                key={scenario}
                variant={currentScenario === scenario ? 'contained' : 'outlined'}
                onClick={() => setCurrentScenario(scenario as keyof typeof performanceTestScenarios)}
                disabled={isRunning}
              >
                {scenario}
              </Button>
            ))}
          </ButtonGroup>
          
          <Box sx={{ mb: 2 }}>
            {currentScenario && (
              <Alert severity="info">
                <Typography variant="body2">
                  <strong>{currentScenario}シナリオ:</strong>
                  {' '}
                  {performanceTestScenarios[currentScenario].tasks}タスク、
                  {performanceTestScenarios[currentScenario].members}メンバー、
                  {performanceTestScenarios[currentScenario].events}イベント
                </Typography>
              </Alert>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            <PrimaryActionButton
              color="primary"
              startIcon={isRunning ? <StopIcon /> : <StartIcon />}
              onClick={() => isRunning ? setIsRunning(false) : runTest(currentScenario)}
              disabled={isRunning && progress > 0 && progress < 100}
            >
              {isRunning ? 'テスト停止' : 'テスト開始'}
            </PrimaryActionButton>
            
            <SecondaryActionButton
              startIcon={<ResetIcon />}
              onClick={() => {
                setTasks([]);
                setMembers([]);
                setCurrentMetrics(null);
                setResults([]);
                performanceTestRunner.clearResults();
              }}
              disabled={isRunning}
            >
              リセット
            </SecondaryActionButton>
            
            <SecondaryActionButton
              startIcon={<ExportIcon />}
              onClick={() => {
                const exportData = performanceTestRunner.exportResults();
                const blob = new Blob([exportData], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `performance-test-results-${new Date().getTime()}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              disabled={results.length === 0}
            >
              結果エクスポート
            </SecondaryActionButton>
            
            <SecondaryActionButton
              onClick={runScrollTest}
              disabled={tasks.length === 0}
            >
              スクロールテスト
            </SecondaryActionButton>
          </Box>
          
          {isRunning && progress > 0 && (
            <Box sx={{ mb: 2 }}>
              <LinearProgress variant="determinate" value={progress} />
              <Typography variant="caption" color="text.secondary">
                {progress}% 完了
              </Typography>
            </Box>
          )}
        </Grid>
        
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2" gutterBottom>
            現在のメトリクス
          </Typography>
          {currentMetrics ? (
            renderMetrics(currentMetrics)
          ) : (
            <Alert severity="info">
              テストを実行してメトリクスを確認してください
            </Alert>
          )}
        </Grid>
      </Grid>
      
      <Collapse in={showDetails}>
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="h6" gutterBottom>
          <ReportIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          テスト履歴
        </Typography>
        
        {results.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>シナリオ</TableCell>
                  <TableCell>タスク数</TableCell>
                  <TableCell>レンダリング時間</TableCell>
                  <TableCell>FPS</TableCell>
                  <TableCell>実行時間</TableCell>
                  <TableCell>実行日時</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.map((result, index) => (
                  <TableRow key={index}>
                    <TableCell>{result.scenario}</TableCell>
                    <TableCell>{result.metrics.taskCount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip 
                        label={`${result.metrics.renderTime.toFixed(2)} ms`}
                        size="small"
                        color={result.metrics.renderTime < 100 ? 'success' : 'warning'}
                      />
                    </TableCell>
                    <TableCell>{result.metrics.scrollFPS} fps</TableCell>
                    <TableCell>{(result.duration / 1000).toFixed(2)} 秒</TableCell>
                    <TableCell>{result.timestamp.toLocaleTimeString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Alert severity="info">
            まだテスト結果がありません
          </Alert>
        )}
      </Collapse>
    </StyledCard>
  );
};