// タスク関連の型定義

export interface Task {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  progress: number; // 0-100
  priority: number; // 0-100
  status: 'notStarted' | 'inProgress' | 'completed' | 'onHold';
  assignees: string[];
  tags: string[];
  color?: string;
  parentId?: string;
  isGroup?: boolean;
  level?: number; // 階層レベル（0: ルート、1: 子タスク）
  children?: string[]; // 子タスクのID一覧
  collapsed?: boolean; // グループが折り畳まれているか
  description?: string;
  checklist?: ChecklistItem[];
  borderStyle?: {
    width: '1px' | '2px' | '3px';
    color: string;
    style: 'solid' | 'dashed' | 'dotted';
  };
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  order: number;
}

export interface TaskFog {
  id: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  color: string;
  borderStyle?: {
    width: '1px' | '2px' | '3px';
    color: string;
    style: 'solid' | 'dashed' | 'dotted';
  };
}

export interface Member {
  id: string;
  name: string;
  email: string;
  color: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  avatar?: string;
  permissions?: string[];
  isActive?: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  members: Member[];
  tasks: Task[];
  createdAt: Date;
  updatedAt: Date;
  teamId: string; // 所属プロジェクトチームID
  color?: string; // プロジェクト固有の色
  status: 'planning' | 'active' | 'onHold' | 'completed';
  progress: number; // 0-100
}

export interface ProjectTeam {
  id: string;
  name: string;
  description: string;
  color: string;
  members: Member[];
  projects: Project[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}