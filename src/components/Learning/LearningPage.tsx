import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Container,
  Tabs,
  Tab,
  Card,
  CardContent,
  Chip,
  List,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  School as SchoolIcon,
  MenuBook as BookIcon,
  Code as CodeIcon,
  Palette as PaletteIcon,
  TypeSpecimen as TypeIcon,
  Storage as StateIcon,
  Extension as ComponentIcon,
  ErrorOutline as ErrorIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
} from '@mui/icons-material';

interface LearningItem {
  id: string;
  title: string;
  description: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  estimatedTime: string;
  icon: React.ReactNode;
  filePath: string;
  completed?: boolean;
}

interface LearningPageProps {
  onBackToChart: () => void;
}

export const LearningPage: React.FC<LearningPageProps> = ({ onBackToChart }) => {
  const [selectedTab, setSelectedTab] = React.useState(0);
  const [learningItems, setLearningItems] = React.useState<LearningItem[]>([
    {
      id: 'react-basics',
      title: 'React基礎',
      description: 'コンポーネント、JSX、状態管理の基本を学ぶ',
      difficulty: 2,
      estimatedTime: '4-5時間',
      icon: <CodeIcon />,
      filePath: '/docs/learning-guides/React-Basics-Learning-Guide.md'
    },
    {
      id: 'css-styling',
      title: 'CSS・スタイリング',
      description: 'Reactでのスタイリング方法とMaterial-UIの使い方',
      difficulty: 2,
      estimatedTime: '3-4時間',
      icon: <PaletteIcon />,
      filePath: '/docs/learning-guides/CSS-Styling-Learning-Guide.md'
    },
    {
      id: 'typescript',
      title: 'TypeScript',
      description: '型安全なJavaScriptの書き方',
      difficulty: 3,
      estimatedTime: '3-4時間',
      icon: <TypeIcon />,
      filePath: '/docs/learning-guides/TypeScript-Learning-Guide.md'
    },
    {
      id: 'state-management',
      title: '状態管理',
      description: 'Zustandを使ったグローバル状態管理',
      difficulty: 3,
      estimatedTime: '2-3時間',
      icon: <StateIcon />,
      filePath: '/docs/learning-guides/State-Management-Learning-Guide.md'
    },
    {
      id: 'component-design',
      title: 'コンポーネント設計',
      description: '再利用可能なコンポーネントの設計原則',
      difficulty: 4,
      estimatedTime: '4-5時間',
      icon: <ComponentIcon />,
      filePath: '/docs/learning-guides/Component-Design-Learning-Guide.md'
    },
    {
      id: 'error-handling',
      title: 'エラーハンドリング',
      description: 'エラーの適切な処理方法',
      difficulty: 3,
      estimatedTime: '2-3時間',
      icon: <ErrorIcon />,
      filePath: '/docs/learning-guides/Error-Handling-Learning-Guide.md'
    }
  ]);
  
  const [draggedItem, setDraggedItem] = React.useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<LearningItem | null>(null);
  const [isNewItem, setIsNewItem] = React.useState(false);

  // ローカルストレージから設定を読み込み
  React.useEffect(() => {
    const savedItems = localStorage.getItem('learning-items');
    const savedTab = localStorage.getItem('learning-selected-tab');
    
    if (savedItems) {
      try {
        const parsedItems = JSON.parse(savedItems);
        setLearningItems(parsedItems);
      } catch (error) {
        console.error('Failed to parse saved learning items:', error);
      }
    }
    
    if (savedTab) {
      setSelectedTab(parseInt(savedTab, 10));
    }
  }, []);

  // 設定をローカルストレージに保存
  React.useEffect(() => {
    localStorage.setItem('learning-items', JSON.stringify(learningItems));
  }, [learningItems]);

  React.useEffect(() => {
    localStorage.setItem('learning-selected-tab', selectedTab.toString());
  }, [selectedTab]);

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return '#4CAF50';
      case 2: return '#8BC34A';
      case 3: return '#FF9800';
      case 4: return '#FF5722';
      case 5: return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const getDifficultyText = (difficulty: number) => {
    const stars = '⭐'.repeat(difficulty) + '☆'.repeat(5 - difficulty);
    const levels = ['', '入門', '初級', '中級', '上級', '専門'];
    return `${stars} (${levels[difficulty]})`;
  };

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem === targetId) return;

    const draggedIndex = learningItems.findIndex(item => item.id === draggedItem);
    const targetIndex = learningItems.findIndex(item => item.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newItems = [...learningItems];
    const [draggedElement] = newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, draggedElement);

    setLearningItems(newItems);
    setDraggedItem(null);
  };

  const handleAddItem = () => {
    setEditingItem({
      id: '',
      title: '',
      description: '',
      difficulty: 1,
      estimatedTime: '',
      icon: <BookIcon />,
      filePath: '',
      completed: false
    });
    setIsNewItem(true);
    setEditDialogOpen(true);
  };

  const handleEditItem = (item: LearningItem) => {
    setEditingItem(item);
    setIsNewItem(false);
    setEditDialogOpen(true);
  };

  const handleDeleteItem = (itemId: string) => {
    if (confirm('本当にこの学習項目を削除しますか？')) {
      setLearningItems(prev => prev.filter(item => item.id !== itemId));
    }
  };

  const handleSaveItem = () => {
    if (!editingItem) return;

    if (isNewItem) {
      const newItem = {
        ...editingItem,
        id: editingItem.id || `item-${Date.now()}`
      };
      setLearningItems(prev => [...prev, newItem]);
    } else {
      setLearningItems(prev => 
        prev.map(item => item.id === editingItem.id ? editingItem : item)
      );
    }

    setEditDialogOpen(false);
    setEditingItem(null);
    setIsNewItem(false);
  };

  const toggleCompleted = (itemId: string) => {
    setLearningItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    );
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      overflow: 'auto',
    }}>
      {/* ヘッダー */}
      <Paper
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(20px) saturate(180%)',
          border: 'none',
          borderRadius: 0,
          boxShadow: `
            0 4px 20px 0 rgba(0, 0, 0, 0.1),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.2)
          `,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            py: 2,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <SchoolIcon sx={{ fontSize: 32, color: '#fff' }} />
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 'bold',
                  color: '#fff',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                }}
              >
                React & CSS 学習センター
              </Typography>
            </Box>
            
            <Button
              variant="contained"
              startIcon={<ArrowBackIcon />}
              onClick={onBackToChart}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#fff',
                fontWeight: 600,
                borderRadius: 3,
                px: 3,
                py: 1.5,
                boxShadow: `
                  0 4px 15px 0 rgba(0, 0, 0, 0.2),
                  inset 0 1px 0 0 rgba(255, 255, 255, 0.3)
                `,
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  transform: 'translateY(-2px)',
                  boxShadow: `
                    0 6px 20px 0 rgba(0, 0, 0, 0.25),
                    inset 0 1px 0 0 rgba(255, 255, 255, 0.4)
                  `,
                },
                '&:active': {
                  transform: 'translateY(0px)',
                  transition: 'all 0.1s ease',
                },
              }}
            >
              チャートに戻る
            </Button>
          </Box>
        </Container>
      </Paper>

      {/* メインコンテンツエリア */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* タブナビゲーション */}
        <Paper
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 3,
            mb: 3,
          }}
        >
          <Tabs
            value={selectedTab}
            onChange={(_, newValue) => setSelectedTab(newValue)}
            sx={{
              '& .MuiTab-root': {
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-selected': {
                  color: '#fff',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#fff',
              },
            }}
          >
            <Tab label="📚 学習リスト" />
            <Tab label="📊 進捗管理" />
            <Tab label="⚙️ 設定" />
          </Tabs>
        </Paper>

        {/* タブコンテンツ */}
        {selectedTab === 0 && (
          <Box>
            {/* 学習リストヘッダー */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4" sx={{ color: '#fff', fontWeight: 'bold' }}>
                📖 学習ガイド一覧
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddItem}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  },
                }}
              >
                新規追加
              </Button>
            </Box>

            {/* 学習項目リスト */}
            <List sx={{ gap: 2, display: 'flex', flexDirection: 'column' }}>
              {learningItems.map((item) => (
                <Card
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, item.id)}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 3,
                    cursor: 'grab',
                    transition: 'all 0.3s ease',
                    opacity: item.completed ? 0.7 : 1,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
                    },
                    '&:active': {
                      cursor: 'grabbing',
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      {/* ドラッグハンドル */}
                      <DragIcon sx={{ color: 'rgba(255, 255, 255, 0.5)', mt: 0.5 }} />

                      {/* アイコン */}
                      <Box sx={{ color: '#fff', mt: 0.5 }}>
                        {item.icon}
                      </Box>

                      {/* メインコンテンツ */}
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              color: '#fff',
                              fontWeight: 'bold',
                              textDecoration: item.completed ? 'line-through' : 'none',
                            }}
                          >
                            {item.title}
                          </Typography>
                          
                          {item.completed && (
                            <Chip
                              label="完了"
                              size="small"
                              sx={{
                                backgroundColor: '#4CAF50',
                                color: '#fff',
                              }}
                            />
                          )}
                        </Box>

                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 2 }}>
                          {item.description}
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          <Chip
                            label={getDifficultyText(item.difficulty)}
                            size="small"
                            sx={{
                              backgroundColor: getDifficultyColor(item.difficulty),
                              color: '#fff',
                            }}
                          />
                          <Chip
                            label={`⏱️ ${item.estimatedTime}`}
                            size="small"
                            sx={{
                              backgroundColor: 'rgba(255, 255, 255, 0.2)',
                              color: '#fff',
                            }}
                          />
                        </Box>
                      </Box>

                      {/* アクションボタン */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => toggleCompleted(item.id)}
                          sx={{ color: item.completed ? '#4CAF50' : 'rgba(255, 255, 255, 0.7)' }}
                        >
                          {item.completed ? '✅' : '⭕'}
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleEditItem(item)}
                          sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteItem(item.id)}
                          sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </List>
          </Box>
        )}

        {selectedTab === 1 && (
          <Box sx={{ textAlign: 'center', color: '#fff', py: 8 }}>
            <Typography variant="h6" sx={{ opacity: 0.8 }}>
              進捗管理機能は準備中です...
            </Typography>
          </Box>
        )}

        {selectedTab === 2 && (
          <Box sx={{ textAlign: 'center', color: '#fff', py: 8 }}>
            <Typography variant="h6" sx={{ opacity: 0.8 }}>
              設定機能は準備中です...
            </Typography>
          </Box>
        )}
      </Container>

      {/* 編集ダイアログ */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {isNewItem ? '新しい学習項目を追加' : '学習項目を編集'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="タイトル"
              fullWidth
              value={editingItem?.title || ''}
              onChange={(e) => setEditingItem(prev => prev ? { ...prev, title: e.target.value } : null)}
            />
            <TextField
              label="説明"
              fullWidth
              multiline
              rows={3}
              value={editingItem?.description || ''}
              onChange={(e) => setEditingItem(prev => prev ? { ...prev, description: e.target.value } : null)}
            />
            <TextField
              label="予想学習時間"
              fullWidth
              value={editingItem?.estimatedTime || ''}
              onChange={(e) => setEditingItem(prev => prev ? { ...prev, estimatedTime: e.target.value } : null)}
              placeholder="例: 2-3時間"
            />
            <TextField
              label="ファイルパス"
              fullWidth
              value={editingItem?.filePath || ''}
              onChange={(e) => setEditingItem(prev => prev ? { ...prev, filePath: e.target.value } : null)}
              placeholder="例: /docs/learning-guides/Guide-Name.md"
            />
            <TextField
              select
              label="難易度"
              value={editingItem?.difficulty || 1}
              onChange={(e) => setEditingItem(prev => prev ? { ...prev, difficulty: Number(e.target.value) as 1|2|3|4|5 } : null)}
              SelectProps={{ native: true }}
            >
              <option value={1}>⭐☆☆☆☆ (入門)</option>
              <option value={2}>⭐⭐☆☆☆ (初級)</option>
              <option value={3}>⭐⭐⭐☆☆ (中級)</option>
              <option value={4}>⭐⭐⭐⭐☆ (上級)</option>
              <option value={5}>⭐⭐⭐⭐⭐ (専門)</option>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>
            キャンセル
          </Button>
          <Button onClick={handleSaveItem} variant="contained">
            {isNewItem ? '追加' : '保存'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};