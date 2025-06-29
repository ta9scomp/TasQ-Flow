import React from 'react';
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Divider,
  Card,
  CardContent,
  CardHeader,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  TextField,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
} from '@mui/material';
import Grid from '@mui/material/Grid';

import {
  AdminPanelSettings as AdminIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  People as PeopleIcon,
  Security as SecurityIcon,
  Analytics as AnalyticsIcon,
  BugReport as BugIcon,
  ExpandMore as ExpandMoreIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'member';
  lastActive: Date;
  status: 'active' | 'inactive' | 'suspended';
}

interface SystemLog {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error';
  message: string;
  user?: string;
  action?: string;
}

interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  rolloutPercentage: number;
}

export const AdminSettings: React.FC = () => {
  const [users, setUsers] = React.useState<User[]>([
    { id: '1', name: '田中太郎', email: 'tanaka@example.com', role: 'admin', lastActive: new Date(), status: 'active' },
    { id: '2', name: '佐藤花子', email: 'sato@example.com', role: 'manager', lastActive: new Date(), status: 'active' },
    { id: '3', name: '鈴木次郎', email: 'suzuki@example.com', role: 'member', lastActive: new Date(), status: 'inactive' },
  ]);

  const [systemLogs, setSystemLogs] = React.useState<SystemLog[]>([
    { id: '1', timestamp: new Date(), level: 'info', message: 'ユーザーログイン', user: '田中太郎', action: 'login' },
    { id: '2', timestamp: new Date(), level: 'warning', message: 'タスク同期エラーが発生しました', action: 'sync_error' },
    { id: '3', timestamp: new Date(), level: 'error', message: 'データベース接続エラー', action: 'db_error' },
  ]);

  const [featureFlags, setFeatureFlags] = React.useState<FeatureFlag[]>([
    { id: '1', name: 'newGanttRenderer', description: '新しいガントチャートレンダラー', enabled: false, rolloutPercentage: 0 },
    { id: '2', name: 'realTimeSync', description: 'リアルタイム同期機能', enabled: true, rolloutPercentage: 100 },
    { id: '3', name: 'aiTaskSuggestions', description: 'AIタスク提案機能', enabled: false, rolloutPercentage: 10 },
  ]);

  const [systemSettings, setSystemSettings] = React.useState({
    maintenanceMode: false,
    allowGuestAccess: false,
    maxUsersPerTeam: 50,
    sessionTimeoutMinutes: 480,
    autoBackupEnabled: true,
    logRetentionDays: 30,
  });

  const [newUserDialog, setNewUserDialog] = React.useState(false);
  const [newUser, setNewUser] = React.useState<{
    name: string;
    email: string;
    role: User['role'];
  }>({
    name: '',
    email: '',
    role: 'member',
  });

  const handleUserRoleChange = (userId: string, newRole: User['role']) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  // const handleUserStatusChange = (userId: string, newStatus: User['status']) => {
  //   setUsers(prev => prev.map(user => 
  //     user.id === userId ? { ...user, status: newStatus } : user
  //   ));
  // };

  const handleFeatureFlagToggle = (flagId: string, enabled: boolean) => {
    setFeatureFlags(prev => prev.map(flag => 
      flag.id === flagId ? { ...flag, enabled } : flag
    ));
  };

  const handleFeatureFlagRollout = (flagId: string, percentage: number) => {
    setFeatureFlags(prev => prev.map(flag => 
      flag.id === flagId ? { ...flag, rolloutPercentage: percentage } : flag
    ));
  };

  const addNewUser = () => {
    if (newUser.name && newUser.email) {
      const user: User = {
        id: Date.now().toString(),
        ...newUser,
        lastActive: new Date(),
        status: 'active',
      };
      setUsers(prev => [...prev, user]);
      setNewUser({ name: '', email: '', role: 'member' });
      setNewUserDialog(false);
    }
  };

  const deleteUser = (userId: string) => {
    if (confirm('このユーザーを削除しますか？')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
    }
  };

  const exportSystemData = () => {
    const data = {
      users,
      systemLogs,
      featureFlags,
      systemSettings,
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasq-flow-admin-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearLogs = () => {
    if (confirm('すべてのログを削除しますか？')) {
      setSystemLogs([]);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AdminIcon />
        管理者設定
      </Typography>

      <Alert severity="warning" sx={{ mb: 3 }}>
        この画面は管理者のみアクセス可能です。設定変更はシステム全体に影響します。
      </Alert>

      <Grid container spacing={3}>
        {/* システム設定 */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardHeader
              avatar={<SecurityIcon />}
              title="システム設定"
              subheader="全体的なシステム設定"
            />
            <CardContent>
              <FormControlLabel
                control={
                  <Switch
                    checked={systemSettings.maintenanceMode}
                    onChange={(e) => setSystemSettings(prev => ({
                      ...prev, maintenanceMode: e.target.checked
                    }))}
                  />
                }
                label="メンテナンスモード"
              />
              <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 2 }}>
                有効にするとシステムを一時的に利用停止
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={systemSettings.allowGuestAccess}
                    onChange={(e) => setSystemSettings(prev => ({
                      ...prev, allowGuestAccess: e.target.checked
                    }))}
                  />
                }
                label="ゲストアクセス許可"
              />
              <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 2 }}>
                未登録ユーザーの閲覧を許可
              </Typography>

              <TextField
                fullWidth
                label="チーム最大ユーザー数"
                type="number"
                value={systemSettings.maxUsersPerTeam}
                onChange={(e) => setSystemSettings(prev => ({
                  ...prev, maxUsersPerTeam: parseInt(e.target.value)
                }))}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="セッションタイムアウト（分）"
                type="number"
                value={systemSettings.sessionTimeoutMinutes}
                onChange={(e) => setSystemSettings(prev => ({
                  ...prev, sessionTimeoutMinutes: parseInt(e.target.value)
                }))}
                sx={{ mb: 2 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={systemSettings.autoBackupEnabled}
                    onChange={(e) => setSystemSettings(prev => ({
                      ...prev, autoBackupEnabled: e.target.checked
                    }))}
                  />
                }
                label="自動バックアップ"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* システム監視 */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardHeader
              avatar={<AnalyticsIcon />}
              title="システム監視"
              subheader="現在のシステム状況"
            />
            <CardContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>CPU使用率</Typography>
                <LinearProgress variant="determinate" value={35} />
                <Typography variant="caption">35%</Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>メモリ使用率</Typography>
                <LinearProgress variant="determinate" value={62} color="warning" />
                <Typography variant="caption">62%</Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>ディスク使用率</Typography>
                <LinearProgress variant="determinate" value={28} color="success" />
                <Typography variant="caption">28%</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2" gutterBottom>アクティブユーザー</Typography>
              <Typography variant="h6" color="primary">
                {users.filter(u => u.status === 'active').length} / {users.length}
              </Typography>

              <Button
                fullWidth
                startIcon={<RefreshIcon />}
                sx={{ mt: 2 }}
                onClick={() => window.location.reload()}
              >
                ステータス更新
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* ユーザー管理 */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader
              avatar={<PeopleIcon />}
              title="ユーザー管理"
              subheader="システムユーザーの管理"
              action={
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => setNewUserDialog(true)}
                >
                  ユーザー追加
                </Button>
              }
            />
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>名前</TableCell>
                      <TableCell>メール</TableCell>
                      <TableCell>役割</TableCell>
                      <TableCell>ステータス</TableCell>
                      <TableCell>最終アクセス</TableCell>
                      <TableCell>操作</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <FormControl size="small" sx={{ minWidth: 100 }}>
                            <Select
                              value={user.role}
                              onChange={(e) => handleUserRoleChange(user.id, e.target.value as User['role'])}
                            >
                              <MenuItem value="admin">管理者</MenuItem>
                              <MenuItem value="manager">マネージャー</MenuItem>
                              <MenuItem value="member">メンバー</MenuItem>
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={user.status === 'active' ? 'アクティブ' : user.status === 'inactive' ? '非アクティブ' : '停止中'}
                            color={user.status === 'active' ? 'success' : user.status === 'inactive' ? 'default' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{user.lastActive.toLocaleDateString()}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => deleteUser(user.id)} size="small">
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* 機能フラグ管理 */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader
              title="機能フラグ管理"
              subheader="実験的機能の段階的リリース"
            />
            <CardContent>
              {featureFlags.map((flag) => (
                <Accordion key={flag.id}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <Typography sx={{ flex: 1 }}>{flag.name}</Typography>
                      <Chip
                        label={flag.enabled ? 'ON' : 'OFF'}
                        color={flag.enabled ? 'success' : 'default'}
                        size="small"
                        sx={{ mr: 2 }}
                      />
                      <Typography variant="caption" sx={{ mr: 2 }}>
                        {flag.rolloutPercentage}%
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {flag.description}
                    </Typography>
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={flag.enabled}
                          onChange={(e) => handleFeatureFlagToggle(flag.id, e.target.checked)}
                        />
                      }
                      label="機能を有効化"
                    />

                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" gutterBottom>
                        ロールアウト率: {flag.rolloutPercentage}%
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ flex: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={flag.rolloutPercentage} 
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                        </Box>
                        <TextField
                          type="number"
                          size="small"
                          value={flag.rolloutPercentage}
                          onChange={(e) => handleFeatureFlagRollout(flag.id, parseInt(e.target.value))}
                          inputProps={{ min: 0, max: 100 }}
                          sx={{ width: 80 }}
                        />
                      </Box>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* システムログ */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader
              avatar={<BugIcon />}
              title="システムログ"
              subheader="システムの動作ログと診断情報"
              action={
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button size="small" onClick={clearLogs}>
                    ログクリア
                  </Button>
                  <Button
                    size="small"
                    startIcon={<DownloadIcon />}
                    onClick={exportSystemData}
                  >
                    エクスポート
                  </Button>
                </Box>
              }
            />
            <CardContent>
              <List dense>
                {systemLogs.slice(0, 10).map((log) => (
                  <ListItem key={log.id}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            label={log.level.toUpperCase()}
                            size="small"
                            color={log.level === 'error' ? 'error' : log.level === 'warning' ? 'warning' : 'info'}
                          />
                          <Typography variant="body2">
                            {log.message}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {log.timestamp.toLocaleString()} {log.user && `- ${log.user}`}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 新規ユーザー追加ダイアログ */}
      <Dialog open={newUserDialog} onClose={() => setNewUserDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>新規ユーザー追加</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="名前"
            fullWidth
            value={newUser.name}
            onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="メールアドレス"
            fullWidth
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth>
            <InputLabel>役割</InputLabel>
            <Select
              value={newUser.role}
              onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value as User['role'] }))}
              label="役割"
            >
              <MenuItem value="admin">管理者</MenuItem>
              <MenuItem value="manager">マネージャー</MenuItem>
              <MenuItem value="member">メンバー</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewUserDialog(false)}>キャンセル</Button>
          <Button onClick={addNewUser} variant="contained">追加</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};