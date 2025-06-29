import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Avatar,
  LinearProgress,
  Tooltip,
  Card,
  CardContent,
} from '@mui/material';
import Grid from '@mui/material/Grid';

import {
  Assignment as ProjectIcon,
  Person as PersonIcon,
  TrendingUp as ProgressIcon,
} from '@mui/icons-material';
import { getProjectsByTeamId, getProjectTeamById } from '../../data/sampleProjectTeams';
import type { Project } from '../../types/task';
import { autoAdjustColor, getContrastColor } from '../../utils/colorUtils';
import { differenceInDays, startOfDay, format, addDays } from 'date-fns';
import { ja } from 'date-fns/locale';

interface ProjectOverviewProps {
  teamId: string;
  onProjectSelect?: (projectId: string) => void;
  selectedProjectId?: string;
}

export const ProjectOverview: React.FC<ProjectOverviewProps> = ({
  teamId,
  onProjectSelect,
  selectedProjectId,
}) => {
  const team = getProjectTeamById(teamId);
  const projects = getProjectsByTeamId(teamId);

  // ガントチャート用の期間計算
  const calculateDateRange = () => {
    if (projects.length === 0) {
      const today = new Date();
      return {
        startDate: startOfDay(today),
        endDate: addDays(startOfDay(today), 90),
      };
    }

    // プロジェクトの開始日と終了日を仮想的に設定（プロジェクト作成日から90日後）
    const projectDates = projects.map(project => ({
      start: startOfDay(project.createdAt),
      end: addDays(startOfDay(project.createdAt), 90),
    }));

    const startDate = new Date(Math.min(...projectDates.map(d => d.start.getTime())));
    const endDate = new Date(Math.max(...projectDates.map(d => d.end.getTime())));

    return { startDate: startOfDay(startDate), endDate };
  };

  const { startDate, endDate } = calculateDateRange();
  const totalDays = differenceInDays(endDate, startDate) + 1;
  const dayWidth = 3; // ガントチャート用の1日の幅（プロジェクトレベルなので細く）

  const calculateProjectPosition = (project: Project) => {
    const projectStart = startOfDay(project.createdAt);
    const projectEnd = addDays(projectStart, 90); // 仮の期間
    const left = differenceInDays(projectStart, startDate) * dayWidth;
    const width = Math.max(differenceInDays(projectEnd, projectStart) + 1, 1) * dayWidth;
    return { left, width };
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

  if (!team) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          チームが見つかりません
        </Typography>
      </Box>
    );
  }

  if (projects.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <ProjectIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" sx={{ mb: 1 }}>
          プロジェクトがありません
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {team.name}にはまだプロジェクトが登録されていません
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* ヘッダー */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: team.color,
              mr: 2,
            }}
          >
            {team.name.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              {team.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              プロジェクト一覧 ({projects.length}件)
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* プロジェクト統計 */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card variant="outlined">
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {projects.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                総プロジェクト
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card variant="outlined">
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                {projects.filter(p => p.status === 'active').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                進行中
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card variant="outlined">
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                {projects.filter(p => p.status === 'planning').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                計画中
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card variant="outlined">
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                {projects.filter(p => p.status === 'completed').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                完了
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* プロジェクトガントチャート */}
      <Paper sx={{ overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', height: 400 }}>
          {/* プロジェクトリスト（左側） */}
          <Box sx={{ width: 350, borderRight: 1, borderColor: 'divider', overflow: 'auto' }}>
            {/* ヘッダー */}
            <Box
              sx={{
                position: 'sticky',
                top: 0,
                backgroundColor: 'grey.50',
                borderBottom: 2,
                borderColor: 'divider',
                px: 2,
                py: 2,
                height: 60,
                display: 'flex',
                alignItems: 'center',
                zIndex: 10,
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold">
                プロジェクト一覧
              </Typography>
            </Box>

            {/* プロジェクトリスト */}
            {projects.map((project) => (
              <Box
                key={project.id}
                onClick={() => onProjectSelect?.(project.id)}
                sx={{
                  height: 60,
                  borderBottom: 1,
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                  px: 2,
                  cursor: 'pointer',
                  backgroundColor: selectedProjectId === project.id ? 'action.selected' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: project.color || team.color,
                    mr: 2,
                    fontSize: '0.875rem',
                  }}
                >
                  {project.name.charAt(0)}
                </Avatar>
                <Box sx={{ flex: 1, overflow: 'hidden' }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 'medium',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {project.name}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
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
                      label={`${project.progress}%`}
                      size="small"
                      variant="outlined"
                      sx={{ height: 16, fontSize: '0.65rem' }}
                    />
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>

          {/* ガントチャート（右側） */}
          <Box sx={{ flex: 1, overflow: 'auto', position: 'relative' }}>
            {/* タイムスケール */}
            <Box
              sx={{
                position: 'sticky',
                top: 0,
                backgroundColor: 'grey.50',
                borderBottom: 2,
                borderColor: 'divider',
                height: 60,
                display: 'flex',
                alignItems: 'flex-end',
                px: 1,
                py: 1,
                zIndex: 10,
              }}
            >
              <Box sx={{ display: 'flex', minWidth: totalDays * dayWidth }}>
                {Array.from({ length: Math.ceil(totalDays / 30) }, (_, monthIndex) => {
                  const monthStart = addDays(startDate, monthIndex * 30);
                  return (
                    <Box
                      key={monthIndex}
                      sx={{
                        minWidth: 30 * dayWidth,
                        textAlign: 'center',
                        borderRight: 1,
                        borderColor: 'divider',
                        px: 1,
                      }}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                        {format(monthStart, 'yyyy/MM', { locale: ja })}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>

            {/* プロジェクトバー表示エリア */}
            <Box sx={{ position: 'relative', minHeight: projects.length * 60, minWidth: totalDays * dayWidth }}>
              {/* プロジェクトバー */}
              {projects.map((project, index) => {
                const { left, width } = calculateProjectPosition(project);
                const adjustedColor = autoAdjustColor(project.color || team.color);
                const textColor = getContrastColor(adjustedColor);

                return (
                  <Tooltip
                    key={project.id}
                    title={
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {project.name}
                        </Typography>
                        <Typography variant="caption" display="block">
                          ステータス: {getStatusLabel(project.status)}
                        </Typography>
                        <Typography variant="caption" display="block">
                          進捗: {project.progress}%
                        </Typography>
                        <Typography variant="caption" display="block">
                          メンバー: {project.members.length}人
                        </Typography>
                        <Typography variant="caption" display="block">
                          タスク: {project.tasks.length}件
                        </Typography>
                      </Box>
                    }
                  >
                    <Box
                      onClick={() => onProjectSelect?.(project.id)}
                      sx={{
                        position: 'absolute',
                        left,
                        top: index * 60 + 15,
                        width,
                        height: 30,
                        background: `linear-gradient(90deg, ${adjustedColor} ${project.progress}%, ${adjustedColor}40 ${project.progress}%)`,
                        border: `1px solid ${adjustedColor}`,
                        borderRadius: 4,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 2,
                        transition: 'transform 0.2s ease',
                        '&:hover': {
                          transform: 'translateY(-1px)',
                          boxShadow: 2,
                        },
                      }}
                    >
                      {width > 60 && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: textColor,
                            fontWeight: 'bold',
                            fontSize: '0.7rem',
                            textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                          }}
                        >
                          {project.progress}%
                        </Typography>
                      )}
                    </Box>
                  </Tooltip>
                );
              })}

              {/* グリッド線 */}
              {Array.from({ length: Math.ceil(totalDays / 30) }, (_, monthIndex) => (
                <Box
                  key={monthIndex}
                  sx={{
                    position: 'absolute',
                    left: monthIndex * 30 * dayWidth,
                    top: 0,
                    bottom: 0,
                    width: 1,
                    bgcolor: 'divider',
                    opacity: 0.5,
                    zIndex: 1,
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* 選択されたプロジェクトの詳細 */}
      {selectedProjectId && (
        <Paper sx={{ mt: 3, p: 3 }}>
          {(() => {
            const project = projects.find(p => p.id === selectedProjectId);
            if (!project) return null;

            return (
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: project.color || team.color,
                      mr: 2,
                    }}
                  >
                    {project.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {project.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {project.description}
                    </Typography>
                  </Box>
                </Box>

                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <ProgressIcon color="primary" />
                      <Typography variant="body2" color="text.secondary">
                        進捗状況
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={project.progress}
                        sx={{ flex: 1, height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {project.progress}%
                      </Typography>
                    </Box>
                    <Chip
                      label={getStatusLabel(project.status)}
                      size="small"
                      sx={{
                        bgcolor: getStatusColor(project.status),
                        color: 'white',
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <PersonIcon color="primary" />
                      <Typography variant="body2" color="text.secondary">
                        チーム構成
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      メンバー: {project.members.length}人 | タスク: {project.tasks.length}件
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {project.members.slice(0, 5).map(member => (
                        <Avatar
                          key={member.id}
                          sx={{
                            width: 24,
                            height: 24,
                            bgcolor: member.color,
                            fontSize: '0.75rem',
                          }}
                          title={member.name}
                        >
                          {member.name.charAt(0)}
                        </Avatar>
                      ))}
                      {project.members.length > 5 && (
                        <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                          +{project.members.length - 5}
                        </Avatar>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            );
          })()}
        </Paper>
      )}
    </Box>
  );
};