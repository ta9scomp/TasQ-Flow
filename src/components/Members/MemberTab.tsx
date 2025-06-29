import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Switch,
  FormControlLabel,
  Tooltip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Button,
} from '@mui/material';
import Grid from '@mui/material/Grid';

import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Add as AddIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import type { Member, Task } from '../../types/task';
import { sampleMembers, sampleTasks } from '../../data/sampleData';
import { MemberHeatmap } from './MemberHeatmap';

interface MemberTabProps {
  members?: Member[];
  tasks?: Task[];
}

export const MemberTab: React.FC<MemberTabProps> = ({
  members = sampleMembers,
  tasks = sampleTasks,
}) => {
  const [showHeatmap, setShowHeatmap] = React.useState(false);
  const [selectedHeatmapMember, setSelectedHeatmapMember] = React.useState<string>(members[0]?.id || '');
  const [visibleMembers, setVisibleMembers] = React.useState<Set<string>>(
    new Set(members.map(m => m.id))
  );

  const toggleMemberVisibility = (memberId: string) => {
    const newVisible = new Set(visibleMembers);
    if (newVisible.has(memberId)) {
      newVisible.delete(memberId);
    } else {
      newVisible.add(memberId);
    }
    setVisibleMembers(newVisible);
  };

  const getMemberTasks = (memberName: string) => {
    return tasks.filter(task => task.assignees.includes(memberName));
  };

  const getWorkloadPercentage = (memberName: string) => {
    const memberTasks = getMemberTasks(memberName);
    const totalTasks = memberTasks.length;
    const inProgressTasks = memberTasks.filter(task => task.status === 'inProgress').length;
    
    // 簡単な稼働率計算（実際の実装ではより詳細な計算が必要）
    return Math.min(100, (totalTasks * 20) + (inProgressTasks * 10));
  };

  const getHeatmapColor = (percentage: number) => {
    if (percentage === 0) return 'transparent';
    if (percentage <= 25) return 'rgba(76, 175, 80, 0.3)';
    if (percentage <= 50) return 'rgba(255, 193, 7, 0.5)';
    if (percentage <= 75) return 'rgba(255, 152, 0, 0.7)';
    return 'rgba(244, 67, 54, 0.9)';
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'owner': return 'オーナー';
      case 'admin': return '管理者';
      case 'member': return 'メンバー';
      case 'viewer': return '閲覧者';
      default: return role;
    }
  };

  // ヒートマップ表示時は専用コンポーネントを使用
  if (showHeatmap) {
    return (
      <Box>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
          <Typography variant="h5">
            メンバー稼働状況
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={showHeatmap}
                onChange={(e) => setShowHeatmap(e.target.checked)}
              />
            }
            label="リスト表示に戻る"
          />
        </Box>
        <MemberHeatmap 
          members={members}
          tasks={tasks}
          selectedMember={selectedHeatmapMember}
          onMemberSelect={setSelectedHeatmapMember}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          メンバー管理
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={showHeatmap}
                onChange={(e) => setShowHeatmap(e.target.checked)}
              />
            }
            label="ヒートマップ表示"
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {/* TODO: メンバー追加ダイアログ */}}
          >
            メンバー追加
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* メンバー一覧 */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              チームメンバー
            </Typography>
            <List>
              {members.map((member) => (
                <ListItem key={member.id}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: member.color }}>
                      {member.name[0]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={member.name}
                    secondary={
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.5 }}>
                        <Chip
                          label={getRoleLabel(member.role)}
                          size="small"
                          color={member.role === 'owner' ? 'error' : member.role === 'admin' ? 'warning' : 'default'}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {member.email}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Tooltip title={visibleMembers.has(member.id) ? '非表示' : '表示'}>
                        <IconButton
                          onClick={() => toggleMemberVisibility(member.id)}
                          color={visibleMembers.has(member.id) ? 'primary' : 'default'}
                        >
                          {visibleMembers.has(member.id) ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </IconButton>
                      </Tooltip>
                      <IconButton onClick={() => {/* TODO: メンバー編集 */}}>
                        <EditIcon />
                      </IconButton>
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* メンバー別タスク概要 */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              タスク割当状況
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {members
                .filter(member => visibleMembers.has(member.id))
                .map((member) => {
                  const memberTasks = getMemberTasks(member.name);
                  const workloadPercentage = getWorkloadPercentage(member.name);
                  
                  return (
                    <Box
                      key={member.id}
                      sx={{
                        p: 2,
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 1,
                        backgroundColor: showHeatmap ? getHeatmapColor(workloadPercentage) : 'transparent',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar sx={{ bgcolor: member.color, width: 32, height: 32, mr: 1 }}>
                          {member.name[0]}
                        </Avatar>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {member.name}
                        </Typography>
                        {showHeatmap && (
                          <Chip
                            label={`${workloadPercentage}%`}
                            size="small"
                            sx={{ ml: 'auto' }}
                          />
                        )}
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip
                          label={`全タスク: ${memberTasks.length}`}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          label={`進行中: ${memberTasks.filter(t => t.status === 'inProgress').length}`}
                          size="small"
                          color="warning"
                          variant="outlined"
                        />
                        <Chip
                          label={`完了: ${memberTasks.filter(t => t.status === 'completed').length}`}
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      </Box>

                      {/* 高優先度タスク */}
                      {memberTasks.filter(task => task.priority >= 80).length > 0 && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="caption" color="error">
                            高優先度タスク: {memberTasks.filter(task => task.priority >= 80).length}件
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  );
                })}
            </Box>
          </Paper>
        </Grid>

        {/* ヒートマップ説明 */}
        {showHeatmap && (
          <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                ヒートマップ凡例
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 20, height: 20, backgroundColor: 'rgba(76, 175, 80, 0.3)', border: 1, borderColor: 'divider' }} />
                  <Typography variant="caption">低稼働 (0-25%)</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 20, height: 20, backgroundColor: 'rgba(255, 193, 7, 0.5)', border: 1, borderColor: 'divider' }} />
                  <Typography variant="caption">中稼働 (26-50%)</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 20, height: 20, backgroundColor: 'rgba(255, 152, 0, 0.7)', border: 1, borderColor: 'divider' }} />
                  <Typography variant="caption">高稼働 (51-75%)</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 20, height: 20, backgroundColor: 'rgba(244, 67, 54, 0.9)', border: 1, borderColor: 'divider' }} />
                  <Typography variant="caption">過負荷 (76-100%)</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};