import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Box,
  Collapse,
  Typography,
  Avatar,
  Chip,
} from '@mui/material';

import {
  Home as HomeIcon,
  ExpandLess,
  ExpandMore,
  Group as TeamIcon,
} from '@mui/icons-material';
import { sampleProjectTeams } from '../../data/sampleProjectTeams';
import type { ProjectTeam } from '../../types/task';

interface SidebarProps {
  open: boolean;
  width: number;
  selectedView: 'home' | 'teams';
  selectedTeamId?: string;
  onViewChange: (view: 'home' | 'teams') => void;
  onTeamSelect: (teamId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  open, 
  width, 
  selectedView,
  selectedTeamId,
  onViewChange,
  onTeamSelect 
}) => {
  const [teamsOpen, setTeamsOpen] = React.useState(true);

  const handleTeamsClick = () => {
    setTeamsOpen(!teamsOpen);
  };

  const getTeamProjectCount = (team: ProjectTeam) => {
    return team.projects.length;
  };

  const getActiveProjectCount = (team: ProjectTeam) => {
    return team.projects.filter(p => p.status === 'active').length;
  };

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
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        {/* ホーム */}
        <List>
          <ListItem disablePadding>
            <ListItemButton
              selected={selectedView === 'home'}
              onClick={() => onViewChange('home')}
            >
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="ホーム" />
            </ListItemButton>
          </ListItem>
        </List>
        
        <Divider />
        
        {/* プロジェクトチーム一覧 */}
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={handleTeamsClick}>
              <ListItemIcon>
                <TeamIcon />
              </ListItemIcon>
              <ListItemText primary="プロジェクトチーム" />
              {teamsOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={teamsOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {sampleProjectTeams.map((team) => (
                <ListItem key={team.id} disablePadding sx={{ pl: 2 }}>
                  <ListItemButton
                    selected={selectedTeamId === team.id}
                    onClick={() => {
                      onViewChange('teams');
                      onTeamSelect(team.id);
                    }}
                    sx={{
                      borderRadius: 1,
                      mx: 1,
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    <ListItemIcon>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: team.color,
                          fontSize: '0.875rem',
                        }}
                      >
                        {team.name.charAt(0)}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={team.name}
                      secondary={
                        <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                          <Chip
                            label={`${getTeamProjectCount(team)}件`}
                            size="small"
                            variant="outlined"
                            sx={{ height: 16, fontSize: '0.65rem' }}
                          />
                          {getActiveProjectCount(team) > 0 && (
                            <Chip
                              label={`進行中${getActiveProjectCount(team)}`}
                              size="small"
                              color="primary"
                              sx={{ height: 16, fontSize: '0.65rem' }}
                            />
                          )}
                          {!team.isActive && (
                            <Chip
                              label="休止中"
                              size="small"
                              color="warning"
                              sx={{ height: 16, fontSize: '0.65rem' }}
                            />
                          )}
                        </Box>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Collapse>
        </List>

        {/* 選択中のチーム情報 */}
        {selectedTeamId && selectedView === 'teams' && (
          <>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="caption" color="text.secondary">
                選択中のチーム
              </Typography>
              {(() => {
                const team = sampleProjectTeams.find(t => t.id === selectedTeamId);
                return team ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
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
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      {team.name}
                    </Typography>
                  </Box>
                ) : null;
              })()}
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
};