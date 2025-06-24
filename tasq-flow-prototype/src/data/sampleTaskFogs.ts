import type { TaskFog } from '../types/task';
import { addDays } from 'date-fns';

const today = new Date();

export const sampleTaskFogs: TaskFog[] = [
  {
    id: 'fog1',
    userId: '田中太郎',
    startDate: addDays(today, 2),
    endDate: addDays(today, 4),
    color: '#FF6B6B',
    borderStyle: {
      width: '2px',
      color: '#333333',
      style: 'solid',
    },
  },
  {
    id: 'fog2',
    userId: '佐藤花子',
    startDate: addDays(today, 8),
    endDate: addDays(today, 10),
    color: '#4ECDC4',
    borderStyle: {
      width: '1px',
      color: '#000000',
      style: 'dashed',
    },
  },
  {
    id: 'fog3',
    userId: '鈴木次郎',
    startDate: addDays(today, 15),
    endDate: addDays(today, 18),
    color: '#45B7D1',
    borderStyle: {
      width: '3px',
      color: '#FFFFFF',
      style: 'dotted',
    },
  },
];