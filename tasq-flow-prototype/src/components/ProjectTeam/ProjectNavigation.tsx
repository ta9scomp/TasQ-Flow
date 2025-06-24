import React from 'react';
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Breadcrumbs,
  Typography,
  Avatar,
  Chip,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
} from '@mui/material';

import {
  Timeline as GanttIcon,
  People as MembersIcon,
  StickyNote2 as StickyIcon,
  CheckBox as TodoIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  NavigateNext as NavigateNextIcon,
  MoreVert as MoreIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Share as ShareIcon,
  Archive as ArchiveIcon,
} from '@mui/icons-material';
import { getProjectTeamById, getProjectById } from '../../data/sampleProjectTeams';
import { SearchBox } from '../Search/SearchBox';

export type ViewMode = 'gantt' | 'members' | 'sticky' | 'todo' | 'history' | 'settings';

interface ProjectNavigationProps {
  teamId: string;
  projectId?: string;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onProjectSelect?: (projectId: string) => void;
}

export const ProjectNavigation: React.FC<ProjectNavigationProps> = ({
  teamId,
  projectId,
  viewMode,
  onViewModeChange,
  onProjectSelect,
}) => {
  const [projectMenuAnchor, setProjectMenuAnchor] = React.useState<null | HTMLElement>(null);

  const team = getProjectTeamById(teamId);
  const project = projectId ? getProjectById(projectId) : null;

  const viewModes = [
    { id: 'gantt' as const, label: 'ガントチャート', icon: <GanttIcon /> },
    { id: 'members' as const, label: 'メンバー', icon: <MembersIcon /> },
    { id: 'sticky' as const, label: '付箋', icon: <StickyIcon /> },
    { id: 'todo' as const, label: 'ToDo', icon: <TodoIcon /> },
    { id: 'history' as const, label: '変更履歴', icon: <Badge badgeContent={3} color="error"><HistoryIcon /></Badge> },
    { id: 'settings' as const, label: '設定', icon: <SettingsIcon /> },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
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

  const handleProjectMenuClose = () => {
    setProjectMenuAnchor(null);
  };

  if (!team) {
    return null;
  }

  return (
    <Paper 
      elevation={1} 
      sx={{ 
        borderRadius: 0, 
        borderBottom: 1, 
        borderColor: 'divider',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <Box sx={{ px: 3, py: 2 }}>
        {/* パンくずリストとプロジェクト情報 */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mr: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar
                  sx={{
                    width: 20,
                    height: 20,
                    bgcolor: team.color,
                    fontSize: '0.75rem',
                  }}
                >
                  {team.name.charAt(0)}
                </Avatar>
                <Typography variant="body2" color="text.primary">
                  {team.name}
                </Typography>
              </Box>
              
              {project && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar
                    sx={{
                      width: 20,
                      height: 20,
                      bgcolor: project.color || team.color,
                      fontSize: '0.75rem',
                    }}
                  >
                    {project.name.charAt(0)}
                  </Avatar>
                  <Typography variant="body2" color="text.primary">
                    {project.name}
                  </Typography>
                  <Chip
                    label={getStatusLabel(project.status)}
                    size="small"
                    color={getStatusColor(project.status) as any}
                    variant="outlined"
                    sx={{ height: 20, fontSize: '0.65rem' }}
                  />
                  <Chip
                    label={`${project.progress}%`}
                    size="small"
                    variant="outlined"
                    sx={{ height: 20, fontSize: '0.65rem' }}
                  />
                </Box>
              )}
            </Breadcrumbs>

            {/* プロジェクトアクションメニュー */}
            {project && (
              <Button
                size="small"
                onClick={(event) => setProjectMenuAnchor(event.currentTarget)}
                endIcon={<MoreIcon />}
                sx={{ ml: 'auto' }}
              >
                アクション
              </Button>
            )}
          </Box>

          {/* 検索ボックス */}
          <Box sx={{ width: 400 }}>
            <SearchBox />
          </Box>
        </Box>

        {/* プロジェクト概要（プロジェクト選択時のみ） */}
        {project && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: project.color || team.color,
              }}
            >
              {project.name.charAt(0)}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 0.5 }}>
                {project.description}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  メンバー: {project.members.length}人
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  |
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  タスク: {project.tasks.length}件
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  |
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  作成日: {project.createdAt.toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        {/* タブナビゲーション */}
        <Tabs
          value={viewMode}
          onChange={(_, newValue) => onViewModeChange(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              minHeight: 48,
              textTransform: 'none',
            },
          }}
        >
          {viewModes.map((mode) => (
            <Tab
              key={mode.id}
              value={mode.id}
              label={mode.label}
              icon={mode.icon}
              iconPosition="start"
              disabled={!project && mode.id !== 'gantt'} // プロジェクト未選択時はガントチャート以外無効
              sx={{
                '& .MuiTab-iconWrapper': {
                  marginBottom: 0,
                  marginRight: 1,
                },
              }}
            />
          ))}
        </Tabs>
      </Box>

      {/* プロジェクトアクションメニュー */}
      <Menu
        anchorEl={projectMenuAnchor}
        open={Boolean(projectMenuAnchor)}
        onClose={handleProjectMenuClose}
        PaperProps={{
          sx: { minWidth: 200 }
        }}
      >
        <MenuItem onClick={handleProjectMenuClose}>
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="プロジェクト詳細" />
        </MenuItem>
        <MenuItem onClick={handleProjectMenuClose}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="プロジェクト編集" />
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleProjectMenuClose}>
          <ListItemIcon>
            <ShareIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="共有" />
        </MenuItem>
        <MenuItem onClick={handleProjectMenuClose}>
          <ListItemIcon>
            <ArchiveIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="アーカイブ" />
        </MenuItem>
      </Menu>
    </Paper>
  );
};