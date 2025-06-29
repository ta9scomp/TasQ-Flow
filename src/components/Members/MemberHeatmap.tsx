import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Chip,
  Grid,
} from '@mui/material';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';
import { ja } from 'date-fns/locale';
import type { Member, Task } from '../../types/task';

interface MemberHeatmapProps {
  members: Member[];
  tasks: Task[];
  selectedMember?: string;
  onMemberSelect?: (memberId: string) => void;
  dateRange?: 'month' | 'quarter' | 'year';
  baseDate?: Date;
}

interface DayData {
  date: Date;
  capacity: number; // 0-100%
  tasks: Task[];
  isOverloaded: boolean;
  isPrivate: boolean;
}

export const MemberHeatmap: React.FC<MemberHeatmapProps> = ({
  members,
  tasks,
  selectedMember,
  onMemberSelect,
  dateRange = 'month',
  baseDate = new Date(),
}) => {

  // 日付範囲の計算
  const getPeriodDates = () => {
    const base = new Date(baseDate);
    switch (dateRange) {
      case 'month':
        return {
          start: startOfMonth(base),
          end: endOfMonth(base),
        };
      case 'quarter':
        // 四半期の計算（簡略化）
        const quarterStart = new Date(base.getFullYear(), Math.floor(base.getMonth() / 3) * 3, 1);
        const quarterEnd = new Date(base.getFullYear(), Math.floor(base.getMonth() / 3) * 3 + 3, 0);
        return { start: quarterStart, end: quarterEnd };
      case 'year':
        return {
          start: new Date(base.getFullYear(), 0, 1),
          end: new Date(base.getFullYear(), 11, 31),
        };
    }
  };

  const { start, end } = getPeriodDates();
  const allDays = eachDayOfInterval({ start, end });

  // メンバーの日別データを計算
  const calculateMemberDayData = (member: Member): DayData[] => {
    return allDays.map(date => {
      const dayTasks = tasks.filter(task => {
        const taskStart = new Date(task.startDate);
        const taskEnd = new Date(task.endDate);
        return task.assignees.includes(member.name) &&
               date >= taskStart && date <= taskEnd;
      });

      // 容量計算（タスクの優先度と進捗を考慮）
      const capacity = Math.min(100, dayTasks.reduce((acc, task) => {
        const taskWeight = (task.priority / 100) * (task.status === 'completed' ? 0.5 : 1);
        return acc + (taskWeight * 20); // 1タスクあたり最大20%の負荷
      }, 0));

      return {
        date,
        capacity,
        tasks: dayTasks,
        isOverloaded: capacity > 80,
        isPrivate: Math.random() > 0.8, // モック：一部の日は非公開
      };
    });
  };

  // ヒートマップの色を取得
  const getHeatmapColor = (capacity: number, isPrivate: boolean) => {
    if (isPrivate) {
      return 'repeating-linear-gradient(45deg, #e0e0e0, #e0e0e0 2px, #f5f5f5 2px, #f5f5f5 6px)';
    }
    if (capacity === 0) return '#f5f5f5';
    if (capacity <= 25) return '#c8e6c9';
    if (capacity <= 50) return '#fff3b3';
    if (capacity <= 75) return '#ffcc80';
    if (capacity <= 100) return '#ef5350';
    return '#d32f2f';
  };

  // 選択されたメンバーのデータ
  const selectedMemberData = selectedMember 
    ? members.find(m => m.id === selectedMember)
    : members[0];

  const memberDayData = selectedMemberData ? calculateMemberDayData(selectedMemberData) : [];

  // カレンダーグリッドの生成
  const renderCalendarGrid = () => {
    if (dateRange !== 'month') {
      // 月以外は簡易表示
      return (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
          {memberDayData.map((dayData, index) => (
            <Tooltip
              key={index}
              title={
                <Box>
                  <Typography variant="body2">
                    {format(dayData.date, 'yyyy/MM/dd (E)', { locale: ja })}
                  </Typography>
                  <Typography variant="caption">
                    容量: {dayData.isPrivate ? '非公開' : `${Math.round(dayData.capacity)}%`}
                  </Typography>
                  {dayData.tasks.length > 0 && (
                    <Typography variant="caption" display="block">
                      タスク: {dayData.tasks.length}件
                    </Typography>
                  )}
                </Box>
              }
            >
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  background: getHeatmapColor(dayData.capacity, dayData.isPrivate),
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderRadius: 0.5,
                  cursor: 'pointer',
                }}
              />
            </Tooltip>
          ))}
        </Box>
      );
    }

    // 月表示の詳細カレンダー
    const firstDayOfWeek = getDay(start);
    const calendarDays: (DayData | null)[] = [];
    
    // 前月の空白を追加
    for (let i = 0; i < firstDayOfWeek; i++) {
      calendarDays.push(null);
    }
    
    // 実際の日付を追加
    memberDayData.forEach(dayData => {
      calendarDays.push(dayData);
    });

    const weeks: (DayData | null)[][] = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      weeks.push(calendarDays.slice(i, i + 7));
    }

    return (
      <Box>
        {/* 曜日ヘッダー */}
        <Grid container sx={{ mb: 1 }}>
          {['日', '月', '火', '水', '木', '金', '土'].map(day => (
            <Grid size='grow' key={day} sx={{ textAlign: 'center' }}>
              <Typography variant="caption" fontWeight="bold">
                {day}
              </Typography>
            </Grid>
          ))}
        </Grid>

        {/* カレンダーグリッド */}
        {weeks.map((week, weekIndex) => (
          <Grid container key={weekIndex} sx={{ mb: 0.5 }}>
            {week.map((dayData, dayIndex) => (
              <Grid size='grow' key={dayIndex} sx={{ textAlign: 'center' }}>
                {dayData ? (
                  <Tooltip
                    title={
                      <Box>
                        <Typography variant="body2">
                          {format(dayData.date, 'MM/dd (E)', { locale: ja })}
                        </Typography>
                        <Typography variant="caption" display="block">
                          容量: {dayData.isPrivate ? '非公開' : `${Math.round(dayData.capacity)}%`}
                        </Typography>
                        {dayData.tasks.length > 0 && (
                          <>
                            <Typography variant="caption" display="block">
                              タスク: {dayData.tasks.length}件
                            </Typography>
                            {dayData.tasks.slice(0, 3).map(task => (
                              <Typography key={task.id} variant="caption" display="block" sx={{ pl: 1 }}>
                                • {task.title}
                              </Typography>
                            ))}
                            {dayData.tasks.length > 3 && (
                              <Typography variant="caption" display="block" sx={{ pl: 1 }}>
                                他 {dayData.tasks.length - 3} 件...
                              </Typography>
                            )}
                          </>
                        )}
                      </Box>
                    }
                  >
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        background: getHeatmapColor(dayData.capacity, dayData.isPrivate),
                        border: dayData.isOverloaded ? '2px solid #d32f2f' : '1px solid rgba(0,0,0,0.1)',
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        mx: 'auto',
                        '&:hover': {
                          transform: 'scale(1.1)',
                          zIndex: 10,
                        },
                        transition: 'transform 0.2s ease',
                      }}
                    >
                      <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                        {format(dayData.date, 'd')}
                      </Typography>
                    </Box>
                  </Tooltip>
                ) : (
                  <Box sx={{ width: 36, height: 36 }} />
                )}
              </Grid>
            ))}
          </Grid>
        ))}
      </Box>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">
          メンバー稼働ヒートマップ
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>期間</InputLabel>
            <Select
              value={dateRange}
              label="期間"
              disabled // 今回は月表示のみ実装
            >
              <MenuItem value="month">月</MenuItem>
              <MenuItem value="quarter">四半期</MenuItem>
              <MenuItem value="year">年</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>メンバー</InputLabel>
            <Select
              value={selectedMember || ''}
              onChange={(e) => onMemberSelect?.(e.target.value)}
              label="メンバー"
            >
              {members.map(member => (
                <MenuItem key={member.id} value={member.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 24, height: 24, bgcolor: member.color }}>
                      {member.name.charAt(0)}
                    </Avatar>
                    {member.name}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {selectedMemberData && (
        <Grid container spacing={3}>
          {/* メンバー情報 */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ width: 48, height: 48, bgcolor: selectedMemberData.color }}>
                    {selectedMemberData.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{selectedMemberData.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedMemberData.email}
                    </Typography>
                  </Box>
                </Box>

                {/* 統計情報 */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">平均稼働率:</Typography>
                    <Chip 
                      label={`${Math.round(memberDayData.reduce((sum, day) => sum + day.capacity, 0) / memberDayData.length)}%`}
                      size="small"
                      color="primary"
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">過負荷日数:</Typography>
                    <Chip 
                      label={`${memberDayData.filter(day => day.isOverloaded).length}日`}
                      size="small"
                      color="error"
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">非公開日数:</Typography>
                    <Chip 
                      label={`${memberDayData.filter(day => day.isPrivate).length}日`}
                      size="small"
                      color="default"
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* ヒートマップ */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                {format(start, 'yyyy年MM月', { locale: ja })} 稼働状況
              </Typography>
              {renderCalendarGrid()}
            </Paper>
          </Grid>

          {/* 凡例 */}
          <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>凡例</Typography>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 20, height: 20, bgcolor: '#f5f5f5', border: '1px solid rgba(0,0,0,0.1)' }} />
                  <Typography variant="caption">空き (0%)</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 20, height: 20, bgcolor: '#c8e6c9', border: '1px solid rgba(0,0,0,0.1)' }} />
                  <Typography variant="caption">軽負荷 (1-25%)</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 20, height: 20, bgcolor: '#fff3b3', border: '1px solid rgba(0,0,0,0.1)' }} />
                  <Typography variant="caption">中負荷 (26-50%)</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 20, height: 20, bgcolor: '#ffcc80', border: '1px solid rgba(0,0,0,0.1)' }} />
                  <Typography variant="caption">高負荷 (51-75%)</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 20, height: 20, bgcolor: '#ef5350', border: '1px solid rgba(0,0,0,0.1)' }} />
                  <Typography variant="caption">過負荷 (76-100%)</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ 
                    width: 20, 
                    height: 20, 
                    background: 'repeating-linear-gradient(45deg, #e0e0e0, #e0e0e0 2px, #f5f5f5 2px, #f5f5f5 6px)',
                    border: '1px solid rgba(0,0,0,0.1)'
                  }} />
                  <Typography variant="caption">非公開</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};