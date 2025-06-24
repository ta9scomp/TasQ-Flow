import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Typography,
  Grid,
  Autocomplete,
  FormControlLabel,
  Switch,
  Divider,
} from '@mui/material';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ja } from 'date-fns/locale';
import type { Task } from '../../types/task';
import { getPriorityColor } from '../../utils/colorUtils';

interface TaskEditDialogProps {
  open: boolean;
  task: Task | null;
  onClose: () => void;
  onSave: (task: Task) => void;
  members: { id: string; name: string; color: string }[];
}

const statusOptions = [
  { value: 'notStarted', label: '未着手' },
  { value: 'inProgress', label: '進行中' },
  { value: 'completed', label: '完了' },
  { value: 'onHold', label: '保留' },
];

const borderWidthOptions = ['1px', '2px', '3px'];
const borderStyleOptions = [
  { value: 'solid', label: '実線' },
  { value: 'dashed', label: '破線' },
  { value: 'dotted', label: '点線' },
];

export const TaskEditDialog: React.FC<TaskEditDialogProps> = ({
  open,
  task,
  onClose,
  onSave,
  members,
}) => {
  const [editedTask, setEditedTask] = React.useState<Task | null>(null);

  React.useEffect(() => {
    if (task) {
      setEditedTask({ ...task });
    }
  }, [task]);

  if (!editedTask) return null;

  const handleSave = () => {
    if (editedTask) {
      onSave(editedTask);
      onClose();
    }
  };

  const handleInputChange = (field: keyof Task, value: any) => {
    setEditedTask(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleBorderStyleChange = (field: string, value: any) => {
    setEditedTask(prev => prev ? {
      ...prev,
      borderStyle: {
        ...prev.borderStyle,
        [field]: value,
      }
    } : null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>タスク編集</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              {/* 基本情報 */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="タスク名"
                  value={editedTask.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="説明"
                  value={editedTask.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </Grid>

              {/* 日程 */}
              <Grid item xs={6}>
                <DatePicker
                  label="開始日"
                  value={editedTask.startDate}
                  onChange={(date) => handleInputChange('startDate', date)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>

              <Grid item xs={6}>
                <DatePicker
                  label="終了日"
                  value={editedTask.endDate}
                  onChange={(date) => handleInputChange('endDate', date)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>

              {/* ステータスと進捗 */}
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>ステータス</InputLabel>
                  <Select
                    value={editedTask.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    label="ステータス"
                  >
                    {statusOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <Typography gutterBottom>進捗: {editedTask.progress}%</Typography>
                <Slider
                  value={editedTask.progress}
                  onChange={(_, value) => handleInputChange('progress', value)}
                  valueLabelDisplay="auto"
                  min={0}
                  max={100}
                />
              </Grid>

              {/* 優先度 */}
              <Grid item xs={12}>
                <Typography gutterBottom>
                  優先度: {editedTask.priority}
                  <Chip
                    size="small"
                    label={
                      editedTask.priority >= 80 ? '緊急' :
                      editedTask.priority >= 50 ? '高' :
                      editedTask.priority >= 20 ? '中' : '低'
                    }
                    sx={{
                      ml: 1,
                      backgroundColor: getPriorityColor(editedTask.priority),
                      color: 'white',
                    }}
                  />
                </Typography>
                <Slider
                  value={editedTask.priority}
                  onChange={(_, value) => handleInputChange('priority', value)}
                  valueLabelDisplay="auto"
                  min={0}
                  max={100}
                  marks={[
                    { value: 0, label: '0' },
                    { value: 25, label: '25' },
                    { value: 50, label: '50' },
                    { value: 75, label: '75' },
                    { value: 100, label: '100' },
                  ]}
                />
              </Grid>

              {/* 担当者 */}
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  options={members.map(m => m.name)}
                  value={editedTask.assignees}
                  onChange={(_, value) => handleInputChange('assignees', value)}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        variant="outlined"
                        label={option}
                        {...getTagProps({ index })}
                        key={option}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="担当者"
                      placeholder="担当者を選択"
                    />
                  )}
                />
              </Grid>

              {/* タグ */}
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  freeSolo
                  options={[]}
                  value={editedTask.tags}
                  onChange={(_, value) => handleInputChange('tags', value)}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        variant="outlined"
                        label={option}
                        {...getTagProps({ index })}
                        key={option}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="タグ"
                      placeholder="タグを追加"
                    />
                  )}
                />
              </Grid>

              <Divider sx={{ width: '100%', my: 2 }} />

              {/* 縁取り設定 */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  縁取り設定
                </Typography>
              </Grid>

              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel>太さ</InputLabel>
                  <Select
                    value={editedTask.borderStyle?.width || '1px'}
                    onChange={(e) => handleBorderStyleChange('width', e.target.value)}
                    label="太さ"
                  >
                    {borderWidthOptions.map((width) => (
                      <MenuItem key={width} value={width}>
                        {width}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel>スタイル</InputLabel>
                  <Select
                    value={editedTask.borderStyle?.style || 'solid'}
                    onChange={(e) => handleBorderStyleChange('style', e.target.value)}
                    label="スタイル"
                  >
                    {borderStyleOptions.map((style) => (
                      <MenuItem key={style.value} value={style.value}>
                        {style.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="縁取り色"
                  type="color"
                  value={editedTask.borderStyle?.color || '#000000'}
                  onChange={(e) => handleBorderStyleChange('color', e.target.value)}
                />
              </Grid>

              {/* グループ設定 */}
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={editedTask.isGroup || false}
                      onChange={(e) => handleInputChange('isGroup', e.target.checked)}
                    />
                  }
                  label="タスクグループとして設定"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>キャンセル</Button>
          <Button onClick={handleSave} variant="contained">
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};