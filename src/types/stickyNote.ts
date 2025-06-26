export interface StickyNote {
  id: string;
  title: string;
  content: string;
  color: string;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  taskId?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isMinimized: boolean;
  zIndex: number;
}