import React from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  Avatar,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Button,
  IconButton,
  Card,
  CardContent,
  CardHeader,
  Collapse,
  Menu,
  MenuList,
  ListSubheader,
  Divider,
  Fab,
} from '@mui/material';
import Grid2 from '@mui/material/Grid2';

import {
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  DragIndicator as DragIndicatorIcon,
  Schedule as ScheduleIcon,
  FilterList as FilterListIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  Add as AddIcon,
  PlaylistAdd as PlaylistAddIcon,
  Assignment as AssignmentIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import type { Task } from '../../types/task';
import { sampleTasks, sampleMembers } from '../../data/sampleData';
import { getPriorityColor } from '../../utils/colorUtils';

interface TodoTabProps {
  tasks?: Task[];
}

export const TodoTab: React.FC<TodoTabProps> = ({ tasks = sampleTasks }) => {
  const [filter, setFilter] = React.useState<'all' | 'inProgress' | 'completed' | 'notStarted'>('all');
  const [sortBy, setSortBy] = React.useState<'priority' | 'dueDate' | 'assignee'>('priority');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [expandedTasks, setExpandedTasks] = React.useState<Set<string>>(new Set());
  const [editingTask, setEditingTask] = React.useState<string | null>(null);
  const [newChecklistItem, setNewChecklistItem] = React.useState('');
  const [taskData, setTaskData] = React.useState<Task[]>(tasks);
  const [editingChecklistItem, setEditingChecklistItem] = React.useState<{ taskId: string; itemId: string; text: string } | null>(null);
  const [showStats, setShowStats] = React.useState(false);
  const [showCompleted, setShowCompleted] = React.useState(true);
  const [quickActionMenuAnchor, setQuickActionMenuAnchor] = React.useState<null | HTMLElement>(null);

  const filteredAndSortedTasks = React.useMemo(() => {
    const filtered = taskData.filter(task => {
      // フィルタリング
      if (filter !== 'all' && task.status !== filter) return false;
      
      // 検索
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          task.title.toLowerCase().includes(query) ||
          task.assignees.some(assignee => assignee.toLowerCase().includes(query)) ||
          task.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }
      
      return true;
    });

    // ソート
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          return b.priority - a.priority;
        case 'dueDate':
          return a.endDate.getTime() - b.endDate.getTime();
        case 'assignee':
          return a.assignees[0]?.localeCompare(b.assignees[0] || '') || 0;
        default:
          return 0;
      }
    });

    return filtered;
  }, [taskData, filter, sortBy, searchQuery]);

  const toggleTaskExpansion = (taskId: string) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  const toggleChecklistItem = (taskId: string, itemId: string) => {
    setTaskData(prev => prev.map(task => {
      if (task.id === taskId && task.checklist) {
        const updatedChecklist = task.checklist.map(item => 
          item.id === itemId ? { ...item, completed: !item.completed } : item
        );
        const completed = updatedChecklist.filter(item => item.completed).length;
        const newProgress = Math.round((completed / updatedChecklist.length) * 100);
        
        return {
          ...task,
          checklist: updatedChecklist,
          progress: newProgress,
          status: newProgress === 100 ? 'completed' as const : 
                  newProgress > 0 ? 'inProgress' as const : 'notStarted' as const
        };
      }
      return task;
    }));
  };

  const addChecklistItem = (taskId: string, text: string) => {
    if (!text.trim()) return;
    
    setTaskData(prev => prev.map(task => {
      if (task.id === taskId) {
        const checklist = task.checklist || [];
        const newItem = {
          id: `${taskId}-item-${Date.now()}`,
          text: text.trim(),
          completed: false,
          order: checklist.length,
          createdAt: new Date(),
        };
        
        return {
          ...task,
          checklist: [...checklist, newItem]
        };
      }
      return task;
    }));
    
    setNewChecklistItem('');
    setEditingTask(null);
  };

  const deleteChecklistItem = (taskId: string, itemId: string) => {
    setTaskData(prev => prev.map(task => {
      if (task.id === taskId && task.checklist) {
        const updatedChecklist = task.checklist.filter(item => item.id !== itemId);
        const completed = updatedChecklist.filter(item => item.completed).length;
        const newProgress = updatedChecklist.length > 0 ? 
          Math.round((completed / updatedChecklist.length) * 100) : 0;
        
        return {
          ...task,
          checklist: updatedChecklist,
          progress: newProgress,
          status: newProgress === 100 ? 'completed' as const : 
                  newProgress > 0 ? 'inProgress' as const : 'notStarted' as const
        };
      }
      return task;
    }));
  };

  const editChecklistItem = (taskId: string, itemId: string, newText: string) => {
    if (!newText.trim()) return;
    
    setTaskData(prev => prev.map(task => {
      if (task.id === taskId && task.checklist) {
        const updatedChecklist = task.checklist.map(item => 
          item.id === itemId ? { ...item, text: newText.trim() } : item
        );
        
        return {
          ...task,
          checklist: updatedChecklist
        };
      }
      return task;
    }));
    
    setEditingChecklistItem(null);
  };

  const toggleTaskStatus = (taskId: string) => {
    setTaskData(prev => prev.map(task => {
      if (task.id === taskId) {
        const newStatus = task.status === 'completed' ? 'inProgress' : 'completed';
        const newProgress = newStatus === 'completed' ? 100 : 
                           newStatus === 'inProgress' ? 50 : 0;
        
        const updatedChecklist = task.checklist?.map(item => ({
          ...item,
          completed: newStatus === 'completed'
        }));
        
        return {
          ...task,
          status: newStatus,
          progress: newProgress,
          checklist: updatedChecklist
        };
      }
      return task;
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon color="success" />;
      case 'inProgress':
        return <RadioButtonUncheckedIcon color="primary" />;
      case 'onHold':
        return <RadioButtonUncheckedIcon color="warning" />;
      default:
        return <RadioButtonUncheckedIcon color="disabled" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return '完了';
      case 'inProgress': return '進行中';
      case 'onHold': return '保留';
      default: return '未着手';
    }
  };

  const getPriorityIcon = (priority: number) => {
    if (priority >= 80) return '🔴';
    if (priority >= 50) return '🟡';
    if (priority >= 20) return '🟢';
    return '⚪';
  };

  const getMemberAvatar = (memberName: string) => {
    const member = sampleMembers.find(m => m.name === memberName);
    return member ? (
      <Avatar sx={{ width: 24, height: 24, bgcolor: member.color, fontSize: '0.75rem' }}>
        {member.name[0]}
      </Avatar>
    ) : (
      <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
        {memberName[0]}
      </Avatar>
    );
  };

  const calculateProgress = (task: Task) => {
    if (!task.checklist || task.checklist.length === 0) {
      return task.progress;
    }
    const completed = task.checklist.filter(item => item.completed).length;
    return Math.round((completed / task.checklist.length) * 100);
  };

  // 統計情報の計算
  const statsData = React.useMemo(() => {
    const total = taskData.length;
    const completed = taskData.filter(t => t.status === 'completed').length;
    const inProgress = taskData.filter(t => t.status === 'inProgress').length;
    const notStarted = taskData.filter(t => t.status === 'notStarted').length;
    const overdue = taskData.filter(t => t.endDate < new Date() && t.status !== 'completed').length;
    
    const totalChecklistItems = taskData.reduce((sum, task) => sum + (task.checklist?.length || 0), 0);
    const completedChecklistItems = taskData.reduce((sum, task) => 
      sum + (task.checklist?.filter(item => item.completed).length || 0), 0);
    
    return {
      total,
      completed,
      inProgress,
      notStarted,
      overdue,
      completedPercentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      totalChecklistItems,
      completedChecklistItems,
      checklistCompletionRate: totalChecklistItems > 0 ? 
        Math.round((completedChecklistItems / totalChecklistItems) * 100) : 0
    };
  }, [taskData]);

  const markAllCompleted = () => {
    setTaskData(prev => prev.map(task => ({
      ...task,
      status: 'completed' as const,
      progress: 100,
      checklist: task.checklist?.map(item => ({ ...item, completed: true }))
    })));
    setQuickActionMenuAnchor(null);
  };

  const clearCompleted = () => {
    setTaskData(prev => prev.filter(task => task.status !== 'completed'));
    setQuickActionMenuAnchor(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          ToDo管理
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant={showStats ? 'contained' : 'outlined'}
            size="small"
            startIcon={<ScheduleIcon />}
            onClick={() => setShowStats(!showStats)}
          >
            統計
          </Button>
          
          <Button
            size="small"
            onClick={(e) => setQuickActionMenuAnchor(e.currentTarget)}
            startIcon={<FilterListIcon />}
          >
            アクション
          </Button>
        </Box>
      </Box>

      {/* 統計情報 */}
      <Collapse in={showStats}>
        <Grid2 container spacing={2} sx={{ mb: 3 }}>
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary">{statsData.total}</Typography>
                <Typography variant="body2" color="text.secondary">総タスク数</Typography>
              </CardContent>
            </Card>
          </Grid2>
          
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="success.main">{statsData.completed}</Typography>
                <Typography variant="body2" color="text.secondary">完了数</Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={statsData.completedPercentage} 
                  color="success"
                  sx={{ mt: 1 }}
                />
                <Typography variant="caption">{statsData.completedPercentage}%</Typography>
              </CardContent>
            </Card>
          </Grid2>
          
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="warning.main">{statsData.inProgress}</Typography>
                <Typography variant="body2" color="text.secondary">進行中</Typography>
              </CardContent>
            </Card>
          </Grid2>
          
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="error.main">{statsData.overdue}</Typography>
                <Typography variant="body2" color="text.secondary">期限超過</Typography>
              </CardContent>
            </Card>
          </Grid2>
          
          <Grid2 size={12}>
            <Card>
              <CardHeader title="チェックリスト進捗" />
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2">
                    {statsData.completedChecklistItems} / {statsData.totalChecklistItems} アイテム完了
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={statsData.checklistCompletionRate}
                    sx={{ flex: 1, height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="body2" fontWeight="bold">
                    {statsData.checklistCompletionRate}%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid2>
        </Grid2>
      </Collapse>

      {/* フィルター・検索バー */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            placeholder="タスクを検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            sx={{ minWidth: 200 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>ステータス</InputLabel>
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              label="ステータス"
            >
              <MenuItem value="all">すべて</MenuItem>
              <MenuItem value="notStarted">未着手</MenuItem>
              <MenuItem value="inProgress">進行中</MenuItem>
              <MenuItem value="completed">完了</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>並び順</InputLabel>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              label="並び順"
            >
              <MenuItem value="priority">優先度</MenuItem>
              <MenuItem value="dueDate">期限</MenuItem>
              <MenuItem value="assignee">担当者</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>表示</InputLabel>
            <Select
              value={showCompleted ? 'all' : 'active'}
              onChange={(e) => setShowCompleted(e.target.value === 'all')}
              label="表示"
            >
              <MenuItem value="all">すべて</MenuItem>
              <MenuItem value="active">未完了のみ</MenuItem>
            </Select>
          </FormControl>

          <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
            {filteredAndSortedTasks.filter(t => showCompleted || t.status !== 'completed').length} 件のタスク
          </Typography>
        </Box>
      </Paper>

      {/* タスク一覧 */}
      <Paper>
        <List>
          {filteredAndSortedTasks
            .filter(task => showCompleted || task.status !== 'completed')
            .map((task, index) => {
            const progress = calculateProgress(task);
            const isExpanded = expandedTasks.has(task.id);
            
            return (
              <React.Fragment key={task.id}>
                {index > 0 && <Box sx={{ borderTop: 1, borderColor: 'divider' }} />}
                
                <Accordion
                  expanded={isExpanded}
                  onChange={() => toggleTaskExpansion(task.id)}
                  disableGutters
                  elevation={0}
                  sx={{ '&:before': { display: 'none' } }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{ px: 2, py: 1 }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
                      <DragIndicatorIcon color="disabled" />
                      
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTaskStatus(task.id);
                        }}
                        sx={{ p: 0.5 }}
                      >
                        {getStatusIcon(task.status)}
                      </IconButton>
                      
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: task.isGroup ? 'bold' : 'normal',
                            textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {getPriorityIcon(task.priority)} {task.title}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', gap: 1, mt: 0.5, alignItems: 'center' }}>
                          <Chip
                            label={getStatusLabel(task.status)}
                            size="small"
                            color={
                              task.status === 'completed' ? 'success' :
                              task.status === 'inProgress' ? 'primary' :
                              task.status === 'onHold' ? 'warning' : 'default'
                            }
                            variant="outlined"
                          />
                          
                          <Chip
                            label={`優先度: ${task.priority}`}
                            size="small"
                            sx={{
                              backgroundColor: getPriorityColor(task.priority),
                              color: 'white',
                            }}
                          />
                          
                          <Typography variant="caption" color="text.secondary">
                            {task.endDate.toLocaleDateString('ja-JP')} まで
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {task.assignees.slice(0, 3).map((assignee, idx) => (
                          <Tooltip key={idx} title={assignee}>
                            {getMemberAvatar(assignee)}
                          </Tooltip>
                        ))}
                        {task.assignees.length > 3 && (
                          <Typography variant="caption" color="text.secondary">
                            +{task.assignees.length - 3}
                          </Typography>
                        )}
                      </Box>

                      <Box sx={{ width: 80 }}>
                        <Typography variant="caption" align="center" display="block">
                          {progress}%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={progress}
                          color={progress === 100 ? 'success' : 'primary'}
                        />
                      </Box>
                    </Box>
                  </AccordionSummary>

                  <AccordionDetails sx={{ pt: 0 }}>
                    <Box sx={{ pl: 6 }}>
                      {/* タスク詳細 */}
                      {task.description && (
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {task.description}
                        </Typography>
                      )}

                      {/* タグ */}
                      {task.tags.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="caption" display="block" gutterBottom>
                            タグ:
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {task.tags.map((tag, idx) => (
                              <Chip key={idx} label={tag} size="small" variant="outlined" />
                            ))}
                          </Box>
                        </Box>
                      )}

                      {/* チェックリスト */}
                      {task.checklist && task.checklist.length > 0 && (
                        <Box>
                          <Typography variant="caption" display="block" gutterBottom>
                            チェックリスト:
                          </Typography>
                          <List dense>
                            {task.checklist
                              .sort((a, b) => a.order - b.order)
                              .map((item) => (
                                <ListItem 
                                  key={item.id} 
                                  sx={{ 
                                    pl: 0, 
                                    pr: 1,
                                    borderRadius: 1,
                                    '&:hover': {
                                      backgroundColor: 'action.hover',
                                    }
                                  }}
                                >
                                  <ListItemIcon sx={{ minWidth: 36 }}>
                                    <Checkbox
                                      checked={item.completed}
                                      size="small"
                                      onChange={() => toggleChecklistItem(task.id, item.id)}
                                      color="primary"
                                    />
                                  </ListItemIcon>
                                  
                                  {editingChecklistItem?.taskId === task.id && editingChecklistItem?.itemId === item.id ? (
                                    <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, gap: 1 }}>
                                      <TextField
                                        size="small"
                                        value={editingChecklistItem.text}
                                        onChange={(e) => setEditingChecklistItem({
                                          ...editingChecklistItem,
                                          text: e.target.value
                                        })}
                                        onKeyPress={(e) => {
                                          if (e.key === 'Enter') {
                                            editChecklistItem(task.id, item.id, editingChecklistItem.text);
                                          }
                                        }}
                                        sx={{ flex: 1 }}
                                        autoFocus
                                      />
                                      <IconButton 
                                        size="small" 
                                        onClick={() => editChecklistItem(task.id, item.id, editingChecklistItem.text)}
                                        color="primary"
                                      >
                                        <SaveIcon fontSize="small" />
                                      </IconButton>
                                      <IconButton 
                                        size="small" 
                                        onClick={() => setEditingChecklistItem(null)}
                                      >
                                        <CancelIcon fontSize="small" />
                                      </IconButton>
                                    </Box>
                                  ) : (
                                    <>
                                      <ListItemText
                                        primary={item.text}
                                        sx={{
                                          flex: 1,
                                          '& .MuiListItemText-primary': {
                                            color: item.completed ? 'text.secondary' : 'text.primary',
                                            fontSize: '0.875rem',
                                            textDecoration: item.completed ? 'line-through' : 'none',
                                          },
                                        }}
                                      />
                                      <Box sx={{ display: 'flex', gap: 0.5, opacity: 0.7, '&:hover': { opacity: 1 } }}>
                                        <IconButton 
                                          size="small" 
                                          onClick={() => setEditingChecklistItem({
                                            taskId: task.id,
                                            itemId: item.id,
                                            text: item.text
                                          })}
                                        >
                                          <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton 
                                          size="small" 
                                          onClick={() => deleteChecklistItem(task.id, item.id)}
                                          color="error"
                                        >
                                          <DeleteIcon fontSize="small" />
                                        </IconButton>
                                      </Box>
                                    </>
                                  )}
                                </ListItem>
                              ))}
                          </List>
                          
                          {/* 新しいチェックリストアイテムの追加 */}
                          {editingTask === task.id ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, pl: 4 }}>
                              <TextField
                                size="small"
                                placeholder="新しいチェックリストアイテムを追加..."
                                value={newChecklistItem}
                                onChange={(e) => setNewChecklistItem(e.target.value)}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    addChecklistItem(task.id, newChecklistItem);
                                  }
                                }}
                                sx={{ flex: 1 }}
                                autoFocus
                                InputProps={{
                                  startAdornment: (
                                    <CheckIcon sx={{ mr: 1, color: 'action.active' }} />
                                  ),
                                }}
                              />
                              <IconButton 
                                size="small" 
                                onClick={() => addChecklistItem(task.id, newChecklistItem)}
                                color="primary"
                                disabled={!newChecklistItem.trim()}
                              >
                                <AddIcon />
                              </IconButton>
                              <IconButton 
                                size="small" 
                                onClick={() => {
                                  setEditingTask(null);
                                  setNewChecklistItem('');
                                }}
                              >
                                <CancelIcon />
                              </IconButton>
                            </Box>
                          ) : (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, pl: 4 }}>
                              <IconButton 
                                size="small" 
                                onClick={() => setEditingTask(task.id)}
                                sx={{ 
                                  color: 'primary.main',
                                  '&:hover': { backgroundColor: 'primary.50' }
                                }}
                              >
                                <PlaylistAddIcon fontSize="small" />
                                <Typography variant="caption" sx={{ ml: 0.5 }}>
                                  アイテム追加
                                </Typography>
                              </IconButton>
                              
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Chip
                                  size="small"
                                  label={`${task.checklist?.filter(item => item.completed).length || 0} / ${task.checklist?.length || 0} 完了`}
                                  color={progress === 100 ? 'success' : progress > 0 ? 'primary' : 'default'}
                                  variant="outlined"
                                />
                              </Box>
                            </Box>
                          )}
                        </Box>
                      )}

                      {/* チェックリストが存在しない場合の追加ボタン */}
                      {(!task.checklist || task.checklist.length === 0) && (
                        <Box sx={{ mt: 2 }}>
                          {editingTask === task.id ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <TextField
                                size="small"
                                placeholder="最初のチェックリストアイテムを追加..."
                                value={newChecklistItem}
                                onChange={(e) => setNewChecklistItem(e.target.value)}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    addChecklistItem(task.id, newChecklistItem);
                                  }
                                }}
                                sx={{ flex: 1 }}
                                autoFocus
                                InputProps={{
                                  startAdornment: (
                                    <AssignmentIcon sx={{ mr: 1, color: 'action.active' }} />
                                  ),
                                }}
                              />
                              <IconButton 
                                size="small" 
                                onClick={() => addChecklistItem(task.id, newChecklistItem)}
                                color="primary"
                                disabled={!newChecklistItem.trim()}
                              >
                                <AddIcon />
                              </IconButton>
                              <IconButton 
                                size="small" 
                                onClick={() => {
                                  setEditingTask(null);
                                  setNewChecklistItem('');
                                }}
                              >
                                <CancelIcon />
                              </IconButton>
                            </Box>
                          ) : (
                            <IconButton 
                              size="small" 
                              onClick={() => setEditingTask(task.id)}
                              sx={{ 
                                color: 'text.secondary',
                                '&:hover': { 
                                  color: 'primary.main',
                                  backgroundColor: 'primary.50' 
                                }
                              }}
                            >
                              <PlaylistAddIcon fontSize="small" />
                              <Typography variant="caption" sx={{ ml: 0.5 }}>
                                チェックリストを追加
                              </Typography>
                            </IconButton>
                          )}
                        </Box>
                      )}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </React.Fragment>
            );
          })}
        </List>
      </Paper>

      {/* クイックアクションメニュー */}
      <Menu
        anchorEl={quickActionMenuAnchor}
        open={Boolean(quickActionMenuAnchor)}
        onClose={() => setQuickActionMenuAnchor(null)}
      >
        <MenuList>
          <ListSubheader>一括操作</ListSubheader>
          <MenuItem onClick={markAllCompleted}>
            <CheckIcon sx={{ mr: 1 }} />
            すべて完了にする
          </MenuItem>
          <MenuItem onClick={clearCompleted} disabled={statsData.completed === 0}>
            <ClearIcon sx={{ mr: 1 }} />
            完了済みタスクを削除
          </MenuItem>
          <Divider />
          <ListSubheader>表示設定</ListSubheader>
          <MenuItem onClick={() => setShowCompleted(!showCompleted)}>
            <FilterListIcon sx={{ mr: 1 }} />
            {showCompleted ? '完了済みを非表示' : '完了済みを表示'}
          </MenuItem>
          <MenuItem onClick={() => setShowStats(!showStats)}>
            <ScheduleIcon sx={{ mr: 1 }} />
            {showStats ? '統計を非表示' : '統計を表示'}
          </MenuItem>
        </MenuList>
      </Menu>

      {/* フローティングアクションボタン */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
        onClick={() => {
          // 新しいタスク作成のダイアログを開く（実装予定）
          console.log('新しいタスクを作成');
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};