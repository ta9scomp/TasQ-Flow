import React, { useState, useCallback } from 'react';
import { Box, Tooltip, IconButton, Typography } from '@mui/material';
import { GetApp as ExportIcon } from '@mui/icons-material';
import { SearchBox } from '../Search/SearchBox';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { GanttExportDialog } from '../Export/GanttExportDialog';
import { getProjectById } from '../../data/sampleProjectTeams';
import type { Task } from '../../types/task';
import type { Holiday, Event } from '../../types/calendar';

// 軽量化のための簡易SearchFilter型定義
interface SearchFilter {
  type: 'member' | 'tag' | 'progress' | 'priority' | 'status' | 'capacity';
  value: string;
  label: string;
}

interface LightweightGanttChartProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  holidays?: Holiday[];
  events?: Event[];
  onMonthChange?: (monthStart: Date, monthEnd: Date) => void;
  selectedProjectId?: string;
  // onProjectSelect, // 使用されていないためコメントアウト
  onTaskCreate?: (startDate: Date, endDate: Date) => void;
  selectedTeamId?: string; // 新規追加
}

export const LightweightGanttChart: React.FC<LightweightGanttChartProps> = ({
  tasks,
  onTaskClick,
  // holidays = [],
  // events = [],
  // onMonthChange, // 将来実装予定
  selectedProjectId,
  // onTaskCreate, // 軽量化モードでは無効化
  // selectedTeamId, // 新規追加
}) => {
  console.log('LightweightGanttChart render:', { 
    tasksLength: tasks.length, 
    selectedProjectId 
  });
  
  const [scale] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState<SearchFilter[]>([]);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  // タスクフィルタリング（軽量版）
  const isTaskMatched = useCallback((task: Task): boolean => {
    // テキスト検索
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      if (!task.title.toLowerCase().includes(query) &&
          !task.description?.toLowerCase().includes(query) &&
          !task.assignees.some(assignee => assignee.toLowerCase().includes(query)) &&
          !task.tags.some(tag => tag.toLowerCase().includes(query))) {
        return false;
      }
    }

    // フィルタ検索（簡易版）
    for (const filter of searchFilters) {
      switch (filter.type) {
        case 'member':
          if (!task.assignees.some(assignee => 
            assignee.toLowerCase().includes(filter.value.toLowerCase())
          )) {
            return false;
          }
          break;
        case 'tag':
          if (!task.tags.some(tag => 
            tag.toLowerCase().includes(filter.value.toLowerCase())
          )) {
            return false;
          }
          break;
      }
    }

    return true;
  }, [searchQuery, searchFilters]);

  const filteredTasks = React.useMemo(() => {
    return tasks.filter(isTaskMatched);
  }, [tasks, isTaskMatched]);

  const isSearchActive = searchQuery.trim().length > 0 || searchFilters.length > 0;
  const displayTasks = isSearchActive ? filteredTasks : tasks;

  // 検索ハンドラ
  const handleSearch = useCallback((query: string, filters: SearchFilter[]) => {
    setSearchQuery(query);
    setSearchFilters(filters);
  }, []);

  return (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'linear-gradient(180deg, #fafbfc 0%, #f8fafc 100%)',
      overflow: 'hidden',
    }}>
      {/* ガントチャートヘッダー */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        px: 3,
        py: 2,
        borderBottom: '1px solid #e5e7eb',
        background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
        minHeight: 56,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#111827' }}>
            ガントチャート
          </Typography>
          <Box sx={{
            px: 2,
            py: 0.5,
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            color: '#3b82f6',
            borderRadius: 6,
            fontSize: '0.75rem',
            fontWeight: 500,
          }}>
            軽量モード
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="エクスポート">
            <IconButton 
              size="small" 
              onClick={() => setExportDialogOpen(true)}
              sx={{ 
                color: '#6b7280',
                '&:hover': {
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  color: '#3b82f6',
                }
              }}
            >
              <ExportIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* ツールバー */}
      <Box sx={{ 
        px: 3, 
        py: 2, 
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#ffffff',
      }}>
        <SearchBox
          onSearch={handleSearch}
          onFiltersChange={setSearchFilters}
        />
        
        {/* 検索結果表示 */}
        {isSearchActive && (
          <Box sx={{ 
            mt: 2,
            px: 3, 
            py: 2, 
            backgroundColor: filteredTasks.length > 0 ? '#f0f9ff' : '#fef2f2',
            borderRadius: 2,
            border: `1px solid ${filteredTasks.length > 0 ? '#bfdbfe' : '#fecaca'}`,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}>
            <Typography variant="body2" sx={{ 
              color: filteredTasks.length > 0 ? '#1e40af' : '#dc2626',
              fontWeight: 500,
            }}>
              🔍 {filteredTasks.length}件のタスクが見つかりました
            </Typography>
            {searchFilters.length > 0 && (
              <Typography variant="caption" sx={{ color: '#6b7280' }}>
                • {searchFilters.length}個のフィルタ適用中
              </Typography>
            )}
          </Box>
        )}
      </Box>

      {/* メインエリア */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* ガントチャートエリア */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* カレンダー表示エリア（機能的デザイン） */}
          <Box sx={{ 
            height: '60%',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            border: '1px solid #e5e7eb',
            borderRadius: 0,
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* タイムライン背景パターン */}
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `
                linear-gradient(90deg, rgba(148, 163, 184, 0.1) 1px, transparent 1px),
                linear-gradient(0deg, rgba(148, 163, 184, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '80px 40px',
            }} />
            
            {/* ヘッダー部分 */}
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 48,
              background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              px: 3,
            }}>
              <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 500 }}>
                タイムライン表示エリア
              </Typography>
            </Box>

            {/* プレースホルダーコンテンツ */}
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              color: '#64748b',
            }}>
              <Box sx={{
                width: 64,
                height: 64,
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                <Typography variant="h4" sx={{ color: '#3b82f6' }}>📅</Typography>
              </Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                カレンダー表示エリア
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                パフォーマンス最適化中
              </Typography>
            </Box>

            {/* 統計表示 */}
            <Box sx={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(8px)',
              borderRadius: 2,
              px: 2,
              py: 1,
              border: '1px solid rgba(0, 0, 0, 0.1)',
            }}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                タスク数: {displayTasks.length}件 | 
                プロジェクト: {selectedProjectId || '未選択'} | 
                表示: {(scale * 100).toFixed(0)}%
              </Typography>
            </Box>
          </Box>
          
          {/* タスクリスト表示 */}
          <Box sx={{ 
            height: '40%',
            backgroundColor: '#ffffff',
            borderTop: '1px solid #e5e7eb',
          }}>
            <Box sx={{
              px: 3,
              py: 2,
              borderBottom: '1px solid #e5e7eb',
              backgroundColor: '#f9fafb',
            }}>
              <Typography variant="subtitle1" sx={{ 
                fontWeight: 600, 
                color: '#111827',
                display: 'flex', 
                alignItems: 'center', 
                gap: 1 
              }}>
                📋 タスク一覧
                <Box sx={{
                  px: 2,
                  py: 0.5,
                  backgroundColor: '#e5e7eb',
                  color: '#6b7280',
                  borderRadius: 4,
                  fontSize: '0.75rem',
                  fontWeight: 500,
                }}>
                  {displayTasks.length}件
                </Box>
              </Typography>
            </Box>
            
            <Box sx={{ height: 'calc(100% - 60px)', overflow: 'auto', p: 2 }}>
              {displayTasks.slice(0, 50).map((task) => (
                <Box 
                  key={task.id} 
                  onClick={() => onTaskClick?.(task)}
                  sx={{ 
                    p: 3, 
                    mb: 2, 
                    backgroundColor: '#ffffff',
                    borderRadius: 2,
                    border: '1px solid #e5e7eb',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    '&:hover': {
                      backgroundColor: '#f8fafc',
                      borderColor: '#d1d5db',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    }
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 600, mb: 1, color: '#111827' }}>
                    {task.title}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 1 }}>
                    <Typography variant="caption" sx={{ 
                      color: '#6b7280',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}>
                      📅 {format(task.startDate, 'yyyy/MM/dd', { locale: ja })} - {format(task.endDate, 'yyyy/MM/dd', { locale: ja })}
                    </Typography>
                    <Typography variant="caption" sx={{ 
                      color: '#6b7280',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}>
                      📊 {task.progress}%
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {task.assignees.length > 0 && (
                      <Typography variant="caption" sx={{ 
                        color: '#3b82f6',
                        backgroundColor: '#eff6ff',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.7rem',
                      }}>
                        👥 {task.assignees.join(', ')}
                      </Typography>
                    )}
                    {task.tags.map((tag, index) => (
                      <Typography key={index} variant="caption" sx={{ 
                        color: '#059669',
                        backgroundColor: '#ecfdf5',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.7rem',
                      }}>
                        🏷️ {tag}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              ))}
              
              {displayTasks.length > 50 && (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#6b7280' }}>
                    ...他 {displayTasks.length - 50}件のタスク（パフォーマンス向上のため省略）
                  </Typography>
                </Box>
              )}
              
              {displayTasks.length === 0 && (
                <Box sx={{ p: 6, textAlign: 'center' }}>
                  <Box sx={{
                    width: 48,
                    height: 48,
                    backgroundColor: '#f3f4f6',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}>
                    <Typography variant="h6" sx={{ color: '#9ca3af' }}>📋</Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: '#6b7280', mb: 1 }}>
                    表示するタスクがありません
                  </Typography>
                  {selectedProjectId && (
                    <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                      プロジェクト「{getProjectById(selectedProjectId)?.name}」にタスクを追加してください
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* エクスポートダイアログ */}
      <GanttExportDialog
        open={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
        projectName={selectedProjectId ? getProjectById(selectedProjectId)?.name : undefined}
      />
    </Box>
  );
};