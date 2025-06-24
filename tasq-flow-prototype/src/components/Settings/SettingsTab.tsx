import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  Divider,
  Grid,
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
} from '@mui/material';

import {
  Palette as PaletteIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Code as CodeIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';

export const SettingsTab: React.FC = () => {
  const [settings, setSettings] = React.useState({
    // 表示設定
    lightweightMode: false,
    autoColorCorrection: true,
    showHeatmap: false,
    animationsEnabled: true,
    
    // 検索設定
    searchHistoryCount: 5,
    enableSearchSuggestions: true,
    
    // 通知設定
    desktopNotifications: true,
    emailNotifications: false,
    taskDeadlineNotifications: true,
    taskAssignmentNotifications: true,
    
    // プライバシー設定
    defaultTaskVisibility: 'public', // public, period, private
    
    // 開発者設定
    showDebugInfo: false,
    enableExperimentalFeatures: false,
  });

  const [colorPresets, setColorPresets] = React.useState([
    { name: 'パステル', colors: ['#FFE082', '#FFAB91', '#F8BBD9', '#E1BEE7'] },
    { name: 'ビビッド', colors: ['#FF5722', '#FF9800', '#E91E63', '#9C27B0'] },
    { name: '色覚対応', colors: ['#1976D2', '#388E3C', '#F57C00', '#7B1FA2'] },
  ]);

  const [newPresetDialog, setNewPresetDialog] = React.useState(false);
  const [newPresetName, setNewPresetName] = React.useState('');

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = () => {
    // 設定を保存
    localStorage.setItem('tasq-flow-settings', JSON.stringify(settings));
    alert('設定を保存しました');
  };

  const handleResetSettings = () => {
    if (confirm('設定をリセットしますか？')) {
      setSettings({
        lightweightMode: false,
        autoColorCorrection: true,
        showHeatmap: false,
        animationsEnabled: true,
        searchHistoryCount: 5,
        enableSearchSuggestions: true,
        desktopNotifications: true,
        emailNotifications: false,
        taskDeadlineNotifications: true,
        taskAssignmentNotifications: true,
        defaultTaskVisibility: 'public',
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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        設定
      </Typography>

      <Grid container spacing={3}>
        {/* 表示設定 */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              avatar={<PaletteIcon />}
              title="表示設定"
              subheader="UIの見た目と動作を設定"
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
        </Grid>

        {/* 検索設定 */}
        <Grid item xs={12} md={6}>
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
        </Grid>

        {/* 通知設定 */}
        <Grid item xs={12} md={6}>
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
        </Grid>

        {/* プライバシー設定 */}
        <Grid item xs={12} md={6}>
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
        </Grid>

        {/* カラープリセット管理 */}
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="カラープリセット管理"
              subheader="チーム全体で使用するカラーテーマ"
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
        </Grid>

        {/* 開発者設定 */}
        <Grid item xs={12}>
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
        </Grid>

        {/* 保存・リセットボタン */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
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
        </Grid>
      </Grid>

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