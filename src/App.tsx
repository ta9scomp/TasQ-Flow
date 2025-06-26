import React from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box, Typography } from '@mui/material';
import { Header } from './components/Layout/Header';
import { ExtendedProjectTeamSidebar } from './components/Layout/ExtendedProjectTeamSidebar';
import { ProjectNavigation, type ViewMode } from './components/ProjectTeam/ProjectNavigation';
import { LightweightGanttChart } from './components/GanttChart/LightweightGanttChart';
import { MemberTab } from './components/Members/MemberTab';
import { StickyNotesTab } from './components/StickyNotes/StickyNotesTab';
import { TodoTab } from './components/Todo/TodoTab';
import { TaskEditDialog } from './components/Task/TaskEditDialog';
import { HomeScreen } from './components/Home/HomeScreen';
import { HistoryTab } from './components/History/HistoryTab';
import { ProjectSettingsTab } from './components/ProjectSettings/ProjectSettingsTab';
import { RightSidebar } from './components/Layout/RightSidebar';
import { LearningPage } from './components/Learning/LearningPage';
import { MockRealtimeProvider, useRealtime } from './contexts/RealtimeContext';
import { ConflictResolutionDialog } from './components/Realtime/ConflictResolutionDialog';
import { TaskSyncManager } from './components/Sync/TaskSyncManager';
import { ErrorBoundary } from './components/ErrorHandling/ErrorBoundary';
import { ErrorNotificationSystem } from './components/ErrorHandling/ErrorNotificationSystem';
import { sampleMembers } from './data/sampleData';
import { getProjectById } from './data/sampleProjectTeams';
import { sampleHolidays, sampleEvents } from './data/sampleCalendarData';
// import { addDays } from 'date-fns'; // 不要になったためコメントアウト
import type { Task } from './types/task';
import { useAppStore } from './stores/useAppStore';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196F3',
      light: '#64B5F6',
      dark: '#1976D2',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FF9800',
      light: '#FFB74D',
      dark: '#F57C00',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#4CAF50',
      light: '#81C784',
      dark: '#388E3C',
    },
    warning: {
      main: '#FF9800',
      light: '#FFB74D',
      dark: '#F57C00',
    },
    error: {
      main: '#F44336',
      light: '#E57373',
      dark: '#D32F2F',
    },
    background: {
      default: '#FAFAFA',
      paper: '#FFFFFF',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Noto Sans JP", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid rgba(0, 0, 0, 0.12)',
        },
      },
    },
  },
});

// リアルタイム機能を使用するメインコンポーネント
function AppContent() {
  const {
    selectedView,
    selectedTeamId,
    selectedProjectId,
    viewMode,
    tasks,
    sidebarOpen,
    setSelectedView,
    setSelectedTeamId,
    setSelectedProjectId,
    setViewMode,
    setSidebarOpen,
    updateTask,
    addTask,
    getSelectedProject,
  } = useAppStore();
  
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);
  const [taskEditDialogOpen, setTaskEditDialogOpen] = React.useState(false);
  const [isCreatingNewTask, setIsCreatingNewTask] = React.useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = React.useState(false);
  const [showLearningPage, setShowLearningPage] = React.useState(false);
  
  // リアルタイム機能の利用
  const { conflicts, broadcastTaskUpdate, broadcastTaskCreate } = useRealtime();
  const [conflictDialogOpen, setConflictDialogOpen] = React.useState(false);
  const teamSidebarWidth = 280; // ExtendedProjectTeamSidebarの基本幅

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleRightSidebarToggle = () => {
    setRightSidebarOpen(!rightSidebarOpen);
  };

  const handleNavigateToLearning = () => {
    setShowLearningPage(true);
    setRightSidebarOpen(false);
  };

  const handleBackToChart = () => {
    setShowLearningPage(false);
  };

  const handleTeamSelect = (teamId: string) => {
    setSelectedTeamId(teamId);
    setSelectedProjectId(undefined);
  };

  const handleProjectSelect = (projectId: string) => {
    setSelectedProjectId(projectId);
  };

  const handleTeamSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleHomeSelect = () => {
    setSelectedView('home');
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setTaskEditDialogOpen(true);
  };

  const handleMonthChange = (monthStart: Date, monthEnd: Date) => {
    console.log('月表示変更:', { monthStart, monthEnd });
    // 将来的にはここで月に関連するデータの読み込みなどを行う
  };

  const handleTaskCreate = (startDate: Date, endDate: Date) => {
    // 新しいタスクのテンプレートを作成
    const newTask: Task = {
      id: `task_${Date.now()}`,
      title: '新しいタスク',
      startDate,
      endDate,
      progress: 0,
      priority: 50,
      status: 'notStarted',
      assignees: [],
      tags: [],
      description: '',
      checklist: [],
    };

    setSelectedTask(newTask);
    setIsCreatingNewTask(true);
    setTaskEditDialogOpen(true);
  };

  const handleTaskSave = (updatedTask: Task) => {
    if (isCreatingNewTask) {
      addTask(updatedTask);
      broadcastTaskCreate(updatedTask);
      setIsCreatingNewTask(false);
    } else {
      updateTask(updatedTask.id, updatedTask);
      broadcastTaskUpdate(updatedTask);
    }
  };

  const handleTaskEditClose = () => {
    setTaskEditDialogOpen(false);
    setIsCreatingNewTask(false);
    setSelectedTask(null);
  };


  // 競合検知の監視
  React.useEffect(() => {
    if (conflicts.length > 0 && !conflictDialogOpen) {
      setConflictDialogOpen(true);
    }
  }, [conflicts.length, conflictDialogOpen]);


  const renderTabContent = () => {
    console.log('renderTabContent called:', { selectedProjectId, viewMode, selectedTeamId });
    
    const project = selectedProjectId ? getProjectById(selectedProjectId) : null;
    console.log('Project found:', project);

    switch (viewMode) {
      case 'gantt':
        return (
          <LightweightGanttChart
            tasks={project?.tasks.length ? project.tasks : tasks}
            onTaskClick={handleTaskClick}
            onTaskCreate={handleTaskCreate}
            holidays={sampleHolidays}
            events={sampleEvents}
            onMonthChange={handleMonthChange}
            selectedProjectId={selectedProjectId}
            selectedTeamId={selectedTeamId}
          />
        );
      case 'members':
        // プロジェクト選択時のみメンバータブを表示
        if (!project) {
          return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                メンバー表示にはプロジェクトを選択してください
              </Typography>
            </Box>
          );
        }
        return <MemberTab members={project.members} tasks={project.tasks} />;
      case 'sticky':
        // 付箋タブはプロジェクト選択不要で独立動作
        return <StickyNotesTab />;
      case 'todo':
        // ToDoタブもプロジェクト選択不要で独立動作
        return <TodoTab tasks={project?.tasks || []} />;
      case 'history':
        // 履歴タブもプロジェクト選択不要で独立動作
        return <HistoryTab />;
      case 'settings':
        // 設定タブもプロジェクト選択不要で独立動作
        return <ProjectSettingsTab />;
      default:
        return (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              不明なタブです
            </Typography>
          </Box>
        );
    }
  };

  const renderMainContent = () => {
    console.log('renderMainContent called:', { selectedView, selectedTeamId, selectedProjectId, viewMode });
    
    if (selectedView === 'home') {
      console.log('Rendering HomeScreen from renderMainContent');
      return <HomeScreen />;
    }

    if (selectedView === 'teams' && selectedTeamId) {
      console.log('Teams view with selectedTeamId, rendering tab content');
      // チームが選択されている場合は常にタブコンテンツを表示
      return renderTabContent();
    }

    // デフォルトはホーム画面
    return <HomeScreen />;
  };

  // サイドバーの総幅を計算（ExtendedProjectTeamSidebar: 基本幅 + プロジェクトエリア幅）
  const actualTeamSidebarWidth = sidebarOpen ? (selectedTeamId ? teamSidebarWidth + 320 : teamSidebarWidth) : 0;

  console.log('App render:', { selectedView, selectedTeamId, selectedProjectId, viewMode });
  
  // 学習ページ表示時は専用レイアウト
  if (showLearningPage) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LearningPage onBackToChart={handleBackToChart} />
      </ThemeProvider>
    );
  }
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TaskSyncManager 
        autoSyncInterval={30000}
        maxRetries={3}
        onSyncStateChange={(state) => {
          console.log('Sync state changed:', state);
        }}
      >
        <Box sx={{ display: 'flex', height: '100vh' }}>
          <Header 
            onMenuClick={handleMenuClick} 
            onRightSidebarToggle={handleRightSidebarToggle}
          />
        
        {/* 3層サイドバー：チーム選択 + プロジェクト・タスク一覧 */}
        <ExtendedProjectTeamSidebar
          open={sidebarOpen}
          onClose={handleTeamSidebarClose}
          width={teamSidebarWidth}
          selectedTeamId={selectedTeamId}
          selectedProjectId={selectedProjectId}
          selectedView={selectedView}
          onTeamSelect={handleTeamSelect}
          onProjectSelect={handleProjectSelect}
          onHomeSelect={handleHomeSelect}
          projectTasks={getSelectedProject()?.tasks || []}
          rowHeight={40}
        />
        
        {/* 第2層：プロジェクトサイドバー（ガントチャート内に統合済みのため無効化） */}
        
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            height: '100vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            marginLeft: sidebarOpen ? `${actualTeamSidebarWidth}px` : 0,
            marginRight: rightSidebarOpen ? '320px' : 0,
            transition: 'margin 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            paddingTop: '64px', // ヘッダー分のパディング
          }}
        >
          {/* チーム選択時の上部ナビゲーション（常に表示） */}
          {selectedView === 'teams' && selectedTeamId && (
            <ProjectNavigation
              teamId={selectedTeamId}
              projectId={selectedProjectId}
              viewMode={viewMode}
              onViewModeChange={handleViewModeChange}
              onProjectSelect={handleProjectSelect}
            />
          )}
          
          {/* メインコンテンツ */}
          <Box sx={{ 
            flex: 1, 
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {renderMainContent()}
          </Box>
        </Box>

        {/* タスク編集ダイアログ */}
        <TaskEditDialog
          open={taskEditDialogOpen}
          task={selectedTask}
          onClose={handleTaskEditClose}
          onSave={handleTaskSave}
          members={sampleMembers}
        />

        {/* 競合解決ダイアログ */}
        <ConflictResolutionDialog
          open={conflictDialogOpen}
          onClose={() => setConflictDialogOpen(false)}
        />
        
        {/* エラー通知システム */}
        <ErrorNotificationSystem
          maxNotifications={3}
          position={{ vertical: 'top', horizontal: 'right' }}
          onRetry={(error) => {
            console.log('Retrying after error:', error);
            if (error.retryable) {
              window.location.reload();
            }
          }}
        />
        
        {/* 右側サイドバー */}
        <RightSidebar 
          open={rightSidebarOpen} 
          onClose={() => setRightSidebarOpen(false)}
          onNavigateToLearning={handleNavigateToLearning}
        />
        </Box>
      </TaskSyncManager>
    </ThemeProvider>
  );
}

// リアルタイム機能付きのメインApp
function App() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('🚨 Application Error Boundary caught error:', error, errorInfo);
        
        // エラー情報をサーバーに送信する場合はここで実装
        // sendErrorToServer(error, errorInfo);
      }}
    >
      <MockRealtimeProvider>
        <AppContent />
      </MockRealtimeProvider>
    </ErrorBoundary>
  );
}

export default App;