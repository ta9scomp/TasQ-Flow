import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Typography,
  Avatar,
  Chip,
  LinearProgress,
  Collapse,
} from '@mui/material';
import {
  Assignment as ProjectIcon,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import { getProjectsByTeamId, getProjectTeamById } from '../../data/sampleProjectTeams';
import type { Project } from '../../types/task';

interface ProjectSidebarProps {
  open: boolean;
  width: number;
  selectedTeamId?: string;
  selectedProjectId?: string;
  onProjectSelect: (projectId: string) => void;
  leftSidebarWidth: number;
}

export const ProjectSidebar: React.FC<ProjectSidebarProps> = ({ 
  open, 
  width, 
  selectedTeamId,
  selectedProjectId,
  onProjectSelect,
  leftSidebarWidth
}) => {
  const [expandedProjects, setExpandedProjects] = React.useState<Set<string>>(new Set());
  
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

  if (!open || !selectedTeamId) return null;

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: width,
          boxSizing: 'border-box',
          left: leftSidebarWidth,
          background: 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)',
          borderRight: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto', height: '100%' }}>
        <Box sx={{ 
          p: 2.5,
          background: team ? `linear-gradient(135deg, ${team.color}15 0%, ${team.color}25 100%)` : 'grey.50',
          borderBottom: `3px solid ${team?.color || '#e0e0e0'}`,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5
        }}>
          {team && (
            <>
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
                <Typography variant="subtitle1" sx={{ 
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  color: team.color,
                  lineHeight: 1.2,
                }}>
                  {team.name}
                </Typography>
                <Typography variant="caption" sx={{ 
                  color: 'text.secondary',
                  fontSize: '0.75rem',
                }}>
                  📁 プロジェクト一覧
                </Typography>
              </Box>
            </>
          )}
        </Box>
        
        <List>
          {projects.map((project) => {
            const isExpanded = expandedProjects.has(project.id);
            const hasSubTasks = project.tasks.length > 0;
            
            return (
              <React.Fragment key={project.id}>
                <ListItem disablePadding>
                  <ListItemButton
                    selected={selectedProjectId === project.id}
                    onClick={() => {
                      onProjectSelect(project.id);
                      if (hasSubTasks) {
                        toggleProjectExpansion(project.id);
                      }
                    }}
                    sx={{
                      borderRadius: 2,
                      mx: 1,
                      my: 0.5,
                      minHeight: 80,
                      background: selectedProjectId === project.id 
                        ? `linear-gradient(135deg, ${project.color || team?.color}20 0%, ${project.color || team?.color}35 100%)`
                        : 'transparent',
                      borderLeft: selectedProjectId === project.id 
                        ? `4px solid ${project.color || team?.color}` 
                        : `2px solid transparent`,
                      '&:hover': {
                        backgroundColor: selectedProjectId === project.id 
                          ? `${project.color || team?.color}25`
                          : 'action.hover',
                        transform: 'translateX(2px)',
                      },
                      transition: 'all 0.3s ease',
                      boxShadow: selectedProjectId === project.id 
                        ? '0 2px 12px rgba(0,0,0,0.1)' 
                        : '0 1px 3px rgba(0,0,0,0.05)',
                    }}
                  >
                    <ListItemIcon>
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: project.color || team?.color,
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                          border: selectedProjectId === project.id 
                            ? '2px solid rgba(255,255,255,0.8)' 
                            : '1px solid rgba(255,255,255,0.5)',
                        }}
                      >
                        {project.name.charAt(0)}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" sx={{ 
                          fontWeight: 'bold',
                          fontSize: '0.95rem',
                          color: selectedProjectId === project.id 
                            ? project.color || team?.color 
                            : 'inherit',
                          lineHeight: 1.3,
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
                                height: 18,
                                fontSize: '0.7rem',
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
                                height: 18, 
                                fontSize: '0.7rem',
                                borderColor: project.color || team?.color,
                                color: project.color || team?.color,
                              }}
                            />
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={project.progress}
                              sx={{ 
                                flex: 1, 
                                height: 6, 
                                borderRadius: 3,
                                backgroundColor: 'rgba(0,0,0,0.1)',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: project.color || team?.color,
                                  borderRadius: 3,
                                }
                              }}
                            />
                            <Typography variant="caption" sx={{ 
                              minWidth: 35,
                              fontWeight: 'bold',
                              color: project.color || team?.color,
                            }}>
                              {project.progress}%
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                    {hasSubTasks && (
                      isExpanded ? <ExpandLess /> : <ExpandMore />
                    )}
                  </ListItemButton>
                </ListItem>
                
                {/* タスクのプレビュー */}
                {hasSubTasks && (
                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {project.tasks.slice(0, 5).map((task) => (
                        <ListItem key={task.id} sx={{ pl: 4 }}>
                          <ListItemIcon>
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: task.color || project.color,
                              }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                                {task.title}
                              </Typography>
                            }
                            secondary={
                              <Box sx={{ display: 'flex', gap: 0.5 }}>
                                {task.assignees.length > 0 && (
                                  <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>
                                    {task.assignees[0]}
                                  </Typography>
                                )}
                                <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>
                                  {task.progress}%
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                      {project.tasks.length > 5 && (
                        <ListItem sx={{ pl: 4 }}>
                          <Typography variant="caption" color="text.secondary">
                            他 {project.tasks.length - 5} 件のタスク...
                          </Typography>
                        </ListItem>
                      )}
                    </List>
                  </Collapse>
                )}
              </React.Fragment>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
};