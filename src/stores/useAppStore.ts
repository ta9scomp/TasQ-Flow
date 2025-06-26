import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Task, Member, Project, ProjectTeam } from '../types/task';
import { sampleTasks, sampleMembers } from '../data/sampleData';
import { sampleProjectTeams } from '../data/sampleProjectTeams';

export interface ViewMode {
  mode: 'gantt' | 'members' | 'sticky' | 'todo' | 'history' | 'settings';
}

interface AppState {
  // Navigation state
  selectedView: 'home' | 'teams';
  selectedTeamId?: string;
  selectedProjectId?: string;
  viewMode: ViewMode['mode'];
  sidebarOpen: boolean;

  // Data
  tasks: Task[];
  members: Member[];
  projectTeams: ProjectTeam[];
  
  // Search
  searchQuery: string;
  searchFilters: Array<{
    type: 'member' | 'tag' | 'progress' | 'priority' | 'status' | 'capacity';
    value: string;
    label: string;
  }>;

  // Actions
  setSelectedView: (view: 'home' | 'teams') => void;
  setSelectedTeamId: (teamId?: string) => void;
  setSelectedProjectId: (projectId?: string) => void;
  setViewMode: (mode: ViewMode['mode']) => void;
  setSidebarOpen: (open: boolean) => void;
  
  // Data actions
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  addTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  setTasks: (tasks: Task[]) => void;
  setMembers: (members: Member[]) => void;
  
  // Search actions
  setSearchQuery: (query: string) => void;
  setSearchFilters: (filters: AppState['searchFilters']) => void;
  
  // Utility actions
  getSelectedProject: () => Project | undefined;
  getSelectedTeam: () => ProjectTeam | undefined;
  reset: () => void;
}

const initialState = {
  selectedView: 'teams' as const, // デバッグ用に一時的に変更
  selectedTeamId: 'team1', // デバッグ用に一時的に設定
  selectedProjectId: undefined,
  viewMode: 'gantt' as const,
  sidebarOpen: true,
  
  tasks: sampleTasks,
  members: sampleMembers,
  projectTeams: sampleProjectTeams,
  
  searchQuery: '',
  searchFilters: [],
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Navigation actions
      setSelectedView: (view) => {
        set({ selectedView: view });
        if (view === 'home') {
          set({ selectedTeamId: undefined, selectedProjectId: undefined });
        }
      },

      setSelectedTeamId: (teamId) => {
        set({ 
          selectedTeamId: teamId,
          selectedProjectId: undefined,
          selectedView: teamId ? 'teams' : 'home'
        });
      },

      setSelectedProjectId: (projectId) => {
        set({ 
          selectedProjectId: projectId,
          viewMode: projectId ? 'gantt' : 'gantt'
        });
      },

      setViewMode: (mode) => set({ viewMode: mode }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      // Data actions
      updateTask: (taskId, updates) => {
        set((state) => ({
          tasks: state.tasks.map(task =>
            task.id === taskId ? { ...task, ...updates } : task
          ),
        }));
        
        // プロジェクトチーム内のタスクも更新
        set((state) => ({
          projectTeams: state.projectTeams.map(team => ({
            ...team,
            projects: team.projects.map(project => ({
              ...project,
              tasks: project.tasks.map(task =>
                task.id === taskId ? { ...task, ...updates } : task
              ),
            })),
          })),
        }));
      },

      addTask: (task) => {
        set((state) => ({
          tasks: [...state.tasks, task],
        }));
        
        // 選択中のプロジェクトにもタスクを追加
        const { selectedProjectId, selectedTeamId } = get();
        if (selectedProjectId && selectedTeamId) {
          set((state) => ({
            projectTeams: state.projectTeams.map(team =>
              team.id === selectedTeamId
                ? {
                    ...team,
                    projects: team.projects.map(project =>
                      project.id === selectedProjectId
                        ? { ...project, tasks: [...project.tasks, task] }
                        : project
                    ),
                  }
                : team
            ),
          }));
        }
      },

      deleteTask: (taskId) => {
        set((state) => ({
          tasks: state.tasks.filter(task => task.id !== taskId),
        }));
        
        // プロジェクトチーム内のタスクも削除
        set((state) => ({
          projectTeams: state.projectTeams.map(team => ({
            ...team,
            projects: team.projects.map(project => ({
              ...project,
              tasks: project.tasks.filter(task => task.id !== taskId),
            })),
          })),
        }));
      },

      setTasks: (tasks) => {
        set({ tasks });
      },

      setMembers: (members) => {
        set({ members });
      },

      // Search actions
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSearchFilters: (filters) => set({ searchFilters: filters }),

      // Utility actions
      getSelectedProject: () => {
        const { selectedProjectId, projectTeams } = get();
        if (!selectedProjectId) return undefined;
        
        for (const team of projectTeams) {
          const project = team.projects.find(p => p.id === selectedProjectId);
          if (project) return project;
        }
        return undefined;
      },

      getSelectedTeam: () => {
        const { selectedTeamId, projectTeams } = get();
        if (!selectedTeamId) return undefined;
        return projectTeams.find(team => team.id === selectedTeamId);
      },

      reset: () => set(initialState),
    }),
    {
      name: 'tasq-flow-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedView: state.selectedView,
        selectedTeamId: state.selectedTeamId,
        selectedProjectId: state.selectedProjectId,
        viewMode: state.viewMode,
        sidebarOpen: state.sidebarOpen,
        searchQuery: state.searchQuery,
        searchFilters: state.searchFilters,
        // tasks, members, projectTeamsは永続化しない（サンプルデータのため）
      }),
    }
  )
);