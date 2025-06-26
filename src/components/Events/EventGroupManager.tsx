import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useAppStore } from '../../stores/useAppStore';
import type { 
  Event, 
  Holiday, 
  EventGroup, 
  HolidayGroup,
  EventProposal 
} from '../../types/calendar';

// イベント管理の設定
export interface EventManagerConfig {
  maxEventsPerGroup: number;
  maxGroups: number;
  autoSave: boolean;
  enableRecurrence: boolean;
  enableProposals: boolean;
  enableSharing: boolean;
  enableDragDrop: boolean;
  defaultEventDuration: number; // 分
  maxEventDuration: number; // 日
  allowOverlap: boolean;
  reminderSettings: {
    enabled: boolean;
    defaultMinutes: number[];
  };
}

// デフォルト設定
const DEFAULT_CONFIG: EventManagerConfig = {
  maxEventsPerGroup: 100,
  maxGroups: 20,
  autoSave: true,
  enableRecurrence: true,
  enableProposals: true,
  enableSharing: true,
  enableDragDrop: true,
  defaultEventDuration: 60,
  maxEventDuration: 7,
  allowOverlap: true,
  reminderSettings: {
    enabled: true,
    defaultMinutes: [15, 60, 1440], // 15分前、1時間前、1日前
  },
};

// 拡張イベント型（内部管理用）
interface ExtendedEvent extends Event {
  reminder?: {
    minutes: number[];
    lastTriggered?: Date;
  };
  location?: string;
  attendees?: Array<{
    userId: string;
    status: 'pending' | 'accepted' | 'declined';
    role: 'organizer' | 'required' | 'optional';
  }>;
  metadata: {
    createdAt: Date;
    modifiedAt: Date;
    version: number;
    source: 'manual' | 'import' | 'recurring' | 'proposal';
    conflictIds: string[];
  };
}

// 拡張祝日型
interface ExtendedHoliday extends Holiday {
  source: 'system' | 'custom' | 'import';
  metadata: {
    createdAt: Date;
    modifiedAt: Date;
    observedDate?: Date; // 実際の観測日（祝日が土日の場合の振替など）
  };
}

// イベント競合情報
interface EventConflict {
  id: string;
  eventIds: string[];
  type: 'time_overlap' | 'resource_conflict' | 'schedule_conflict';
  severity: 'warning' | 'error';
  description: string;
  suggestedResolution?: {
    type: 'reschedule' | 'merge' | 'split' | 'ignore';
    targetDate?: Date;
    reason: string;
  };
}

// イベント統計
interface EventStatistics {
  totalEvents: number;
  totalHolidays: number;
  upcomingEvents: number;
  recurringEvents: number;
  eventsByCategory: Record<string, number>;
  eventsByPriority: Record<string, number>;
  busyDays: Array<{ date: Date; eventCount: number }>;
  popularTags: Array<{ tag: string; count: number }>;
  averageEventDuration: number;
  conflictCount: number;
  completionRate: number;
}

// イベント管理API
export interface EventManagerAPI {
  // 基本CRUD - イベント
  createEvent: (event: Partial<ExtendedEvent>) => string;
  updateEvent: (id: string, updates: Partial<ExtendedEvent>) => boolean;
  deleteEvent: (id: string) => boolean;
  duplicateEvent: (id: string, newDate?: Date) => string | null;
  
  // 基本CRUD - 祝日
  createHoliday: (holiday: Partial<ExtendedHoliday>) => string;
  updateHoliday: (id: string, updates: Partial<ExtendedHoliday>) => boolean;
  deleteHoliday: (id: string) => boolean;
  
  // グループ管理
  createEventGroup: (name: string, eventIds: string[]) => string;
  createHolidayGroup: (name: string, holidayIds: string[]) => string;
  updateEventGroup: (id: string, updates: Partial<EventGroup>) => boolean;
  updateHolidayGroup: (id: string, updates: Partial<HolidayGroup>) => boolean;
  deleteEventGroup: (id: string) => boolean;
  deleteHolidayGroup: (id: string) => boolean;
  addToEventGroup: (groupId: string, eventIds: string[]) => boolean;
  addToHolidayGroup: (groupId: string, holidayIds: string[]) => boolean;
  removeFromEventGroup: (groupId: string, eventIds: string[]) => boolean;
  removeFromHolidayGroup: (groupId: string, holidayIds: string[]) => boolean;
  
  // 繰り返し処理
  generateRecurringEvents: (baseEvent: ExtendedEvent, endDate: Date) => ExtendedEvent[];
  updateRecurringSeries: (eventId: string, updates: Partial<ExtendedEvent>, scope: 'this' | 'future' | 'all') => boolean;
  deleteRecurringSeries: (eventId: string, scope: 'this' | 'future' | 'all') => boolean;
  
  // 検索・フィルタリング
  searchEvents: (query: string) => ExtendedEvent[];
  searchHolidays: (query: string) => ExtendedHoliday[];
  filterEventsByDateRange: (start: Date, end: Date) => ExtendedEvent[];
  filterEventsByTags: (tags: string[]) => ExtendedEvent[];
  filterEventsByUser: (userId: string) => ExtendedEvent[];
  getEventsForDate: (date: Date) => ExtendedEvent[];
  getHolidaysForDate: (date: Date) => ExtendedHoliday[];
  
  // 競合検知・解決
  detectConflicts: (eventId?: string) => EventConflict[];
  resolveConflict: (conflictId: string, resolution: 'reschedule' | 'merge' | 'split' | 'ignore') => boolean;
  suggestAlternativeTime: (eventId: string) => Date[];
  
  // ドラッグ&ドロップ
  moveEvent: (eventId: string, newDate: Date, newDuration?: number) => boolean;
  resizeEvent: (eventId: string, newDuration: number) => boolean;
  canDropAtDate: (eventId: string, targetDate: Date) => boolean;
  
  // インポート・エクスポート
  importEvents: (data: string, format: 'ical' | 'csv' | 'json') => boolean;
  exportEvents: (format: 'ical' | 'csv' | 'json', eventIds?: string[]) => string;
  importHolidayPreset: (preset: 'JP_NATIONAL' | 'US_FEDERAL') => boolean;
  
  // プロポーザル・共有
  createProposal: (proposal: Partial<EventProposal>) => string;
  respondToProposal: (proposalId: string, response: 'accepted' | 'declined') => boolean;
  shareEvents: (eventIds: string[], userIds: string[], message?: string) => string;
  
  // 統計・分析
  getStatistics: () => EventStatistics;
  getEventTrend: (period: 'week' | 'month' | 'year') => Array<{ date: string; count: number }>;
  getBusyDays: (threshold: number) => Array<{ date: Date; eventCount: number; events: ExtendedEvent[] }>;
  
  // リマインダー
  setEventReminder: (eventId: string, minutes: number[]) => boolean;
  getUpcomingReminders: (hours: number) => Array<{ event: ExtendedEvent; minutesUntil: number }>;
  triggerReminder: (eventId: string) => boolean;
  
  // 状態取得
  getAllEvents: () => ExtendedEvent[];
  getAllHolidays: () => ExtendedHoliday[];
  getEventGroups: () => EventGroup[];
  getHolidayGroups: () => HolidayGroup[];
  getEvent: (id: string) => ExtendedEvent | null;
  getHoliday: (id: string) => ExtendedHoliday | null;
  hasConflicts: () => boolean;
  
  // 永続化
  save: () => boolean;
  load: () => boolean;
  clear: () => void;
}

interface EventGroupManagerProps {
  config?: Partial<EventManagerConfig>;
  initialEvents?: ExtendedEvent[];
  initialHolidays?: ExtendedHoliday[];
  onEventsChange?: (events: ExtendedEvent[]) => void;
  onHolidaysChange?: (holidays: ExtendedHoliday[]) => void;
  children: (api: EventManagerAPI) => React.ReactNode;
}

export const EventGroupManager: React.FC<EventGroupManagerProps> = ({
  config: configOverrides = {},
  initialEvents = [],
  initialHolidays = [],
  onEventsChange,
  onHolidaysChange,
  children,
}) => {
  const config: EventManagerConfig = useMemo(() => ({ ...DEFAULT_CONFIG, ...configOverrides }), [configOverrides]);
  
  // 状態管理
  const [events, setEvents] = useState<ExtendedEvent[]>(initialEvents);
  const [holidays, setHolidays] = useState<ExtendedHoliday[]>(initialHolidays);
  const [eventGroups, setEventGroups] = useState<EventGroup[]>([]);
  const [holidayGroups, setHolidayGroups] = useState<HolidayGroup[]>([]);
  const [conflicts, setConflicts] = useState<EventConflict[]>([]);
  const [, setProposals] = useState<EventProposal[]>([]);
  
  const { selectedProjectId } = useAppStore();
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // 変更通知
  useEffect(() => {
    onEventsChange?.(events);
  }, [events, onEventsChange]);

  useEffect(() => {
    onHolidaysChange?.(holidays);
  }, [holidays, onHolidaysChange]);

  // イベント作成
  const createEvent = useCallback((eventData: Partial<ExtendedEvent>): string => {
    if (events.length >= config.maxEventsPerGroup * config.maxGroups) {
      console.warn('Maximum number of events reached');
      return '';
    }

    const newEvent: ExtendedEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: '',
      startDate: new Date(),
      color: '#2196F3',
      isRecurring: false,
      userId: 'current_user', // TODO: 実際のユーザー情報
      isPublic: true,
      tags: [],
      metadata: {
        createdAt: new Date(),
        modifiedAt: new Date(),
        version: 1,
        source: 'manual',
        conflictIds: [],
      },
      ...eventData,
    };

    setEvents(prev => [...prev, newEvent]);
    
    // 競合検知
    if (!config.allowOverlap) {
      // 競合検知は後で実装
      console.log('Conflict detection skipped for:', newEvent.id);
    }

    console.log('EventGroupManager: Created event', newEvent.id);
    return newEvent.id;
  }, [events.length, config]);

  const updateEvent = useCallback((id: string, updates: Partial<ExtendedEvent>): boolean => {
    const existingEvent = events.find(event => event.id === id);
    if (!existingEvent) return false;

    const updatedEvent = {
      ...existingEvent,
      ...updates,
      metadata: {
        ...existingEvent.metadata,
        ...updates.metadata,
        modifiedAt: new Date(),
        version: existingEvent.metadata.version + 1,
      },
    };

    setEvents(prev => prev.map(event => event.id === id ? updatedEvent : event));
    
    // 競合検知（日時が変更された場合）
    if (updates.startDate || updates.endDate) {
      // 競合検知は後で実装
      console.log('Conflict detection skipped for update:', id);
    }

    return true;
  }, [events]);

  const deleteEvent = useCallback((id: string): boolean => {
    const eventToDelete = events.find(event => event.id === id);
    if (!eventToDelete) return false;

    setEvents(prev => prev.filter(event => event.id !== id));
    
    // グループからも削除
    setEventGroups(prev => prev.map(group => ({
      ...group,
      eventIds: group.eventIds.filter(eventId => eventId !== id),
    })));

    console.log('EventGroupManager: Deleted event', id);
    return true;
  }, [events]);

  // 祝日作成
  const createHoliday = useCallback((holidayData: Partial<ExtendedHoliday>): string => {
    const newHoliday: ExtendedHoliday = {
      id: `holiday_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: '',
      date: new Date(),
      color: '#FF5722',
      isRecurring: true,
      isCustom: true,
      source: 'custom',
      metadata: {
        createdAt: new Date(),
        modifiedAt: new Date(),
      },
      ...holidayData,
    };

    setHolidays(prev => [...prev, newHoliday]);
    
    console.log('EventGroupManager: Created holiday', newHoliday.id);
    return newHoliday.id;
  }, []);

  // 繰り返しイベント生成
  const generateRecurringEvents = useCallback((baseEvent: ExtendedEvent, endDate: Date): ExtendedEvent[] => {
    if (!baseEvent.isRecurring || !baseEvent.recurrencePattern) {
      return [baseEvent];
    }

    const pattern = baseEvent.recurrencePattern;
    const generatedEvents: ExtendedEvent[] = [];
    const currentDate = new Date(baseEvent.startDate);
    let count = 0;
    const maxOccurrences = pattern.endAfterOccurrences || 100;

    while (currentDate <= endDate && count < maxOccurrences) {
      if (currentDate.getTime() !== baseEvent.startDate.getTime()) {
        const generatedEvent: ExtendedEvent = {
          ...baseEvent,
          id: `${baseEvent.id}_${count}`,
          startDate: new Date(currentDate),
          endDate: baseEvent.endDate ? new Date(currentDate.getTime() + (baseEvent.endDate.getTime() - baseEvent.startDate.getTime())) : undefined,
          metadata: {
            ...baseEvent.metadata,
            source: 'recurring',
          },
        };
        
        generatedEvents.push(generatedEvent);
      }

      // 次の発生日を計算
      switch (pattern.type) {
        case 'daily': {
          currentDate.setDate(currentDate.getDate() + pattern.interval);
          break;
        }
        case 'weekly': {
          currentDate.setDate(currentDate.getDate() + (pattern.interval * 7));
          break;
        }
        case 'monthly': {
          currentDate.setMonth(currentDate.getMonth() + pattern.interval);
          break;
        }
        case 'yearly': {
          currentDate.setFullYear(currentDate.getFullYear() + pattern.interval);
          break;
        }
      }

      count++;
    }

    return [baseEvent, ...generatedEvents];
  }, []);

  // 競合検知
  const detectConflicts = useCallback((eventId?: string): EventConflict[] => {
    const eventsToCheck = eventId ? events.filter(e => e.id === eventId) : events;
    const newConflicts: EventConflict[] = [];

    eventsToCheck.forEach(event => {
      if (!event.startDate) return;

      const conflictingEvents = events.filter(otherEvent => {
        if (otherEvent.id === event.id) return false;
        if (!otherEvent.startDate) return false;

        // 時間の重複チェック
        const eventEnd = event.endDate || new Date(event.startDate.getTime() + config.defaultEventDuration * 60000);
        const otherEnd = otherEvent.endDate || new Date(otherEvent.startDate.getTime() + config.defaultEventDuration * 60000);

        return (
          (event.startDate < otherEnd && eventEnd > otherEvent.startDate) ||
          (otherEvent.startDate < eventEnd && otherEnd > event.startDate)
        );
      });

      if (conflictingEvents.length > 0) {
        const conflict: EventConflict = {
          id: `conflict_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          eventIds: [event.id, ...conflictingEvents.map(e => e.id)],
          type: 'time_overlap',
          severity: 'warning',
          description: `イベント "${event.name}" が他の ${conflictingEvents.length} 件のイベントと重複しています`,
          suggestedResolution: {
            type: 'reschedule',
            targetDate: new Date(event.startDate.getTime() + 60 * 60 * 1000), // 1時間後
            reason: '重複を避けるため',
          },
        };

        newConflicts.push(conflict);
      }
    });

    setConflicts(prev => {
      // 既存の競合を削除して新しい競合を追加
      const filteredConflicts = prev.filter(c => 
        !eventsToCheck.some(e => c.eventIds.includes(e.id))
      );
      return [...filteredConflicts, ...newConflicts];
    });

    return newConflicts;
  }, [events, config.defaultEventDuration]);

  // ドラッグ&ドロップ
  const moveEvent = useCallback((eventId: string, newDate: Date, newDuration?: number): boolean => {
    const event = events.find(e => e.id === eventId);
    if (!event) return false;

    const updates: Partial<ExtendedEvent> = {
      startDate: newDate,
    };

    if (newDuration !== undefined) {
      updates.endDate = new Date(newDate.getTime() + newDuration * 60000);
    } else if (event.endDate) {
      const originalDuration = event.endDate.getTime() - event.startDate.getTime();
      updates.endDate = new Date(newDate.getTime() + originalDuration);
    }

    return updateEvent(eventId, updates);
  }, [events, updateEvent]);

  const canDropAtDate = useCallback((eventId: string, targetDate: Date): boolean => {
    if (!config.enableDragDrop) return false;

    const event = events.find(e => e.id === eventId);
    if (!event) return false;

    // 重複チェック
    if (!config.allowOverlap) {
      const duration = event.endDate 
        ? event.endDate.getTime() - event.startDate.getTime()
        : config.defaultEventDuration * 60000;
      
      const targetEnd = new Date(targetDate.getTime() + duration);
      
      const hasConflict = events.some(otherEvent => {
        if (otherEvent.id === eventId) return false;
        
        const otherEnd = otherEvent.endDate || new Date(otherEvent.startDate.getTime() + config.defaultEventDuration * 60000);
        
        return (
          (targetDate < otherEnd && targetEnd > otherEvent.startDate) ||
          (otherEvent.startDate < targetEnd && otherEnd > targetDate)
        );
      });

      if (hasConflict) return false;
    }

    return true;
  }, [events, config]);

  // 統計情報
  const getStatistics = useCallback((): EventStatistics => {
    const now = new Date();
    const stats: EventStatistics = {
      totalEvents: events.length,
      totalHolidays: holidays.length,
      upcomingEvents: events.filter(e => e.startDate > now).length,
      recurringEvents: events.filter(e => e.isRecurring).length,
      eventsByCategory: {},
      eventsByPriority: {},
      busyDays: [],
      popularTags: [],
      averageEventDuration: 0,
      conflictCount: conflicts.length,
      completionRate: 0,
    };

    // タグ統計
    const tagCounts: Record<string, number> = {};
    events.forEach(event => {
      event.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    stats.popularTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // 平均イベント時間
    const totalDuration = events.reduce((sum, event) => {
      if (event.endDate) {
        return sum + (event.endDate.getTime() - event.startDate.getTime());
      }
      return sum + (config.defaultEventDuration * 60000);
    }, 0);

    stats.averageEventDuration = events.length > 0 
      ? totalDuration / events.length / 60000 // 分に変換
      : 0;

    // 完了率（チェックボックス付きイベントの）
    const checkboxEvents = events.filter(e => e.hasCheckbox);
    const completedEvents = checkboxEvents.filter(e => e.isCompleted);
    stats.completionRate = checkboxEvents.length > 0 
      ? (completedEvents.length / checkboxEvents.length) * 100
      : 0;

    return stats;
  }, [events, holidays, conflicts, config.defaultEventDuration]);

  // 永続化
  const save = useCallback((): boolean => {
    try {
      const data = {
        events,
        holidays,
        eventGroups,
        holidayGroups,
        conflicts,
        metadata: {
          version: '1.0',
          savedAt: new Date().toISOString(),
          projectId: selectedProjectId,
        },
      };

      const key = `events-${selectedProjectId || 'default'}`;
      localStorage.setItem(key, JSON.stringify(data));
      
      console.log('EventGroupManager: Data saved successfully');
      return true;
    } catch (error) {
      console.error('Failed to save events:', error);
      return false;
    }
  }, [events, holidays, eventGroups, holidayGroups, conflicts, selectedProjectId]);

  const load = useCallback((): boolean => {
    try {
      const key = `events-${selectedProjectId || 'default'}`;
      const dataString = localStorage.getItem(key);

      if (dataString) {
        const data = JSON.parse(dataString);
        setEvents(data.events || []);
        setHolidays(data.holidays || []);
        setEventGroups(data.eventGroups || []);
        setHolidayGroups(data.holidayGroups || []);
        setConflicts(data.conflicts || []);
        
        console.log('EventGroupManager: Data loaded successfully');
        return true;
      }
    } catch (error) {
      console.error('Failed to load events:', error);
    }
    
    return false;
  }, [selectedProjectId]);

  // 初期化時にデータを読み込み
  useEffect(() => {
    if (initialEvents.length === 0 && initialHolidays.length === 0) {
      load();
    }
  }, [load, initialEvents.length, initialHolidays.length]);

  // 自動保存
  useEffect(() => {
    if (config.autoSave) {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      
      autoSaveTimerRef.current = setTimeout(() => {
        save();
      }, 5000);
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [events, holidays, eventGroups, holidayGroups, config.autoSave, save]);

  // API構築
  const api: EventManagerAPI = useMemo(() => ({
    // 基本CRUD - イベント
    createEvent,
    updateEvent,
    deleteEvent,
    duplicateEvent: (id, newDate) => {
      const original = events.find(e => e.id === id);
      if (!original) return null;
      
      const duplicated = {
        ...original,
        id: undefined,
        name: `${original.name} (コピー)`,
        startDate: newDate || new Date(original.startDate.getTime() + 24 * 60 * 60 * 1000),
      };
      
      return createEvent(duplicated);
    },
    
    // 基本CRUD - 祝日
    createHoliday,
    updateHoliday: (id, updates) => {
      const existing = holidays.find(h => h.id === id);
      if (!existing) return false;
      
      const updated = {
        ...existing,
        ...updates,
        metadata: {
          ...existing.metadata,
          modifiedAt: new Date(),
        },
      };
      
      setHolidays(prev => prev.map(h => h.id === id ? updated : h));
      return true;
    },
    deleteHoliday: (id) => {
      setHolidays(prev => prev.filter(h => h.id !== id));
      return true;
    },
    
    // グループ管理（簡易実装）
    createEventGroup: (name, eventIds) => {
      const newGroup: EventGroup = {
        id: `group_${Date.now()}`,
        name,
        color: '#2196F3',
        eventIds,
        isCollapsed: false,
        userId: 'current_user',
      };
      setEventGroups(prev => [...prev, newGroup]);
      return newGroup.id;
    },
    createHolidayGroup: () => '', // TODO: 実装
    updateEventGroup: () => false, // TODO: 実装
    updateHolidayGroup: () => false, // TODO: 実装
    deleteEventGroup: () => false, // TODO: 実装
    deleteHolidayGroup: () => false, // TODO: 実装
    addToEventGroup: () => false, // TODO: 実装
    addToHolidayGroup: () => false, // TODO: 実装
    removeFromEventGroup: () => false, // TODO: 実装
    removeFromHolidayGroup: () => false, // TODO: 実装
    
    // 繰り返し処理
    generateRecurringEvents,
    updateRecurringSeries: () => false, // TODO: 実装
    deleteRecurringSeries: () => false, // TODO: 実装
    
    // 検索・フィルタリング
    searchEvents: (query) => {
      const lowercaseQuery = query.toLowerCase();
      return events.filter(event => 
        event.name.toLowerCase().includes(lowercaseQuery) ||
        event.description?.toLowerCase().includes(lowercaseQuery) ||
        event.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      );
    },
    searchHolidays: (query) => {
      const lowercaseQuery = query.toLowerCase();
      return holidays.filter(holiday => 
        holiday.name.toLowerCase().includes(lowercaseQuery) ||
        holiday.description?.toLowerCase().includes(lowercaseQuery)
      );
    },
    filterEventsByDateRange: (start, end) => 
      events.filter(event => event.startDate >= start && event.startDate <= end),
    filterEventsByTags: (tags) => 
      events.filter(event => tags.some(tag => event.tags.includes(tag))),
    filterEventsByUser: (userId) => 
      events.filter(event => event.userId === userId),
    getEventsForDate: (date) => {
      const dateString = date.toDateString();
      return events.filter(event => event.startDate.toDateString() === dateString);
    },
    getHolidaysForDate: (date) => {
      const dateString = date.toDateString();
      return holidays.filter(holiday => holiday.date.toDateString() === dateString);
    },
    
    // 競合検知・解決
    detectConflicts,
    resolveConflict: () => false, // TODO: 実装
    suggestAlternativeTime: () => [], // TODO: 実装
    
    // ドラッグ&ドロップ
    moveEvent,
    resizeEvent: (eventId, newDuration) => {
      const event = events.find(e => e.id === eventId);
      if (!event) return false;
      
      const newEndDate = new Date(event.startDate.getTime() + newDuration * 60000);
      return updateEvent(eventId, { endDate: newEndDate });
    },
    canDropAtDate,
    
    // インポート・エクスポート
    importEvents: () => false, // TODO: 実装
    exportEvents: (format) => {
      switch (format) {
        case 'json': {
          return JSON.stringify(events, null, 2);
        }
        case 'csv': {
          const headers = 'Name,Start Date,End Date,Description,Tags\n';
          const rows = events.map(event => 
            `"${event.name}","${event.startDate.toISOString()}","${event.endDate?.toISOString() || ''}","${event.description || ''}","${event.tags.join(';')}"`
          ).join('\n');
          return headers + rows;
        }
        default: {
          return '';
        }
      }
    },
    importHolidayPreset: () => false, // TODO: 実装
    
    // プロポーザル・共有
    createProposal: () => '', // TODO: 実装
    respondToProposal: () => false, // TODO: 実装
    shareEvents: () => '', // TODO: 実装
    
    // 統計・分析
    getStatistics,
    getEventTrend: () => [], // TODO: 実装
    getBusyDays: (threshold) => {
      const dayMap = new Map<string, ExtendedEvent[]>();
      
      events.forEach(event => {
        const dateKey = event.startDate.toDateString();
        if (!dayMap.has(dateKey)) {
          dayMap.set(dateKey, []);
        }
        dayMap.get(dateKey)!.push(event);
      });
      
      return Array.from(dayMap.entries())
        .filter(([, eventList]) => eventList.length >= threshold)
        .map(([dateString, eventList]) => ({
          date: new Date(dateString),
          eventCount: eventList.length,
          events: eventList,
        }));
    },
    
    // リマインダー
    setEventReminder: () => false, // TODO: 実装
    getUpcomingReminders: () => [], // TODO: 実装
    triggerReminder: () => false, // TODO: 実装
    
    // 状態取得
    getAllEvents: () => events,
    getAllHolidays: () => holidays,
    getEventGroups: () => eventGroups,
    getHolidayGroups: () => holidayGroups,
    getEvent: (id) => events.find(e => e.id === id) || null,
    getHoliday: (id) => holidays.find(h => h.id === id) || null,
    hasConflicts: () => conflicts.length > 0,
    
    // 永続化
    save,
    load,
    clear: () => {
      setEvents([]);
      setHolidays([]);
      setEventGroups([]);
      setHolidayGroups([]);
      setConflicts([]);
      setProposals([]);
    },
  }), [
    events, holidays, eventGroups, holidayGroups, conflicts,
    createEvent, updateEvent, deleteEvent, createHoliday,
    generateRecurringEvents, detectConflicts, moveEvent, canDropAtDate,
    getStatistics, save, load
  ]);

  return <>{children(api)}</>;
};