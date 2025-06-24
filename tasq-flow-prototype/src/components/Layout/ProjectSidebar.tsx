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
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto', height: '100%' }}>
        <Box sx={{ 
          p: 2, 
          borderBottom: 1, 
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          {team && (
            <>
              <Avatar
                sx={{
                  width: 24,
                  height: 24,
                  bgcolor: team.color,
                  fontSize: '0.75rem',
                }}
              >
                {team.name.charAt(0)}
              </Avatar>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {team.name}
              </Typography>
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
                      borderRadius: 1,
                      mx: 1,
                      my: 0.5,
                    }}
                  >
                    <ListItemIcon>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: project.color || team?.color,
                          fontSize: '0.875rem',
                        }}
                      >
                        {project.name.charAt(0)}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
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
                              }}
                            />
                            <Chip
                              label={`${project.tasks.length}タスク`}
                              size="small"
                              variant="outlined"
                              sx={{ height: 16, fontSize: '0.65rem' }}
                            />
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={project.progress}
                              sx={{ flex: 1, height: 4, borderRadius: 2 }}
                            />
                            <Typography variant="caption" sx={{ minWidth: 30 }}>
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