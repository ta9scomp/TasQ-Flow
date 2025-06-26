import React, { createContext, useContext, useEffect, useState } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import type { WebSocketMessage } from '../hooks/useWebSocket';
import { useAppStore } from '../stores/useAppStore';
import type { Task } from '../types/task';

interface ConflictInfo {
  id: string;
  type: 'task_edit' | 'task_delete' | 'project_edit';
  resourceId: string;
  conflictingUser: string;
  timestamp: number;
  currentVersion: any;
  incomingVersion: any;
}

interface RealtimeContextType {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  onlineUsers: string[];
  conflicts: ConflictInfo[];
  connect: () => void;
  disconnect: () => void;
  broadcastTaskUpdate: (task: Task) => void;
  broadcastTaskCreate: (task: Task) => void;
  broadcastTaskDelete: (taskId: string) => void;
  resolveConflict: (conflictId: string, resolution: 'accept' | 'reject') => void;
}

const RealtimeContext = createContext<RealtimeContextType | null>(null);

interface RealtimeProviderProps {
  children: React.ReactNode;
  enabled?: boolean;
  serverUrl?: string;
}

export const RealtimeProvider: React.FC<RealtimeProviderProps> = ({
  children,
  enabled = false, // デフォルトは無効（実際のWebSocketサーバーが必要なため）
  serverUrl = 'ws://localhost:8080/ws',
}) => {
  const { selectedTeamId, selectedProjectId, updateTask, addTask, deleteTask } = useAppStore();
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [conflicts, setConflicts] = useState<ConflictInfo[]>([]);

  // WebSocket接続の処理
  const handleMessage = (message: WebSocketMessage) => {
    console.log('Received realtime message:', message);

    switch (message.type) {
      case 'task_update':
        // 競合検知
        if (message.userId !== 'current_user') { // TODO: 実際のユーザーIDと比較
          const existingTask = useAppStore.getState().tasks.find(t => t.id === message.payload.id);
          if (existingTask && hasConflict(existingTask, message.payload)) {
            const conflict: ConflictInfo = {
              id: `conflict_${Date.now()}`,
              type: 'task_edit',
              resourceId: message.payload.id,
              conflictingUser: message.userId,
              timestamp: message.timestamp,
              currentVersion: existingTask,
              incomingVersion: message.payload,
            };
            setConflicts(prev => [...prev, conflict]);
          } else {
            updateTask(message.payload.id, message.payload);
          }
        }
        break;

      case 'task_create':
        if (message.userId !== 'current_user') {
          addTask(message.payload);
        }
        break;

      case 'task_delete':
        if (message.userId !== 'current_user') {
          deleteTask(message.payload.taskId);
        }
        break;

      case 'member_join':
        setOnlineUsers(prev => {
          if (!prev.includes(message.userId)) {
            return [...prev, message.userId];
          }
          return prev;
        });
        break;

      case 'member_leave':
        setOnlineUsers(prev => prev.filter(user => user !== message.userId));
        break;

      case 'conflict_detected':
        const conflictInfo: ConflictInfo = {
          id: message.payload.conflictId,
          type: message.payload.type,
          resourceId: message.payload.resourceId,
          conflictingUser: message.userId,
          timestamp: message.timestamp,
          currentVersion: message.payload.currentVersion,
          incomingVersion: message.payload.incomingVersion,
        };
        setConflicts(prev => [...prev, conflictInfo]);
        break;

      case 'heartbeat':
        // ハートビートに対する応答（必要に応じて）
        break;
    }
  };

  // 競合検知ロジック
  const hasConflict = (current: Task, incoming: Task): boolean => {
    // 簡単な競合検知：最終更新時間の比較
    // 実際の実装では、より詳細なフィールド比較が必要
    const currentTimestamp = (current as any).lastModified || 0;
    const incomingTimestamp = (incoming as any).lastModified || 0;
    
    return Math.abs(currentTimestamp - incomingTimestamp) < 5000; // 5秒以内の更新は競合とみなす
  };

  const webSocket = useWebSocket({
    url: serverUrl,
    onMessage: handleMessage,
    onConnect: () => {
      console.log('Realtime connection established');
      // チーム・プロジェクト参加通知
      if (selectedTeamId) {
        webSocket.sendMessage({
          type: 'member_join',
          payload: { teamId: selectedTeamId, projectId: selectedProjectId },
          userId: 'current_user',
          teamId: selectedTeamId,
          projectId: selectedProjectId,
        });
      }
    },
    onDisconnect: () => {
      console.log('Realtime connection lost');
      setOnlineUsers([]);
    },
    onError: (error) => {
      console.error('Realtime connection error:', error);
    },
  });

  // チーム・プロジェクト変更時の再接続
  useEffect(() => {
    if (enabled && selectedTeamId && webSocket.isConnected) {
      webSocket.sendMessage({
        type: 'member_join',
        payload: { teamId: selectedTeamId, projectId: selectedProjectId },
        userId: 'current_user',
        teamId: selectedTeamId,
        projectId: selectedProjectId,
      });
    }
  }, [selectedTeamId, selectedProjectId, enabled, webSocket.isConnected]);

  // リアルタイム通信用の関数
  const broadcastTaskUpdate = (task: Task) => {
    if (enabled && webSocket.isConnected) {
      webSocket.sendMessage({
        type: 'task_update',
        payload: { ...task, lastModified: Date.now() },
        userId: 'current_user',
        teamId: selectedTeamId,
        projectId: selectedProjectId,
      });
    }
  };

  const broadcastTaskCreate = (task: Task) => {
    if (enabled && webSocket.isConnected) {
      webSocket.sendMessage({
        type: 'task_create',
        payload: task,
        userId: 'current_user',
        teamId: selectedTeamId,
        projectId: selectedProjectId,
      });
    }
  };

  const broadcastTaskDelete = (taskId: string) => {
    if (enabled && webSocket.isConnected) {
      webSocket.sendMessage({
        type: 'task_delete',
        payload: { taskId },
        userId: 'current_user',
        teamId: selectedTeamId,
        projectId: selectedProjectId,
      });
    }
  };

  const resolveConflict = (conflictId: string, resolution: 'accept' | 'reject') => {
    const conflict = conflicts.find(c => c.id === conflictId);
    if (!conflict) return;

    if (resolution === 'accept') {
      // 受信バージョンを採用
      updateTask(conflict.resourceId, conflict.incomingVersion);
    }
    // rejectの場合は現在のバージョンを維持

    // 競合を解決済みとしてリストから削除
    setConflicts(prev => prev.filter(c => c.id !== conflictId));
  };

  const contextValue: RealtimeContextType = {
    isConnected: enabled ? webSocket.isConnected : false,
    isConnecting: enabled ? webSocket.isConnecting : false,
    error: enabled ? webSocket.error : null,
    onlineUsers,
    conflicts,
    connect: () => enabled && webSocket.connect(),
    disconnect: webSocket.disconnect,
    broadcastTaskUpdate,
    broadcastTaskCreate,
    broadcastTaskDelete,
    resolveConflict,
  };

  return (
    <RealtimeContext.Provider value={contextValue}>
      {children}
    </RealtimeContext.Provider>
  );
};

export const useRealtime = () => {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
};

// 開発用のモックプロバイダー（WebSocketサーバーなしでテスト可能）
export const MockRealtimeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const mockValue: RealtimeContextType = {
    isConnected: false,
    isConnecting: false,
    error: 'リアルタイム同期は開発中です（WebSocketサーバーが必要）',
    onlineUsers: ['mock_user_1', 'mock_user_2'],
    conflicts: [],
    connect: () => console.log('Mock: リアルタイム接続（実装準備中）'),
    disconnect: () => console.log('Mock: リアルタイム切断'),
    broadcastTaskUpdate: (task) => console.log('Mock: タスク更新ブロードキャスト', task),
    broadcastTaskCreate: (task) => console.log('Mock: タスク作成ブロードキャスト', task),
    broadcastTaskDelete: (taskId) => console.log('Mock: タスク削除ブロードキャスト', taskId),
    resolveConflict: (conflictId, resolution) => console.log('Mock: 競合解決', { conflictId, resolution }),
  };

  return (
    <RealtimeContext.Provider value={mockValue}>
      {children}
    </RealtimeContext.Provider>
  );
};