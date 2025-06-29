# エラーハンドリング 学習ガイド

## 📚 はじめに

このガイドでは、Reactアプリケーションにおけるエラーハンドリングの実装方法を学びます。TasQ Flowで使われているような、ユーザーフレンドリーで堅牢なエラー処理システムを構築しましょう。

## 🎯 学習目標

- エラーの種類と原因を理解する
- Error Boundaryの使い方を習得する
- 非同期処理のエラーハンドリングを学ぶ
- ユーザーフレンドリーなエラー表示を実装する
- エラーログとモニタリングの基礎を理解する

## 📖 1. エラーの種類

### 1. JavaScript エラー

```typescript
// 構文エラー
function badFunction() {
  return "Hello World" // ← セミコロンがないとエラー（実際は自動補完される）
}

// 実行時エラー
function divideByZero(a: number, b: number) {
  if (b === 0) {
    throw new Error("ゼロで割ることはできません");
  }
  return a / b;
}

// 型エラー
function processUser(user: { name: string; age: number }) {
  return user.name.toUpperCase(); // userがnullだとエラー
}
```

### 2. React エラー

```typescript
// レンダリングエラー
function BuggyComponent({ user }) {
  return <div>{user.name}</div>; // userがundefinedだとエラー
}

// useEffect内のエラー
function DataComponent() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetchData()
      .then(setData)
      .catch(console.error); // エラーを適切に処理
  }, []);
  
  return <div>{data?.name}</div>;
}
```

### 3. 非同期エラー

```typescript
// API通信エラー
async function fetchUserData(userId: string) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("ネットワーク接続に問題があります");
    }
    throw error;
  }
}
```

## 📖 2. Error Boundary

### 基本的なError Boundary

```typescript
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // エラーが発生した時の状態更新
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // エラーログの送信
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    // 外部のエラー監視サービスに送信
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // カスタムフォールバックUI
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // デフォルトのエラー表示
      return (
        <div style={{
          padding: '2rem',
          textAlign: 'center',
          border: '1px solid #ff6b6b',
          borderRadius: '8px',
          backgroundColor: '#fff5f5'
        }}>
          <h2>おっと！何かが間違いました</h2>
          <p>申し訳ございませんが、予期しないエラーが発生しました。</p>
          <details style={{ marginTop: '1rem', textAlign: 'left' }}>
            <summary>技術的な詳細</summary>
            <pre style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
              {this.state.error?.toString()}
            </pre>
          </details>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#ff6b6b',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            ページを再読み込み
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 関数型Error Boundary（React 18+）

```typescript
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div role="alert" className="error-fallback">
      <h2>Something went wrong:</h2>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

function MyApp() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        // エラーログサービスに送信
        console.error('Error caught by boundary:', error, errorInfo);
      }}
      onReset={() => {
        // エラー状態をリセットする際の処理
        window.location.reload();
      }}
    >
      <App />
    </ErrorBoundary>
  );
}
```

## 📖 3. 非同期エラーハンドリング

### カスタムフックでのエラー管理

```typescript
interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useAsync<T>(
  asyncFunction: () => Promise<T>,
  dependencies: any[] = []
): UseAsyncState<T> & {
  execute: () => Promise<void>;
  reset: () => void;
} {
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await asyncFunction();
      setState({ data: result, loading: false, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : '不明なエラーが発生しました';
      
      setState({ data: null, loading: false, error: errorMessage });
    }
  }, dependencies);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  useEffect(() => {
    execute();
  }, [execute]);

  return { ...state, execute, reset };
}

// 使用例
function UserProfile({ userId }: { userId: string }) {
  const { data: user, loading, error, execute } = useAsync(
    () => fetchUser(userId),
    [userId]
  );

  if (loading) return <div>読み込み中...</div>;
  
  if (error) {
    return (
      <div className="error-container">
        <p>エラー: {error}</p>
        <button onClick={execute}>再試行</button>
      </div>
    );
  }

  if (!user) return <div>ユーザーが見つかりません</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

### API クライアントでのエラーハンドリング

```typescript
class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      // HTTPステータスコードのチェック
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        throw new ApiError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData.code
        );
      }

      return await response.json();
    } catch (error) {
      // ネットワークエラーの処理
      if (error instanceof TypeError) {
        throw new ApiError(
          'ネットワーク接続に問題があります。インターネット接続を確認してください。',
          0,
          'NETWORK_ERROR'
        );
      }
      
      // その他のエラーはそのまま再スロー
      throw error;
    }
  }

  async getUser(id: string) {
    return this.request<User>(`/users/${id}`);
  }

  async createTask(task: Omit<Task, 'id'>) {
    return this.request<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }
}

// 使用例
const apiClient = new ApiClient('/api');

function TaskCreator() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateTask = async (taskData: Omit<Task, 'id'>) => {
    setLoading(true);
    setError(null);

    try {
      await apiClient.createTask(taskData);
      // 成功時の処理
    } catch (error) {
      if (error instanceof ApiError) {
        switch (error.status) {
          case 400:
            setError('入力データに問題があります。');
            break;
          case 401:
            setError('認証が必要です。ログインしてください。');
            break;
          case 403:
            setError('この操作を実行する権限がありません。');
            break;
          case 500:
            setError('サーバーエラーが発生しました。しばらく待ってから再試行してください。');
            break;
          default:
            setError(error.message);
        }
      } else {
        setError('予期しないエラーが発生しました。');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="error-alert">
          {error}
        </div>
      )}
      <TaskForm onSubmit={handleCreateTask} loading={loading} />
    </div>
  );
}
```

## 📖 4. エラー通知システム

### グローバルエラー通知

```typescript
interface ErrorNotification {
  id: string;
  message: string;
  type: 'error' | 'warning' | 'info';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ErrorNotificationContextValue {
  notifications: ErrorNotification[];
  addNotification: (notification: Omit<ErrorNotification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const ErrorNotificationContext = createContext<ErrorNotificationContextValue | null>(null);

export function ErrorNotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<ErrorNotification[]>([]);

  const addNotification = useCallback((notification: Omit<ErrorNotification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification = { ...notification, id };
    
    setNotifications(prev => [...prev, newNotification]);

    // 自動削除
    if (notification.duration !== 0) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration || 5000);
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <ErrorNotificationContext.Provider value={{
      notifications,
      addNotification,
      removeNotification,
      clearAll
    }}>
      {children}
      <ErrorNotificationDisplay />
    </ErrorNotificationContext.Provider>
  );
}

function ErrorNotificationDisplay() {
  const context = useContext(ErrorNotificationContext);
  if (!context) return null;

  const { notifications, removeNotification } = context;

  return (
    <div className="error-notifications">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`notification notification-${notification.type}`}
        >
          <div className="notification-content">
            <p>{notification.message}</p>
            {notification.action && (
              <button
                onClick={notification.action.onClick}
                className="notification-action"
              >
                {notification.action.label}
              </button>
            )}
          </div>
          <button
            onClick={() => removeNotification(notification.id)}
            className="notification-close"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

// カスタムフック
export function useErrorNotification() {
  const context = useContext(ErrorNotificationContext);
  if (!context) {
    throw new Error('useErrorNotification must be used within ErrorNotificationProvider');
  }
  return context;
}
```

### 使用例

```typescript
function TaskManager() {
  const { addNotification } = useErrorNotification();

  const handleError = (error: Error) => {
    addNotification({
      type: 'error',
      message: error.message,
      action: {
        label: '再試行',
        onClick: () => {
          // 再試行ロジック
        }
      }
    });
  };

  const handleTaskSave = async (task: Task) => {
    try {
      await saveTask(task);
      addNotification({
        type: 'info',
        message: 'タスクが保存されました',
        duration: 3000
      });
    } catch (error) {
      handleError(error as Error);
    }
  };

  return <TaskForm onSave={handleTaskSave} />;
}
```

## 📖 5. TasQ Flowのエラーハンドリング

### エラー監視とロギング

```typescript
interface ErrorLog {
  id: string;
  timestamp: Date;
  level: 'error' | 'warning' | 'info';
  message: string;
  stack?: string;
  userAgent?: string;
  url?: string;
  userId?: string;
  context?: Record<string, any>;
}

class ErrorLogger {
  private logs: ErrorLog[] = [];
  private maxLogs = 100;

  log(level: ErrorLog['level'], message: string, context?: Record<string, any>) {
    const log: ErrorLog = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      level,
      message,
      userAgent: navigator.userAgent,
      url: window.location.href,
      context
    };

    this.logs.unshift(log);
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    // 開発環境ではコンソールにも出力
    if (process.env.NODE_ENV === 'development') {
      console[level === 'error' ? 'error' : 'log'](`[${level.toUpperCase()}]`, message, context);
    }

    // 本番環境では外部サービスに送信
    if (process.env.NODE_ENV === 'production' && level === 'error') {
      this.sendToExternalService(log);
    }
  }

  private async sendToExternalService(log: ErrorLog) {
    try {
      await fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(log)
      });
    } catch (error) {
      console.error('Failed to send error log:', error);
    }
  }

  getLogs(): ErrorLog[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}

export const errorLogger = new ErrorLogger();

// グローバルエラーハンドラー
window.addEventListener('error', (event) => {
  errorLogger.log('error', event.error?.message || 'Unknown error', {
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    stack: event.error?.stack
  });
});

window.addEventListener('unhandledrejection', (event) => {
  errorLogger.log('error', `Unhandled promise rejection: ${event.reason}`, {
    reason: event.reason
  });
});
```

### フォームバリデーションエラー

```typescript
interface FormErrors {
  [field: string]: string | undefined;
}

interface UseFormValidationOptions<T> {
  validationRules: {
    [K in keyof T]?: Array<(value: T[K]) => string | undefined>;
  };
  onSubmit: (values: T) => Promise<void> | void;
}

function useFormValidation<T extends Record<string, any>>({
  validationRules,
  onSubmit
}: UseFormValidationOptions<T>) {
  const [values, setValues] = useState<Partial<T>>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback((field: keyof T, value: any): string | undefined => {
    const rules = validationRules[field];
    if (!rules) return undefined;

    for (const rule of rules) {
      const error = rule(value);
      if (error) return error;
    }
    return undefined;
  }, [validationRules]);

  const setValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    // リアルタイムバリデーション
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
  }, [validateField]);

  const validateAll = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    let hasErrors = false;

    Object.keys(validationRules).forEach(field => {
      const error = validateField(field, values[field]);
      if (error) {
        newErrors[field] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    return !hasErrors;
  }, [values, validationRules, validateField]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!validateAll()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(values as T);
    } catch (error) {
      // サーバーサイドエラーの処理
      if (error instanceof ApiError && error.status === 400) {
        // フィールド固有のエラーを設定
        const fieldErrors = error.context?.fieldErrors || {};
        setErrors(prev => ({ ...prev, ...fieldErrors }));
      } else {
        throw error; // その他のエラーは上位に委譲
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateAll, onSubmit]);

  return {
    values,
    errors,
    isSubmitting,
    setValue,
    handleSubmit,
    validateAll
  };
}

// バリデーションルール
const createTaskValidationRules = {
  title: [
    (value: string) => !value?.trim() ? 'タイトルは必須です' : undefined,
    (value: string) => value?.length > 100 ? 'タイトルは100文字以内で入力してください' : undefined
  ],
  dueDate: [
    (value: Date) => !value ? '期限は必須です' : undefined,
    (value: Date) => value < new Date() ? '期限は今日以降の日付を選択してください' : undefined
  ]
};

// 使用例
function TaskForm() {
  const { addNotification } = useErrorNotification();
  
  const { values, errors, isSubmitting, setValue, handleSubmit } = useFormValidation({
    validationRules: createTaskValidationRules,
    onSubmit: async (values) => {
      try {
        await createTask(values);
        addNotification({
          type: 'info',
          message: 'タスクが作成されました'
        });
      } catch (error) {
        addNotification({
          type: 'error',
          message: 'タスクの作成に失敗しました'
        });
        throw error; // 再スローしてフォームエラーとして処理
      }
    }
  });

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          value={values.title || ''}
          onChange={(e) => setValue('title', e.target.value)}
          placeholder="タスクタイトル"
        />
        {errors.title && <span className="error">{errors.title}</span>}
      </div>
      
      <div>
        <input
          type="date"
          value={values.dueDate || ''}
          onChange={(e) => setValue('dueDate', new Date(e.target.value))}
        />
        {errors.dueDate && <span className="error">{errors.dueDate}</span>}
      </div>
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? '作成中...' : '作成'}
      </button>
    </form>
  );
}
```

## 🏆 レベルアップチャレンジ

### 初級（⭐）
1. 基本的なError Boundaryを実装しよう
2. シンプルなエラー通知システムを作ろう

### 中級（⭐⭐）
1. 非同期処理用のカスタムフックを作ろう
2. フォームバリデーションエラーを実装しよう

### 上級（⭐⭐⭐）
1. エラーログシステムを構築しよう
2. ユーザーフレンドリーなエラー復旧機能を実装しよう

## 📚 まとめ

適切なエラーハンドリングは、**ユーザー体験と開発効率**を大きく向上させます：

### 覚えておこう！
1. **Error Boundary**：React コンポーネントのエラーをキャッチ
2. **非同期エラー**：try-catch とカスタムフックで処理
3. **ユーザビリティ**：分かりやすいエラーメッセージと復旧手段
4. **ログとモニタリング**：問題の早期発見と解決

エラーを恐れずに、適切に処理して素晴らしいアプリケーションを作りましょう！

## 🔗 次のステップ

- [付箋タブ実装チュートリアル](./Sticky-Notes-Background-Tutorial.md)で実践的な実装を学ぶ

## 💡 参考リソース

- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [Error Handling Best Practices](https://blog.bitsrc.io/react-error-handling-with-react-error-boundary-61b89fa0d87b)
- [JavaScript Error Handling](https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Control_flow_and_error_handling)