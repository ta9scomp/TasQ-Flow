// パフォーマンステスト用の大量データ生成

import { addDays, addHours } from 'date-fns';
import type { Task, Member } from '../types/task';
import type { StickyNote } from '../types/stickyNote';
import type { Event, Holiday } from '../types/calendar';

// タスクの名前パターン
const taskPatterns = [
  '実装作業',
  'レビュー対応',
  'テスト実施',
  'ドキュメント作成',
  'バグ修正',
  'リファクタリング',
  '設計検討',
  'ミーティング',
  'データ移行',
  'パフォーマンス改善'
];

// タグパターン
const tagPatterns = [
  'frontend', 'backend', 'database', 'api', 'ui',
  'bug', 'feature', 'enhancement', 'critical', 'review'
];

// 説明パターン
const descriptionPatterns = [
  '詳細な実装内容を記載',
  '重要な変更点について',
  'テストケースの追加',
  'パフォーマンス最適化',
  'セキュリティ対策'
];

/**
 * 大量のタスクを生成
 * @param count 生成するタスク数
 * @param startDate 開始日
 * @param memberCount メンバー数
 */
export const generateMassiveTasks = (
  count: number = 1000,
  startDate: Date = new Date(),
  memberCount: number = 20
): Task[] => {
  console.time('generateMassiveTasks');
  
  const tasks: Task[] = [];
  const members = generateMembers(memberCount);
  
  // タスクグループの生成（全体の20%）
  const groupCount = Math.floor(count * 0.2);
  const childTasksPerGroup = Math.floor((count - groupCount) / groupCount);
  
  let taskIndex = 0;
  
  // グループタスクの生成
  for (let g = 0; g < groupCount; g++) {
    const groupStartDate = addDays(startDate, Math.floor(g * 7 / groupCount));
    const groupEndDate = addDays(groupStartDate, 7 + Math.random() * 14);
    
    const groupTask: Task = {
      id: `task_group_${g}`,
      title: `${taskPatterns[g % taskPatterns.length]} グループ ${g + 1}`,
      startDate: groupStartDate,
      endDate: groupEndDate,
      progress: 0,
      priority: Math.floor(Math.random() * 100),
      status: 'inProgress',
      assignees: [members[g % memberCount].name],
      tags: [tagPatterns[g % tagPatterns.length]],
      description: descriptionPatterns[g % descriptionPatterns.length],
      color: members[g % memberCount].color,
      isGroup: true,
      children: [],
      level: 0,
      checklist: []
    };
    
    tasks.push(groupTask);
    taskIndex++;
    
    // 子タスクの生成
    const childTaskCount = Math.min(childTasksPerGroup, count - taskIndex);
    for (let c = 0; c < childTaskCount; c++) {
      const childStartDate = addDays(groupStartDate, Math.floor(Math.random() * 7));
      const childEndDate = addDays(childStartDate, 1 + Math.random() * 5);
      
      const assignedMember = members[Math.floor(Math.random() * memberCount)];
      const childTask: Task = {
        id: `task_child_${g}_${c}`,
        title: `${taskPatterns[(g + c) % taskPatterns.length]} - サブタスク ${c + 1}`,
        startDate: childStartDate,
        endDate: childEndDate,
        progress: Math.floor(Math.random() * 100),
        priority: 20 + Math.floor(Math.random() * 60),
        status: Math.random() > 0.5 ? 'inProgress' : 'notStarted',
        assignees: [
          assignedMember.name,
          ...(Math.random() > 0.7 ? [members[Math.floor(Math.random() * memberCount)].name] : [])
        ].filter((v, i, a) => a.indexOf(v) === i),
        tags: Array.from({ length: 1 + Math.floor(Math.random() * 3) }, () => 
          tagPatterns[Math.floor(Math.random() * tagPatterns.length)]
        ).filter((v, i, a) => a.indexOf(v) === i),
        description: descriptionPatterns[(g + c) % descriptionPatterns.length],
        color: assignedMember.color,
        parentId: groupTask.id,
        level: 1,
        checklist: Math.random() > 0.5 ? [
          {
            id: `check_${g}_${c}_1`,
            text: 'チェック項目1',
            completed: Math.random() > 0.5,
            order: 1
          },
          {
            id: `check_${g}_${c}_2`,
            text: 'チェック項目2',
            completed: Math.random() > 0.5,
            order: 2
          }
        ] : []
      };
      
      groupTask.children!.push(childTask.id);
      tasks.push(childTask);
      taskIndex++;
      
      if (taskIndex >= count) break;
    }
    
    // グループの進捗を子タスクの平均で更新
    const childTasks = tasks.filter(t => t.parentId === groupTask.id);
    if (childTasks.length > 0) {
      groupTask.progress = Math.floor(
        childTasks.reduce((sum, t) => sum + t.progress, 0) / childTasks.length
      );
    }
  }
  
  console.timeEnd('generateMassiveTasks');
  console.log(`Generated ${tasks.length} tasks with ${groupCount} groups`);
  
  return tasks;
};

/**
 * 大量のメンバーを生成
 * @param count 生成するメンバー数
 */
export const generateMembers = (count: number = 20): Member[] => {
  const roles: Member['role'][] = ['owner', 'admin', 'member', 'viewer'];
  const lastNames = ['田中', '鈴木', '佐藤', '高橋', '伊藤', '渡辺', '山本', '中村', '小林', '加藤'];
  const firstNames = ['太郎', '花子', '一郎', '美咲', '健太', '優子', '大輔', '愛', '翔太', 'さくら'];
  const colors = ['#FF5252', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `member_${i}`,
    name: `${lastNames[i % lastNames.length]}${firstNames[i % firstNames.length]}`,
    email: `${lastNames[i % lastNames.length].toLowerCase()}${firstNames[i % firstNames.length].toLowerCase()}@example.com`,
    role: roles[i % roles.length],
    color: colors[i % colors.length],
    avatar: `https://i.pravatar.cc/150?img=${i + 1}`,
    permissions: i % 4 === 0 ? ['admin', 'manage'] : ['view', 'edit'],
    isActive: Math.random() > 0.1
  }));
};

/**
 * 大量のイベントを生成
 * @param count 生成するイベント数
 * @param startDate 開始日
 */
export const generateMassiveEvents = (
  count: number = 500,
  startDate: Date = new Date()
): Event[] => {
  const eventNames = [
    'チーム定例会議',
    'スプリントレビュー',
    'デザインレビュー',
    'コードレビュー',
    '進捗確認',
    'クライアントミーティング',
    'リリース準備',
    'テスト実施',
    '勉強会',
    'ランチミーティング'
  ];
  
  return Array.from({ length: count }, (_, i) => {
    const eventStartDate = addDays(startDate, Math.floor(Math.random() * 365));
    const duration = 30 + Math.floor(Math.random() * 120); // 30分～2.5時間
    
    return {
      id: `event_perf_${i}`,
      name: `${eventNames[i % eventNames.length]} #${i + 1}`,
      startDate: eventStartDate,
      endDate: addHours(eventStartDate, duration / 60),
      color: `hsl(${(i * 137.5) % 360}, 70%, 60%)`,
      isRecurring: Math.random() > 0.8,
      recurrencePattern: Math.random() > 0.8 ? {
        type: 'weekly' as const,
        interval: 1,
        endAfterOccurrences: 10
      } : undefined,
      userId: `member_${i % 20}`,
      isPublic: Math.random() > 0.2,
      description: `イベントの詳細説明 ${i + 1}`,
      tags: Array.from({ length: 1 + Math.floor(Math.random() * 3) }, () => 
        tagPatterns[Math.floor(Math.random() * tagPatterns.length)]
      ),
      hasCheckbox: Math.random() > 0.7,
      isCompleted: Math.random() > 0.5
    };
  });
};

/**
 * 大量の祝日を生成（複数年分）
 * @param yearCount 生成する年数
 * @param startYear 開始年
 */
export const generateMassiveHolidays = (
  yearCount: number = 20,
  startYear: number = 2020
): Holiday[] => {
  const holidays: Holiday[] = [];
  const holidayTemplates = [
    { name: '元日', month: 0, day: 1 },
    { name: '成人の日', month: 0, day: 8 },
    { name: '建国記念の日', month: 1, day: 11 },
    { name: '天皇誕生日', month: 1, day: 23 },
    { name: '春分の日', month: 2, day: 20 },
    { name: '昭和の日', month: 3, day: 29 },
    { name: '憲法記念日', month: 4, day: 3 },
    { name: 'みどりの日', month: 4, day: 4 },
    { name: 'こどもの日', month: 4, day: 5 },
    { name: '海の日', month: 6, day: 15 },
    { name: '山の日', month: 7, day: 11 },
    { name: '敬老の日', month: 8, day: 16 },
    { name: '秋分の日', month: 8, day: 23 },
    { name: 'スポーツの日', month: 9, day: 10 },
    { name: '文化の日', month: 10, day: 3 },
    { name: '勤労感謝の日', month: 10, day: 23 }
  ];
  
  for (let year = startYear; year < startYear + yearCount; year++) {
    holidayTemplates.forEach((template, i) => {
      holidays.push({
        id: `holiday_${year}_${i}`,
        name: template.name,
        date: new Date(year, template.month, template.day),
        color: '#FF5722',
        isRecurring: true,
        country: 'JP',
        isCustom: false,
        description: `${year}年の${template.name}`
      });
    });
  }
  
  return holidays;
};

/**
 * 大量の付箋を生成
 * @param count 生成する付箋数
 */
export const generateMassiveStickyNotes = (count: number = 200): StickyNote[] => {
  const noteContents = [
    '重要なメモ',
    'TODO: 確認が必要',
    'バグ報告',
    'アイデアメモ',
    '改善提案',
    'リマインダー',
    '参考リンク',
    '議事録',
    '質問事項',
    '決定事項'
  ];
  
  const colors = ['#FFE082', '#B2DFDB', '#F8BBD0', '#C5CAE9', '#FFCCBC'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `note_perf_${i}`,
    title: `${noteContents[i % noteContents.length]} #${i + 1}`,
    content: `付箋の内容 ${i + 1}\n詳細な説明やメモをここに記載します。`,
    color: colors[i % colors.length],
    position: {
      x: 50 + (i % 10) * 280,
      y: 50 + Math.floor(i / 10) * 220
    },
    size: { width: 250, height: 200 },
    createdBy: `member_${i % 20}`,
    createdAt: addDays(new Date(), -Math.floor(Math.random() * 30)),
    updatedAt: addDays(new Date(), -Math.floor(Math.random() * 7)),
    isMinimized: false,
    zIndex: i + 1,
    tags: Math.random() > 0.5 ? [tagPatterns[i % tagPatterns.length]] : undefined
  }));
};

/**
 * パフォーマンステスト用のシナリオ
 */
export const performanceTestScenarios = {
  // 小規模: 100タスク、10メンバー
  small: {
    tasks: 100,
    members: 10,
    events: 50,
    holidays: 20,
    stickyNotes: 20
  },
  
  // 中規模: 500タスク、20メンバー
  medium: {
    tasks: 500,
    members: 20,
    events: 200,
    holidays: 20,
    stickyNotes: 50
  },
  
  // 大規模: 1000タスク、50メンバー
  large: {
    tasks: 1000,
    members: 50,
    events: 500,
    holidays: 40,
    stickyNotes: 100
  },
  
  // 超大規模: 5000タスク、100メンバー
  extreme: {
    tasks: 5000,
    members: 100,
    events: 2000,
    holidays: 100,
    stickyNotes: 500
  }
};

/**
 * パフォーマンステストの実行
 */
export const runPerformanceTest = (scenario: keyof typeof performanceTestScenarios) => {
  console.group(`🚀 Performance Test: ${scenario}`);
  const config = performanceTestScenarios[scenario];
  
  console.time('Total Generation Time');
  
  console.time('Generate Members');
  const members = generateMembers(config.members);
  console.timeEnd('Generate Members');
  
  console.time('Generate Tasks');
  const tasks = generateMassiveTasks(config.tasks, new Date(), config.members);
  console.timeEnd('Generate Tasks');
  
  console.time('Generate Events');
  const events = generateMassiveEvents(config.events);
  console.timeEnd('Generate Events');
  
  console.time('Generate Holidays');
  const holidays = generateMassiveHolidays(Math.floor(config.holidays / 16), 2020);
  console.timeEnd('Generate Holidays');
  
  console.time('Generate Sticky Notes');
  const stickyNotes = generateMassiveStickyNotes(config.stickyNotes);
  console.timeEnd('Generate Sticky Notes');
  
  console.timeEnd('Total Generation Time');
  
  console.log('Generated Data Summary:', {
    members: members.length,
    tasks: tasks.length,
    events: events.length,
    holidays: holidays.length,
    stickyNotes: stickyNotes.length
  });
  
  console.groupEnd();
  
  return { members, tasks, events, holidays, stickyNotes };
};

/**
 * メモリ使用量の測定
 */
export const measureMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    return {
      usedJSHeapSize: (memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
      totalJSHeapSize: (memory.totalJSHeapSize / 1048576).toFixed(2) + ' MB',
      jsHeapSizeLimit: (memory.jsHeapSizeLimit / 1048576).toFixed(2) + ' MB'
    };
  }
  return null;
};