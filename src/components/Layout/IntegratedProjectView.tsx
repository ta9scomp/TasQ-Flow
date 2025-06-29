import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Chip,
  LinearProgress,
  IconButton,
  Button,
  Divider,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Assignment as ProjectIcon,
  ExpandLess,
  ExpandMore,
  Timeline as GanttIcon,
  ViewList as ListView,
  Close as CloseIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
} from '@mui/icons-material';
import { getProjectsByTeamId, getProjectTeamById, getProjectById } from '../../data/sampleProjectTeams';
import { VirtualGanttChart } from '../GanttChart/VirtualGanttChart';
import { ProjectNavigation } from '../ProjectTeam/ProjectNavigation';
import { sampleHolidays, sampleEvents } from '../../data/sampleCalendarData';
import { addDays } from 'date-fns';
import type { Task } from '../../types/task';
import type { ViewMode } from '../ProjectTeam/ProjectNavigation';

interface IntegratedProjectViewProps {
  selectedTeamId?: string;
  selectedProjectId?: string;
  onProjectSelect: (projectId: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onTaskClick?: (task: Task) => void;
}

export const IntegratedProjectView: React.FC<IntegratedProjectViewProps> = ({
  selectedTeamId,
  selectedProjectId,
  onProjectSelect,
  viewMode,
  onViewModeChange,
  onTaskClick,
}) => {
  const theme = useTheme();
  const [expandedProjects, setExpandedProjects] = React.useState<Set<string>>(new Set());
  const [showProjectList, setShowProjectList] = React.useState(true);
  const [isGanttFullscreen, setIsGanttFullscreen] = React.useState(false);

  const team = selectedTeamId ? getProjectTeamById(selectedTeamId) : null;
  const projects = selectedTeamId ? getProjectsByTeamId(selectedTeamId) : [];
  const selectedProject = selectedProjectId ? getProjectById(selectedProjectId) : null;

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

  const handleMonthChange = (monthStart: Date, monthEnd: Date) => {
    console.log('月表示変更:', { monthStart, monthEnd });
  };

  if (!selectedTeamId) return null;

  return (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      pt: '64px',
      overflow: 'hidden',
    }}>
      {/* チームヘッダー */}
      <Paper sx={{ 
        p: 2,
        background: team ? `linear-gradient(135deg, ${team.color}15 0%, ${team.color}25 100%)` : 'grey.50',
        borderBottom: `3px solid ${team?.color || '#e0e0e0'}`,
        borderRadius: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {team && (
            <>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: team.color,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                }}
              >
                {team.name.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ 
                  fontWeight: 'bold',
                  color: team.color,
                  lineHeight: 1.2,
                }}>
                  {team.name}
                </Typography>
                <Typography variant="caption" sx={{ 
                  color: 'text.secondary',
                  fontSize: '0.8rem',
                }}>
                  📁 {projects.length}個のプロジェクト
                </Typography>
              </Box>
            </>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            variant={showProjectList ? 'contained' : 'outlined'}
            size="small"
            startIcon={<ListView />}
            onClick={() => setShowProjectList(!showProjectList)}
            sx={{ minWidth: 120 }}
          >
            プロジェクト一覧
          </Button>
          {selectedProjectId && (
            <IconButton
              onClick={() => setIsGanttFullscreen(!isGanttFullscreen)}
              sx={{ color: team?.color }}
            >
              {isGanttFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
          )}
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* プロジェクト一覧サイドパネル */}
        <Collapse in={showProjectList && !isGanttFullscreen} orientation="horizontal">
          <Paper sx={{ 
            width: 380,
            height: '100%',
            borderRadius: 0,
            borderRight: '1px solid rgba(0,0,0,0.08)',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <Box sx={{ 
              p: 2, 
              borderBottom: '1px solid rgba(0,0,0,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <Typography variant="subtitle1" fontWeight="bold">
                プロジェクト一覧
              </Typography>
              <IconButton 
                size="small" 
                onClick={() => setShowProjectList(false)}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
              <List dense>
                {projects.map((project) => {
                  const isExpanded = expandedProjects.has(project.id);
                  const isSelected = selectedProjectId === project.id;
                  const hasSubTasks = project.tasks.length > 0;
                  
                  return (
                    <React.Fragment key={project.id}>
                      <ListItem disablePadding sx={{ mb: 1 }}>
                        <Card sx={{ 
                          width: '100%',
                          border: isSelected ? `2px solid ${project.color || team?.color}` : '1px solid rgba(0,0,0,0.08)',
                          boxShadow: isSelected ? `0 4px 12px ${alpha(project.color || team?.color || '#000', 0.2)}` : 1,
                          transition: 'all 0.3s ease',
                        }}>
                          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                            <ListItemButton
                              selected={isSelected}
                              onClick={() => {
                                onProjectSelect(project.id);
                                if (hasSubTasks) {
                                  toggleProjectExpansion(project.id);
                                }
                              }}
                              sx={{
                                borderRadius: 1,
                                p: 0,
                                minHeight: 'auto',
                              }}
                            >
                              <ListItemIcon sx={{ minWidth: 40 }}>
                                <Avatar
                                  sx={{
                                    width: 32,
                                    height: 32,
                                    bgcolor: project.color || team?.color,
                                    fontSize: '0.9rem',
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
                                    fontSize: '0.9rem',
                                    lineHeight: 1.3,
                                  }}>
                                    {project.name}
                                  </Typography>
                                }
                                secondary={
                                  <Box sx={{ mt: 1 }}>
                                    <Box sx={{ display: 'flex', gap: 0.5, mb: 1 }}>
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
                                          height: 4, 
                                          borderRadius: 2,
                                          backgroundColor: 'rgba(0,0,0,0.08)',
                                          '& .MuiLinearProgress-bar': {
                                            backgroundColor: project.color || team?.color,
                                            borderRadius: 2,
                                          }
                                        }}
                                      />
                                      <Typography variant="caption" sx={{ 
                                        minWidth: 30,
                                        fontSize: '0.7rem',
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

                            {/* タスクプレビュー */}
                            {hasSubTasks && (
                              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                <Divider sx={{ my: 1 }} />
                                <List component="div" disablePadding dense>
                                  {project.tasks.slice(0, 3).map((task) => (
                                    <ListItem key={task.id} sx={{ py: 0.5, pl: 2 }}>
                                      <ListItemIcon sx={{ minWidth: 24 }}>
                                        <Box
                                          sx={{
                                            width: 6,
                                            height: 6,
                                            borderRadius: '50%',
                                            bgcolor: task.color || project.color,
                                          }}
                                        />
                                      </ListItemIcon>
                                      <ListItemText
                                        primary={
                                          <Typography variant="caption" sx={{ 
                                            fontSize: '0.7rem',
                                            lineHeight: 1.2,
                                          }}>
                                            {task.title}
                                          </Typography>
                                        }
                                        secondary={
                                          <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
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
                                          </Box>
                                        }
                                      />
                                    </ListItem>
                                  ))}
                                  {project.tasks.length > 3 && (
                                    <ListItem sx={{ py: 0.5, pl: 2 }}>
                                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                        他 {project.tasks.length - 3} 件のタスク...
                                      </Typography>
                                    </ListItem>
                                  )}
                                </List>
                              </Collapse>
                            )}
                          </CardContent>
                        </Card>
                      </ListItem>
                    </React.Fragment>
                  );
                })}
              </List>
            </Box>
          </Paper>
        </Collapse>

        {/* メインコンテンツエリア */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {selectedProjectId && selectedProject && (
            <>
              {/* プロジェクトナビゲーション */}
              <ProjectNavigation
                teamId={selectedTeamId}
                projectId={selectedProjectId}
                viewMode={viewMode}
                onViewModeChange={onViewModeChange}
                onProjectSelect={onProjectSelect}
              />

              {/* ガントチャート表示 */}
              {viewMode === 'gantt' && (
                <Box sx={{ flex: 1, overflow: 'hidden' }}>
                  <VirtualGanttChart
                    tasks={selectedProject.tasks}
                    startDate={new Date()}
                    endDate={addDays(new Date(), 60)}
                    onTaskClick={onTaskClick}
                    holidays={sampleHolidays}
                    events={sampleEvents}
                    useEnhancedTimeScale={true}
                    onMonthChange={handleMonthChange}
                  />
                </Box>
              )}

              {/* 他のビューモード */}
              {viewMode !== 'gantt' && (
                <Box sx={{ 
                  flex: 1, 
                  p: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <GanttIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      {viewMode === 'members' && 'メンバービュー'}
                      {viewMode === 'sticky' && '付箋ビュー'}
                      {viewMode === 'todo' && 'ToDoビュー'}
                      {viewMode === 'history' && '変更履歴'}
                      {viewMode === 'settings' && 'プロジェクト設定'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      このビューは開発中です
                    </Typography>
                  </Paper>
                </Box>
              )}
            </>
          )}

          {/* プロジェクト未選択時 */}
          {!selectedProjectId && (
            <Box sx={{ 
              flex: 1, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              p: 4,
            }}>
              <Paper sx={{ p: 6, textAlign: 'center', maxWidth: 400 }}>
                <ProjectIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 3 }} />
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                  プロジェクトを選択
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  左側のプロジェクト一覧からプロジェクトを選択して、ガントチャートやタスク管理を開始しましょう。
                </Typography>
                {!showProjectList && (
                  <Button
                    variant="contained"
                    startIcon={<ListView />}
                    onClick={() => setShowProjectList(true)}
                    sx={{ 
                      bgcolor: team?.color,
                      '&:hover': { bgcolor: theme.palette.grey[700] },
                    }}
                  >
                    プロジェクト一覧を表示
                  </Button>
                )}
              </Paper>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};