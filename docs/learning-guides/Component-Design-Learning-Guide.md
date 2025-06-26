# コンポーネント設計 学習ガイド

**対象**: React基礎を学んだ初学者  
**難易度**: ⭐⭐⭐⭐☆（中級〜上級）  
**学習時間**: 約4-5時間

---

## 📚 このガイドで学べること

- 良いコンポーネント設計の原則
- 再利用可能なコンポーネントの作り方
- Propsの設計方法
- コンポーネントの分割戦略
- TasQ Flowで使われている設計パターン

---

## 🤔 コンポーネント設計って何？

### 分かりやすい例え話：料理のレシピ作り

**悪いレシピ**（悪いコンポーネント設計）：
```
「何かおいしいものを作る」
- 適当に材料を混ぜる
- 火加減はその時の気分で
- 完成品は毎回違う味
```

**良いレシピ**（良いコンポーネント設計）：
```
「唐揚げを作る」
- 材料: 鶏肉300g、醤油大さじ2、にんにく1片...
- 手順: 1. 肉を切る 2. 下味をつける 3. 揚げる...
- 誰が作っても同じ味になる
```

コンポーネント設計も同じで、**「何をするか」「何が必要か」「どう使うか」**を明確にすることが重要です。

---

## 🎯 良いコンポーネント設計の原則

### 1. 単一責任の原則（SRP）

```tsx
// ❌ 悪い例：一つのコンポーネントが複数の責任を持つ
function UserDashboard({ userId }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  
  // ユーザー情報の取得
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);
  
  // 投稿の取得
  useEffect(() => {
    fetchPosts(userId).then(setPosts);
  }, [userId]);
  
  // 通知の取得
  useEffect(() => {
    fetchNotifications(userId).then(setNotifications);
  }, [userId]);
  
  return (
    <div>
      {/* ユーザー情報の表示 */}
      <div>{user?.name}</div>
      
      {/* 投稿一覧の表示 */}
      <div>
        {posts.map(post => (
          <div key={post.id}>{post.title}</div>
        ))}
      </div>
      
      {/* 通知一覧の表示 */}
      <div>
        {notifications.map(notification => (
          <div key={notification.id}>{notification.message}</div>
        ))}
      </div>
    </div>
  );
}
```

```tsx
// ✅ 良い例：責任を分割
function UserDashboard({ userId }) {
  return (
    <div>
      <UserProfile userId={userId} />
      <UserPosts userId={userId} />
      <UserNotifications userId={userId} />
    </div>
  );
}

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);
  
  return <div>{user?.name}</div>;
}

function UserPosts({ userId }) {
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    fetchPosts(userId).then(setPosts);
  }, [userId]);
  
  return (
    <div>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

### 2. プロパティ（Props）の設計

```tsx
// ❌ 悪い例：プロパティが曖昧
function Button({ data, config, handlers }) {
  return (
    <button 
      onClick={handlers.click}
      style={config.style}
    >
      {data.text}
    </button>
  );
}

// ✅ 良い例：プロパティが明確
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onClick?: () => void;
  loading?: boolean;
}

function Button({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false,
  onClick,
  loading = false
}: ButtonProps) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled || loading}
      className={`btn btn-${variant} btn-${size}`}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
}

// 使用例
<Button variant="primary" size="large" onClick={handleSave}>
  保存
</Button>
```

### 3. コンポーネントの合成（Composition）

```tsx
// ✅ 合成可能なカードコンポーネント
function Card({ children, className = "" }) {
  return (
    <div className={`card ${className}`}>
      {children}
    </div>
  );
}

function CardHeader({ children }) {
  return <div className="card-header">{children}</div>;
}

function CardBody({ children }) {
  return <div className="card-body">{children}</div>;
}

function CardFooter({ children }) {
  return <div className="card-footer">{children}</div>;
}

// 名前空間として組み合わせ
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

// 使用例
function TaskCard({ task }) {
  return (
    <Card>
      <Card.Header>
        <h3>{task.title}</h3>
      </Card.Header>
      <Card.Body>
        <p>{task.description}</p>
      </Card.Body>
      <Card.Footer>
        <Button onClick={() => editTask(task.id)}>編集</Button>
      </Card.Footer>
    </Card>
  );
}
```

---

## 🧩 再利用可能なコンポーネントの作り方

### 1. Input コンポーネント

```tsx
interface InputProps {
  label?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helpText?: string;
}

function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  helpText
}: InputProps) {
  const inputId = `input-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="input-group">
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`input ${error ? 'input-error' : ''}`}
      />
      
      {error && <span className="error-message">{error}</span>}
      {helpText && !error && <span className="help-text">{helpText}</span>}
    </div>
  );
}

// 使用例
function UserForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: ''
  });
  const [errors, setErrors] = useState({});

  return (
    <form>
      <Input
        label="お名前"
        value={formData.name}
        onChange={(value) => setFormData({...formData, name: value})}
        required
        error={errors.name}
      />
      
      <Input
        label="メールアドレス"
        type="email"
        value={formData.email}
        onChange={(value) => setFormData({...formData, email: value})}
        required
        error={errors.email}
        helpText="有効なメールアドレスを入力してください"
      />
      
      <Input
        label="年齢"
        type="number"
        value={formData.age}
        onChange={(value) => setFormData({...formData, age: value})}
      />
    </form>
  );
}
```

### 2. Modal コンポーネント

```tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  closeOnBackdropClick?: boolean;
}

function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  closeOnBackdropClick = true
}: ModalProps) {
  // ESCキーでモーダルを閉じる
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="modal-backdrop"
      onClick={closeOnBackdropClick ? onClose : undefined}
    >
      <div 
        className={`modal modal-${size}`}
        onClick={(e) => e.stopPropagation()} // バブリング防止
      >
        <div className="modal-header">
          {title && <h2>{title}</h2>}
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}

// 使用例
function App() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setModalOpen(true)}>
        モーダルを開く
      </Button>
      
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="確認"
        size="small"
      >
        <p>本当に削除しますか？</p>
        <div className="modal-actions">
          <Button variant="danger" onClick={handleDelete}>
            削除
          </Button>
          <Button variant="secondary" onClick={() => setModalOpen(false)}>
            キャンセル
          </Button>
        </div>
      </Modal>
    </div>
  );
}
```

---

## 🎮 実践：タスクカードコンポーネントを設計しよう

### Step 1: 要件の整理

```typescript
// まず、タスクカードに必要な機能を整理
interface TaskCardRequirements {
  // 表示する情報
  - タスクのタイトル
  - 説明文
  - 優先度
  - 進捗状況
  - 担当者
  - 期限
  - ステータス

  // 操作
  - 編集ボタン
  - 削除ボタン
  - ステータス変更
  - 詳細表示

  // 見た目のバリエーション
  - サイズ（小・中・大）
  - レイアウト（横・縦）
  - テーマ（通常・ダーク）
}
```

### Step 2: 型定義

```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  progress: number; // 0-100
  assignee?: string;
  dueDate?: Date;
  status: 'todo' | 'in-progress' | 'done' | 'blocked';
  tags?: string[];
}

interface TaskCardProps {
  task: Task;
  size?: 'compact' | 'normal' | 'detailed';
  layout?: 'horizontal' | 'vertical';
  showActions?: boolean;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onStatusChange?: (taskId: string, status: Task['status']) => void;
  onClick?: (task: Task) => void;
}
```

### Step 3: コンポーネント実装

```tsx
function TaskCard({
  task,
  size = 'normal',
  layout = 'vertical',
  showActions = true,
  onEdit,
  onDelete,
  onStatusChange,
  onClick
}: TaskCardProps) {
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      case 'urgent': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'todo': return '📋';
      case 'in-progress': return '⚡';
      case 'done': return '✅';
      case 'blocked': return '🚫';
      default: return '📋';
    }
  };

  const formatDueDate = (date: Date) => {
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return '期限切れ';
    if (diffDays === 0) return '今日';
    if (diffDays === 1) return '明日';
    return `${diffDays}日後`;
  };

  return (
    <div 
      className={`task-card task-card-${size} task-card-${layout}`}
      onClick={() => onClick?.(task)}
    >
      {/* ヘッダー */}
      <div className="task-card-header">
        <div className="task-priority" 
             style={{ backgroundColor: getPriorityColor(task.priority) }}>
          {task.priority}
        </div>
        <div className="task-status">
          {getStatusIcon(task.status)}
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="task-card-content">
        <h3 className="task-title">{task.title}</h3>
        
        {size !== 'compact' && task.description && (
          <p className="task-description">{task.description}</p>
        )}
        
        {size === 'detailed' && (
          <div className="task-details">
            {task.assignee && (
              <div className="task-assignee">
                👤 {task.assignee}
              </div>
            )}
            
            {task.dueDate && (
              <div className="task-due-date">
                📅 {formatDueDate(task.dueDate)}
              </div>
            )}
            
            <div className="task-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${task.progress}%` }}
                />
              </div>
              <span>{task.progress}%</span>
            </div>
            
            {task.tags && task.tags.length > 0 && (
              <div className="task-tags">
                {task.tags.map(tag => (
                  <span key={tag} className="tag">#{tag}</span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* アクションボタン */}
      {showActions && (
        <div className="task-card-actions">
          {onStatusChange && (
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task.id, e.target.value as Task['status'])}
              onClick={(e) => e.stopPropagation()}
            >
              <option value="todo">ToDo</option>
              <option value="in-progress">進行中</option>
              <option value="done">完了</option>
              <option value="blocked">ブロック</option>
            </select>
          )}
          
          {onEdit && (
            <Button 
              size="small" 
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
            >
              編集
            </Button>
          )}
          
          {onDelete && (
            <Button 
              size="small" 
              variant="danger"
              onClick={(e) => {
                e.stopPropagation();
                if (confirm('本当に削除しますか？')) {
                  onDelete(task.id);
                }
              }}
            >
              削除
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
```

### Step 4: 使用例

```tsx
function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'UIデザインの修正',
      description: 'ヘッダーのレイアウトを調整する',
      priority: 'high',
      progress: 60,
      assignee: '田中',
      dueDate: new Date('2025-06-30'),
      status: 'in-progress',
      tags: ['UI', 'デザイン']
    },
    // ... 他のタスク
  ]);

  const handleEditTask = (task: Task) => {
    // 編集モーダルを開く
    console.log('編集:', task);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const handleStatusChange = (taskId: string, status: Task['status']) => {
    setTasks(tasks.map(t => 
      t.id === taskId ? { ...t, status } : t
    ));
  };

  return (
    <div className="task-board">
      {/* コンパクト表示 */}
      <div className="task-column">
        <h2>コンパクト表示</h2>
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            size="compact"
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>

      {/* 詳細表示 */}
      <div className="task-column">
        <h2>詳細表示</h2>
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            size="detailed"
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>
    </div>
  );
}
```

---

## 🏗️ TasQ Flowでの設計パターン

### 1. レイアウトコンポーネント

```tsx
// 基本レイアウト
function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-layout">
      <Header />
      <div className="app-content">
        <Sidebar />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}

// ページレイアウト
function PageLayout({ 
  title, 
  actions, 
  children 
}: { 
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="page-layout">
      <div className="page-header">
        <h1>{title}</h1>
        {actions && <div className="page-actions">{actions}</div>}
      </div>
      <div className="page-content">
        {children}
      </div>
    </div>
  );
}
```

### 2. 条件付きレンダリングコンポーネント

```tsx
interface ConditionalProps {
  when: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

function When({ when, children, fallback = null }: ConditionalProps) {
  return when ? <>{children}</> : <>{fallback}</>;
}

// 使用例
function TaskList({ tasks, loading, error }) {
  return (
    <div>
      <When when={loading} fallback={
        <When when={error} fallback={
          <When when={tasks.length === 0} fallback={
            <div>
              {tasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          }>
            <div>タスクがありません</div>
          </When>
        }>
          <div>エラーが発生しました: {error}</div>
        </When>
      }>
        <div>読み込み中...</div>
      </When>
    </div>
  );
}
```

---

## 🎁 実践的なTips

### 1. カスタムフックでロジックを分離

```tsx
// ❌ コンポーネントにロジックが混在
function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchTasks()
      .then(setTasks)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  const addTask = (task) => {
    setTasks([...tasks, task]);
  };

  // ... 他のロジック
}

// ✅ カスタムフックでロジックを分離
function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchTasks()
      .then(setTasks)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  const addTask = useCallback((task) => {
    setTasks(prev => [...prev, task]);
  }, []);

  const updateTask = useCallback((id, updates) => {
    setTasks(prev => prev.map(t => t.id === id ? {...t, ...updates} : t));
  }, []);

  return { tasks, loading, error, addTask, updateTask };
}

// コンポーネントはシンプルに
function TaskList() {
  const { tasks, loading, error, addTask, updateTask } = useTasks();

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div>
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} onUpdate={updateTask} />
      ))}
    </div>
  );
}
```

### 2. Render Props パターン

```tsx
interface DataFetcherProps<T> {
  url: string;
  children: (data: {
    data: T | null;
    loading: boolean;
    error: string | null;
  }) => React.ReactNode;
}

function DataFetcher<T>({ url, children }: DataFetcherProps<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [url]);

  return <>{children({ data, loading, error })}</>;
}

// 使用例
function UserProfile({ userId }) {
  return (
    <DataFetcher<User> url={`/api/users/${userId}`}>
      {({ data: user, loading, error }) => {
        if (loading) return <Spinner />;
        if (error) return <Error message={error} />;
        return <div>{user?.name}</div>;
      }}
    </DataFetcher>
  );
}
```

---

## 🏆 レベルアップチャレンジ

### 初級（⭐）
1. 再利用可能なButtonコンポーネントを作ろう
2. Loading表示コンポーネントを作ろう

### 中級（⭐⭐）
1. FormコンポーネントとInputコンポーネントを組み合わせよう
2. 条件付きレンダリングのヘルパーコンポーネントを作ろう

### 上級（⭐⭐⭐）
1. 複雑なDataGridコンポーネントを設計しよう
2. カスタムフックを活用したコンポーネント群を作ろう

---

## 📖 参考資料

### React公式
- [Thinking in React](https://ja.react.dev/learn/thinking-in-react)
- [Component Design Patterns](https://ja.react.dev/learn/passing-props-to-a-component)

### デザインパターン
- [React Design Patterns](https://www.patterns.dev/posts/react-patterns)
- [Compound Components](https://kentcdodds.com/blog/compound-components-with-react-hooks)

---

## 💡 まとめ

コンポーネント設計は、**保守性と再利用性**を高める重要な技術です。

### 覚えておこう！
1. **単一責任**：一つのコンポーネントは一つのことだけ
2. **明確なインターフェース**：Propsは分かりやすく設計
3. **合成可能**：小さなコンポーネントを組み合わせられる
4. **再利用性**：他の場所でも使える汎用的な設計

良いコンポーネント設計ができると、開発速度が格段に上がります。最初は時間がかかりますが、長期的には大きなメリットがあります！ 🧩

---

**学習ガイドは以上です。次は実際のWebアプリ開発に戻りましょう！**

---

**質問や疑問があれば、いつでも開発チームにお聞きください！**