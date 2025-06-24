import React from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import { Header } from './components/Layout/Header';
import { ProjectTeamSidebar } from './components/Layout/ProjectTeamSidebar';
import { ProjectSidebar } from './components/Layout/ProjectSidebar';
import { ProjectNavigation, type ViewMode } from './components/ProjectTeam/ProjectNavigation';
import { VirtualGanttChart } from './components/GanttChart/VirtualGanttChart';
import { MemberTab } from './components/Members/MemberTab';
import { StickyNotesTab } from './components/StickyNotes/StickyNotesTab';
import { TodoTab } from './components/Todo/TodoTab';
import { TaskEditDialog } from './components/Task/TaskEditDialog';
import { HomeScreen } from './components/Home/HomeScreen';
import { HistoryTab } from './components/History/HistoryTab';
import { ProjectSettingsTab } from './components/ProjectSettings/ProjectSettingsTab';
import { sampleMembers } from './data/sampleData';
import { getProjectById } from './data/sampleProjectTeams';
import { addDays } from 'date-fns';
import type { Task } from './types/task';
import { useAppStore } from './stores/useAppStore';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196F3',
    },
    secondary: {
      main: '#FF9800',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Noto Sans JP", sans-serif',
  },
});

function App() {
  const {
    selectedView,
    selectedTeamId,
    selectedProjectId,
    viewMode,
    tasks,
    setSelectedTeamId,
    setSelectedProjectId,
    setViewMode,
    updateTask,
  } = useAppStore();
  
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);
  const [taskEditDialogOpen, setTaskEditDialogOpen] = React.useState(false);
  const [teamSidebarOpen, setTeamSidebarOpen] = React.useState(true);
  const [projectSidebarOpen, setProjectSidebarOpen] = React.useState(true);
  
  const teamSidebarWidth = 300;
  const projectSidebarWidth = 320;

  const handleMenuClick = () => {
    setTeamSidebarOpen(!teamSidebarOpen);
  };


  const handleTeamSelect = (teamId: string) => {
    setSelectedTeamId(teamId);
    setSelectedProjectId(undefined);
    setProjectSidebarOpen(true);
  };

  const handleProjectSelect = (projectId: string) => {
    setSelectedProjectId(projectId);
  };

  const handleTeamSidebarClose = () => {
    setTeamSidebarOpen(false);
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setTaskEditDialogOpen(true);
  };

  const handleTaskSave = (updatedTask: Task) => {
    updateTask(updatedTask.id, updatedTask);
  };

  const renderProjectContent = () => {
    if (!selectedProjectId) return null;
    
    const project = getProjectById(selectedProjectId);
    if (!project) return null;

    switch (viewMode) {
      case 'gantt':
        return (
          <VirtualGanttChart
            tasks={project.tasks.length > 0 ? project.tasks : tasks}
            startDate={new Date()}
            endDate={addDays(new Date(), 30)}
            onTaskClick={handleTaskClick}
          />
        );
      case 'members':
        return <MemberTab members={project.members} tasks={project.tasks} />;
      case 'sticky':
        return <StickyNotesTab />;
      case 'todo':
        return <TodoTab tasks={project.tasks} />;
      case 'history':
        return <HistoryTab />;
      case 'settings':
        return <ProjectSettingsTab />;
      default:
        return null;
    }
  };

  const renderMainContent = () => {
    if (selectedView === 'home') {
      return <HomeScreen />;
    }

    if (selectedView === 'teams' && selectedTeamId && selectedProjectId) {
      return renderProjectContent();
    }

    return <HomeScreen />;
  };

  // サイドバーの総幅を計算
  const totalSidebarWidth = (teamSidebarOpen ? teamSidebarWidth : 0) + 
    (projectSidebarOpen && selectedTeamId ? projectSidebarWidth : 0);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <Header onMenuClick={handleMenuClick} />
        
        {/* 第1層：プロジェクトチームサイドバー */}
        <ProjectTeamSidebar
          open={teamSidebarOpen}
          width={teamSidebarWidth}
          selectedTeamId={selectedTeamId}
          onTeamSelect={handleTeamSelect}
          onClose={handleTeamSidebarClose}
        />
        
        {/* 第2層：プロジェクトサイドバー */}
        <ProjectSidebar
          open={projectSidebarOpen && selectedTeamId !== undefined}
          width={projectSidebarWidth}
          selectedTeamId={selectedTeamId}
          selectedProjectId={selectedProjectId}
          onProjectSelect={handleProjectSelect}
          leftSidebarWidth={teamSidebarOpen ? teamSidebarWidth : 0}
        />
        
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            pt: '64px',
            pl: `${totalSidebarWidth}px`,
            transition: 'padding-left 0.3s ease',
            height: '100vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* プロジェクト選択時の上部ナビゲーション */}
          {selectedView === 'teams' && selectedTeamId && selectedProjectId && (
            <ProjectNavigation
              teamId={selectedTeamId}
              projectId={selectedProjectId}
              viewMode={viewMode}
              onViewModeChange={handleViewModeChange}
              onProjectSelect={handleProjectSelect}
            />
          )}
          
          {/* メインコンテンツ */}
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            {renderMainContent()}
          </Box>
        </Box>

        {/* タスク編集ダイアログ */}
        <TaskEditDialog
          open={taskEditDialogOpen}
          task={selectedTask}
          onClose={() => setTaskEditDialogOpen(false)}
          onSave={handleTaskSave}
          members={sampleMembers}
        />
      </Box>
    </ThemeProvider>
  );
}

export default App;
