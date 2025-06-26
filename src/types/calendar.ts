// カレンダー・月表示統合機能の型定義

export type Language = 'ja' | 'en';

export interface MonthDisplayConfig {
  language: Language;
  format: string;
  snapEnabled: boolean;
  animationDuration: number; // ミリ秒
}

export interface MonthSnapState {
  currentMonth: string;
  isSnapping: boolean;
  snapDirection: 'left' | 'right' | null;
  snapTarget: 'firstDay' | 'lastDay' | null;
}

export interface ScrollState {
  scrollLeft: number;
  scrollDirection: 'left' | 'right' | null;
  isScrolling: boolean;
  velocity: number;
}

export interface Holiday {
  id: string;
  name: string;
  date: Date;
  color: string;
  isRecurring: boolean;
  groupId?: string; // 祝日グループ（例：ゴールデンウィーク）
  country?: string; // 'JP' | 'US' など
  isCustom: boolean; // ユーザーカスタム祝日かどうか
  description?: string;
}

export interface Event {
  id: string;
  name: string;
  startDate: Date;
  endDate?: Date; // 単日の場合はundefined
  color: string;
  isRecurring: boolean;
  recurrencePattern?: RecurrencePattern;
  groupId?: string;
  userId: string; // 作成者
  isPublic: boolean;
  description?: string;
  tags: string[];
  attachments?: string[]; // 付箋ID
  hasCheckbox?: boolean;
  isCompleted?: boolean;
}

export interface RecurrencePattern {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number; // 間隔（例：2週間ごとなら2）
  endDate?: Date;
  endAfterOccurrences?: number;
}

export interface EventGroup {
  id: string;
  name: string;
  color: string;
  eventIds: string[];
  isCollapsed: boolean;
  userId: string;
}

export interface HolidayGroup {
  id: string;
  name: string;
  color: string;
  holidayIds: string[];
  isActive: boolean; // 表示ON/OFF
  preset: 'JP_NATIONAL' | 'US_FEDERAL' | 'CUSTOM';
}

export interface CalendarDayCell {
  date: Date;
  holidays: Holiday[];
  events: Event[];
  tasks: string[]; // タスクID一覧
  isWeekend: boolean;
  isToday: boolean;
  colorDisplay: {
    baseColor?: string;
    accentColors: string[]; // 複数の祝日・イベント色
    showText: boolean; // セル幅に応じて文字表示するか
  };
}

export interface MonthDisplayOptions {
  language: Language;
  showHolidays: boolean;
  showEvents: boolean;
  showTaskCount: boolean;
  fadeInOutEnabled: boolean;
  snapSensitivity: number; // 0-1の感度
}

// 提案・共有機能の型
export interface EventProposal {
  id: string;
  fromUserId: string;
  toUserIds: string[];
  eventIds: string[];
  holidayIds: string[];
  message?: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
  expiresAt?: Date;
}

export interface ProposalNotification {
  id: string;
  proposalId: string;
  userId: string;
  isRead: boolean;
  createdAt: Date;
}

// アーカイブ機能
export interface ArchivedEvent {
  originalEvent: Event;
  archivedAt: Date;
  archiveReason: 'completed' | 'expired' | 'manual';
}

export type PrivacyLevel = 'public' | 'periodOnly' | 'private';

export interface PrivateTaskSettings {
  taskId: string;
  privacyLevel: PrivacyLevel;
  visibleToUserIds?: string[]; // 特定ユーザーのみに公開する場合
}