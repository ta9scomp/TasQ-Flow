// 多言語対応設定（軽量実装版）
// react-i18nextなしでの簡易実装

import React from 'react';
import { format } from 'date-fns';
import { ja, enUS } from 'date-fns/locale';
import type { Locale } from 'date-fns';
import type { Language } from '../types/calendar';

export interface Messages {
  monthFormat: string;
  dateLocale: Locale;
  ui: {
    search: {
      placeholder: string;
      member: string;
      tag: string;
      progress: string;
      priority: string;
      status: string;
      capacity: string;
    };
    task: {
      notStarted: string;
      inProgress: string;
      completed: string;
      onHold: string;
    };
    priority: {
      low: string;
      medium: string;
      high: string;
      urgent: string;
    };
    calendar: {
      today: string;
      weekend: string;
      holiday: string;
      event: string;
    };
    tabs: {
      gantt: string;
      members: string;
      sticky: string;
      todo: string;
      history: string;
      settings: string;
    };
    actions: {
      add: string;
      edit: string;
      delete: string;
      save: string;
      cancel: string;
      close: string;
    };
  };
}

const messages: Record<Language, Messages> = {
  ja: {
    monthFormat: 'yyyy年M月',
    dateLocale: ja,
    ui: {
      search: {
        placeholder: '検索… (@担当者 #タグ %進捗 !優先度 $ステータス ^稼働率)',
        member: '@担当者',
        tag: '#タグ',
        progress: '%進捗',
        priority: '!優先度',
        status: '$ステータス',
        capacity: '^稼働率',
      },
      task: {
        notStarted: '未着手',
        inProgress: '進行中',
        completed: '完了',
        onHold: '保留',
      },
      priority: {
        low: '低',
        medium: '中',
        high: '高',
        urgent: '緊急',
      },
      calendar: {
        today: '今日',
        weekend: '週末',
        holiday: '祝日',
        event: 'イベント',
      },
      tabs: {
        gantt: 'ガントチャート',
        members: 'メンバー',
        sticky: '付箋',
        todo: 'ToDo',
        history: '変更履歴',
        settings: '設定',
      },
      actions: {
        add: '追加',
        edit: '編集',
        delete: '削除',
        save: '保存',
        cancel: 'キャンセル',
        close: '閉じる',
      },
    },
  },
  en: {
    monthFormat: 'yyyy/MM',
    dateLocale: enUS,
    ui: {
      search: {
        placeholder: 'Search… (@member #tag %progress !priority $status ^capacity)',
        member: '@Member',
        tag: '#Tag',
        progress: '%Progress',
        priority: '!Priority',
        status: '$Status',
        capacity: '^Capacity',
      },
      task: {
        notStarted: 'Not Started',
        inProgress: 'In Progress',
        completed: 'Completed',
        onHold: 'On Hold',
      },
      priority: {
        low: 'Low',
        medium: 'Medium',
        high: 'High',
        urgent: 'Urgent',
      },
      calendar: {
        today: 'Today',
        weekend: 'Weekend',
        holiday: 'Holiday',
        event: 'Event',
      },
      tabs: {
        gantt: 'Gantt Chart',
        members: 'Members',
        sticky: 'Sticky Notes',
        todo: 'ToDo',
        history: 'History',
        settings: 'Settings',
      },
      actions: {
        add: 'Add',
        edit: 'Edit',
        delete: 'Delete',
        save: 'Save',
        cancel: 'Cancel',
        close: 'Close',
      },
    },
  },
};

class I18nManager {
  private currentLanguage: Language = 'ja';
  private listeners: Array<(language: Language) => void> = [];

  constructor() {
    // LocalStorageから言語設定を復元
    const savedLanguage = localStorage.getItem('tasq-flow-language') as Language;
    if (savedLanguage && ['ja', 'en'].includes(savedLanguage)) {
      this.currentLanguage = savedLanguage;
    }
  }

  get language(): Language {
    return this.currentLanguage;
  }

  get messages(): Messages {
    return messages[this.currentLanguage];
  }

  setLanguage(language: Language): void {
    if (this.currentLanguage !== language) {
      this.currentLanguage = language;
      localStorage.setItem('tasq-flow-language', language);
      this.listeners.forEach(listener => listener(language));
    }
  }

  subscribe(listener: (language: Language) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // 便利メソッド
  formatMonth(date: Date): string {
    return format(date, this.messages.monthFormat, { 
      locale: this.messages.dateLocale 
    });
  }

  formatDate(date: Date, formatStr: string): string {
    return format(date, formatStr, { 
      locale: this.messages.dateLocale 
    });
  }

  t(key: string): string {
    const keys = key.split('.');
    let value: any = this.messages;
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    
    return typeof value === 'string' ? value : key;
  }
}

export const i18n = new I18nManager();

// React Hook
export function useTranslation() {
  const [language, setLanguage] = React.useState(i18n.language);

  React.useEffect(() => {
    const unsubscribe = i18n.subscribe(setLanguage);
    return unsubscribe;
  }, []);

  return {
    language,
    setLanguage: i18n.setLanguage.bind(i18n),
    t: i18n.t.bind(i18n),
    formatMonth: i18n.formatMonth.bind(i18n),
    formatDate: i18n.formatDate.bind(i18n),
    messages: i18n.messages,
  };
}

export default i18n;