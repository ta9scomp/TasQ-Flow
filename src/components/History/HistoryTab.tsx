import React from 'react';
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  MenuItem,
  Alert,
  AlertTitle,
  Badge,
  Tooltip,
} from '@mui/material';

import {
  History as HistoryIcon,
  Warning as WarningIcon,
  ExpandMore as ExpandMoreIcon,
  Create as CreateIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DriveFileMove as MoveIcon,
  Assignment as AssignIcon,
  Task as TaskIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Note as NoteIcon,
  CheckBox as CheckBoxIcon,
  Visibility as VisibilityIcon,
  Computer as ComputerIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { sampleHistory, sampleConflicts } from '../../data/sampleHistory';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface HistoryTabProps {
  currentUser?: string;
  userPermissions?: string[];
}

export const HistoryTab: React.FC<HistoryTabProps> = ({
  userPermissions = ['admin', 'history_viewer'],
}) => {
  const [selectedTab, setSelectedTab] = React.useState(0);
  const [filterUserId, setFilterUserId] = React.useState<string>('all');
  const [filterEntityType, setFilterEntityType] = React.useState<string>('all');
  const [filterAction, setFilterAction] = React.useState<string>('all');

  // 権限チェック
  const hasHistoryAccess = userPermissions.includes('admin') || userPermissions.includes('history_viewer');

  if (!hasHistoryAccess) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          <AlertTitle>アクセス権限がありません</AlertTitle>
          変更履歴を表示するには権限が必要です。管理者にお問い合わせください。
        </Alert>
      </Box>
    );
  }

  // フィルタリング
  const filteredHistory = sampleHistory.filter(item => {
    if (filterUserId !== 'all' && item.userId !== filterUserId) return false;
    if (filterEntityType !== 'all' && item.entityType !== filterEntityType) return false;
    if (filterAction !== 'all' && item.action !== filterAction) return false;
    return true;
  });

  const unresolvedConflicts = sampleConflicts.filter(conflict => !conflict.resolved);

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create': return <CreateIcon color="success" />;
      case 'update': return <EditIcon color="primary" />;
      case 'delete': return <DeleteIcon color="error" />;
      case 'move': return <MoveIcon color="warning" />;
      case 'assign': return <AssignIcon color="info" />;
      default: return <EditIcon />;
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'create': return '作成';
      case 'update': return '更新';
      case 'delete': return '削除';
      case 'move': return '移動';
      case 'assign': return '割当';
      default: return action;
    }
  };

  const getEntityIcon = (entityType: string) => {
    switch (entityType) {
      case 'task': return <TaskIcon />;
      case 'checklist': return <CheckBoxIcon />;
      case 'project': return <VisibilityIcon />;
      case 'member': return <PersonIcon />;
      case 'settings': return <SettingsIcon />;
      case 'taskfog': return <ScheduleIcon />;
      case 'stickynote': return <NoteIcon />;
      default: return <TaskIcon />;
    }
  };

  const getEntityLabel = (entityType: string) => {
    switch (entityType) {
      case 'task': return 'タスク';
      case 'checklist': return 'チェックリスト';
      case 'project': return 'プロジェクト';
      case 'member': return 'メンバー';
      case 'settings': return '設定';
      case 'taskfog': return 'タスクフォグ';
      case 'stickynote': return '付箋';
      default: return entityType;
    }
  };

  const formatValue = (value: any) => {
    if (value === null || value === undefined) return '（なし）';
    if (typeof value === 'boolean') return value ? '有効' : '無効';
    if (Array.isArray(value)) return value.join(', ');
    if (value instanceof Date) return format(value, 'yyyy/MM/dd HH:mm', { locale: ja });
    return String(value);
  };

  const uniqueUsers = Array.from(new Set(sampleHistory.map(item => item.userId)));
  const entityTypes = ['task', 'checklist', 'project', 'member', 'settings', 'taskfog', 'stickynote'];
  const actions = ['create', 'update', 'delete', 'move', 'assign'];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <HistoryIcon sx={{ mr: 1 }} />
        変更履歴
        {unresolvedConflicts.length > 0 && (
          <Badge badgeContent={unresolvedConflicts.length} color="error" sx={{ ml: 2 }}>
            <WarningIcon color="error" />
          </Badge>
        )}
      </Typography>

      {/* 未解決の競合警告 */}
      {unresolvedConflicts.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <AlertTitle>未解決の競合があります</AlertTitle>
          {unresolvedConflicts.length}件の編集競合が解決待ちです。競合タブで確認してください。
        </Alert>
      )}

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={selectedTab}
          onChange={(_, newValue) => setSelectedTab(newValue)}
          variant="fullWidth"
        >
          <Tab label="変更履歴" icon={<HistoryIcon />} />
          <Tab 
            label={
              <Badge badgeContent={unresolvedConflicts.length} color="error" invisible={unresolvedConflicts.length === 0}>
                編集競合
              </Badge>
            } 
            icon={<WarningIcon />} 
          />
        </Tabs>
      </Paper>

      {selectedTab === 0 && (
        <Box>
          {/* フィルタ */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>フィルタ</Typography>
            <Box 
              sx={{ 
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <TextField
                  select
                  fullWidth
                  label="ユーザー"
                  value={filterUserId}
                  onChange={(e) => setFilterUserId(e.target.value)}
                  size="small"
                >
                  <MenuItem value="all">すべて</MenuItem>
                  {uniqueUsers.map(user => (
                    <MenuItem key={user} value={user}>{user}</MenuItem>
                  ))}
                </TextField>
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <TextField
                  select
                  fullWidth
                  label="対象"
                  value={filterEntityType}
                  onChange={(e) => setFilterEntityType(e.target.value)}
                  size="small"
                >
                  <MenuItem value="all">すべて</MenuItem>
                  {entityTypes.map(type => (
                    <MenuItem key={type} value={type}>{getEntityLabel(type)}</MenuItem>
                  ))}
                </TextField>
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <TextField
                  select
                  fullWidth
                  label="アクション"
                  value={filterAction}
                  onChange={(e) => setFilterAction(e.target.value)}
                  size="small"
                >
                  <MenuItem value="all">すべて</MenuItem>
                  {actions.map(action => (
                    <MenuItem key={action} value={action}>{getActionLabel(action)}</MenuItem>
                  ))}
                </TextField>
              </Box>
            </Box>
          </Paper>

          {/* 履歴リスト */}
          <Paper>
            <List>
              {filteredHistory.map((item, index) => (
                <React.Fragment key={item.id}>
                  <ListItem>
                    <ListItemIcon>
                      {getActionIcon(item.action)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                          <Typography variant="body1" component="span">
                            {item.userId}
                          </Typography>
                          <Chip
                            label={getActionLabel(item.action)}
                            size="small"
                            color={item.action === 'delete' ? 'error' : 'default'}
                          />
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {getEntityIcon(item.entityType)}
                            <Typography variant="body2" color="text.secondary">
                              {getEntityLabel(item.entityType)}
                            </Typography>
                          </Box>
                          <Typography variant="body1" component="span" sx={{ fontWeight: 'medium' }}>
                            {item.entityName}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            {format(item.timestamp, 'yyyy/MM/dd HH:mm:ss', { locale: ja })}
                          </Typography>
                          {item.ipAddress && (
                            <Tooltip title={`IP: ${item.ipAddress}`}>
                              <ComputerIcon sx={{ fontSize: '0.9rem', ml: 1, verticalAlign: 'middle' }} />
                            </Tooltip>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                  
                  {/* 変更詳細 */}
                  {item.changes.length > 0 && (
                    <Box sx={{ pl: 7, pr: 2, pb: 2 }}>
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="body2" color="text.secondary">
                            変更詳細 ({item.changes.length}項目)
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Box>
                            {item.changes.map((change, changeIndex) => (
                              <Box key={changeIndex} sx={{ mb: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                  {change.displayName}:
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
                                  <Typography variant="body2" color="text.secondary">
                                    {formatValue(change.oldValue)}
                                  </Typography>
                                  <Typography variant="body2">→</Typography>
                                  <Typography variant="body2" color="primary.main" sx={{ fontWeight: 'medium' }}>
                                    {formatValue(change.newValue)}
                                  </Typography>
                                </Box>
                              </Box>
                            ))}
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    </Box>
                  )}
                  
                  {index < filteredHistory.length - 1 && <Box sx={{ borderBottom: 1, borderColor: 'divider' }} />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Box>
      )}

      {selectedTab === 1 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>編集競合</Typography>
          
          {sampleConflicts.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="text.secondary">編集競合はありません</Typography>
            </Paper>
          ) : (
            <List>
              {sampleConflicts.map((conflict) => (
                <React.Fragment key={conflict.id}>
                  <Paper sx={{ mb: 2 }}>
                    <ListItem>
                      <ListItemIcon>
                        <Avatar 
                          sx={{ 
                            bgcolor: conflict.resolved ? 'success.main' : 'error.main',
                            width: 32,
                            height: 32
                          }}
                        >
                          <WarningIcon fontSize="small" />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            <Typography variant="body1" component="span" sx={{ fontWeight: 'medium' }}>
                              {conflict.entityName}
                            </Typography>
                            <Chip
                              label={conflict.resolved ? '解決済み' : '未解決'}
                              size="small"
                              color={conflict.resolved ? 'success' : 'error'}
                            />
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              {getEntityIcon(conflict.entityType)}
                              <Typography variant="body2" color="text.secondary">
                                {getEntityLabel(conflict.entityType)}
                              </Typography>
                            </Box>
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              競合ユーザー: {conflict.users.join(', ')}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              発生時刻: {format(conflict.timestamp, 'yyyy/MM/dd HH:mm:ss', { locale: ja })}
                            </Typography>
                            {conflict.resolved && conflict.resolvedBy && (
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                解決者: {conflict.resolvedBy} ({conflict.resolutionMethod === 'auto' ? '自動' : '手動'}解決)
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                  </Paper>
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>
      )}
    </Box>
  );
};