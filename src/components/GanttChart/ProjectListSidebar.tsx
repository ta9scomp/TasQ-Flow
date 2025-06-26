import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Chip,
  LinearProgress,
  Collapse,
  Card,
  CardContent,
  alpha,
} from '@mui/material';
import {
  Assignment as ProjectIcon,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import { getProjectsByTeamId, getProjectTeamById } from '../../data/sampleProjectTeams';
import type { Task } from '../../types/task';

interface ProjectListSidebarProps {
  selectedTeamId?: string;
  selectedProjectId?: string;
  onProjectSelect?: (projectId: string) => void;
  displayTasks?: Task[]; // 選択されたプロジェクトのタスク
  onTaskMove?: (taskId: string, targetProjectId: string) => void; // タスク移動機能
}

export const ProjectListSidebar: React.FC<ProjectListSidebarProps> = ({
  selectedTeamId,
  selectedProjectId,
  onProjectSelect,
  displayTasks = [],
  onTaskMove,
}) => {
  const [expandedProjects, setExpandedProjects] = React.useState<Set<string>>(new Set());
  const [dragOverProject, setDragOverProject] = React.useState<string | null>(null);

  const team = selectedTeamId ? getProjectTeamById(selectedTeamId) : null;
  const projects = selectedTeamId ? getProjectsByTeamId(selectedTeamId) : [];

  const toggleProjectExpansion = (projectId: string) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#4CAF50';
      case 'planning': return '#2196F3';
      case 'completed': return '#8BC34A';
      case 'onHold': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return '進行中';
      case 'planning': return '計画中';
      case 'completed': return '完了';
      case 'onHold': return '保留';
      default: return status;
    }
  };

  // ドラッグ&ドロップハンドラー
  const handleDragOver = (e: React.DragEvent, projectId: string) => {
    e.preventDefault();
    setDragOverProject(projectId);
  };

  const handleDragLeave = () => {
    setDragOverProject(null);
  };

  const handleDrop = (e: React.DragEvent, projectId: string) => {
    e.preventDefault();
    setDragOverProject(null);
    
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId && projectId !== selectedProjectId && onTaskMove) {
      onTaskMove(taskId, projectId);
    }
  };

  if (!selectedTeamId || !team) {
    return (
      <Box sx={{ 
        p: 3, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        height: '100%',
        color: 'text.secondary',
      }}>
        <ProjectIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
        <Typography variant="h6" sx={{ mb: 1 }}>
          チームを選択
        </Typography>
        <Typography variant="body2" textAlign="center">
          左側のメニューからプロジェクトチームを選択してください
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* チームヘッダー */}
      <Box sx={{ 
        p: 2,
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        background: `linear-gradient(135deg, ${team.color}15 0%, ${team.color}25 100%)`,
        borderTop: `3px solid ${team.color}`,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: team.color,
              fontSize: '0.9rem',
              fontWeight: 'bold',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            {team.name.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" sx={{ 
              fontWeight: 'bold',
              fontSize: '0.95rem',
              color: team.color,
              lineHeight: 1.2,
            }}>
              {team.name}
            </Typography>
            <Typography variant="caption" sx={{ 
              color: 'text.secondary',
              fontSize: '0.75rem',
            }}>
              📁 {projects.length}個のプロジェクト
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* プロジェクト一覧 */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
        {projects.length === 0 ? (
          <Box sx={{ 
            p: 3, 
            textAlign: 'center',
            color: 'text.secondary',
          }}>
            <ProjectIcon sx={{ fontSize: 48, mb: 2, opacity: 0.3 }} />
            <Typography variant="body2">
              プロジェクトがありません
            </Typography>
          </Box>
        ) : (
          <List dense sx={{ p: 0 }}>
            {projects.map((project) => {
              const isExpanded = expandedProjects.has(project.id);
              const isSelected = selectedProjectId === project.id;
              const hasSubTasks = project.tasks.length > 0;
              
              return (
                <React.Fragment key={project.id}>
                  <ListItem disablePadding sx={{ mb: 1 }}>
                    <Card 
                      onDragOver={(e) => handleDragOver(e, project.id)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, project.id)}
                      sx={{ 
                        width: '100%',
                        border: dragOverProject === project.id
                          ? `3px dashed ${project.color || team.color}`
                          : isSelected 
                          ? `2px solid ${project.color || team.color}` 
                          : '1px solid rgba(0,0,0,0.08)',
                        boxShadow: isSelected ? `0 4px 12px ${alpha(project.color || team.color, 0.2)}` : 1,
                        transition: 'all 0.3s ease',
                        backgroundColor: dragOverProject === project.id
                          ? `${project.color || team.color}15`
                          : isSelected 
                          ? `${project.color || team.color}08` 
                          : 'background.paper',
                      }}>
                      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                        <ListItemButton
                          selected={isSelected}
                          onClick={() => {
                            onProjectSelect?.(project.id);
                            if (hasSubTasks) {
                              toggleProjectExpansion(project.id);
                            }
                          }}
                          sx={{
                            borderRadius: 1,
                            p: 0,
                            minHeight: 'auto',
                            '&.Mui-selected': {
                              backgroundColor: 'transparent',
                            },
                            '&:hover': {
                              backgroundColor: `${project.color || team.color}10`,
                            },
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <Avatar
                              sx={{
                                width: 28,
                                height: 28,
                                bgcolor: project.color || team.color,
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                              }}
                            >
                              {project.name.charAt(0)}
                            </Avatar>
                          </ListItemIcon>
                          
                          <ListItemText
                            primary={
                              <Typography variant="body2" sx={{ 
                                fontWeight: 'bold',
                                fontSize: '0.85rem',
                                lineHeight: 1.3,
                                mb: 0.5,
                              }}>
                                {project.name}
                              </Typography>
                            }
                            secondary={
                              <Box>
                                <Box sx={{ display: 'flex', gap: 0.5, mb: 0.5 }}>
                                  <Chip
                                    label={getStatusLabel(project.status)}
                                    size="small"
                                    sx={{
                                      height: 16,
                                      fontSize: '0.65rem',
                                      bgcolor: getStatusColor(project.status),
                                      color: 'white',
                                      fontWeight: 'bold',
                                    }}
                                  />
                                  <Chip
                                    label={`${project.tasks.length}タスク`}
                                    size="small"
                                    variant="outlined"
                                    sx={{ 
                                      height: 16, 
                                      fontSize: '0.65rem',
                                      borderColor: project.color || team.color,
                                      color: project.color || team.color,
                                    }}
                                  />
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <LinearProgress
                                    variant="determinate"
                                    value={project.progress}
                                    sx={{ 
                                      flex: 1, 
                                      height: 4, 
                                      borderRadius: 2,
                                      backgroundColor: 'rgba(0,0,0,0.08)',
                                      '& .MuiLinearProgress-bar': {
                                        backgroundColor: project.color || team.color,
                                        borderRadius: 2,
                                      }
                                    }}
                                  />
                                  <Typography variant="caption" sx={{ 
                                    minWidth: 28,
                                    fontSize: '0.7rem',
                                    fontWeight: 'bold',
                                    color: project.color || team.color,
                                  }}>
                                    {project.progress}%
                                  </Typography>
                                </Box>
                              </Box>
                            }
                          />
                          
                          {hasSubTasks && (
                            <Box sx={{ ml: 'auto' }}>
                              {isExpanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                            </Box>
                          )}
                        </ListItemButton>

                        {/* タスクプレビュー */}
                        {hasSubTasks && (
                          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                            <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                              <Typography variant="caption" sx={{ 
                                display: 'block',
                                mb: 0.5,
                                fontWeight: 'bold',
                                color: 'text.secondary',
                              }}>
                                タスク構造
                              </Typography>
                              <List component="div" disablePadding dense>
                                {/* 選択されたプロジェクトの場合はdisplayTasksを使用 */}
                                {(isSelected && displayTasks.length > 0 ? displayTasks : project.tasks).slice(0, 6).map((task) => (
                                  <ListItem key={task.id} sx={{ 
                                    py: 0.25, 
                                    pl: task.isGroup ? 1 : 2.5, // グループタスクとサブタスクで階層表現
                                    backgroundColor: task.isGroup ? 'rgba(0,0,0,0.02)' : 'transparent',
                                    borderRadius: task.isGroup ? 1 : 0,
                                  }}>
                                    <ListItemIcon sx={{ minWidth: 20 }}>
                                      {task.isGroup ? (
                                        <Box
                                          sx={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: 1,
                                            bgcolor: task.color || project.color,
                                            border: '1px solid rgba(0,0,0,0.2)',
                                          }}
                                        />
                                      ) : (
                                        <Box
                                          sx={{
                                            width: 6,
                                            height: 6,
                                            borderRadius: '50%',
                                            bgcolor: task.color || project.color,
                                          }}
                                        />
                                      )}
                                    </ListItemIcon>
                                    <ListItemText
                                      primary={
                                        <Typography variant="caption" sx={{ 
                                          fontSize: task.isGroup ? '0.75rem' : '0.7rem',
                                          lineHeight: 1.2,
                                          display: 'block',
                                          whiteSpace: 'nowrap',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          fontWeight: task.isGroup ? 'bold' : 'normal',
                                        }}>
                                          {task.isGroup && '📁'} {task.title}
                                        </Typography>
                                      }
                                      secondary={
                                        <Box sx={{ display: 'flex', gap: 0.5, mt: 0.25 }}>
                                          {task.assignees.length > 0 && (
                                            <Typography variant="caption" sx={{ 
                                              fontSize: '0.6rem',
                                              color: 'text.secondary',
                                            }}>
                                              👤 {task.assignees[0]}
                                            </Typography>
                                          )}
                                          <Typography variant="caption" sx={{ 
                                            fontSize: '0.6rem',
                                            color: 'text.secondary',
                                          }}>
                                            📊 {task.progress}%
                                          </Typography>
                                          {task.isGroup && (
                                            <Typography variant="caption" sx={{ 
                                              fontSize: '0.6rem',
                                              color: 'primary.main',
                                              fontWeight: 'bold',
                                            }}>
                                              🏷️ グループ
                                            </Typography>
                                          )}
                                        </Box>
                                      }
                                    />
                                  </ListItem>
                                ))}
                                {(isSelected && displayTasks.length > 6) || (!isSelected && project.tasks.length > 6) && (
                                  <ListItem sx={{ py: 0.25, pl: 1 }}>
                                    <Typography variant="caption" color="text.secondary" sx={{ 
                                      fontSize: '0.7rem',
                                      ml: 2,
                                    }}>
                                      他 {(isSelected ? displayTasks.length : project.tasks.length) - 6} 件のタスク...
                                    </Typography>
                                  </ListItem>
                                )}
                              </List>
                            </Box>
                          </Collapse>
                        )}
                      </CardContent>
                    </Card>
                  </ListItem>
                </React.Fragment>
              );
            })}
          </List>
        )}
      </Box>
    </Box>
  );
};