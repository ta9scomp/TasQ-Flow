import React, { useState } from 'react';
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
  IconButton,
  LinearProgress,
  Collapse,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  Group as TeamIcon,
  Home as HomeIcon,
  Assignment as TaskIcon,
  Business as BusinessIcon,
  Folder as ProjectIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { sampleProjectTeams, getProjectsByTeamId } from '../../data/sampleProjectTeams';
import { getPriorityColor } from '../../utils/colorUtils';
import type { ProjectTeam, Task } from '../../types/task';

interface ExtendedProjectTeamSidebarProps {
  open: boolean;
  width: number;
  selectedTeamId?: string;
  selectedProjectId?: string;
  selectedView: 'home' | 'teams';
  onTeamSelect: (teamId: string) => void;
  onProjectSelect?: (projectId: string) => void;
  onHomeSelect: () => void;
  onClose: () => void;
  projectTasks?: Task[]; // 選択されたプロジェクトのタスク
  rowHeight?: number;
}

export const ExtendedProjectTeamSidebar: React.FC<ExtendedProjectTeamSidebarProps> = ({
  open,
  width,
  selectedTeamId,
  selectedProjectId,
  selectedView,
  onTeamSelect,
  onProjectSelect,
  onHomeSelect,
  onClose,
  projectTasks = [],
  rowHeight = 40,
}) => {
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'inProgress': return 'primary';
      case 'active': return 'primary';
      case 'onHold': return 'warning';
      case 'planning': return 'info';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return '完了';
      case 'inProgress': return '進行中';
      case 'active': return '進行中';
      case 'onHold': return '保留';
      case 'planning': return '計画中';
      default: return '未着手';
    }
  };

  // 展開幅の計算（チーム選択時にプロジェクト・タスクエリアを表示）
  const expandedWidth = selectedTeamId ? width + 320 : width;

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: expandedWidth,
        flexShrink: 0,
        position: 'fixed',
        zIndex: 1200,
        '& .MuiDrawer-paper': {
          width: expandedWidth,
          boxSizing: 'border-box',
          border: 'none',
          borderRight: '1px solid #e5e7eb',
          background: 'linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)',
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'row',
          overflow: 'hidden',
          gap: 0,
          boxShadow: '4px 0 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      }}
    >
      {/* 左側：チーム選択エリア */}
      <Box sx={{ 
        width, 
        borderRight: selectedTeamId ? '1px solid rgba(0,0,0,0.12)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}>
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: [1],
            borderBottom: '1px solid rgba(0,0,0,0.12)',
            minHeight: '64px !important',
          }}
        >
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
            TasQ Flow
          </Typography>
          <IconButton onClick={onClose}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>

        <List sx={{ flexGrow: 1, py: 0 }}>
          {/* ホーム */}
          <ListItem disablePadding>
            <ListItemButton
              selected={selectedView === 'home'}
              onClick={onHomeSelect}
              sx={{
                py: 1.5,
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  '& .MuiListItemIcon-root': {
                    color: 'primary.main',
                  },
                  '& .MuiListItemText-primary': {
                    fontWeight: 'bold',
                  },
                },
              }}
            >
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText 
                primary="ホーム" 
                secondary="ダッシュボード" 
              />
            </ListItemButton>
          </ListItem>

          {/* チーム一覧 */}
          <Box sx={{ mt: 2 }}>
            <Typography
              variant="overline"
              sx={{
                px: 2,
                color: 'text.secondary',
                fontWeight: 'bold',
                fontSize: '0.75rem',
              }}
            >
              プロジェクトチーム
            </Typography>
            
            {sampleProjectTeams.map((team: ProjectTeam) => (
              <ListItem key={team.id} disablePadding>
                <ListItemButton
                  selected={selectedTeamId === team.id && selectedView === 'teams'}
                  onClick={() => onTeamSelect(team.id)}
                  sx={{
                    py: 1,
                    '&.Mui-selected': {
                      backgroundColor: `${team.color}15`,
                      borderRight: `3px solid ${team.color}`,
                      '& .MuiListItemText-primary': {
                        fontWeight: 'bold',
                        color: team.color,
                      },
                    },
                    '&:hover': {
                      backgroundColor: `${team.color}08`,
                    },
                  }}
                >
                  <ListItemIcon>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: team.color,
                        fontSize: '0.9rem',
                      }}
                    >
                      <TeamIcon fontSize="small" />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={team.name}
                    secondary={`${team.members?.length || 0}名`}
                    primaryTypographyProps={{
                      fontSize: '0.9rem',
                    }}
                    secondaryTypographyProps={{
                      fontSize: '0.75rem',
                    }}
                  />
                  <Chip
                    size="small"
                    label={getProjectsByTeamId(team.id).length}
                    sx={{ 
                      bgcolor: `${team.color}20`,
                      color: team.color,
                      fontWeight: 'bold',
                      minWidth: 24,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </Box>
        </List>
      </Box>

      {/* 右側：プロジェクト・タスクエリア（チーム選択時のみ表示） */}
      {selectedTeamId && (
        <Box sx={{ 
          width: 320,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'grey.50',
          borderLeft: 'none', // 左のborderRightで既に境界線があるため削除
        }}>
          {/* ヘッダー */}
          <Box sx={{ 
            p: 2, 
            borderBottom: '1px solid rgba(0,0,0,0.12)',
            backgroundColor: 'background.paper',
            minHeight: '64px', // Toolbarと高さを合わせる
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BusinessIcon />
              プロジェクト・タスク
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {sampleProjectTeams.find(t => t.id === selectedTeamId)?.name}
            </Typography>
          </Box>

          {/* プロジェクト・タスク一覧 */}
          <Box sx={{ 
            flex: 1, 
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              width: 4,
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(0,0,0,0.2)',
              borderRadius: 2,
            },
          }}>
            {/* タイムスケールの高さに合わせるスペーサー（月ヘッダー35px + 日付カレンダー45px） */}
            <Box sx={{ 
              height: 80, 
              backgroundColor: 'background.paper',
              borderBottom: '1px solid rgba(0,0,0,0.12)',
            }} />
            
            <List sx={{ p: 0 }}>
              {getProjectsByTeamId(selectedTeamId).map((project) => {
                const isProjectExpanded = expandedProjects.has(project.id);
                const isProjectSelected = selectedProjectId === project.id;
                
                return (
                  <React.Fragment key={project.id}>
                    {/* プロジェクト行 */}
                    <ListItem
                      sx={{
                        height: rowHeight,
                        backgroundColor: isProjectSelected ? 'primary.light' : 'background.paper',
                        borderBottom: 1,
                        borderColor: 'divider',
                        pl: 1,
                        pr: 1,
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <IconButton
                          size="small"
                          onClick={() => toggleProjectExpansion(project.id)}
                          sx={{ p: 0.5 }}
                        >
                          {isProjectExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                        </IconButton>
                      </ListItemIcon>

                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar
                              sx={{
                                width: 20,
                                height: 20,
                                fontSize: '0.7rem',
                                bgcolor: project.color,
                              }}
                            >
                              <ProjectIcon sx={{ fontSize: 12 }} />
                            </Avatar>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 'medium',
                                fontSize: '0.85rem',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                flex: 1,
                              }}
                              onClick={() => onProjectSelect?.(project.id)}
                              style={{ cursor: 'pointer' }}
                            >
                              {project.name}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                            <Chip
                              size="small"
                              label={getStatusLabel(project.status)}
                              color={getStatusColor(project.status) as any}
                              variant="outlined"
                              sx={{ fontSize: '0.6rem', height: 16 }}
                            />
                            <Chip
                              size="small"
                              label={`${project.tasks.length} タスク`}
                              sx={{ fontSize: '0.6rem', height: 16 }}
                            />
                          </Box>
                        }
                      />

                      <Box sx={{ width: 40, ml: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={project.progress}
                          color={project.progress === 100 ? 'success' : 'primary'}
                          sx={{ height: 4, borderRadius: 2 }}
                        />
                        <Typography 
                          variant="caption" 
                          sx={{ fontSize: '0.6rem', color: 'text.secondary' }}
                        >
                          {project.progress}%
                        </Typography>
                      </Box>
                    </ListItem>

                    {/* タスク行（プロジェクト展開時） */}
                    <Collapse in={isProjectExpanded} timeout="auto" unmountOnExit>
                      {(isProjectSelected && projectTasks.length > 0 ? projectTasks : project.tasks).map((task) => {
                        const isGroupTask = task.isGroup;
                        const isGroupExpanded = expandedGroups.has(task.id);
                        
                        return (
                          <React.Fragment key={task.id}>
                            <ListItem
                              sx={{
                                height: rowHeight,
                                backgroundColor: isGroupTask ? 'grey.100' : 'background.paper',
                                borderBottom: 1,
                                borderColor: 'divider',
                                pl: task.parentId ? 4 : 2,
                                pr: 1,
                                '&:hover': {
                                  backgroundColor: 'action.hover',
                                },
                              }}
                            >
                              <Box sx={{ mr: 1, minWidth: 24 }}>
                                {isGroupTask ? (
                                  <IconButton
                                    size="small"
                                    onClick={() => toggleGroupExpansion(task.id)}
                                    sx={{ p: 0.5 }}
                                  >
                                    {isGroupExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                                  </IconButton>
                                ) : (
                                  <TaskIcon 
                                    fontSize="small" 
                                    sx={{ color: 'text.secondary' }} 
                                  />
                                )}
                              </Box>

                              <ListItemText
                                primary={
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontWeight: isGroupTask ? 'medium' : 'normal',
                                      fontSize: isGroupTask ? '0.8rem' : '0.75rem',
                                      color: task.parentId ? 'text.secondary' : 'text.primary',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                    }}
                                  >
                                    {task.title}
                                  </Typography>
                                }
                                secondary={
                                  !isGroupTask && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                      <Chip
                                        size="small"
                                        label={getStatusLabel(task.status)}
                                        color={getStatusColor(task.status) as any}
                                        variant="outlined"
                                        sx={{ fontSize: '0.6rem', height: 14 }}
                                      />
                                      {task.priority && (
                                        <Chip
                                          size="small"
                                          label={`P${task.priority}`}
                                          sx={{
                                            fontSize: '0.6rem',
                                            height: 14,
                                            backgroundColor: getPriorityColor(task.priority),
                                            color: 'white',
                                          }}
                                        />
                                      )}
                                    </Box>
                                  )
                                }
                              />

                              {!isGroupTask && (
                                <Box sx={{ width: 30, ml: 1 }}>
                                  <LinearProgress
                                    variant="determinate"
                                    value={task.progress}
                                    color={task.progress === 100 ? 'success' : 'primary'}
                                    sx={{ height: 3, borderRadius: 1 }}
                                  />
                                  <Typography 
                                    variant="caption" 
                                    sx={{ fontSize: '0.55rem', color: 'text.secondary' }}
                                  >
                                    {task.progress}%
                                  </Typography>
                                </Box>
                              )}
                            </ListItem>

                            {/* 子タスク（グループ展開時） */}
                            {isGroupTask && (
                              <Collapse in={isGroupExpanded} timeout="auto" unmountOnExit>
                                {task.children?.map(childId => {
                                  const childTask = (isProjectSelected && projectTasks.length > 0 ? projectTasks : project.tasks)
                                    .find(t => t.id === childId);
                                  if (!childTask) return null;
                                  
                                  return (
                                    <ListItem
                                      key={childTask.id}
                                      sx={{
                                        height: rowHeight,
                                        backgroundColor: 'background.paper',
                                        borderBottom: 1,
                                        borderColor: 'divider',
                                        pl: 5,
                                        pr: 1,
                                        '&:hover': {
                                          backgroundColor: 'action.hover',
                                        },
                                      }}
                                    >
                                      <TaskIcon 
                                        fontSize="small" 
                                        sx={{ mr: 1, color: 'text.secondary' }} 
                                      />
                                      <ListItemText
                                        primary={
                                          <Typography
                                            variant="body2"
                                            sx={{
                                              fontSize: '0.75rem',
                                              color: 'text.secondary',
                                              overflow: 'hidden',
                                              textOverflow: 'ellipsis',
                                              whiteSpace: 'nowrap',
                                            }}
                                          >
                                            {childTask.title}
                                          </Typography>
                                        }
                                      />
                                      <Box sx={{ width: 30, ml: 1 }}>
                                        <LinearProgress
                                          variant="determinate"
                                          value={childTask.progress}
                                          color={childTask.progress === 100 ? 'success' : 'primary'}
                                          sx={{ height: 3, borderRadius: 1 }}
                                        />
                                      </Box>
                                    </ListItem>
                                  );
                                })}
                              </Collapse>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </Collapse>
                  </React.Fragment>
                );
              })}
            </List>
          </Box>
        </Box>
      )}
    </Drawer>
  );
};