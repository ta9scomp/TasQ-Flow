import React from 'react';
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Avatar,
  Chip,
  Divider,
  Alert,
  Tooltip,
} from '@mui/material';
import Grid2 from '@mui/material/Grid2';

import {
  Group as GroupIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
  Settings as SettingsIcon,
  Speed as SpeedIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Visibility as ViewIcon,
  VisibilityOff as HideIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { sampleMembers } from '../../data/sampleData';
import type { Member } from '../../types/task';
import { PerformanceTestPanel } from '../PerformanceTest/PerformanceTestPanel';
import { PerformanceOptimizationSettings } from '../PerformanceTest/PerformanceOptimizationSettings';

interface ProjectSettingsTabProps {
  currentUser?: string;
  userPermissions?: string[];
}

interface ProjectSettings {
  name: string;
  description: string;
  defaultTaskColor: string;
  autoColorCorrection: boolean;
  enableTaskFogs: boolean;
  enableChecklistHistory: boolean;
  defaultPriority: number;
  heatmapVisible: boolean;
  heatmapCapacityDisplay: boolean;
  maxSearchHistory: number;
  enableConflictDetection: boolean;
  lightModeOnMobile: boolean;
}

export const ProjectSettingsTab: React.FC<ProjectSettingsTabProps> = ({
  currentUser = '田中太郎',
  userPermissions = ['admin'],
}) => {
  const [selectedTab, setSelectedTab] = React.useState(0);
  const [members, setMembers] = React.useState<Member[]>(sampleMembers);
  const [addMemberOpen, setAddMemberOpen] = React.useState(false);
  const [editMemberOpen, setEditMemberOpen] = React.useState(false);
  const [selectedMember, setSelectedMember] = React.useState<Member | null>(null);
  const [newMember, setNewMember] = React.useState<Partial<Member>>({
    name: '',
    role: 'member',
    color: '#2196F3',
    permissions: [],
    isActive: true,
  });

  const [projectSettings, setProjectSettings] = React.useState<ProjectSettings>({
    name: 'TasQ Flow プロジェクト',
    description: 'チームタスク管理プロジェクト',
    defaultTaskColor: '#2196F3',
    autoColorCorrection: true,
    enableTaskFogs: true,
    enableChecklistHistory: true,
    defaultPriority: 50,
    heatmapVisible: true,
    heatmapCapacityDisplay: true,
    maxSearchHistory: 5,
    enableConflictDetection: true,
    lightModeOnMobile: true,
  });

  const hasAdminAccess = userPermissions.includes('admin');

  const roles = [
    { value: 'admin', label: '管理者', icon: <AdminIcon /> },
    { value: 'leader', label: 'リーダー', icon: <SecurityIcon /> },
    { value: 'member', label: 'メンバー', icon: <PersonIcon /> },
    { value: 'viewer', label: '閲覧者', icon: <ViewIcon /> },
  ];

  const permissions = [
    { id: 'task_edit', label: 'タスク編集', category: 'task' },
    { id: 'task_delete', label: 'タスク削除', category: 'task' },
    { id: 'task_assign', label: 'タスク割当', category: 'task' },
    { id: 'member_manage', label: 'メンバー管理', category: 'admin' },
    { id: 'project_settings', label: 'プロジェクト設定', category: 'admin' },
    { id: 'history_view', label: '変更履歴閲覧', category: 'admin' },
    { id: 'color_manage', label: 'カラー管理', category: 'design' },
    { id: 'export_data', label: 'データエクスポート', category: 'data' },
  ];

  const colorPresets = [
    '#FF5252', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5',
    '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50',
    '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800',
    '#FF5722', '#795548', '#9E9E9E', '#607D8B', '#000000',
  ];

  const handleAddMember = () => {
    if (newMember.name && newMember.role && newMember.color) {
      const member: Member = {
        id: `member_${Date.now()}`,
        name: newMember.name,
        role: newMember.role as any,
        color: newMember.color,
        avatar: '',
        permissions: newMember.permissions || [],
        isActive: newMember.isActive ?? true,
      };
      setMembers(prev => [...prev, member]);
      setNewMember({
        name: '',
        role: 'member',
        color: '#2196F3',
        permissions: [],
        isActive: true,
      });
      setAddMemberOpen(false);
    }
  };

  const handleEditMember = () => {
    if (selectedMember) {
      setMembers(prev => prev.map(member => 
        member.id === selectedMember.id ? selectedMember : member
      ));
      setEditMemberOpen(false);
      setSelectedMember(null);
    }
  };

  const handleDeleteMember = (memberId: string) => {
    if (window.confirm('このメンバーを削除しますか？')) {
      setMembers(prev => prev.filter(member => member.id !== memberId));
    }
  };

  const getRoleIcon = (role: string) => {
    const roleConfig = roles.find(r => r.value === role);
    return roleConfig?.icon || <PersonIcon />;
  };

  const getRoleLabel = (role: string) => {
    const roleConfig = roles.find(r => r.value === role);
    return roleConfig?.label || role;
  };

  const getPermissionsByCategory = (category: string) => {
    return permissions.filter(p => p.category === category);
  };

  if (!hasAdminAccess) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          管理者権限が必要です。プロジェクト設定にアクセスできません。
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <SettingsIcon sx={{ mr: 1 }} />
        プロジェクトチーム設定
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={selectedTab}
          onChange={(_, newValue) => setSelectedTab(newValue)}
          variant="fullWidth"
        >
          <Tab label="メンバー管理" icon={<GroupIcon />} />
          <Tab label="権限設定" icon={<SecurityIcon />} />
          <Tab label="カラー管理" icon={<PaletteIcon />} />
          <Tab label="プロジェクト設定" icon={<SettingsIcon />} />
          <Tab label="パフォーマンス" icon={<SpeedIcon />} />
        </Tabs>
      </Paper>

      {/* メンバー管理タブ */}
      {selectedTab === 0 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">チームメンバー ({members.length}人)</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setAddMemberOpen(true)}
            >
              メンバー追加
            </Button>
          </Box>

          <Paper>
            <List>
              {members.map((member, index) => (
                <React.Fragment key={member.id}>
                  <ListItem>
                    <ListItemIcon>
                      <Avatar 
                        sx={{ bgcolor: member.color, width: 40, height: 40 }}
                        src={member.avatar}
                      >
                        {member.name.charAt(0)}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1">{member.name}</Typography>
                          <Chip
                            icon={getRoleIcon(member.role)}
                            label={getRoleLabel(member.role)}
                            size="small"
                            color={member.role === 'admin' ? 'error' : 'default'}
                          />
                          {!member.isActive && (
                            <Chip label="無効" size="small" color="warning" variant="outlined" />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            権限: {member.permissions.length}個
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                            {member.permissions.slice(0, 3).map(perm => (
                              <Chip 
                                key={perm} 
                                label={permissions.find(p => p.id === perm)?.label || perm}
                                size="small" 
                                variant="outlined" 
                              />
                            ))}
                            {member.permissions.length > 3 && (
                              <Chip 
                                label={`+${member.permissions.length - 3}`}
                                size="small" 
                                variant="outlined" 
                              />
                            )}
                          </Box>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        onClick={() => {
                          setSelectedMember(member);
                          setEditMemberOpen(true);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteMember(member.id)}
                        disabled={member.name === currentUser}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < members.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Box>
      )}

      {/* 権限設定タブ */}
      {selectedTab === 1 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 3 }}>権限マトリックス</Typography>
          
          <Paper sx={{ overflow: 'auto' }}>
            <Box sx={{ minWidth: 800, p: 2 }}>
              <Grid2 container spacing={2}>
                <Grid2 size={3}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    メンバー
                  </Typography>
                </Grid2>
                {['task', 'admin', 'design', 'data'].map(category => (
                  <Grid2 size={2} key={category}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                      {category === 'task' && 'タスク'}
                      {category === 'admin' && '管理'}
                      {category === 'design' && 'デザイン'}
                      {category === 'data' && 'データ'}
                    </Typography>
                  </Grid2>
                ))}
              </Grid2>
              
              <Divider sx={{ my: 2 }} />
              
              {members.map(member => (
                <Grid2 container spacing={2} key={member.id} sx={{ mb: 2 }}>
                  <Grid2 size={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ bgcolor: member.color, width: 24, height: 24, fontSize: '0.8rem' }}>
                        {member.name.charAt(0)}
                      </Avatar>
                      <Typography variant="body2">{member.name}</Typography>
                    </Box>
                  </Grid2>
                  {['task', 'admin', 'design', 'data'].map(category => (
                    <Grid2 size={2} key={category}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        {getPermissionsByCategory(category).map(permission => (
                          <FormControlLabel
                            key={permission.id}
                            control={
                              <Switch
                                size="small"
                                checked={member.permissions.includes(permission.id)}
                                onChange={(e) => {
                                  const updatedMembers = members.map(m => {
                                    if (m.id === member.id) {
                                      if (e.target.checked) {
                                        return { ...m, permissions: [...m.permissions, permission.id] };
                                      } else {
                                        return { ...m, permissions: m.permissions.filter(p => p !== permission.id) };
                                      }
                                    }
                                    return m;
                                  });
                                  setMembers(updatedMembers);
                                }}
                              />
                            }
                            label={<Typography variant="caption">{permission.label}</Typography>}
                          />
                        ))}
                      </Box>
                    </Grid2>
                  ))}
                </Grid2>
              ))}
            </Box>
          </Paper>
        </Box>
      )}

      {/* カラー管理タブ */}
      {selectedTab === 2 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 3 }}>カラー設定</Typography>
          
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>カラープリセット</Typography>
            <Grid2 container spacing={1}>
              {colorPresets.map(color => (
                <Grid2 key={color}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: color,
                      borderRadius: 1,
                      cursor: 'pointer',
                      border: '2px solid transparent',
                      '&:hover': {
                        border: '2px solid #000',
                      },
                    }}
                    onClick={() => setProjectSettings(prev => ({ ...prev, defaultTaskColor: color }))}
                  />
                </Grid2>
              ))}
            </Grid2>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>メンバーカラー</Typography>
            <List>
              {members.map(member => (
                <ListItem key={member.id}>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: member.color, width: 32, height: 32 }}>
                      {member.name.charAt(0)}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText primary={member.name} />
                  <ListItemSecondaryAction>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {colorPresets.slice(0, 8).map(color => (
                        <Box
                          key={color}
                          sx={{
                            width: 24,
                            height: 24,
                            bgcolor: color,
                            borderRadius: '50%',
                            cursor: 'pointer',
                            border: member.color === color ? '2px solid #000' : '1px solid #ccc',
                          }}
                          onClick={() => {
                            setMembers(prev => prev.map(m => 
                              m.id === member.id ? { ...m, color } : m
                            ));
                          }}
                        />
                      ))}
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
      )}

      {/* プロジェクト設定タブ */}
      {selectedTab === 3 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 3 }}>プロジェクト設定</Typography>
          
          <Paper sx={{ p: 3 }}>
            <Grid2 container spacing={3}>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="プロジェクト名"
                  value={projectSettings.name}
                  onChange={(e) => setProjectSettings(prev => ({ ...prev, name: e.target.value }))}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="デフォルト優先度"
                  type="number"
                  value={projectSettings.defaultPriority}
                  onChange={(e) => setProjectSettings(prev => ({ ...prev, defaultPriority: parseInt(e.target.value) }))}
                  inputProps={{ min: 0, max: 100 }}
                />
              </Grid2>
              <Grid2 size={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="プロジェクト説明"
                  value={projectSettings.description}
                  onChange={(e) => setProjectSettings(prev => ({ ...prev, description: e.target.value }))}
                />
              </Grid2>
              
              <Grid2 size={12}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>機能設定</Typography>
                <Grid2 container spacing={2}>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={projectSettings.autoColorCorrection}
                          onChange={(e) => setProjectSettings(prev => ({ ...prev, autoColorCorrection: e.target.checked }))}
                        />
                      }
                      label="自動カラー補正"
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={projectSettings.enableTaskFogs}
                          onChange={(e) => setProjectSettings(prev => ({ ...prev, enableTaskFogs: e.target.checked }))}
                        />
                      }
                      label="タスクフォグ機能"
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={projectSettings.enableChecklistHistory}
                          onChange={(e) => setProjectSettings(prev => ({ ...prev, enableChecklistHistory: e.target.checked }))}
                        />
                      }
                      label="チェックリスト履歴"
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={projectSettings.heatmapVisible}
                          onChange={(e) => setProjectSettings(prev => ({ ...prev, heatmapVisible: e.target.checked }))}
                        />
                      }
                      label="ヒートマップ表示"
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={projectSettings.enableConflictDetection}
                          onChange={(e) => setProjectSettings(prev => ({ ...prev, enableConflictDetection: e.target.checked }))}
                        />
                      }
                      label="競合検知"
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 6 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={projectSettings.lightModeOnMobile}
                          onChange={(e) => setProjectSettings(prev => ({ ...prev, lightModeOnMobile: e.target.checked }))}
                        />
                      }
                      label="モバイル時ライトモード"
                    />
                  </Grid2>
                </Grid2>
              </Grid2>

              <Grid2 size={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button variant="outlined" startIcon={<CancelIcon />}>
                    キャンセル
                  </Button>
                  <Button variant="contained" startIcon={<SaveIcon />}>
                    設定を保存
                  </Button>
                </Box>
              </Grid2>
            </Grid2>
          </Paper>
        </Box>
      )}

      {/* パフォーマンステストタブ */}
      {selectedTab === 4 && (
        <Box>
          <Grid2 container spacing={3}>
            <Grid2 size={12}>
              <PerformanceTestPanel />
            </Grid2>
            <Grid2 size={12}>
              <PerformanceOptimizationSettings 
                onSettingsChange={(settings) => {
                  console.log('Performance settings changed:', settings);
                }}
              />
            </Grid2>
          </Grid2>
        </Box>
      )}

      {/* メンバー追加ダイアログ */}
      <Dialog open={addMemberOpen} onClose={() => setAddMemberOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>新しいメンバーを追加</DialogTitle>
        <DialogContent>
          <Grid2 container spacing={2} sx={{ mt: 1 }}>
            <Grid2 size={12}>
              <TextField
                fullWidth
                label="名前"
                value={newMember.name}
                onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>役割</InputLabel>
                <Select
                  value={newMember.role}
                  onChange={(e) => setNewMember(prev => ({ ...prev, role: e.target.value }))}
                >
                  {roles.map(role => (
                    <MenuItem key={role.value} value={role.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {role.icon}
                        {role.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="カラー"
                type="color"
                value={newMember.color}
                onChange={(e) => setNewMember(prev => ({ ...prev, color: e.target.value }))}
              />
            </Grid2>
          </Grid2>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddMemberOpen(false)}>キャンセル</Button>
          <Button onClick={handleAddMember} variant="contained">追加</Button>
        </DialogActions>
      </Dialog>

      {/* メンバー編集ダイアログ */}
      <Dialog open={editMemberOpen} onClose={() => setEditMemberOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>メンバー編集</DialogTitle>
        <DialogContent>
          {selectedMember && (
            <Grid2 container spacing={2} sx={{ mt: 1 }}>
              <Grid2 size={12}>
                <TextField
                  fullWidth
                  label="名前"
                  value={selectedMember.name}
                  onChange={(e) => setSelectedMember(prev => prev ? { ...prev, name: e.target.value } : null)}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>役割</InputLabel>
                  <Select
                    value={selectedMember.role}
                    onChange={(e) => setSelectedMember(prev => prev ? { ...prev, role: e.target.value as any } : null)}
                  >
                    {roles.map(role => (
                      <MenuItem key={role.value} value={role.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {role.icon}
                          {role.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="カラー"
                  type="color"
                  value={selectedMember.color}
                  onChange={(e) => setSelectedMember(prev => prev ? { ...prev, color: e.target.value } : null)}
                />
              </Grid2>
              <Grid2 size={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={selectedMember.isActive}
                      onChange={(e) => setSelectedMember(prev => prev ? { ...prev, isActive: e.target.checked } : null)}
                    />
                  }
                  label="アクティブ"
                />
              </Grid2>
            </Grid2>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditMemberOpen(false)}>キャンセル</Button>
          <Button onClick={handleEditMember} variant="contained">保存</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};