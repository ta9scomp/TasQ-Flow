import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  // ListItemText,
  ListItemIcon,
  Collapse,
  Box,
  Typography,
  IconButton,
  Checkbox,
  Avatar,
  Chip,
} from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
  Folder as FolderIcon,
  Task as TaskIcon,
} from '@mui/icons-material';
import { sampleProjectTeams } from '../../data/sampleProjectTeams';
import type { Task } from '../../types/task';

interface ProjectTaskHierarchyProps {
  teamId: string;
  selectedProjectId?: string;
  onProjectSelect?: (projectId: string) => void;
  onTaskSelect?: (taskId: string, isMultiSelect: boolean) => void;
  selectedTaskIds?: string[];
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
}

const ProjectTaskHierarchy: React.FC<ProjectTaskHierarchyProps> = ({
  teamId,
  selectedProjectId,
  onProjectSelect,
  onTaskSelect,
  selectedTaskIds = [],
  // onTaskUpdate, // 使用されていないためコメントアウト
}) => {
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());

  // チームのプロジェクト一覧を取得
  console.log('ProjectTaskHierarchy render:', { teamId, selectedProjectId });
  console.log('Available teams:', sampleProjectTeams.map(t => ({ id: t.id, name: t.name })));
  
  const team = sampleProjectTeams.find(t => t.id === teamId);
  console.log('Found team:', team);
  
  const projects = team?.projects || [];
  console.log('Projects for team:', projects.map(p => ({ id: p.id, name: p.name })));

  const handleProjectToggle = (projectId: string) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  const handleProjectClick = (projectId: string) => {
    onProjectSelect?.(projectId);
    handleProjectToggle(projectId);
  };

  const handleTaskClick = (taskId: string, event: React.MouseEvent) => {
    const isMultiSelect = event.ctrlKey || event.metaKey;
    onTaskSelect?.(taskId, isMultiSelect);
  };

  const formatProgress = (progress: number) => {
    return `${Math.round(progress)}%`;
  };

  const getPriorityColor = (priority: string | number | undefined) => {
    if (!priority) return 'default';
    
    const priorityStr = String(priority).toLowerCase();
    switch (priorityStr) {
      case 'high':
      case '高':
        return 'error';
      case 'medium':
      case '中':
        return 'warning';
      case 'low':
      case '低':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <List sx={{ p: 0 }}>
      {projects.map((project) => {
        const isProjectExpanded = expandedProjects.has(project.id);
        const isProjectSelected = selectedProjectId === project.id;
        
        return (
          <React.Fragment key={project.id}>
            {/* プロジェクト行 */}
            <ListItem 
              disablePadding
              sx={{ 
                backgroundColor: isProjectSelected ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                height: 40, // ガントチャートの行の高さと同期
              }}
            >
              <ListItemButton 
                onClick={() => handleProjectClick(project.id)}
                sx={{ pl: 1, py: 0, height: '100%' }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <FolderIcon color={isProjectSelected ? 'primary' : 'action'} />
                </ListItemIcon>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: isProjectSelected ? 600 : 400,
                        color: isProjectSelected ? 'primary.main' : 'text.primary',
                      }}
                    >
                      {project.name}
                    </Typography>
                    <Chip 
                      label={`${project.tasks.length}件`}
                      size="small"
                      variant="outlined"
                      sx={{ height: 20, fontSize: '0.7rem' }}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {project.description}
                  </Typography>
                </Box>
                <IconButton 
                  size="small" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProjectToggle(project.id);
                  }}
                >
                  {isProjectExpanded ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </ListItemButton>
            </ListItem>

            {/* タスク一覧（展開時） */}
            <Collapse in={isProjectExpanded} timeout="auto" unmountOnExit>
              <List sx={{ pl: 2, py: 0 }}>
                {project.tasks.map((task) => {
                  const isTaskSelected = selectedTaskIds.includes(task.id);
                  
                  return (
                    <ListItem 
                      key={task.id}
                      disablePadding
                      sx={{ 
                        backgroundColor: isTaskSelected ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                        '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                        height: 40, // ガントチャートの行の高さと同期
                      }}
                    >
                      <ListItemButton 
                        onClick={(e) => handleTaskClick(task.id, e)}
                        sx={{ pl: 1, py: 0, height: '100%' }}
                      >
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <Checkbox
                            size="small"
                            checked={isTaskSelected}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleTaskClick(task.id, e as unknown as React.MouseEvent);
                            }}
                          />
                        </ListItemIcon>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <TaskIcon 
                            fontSize="small" 
                            color={isTaskSelected ? 'primary' : 'action'} 
                          />
                        </ListItemIcon>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontWeight: isTaskSelected ? 500 : 400,
                                fontSize: '0.875rem',
                              }}
                            >
                              {task.title}
                            </Typography>
                            <Chip 
                              label={task.priority || '未設定'}
                              size="small"
                              color={getPriorityColor(task.priority) as 'default' | 'error' | 'warning' | 'success'}
                              variant="outlined"
                              sx={{ height: 18, fontSize: '0.65rem' }}
                            />
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              {formatProgress(task.progress)}
                            </Typography>
                            {task.assignees.length > 0 && (
                              <Avatar 
                                sx={{ width: 16, height: 16, fontSize: '0.6rem' }}
                              >
                                {task.assignees[0].charAt(0)}
                              </Avatar>
                            )}
                            <Typography variant="caption" color="text.secondary">
                              {new Date(task.startDate).toLocaleDateString('ja-JP', { 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                              〜
                              {new Date(task.endDate).toLocaleDateString('ja-JP', { 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </Typography>
                          </Box>
                        </Box>
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            </Collapse>
          </React.Fragment>
        );
      })}
    </List>
  );
};

export { ProjectTaskHierarchy };