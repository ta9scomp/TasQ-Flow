import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  Card,
  CardContent,
  Chip,
  Divider,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  Warning as WarningIcon,
  Person as PersonIcon,
  Schedule as TimeIcon,
  CompareArrows as CompareIcon,
} from '@mui/icons-material';
import { useRealtime } from '../../contexts/RealtimeContext';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface ConflictResolutionDialogProps {
  open: boolean;
  onClose: () => void;
}

export const ConflictResolutionDialog: React.FC<ConflictResolutionDialogProps> = ({
  open,
  onClose,
}) => {
  const { conflicts, resolveConflict } = useRealtime();

  const currentConflict = conflicts[0]; // 最初の競合を表示

  if (!currentConflict) {
    return null;
  }

  const handleResolve = (resolution: 'accept' | 'reject') => {
    resolveConflict(currentConflict.id, resolution);
    if (conflicts.length <= 1) {
      onClose();
    }
  };

  const formatConflictType = (type: string) => {
    switch (type) {
      case 'task_edit': return 'タスク編集';
      case 'task_delete': return 'タスク削除';
      case 'project_edit': return 'プロジェクト編集';
      default: return type;
    }
  };

  const renderTaskComparison = () => {
    if (currentConflict.type !== 'task_edit') return null;

    const current = currentConflict.currentVersion;
    const incoming = currentConflict.incomingVersion;

    const compareFields = [
      { key: 'title', label: 'タスク名' },
      { key: 'startDate', label: '開始日', formatter: (date: Date) => format(new Date(date), 'yyyy/MM/dd', { locale: ja }) },
      { key: 'endDate', label: '終了日', formatter: (date: Date) => format(new Date(date), 'yyyy/MM/dd', { locale: ja }) },
      { key: 'progress', label: '進捗', formatter: (value: number) => `${value}%` },
      { key: 'priority', label: '優先度' },
      { key: 'status', label: 'ステータス' },
      { key: 'assignees', label: '担当者', formatter: (arr: string[]) => arr.join(', ') },
      { key: 'description', label: '説明' },
    ];

    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CompareIcon />
          変更内容の比較
        </Typography>
        
        <Grid container spacing={2}>
          <Grid size={6}>
            <Card sx={{ border: '2px solid #1976d2' }}>
              <CardContent>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  現在のバージョン（あなた）
                </Typography>
                {compareFields.map(field => {
                  const currentValue = current[field.key];
                  const incomingValue = incoming[field.key];
                  const hasChange = JSON.stringify(currentValue) !== JSON.stringify(incomingValue);
                  
                  return (
                    <Box key={field.key} sx={{ mb: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        {field.label}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          backgroundColor: hasChange ? '#e3f2fd' : 'transparent',
                          p: hasChange ? 0.5 : 0,
                          borderRadius: hasChange ? 1 : 0,
                        }}
                      >
                        {field.formatter ? field.formatter(currentValue) : currentValue || '（未設定）'}
                      </Typography>
                    </Box>
                  );
                })}
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={6}>
            <Card sx={{ border: '2px solid #f57c00' }}>
              <CardContent>
                <Typography variant="subtitle1" color="warning.main" gutterBottom>
                  受信バージョン（{currentConflict.conflictingUser}）
                </Typography>
                {compareFields.map(field => {
                  const currentValue = current[field.key];
                  const incomingValue = incoming[field.key];
                  const hasChange = JSON.stringify(currentValue) !== JSON.stringify(incomingValue);
                  
                  return (
                    <Box key={field.key} sx={{ mb: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        {field.label}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          backgroundColor: hasChange ? '#fff3e0' : 'transparent',
                          p: hasChange ? 0.5 : 0,
                          borderRadius: hasChange ? 1 : 0,
                        }}
                      >
                        {field.formatter ? field.formatter(incomingValue) : incomingValue || '（未設定）'}
                      </Typography>
                    </Box>
                  );
                })}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <WarningIcon color="warning" />
        競合が検出されました
        {conflicts.length > 1 && (
          <Chip 
            label={`${conflicts.length}件の競合`}
            color="warning"
            size="small"
            sx={{ ml: 1 }}
          />
        )}
      </DialogTitle>
      
      <DialogContent>
        <Alert severity="warning" sx={{ mb: 3 }}>
          同じ{formatConflictType(currentConflict.type)}を複数のユーザーが同時に行ったため、競合が発生しました。
          どちらのバージョンを採用するか選択してください。
        </Alert>

        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2}>
            <Grid size={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon fontSize="small" />
                <Typography variant="body2">
                  競合ユーザー: <strong>{currentConflict.conflictingUser}</strong>
                </Typography>
              </Box>
            </Grid>
            <Grid size={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TimeIcon fontSize="small" />
                <Typography variant="body2">
                  発生時刻: {format(new Date(currentConflict.timestamp), 'yyyy/MM/dd HH:mm:ss', { locale: ja })}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {renderTaskComparison()}

        {conflicts.length > 1 && (
          <Alert severity="info" sx={{ mt: 3 }}>
            この競合を解決した後、残り{conflicts.length - 1}件の競合を順次解決します。
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button 
          onClick={() => handleResolve('reject')} 
          variant="outlined"
          color="primary"
          size="large"
        >
          現在のバージョンを保持
        </Button>
        <Button 
          onClick={() => handleResolve('accept')} 
          variant="contained"
          color="warning"
          size="large"
        >
          受信バージョンを採用
        </Button>
      </DialogActions>
    </Dialog>
  );
};