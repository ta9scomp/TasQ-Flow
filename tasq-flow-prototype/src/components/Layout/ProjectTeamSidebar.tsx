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
} from '@mui/icons-material';
import { sampleProjectTeams } from '../../data/sampleProjectTeams';
import type { ProjectTeam } from '../../types/task';

interface ProjectTeamSidebarProps {
  open: boolean;
  width: number;
  selectedTeamId?: string;
  onTeamSelect: (teamId: string) => void;
  onClose: () => void;
}

export const ProjectTeamSidebar: React.FC<ProjectTeamSidebarProps> = ({ 
  open, 
  width, 
  selectedTeamId,
  onTeamSelect,
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
          backgroundColor: 'grey.50',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto', height: '100%' }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          p: 2, 
          borderBottom: 1, 
          borderColor: 'divider' 
        }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            プロジェクトチーム
          </Typography>
          <IconButton size="small" onClick={onClose}>
            <ChevronLeftIcon />
          </IconButton>
        </Box>
        
        <List>
          {sampleProjectTeams.map((team) => (
            <ListItem key={team.id} disablePadding>
              <ListItemButton
                selected={selectedTeamId === team.id}
                onClick={() => onTeamSelect(team.id)}
                sx={{
                  borderRadius: 1,
                  mx: 1,
                  my: 0.5,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <ListItemIcon>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: team.color,
                      fontSize: '1rem',
                    }}
                  >
                    {team.name.charAt(0)}
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {team.name}
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                      <Chip
                        label={`${team.projects.length}件`}
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
      </Box>
    </Drawer>
  );
};