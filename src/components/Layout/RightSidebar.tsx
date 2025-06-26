import React from 'react';
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Switch,
  FormControlLabel,
  Toolbar,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Palette as PaletteIcon,
  NotificationsActive as NotificationsIcon,
  Language as LanguageIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Help as HelpIcon,
  Info as InfoIcon,
  Feedback as FeedbackIcon,
} from '@mui/icons-material';

interface RightSidebarProps {
  open: boolean;
  width?: number;
  onClose: () => void;
  onNavigateToLearning?: () => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  open,
  width = 320,
  onClose,
  onNavigateToLearning,
}) => {
  const [darkMode, setDarkMode] = React.useState(false);
  const [autoSave, setAutoSave] = React.useState(true);
  const [notifications, setNotifications] = React.useState(true);

  interface MenuItem {
    icon: React.ReactNode;
    text: string;
    badge: string | null;
    action?: string;
  }

  interface MenuSection {
    section: string;
    items: MenuItem[];
  }

  const menuItems: MenuSection[] = [
    {
      section: '表示設定',
      items: [
        { icon: <PaletteIcon />, text: 'テーマ設定', badge: null },
        { icon: <LanguageIcon />, text: '言語設定', badge: 'JP' },
      ],
    },
    {
      section: 'システム設定',
      items: [
        { icon: <SpeedIcon />, text: 'パフォーマンス', badge: null },
        { icon: <SecurityIcon />, text: 'セキュリティ', badge: null },
        { icon: <NotificationsIcon />, text: '通知設定', badge: '3' },
      ],
    },
    {
      section: 'サポート',
      items: [
        { icon: <HelpIcon />, text: 'ヘルプ', badge: null },
        { icon: <InfoIcon />, text: 'バージョン情報', badge: 'v1.0.0' },
        { icon: <FeedbackIcon />, text: 'フィードバック', badge: null },
      ],
    },
    {
      section: '学習',
      items: [
        { icon: <SettingsIcon />, text: 'React & CSS 学習', badge: 'NEW', action: 'learning' },
      ],
    },
  ];

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width,
          boxSizing: 'border-box',
          borderLeft: '1px solid #e5e7eb',
          background: 'linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)',
          boxShadow: '-4px 0 6px -1px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <Toolbar />
      
      <Box sx={{ overflow: 'auto' }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#111827', mb: 3 }}>
            設定・ツール
          </Typography>

          {/* クイック設定 */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle2" sx={{ color: '#6b7280', mb: 2 }}>
              クイック設定
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={darkMode}
                    onChange={(e) => setDarkMode(e.target.checked)}
                    color="primary"
                  />
                }
                label="ダークモード"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={autoSave}
                    onChange={(e) => setAutoSave(e.target.checked)}
                    color="primary"
                  />
                }
                label="自動保存"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={notifications}
                    onChange={(e) => setNotifications(e.target.checked)}
                    color="primary"
                  />
                }
                label="通知を受け取る"
              />
            </Box>
          </Box>
        </Box>

        <Divider />

        {/* メニュー項目 */}
        {menuItems.map((section, sectionIndex) => (
          <React.Fragment key={sectionIndex}>
            <Box sx={{ px: 3, py: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: '#6b7280',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {section.section}
              </Typography>
            </Box>
            
            <List sx={{ py: 0 }}>
              {section.items.map((item, itemIndex) => (
                <ListItem key={itemIndex} disablePadding>
                  <ListItemButton
                    sx={{
                      px: 3,
                      py: 1.5,
                      '&:hover': {
                        backgroundColor: 'rgba(59, 130, 246, 0.05)',
                      },
                    }}
                    onClick={() => {
                      if (item.action === 'learning' && onNavigateToLearning) {
                        onNavigateToLearning();
                      }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40, color: '#6b7280' }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontSize: '0.875rem',
                        color: '#374151',
                      }}
                    />
                    {item.badge && (
                      <Box
                        sx={{
                          px: 1.5,
                          py: 0.5,
                          backgroundColor: item.badge === '3' ? '#fef3c7' : 
                                         item.badge === 'NEW' ? '#dcfce7' : '#e5e7eb',
                          color: item.badge === '3' ? '#92400e' : 
                                 item.badge === 'NEW' ? '#166534' : '#6b7280',
                          borderRadius: 3,
                          fontSize: '0.75rem',
                          fontWeight: 500,
                        }}
                      >
                        {item.badge}
                      </Box>
                    )}
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            
            {sectionIndex < menuItems.length - 1 && <Divider sx={{ mt: 1, mb: 1 }} />}
          </React.Fragment>
        ))}
      </Box>
    </Drawer>
  );
};