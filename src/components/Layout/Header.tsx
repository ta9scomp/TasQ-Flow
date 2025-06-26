import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Menu,
  MenuItem,
} from '@mui/material';

import {
  ViewSidebar as SidebarIcon,
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
  Person as PersonIcon,
  KeyboardArrowDown as ArrowDownIcon,
} from '@mui/icons-material';
import { SearchBox } from '../Search/SearchBox';


interface HeaderProps {
  onMenuClick: () => void;
  onRightSidebarToggle?: () => void;
  children?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, onRightSidebarToggle, children }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="fixed" sx={{ 
      zIndex: (theme) => theme.zIndex.drawer + 1,
      backgroundColor: '#ffffff',
      color: '#111827',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    }}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="toggle sidebar"
          edge="start"
          onClick={onMenuClick}
          sx={{ 
            mr: 2,
            color: '#6b7280',
            '&:hover': {
              backgroundColor: 'rgba(107, 114, 128, 0.1)',
            }
          }}
        >
          <SidebarIcon />
        </IconButton>
        
        <Typography variant="h6" noWrap component="div" sx={{ 
          display: { xs: 'none', sm: 'block' },
          color: '#111827',
          fontWeight: 600,
        }}>
          TasQ Flow
        </Typography>
        
        <Box sx={{ ml: 3, flex: 1, maxWidth: '600px' }}>
          <SearchBox />
        </Box>
        
        <Box sx={{ flexGrow: 1 }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {children}
          
          {/* 通知アイコン */}
          <IconButton 
            color="inherit"
            sx={{ 
              color: '#6b7280',
              '&:hover': {
                backgroundColor: 'rgba(107, 114, 128, 0.1)',
              }
            }}
          >
            <NotificationsIcon />
          </IconButton>
          
          {/* ユーザーメニュー（控えめなデザイン） */}
          <Box
            onClick={handleProfileMenuOpen}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 1,
              borderRadius: 2,
              cursor: 'pointer',
              backgroundColor: '#f3f4f6',
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: '#e5e7eb',
              }
            }}
          >
            <PersonIcon sx={{ fontSize: 20, color: '#6b7280' }} />
            <Typography variant="body2" sx={{ color: '#374151', fontWeight: 500 }}>
              ユーザー
            </Typography>
            <ArrowDownIcon sx={{ fontSize: 16, color: '#6b7280' }} />
          </Box>
          
          {/* 右側サイドバートグル（ハンバーガーメニュー） */}
          <IconButton
            color="inherit"
            aria-label="toggle right sidebar"
            onClick={onRightSidebarToggle}
            edge="end"
            sx={{ 
              ml: 1,
              color: '#6b7280',
              '&:hover': {
                backgroundColor: 'rgba(107, 114, 128, 0.1)',
              }
            }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
        
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>プロフィール</MenuItem>
          <MenuItem onClick={handleMenuClose}>アカウント設定</MenuItem>
          <MenuItem onClick={handleMenuClose}>ログアウト</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};