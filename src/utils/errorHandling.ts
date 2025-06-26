// エラーハンドリングユーティリティ

export interface AppError {
  type: 'network' | 'validation' | 'permission' | 'data' | 'performance' | 'unknown';
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  retryable: boolean;
  userMessage: string;
}

export interface ErrorContext {
  component?: string;
  action?: string;
  data?: any;
  userId?: string;
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorListeners: Array<(error: AppError, context?: ErrorContext) => void> = [];

  private constructor() {}

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * エラーリスナーを追加
   */
  addErrorListener(listener: (error: AppError, context?: ErrorContext) => void): void {
    this.errorListeners.push(listener);
  }

  /**
   * エラーリスナーを削除
   */
  removeErrorListener(listener: (error: AppError, context?: ErrorContext) => void): void {
    const index = this.errorListeners.indexOf(listener);
    if (index > -1) {
      this.errorListeners.splice(index, 1);
    }
  }

  /**
   * エラーを処理し、すべてのリスナーに通知
   */
  handleError(error: Error | AppError, context?: ErrorContext): AppError {
    const appError = this.convertToAppError(error);
    
    console.error('🚨 Error handled:', appError, context);
    
    // エラーをローカルストレージに記録
    this.logError(appError, context);
    
    // すべてのリスナーに通知
    this.errorListeners.forEach(listener => {
      try {
        listener(appError, context);
      } catch (listenerError) {
        console.error('Error in error listener:', listenerError);
      }
    });

    return appError;
  }

  /**
   * ネットワークエラーを処理
   */
  handleNetworkError(error: Error, context?: ErrorContext): AppError {
    const appError: AppError = {
      type: 'network',
      code: 'NETWORK_ERROR',
      message: error.message,
      details: error,
      timestamp: new Date(),
      retryable: true,
      userMessage: 'ネットワーク接続に問題があります。インターネット接続を確認してください。',
    };

    return this.handleError(appError, context);
  }

  /**
   * バリデーションエラーを処理
   */
  handleValidationError(field: string, message: string, context?: ErrorContext): AppError {
    const appError: AppError = {
      type: 'validation',
      code: 'VALIDATION_ERROR',
      message: `${field}: ${message}`,
      details: { field, message },
      timestamp: new Date(),
      retryable: false,
      userMessage: `入力内容に問題があります: ${message}`,
    };

    return this.handleError(appError, context);
  }

  /**
   * 権限エラーを処理
   */
  handlePermissionError(action: string, context?: ErrorContext): AppError {
    const appError: AppError = {
      type: 'permission',
      code: 'PERMISSION_DENIED',
      message: `Permission denied for action: ${action}`,
      details: { action },
      timestamp: new Date(),
      retryable: false,
      userMessage: 'この操作を実行する権限がありません。',
    };

    return this.handleError(appError, context);
  }

  /**
   * データエラーを処理
   */
  handleDataError(operation: string, details?: any, context?: ErrorContext): AppError {
    const appError: AppError = {
      type: 'data',
      code: 'DATA_ERROR',
      message: `Data operation failed: ${operation}`,
      details,
      timestamp: new Date(),
      retryable: true,
      userMessage: 'データの処理中にエラーが発生しました。しばらく後に再試行してください。',
    };

    return this.handleError(appError, context);
  }

  /**
   * パフォーマンスエラーを処理
   */
  handlePerformanceError(metric: string, value: number, threshold: number, context?: ErrorContext): AppError {
    const appError: AppError = {
      type: 'performance',
      code: 'PERFORMANCE_WARNING',
      message: `Performance threshold exceeded: ${metric} = ${value} > ${threshold}`,
      details: { metric, value, threshold },
      timestamp: new Date(),
      retryable: true,
      userMessage: 'アプリケーションの動作が重くなっています。',
    };

    return this.handleError(appError, context);
  }

  /**
   * 汎用エラーをAppErrorに変換
   */
  private convertToAppError(error: Error | AppError): AppError {
    if (this.isAppError(error)) {
      return error;
    }

    // ネットワークエラーの検出
    if (error.message.includes('fetch') || error.message.includes('network') || error.message.includes('Failed to fetch')) {
      return {
        type: 'network',
        code: 'NETWORK_ERROR',
        message: error.message,
        details: error,
        timestamp: new Date(),
        retryable: true,
        userMessage: 'ネットワークエラーが発生しました。接続を確認してください。',
      };
    }

    // TypeErrorやReferenceErrorの検出
    if (error instanceof TypeError || error instanceof ReferenceError) {
      return {
        type: 'data',
        code: 'RUNTIME_ERROR',
        message: error.message,
        details: error,
        timestamp: new Date(),
        retryable: false,
        userMessage: 'アプリケーションエラーが発生しました。',
      };
    }

    // デフォルトのエラー
    return {
      type: 'unknown',
      code: 'UNKNOWN_ERROR',
      message: error.message || 'Unknown error occurred',
      details: error,
      timestamp: new Date(),
      retryable: true,
      userMessage: '予期しないエラーが発生しました。',
    };
  }

  /**
   * AppErrorかどうかを判定
   */
  private isAppError(error: any): error is AppError {
    return error && typeof error === 'object' && 'type' in error && 'code' in error;
  }

  /**
   * エラーをローカルストレージに記録
   */
  private logError(error: AppError, context?: ErrorContext): void {
    try {
      const errorLog = {
        ...error,
        context,
        userAgent: navigator.userAgent,
        url: window.location.href,
      };

      const existingLogs = JSON.parse(localStorage.getItem('appErrorLogs') || '[]');
      existingLogs.push(errorLog);

      // 最新の50件のみ保持
      if (existingLogs.length > 50) {
        existingLogs.splice(0, existingLogs.length - 50);
      }

      localStorage.setItem('appErrorLogs', JSON.stringify(existingLogs));
    } catch (storageError) {
      console.error('Failed to log error:', storageError);
    }
  }

  /**
   * エラーログを取得
   */
  getErrorLogs(): any[] {
    try {
      return JSON.parse(localStorage.getItem('appErrorLogs') || '[]');
    } catch {
      return [];
    }
  }

  /**
   * エラーログをクリア
   */
  clearErrorLogs(): void {
    try {
      localStorage.removeItem('appErrorLogs');
    } catch (error) {
      console.error('Failed to clear error logs:', error);
    }
  }
}

// シングルトンインスタンス
export const errorHandler = ErrorHandler.getInstance();

// React Hook for error handling
export const useErrorHandler = () => {
  const handleError = (error: Error | AppError, context?: ErrorContext) => {
    return errorHandler.handleError(error, context);
  };

  const handleNetworkError = (error: Error, context?: ErrorContext) => {
    return errorHandler.handleNetworkError(error, context);
  };

  const handleValidationError = (field: string, message: string, context?: ErrorContext) => {
    return errorHandler.handleValidationError(field, message, context);
  };

  const handlePermissionError = (action: string, context?: ErrorContext) => {
    return errorHandler.handlePermissionError(action, context);
  };

  const handleDataError = (operation: string, details?: any, context?: ErrorContext) => {
    return errorHandler.handleDataError(operation, details, context);
  };

  const handlePerformanceError = (metric: string, value: number, threshold: number, context?: ErrorContext) => {
    return errorHandler.handlePerformanceError(metric, value, threshold, context);
  };

  return {
    handleError,
    handleNetworkError,
    handleValidationError,
    handlePermissionError,
    handleDataError,
    handlePerformanceError,
  };
};

// エラー通知用のコンテキスト
export interface ErrorNotification {
  id: string;
  error: AppError;
  context?: ErrorContext;
  acknowledged: boolean;
  timestamp: Date;
}

// グローバルエラー通知管理
export class ErrorNotificationManager {
  private static instance: ErrorNotificationManager;
  private notifications: ErrorNotification[] = [];
  private listeners: Array<(notifications: ErrorNotification[]) => void> = [];

  private constructor() {
    // グローバルエラーハンドラーに登録
    errorHandler.addErrorListener((error, context) => {
      this.addNotification(error, context);
    });
  }

  static getInstance(): ErrorNotificationManager {
    if (!ErrorNotificationManager.instance) {
      ErrorNotificationManager.instance = new ErrorNotificationManager();
    }
    return ErrorNotificationManager.instance;
  }

  addNotification(error: AppError, context?: ErrorContext): void {
    const notification: ErrorNotification = {
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      error,
      context,
      acknowledged: false,
      timestamp: new Date(),
    };

    this.notifications.push(notification);
    this.notifyListeners();

    // 10秒後に自動削除（重要でないエラーの場合）
    if (error.type !== 'permission' && error.type !== 'validation') {
      setTimeout(() => {
        this.removeNotification(notification.id);
      }, 10000);
    }
  }

  removeNotification(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notifyListeners();
  }

  acknowledgeNotification(id: string): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.acknowledged = true;
      this.notifyListeners();
    }
  }

  clearAllNotifications(): void {
    this.notifications = [];
    this.notifyListeners();
  }

  getNotifications(): ErrorNotification[] {
    return [...this.notifications];
  }

  addListener(listener: (notifications: ErrorNotification[]) => void): void {
    this.listeners.push(listener);
  }

  removeListener(listener: (notifications: ErrorNotification[]) => void): void {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener([...this.notifications]);
      } catch (error) {
        console.error('Error in notification listener:', error);
      }
    });
  }
}

export const errorNotificationManager = ErrorNotificationManager.getInstance();