import React from 'react';
import { Box, Typography, Chip, IconButton } from '@mui/material';

import { ExpandMore, ExpandLess, FolderOpen, Folder, Task as TaskIcon } from '@mui/icons-material';
import type { Task } from '../../types/task';

interface TaskListProps {
  tasks: Task[];
  rowHeight: number;
  onTaskToggle?: (taskId: string) => void;
  selectedTaskIds?: string[];
  onTaskSelect?: (taskId: string, isMultiSelect: boolean) => void;
  searchQuery?: string;
}

export const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  rowHeight, 
  // selectedTaskIds = [], // TODO: 実装予定
  // onTaskSelect, // TODO: 実装予定
  // searchQuery = '' // TODO: 実装予定
}) => {
  const [collapsedGroups, setCollapsedGroups] = React.useState<Set<string>>(new Set());

  const getPriorityIcon = (priority: number) => {
    if (priority >= 80) return '🔴';
    if (priority >= 50) return '🟡';
    if (priority >= 20) return '🟢';
    return '⚪';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'inProgress': return 'primary';
      case 'onHold': return 'warning';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'notStarted': return '未着手';
      case 'inProgress': return '進行中';
      case 'completed': return '完了';
      case 'onHold': return '保留';
      default: return status;
    }
  };

  const toggleGroup = (groupId: string) => {
    setCollapsedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  // タスクを階層構造に整理
  const organizeTasksHierarchy = (tasks: Task[]) => {
    const rootTasks = tasks.filter(task => !task.parentId);
    const taskMap = new Map(tasks.map(task => [task.id, task]));
    
    const result: Task[] = [];
    
    rootTasks.forEach(rootTask => {
      result.push(rootTask);
      
      if (rootTask.isGroup && rootTask.children) {
        const isCollapsed = collapsedGroups.has(rootTask.id);
        if (!isCollapsed) {
          rootTask.children.forEach(childId => {
            const childTask = taskMap.get(childId);
            if (childTask) {
              result.push(childTask);
            }
          });
        }
      }
    });
    
    return result;
  };

  const visibleTasks = organizeTasksHierarchy(tasks);

  return (
    <Box>
      {/* ヘッダー */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          backgroundColor: 'grey.50',
          borderBottom: 2,
          borderColor: 'divider',
          px: 2,
          py: 1,
          height: 73, // TimeScaleの高さに合わせる
          display: 'flex',
          alignItems: 'flex-end',
          zIndex: 10,
        }}
      >
        <Typography variant="subtitle2" fontWeight="bold">
          タスク一覧
        </Typography>
      </Box>

      {/* タスクリスト */}
      {visibleTasks.map((task) => {
        const isGroup = task.isGroup;
        const isCollapsed = collapsedGroups.has(task.id);
        const indentLevel = task.level || 0;
        const hasChildren = task.children && task.children.length > 0;

        return (
          <Box
            key={task.id}
            sx={{
              height: rowHeight,
              borderBottom: 1,
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              pl: 2 + (indentLevel * 2), // インデント
              pr: 2,
              backgroundColor: isGroup 
                ? 'rgba(0, 0, 0, 0.02)' 
                : indentLevel > 0 
                  ? 'rgba(0, 0, 0, 0.01)' 
                  : 'transparent',
              borderLeft: indentLevel > 0 ? '2px solid #e0e0e0' : 'none',
              '&:hover': {
                backgroundColor: isGroup ? 'rgba(0, 0, 0, 0.05)' : 'action.hover',
              },
            }}
          >
            {/* 展開/折り畳みボタン */}
            {isGroup && hasChildren && (
              <IconButton
                size="small"
                onClick={() => toggleGroup(task.id)}
                sx={{ mr: 1, width: 24, height: 24 }}
              >
                {isCollapsed ? <ExpandMore fontSize="small" /> : <ExpandLess fontSize="small" />}
              </IconButton>
            )}

            {/* アイコン */}
            <Box sx={{ mr: 1, display: 'flex', alignItems: 'center', minWidth: 20 }}>
              {isGroup ? (
                isCollapsed ? <Folder fontSize="small" color="primary" /> : <FolderOpen fontSize="small" color="primary" />
              ) : (
                <TaskIcon fontSize="small" color="action" />
              )}
            </Box>

            {/* タスク名と優先度 */}
            <Box sx={{ flex: 1, overflow: 'hidden' }}>
              <Typography
                variant="body2"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontWeight: isGroup ? 'bold' : 'normal',
                  fontSize: isGroup ? '0.875rem' : '0.8rem',
                  color: isGroup ? 'text.primary' : indentLevel > 0 ? 'text.secondary' : 'text.primary',
                }}
              >
                {getPriorityIcon(task.priority)} {task.title}
                {isGroup && hasChildren && (
                  <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                    ({task.children?.length}個)
                  </Typography>
                )}
              </Typography>
            </Box>

            {/* ステータスとアサイン情報 */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {!isGroup && (
                <Chip
                  label={getStatusLabel(task.status)}
                  size="small"
                  color={getStatusColor(task.status) as any}
                  variant="outlined"
                  sx={{ height: 18, fontSize: '0.65rem' }}
                />
              )}
              
              {task.assignees.length > 0 && (
                <Chip
                  label={task.assignees.length > 1 ? `${task.assignees[0]}+${task.assignees.length - 1}` : task.assignees[0]}
                  size="small"
                  sx={{ 
                    ml: 1, 
                    height: 18, 
                    fontSize: '0.65rem',
                    bgcolor: task.color || 'primary.main',
                    color: 'white',
                  }}
                />
              )}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};