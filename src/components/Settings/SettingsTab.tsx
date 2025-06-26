import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  Divider,
  Card,
  CardContent,
  CardHeader,
  Slider,
  TextField,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Tabs,
  Tab,
  Avatar,
  Badge,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import Grid2 from '@mui/material/Grid2';

import {
  Palette as PaletteIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Code as CodeIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
  Language as LanguageIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Sync as SyncIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
} from '@mui/icons-material';

import { AdminSettings } from './AdminSettings';

export const SettingsTab: React.FC = () => {
  const [currentTab, setCurrentTab] = React.useState(0);
  const [userProfile, setUserProfile] = React.useState({
    name: '田中太郎',
    email: 'tanaka@example.com',
    role: 'manager',
    avatar: '',
    bio: 'プロジェクトマネージャーとしてチームの進捗管理を担当',
  });

  const [settings, setSettings] = React.useState({
    // 表示設定
    theme: 'auto', // light, dark, auto
    lightweightMode: false,
    autoColorCorrection: true,
    showHeatmap: false,
    animationsEnabled: true,
    language: 'ja', // ja, en
    
    // 検索設定
    searchHistoryCount: 5,
    enableSearchSuggestions: true,
    
    // 通知設定
    desktopNotifications: true,
    emailNotifications: false,
    taskDeadlineNotifications: true,
    taskAssignmentNotifications: true,
    conflictNotifications: true,
    mentionNotifications: true,
    
    // プライバシー設定
    defaultTaskVisibility: 'public', // public, period, private
    showOnlineStatus: true,
    allowDirectMessages: true,
    
    // 同期設定
    autoSync: true,
    syncInterval: 30, // seconds
    offlineMode: false,
    
    // 開発者設定
    showDebugInfo: false,
    enableExperimentalFeatures: false,
  });

  const [colorPresets, setColorPresets] = React.useState([
    { name: 'パステル', colors: ['#FFE082', '#FFAB91', '#F8BBD9', '#E1BEE7'] },
    { name: 'ビビッド', colors: ['#FF5722', '#FF9800', '#E91E63', '#9C27B0'] },
    { name: '色覚対応', colors: ['#1976D2', '#388E3C', '#F57C00', '#7B1FA2'] },
  ]);

  const [isAdmin, setIsAdmin] = React.useState(false); // 実際のアプリではユーザー権限から取得

  const [newPresetDialog, setNewPresetDialog] = React.useState(false);
  const [newPresetName, setNewPresetName] = React.useState('');

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = () => {
    // 設定を保存
    localStorage.setItem('tasq-flow-settings', JSON.stringify(settings));
    localStorage.setItem('tasq-flow-profile', JSON.stringify(userProfile));
    alert('設定を保存しました');
  };

  const handleProfileUpdate = (field: string, value: string) => {
    setUserProfile(prev => ({ ...prev, [field]: value }));
  };

  const exportUserData = () => {
    const userData = {
      profile: userProfile,
      settings,
      colorPresets,
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasq-flow-user-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importUserData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (data.profile) setUserProfile(data.profile);
          if (data.settings) setSettings(data.settings);
          if (data.colorPresets) setColorPresets(data.colorPresets);
          alert('データをインポートしました');
        } catch (error) {
          alert('無効なファイル形式です');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleResetSettings = () => {
    if (confirm('設定をリセットしますか？')) {
      setSettings({
        theme: 'auto',
        lightweightMode: false,
        autoColorCorrection: true,
        showHeatmap: false,
        animationsEnabled: true,
        language: 'ja',
        searchHistoryCount: 5,
        enableSearchSuggestions: true,
        desktopNotifications: true,
        emailNotifications: false,
        taskDeadlineNotifications: true,
        taskAssignmentNotifications: true,
        conflictNotifications: true,
        mentionNotifications: true,
        defaultTaskVisibility: 'public',
        showOnlineStatus: true,
        allowDirectMessages: true,
        autoSync: true,
        syncInterval: 30,
        offlineMode: false,
        showDebugInfo: false,
        enableExperimentalFeatures: false,
      });
    }
  };

  const addColorPreset = () => {
    if (newPresetName.trim()) {
      setColorPresets(prev => [...prev, {
        name: newPresetName,
        colors: ['#FF5722', '#FF9800', '#E91E63', '#9C27B0'] // デフォルト色
      }]);
      setNewPresetName('');
      setNewPresetDialog(false);
    }
  };

  const deleteColorPreset = (index: number) => {
    setColorPresets(prev => prev.filter((_, i) => i !== index));
  };

  const tabLabels = ['プロフィール', '表示', '通知', 'プライバシー', '高度な設定'];
  if (isAdmin) {
    tabLabels.push('管理者');
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        設定
      </Typography>

      <Tabs 
        value={currentTab} 
        onChange={(_, newValue) => setCurrentTab(newValue)}
        sx={{ mb: 3 }}
        variant="scrollable"
        scrollButtons="auto"
      >
        {tabLabels.map((label, index) => (
          <Tab 
            key={index} 
            label={label} 
            icon={
              index === 0 ? <PersonIcon /> :
              index === 1 ? <PaletteIcon /> :
              index === 2 ? <NotificationsIcon /> :
              index === 3 ? <SecurityIcon /> :
              index === 4 ? <CodeIcon /> :
              <AdminIcon />
            }
          />
        ))}
      </Tabs>

      {/* プロフィールタブ */}
      {currentTab === 0 && (
        <Grid2 container spacing={3}>
          <Grid2 size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <IconButton
                      size="small"
                      sx={{
                        backgroundColor: 'primary.main',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'primary.dark',
                        },
                      }}
                    >
                      <UploadIcon fontSize="small" />
                    </IconButton>
                  }
                >
                  <Avatar
                    sx={{ width: 120, height: 120, mb: 2, mx: 'auto' }}
                    src={userProfile.avatar}
                  >
                    {userProfile.name.charAt(0)}
                  </Avatar>
                </Badge>
                <Typography variant="h6">{userProfile.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {userProfile.role === 'admin' ? '管理者' : 
                   userProfile.role === 'manager' ? 'マネージャー' : 'メンバー'}
                </Typography>
                <Chip
                  label="オンライン"
                  color="success"
                  size="small"
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </Card>
          </Grid2>
          
          <Grid2 size={{ xs: 12, md: 8 }}>
            <Card>
              <CardHeader title="基本情報" />
              <CardContent>
                <TextField
                  fullWidth
                  label="名前"
                  value={userProfile.name}
                  onChange={(e) => handleProfileUpdate('name', e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="メールアドレス"
                  type="email"
                  value={userProfile.email}
                  onChange={(e) => handleProfileUpdate('email', e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="自己紹介"
                  multiline
                  rows={3}
                  value={userProfile.bio}
                  onChange={(e) => handleProfileUpdate('bio', e.target.value)}
                  placeholder="あなたの役割や担当について簡単に説明してください"
                />
              </CardContent>
            </Card>
          </Grid2>
        </Grid2>
      )}

      {/* 表示設定タブ */}
      {currentTab === 1 && (

        <Grid2 container spacing={3}>
          {/* テーマ設定 */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Card>
              <CardHeader
                avatar={<PaletteIcon />}
                title="テーマ設定"
                subheader="アプリケーションの外観を設定"
              />
              <CardContent>
                <Typography gutterBottom>カラーテーマ</Typography>
                <ToggleButtonGroup
                  value={settings.theme}
                  exclusive
                  onChange={(_, value) => value && handleSettingChange('theme', value)}
                  fullWidth
                  sx={{ mb: 3 }}
                >
                  <ToggleButton value="light">
                    <LightModeIcon sx={{ mr: 1 }} />
                    ライト
                  </ToggleButton>
                  <ToggleButton value="dark">
                    <DarkModeIcon sx={{ mr: 1 }} />
                    ダーク
                  </ToggleButton>
                  <ToggleButton value="auto">
                    <SyncIcon sx={{ mr: 1 }} />
                    自動
                  </ToggleButton>
                </ToggleButtonGroup>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>言語</InputLabel>
                  <Select
                    value={settings.language}
                    onChange={(e) => handleSettingChange('language', e.target.value)}
                    label="言語"
                  >
                    <MenuItem value="ja">日本語</MenuItem>
                    <MenuItem value="en">English</MenuItem>
                  </Select>
                </FormControl>
              </CardContent>
            </Card>
          </Grid2>

          {/* パフォーマンス設定 */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Card>
              <CardHeader
                avatar={<SpeedIcon />}
                title="パフォーマンス設定"
                subheader="アプリケーションの動作を最適化"
              />
            <CardContent>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.lightweightMode}
                    onChange={(e) => handleSettingChange('lightweightMode', e.target.checked)}
                  />
                }
                label="軽量化モード"
              />
              <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 2 }}>
                アニメーションや光沢効果を無効にしてパフォーマンスを向上
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.autoColorCorrection}
                    onChange={(e) => handleSettingChange('autoColorCorrection', e.target.checked)}
                  />
                }
                label="自動カラー補正"
              />
              <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 2 }}>
                視認性を向上させるため色を自動調整
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.showHeatmap}
                    onChange={(e) => handleSettingChange('showHeatmap', e.target.checked)}
                  />
                }
                label="ヒートマップ表示"
              />
              <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 2 }}>
                メンバータブでヒートマップを表示
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.animationsEnabled}
                    onChange={(e) => handleSettingChange('animationsEnabled', e.target.checked)}
                  />
                }
                label="アニメーション"
              />
            </CardContent>
          </Card>
        </Grid2>

          {/* 検索設定 */}
          <Grid2 size={{ xs: 12, md: 6 }}>
          <Card>
            <CardHeader
              title="検索設定"
              subheader="検索機能の動作を設定"
            />
            <CardContent>
              <Typography gutterBottom>検索履歴保存件数</Typography>
              <Slider
                value={settings.searchHistoryCount}
                onChange={(_, value) => handleSettingChange('searchHistoryCount', value)}
                min={0}
                max={10}
                marks
                valueLabelDisplay="auto"
                sx={{ mb: 3 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.enableSearchSuggestions}
                    onChange={(e) => handleSettingChange('enableSearchSuggestions', e.target.checked)}
                  />
                }
                label="検索サジェスト"
              />
            </CardContent>
          </Card>
        </Grid2>
        </Grid2>
      )}

      {/* 通知設定タブ */}
      {currentTab === 2 && (
        <Grid2 container spacing={3}>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Card>
              <CardHeader
                avatar={<NotificationsIcon />}
                title="通知設定"
                subheader="各種通知の設定"
              />
              <CardContent>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.desktopNotifications}
                    onChange={(e) => handleSettingChange('desktopNotifications', e.target.checked)}
                  />
                }
                label="デスクトップ通知"
              />
              <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 2 }}>
                ブラウザの通知機能を使用
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.emailNotifications}
                    onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                  />
                }
                label="メール通知"
              />
              <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 2 }}>
                重要な更新をメールで受信
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.taskDeadlineNotifications}
                    onChange={(e) => handleSettingChange('taskDeadlineNotifications', e.target.checked)}
                  />
                }
                label="期限通知"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.taskAssignmentNotifications}
                    onChange={(e) => handleSettingChange('taskAssignmentNotifications', e.target.checked)}
                  />
                }
                label="アサイン通知"
              />
            </CardContent>
          </Card>
        </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <Card>
              <CardHeader
                title="リアルタイム通知"
                subheader="即座に受け取る通知の設定"
              />
              <CardContent>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.conflictNotifications}
                      onChange={(e) => handleSettingChange('conflictNotifications', e.target.checked)}
                    />
                  }
                  label="競合発生通知"
                />
                <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 2 }}>
                  同時編集による競合が発生した際に通知
                </Typography>

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.mentionNotifications}
                      onChange={(e) => handleSettingChange('mentionNotifications', e.target.checked)}
                    />
                  }
                  label="メンション通知"
                />
                <Typography variant="caption" display="block" color="text.secondary">
                  コメントで@メンションされた際に通知
                </Typography>
              </CardContent>
            </Card>
          </Grid2>
        </Grid2>
      )}

      {/* プライバシー設定タブ */}
      {currentTab === 3 && (
        <Grid2 container spacing={3}>
          <Grid2 size={{ xs: 12, md: 6 }}>
          <Card>
            <CardHeader
              avatar={<SecurityIcon />}
              title="プライバシー設定"
              subheader="タスクの公開範囲設定"
            />
            <CardContent>
              <FormControl fullWidth>
                <InputLabel>デフォルトタスク公開設定</InputLabel>
                <Select
                  value={settings.defaultTaskVisibility}
                  onChange={(e) => handleSettingChange('defaultTaskVisibility', e.target.value)}
                  label="デフォルトタスク公開設定"
                >
                  <MenuItem value="public">完全公開</MenuItem>
                  <MenuItem value="period">期間のみ公開</MenuItem>
                  <MenuItem value="private">完全非公開</MenuItem>
                </Select>
              </FormControl>
              <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                新しいタスク作成時のデフォルト設定
              </Typography>
            </CardContent>
          </Card>
        </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <Card>
              <CardHeader
                title="オンラインステータス"
                subheader="他のユーザーに対する可視性"
              />
              <CardContent>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.showOnlineStatus}
                      onChange={(e) => handleSettingChange('showOnlineStatus', e.target.checked)}
                    />
                  }
                  label="オンライン状態を表示"
                />
                <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 2 }}>
                  他のユーザーにあなたのオンライン状態を表示
                </Typography>

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.allowDirectMessages}
                      onChange={(e) => handleSettingChange('allowDirectMessages', e.target.checked)}
                    />
                  }
                  label="ダイレクトメッセージを許可"
                />
                <Typography variant="caption" display="block" color="text.secondary">
                  他のユーザーからの直接メッセージを受信
                </Typography>
              </CardContent>
            </Card>
          </Grid2>
        </Grid2>
      )}

      {/* 高度な設定タブ */}
      {currentTab === 4 && (
        <Grid2 container spacing={3}>
          {/* 同期設定 */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Card>
              <CardHeader
                avatar={<SyncIcon />}
                title="同期設定"
                subheader="データ同期の動作を設定"
              />
              <CardContent>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.autoSync}
                      onChange={(e) => handleSettingChange('autoSync', e.target.checked)}
                    />
                  }
                  label="自動同期"
                />
                <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 2 }}>
                  変更を自動的にサーバーと同期
                </Typography>

                <Typography gutterBottom>同期間隔（秒）</Typography>
                <Slider
                  value={settings.syncInterval}
                  onChange={(_, value) => handleSettingChange('syncInterval', value)}
                  min={5}
                  max={300}
                  step={5}
                  marks={[
                    { value: 5, label: '5s' },
                    { value: 30, label: '30s' },
                    { value: 60, label: '1m' },
                    { value: 300, label: '5m' },
                  ]}
                  valueLabelDisplay="auto"
                  sx={{ mb: 3 }}
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.offlineMode}
                      onChange={(e) => handleSettingChange('offlineMode', e.target.checked)}
                    />
                  }
                  label="オフラインモード"
                />
              </CardContent>
            </Card>
          </Grid2>

          {/* データ管理 */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Card>
              <CardHeader
                title="データ管理"
                subheader="設定とデータのバックアップ"
              />
              <CardContent>
                <Button
                  fullWidth
                  startIcon={<DownloadIcon />}
                  onClick={exportUserData}
                  sx={{ mb: 2 }}
                >
                  設定をエクスポート
                </Button>
                
                <Button
                  fullWidth
                  startIcon={<UploadIcon />}
                  component="label"
                  sx={{ mb: 2 }}
                >
                  設定をインポート
                  <input
                    type="file"
                    accept=".json"
                    hidden
                    onChange={importUserData}
                  />
                </Button>

                <Alert severity="info" sx={{ mt: 2 }}>
                  エクスポートした設定ファイルは他のデバイスでインポートできます。
                </Alert>
              </CardContent>
            </Card>
          </Grid2>

          {/* カラープリセット管理 */}
          <Grid2 size={12}>
            <Card>
              <CardHeader
                title="カラープリセット管理"
                subheader="個人用カラーテーマ"
                action={
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => setNewPresetDialog(true)}
                  >
                    追加
                  </Button>
                }
              />
              <CardContent>
                <List>
                  {colorPresets.map((preset, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={preset.name}
                        secondary={
                          <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                            {preset.colors.map((color, colorIndex) => (
                              <Box
                                key={colorIndex}
                                sx={{
                                  width: 20,
                                  height: 20,
                                  backgroundColor: color,
                                  borderRadius: '50%',
                                  border: '1px solid',
                                  borderColor: 'divider',
                                }}
                              />
                            ))}
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton onClick={() => deleteColorPreset(index)}>
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid2>

          {/* 開発者設定 */}
          <Grid2 size={12}>
            <Card>
              <CardHeader
                avatar={<CodeIcon />}
                title="開発者設定"
                subheader="デバッグと実験的機能"
              />
              <CardContent>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  これらの設定は開発者向けです。通常の使用では変更しないでください。
                </Alert>

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.showDebugInfo}
                      onChange={(e) => handleSettingChange('showDebugInfo', e.target.checked)}
                    />
                  }
                  label="デバッグ情報表示"
                />
                <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 2 }}>
                  コンソールにデバッグ情報を出力
                </Typography>

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.enableExperimentalFeatures}
                      onChange={(e) => handleSettingChange('enableExperimentalFeatures', e.target.checked)}
                    />
                  }
                  label="実験的機能"
                />
                <Typography variant="caption" display="block" color="text.secondary">
                  まだ安定していない新機能を有効化
                </Typography>
              </CardContent>
            </Card>
          </Grid2>
        </Grid2>
      )}

      {/* 管理者設定タブ */}
      {currentTab === 5 && isAdmin && (
        <AdminSettings />
      )}

      {/* 保存・リセットボタン（管理者タブ以外で表示） */}
      {currentTab !== 5 && (
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button
            variant="contained"
            onClick={handleSaveSettings}
            size="large"
          >
            設定を保存
          </Button>
          <Button
            variant="outlined"
            onClick={handleResetSettings}
            size="large"
          >
            リセット
          </Button>
        </Box>
      )}

      {/* カラープリセット追加ダイアログ */}
      <Dialog open={newPresetDialog} onClose={() => setNewPresetDialog(false)}>
        <DialogTitle>新しいカラープリセット</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="プリセット名"
            fullWidth
            value={newPresetName}
            onChange={(e) => setNewPresetName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewPresetDialog(false)}>キャンセル</Button>
          <Button onClick={addColorPreset} variant="contained">作成</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};