import type { ProjectTeam, Project } from '../types/task';
import { sampleMembers, sampleTasks } from './sampleData';
import { addDays } from 'date-fns';

const today = new Date();

// プロジェクトデータ
export const sampleProjects: Project[] = [
  {
    id: 'project1',
    name: 'TasQ Flow開発プロジェクト',
    description: 'ガントチャートベースのタスク管理アプリケーション開発',
    members: sampleMembers,
    tasks: sampleTasks,
    createdAt: new Date(),
    updatedAt: new Date(),
    teamId: 'team1',
    color: '#2196F3',
    status: 'active',
    progress: 65,
  },
  {
    id: 'project2',
    name: 'UIリニューアルプロジェクト',
    description: 'ユーザーインターフェースの全面刷新',
    members: [sampleMembers[0], sampleMembers[1], sampleMembers[3]],
    tasks: [],
    createdAt: addDays(today, -15),
    updatedAt: new Date(),
    teamId: 'team1',
    color: '#FF9800',
    status: 'planning',
    progress: 25,
  },
  {
    id: 'project3',
    name: 'モバイルアプリ開発',
    description: 'スマートフォン向けアプリケーション開発',
    members: [sampleMembers[2], sampleMembers[3]],
    tasks: [],
    createdAt: addDays(today, -30),
    updatedAt: addDays(today, -5),
    teamId: 'team2',
    color: '#4CAF50',
    status: 'active',
    progress: 80,
  },
  {
    id: 'project4',
    name: 'データ分析基盤構築',
    description: 'ビッグデータ解析のためのインフラ構築',
    members: [sampleMembers[0], sampleMembers[2]],
    tasks: [],
    createdAt: addDays(today, -45),
    updatedAt: addDays(today, -10),
    teamId: 'team2',
    color: '#9C27B0',
    status: 'onHold',
    progress: 40,
  },
  {
    id: 'project5',
    name: 'セキュリティ強化プロジェクト',
    description: 'システム全体のセキュリティ向上',
    members: [sampleMembers[1], sampleMembers[3]],
    tasks: [],
    createdAt: addDays(today, -20),
    updatedAt: addDays(today, -2),
    teamId: 'team3',
    color: '#F44336',
    status: 'completed',
    progress: 100,
  },
];

// プロジェクトチームデータ
export const sampleProjectTeams: ProjectTeam[] = [
  {
    id: 'team1',
    name: 'フロントエンド開発チーム',
    description: 'ユーザーインターフェースとフロントエンド機能の開発を担当',
    color: '#2196F3',
    members: sampleMembers,
    projects: sampleProjects.filter(p => p.teamId === 'team1'),
    createdAt: addDays(today, -60),
    updatedAt: new Date(),
    isActive: true,
  },
  {
    id: 'team2',
    name: 'バックエンド・インフラチーム',
    description: 'サーバーサイド開発とインフラ構築を担当',
    color: '#4CAF50',
    members: [sampleMembers[0], sampleMembers[2], sampleMembers[3]],
    projects: sampleProjects.filter(p => p.teamId === 'team2'),
    createdAt: addDays(today, -90),
    updatedAt: addDays(today, -3),
    isActive: true,
  },
  {
    id: 'team3',
    name: 'セキュリティチーム',
    description: 'システムセキュリティとコンプライアンス対応',
    color: '#F44336',
    members: [sampleMembers[1], sampleMembers[3]],
    projects: sampleProjects.filter(p => p.teamId === 'team3'),
    createdAt: addDays(today, -120),
    updatedAt: addDays(today, -15),
    isActive: true,
  },
  {
    id: 'team4',
    name: 'QAチーム',
    description: '品質保証とテスト実行',
    color: '#FF9800',
    members: [sampleMembers[1], sampleMembers[2]],
    projects: [],
    createdAt: addDays(today, -40),
    updatedAt: addDays(today, -8),
    isActive: false,
  },
];

// プロジェクトチームIDでプロジェクトを取得するヘルパー関数
export const getProjectsByTeamId = (teamId: string): Project[] => {
  return sampleProjects.filter(project => project.teamId === teamId);
};

// プロジェクトチームIDでチーム情報を取得するヘルパー関数
export const getProjectTeamById = (teamId: string): ProjectTeam | undefined => {
  return sampleProjectTeams.find(team => team.id === teamId);
};

// プロジェクトIDでプロジェクト情報を取得するヘルパー関数
export const getProjectById = (projectId: string): Project | undefined => {
  return sampleProjects.find(project => project.id === projectId);
};