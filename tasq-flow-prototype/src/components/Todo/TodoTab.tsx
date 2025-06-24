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
} from '@mui/material';

import {
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  DragIndicator as DragIndicatorIcon,
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

  const filteredAndSortedTasks = React.useMemo(() => {
    let filtered = tasks.filter(task => {
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
  }, [tasks, filter, sortBy, searchQuery]);

  const toggleTaskExpansion = (taskId: string) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        ToDo管理
      </Typography>

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

          <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
            {filteredAndSortedTasks.length} 件のタスク
          </Typography>
        </Box>
      </Paper>

      {/* タスク一覧 */}
      <Paper>
        <List>
          {filteredAndSortedTasks.map((task, index) => {
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
                      
                      {getStatusIcon(task.status)}
                      
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
                                <ListItem key={item.id} sx={{ pl: 0 }}>
                                  <ListItemIcon sx={{ minWidth: 36 }}>
                                    <Checkbox
                                      checked={item.completed}
                                      size="small"
                                      // onChange={() => toggleChecklistItem(task.id, item.id)}
                                    />
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={item.text}
                                    sx={{
                                      '& .MuiListItemText-primary': {
                                        color: item.completed ? 'text.secondary' : 'text.primary',
                                        fontSize: '0.875rem',
                                      },
                                    }}
                                  />
                                </ListItem>
                              ))}
                          </List>
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
    </Box>
  );
};