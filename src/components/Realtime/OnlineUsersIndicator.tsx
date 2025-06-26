import React from 'react';
import {
  Box,
  Avatar,
  AvatarGroup,
  Tooltip,
  Typography,
  Chip,
  Badge,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
} from '@mui/material';
import {
  Wifi as ConnectedIcon,
  WifiOff as DisconnectedIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { useRealtime } from '../../contexts/RealtimeContext';

interface OnlineUsersIndicatorProps {
  compact?: boolean;
  showConnectionStatus?: boolean;
}

export const OnlineUsersIndicator: React.FC<OnlineUsersIndicatorProps> = ({
  compact = false,
  showConnectionStatus = true,
}) => {
  const { isConnected, onlineUsers, error } = useRealtime();
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  // モックユーザーデータ（実際の実装では、ユーザー情報APIから取得）
  const getUserInfo = (userId: string) => {
    const mockUsers: Record<string, { name: string; avatar?: string; color: string }> = {
      'mock_user_1': { name: '田中太郎', color: '#1976d2' },
      'mock_user_2': { name: '佐藤花子', color: '#388e3c' },
      'current_user': { name: 'あなた', color: '#f57c00' },
    };
    return mockUsers[userId] || { name: userId, color: '#9e9e9e' };
  };

  const getConnectionStatusColor = () => {
    if (error) return '#f44336';
    return isConnected ? '#4caf50' : '#ff9800';
  };

  const getConnectionStatusText = () => {
    if (error) return 'エラー';
    return isConnected ? 'オンライン' : 'オフライン';
  };

  if (compact) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {showConnectionStatus && (
          <Tooltip title={`リアルタイム同期: ${getConnectionStatusText()}`}>
            <Badge 
              color={isConnected ? 'success' : 'warning'}
              variant="dot"
              sx={{
                '& .MuiBadge-badge': {
                  backgroundColor: getConnectionStatusColor(),
                }
              }}
            >
              {isConnected ? <ConnectedIcon fontSize="small" /> : <DisconnectedIcon fontSize="small" />}
            </Badge>
          </Tooltip>
        )}
        
        {onlineUsers.length > 0 && (
          <Tooltip title={`${onlineUsers.length}人がオンライン`}>
            <IconButton size="small" onClick={handleClick}>
              <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: '0.7rem' } }}>
                {onlineUsers.map(userId => {
                  const user = getUserInfo(userId);
                  return (
                    <Avatar
                      key={userId}
                      sx={{ bgcolor: user.color }}
                    >
                      {user.name.charAt(0)}
                    </Avatar>
                  );
                })}
              </AvatarGroup>
            </IconButton>
          </Tooltip>
        )}
      </Box>
    );
  }

  return (
    <Box>
      <Paper 
        sx={{ 
          p: 2, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          cursor: onlineUsers.length > 0 ? 'pointer' : 'default',
        }}
        onClick={onlineUsers.length > 0 ? handleClick : undefined}
      >
        {showConnectionStatus && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isConnected ? <ConnectedIcon color="success" /> : <DisconnectedIcon color="warning" />}
            <Chip
              label={getConnectionStatusText()}
              color={isConnected ? 'success' : 'warning'}
              size="small"
              variant="outlined"
            />
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PeopleIcon />
          <Typography variant="body2" fontWeight="medium">
            オンライン: {onlineUsers.length}人
          </Typography>
          
          {onlineUsers.length > 0 && (
            <AvatarGroup max={5}>
              {onlineUsers.map(userId => {
                const user = getUserInfo(userId);
                return (
                  <Avatar
                    key={userId}
                    sx={{ bgcolor: user.color, width: 32, height: 32 }}
                  >
                    {user.name.charAt(0)}
                  </Avatar>
                );
              })}
            </AvatarGroup>
          )}
        </Box>

        {error && (
          <Typography variant="caption" color="error">
            {error}
          </Typography>
        )}
      </Paper>

      {/* オンラインユーザー詳細ポップオーバー */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Paper sx={{ minWidth: 250, maxWidth: 400 }}>
          <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PeopleIcon />
              オンラインメンバー ({onlineUsers.length})
            </Typography>
          </Box>
          
          <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
            {onlineUsers.map(userId => {
              const user = getUserInfo(userId);
              return (
                <ListItem key={userId}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: user.color }}>
                      {user.name.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={user.name}
                    secondary={userId === 'current_user' ? 'あなた' : `ID: ${userId}`}
                  />
                  <Badge
                    color="success"
                    variant="dot"
                    sx={{
                      '& .MuiBadge-badge': {
                        backgroundColor: '#4caf50',
                      }
                    }}
                  />
                </ListItem>
              );
            })}
          </List>
        </Paper>
      </Popover>
    </Box>
  );
};