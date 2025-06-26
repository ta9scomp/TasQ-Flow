import React, { useCallback, useMemo } from 'react';
import { useAppStore } from '../../stores/useAppStore';
import type { Task } from '../../types/task';

// 階層構造用のヘルパー型
interface HierarchicalTask extends Task {
  childTasks?: HierarchicalTask[];
  depth: number;
  hasChildren: boolean;
}

interface TaskHierarchyManagerProps {
  tasks: Task[];
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
  onTaskCreate?: (parentId?: string) => void;
  onTaskDelete?: (taskId: string) => void;
  children: (hierarchyAPI: TaskHierarchyAPI) => React.ReactNode;
}

interface TaskHierarchyAPI {
  // 階層構造データ
  hierarchicalTasks: HierarchicalTask[];
  
  // 操作API
  createTaskGroup: (title: string, parentId?: string) => string;
  createChildTask: (parentId: string, title: string) => string;
  convertToGroup: (taskId: string) => boolean;
  convertToTask: (taskId: string) => boolean;
  moveTask: (taskId: string, newParentId?: string) => boolean;
  deleteTaskWithChildren: (taskId: string) => boolean;
  
  // 階層操作
  expandGroup: (groupId: string) => void;
  collapseGroup: (groupId: string) => void;
  toggleGroup: (groupId: string) => void;
  
  // 計算・ヘルパー
  calculateGroupProgress: (groupId: string) => number;
  isGroupCollapsed: (groupId: string) => boolean;
  getTaskDepth: (taskId: string) => number;
  getChildTasks: (parentId: string) => Task[];
  getRootTasks: () => Task[];
  validateHierarchy: () => { isValid: boolean; errors: string[] };
  
  // 表示ヘルパー
  getVisibleTasks: () => HierarchicalTask[];
  getTaskPath: (taskId: string) => Task[];
}

export const TaskHierarchyManager: React.FC<TaskHierarchyManagerProps> = ({
  tasks,
  onTaskUpdate,
  onTaskCreate,
  onTaskDelete,
  children,
}) => {
  const { updateTask, addTask, deleteTask } = useAppStore();

  // タスクのマップ化
  const taskMap = useMemo(() => {
    const map = new Map<string, Task>();
    tasks.forEach(task => map.set(task.id, task));
    return map;
  }, [tasks]);

  // 階層構造の構築
  const hierarchicalTasks = useMemo((): HierarchicalTask[] => {
    const buildHierarchy = (parentId?: string, depth = 0): HierarchicalTask[] => {
      return tasks
        .filter(task => task.parentId === parentId)
        .map(task => {
          const childTasks = task.isGroup ? buildHierarchy(task.id, depth + 1) : [];
          
          return {
            ...task,
            childTasks,
            depth,
            hasChildren: childTasks.length > 0,
          };
        });
    };

    return buildHierarchy();
  }, [tasks]);

  // タスクグループの作成
  const createTaskGroup = useCallback((title: string, parentId?: string): string => {
    // 1階層制限の検証
    if (parentId) {
      const parent = taskMap.get(parentId);
      if (parent && parent.level !== undefined && parent.level >= 1) {
        console.warn('Cannot create group: Maximum hierarchy depth exceeded');
        return '';
      }
    }

    const newTask: Task = {
      id: `group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      startDate: new Date(),
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1日後
      progress: 0,
      priority: 50,
      status: 'notStarted',
      assignees: [],
      tags: [],
      parentId,
      isGroup: true,
      level: parentId ? 1 : 0,
      children: [],
      collapsed: false,
    };

    if (onTaskCreate) {
      onTaskCreate(parentId);
    } else {
      addTask(newTask);
    }

    console.log('TaskHierarchyManager: Created task group', { id: newTask.id, title, parentId });
    return newTask.id;
  }, [taskMap, addTask, onTaskCreate]);

  // 子タスクの作成
  const createChildTask = useCallback((parentId: string, title: string): string => {
    const parent = taskMap.get(parentId);
    if (!parent) {
      console.warn('Cannot create child task: Parent not found', parentId);
      return '';
    }

    // 親がグループでない場合は先にグループに変換
    if (!parent.isGroup) {
      convertToGroup(parentId);
    }

    const newTask: Task = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      startDate: parent.startDate,
      endDate: parent.endDate,
      progress: 0,
      priority: parent.priority,
      status: 'notStarted',
      assignees: [],
      tags: [],
      parentId,
      isGroup: false,
      level: 1,
    };

    // 親の子リストに追加
    const updatedChildren = [...(parent.children || []), newTask.id];
    
    if (onTaskUpdate) {
      onTaskUpdate(parentId, { children: updatedChildren });
    } else {
      updateTask(parentId, { children: updatedChildren });
    }

    if (onTaskCreate) {
      onTaskCreate(parentId);
    } else {
      addTask(newTask);
    }

    console.log('TaskHierarchyManager: Created child task', { id: newTask.id, title, parentId });
    return newTask.id;
  }, [taskMap, updateTask, addTask, onTaskUpdate, onTaskCreate]);

  // タスクをグループに変換
  const convertToGroup = useCallback((taskId: string): boolean => {
    const task = taskMap.get(taskId);
    if (!task || task.isGroup) {
      return false;
    }

    const updates: Partial<Task> = {
      isGroup: true,
      children: [],
      collapsed: false,
    };

    if (onTaskUpdate) {
      onTaskUpdate(taskId, updates);
    } else {
      updateTask(taskId, updates);
    }

    console.log('TaskHierarchyManager: Converted task to group', taskId);
    return true;
  }, [taskMap, updateTask, onTaskUpdate]);

  // グループを通常タスクに変換
  const convertToTask = useCallback((taskId: string): boolean => {
    const task = taskMap.get(taskId);
    if (!task || !task.isGroup) {
      return false;
    }

    // 子タスクがある場合は変換を拒否
    if (task.children && task.children.length > 0) {
      console.warn('Cannot convert group to task: Group has children');
      return false;
    }

    const updates: Partial<Task> = {
      isGroup: false,
      children: undefined,
      collapsed: undefined,
    };

    if (onTaskUpdate) {
      onTaskUpdate(taskId, updates);
    } else {
      updateTask(taskId, updates);
    }

    console.log('TaskHierarchyManager: Converted group to task', taskId);
    return true;
  }, [taskMap, updateTask, onTaskUpdate]);

  // タスクの移動
  const moveTask = useCallback((taskId: string, newParentId?: string): boolean => {
    const task = taskMap.get(taskId);
    if (!task) {
      return false;
    }

    // 1階層制限の検証
    if (newParentId) {
      const newParent = taskMap.get(newParentId);
      if (!newParent || newParent.level !== 0) {
        console.warn('Cannot move task: Target parent is not a root level task');
        return false;
      }

      // 自己参照や循環参照の防止
      if (newParentId === taskId || task.children?.includes(newParentId)) {
        console.warn('Cannot move task: Would create circular reference');
        return false;
      }
    }

    // 古い親から削除
    if (task.parentId) {
      const oldParent = taskMap.get(task.parentId);
      if (oldParent && oldParent.children) {
        const updatedChildren = oldParent.children.filter(id => id !== taskId);
        if (onTaskUpdate) {
          onTaskUpdate(oldParent.id, { children: updatedChildren });
        } else {
          updateTask(oldParent.id, { children: updatedChildren });
        }
      }
    }

    // 新しい親に追加
    if (newParentId) {
      const newParent = taskMap.get(newParentId);
      if (newParent) {
        // 親をグループに変換（必要な場合）
        if (!newParent.isGroup) {
          convertToGroup(newParentId);
        }

        const updatedChildren = [...(newParent.children || []), taskId];
        if (onTaskUpdate) {
          onTaskUpdate(newParentId, { children: updatedChildren });
        } else {
          updateTask(newParentId, { children: updatedChildren });
        }
      }
    }

    // タスク自体の更新
    const updates: Partial<Task> = {
      parentId: newParentId,
      level: newParentId ? 1 : 0,
    };

    if (onTaskUpdate) {
      onTaskUpdate(taskId, updates);
    } else {
      updateTask(taskId, updates);
    }

    console.log('TaskHierarchyManager: Moved task', { taskId, newParentId });
    return true;
  }, [taskMap, updateTask, onTaskUpdate, convertToGroup]);

  // タスクと子タスクを削除
  const deleteTaskWithChildren = useCallback((taskId: string): boolean => {
    const task = taskMap.get(taskId);
    if (!task) {
      return false;
    }

    // 子タスクを再帰的に削除
    if (task.children) {
      task.children.forEach(childId => {
        deleteTaskWithChildren(childId);
      });
    }

    // 親の子リストから削除
    if (task.parentId) {
      const parent = taskMap.get(task.parentId);
      if (parent && parent.children) {
        const updatedChildren = parent.children.filter(id => id !== taskId);
        if (onTaskUpdate) {
          onTaskUpdate(parent.id, { children: updatedChildren });
        } else {
          updateTask(parent.id, { children: updatedChildren });
        }
      }
    }

    // タスク削除
    if (onTaskDelete) {
      onTaskDelete(taskId);
    } else {
      deleteTask(taskId);
    }

    console.log('TaskHierarchyManager: Deleted task with children', taskId);
    return true;
  }, [taskMap, updateTask, deleteTask, onTaskUpdate, onTaskDelete]);

  // グループの展開・折りたたみ
  const expandGroup = useCallback((groupId: string) => {
    if (onTaskUpdate) {
      onTaskUpdate(groupId, { collapsed: false });
    } else {
      updateTask(groupId, { collapsed: false });
    }
  }, [updateTask, onTaskUpdate]);

  const collapseGroup = useCallback((groupId: string) => {
    if (onTaskUpdate) {
      onTaskUpdate(groupId, { collapsed: true });
    } else {
      updateTask(groupId, { collapsed: true });
    }
  }, [updateTask, onTaskUpdate]);

  const toggleGroup = useCallback((groupId: string) => {
    const task = taskMap.get(groupId);
    if (task && task.isGroup) {
      if (task.collapsed) {
        expandGroup(groupId);
      } else {
        collapseGroup(groupId);
      }
    }
  }, [taskMap, expandGroup, collapseGroup]);

  // グループ進捗の計算
  const calculateGroupProgress = useCallback((groupId: string): number => {
    const group = taskMap.get(groupId);
    if (!group || !group.isGroup || !group.children) {
      return 0;
    }

    const childTasks = group.children
      .map(id => taskMap.get(id))
      .filter(Boolean) as Task[];

    if (childTasks.length === 0) {
      return 0;
    }

    const totalProgress = childTasks.reduce((sum, child) => {
      return sum + (child.isGroup ? calculateGroupProgress(child.id) : child.progress);
    }, 0);

    return Math.round(totalProgress / childTasks.length);
  }, [taskMap]);

  // ユーティリティ関数
  const isGroupCollapsed = useCallback((groupId: string): boolean => {
    const group = taskMap.get(groupId);
    return !!(group?.collapsed);
  }, [taskMap]);

  const getTaskDepth = useCallback((taskId: string): number => {
    const task = taskMap.get(taskId);
    return task?.level ?? 0;
  }, [taskMap]);

  const getChildTasks = useCallback((parentId: string): Task[] => {
    const parent = taskMap.get(parentId);
    if (!parent?.children) {
      return [];
    }

    return parent.children
      .map(id => taskMap.get(id))
      .filter(Boolean) as Task[];
  }, [taskMap]);

  const getRootTasks = useCallback((): Task[] => {
    return tasks.filter(task => !task.parentId);
  }, [tasks]);

  // 階層構造の検証
  const validateHierarchy = useCallback((): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    tasks.forEach(task => {
      // 階層レベルの検証
      if (task.level !== undefined && task.level > 1) {
        errors.push(`Task ${task.id}: Exceeds maximum hierarchy depth (level: ${task.level})`);
      }

      // 親子関係の一貫性検証
      if (task.parentId) {
        const parent = taskMap.get(task.parentId);
        if (!parent) {
          errors.push(`Task ${task.id}: Parent ${task.parentId} not found`);
        } else if (!parent.isGroup) {
          errors.push(`Task ${task.id}: Parent ${task.parentId} is not a group`);
        } else if (!parent.children?.includes(task.id)) {
          errors.push(`Task ${task.id}: Not in parent's children list`);
        }
      }

      // グループタスクの検証
      if (task.isGroup && task.children) {
        task.children.forEach(childId => {
          const child = taskMap.get(childId);
          if (!child) {
            errors.push(`Group ${task.id}: Child ${childId} not found`);
          } else if (child.parentId !== task.id) {
            errors.push(`Group ${task.id}: Child ${childId} has incorrect parent`);
          }
        });
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  }, [tasks, taskMap]);

  // 表示用の可視タスク取得
  const getVisibleTasks = useCallback((): HierarchicalTask[] => {
    const filterVisible = (tasks: HierarchicalTask[]): HierarchicalTask[] => {
      return tasks.reduce((visible, task) => {
        visible.push(task);
        
        if (task.isGroup && !task.collapsed && task.childTasks) {
          visible.push(...filterVisible(task.childTasks));
        }
        
        return visible;
      }, [] as HierarchicalTask[]);
    };

    return filterVisible(hierarchicalTasks);
  }, [hierarchicalTasks]);

  // タスクのパス取得
  const getTaskPath = useCallback((taskId: string): Task[] => {
    const path: Task[] = [];
    let currentTask = taskMap.get(taskId);

    while (currentTask) {
      path.unshift(currentTask);
      currentTask = currentTask.parentId ? taskMap.get(currentTask.parentId) : undefined;
    }

    return path;
  }, [taskMap]);

  // API オブジェクトの構築
  const hierarchyAPI: TaskHierarchyAPI = {
    hierarchicalTasks,
    createTaskGroup,
    createChildTask,
    convertToGroup,
    convertToTask,
    moveTask,
    deleteTaskWithChildren,
    expandGroup,
    collapseGroup,
    toggleGroup,
    calculateGroupProgress,
    isGroupCollapsed,
    getTaskDepth,
    getChildTasks,
    getRootTasks,
    validateHierarchy,
    getVisibleTasks,
    getTaskPath,
  };

  return <>{children(hierarchyAPI)}</>;
};

// デバッグ用のヘルパー関数
export const debugTaskHierarchy = (tasks: Task[]) => {
  console.group('🔍 Task Hierarchy Debug');
  
  const printTask = (task: Task, indent = 0) => {
    const prefix = '  '.repeat(indent);
    const icon = task.isGroup ? '📁' : '📋';
    console.log(`${prefix}${icon} ${task.title} (${task.id})`);
    
    if (task.children) {
      task.children.forEach(childId => {
        const child = tasks.find(t => t.id === childId);
        if (child) {
          printTask(child, indent + 1);
        } else {
          console.log(`${prefix}  ❌ Missing child: ${childId}`);
        }
      });
    }
  };

  const rootTasks = tasks.filter(task => !task.parentId);
  rootTasks.forEach(task => printTask(task));
  
  console.groupEnd();
};