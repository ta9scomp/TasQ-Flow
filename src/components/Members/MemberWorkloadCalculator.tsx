import { useMemo } from 'react';
import { differenceInDays, isWithinInterval, parseISO, startOfDay, endOfDay } from 'date-fns';
import type { Member, Task } from '../../types/task';

// 稼働率計算方法の種類
export type WorkloadCalculationMethod = 
  | 'task-count'        // タスク数ベース
  | 'priority-weighted' // 優先度重み付け
  | 'duration-based'    // 期間ベース
  | 'effort-points'     // エフォートポイント
  | 'hybrid';           // ハイブリッド

// 稼働率データ
export interface WorkloadData {
  date: Date;
  capacity: number;           // 稼働率 (0-100%)
  totalTasks: number;         // 総タスク数
  activeTasks: Task[];        // その日にアクティブなタスク
  completedTasks: Task[];     // その日に完了したタスク
  overdueTasks: Task[];       // 期限切れタスク
  highPriorityTasks: Task[];  // 高優先度タスク
  isOverloaded: boolean;      // 過負荷フラグ
  workHours: number;          // 推定作業時間
  availability: 'available' | 'busy' | 'overloaded' | 'unavailable';
  metadata: {
    calculationMethod: WorkloadCalculationMethod;
    factors: WorkloadFactors;
    breakdown: {
      baseLoad: number;
      priorityBonus: number;
      overduePenalty: number;
      completionReduction: number;
    };
  };
}

// 稼働率計算に使用する要素
export interface WorkloadFactors {
  baseTaskWeight: number;      // タスク1つあたりの基本負荷 (1-50)
  priorityMultiplier: number;  // 優先度倍率 (0.5-3.0)
  overdueMultiplier: number;   // 期限切れ倍率 (1.0-2.5)
  completionReduction: number; // 完了時の負荷軽減 (0.1-0.8)
  maxDailyCapacity: number;    // 1日の最大稼働率 (80-120%)
  workingHoursPerDay: number;  // 1日の作業時間 (6-10時間)
}

// デフォルトの計算要素
const DEFAULT_FACTORS: WorkloadFactors = {
  baseTaskWeight: 15,
  priorityMultiplier: 1.5,
  overdueMultiplier: 1.8,
  completionReduction: 0.3,
  maxDailyCapacity: 100,
  workingHoursPerDay: 8,
};

// 稼働率計算の設定
export interface WorkloadCalculatorConfig {
  method: WorkloadCalculationMethod;
  factors: Partial<WorkloadFactors>;
  dateRange: {
    start: Date;
    end: Date;
  };
  includeWeekends: boolean;
  includePrivateTasks: boolean;
  overloadThreshold: number; // 過負荷と判定する稼働率 (70-100%)
}

export interface MemberWorkloadCalculatorProps {
  member: Member;
  tasks: Task[];
  config: WorkloadCalculatorConfig;
  children: (workloadData: WorkloadData[]) => React.ReactNode;
}

export const MemberWorkloadCalculator: React.FC<MemberWorkloadCalculatorProps> = ({
  member,
  tasks,
  config,
  children,
}) => {
  const mergedFactors: WorkloadFactors = {
    ...DEFAULT_FACTORS,
    ...config.factors,
  };

  // メンバーに関連するタスクをフィルタリング
  const memberTasks = useMemo(() => {
    return tasks.filter(task => {
      // アサインされたタスクかチェック
      const isAssigned = task.assignees.includes(member.name) || 
                        task.assignees.includes(member.id);
      
      // プライベートタスクの包含チェック
      if (!config.includePrivateTasks && task.tags?.includes('private')) {
        return false;
      }

      return isAssigned;
    });
  }, [member, tasks, config.includePrivateTasks]);

  // 日別稼働率データの計算
  const workloadData = useMemo((): WorkloadData[] => {
    const data: WorkloadData[] = [];
    const daysDiff = differenceInDays(config.dateRange.end, config.dateRange.start);

    for (let i = 0; i <= daysDiff; i++) {
      const currentDate = new Date(config.dateRange.start);
      currentDate.setDate(currentDate.getDate() + i);
      
      // 週末の除外チェック
      const dayOfWeek = currentDate.getDay();
      if (!config.includeWeekends && (dayOfWeek === 0 || dayOfWeek === 6)) {
        continue;
      }

      // その日のタスクを取得
      const dayInterval = {
        start: startOfDay(currentDate),
        end: endOfDay(currentDate),
      };

      const activeTasks = memberTasks.filter(task => {
        const taskStart = typeof task.startDate === 'string' 
          ? parseISO(task.startDate) : task.startDate;
        const taskEnd = typeof task.endDate === 'string' 
          ? parseISO(task.endDate) : task.endDate;
        
        return isWithinInterval(currentDate, { start: taskStart, end: taskEnd });
      });

      const completedTasks = activeTasks.filter(task => 
        task.status === 'completed' && 
        task.endDate && 
        startOfDay(typeof task.endDate === 'string' ? parseISO(task.endDate) : task.endDate).getTime() === startOfDay(currentDate).getTime()
      );

      const overdueTasks = activeTasks.filter(task => {
        const taskEnd = typeof task.endDate === 'string' 
          ? parseISO(task.endDate) : task.endDate;
        return currentDate > taskEnd && task.status !== 'completed';
      });

      const highPriorityTasks = activeTasks.filter(task => task.priority >= 80);

      // 稼働率の計算
      const capacity = calculateCapacity(
        activeTasks,
        completedTasks,
        overdueTasks,
        config.method,
        mergedFactors
      );

      // 作業時間の推定
      const workHours = estimateWorkHours(activeTasks, mergedFactors);

      // 可用性の判定
      const availability = determineAvailability(capacity, config.overloadThreshold);

      data.push({
        date: currentDate,
        capacity: Math.min(capacity, mergedFactors.maxDailyCapacity),
        totalTasks: activeTasks.length,
        activeTasks,
        completedTasks,
        overdueTasks,
        highPriorityTasks,
        isOverloaded: capacity > config.overloadThreshold,
        workHours,
        availability,
        metadata: {
          calculationMethod: config.method,
          factors: mergedFactors,
          breakdown: calculateBreakdown(activeTasks, completedTasks, overdueTasks, mergedFactors),
        },
      });
    }

    return data;
  }, [memberTasks, config, mergedFactors]);

  return <>{children(workloadData)}</>;
};

// 稼働率計算のメイン関数
function calculateCapacity(
  activeTasks: Task[],
  completedTasks: Task[],
  overdueTasks: Task[],
  method: WorkloadCalculationMethod,
  factors: WorkloadFactors
): number {
  switch (method) {
    case 'task-count':
      return calculateTaskCountBased(activeTasks, factors);
    
    case 'priority-weighted':
      return calculatePriorityWeighted(activeTasks, completedTasks, factors);
    
    case 'duration-based':
      return calculateDurationBased(activeTasks, factors);
    
    case 'effort-points':
      return calculateEffortPointsBased(activeTasks, factors);
    
    case 'hybrid':
      return calculateHybrid(activeTasks, completedTasks, overdueTasks, factors);
    
    default:
      return calculateTaskCountBased(activeTasks, factors);
  }
}

// タスク数ベースの計算
function calculateTaskCountBased(activeTasks: Task[], factors: WorkloadFactors): number {
  return Math.min(activeTasks.length * factors.baseTaskWeight, factors.maxDailyCapacity);
}

// 優先度重み付き計算
function calculatePriorityWeighted(
  activeTasks: Task[], 
  completedTasks: Task[], 
  factors: WorkloadFactors
): number {
  let totalLoad = 0;

  activeTasks.forEach(task => {
    let taskLoad = factors.baseTaskWeight;
    
    // 優先度による重み付け
    const priorityWeight = (task.priority / 100) * factors.priorityMultiplier;
    taskLoad *= priorityWeight;
    
    // 完了タスクの負荷軽減
    if (task.status === 'completed') {
      taskLoad *= factors.completionReduction;
    }
    
    totalLoad += taskLoad;
  });

  return Math.min(totalLoad, factors.maxDailyCapacity);
}

// 期間ベース計算
function calculateDurationBased(activeTasks: Task[], factors: WorkloadFactors): number {
  let totalHours = 0;

  activeTasks.forEach(task => {
    const taskStart = typeof task.startDate === 'string' 
      ? parseISO(task.startDate) : task.startDate;
    const taskEnd = typeof task.endDate === 'string' 
      ? parseISO(task.endDate) : task.endDate;
    
    const durationDays = Math.max(1, differenceInDays(taskEnd, taskStart));
    const estimatedHoursPerDay = factors.workingHoursPerDay / durationDays;
    
    // 優先度による調整
    const priorityAdjustment = 1 + (task.priority / 100 - 0.5);
    totalHours += estimatedHoursPerDay * priorityAdjustment;
  });

  const capacity = (totalHours / factors.workingHoursPerDay) * 100;
  return Math.min(capacity, factors.maxDailyCapacity);
}

// エフォートポイントベース計算
function calculateEffortPointsBased(activeTasks: Task[], factors: WorkloadFactors): number {
  let totalPoints = 0;

  activeTasks.forEach(task => {
    // エフォートポイントの計算（複雑度 × 優先度）
    const complexityPoints = factors.baseTaskWeight;
    const priorityBonus = (task.priority / 100) * 5;
    const effortPoints = complexityPoints + priorityBonus;
    
    totalPoints += effortPoints;
  });

  // ポイントを稼働率パーセンテージに変換
  const capacity = (totalPoints / factors.workingHoursPerDay) * 10;
  return Math.min(capacity, factors.maxDailyCapacity);
}

// ハイブリッド計算（複数の手法を組み合わせ）
function calculateHybrid(
  activeTasks: Task[],
  completedTasks: Task[],
  overdueTasks: Task[],
  factors: WorkloadFactors
): number {
  // 基本負荷（タスク数ベース）
  const baseLoad = calculateTaskCountBased(activeTasks, factors) * 0.4;
  
  // 優先度重み付き負荷
  const priorityLoad = calculatePriorityWeighted(activeTasks, completedTasks, factors) * 0.3;
  
  // 期間ベース負荷
  const durationLoad = calculateDurationBased(activeTasks, factors) * 0.3;
  
  // 期限切れタスクによるペナルティ
  const overduePenalty = overdueTasks.length * factors.overdueMultiplier * 5;
  
  const totalCapacity = baseLoad + priorityLoad + durationLoad + overduePenalty;
  return Math.min(totalCapacity, factors.maxDailyCapacity);
}

// 作業時間の推定
function estimateWorkHours(activeTasks: Task[], factors: WorkloadFactors): number {
  return activeTasks.reduce((total, task) => {
    const baseHours = factors.baseTaskWeight / 10; // 基本時間
    const priorityMultiplier = 1 + (task.priority / 100 - 0.5);
    return total + (baseHours * priorityMultiplier);
  }, 0);
}

// 可用性の判定
function determineAvailability(
  capacity: number, 
  overloadThreshold: number
): WorkloadData['availability'] {
  if (capacity === 0) return 'available';
  if (capacity <= overloadThreshold * 0.5) return 'available';
  if (capacity <= overloadThreshold) return 'busy';
  if (capacity <= overloadThreshold * 1.2) return 'overloaded';
  return 'unavailable';
}

// 稼働率の内訳計算
function calculateBreakdown(
  activeTasks: Task[],
  completedTasks: Task[],
  overdueTasks: Task[],
  factors: WorkloadFactors
) {
  const baseLoad = activeTasks.length * factors.baseTaskWeight;
  
  const priorityBonus = activeTasks.reduce((sum, task) => {
    return sum + (task.priority > 70 ? (task.priority / 100) * 10 : 0);
  }, 0);
  
  const overduePenalty = overdueTasks.length * factors.overdueMultiplier * 5;
  
  const completionReduction = completedTasks.length * factors.baseTaskWeight * (1 - factors.completionReduction);

  return {
    baseLoad,
    priorityBonus,
    overduePenalty,
    completionReduction,
  };
}

// ユーティリティ関数：チーム全体の稼働率統計
export function calculateTeamWorkloadStats(
  members: Member[],
  allWorkloadData: Map<string, WorkloadData[]>
) {
  const stats = {
    totalMembers: members.length,
    averageCapacity: 0,
    overloadedMembers: 0,
    availableMembers: 0,
    busyMembers: 0,
    totalTasks: 0,
    distributionByCapacity: {
      low: 0,      // 0-25%
      medium: 0,   // 26-75%
      high: 0,     // 76-100%
      overload: 0, // 100%+
    },
  };

  let totalCapacity = 0;
  let memberCount = 0;

  members.forEach(member => {
    const memberData = allWorkloadData.get(member.id);
    if (memberData && memberData.length > 0) {
      // 最新日の稼働率を使用
      const latestData = memberData[memberData.length - 1];
      totalCapacity += latestData.capacity;
      memberCount++;

      // 可用性の集計
      switch (latestData.availability) {
        case 'available':
          stats.availableMembers++;
          break;
        case 'busy':
          stats.busyMembers++;
          break;
        case 'overloaded':
        case 'unavailable':
          stats.overloadedMembers++;
          break;
      }

      // 容量分布の集計
      if (latestData.capacity <= 25) {
        stats.distributionByCapacity.low++;
      } else if (latestData.capacity <= 75) {
        stats.distributionByCapacity.medium++;
      } else if (latestData.capacity <= 100) {
        stats.distributionByCapacity.high++;
      } else {
        stats.distributionByCapacity.overload++;
      }

      stats.totalTasks += latestData.totalTasks;
    }
  });

  stats.averageCapacity = memberCount > 0 ? totalCapacity / memberCount : 0;

  return stats;
}

// プリセット設定
export const WORKLOAD_PRESETS = {
  conservative: {
    method: 'task-count' as const,
    factors: {
      baseTaskWeight: 10,
      priorityMultiplier: 1.2,
      overdueMultiplier: 1.5,
      completionReduction: 0.5,
      maxDailyCapacity: 80,
    },
    overloadThreshold: 70,
  },
  
  balanced: {
    method: 'hybrid' as const,
    factors: DEFAULT_FACTORS,
    overloadThreshold: 85,
  },
  
  aggressive: {
    method: 'priority-weighted' as const,
    factors: {
      baseTaskWeight: 20,
      priorityMultiplier: 2.0,
      overdueMultiplier: 2.2,
      completionReduction: 0.2,
      maxDailyCapacity: 110,
    },
    overloadThreshold: 95,
  },
};