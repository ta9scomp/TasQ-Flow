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
  IconButton,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  Group as TeamIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { sampleProjectTeams } from '../../data/sampleProjectTeams';
import type { ProjectTeam } from '../../types/task';

interface ProjectTeamSidebarProps {
  open: boolean;
  width: number;
  selectedTeamId?: string;
  selectedView: 'home' | 'teams';
  onTeamSelect: (teamId: string) => void;
  onHomeSelect: () => void;
  onClose: () => void;
}

export const ProjectTeamSidebar: React.FC<ProjectTeamSidebarProps> = ({ 
  open, 
  width, 
  selectedTeamId,
  selectedView,
  onTeamSelect,
  onHomeSelect,
  onClose
}) => {
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
          background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
          borderRight: '1px solid rgba(0,0,0,0.08)',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto', height: '100%' }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          p: 2.5, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          <Typography variant="h6" sx={{ 
            fontWeight: 'bold',
            fontSize: '1.1rem',
            textShadow: '0 1px 2px rgba(0,0,0,0.1)',
          }}>
            🏢 プロジェクトチーム
          </Typography>
          <IconButton 
            size="small" 
            onClick={onClose}
            sx={{ 
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
        </Box>
        
        <List>
          {/* ホームタブ */}
          <ListItem disablePadding>
            <ListItemButton
              selected={selectedView === 'home'}
              onClick={onHomeSelect}
              sx={{
                borderRadius: 1,
                mx: 1,
                my: 0.5,
                minHeight: 72,
                background: selectedView === 'home' 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'transparent',
                color: selectedView === 'home' ? 'white' : 'inherit',
                '&:hover': {
                  backgroundColor: selectedView === 'home' 
                    ? 'rgba(102, 126, 234, 0.8)' 
                    : 'action.hover',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <ListItemIcon>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: selectedView === 'home' ? 'rgba(255,255,255,0.2)' : '#4CAF50',
                    fontSize: '1rem',
                    color: selectedView === 'home' ? 'white' : 'white',
                  }}
                >
                  <HomeIcon />
                </Avatar>
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body1" sx={{ 
                    fontWeight: 'bold',
                    color: selectedView === 'home' ? 'white' : 'inherit'
                  }}>
                    ホーム
                  </Typography>
                }
                secondary={
                  <Typography variant="caption" sx={{ 
                    color: selectedView === 'home' ? 'rgba(255,255,255,0.8)' : 'text.secondary'
                  }}>
                    ダッシュボード
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>

          {/* 区切り線 */}
          <Box sx={{ 
            mx: 2, 
            my: 1, 
            borderBottom: 1, 
            borderColor: 'divider',
            opacity: 0.5
          }} />

          {/* プロジェクトチーム一覧 */}
          {sampleProjectTeams.map((team) => (
            <ListItem key={team.id} disablePadding>
              <ListItemButton
                selected={selectedTeamId === team.id}
                onClick={() => onTeamSelect(team.id)}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  my: 0.5,
                  minHeight: 72,
                  background: selectedTeamId === team.id 
                    ? `linear-gradient(135deg, ${team.color}20 0%, ${team.color}40 100%)`
                    : 'transparent',
                  borderLeft: selectedTeamId === team.id ? `4px solid ${team.color}` : 'none',
                  '&:hover': {
                    backgroundColor: selectedTeamId === team.id 
                      ? `${team.color}30`
                      : 'action.hover',
                    transform: 'translateX(2px)',
                  },
                  transition: 'all 0.3s ease',
                  boxShadow: selectedTeamId === team.id 
                    ? '0 2px 8px rgba(0,0,0,0.1)' 
                    : 'none',
                }}
              >
                <ListItemIcon>
                  <Avatar
                    sx={{
                      width: 44,
                      height: 44,
                      bgcolor: team.color,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      border: '2px solid rgba(255,255,255,0.8)',
                    }}
                  >
                    {team.name.charAt(0)}
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body1" sx={{ 
                      fontWeight: 'bold',
                      fontSize: '0.95rem',
                      color: selectedTeamId === team.id ? team.color : 'inherit'
                    }}>
                      {team.name}
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                      <Chip
                        label={`${team.projects.length}プロジェクト`}
                        size="small"
                        variant="outlined"
                        sx={{ 
                          height: 18, 
                          fontSize: '0.65rem',
                          borderColor: team.color,
                          color: team.color,
                        }}
                      />
                      {getActiveProjectCount(team) > 0 && (
                        <Chip
                          label={`進行中 ${getActiveProjectCount(team)}`}
                          size="small"
                          sx={{ 
                            height: 18, 
                            fontSize: '0.65rem',
                            bgcolor: team.color,
                            color: 'white',
                          }}
                        />
                      )}
                      {!team.isActive && (
                        <Chip
                          label="休止中"
                          size="small"
                          color="warning"
                          sx={{ height: 18, fontSize: '0.65rem' }}
                        />
                      )}
                    </Box>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};