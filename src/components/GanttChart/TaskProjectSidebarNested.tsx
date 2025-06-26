import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  Avatar,
  Chip,
  LinearProgress,
  IconButton,
} from '@mui/material';
import {
  Assignment as TaskIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Business as TeamIcon,
  Folder as ProjectIcon,
} from '@mui/icons-material';
import { getProjectsByTeamId, sampleProjectTeams } from '../../data/sampleProjectTeams';
import type { Task } from '../../types/task';
import { getPriorityColor } from '../../utils/colorUtils';

interface TaskProjectSidebarNestedProps {
  rowHeight: number;
  onProjectSelect?: (projectId: string) => void;
  selectedProjectId?: string;
}

// 全体の行構成を計算して返す関数
interface RowItem {
  type: 'team' | 'project' | 'group' | 'task';
  data: any;
  level: number;
  teamId: string;
  projectId?: string;
}

export const TaskProjectSidebarNested: React.FC<TaskProjectSidebarNestedProps> = ({
  rowHeight,
  onProjectSelect,
  selectedProjectId,
}) => {
  const [expandedTeams, setExpandedTeams] = React.useState<Set<string>>(new Set(sampleProjectTeams.map(t => t.id)));
  const [expandedProjects, setExpandedProjects] = React.useState<Set<string>>(new Set());
  const [expandedGroups, setExpandedGroups] = React.useState<Set<string>>(new Set());

  const toggleTeamExpansion = (teamId: string) => {
    const newExpanded = new Set(expandedTeams);
    if (newExpanded.has(teamId)) {
      newExpanded.delete(teamId);
    } else {
      newExpanded.add(teamId);
    }
    setExpandedTeams(newExpanded);
  };

  const toggleProjectExpansion = (projectId: string) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  const toggleGroupExpansion = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  // 行のリストを構築
  const buildRowList = (): RowItem[] => {
    const rows: RowItem[] = [];

    sampleProjectTeams.forEach((team) => {
      // チーム行を追加
      rows.push({
        type: 'team',
        data: team,
        level: 0,
        teamId: team.id,
      });

      if (expandedTeams.has(team.id)) {
        const projects = getProjectsByTeamId(team.id);
        
        projects.forEach((project) => {
          // プロジェクト行を追加
          rows.push({
            type: 'project',
            data: project,
            level: 1,
            teamId: team.id,
            projectId: project.id,
          });

          if (expandedProjects.has(project.id)) {
            // タスクを階層構造で追加
            const addTasksRecursively = (tasks: Task[], parentId: string | null, level: number) => {
              const childTasks = tasks.filter(t => t.parentId === parentId);
              
              childTasks.forEach((task) => {
                rows.push({
                  type: task.isGroup ? 'group' : 'task',
                  data: task,
                  level,
                  teamId: team.id,
                  projectId: project.id,
                });

                if (task.isGroup && expandedGroups.has(task.id)) {
                  addTasksRecursively(tasks, task.id, level + 1);
                }
              });
            };

            addTasksRecursively(project.tasks, null, 2);
          }
        });
      }
    });

    return rows;
  };

  const rows = buildRowList();

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
      case 'completed': return '完了';
      case 'inProgress': return '進行中';
      case 'onHold': return '保留';
      case 'active': return '進行中';
      case 'planning': return '計画中';
      default: return '未着手';
    }
  };

  return (
    <Box sx={{ 
      width: 320, 
      height: '100%', 
      backgroundColor: 'background.paper',
      borderRight: 1,
      borderColor: 'divider',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* ヘッダー部分 */}
      <Box sx={{ 
        p: 2, 
        borderBottom: 1, 
        borderColor: 'divider',
        backgroundColor: 'grey.50'
      }}>
        <Typography variant="h6">
          プロジェクト・タスク一覧
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {rows.length} 項目を表示中
        </Typography>
      </Box>

      {/* タスク一覧部分 */}
      <Box sx={{ 
        flex: 1, 
        overflow: 'hidden',
        position: 'relative'
      }}>
        <Box 
          sx={{ 
            height: '100%', 
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              width: 0,
              height: 0,
            }
          }}
          id="task-sidebar-scroll-container"
        >
          {/* タイムスケールの高さに合わせるスペーサー */}
          <Box sx={{ height: 73, backgroundColor: 'transparent' }} />
          
          <List sx={{ p: 0 }}>
            {rows.map((row) => {
              const isSelected = row.type === 'project' && row.projectId === selectedProjectId;
              
              return (
                <ListItem
                  key={`${row.type}-${row.data.id}`}
                  sx={{
                    height: rowHeight,
                    borderBottom: 1,
                    borderColor: 'divider',
                    backgroundColor: 
                      row.type === 'team' ? 'primary.50' :
                      row.type === 'project' ? (isSelected ? 'primary.100' : 'grey.50') :
                      row.type === 'group' ? 'grey.50' : 
                      'transparent',
                    pl: 1 + row.level * 2,
                    pr: 1,
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                  onClick={() => {
                    if (row.type === 'project') {
                      onProjectSelect?.(row.projectId!);
                    }
                  }}
                >
                  {/* アイコンまたは展開ボタン */}
                  <Box sx={{ mr: 1, minWidth: 24 }}>
                    {row.type === 'team' ? (
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTeamExpansion(row.teamId);
                        }}
                        sx={{ p: 0.5 }}
                      >
                        {expandedTeams.has(row.teamId) ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                      </IconButton>
                    ) : row.type === 'project' ? (
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleProjectExpansion(row.projectId!);
                        }}
                        sx={{ p: 0.5 }}
                      >
                        {expandedProjects.has(row.projectId!) ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                      </IconButton>
                    ) : row.type === 'group' ? (
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleGroupExpansion(row.data.id);
                        }}
                        sx={{ p: 0.5 }}
                      >
                        {expandedGroups.has(row.data.id) ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                      </IconButton>
                    ) : (
                      <TaskIcon 
                        fontSize="small" 
                        sx={{ 
                          color: 'text.secondary'
                        }} 
                      />
                    )}
                  </Box>

                  {/* 情報表示 */}
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {row.type === 'team' && (
                          <Avatar
                            sx={{
                              width: 20,
                              height: 20,
                              fontSize: '0.7rem',
                              bgcolor: row.data.color,
                            }}
                          >
                            <TeamIcon sx={{ fontSize: 14 }} />
                          </Avatar>
                        )}
                        {row.type === 'project' && (
                          <Avatar
                            sx={{
                              width: 18,
                              height: 18,
                              fontSize: '0.7rem',
                              bgcolor: row.data.color,
                            }}
                          >
                            <ProjectIcon sx={{ fontSize: 12 }} />
                          </Avatar>
                        )}
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 
                              row.type === 'team' ? 'bold' :
                              row.type === 'project' ? 'medium' :
                              row.type === 'group' ? 'medium' : 
                              'normal',
                            fontSize: 
                              row.type === 'team' ? '0.9rem' :
                              row.type === 'project' ? '0.85rem' :
                              '0.8rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            flex: 1,
                          }}
                        >
                          {row.data.name || row.data.title}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      row.type !== 'team' && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                          <Chip
                            size="small"
                            label={getStatusLabel(row.data.status)}
                            color={getStatusColor(row.data.status) as any}
                            variant="outlined"
                            sx={{ fontSize: '0.6rem', height: 16 }}
                          />
                          {(row.type === 'task' || row.type === 'group') && row.data.priority && (
                            <Chip
                              size="small"
                              label={`優先度:${row.data.priority}`}
                              sx={{
                                fontSize: '0.6rem',
                                height: 16,
                                backgroundColor: getPriorityColor(row.data.priority),
                                color: 'white',
                              }}
                            />
                          )}
                        </Box>
                      )
                    }
                  />

                  {/* 進捗バー */}
                  {(row.type === 'project' || row.type === 'task') && (
                    <Box sx={{ width: 40, ml: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={row.data.progress}
                        color={row.data.progress === 100 ? 'success' : 'primary'}
                        sx={{ height: 4, borderRadius: 2 }}
                      />
                      <Typography 
                        variant="caption" 
                        sx={{ fontSize: '0.6rem', color: 'text.secondary' }}
                      >
                        {row.data.progress}%
                      </Typography>
                    </Box>
                  )}
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Box>
    </Box>
  );
};