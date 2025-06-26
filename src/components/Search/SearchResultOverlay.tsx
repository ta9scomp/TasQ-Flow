import React from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Chip,
  Backdrop,
  Fade,
  Card,
  CardContent,
  Avatar,
  LinearProgress,
} from '@mui/material';
import {
  KeyboardArrowUp as PrevIcon,
  KeyboardArrowDown as NextIcon,
  Close as CloseIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import type { Task } from '../../types/task';

interface SearchResultOverlayProps {
  isVisible: boolean;
  searchQuery: string;
  matchedTasks: Task[];
  currentIndex: number;
  onNavigate: (direction: 'prev' | 'next') => void;
  onClose: () => void;
  onTaskSelect?: (task: Task) => void;
}

export const SearchResultOverlay: React.FC<SearchResultOverlayProps> = ({
  isVisible,
  searchQuery,
  matchedTasks,
  currentIndex,
  onNavigate,
  onClose,
  onTaskSelect,
}) => {
  const currentTask = matchedTasks[currentIndex];

  // キーボードナビゲーション
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isVisible) return;

      switch (event.key) {
        case 'ArrowUp':
        case 'ArrowLeft':
          event.preventDefault();
          onNavigate('prev');
          break;
        case 'ArrowDown':
        case 'ArrowRight':
          event.preventDefault();
          onNavigate('next');
          break;
        case 'Escape':
          event.preventDefault();
          onClose();
          break;
        case 'Enter':
          event.preventDefault();
          if (currentTask && onTaskSelect) {
            onTaskSelect(currentTask);
            onClose();
          }
          break;
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isVisible, onNavigate, onClose, currentTask, onTaskSelect]);

  if (!isVisible || matchedTasks.length === 0) {
    return null;
  }

  // テキストハイライト機能
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <Box
          key={index}
          component="span"
          sx={{
            backgroundColor: '#ffeb3b',
            color: '#000',
            fontWeight: 'bold',
            padding: '2px 4px',
            borderRadius: '2px',
          }}
        >
          {part}
        </Box>
      ) : part
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4caf50';
      case 'inProgress': return '#ff9800';
      case 'onHold': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return '完了';
      case 'inProgress': return '進行中';
      case 'onHold': return '保留';
      case 'notStarted': return '未着手';
      default: return status;
    }
  };

  return (
    <Backdrop
      open={isVisible}
      sx={{
        zIndex: (theme) => theme.zIndex.modal,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
      }}
      onClick={onClose}
    >
      <Fade in={isVisible}>
        <Box
          onClick={(e) => e.stopPropagation()}
          sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 600,
            maxHeight: '80vh',
            outline: 'none',
          }}
        >
          {/* ヘッダー */}
          <Paper
            sx={{
              p: 2,
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
              color: 'white',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SearchIcon />
              <Typography variant="h6">
                検索結果: "{searchQuery}"
              </Typography>
              <Chip
                label={`${currentIndex + 1} / ${matchedTasks.length}`}
                size="small"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                }}
              />
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* ナビゲーションボタン */}
              <IconButton
                onClick={() => onNavigate('prev')}
                disabled={matchedTasks.length <= 1}
                sx={{ color: 'white' }}
                size="small"
              >
                <PrevIcon />
              </IconButton>
              
              <IconButton
                onClick={() => onNavigate('next')}
                disabled={matchedTasks.length <= 1}
                sx={{ color: 'white' }}
                size="small"
              >
                <NextIcon />
              </IconButton>

              <IconButton
                onClick={onClose}
                sx={{ color: 'white' }}
                size="small"
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Paper>

          {/* 現在のタスク詳細 */}
          {currentTask && (
            <Card
              sx={{
                cursor: onTaskSelect ? 'pointer' : 'default',
                transition: 'transform 0.2s ease',
                '&:hover': onTaskSelect ? {
                  transform: 'translateY(-2px)',
                  boxShadow: 4,
                } : {},
              }}
              onClick={() => {
                if (onTaskSelect) {
                  onTaskSelect(currentTask);
                  onClose();
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                  {/* タスクカラーインジケーター */}
                  <Box
                    sx={{
                      width: 4,
                      height: 60,
                      backgroundColor: currentTask.color || '#2196f3',
                      borderRadius: 2,
                      flexShrink: 0,
                    }}
                  />
                  
                  <Box sx={{ flex: 1 }}>
                    {/* タスク名 */}
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {highlightText(currentTask.title, searchQuery)}
                    </Typography>
                    
                    {/* 説明 */}
                    {currentTask.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {highlightText(currentTask.description, searchQuery)}
                      </Typography>
                    )}

                    {/* ステータスと進捗 */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Chip
                        label={getStatusLabel(currentTask.status)}
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor(currentTask.status),
                          color: 'white',
                          fontWeight: 'bold',
                        }}
                      />
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                        <Typography variant="caption">進捗:</Typography>
                        <LinearProgress
                          variant="determinate"
                          value={currentTask.progress}
                          sx={{ flex: 1, height: 6, borderRadius: 3 }}
                        />
                        <Typography variant="caption" fontWeight="bold">
                          {currentTask.progress}%
                        </Typography>
                      </Box>
                    </Box>

                    {/* 担当者 */}
                    {currentTask.assignees.length > 0 && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          担当者:
                        </Typography>
                        {currentTask.assignees.slice(0, 3).map((assignee, index) => (
                          <Chip
                            key={index}
                            label={highlightText(assignee, searchQuery)}
                            size="small"
                            variant="outlined"
                            avatar={<Avatar sx={{ width: 20, height: 20 }}>{assignee.charAt(0)}</Avatar>}
                          />
                        ))}
                        {currentTask.assignees.length > 3 && (
                          <Typography variant="caption" color="text.secondary">
                            他 {currentTask.assignees.length - 3} 人
                          </Typography>
                        )}
                      </Box>
                    )}

                    {/* タグ */}
                    {currentTask.tags.length > 0 && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Typography variant="caption" color="text.secondary">
                          タグ:
                        </Typography>
                        {currentTask.tags.map((tag, index) => (
                          <Chip
                            key={index}
                            label={highlightText(tag, searchQuery)}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        ))}
                      </Box>
                    )}
                  </Box>

                  {/* 優先度表示 */}
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      優先度
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      {currentTask.priority}
                    </Typography>
                  </Box>
                </Box>

                {/* 日付情報 */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  pt: 2, 
                  borderTop: '1px solid rgba(0,0,0,0.08)',
                  fontSize: '0.8rem',
                  color: 'text.secondary'
                }}>
                  <Typography variant="caption">
                    開始: {new Date(currentTask.startDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="caption">
                    終了: {new Date(currentTask.endDate).toLocaleDateString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* キーボードヒント */}
          <Paper sx={{ p: 1, mt: 1, backgroundColor: 'rgba(0,0,0,0.8)', color: 'white' }}>
            <Typography variant="caption" display="block" textAlign="center">
              ↑↓ 移動 | Enter 選択 | Esc 閉じる
            </Typography>
          </Paper>
        </Box>
      </Fade>
    </Backdrop>
  );
};