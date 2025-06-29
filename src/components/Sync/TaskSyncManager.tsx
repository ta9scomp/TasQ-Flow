import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useRealtime } from '../../contexts/RealtimeContext';
import { useAppStore } from '../../stores/useAppStore';
import type { Task } from '../../types/task';

// 同期キューアイテム
interface SyncQueueItem {
  id: string;
  type: 'create' | 'update' | 'delete';
  taskData?: Task;
  taskId?: string;
  timestamp: number;
  retryCount: number;
  priority: 'low' | 'medium' | 'high';
}

// 同期状態
interface SyncState {
  isOnline: boolean;
  isSyncing: boolean;
  queueSize: number;
  lastSyncTime: number;
  syncErrors: Array<{
    id: string;
    error: string;
    timestamp: number;
  }>;
  conflictCount: number;
}

interface TaskSyncManagerProps {
  children?: React.ReactNode;
  autoSyncInterval?: number; // 自動同期間隔（ミリ秒）
  maxRetries?: number;
  onSyncStateChange?: (state: SyncState) => void;
}

export const TaskSyncManager: React.FC<TaskSyncManagerProps> = ({
  children,
  autoSyncInterval = 30000, // 30秒間隔
  maxRetries = 3,
  onSyncStateChange,
}) => {
  const { 
    isConnected, 
    conflicts,
    broadcastTaskUpdate, 
    broadcastTaskCreate, 
    broadcastTaskDelete 
  } = useRealtime();
  
  const { selectedTeamId, selectedProjectId } = useAppStore();
  
  // 同期キュー（オフライン時の操作を保存）
  const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>([]);
  const [syncState, setSyncState] = useState<SyncState>({
    isOnline: isConnected,
    isSyncing: false,
    queueSize: 0,
    lastSyncTime: 0,
    syncErrors: [],
    conflictCount: 0,
  });
  
  const syncTimerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const processingRef = useRef(false);

  // 同期状態の更新
  const updateSyncState = useCallback((updates: Partial<SyncState>) => {
    setSyncState(prev => {
      const newState = { ...prev, ...updates };
      onSyncStateChange?.(newState);
      return newState;
    });
  }, [onSyncStateChange]);

  // オンライン状態の監視
  useEffect(() => {
    updateSyncState({ 
      isOnline: isConnected,
      conflictCount: conflicts.length 
    });
    
    // オンラインになったときに自動同期を実行
    if (isConnected && syncQueue.length > 0) {
      processSyncQueue();
    }
  }, [isConnected, conflicts.length]);

  // キューサイズの更新
  useEffect(() => {
    updateSyncState({ queueSize: syncQueue.length });
  }, [syncQueue.length]);

  // 自動同期タイマー
  useEffect(() => {
    if (autoSyncInterval > 0) {
      syncTimerRef.current = setInterval(() => {
        if (isConnected && syncQueue.length > 0) {
          processSyncQueue();
        }
      }, autoSyncInterval);
    }

    return () => {
      if (syncTimerRef.current) {
        clearInterval(syncTimerRef.current);
      }
    };
  }, [autoSyncInterval, isConnected, syncQueue.length]);

  // キューアイテムの追加 (for future use)
  // const addToQueue = useCallback((item: Omit<SyncQueueItem, 'id' | 'timestamp' | 'retryCount'>) => {
  //   const queueItem: SyncQueueItem = { ...item, id: `sync_${Date.now()}_${Math.random()}`, timestamp: Date.now(), retryCount: 0 };
  //
  //   setSyncQueue(prev => {
  //     // 重複する操作を統合（同じタスクの複数の更新など）
  //     const filtered = prev.filter(existing => {
  //       if (existing.type === 'update' && item.type === 'update' && 
  //           existing.taskData?.id === item.taskData?.id) {
  //         return false; // 古い更新を削除
  //       }
  //       return true;
  //     });
  //
  //     // 優先度に基づいてソート
  //     const newQueue = [...filtered, queueItem].sort((a, b) => {
  //       const priorityOrder = { high: 3, medium: 2, low: 1 };
  //       return priorityOrder[b.priority] - priorityOrder[a.priority];
  //     });
  //
  //     return newQueue;
  //   });
  //
  //   // オンラインかつアイドル状態なら即座に処理
  //   if (isConnected && !processingRef.current) {
  //     processSyncQueue();
  //   }
  // }, [isConnected]);

  // 同期キューの処理
  const processSyncQueue = useCallback(async () => {
    if (processingRef.current || !isConnected || syncQueue.length === 0) {
      return;
    }

    processingRef.current = true;
    updateSyncState({ isSyncing: true });

    try {
      // バッチ処理：一度に最大10個のアイテムを処理
      const batchSize = 10;
      const batch = syncQueue.slice(0, batchSize);
      const errors: Array<{ id: string; error: string; timestamp: number }> = [];

      for (const item of batch) {
        try {
          await processSyncItem(item);
          
          // 成功したアイテムをキューから削除
          setSyncQueue(prev => prev.filter(q => q.id !== item.id));
          
        } catch (error) {
          console.error('Sync item failed:', { item, error });
          
          // リトライ回数を増やして再キューイング
          if (item.retryCount < maxRetries) {
            setSyncQueue(prev => prev.map(q => 
              q.id === item.id 
                ? { ...q, retryCount: q.retryCount + 1 }
                : q
            ));
          } else {
            // 最大リトライ回数に達したら失敗として記録
            errors.push({
              id: item.id,
              error: error instanceof Error ? error.message : String(error),
              timestamp: Date.now(),
            });
            
            setSyncQueue(prev => prev.filter(q => q.id !== item.id));
          }
        }
      }

      // エラーがあれば記録
      if (errors.length > 0) {
        updateSyncState({ 
          syncErrors: [...syncState.syncErrors, ...errors].slice(-50) // 最新50件まで保持
        });
      }

      updateSyncState({ lastSyncTime: Date.now() });

    } finally {
      processingRef.current = false;
      updateSyncState({ isSyncing: false });
    }
  }, [isConnected, syncQueue, maxRetries, syncState.syncErrors]);

  // 個別同期アイテムの処理
  const processSyncItem = async (item: SyncQueueItem): Promise<void> => {
    switch (item.type) {
      case 'create':
        if (item.taskData) {
          await new Promise(resolve => {
            broadcastTaskCreate(item.taskData!);
            // 実際の実装では、サーバーからの応答を待つ
            setTimeout(resolve, 100);
          });
        }
        break;

      case 'update':
        if (item.taskData) {
          await new Promise(resolve => {
            broadcastTaskUpdate(item.taskData!);
            setTimeout(resolve, 100);
          });
        }
        break;

      case 'delete':
        if (item.taskId) {
          await new Promise(resolve => {
            broadcastTaskDelete(item.taskId!);
            setTimeout(resolve, 100);
          });
        }
        break;

      default:
        throw new Error(`Unknown sync item type: ${item.type}`);
    }
  };

  // 公開API（将来利用予定）
  // const syncTaskCreate = useCallback((task: Task, priority: SyncQueueItem['priority'] = 'medium') => {
  //   console.log('TaskSyncManager: Queueing task create', { taskId: task.id, priority });
  //   addToQueue({ type: 'create', taskData: task, priority });
  // }, [addToQueue]);
  // const syncTaskUpdate = useCallback((task: Task, priority: SyncQueueItem['priority'] = 'medium') => {
  //   console.log('TaskSyncManager: Queueing task update', { taskId: task.id, priority });
  //   addToQueue({ type: 'update', taskData: task, priority });
  // }, [addToQueue]);
  // const syncTaskDelete = useCallback((taskId: string, priority: SyncQueueItem['priority'] = 'medium') => {
  //   console.log('TaskSyncManager: Queueing task delete', { taskId, priority });
  //   addToQueue({ type: 'delete', taskId, priority });
  // }, [addToQueue]);
  // const forcSync = useCallback(() => {
  //   console.log('TaskSyncManager: Force sync requested');
  //   if (syncQueue.length > 0) { processSyncQueue(); }
  // }, [processSyncQueue, syncQueue.length]);
  // const clearSyncQueue = useCallback(() => {
  //   console.log('TaskSyncManager: Clearing sync queue');
  //   setSyncQueue([]); updateSyncState({ syncErrors: [] });
  // }, []);

  // デバッグ情報の出力
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('TaskSyncManager State:', {
        syncState,
        queueItems: syncQueue.length,
        isProcessing: processingRef.current,
        selectedTeamId,
        selectedProjectId,
      });
    }
  }, [syncState, syncQueue.length, selectedTeamId, selectedProjectId]);

  // TaskSyncManager機能を子コンポーネントに提供 (for future use)
  // const taskSyncAPI = {
  //   syncTaskCreate,
  //   syncTaskUpdate,
  //   syncTaskDelete,
  //   forcSync,
  //   clearSyncQueue,
  //   syncState,
  // };

  // contextとしてAPIを提供（必要に応じて）
  return (
    <>
      {children}
      {/* デバッグ用の同期状態表示 */}
      {process.env.NODE_ENV === 'development' && (
        <div
          style={{
            position: 'fixed',
            bottom: 16,
            left: 16,
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: 4,
            fontSize: '12px',
            zIndex: 9999,
            fontFamily: 'monospace',
            maxWidth: 300,
          }}
        >
          <div>🔄 TaskSync: {syncState.isOnline ? '🟢' : '🔴'}</div>
          <div>Queue: {syncState.queueSize} | Conflicts: {syncState.conflictCount}</div>
          {syncState.isSyncing && <div>⚡ Syncing...</div>}
          {syncState.syncErrors.length > 0 && (
            <div>❌ Errors: {syncState.syncErrors.length}</div>
          )}
          <div>Last: {syncState.lastSyncTime ? new Date(syncState.lastSyncTime).toLocaleTimeString() : 'Never'}</div>
        </div>
      )}
    </>
  );
};

// TaskSyncManagerのインスタンスをグローバルに提供するヘルパー
let globalTaskSyncManager: {
  syncTaskCreate: (task: Task, priority?: SyncQueueItem['priority']) => void;
  syncTaskUpdate: (task: Task, priority?: SyncQueueItem['priority']) => void;
  syncTaskDelete: (taskId: string, priority?: SyncQueueItem['priority']) => void;
  forcSync: () => void;
  clearSyncQueue: () => void;
} | null = null;

export const setGlobalTaskSyncManager = (manager: any) => {
  globalTaskSyncManager = manager;
};

export const getGlobalTaskSyncManager = () => globalTaskSyncManager;