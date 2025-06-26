export interface ChangeHistoryItem {
  id: string;
  timestamp: Date;
  userId: string;
  action: 'create' | 'update' | 'delete' | 'move' | 'assign';
  entityType: 'task' | 'checklist' | 'project' | 'member' | 'settings' | 'taskfog' | 'stickynote';
  entityId: string;
  entityName: string;
  changes: ChangeDetail[];
  ipAddress?: string;
  userAgent?: string;
}

export interface ChangeDetail {
  field: string;
  oldValue: any;
  newValue: any;
  displayName: string;
}

export interface ConflictEvent {
  id: string;
  timestamp: Date;
  entityType: string;
  entityId: string;
  entityName: string;
  users: string[];
  resolved: boolean;
  resolutionMethod?: 'auto' | 'manual';
  resolvedBy?: string;
  resolvedAt?: Date;
}