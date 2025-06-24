import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Avatar,
  LinearProgress,
} from '@mui/material';

import {
  Assignment as TaskIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  TrendingUp as TrendingUpIcon,
  AccessTime as TimeIcon,
  Flag as FlagIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { GanttChart } from '../GanttChart/GanttChart';
import { sampleTasks } from '../../data/sampleData';
import { sampleTaskFogs } from '../../data/sampleTaskFogs';
import { format, isToday, isTomorrow, isThisWeek, addDays, startOfDay } from 'date-fns';
import { ja } from 'date-fns/locale';

interface HomeScreenProps {
  currentUser?: string;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  currentUser = '田中太郎',
}) => {
  const today = new Date();
  const chartStartDate = startOfDay(today);
  const chartEndDate = addDays(chartStartDate, 30);

  // 個人のタスクをフィルタリング
  const personalTasks = sampleTasks.filter(task => 
    task.assignees.includes(currentUser)
  );

  // 個人のタスクフォグをフィルタリング
  const personalTaskFogs = sampleTaskFogs.filter(fog => 
    fog.userId === currentUser
  );

  // 今日のタスク
  const todayTasks = personalTasks.filter(task => 
    isToday(task.startDate) || isToday(task.endDate) ||
    (task.startDate <= today && task.endDate >= today)
  );

  // 今週のタスク
  const thisWeekTasks = personalTasks.filter(task => 
    isThisWeek(task.startDate) || isThisWeek(task.endDate)
  ).slice(0, 10);

  // 優先度の高いタスク
  const highPriorityTasks = personalTasks
    .filter(task => task.priority >= 80)
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 5);

  // 完了間近のタスク
  const upcomingDeadlines = personalTasks
    .filter(task => {
      const daysDiff = Math.ceil((task.endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff >= 0 && daysDiff <= 7 && task.status !== 'completed';
    })
    .sort((a, b) => a.endDate.getTime() - b.endDate.getTime())
    .slice(0, 5);

  // 統計情報
  const totalTasks = personalTasks.length;
  const completedTasks = personalTasks.filter(task => task.status === 'completed').length;
  const inProgressTasks = personalTasks.filter(task => task.status === 'inProgress').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const getPriorityColor = (priority: number) => {
    if (priority >= 80) return '#FF5252';
    if (priority >= 60) return '#FF9800';
    if (priority >= 40) return '#FFC107';
    return '#4CAF50';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'inProgress': return 'primary';
      case 'onHold': return 'warning';
      default: return 'default';
    }
  };

  const formatDate = (date: Date) => {
    if (isToday(date)) return '今日';
    if (isTomorrow(date)) return '明日';
    return format(date, 'M/d(E)', { locale: ja });
  };

  return (
    <Box sx={{ p: 3, bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* ヘッダー */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
          ダッシュボード
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {currentUser}さん、お疲れ様です。今日も一日頑張りましょう！
        </Typography>
      </Box>

      {/* 統計カード */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TaskIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">総タスク数</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {totalTasks}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">完了済み</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                {completedTasks}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon color="info" sx={{ mr: 1 }} />
                <Typography variant="h6">進行中</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                {inProgressTasks}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">完了率</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                {completionRate}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={completionRate} 
                sx={{ height: 8, borderRadius: 4 }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* 個人スケジュール（ガントチャート） */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <ScheduleIcon sx={{ mr: 1 }} />
              個人スケジュール（30日間）
            </Typography>
            <Box sx={{ height: 400 }}>
              <GanttChart
                tasks={personalTasks}
                startDate={chartStartDate}
                endDate={chartEndDate}
                taskFogs={personalTaskFogs}
                showTaskFogs={true}
              />
            </Box>
          </Paper>
        </Grid>

        {/* 今日のタスク */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <TimeIcon sx={{ mr: 1 }} />
              今日のタスク ({todayTasks.length}件)
            </Typography>
            <List sx={{ maxHeight: 300, overflow: 'auto' }}>
              {todayTasks.length > 0 ? (
                todayTasks.map((task) => (
                  <ListItem key={task.id} divider>
                    <ListItemIcon>
                      <Avatar 
                        sx={{ 
                          width: 24, 
                          height: 24, 
                          bgcolor: getPriorityColor(task.priority),
                          fontSize: '0.75rem'
                        }}
                      >
                        {task.priority}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={task.title}
                      secondary={
                        <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                          <Chip
                            label={task.status === 'completed' ? '完了' : task.status === 'inProgress' ? '進行中' : task.status === 'onHold' ? '保留' : '未着手'}
                            size="small"
                            color={getStatusColor(task.status) as any}
                            variant="outlined"
                          />
                          <Chip
                            label={`${formatDate(task.startDate)} - ${formatDate(task.endDate)}`}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                ))
              ) : (
                <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                  今日のタスクはありません
                </Typography>
              )}
            </List>
          </Paper>
        </Grid>

        {/* 完了間近のタスク */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <FlagIcon sx={{ mr: 1 }} />
              完了間近のタスク (7日以内)
            </Typography>
            <List sx={{ maxHeight: 300, overflow: 'auto' }}>
              {upcomingDeadlines.length > 0 ? (
                upcomingDeadlines.map((task) => (
                  <ListItem key={task.id} divider>
                    <ListItemIcon>
                      <Avatar 
                        sx={{ 
                          width: 24, 
                          height: 24, 
                          bgcolor: '#FF5252',
                          fontSize: '0.75rem'
                        }}
                      >
                        {Math.ceil((task.endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={task.title}
                      secondary={
                        <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                          <Chip
                            label={`期限: ${formatDate(task.endDate)}`}
                            size="small"
                            color="error"
                            variant="outlined"
                          />
                          <Chip
                            label={`優先度: ${task.priority}`}
                            size="small"
                            sx={{ bgcolor: getPriorityColor(task.priority), color: 'white' }}
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                ))
              ) : (
                <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                  完了間近のタスクはありません
                </Typography>
              )}
            </List>
          </Paper>
        </Grid>

        {/* 高優先度タスク */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <FlagIcon sx={{ mr: 1, color: 'error.main' }} />
              高優先度タスク (80以上)
            </Typography>
            <List sx={{ maxHeight: 300, overflow: 'auto' }}>
              {highPriorityTasks.length > 0 ? (
                highPriorityTasks.map((task) => (
                  <ListItem key={task.id} divider>
                    <ListItemIcon>
                      <Avatar 
                        sx={{ 
                          width: 24, 
                          height: 24, 
                          bgcolor: getPriorityColor(task.priority),
                          fontSize: '0.75rem'
                        }}
                      >
                        {task.priority}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={task.title}
                      secondary={
                        <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                          <Chip
                            label={task.status === 'completed' ? '完了' : task.status === 'inProgress' ? '進行中' : task.status === 'onHold' ? '保留' : '未着手'}
                            size="small"
                            color={getStatusColor(task.status) as any}
                            variant="outlined"
                          />
                          <Chip
                            label={formatDate(task.endDate)}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                ))
              ) : (
                <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                  高優先度タスクはありません
                </Typography>
              )}
            </List>
          </Paper>
        </Grid>

        {/* 今週のタスク一覧 */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <ScheduleIcon sx={{ mr: 1 }} />
              今週のタスク
            </Typography>
            <List sx={{ maxHeight: 300, overflow: 'auto' }}>
              {thisWeekTasks.length > 0 ? (
                thisWeekTasks.map((task) => (
                  <ListItem key={task.id} divider>
                    <ListItemIcon>
                      <PersonIcon 
                        sx={{ 
                          color: task.color,
                          fontSize: '1.2rem'
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={task.title}
                      secondary={
                        <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                          <Chip
                            label={task.status === 'completed' ? '完了' : task.status === 'inProgress' ? '進行中' : task.status === 'onHold' ? '保留' : '未着手'}
                            size="small"
                            color={getStatusColor(task.status) as any}
                            variant="outlined"
                          />
                          <Chip
                            label={`${formatDate(task.startDate)} - ${formatDate(task.endDate)}`}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                ))
              ) : (
                <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                  今週のタスクはありません
                </Typography>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};