import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Avatar,
  AvatarGroup,
  Chip,
  LinearProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Fade,
} from '@mui/material';
import Grid2 from '@mui/material/Grid2';

import {
  Group as TeamIcon,
  Person as PersonIcon,
  Assignment as ProjectIcon,
  TrendingUp as ProgressIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { sampleProjectTeams } from '../../data/sampleProjectTeams';
import type { ProjectTeam, Project } from '../../types/task';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface ProjectTeamListProps {
  onTeamSelect: (teamId: string) => void;
  selectedTeamId?: string;
}

export const ProjectTeamList: React.FC<ProjectTeamListProps> = ({
  onTeamSelect,
  selectedTeamId,
}) => {
  const getTeamProgress = (team: ProjectTeam): number => {
    if (team.projects.length === 0) return 0;
    const totalProgress = team.projects.reduce((sum, project) => sum + project.progress, 0);
    return Math.round(totalProgress / team.projects.length);
  };

  const getProjectStatusCounts = (projects: Project[]) => {
    return {
      active: projects.filter(p => p.status === 'active').length,
      planning: projects.filter(p => p.status === 'planning').length,
      completed: projects.filter(p => p.status === 'completed').length,
      onHold: projects.filter(p => p.status === 'onHold').length,
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'primary';
      case 'planning': return 'info';
      case 'completed': return 'success';
      case 'onHold': return 'warning';
      default: return 'default';
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

  return (
    <Fade in timeout={300}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
            プロジェクトチーム
          </Typography>
          <Typography variant="body1" color="text.secondary">
            組織内のプロジェクトチームを選択して、プロジェクト一覧を表示できます
          </Typography>
        </Box>

        <Grid2 container spacing={3}>
          {sampleProjectTeams.map((team) => {
            const progress = getTeamProgress(team);
            const statusCounts = getProjectStatusCounts(team.projects);
            const isSelected = selectedTeamId === team.id;

            return (
              <Grid2 size={{ xs: 12, md: 6, lg: 4 }} key={team.id}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'all 0.2s ease',
                    border: isSelected ? 2 : 1,
                    borderColor: isSelected ? 'primary.main' : 'divider',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardActionArea 
                    onClick={() => onTeamSelect(team.id)}
                    sx={{ height: '100%' }}
                  >
                    <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      {/* チームヘッダー */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                          sx={{
                            width: 48,
                            height: 48,
                            bgcolor: team.color,
                            mr: 2,
                            fontSize: '1.25rem',
                            fontWeight: 'bold',
                          }}
                        >
                          {team.name.charAt(0)}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                            {team.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                              size="small"
                              label={team.isActive ? 'アクティブ' : '休止中'}
                              color={team.isActive ? 'success' : 'warning'}
                              variant="outlined"
                            />
                          </Box>
                        </Box>
                      </Box>

                      {/* チーム説明 */}
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2, lineHeight: 1.5 }}
                      >
                        {team.description}
                      </Typography>

                      {/* 統計情報 */}
                      <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
                        <Grid2 container spacing={2}>
                          <Grid2 size={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <ProjectIcon fontSize="small" color="primary" />
                              <Typography variant="body2" color="text.secondary">
                                プロジェクト
                              </Typography>
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                              {team.projects.length}件
                            </Typography>
                          </Grid2>
                          <Grid2 size={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <PersonIcon fontSize="small" color="primary" />
                              <Typography variant="body2" color="text.secondary">
                                メンバー
                              </Typography>
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                              {team.members.length}人
                            </Typography>
                          </Grid2>
                        </Grid2>

                        {/* 全体進捗 */}
                        <Box sx={{ mt: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              全体進捗
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {progress}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                        </Box>
                      </Paper>

                      {/* プロジェクトステータス */}
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          プロジェクトステータス
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {Object.entries(statusCounts).map(([status, count]) => (
                            count > 0 && (
                              <Chip
                                key={status}
                                label={`${getStatusLabel(status)} ${count}`}
                                size="small"
                                color={getStatusColor(status) as any}
                                variant="outlined"
                              />
                            )
                          ))}
                        </Box>
                      </Box>

                      {/* メンバーアバター */}
                      <Box sx={{ mt: 'auto' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          チームメンバー
                        </Typography>
                        <AvatarGroup max={6} sx={{ justifyContent: 'flex-start' }}>
                          {team.members.map((member) => (
                            <Avatar
                              key={member.id}
                              sx={{
                                width: 32,
                                height: 32,
                                bgcolor: member.color,
                                fontSize: '0.875rem',
                              }}
                              title={member.name}
                            >
                              {member.name.charAt(0)}
                            </Avatar>
                          ))}
                        </AvatarGroup>
                      </Box>

                      {/* 最終更新日 */}
                      <Box sx={{ mt: 2, pt: 1, borderTop: 1, borderColor: 'divider' }}>
                        <Typography variant="caption" color="text.secondary">
                          最終更新: {format(team.updatedAt, 'yyyy/MM/dd HH:mm', { locale: ja })}
                        </Typography>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid2>
            );
          })}
        </Grid2>

        {/* 選択されたチームの詳細情報 */}
        {selectedTeamId && (
          <Paper sx={{ mt: 4, p: 3 }}>
            {(() => {
              const selectedTeam = sampleProjectTeams.find(t => t.id === selectedTeamId);
              if (!selectedTeam) return null;

              return (
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <TeamIcon sx={{ mr: 1 }} />
                    {selectedTeam.name} - プロジェクト一覧
                  </Typography>
                  
                  {selectedTeam.projects.length > 0 ? (
                    <List>
                      {selectedTeam.projects.map((project, index) => (
                        <React.Fragment key={project.id}>
                          <ListItem>
                            <ListItemIcon>
                              <Avatar
                                sx={{
                                  width: 40,
                                  height: 40,
                                  bgcolor: project.color || selectedTeam.color,
                                  fontSize: '0.875rem',
                                }}
                              >
                                {project.name.charAt(0)}
                              </Avatar>
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                    {project.name}
                                  </Typography>
                                  <Chip
                                    label={getStatusLabel(project.status)}
                                    size="small"
                                    color={getStatusColor(project.status) as any}
                                    variant="outlined"
                                  />
                                  <Chip
                                    label={`${project.progress}%`}
                                    size="small"
                                    variant="outlined"
                                  />
                                </Box>
                              }
                              secondary={
                                <Box sx={{ mt: 0.5 }}>
                                  <Typography variant="body2" color="text.secondary">
                                    {project.description}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    メンバー: {project.members.length}人 | タスク: {project.tasks.length}件
                                  </Typography>
                                </Box>
                              }
                            />
                          </ListItem>
                          {index < selectedTeam.projects.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  ) : (
                    <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                      このチームにはまだプロジェクトがありません
                    </Typography>
                  )}
                </Box>
              );
            })()}
          </Paper>
        )}
      </Box>
    </Fade>
  );
};