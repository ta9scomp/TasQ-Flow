# コンポーネント設計 学習ガイド

## 📚 はじめに

このガイドでは、再利用可能で保守しやすいReactコンポーネントの設計原則について学びます。TasQ Flowプロジェクトで使われているような、プロダクションレベルのコンポーネント設計手法を身につけましょう。

## 🎯 学習目標

- コンポーネント設計の基本原則を理解する
- 再利用可能なコンポーネントの作り方を学ぶ
- プロップスの設計パターンを習得する
- コンポーネントの分割方法を理解する
- TasQ Flowのコンポーネント設計を分析できるようになる

## 📖 1. コンポーネント設計の原則

### SOLID原則をReactに適用

#### 1. Single Responsibility Principle（単一責任原則）

```typescript
// ❌ 悪い例：一つのコンポーネントが多くの責任を持っている
function UserDashboard({ userId }) {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  
  // ユーザー情報を取得
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);
  
  // タスクを取得
  useEffect(() => {
    fetchTasks(userId).then(setTasks);
  }, [userId]);
  
  // 通知を取得
  useEffect(() => {
    fetchNotifications(userId).then(setNotifications);
  }, [userId]);
  
  return (
    <div>
      {/* ユーザー情報表示 */}
      <div>
        <img src={user?.avatar} />
        <h1>{user?.name}</h1>
        <p>{user?.email}</p>
      </div>
      
      {/* タスクリスト */}
      <div>
        <h2>タスク</h2>
        {tasks.map(task => (
          <div key={task.id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
          </div>
        ))}
      </div>
      
      {/* 通知 */}
      <div>
        <h2>通知</h2>
        {notifications.map(notification => (
          <div key={notification.id}>
            {notification.message}
          </div>
        ))}
      </div>
    </div>
  );
}
```

```typescript
// ✅ 良い例：責任を分割
function UserDashboard({ userId }) {
  return (
    <div>
      <UserProfile userId={userId} />
      <TaskList userId={userId} />
      <NotificationList userId={userId} />
    </div>
  );
}

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);
  
  if (!user) return <div>Loading...</div>;
  
  return (
    <div>
      <img src={user.avatar} alt={user.name} />
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}

function TaskList({ userId }) {
  const [tasks, setTasks] = useState([]);
  
  useEffect(() => {
    fetchTasks(userId).then(setTasks);
  }, [userId]);
  
  return (
    <div>
      <h2>タスク</h2>
      {tasks.map(task => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
}
```

#### 2. Open/Closed Principle（開放閉鎖原則）

```typescript
// 拡張可能な Button コンポーネント
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  disabled?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  // 新しいプロパティを追加しても既存のコードに影響しない
  fullWidth?: boolean;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  startIcon,
  endIcon,
  fullWidth = false,
  loading = false,
  ...props
}) => {
  return (
    <button
      className={`btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full' : ''}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Spinner size="small" />}
      {!loading && startIcon && <span className="btn-icon-start">{startIcon}</span>}
      {children}
      {!loading && endIcon && <span className="btn-icon-end">{endIcon}</span>}
    </button>
  );
};

// 使用例
<Button variant="primary" startIcon={<SaveIcon />}>
  保存
</Button>

<Button variant="danger" loading={isSaving}>
  削除
</Button>
```

## 📖 2. コンポーネントの分類

### 1. Presentational Components（表示コンポーネント）

```typescript
// 表示のみを担当し、状態を持たない
interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description: string;
    status: 'todo' | 'progress' | 'done';
    priority: 'low' | 'medium' | 'high';
  };
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onEdit, 
  onDelete, 
  onStatusChange 
}) => {
  return (
    <Card>
      <CardHeader>
        <Typography variant="h6">{task.title}</Typography>
        <Chip 
          label={task.priority} 
          color={task.priority === 'high' ? 'error' : 'default'}
        />
      </CardHeader>
      
      <CardContent>
        <Typography variant="body2">
          {task.description}
        </Typography>
        
        <Select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value)}
        >
          <MenuItem value="todo">To Do</MenuItem>
          <MenuItem value="progress">In Progress</MenuItem>
          <MenuItem value="done">Done</MenuItem>
        </Select>
      </CardContent>
      
      <CardActions>
        <Button onClick={() => onEdit(task)}>編集</Button>
        <Button onClick={() => onDelete(task.id)} color="error">
          削除
        </Button>
      </CardActions>
    </Card>
  );
};
```

### 2. Container Components（コンテナコンポーネント）

```typescript
// ビジネスロジックと状態管理を担当
const TaskListContainer: React.FC = () => {
  const {
    tasks,
    isLoading,
    error,
    updateTask,
    deleteTask,
    fetchTasks
  } = useTaskStore();
  
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);
  
  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };
  
  const handleDelete = async (taskId: string) => {
    if (confirm('本当に削除しますか？')) {
      await deleteTask(taskId);
    }
  };
  
  const handleStatusChange = (taskId: string, status: string) => {
    updateTask(taskId, { status });
  };
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  
  return (
    <>
      <TaskList 
        tasks={tasks}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
      />
      
      <TaskEditDialog
        open={dialogOpen}
        task={editingTask}
        onClose={() => setDialogOpen(false)}
        onSave={(updatedTask) => {
          updateTask(updatedTask.id, updatedTask);
          setDialogOpen(false);
        }}
      />
    </>
  );
};
```

### 3. Compound Components（複合コンポーネント）

```typescript
// 複数の部品が連携して動作するコンポーネント
interface TabsContextValue {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

const Tabs: React.FC<{ children: React.ReactNode; defaultTab?: string }> = ({ 
  children, 
  defaultTab 
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || '');
  
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">
        {children}
      </div>
    </TabsContext.Provider>
  );
};

const TabList: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="tab-list">{children}</div>;
};

const Tab: React.FC<{ value: string; children: React.ReactNode }> = ({ 
  value, 
  children 
}) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('Tab must be used within Tabs');
  
  const { activeTab, setActiveTab } = context;
  
  return (
    <button
      className={`tab ${activeTab === value ? 'active' : ''}`}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
};

const TabPanels: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="tab-panels">{children}</div>;
};

const TabPanel: React.FC<{ value: string; children: React.ReactNode }> = ({ 
  value, 
  children 
}) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabPanel must be used within Tabs');
  
  const { activeTab } = context;
  
  if (activeTab !== value) return null;
  
  return <div className="tab-panel">{children}</div>;
};

// 使用例
<Tabs defaultTab="tasks">
  <TabList>
    <Tab value="tasks">タスク</Tab>
    <Tab value="calendar">カレンダー</Tab>
    <Tab value="reports">レポート</Tab>
  </TabList>
  
  <TabPanels>
    <TabPanel value="tasks">
      <TaskList />
    </TabPanel>
    <TabPanel value="calendar">
      <Calendar />
    </TabPanel>
    <TabPanel value="reports">
      <Reports />
    </TabPanel>
  </TabPanels>
</Tabs>
```

## 📖 3. プロップス設計のベストプラクティス

### 1. デフォルト値の適切な設定

```typescript
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',  // デフォルト値を設定
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  ...rest
}) => {
  // コンポーネントの実装
};
```

### 2. Render Props パターン

```typescript
interface DataFetcherProps<T> {
  url: string;
  children: (data: {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
  }) => React.ReactNode;
}

function DataFetcher<T>({ url, children }: DataFetcherProps<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(url);
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  return children({ data, loading, error, refetch: fetchData });
}

// 使用例
<DataFetcher<User[]> url="/api/users">
  {({ data, loading, error, refetch }) => {
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    
    return (
      <div>
        <button onClick={refetch}>更新</button>
        {data?.map(user => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    );
  }}
</DataFetcher>
```

### 3. Polymorphic Components（多態コンポーネント）

```typescript
type AsProp<C extends React.ElementType> = {
  as?: C;
};

type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P);

type PolymorphicComponentProp<
  C extends React.ElementType,
  Props = {}
> = React.PropsWithChildren<Props & AsProp<C>> &
  Omit<React.ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;

interface TextProps {
  color?: 'primary' | 'secondary' | 'error';
  size?: 'sm' | 'md' | 'lg';
}

type TextComponent = <C extends React.ElementType = 'span'>(
  props: PolymorphicComponentProp<C, TextProps>
) => React.ReactElement | null;

const Text: TextComponent = ({ 
  as, 
  color = 'primary', 
  size = 'md', 
  children, 
  ...rest 
}) => {
  const Component = as || 'span';
  
  return (
    <Component 
      className={`text text-${color} text-${size}`}
      {...rest}
    >
      {children}
    </Component>
  );
};

// 使用例
<Text>デフォルトはspan</Text>
<Text as="h1" size="lg">h1として表示</Text>
<Text as="p" color="secondary">pタグとして表示</Text>
<Text as="button" onClick={() => alert('clicked')}>
  ボタンとして表示
</Text>
```

## 📖 4. カスタムフックによるロジック分離

### 1. 状態管理ロジックの分離

```typescript
// カスタムフック
function useTaskManagement() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const addTask = useCallback(async (taskData: Omit<Task, 'id'>) => {
    setLoading(true);
    try {
      const newTask = await api.createTask(taskData);
      setTasks(prev => [...prev, newTask]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);
  
  const updateTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
    setLoading(true);
    try {
      const updatedTask = await api.updateTask(taskId, updates);
      setTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);
  
  const deleteTask = useCallback(async (taskId: string) => {
    setLoading(true);
    try {
      await api.deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);
  
  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask
  };
}

// コンポーネントでの使用
function TaskManager() {
  const { 
    tasks, 
    loading, 
    error, 
    addTask, 
    updateTask, 
    deleteTask 
  } = useTaskManagement();
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  
  return (
    <div>
      <TaskForm onSubmit={addTask} />
      <TaskList 
        tasks={tasks}
        onUpdate={updateTask}
        onDelete={deleteTask}
      />
    </div>
  );
}
```

### 2. フォーム管理ロジックの分離

```typescript
interface UseFormOptions<T> {
  initialValues: T;
  validationSchema?: (values: T) => Record<string, string>;
  onSubmit: (values: T) => void | Promise<void>;
}

function useForm<T extends Record<string, any>>({
  initialValues,
  validationSchema,
  onSubmit
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const setValue = useCallback(<K extends keyof T>(
    field: K, 
    value: T[K]
  ) => {
    setValues(prev => ({ ...prev, [field]: value }));
    // エラーをクリア
    if (errors[field as string]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);
  
  const validate = useCallback(() => {
    if (!validationSchema) return true;
    
    const validationErrors = validationSchema(values);
    setErrors(validationErrors);
    
    return Object.keys(validationErrors).length === 0;
  }, [values, validationSchema]);
  
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validate, onSubmit]);
  
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
  }, [initialValues]);
  
  return {
    values,
    errors,
    isSubmitting,
    setValue,
    handleSubmit,
    reset
  };
}

// 使用例
function TaskForm() {
  const { values, errors, isSubmitting, setValue, handleSubmit } = useForm({
    initialValues: {
      title: '',
      description: '',
      priority: 'medium' as const
    },
    validationSchema: (values) => {
      const errors: Record<string, string> = {};
      if (!values.title.trim()) {
        errors.title = 'タイトルは必須です';
      }
      return errors;
    },
    onSubmit: async (values) => {
      await createTask(values);
    }
  });
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={values.title}
        onChange={(e) => setValue('title', e.target.value)}
        placeholder="タスクタイトル"
      />
      {errors.title && <span className="error">{errors.title}</span>}
      
      <textarea
        value={values.description}
        onChange={(e) => setValue('description', e.target.value)}
        placeholder="説明"
      />
      
      <select
        value={values.priority}
        onChange={(e) => setValue('priority', e.target.value as any)}
      >
        <option value="low">低</option>
        <option value="medium">中</option>
        <option value="high">高</option>
      </select>
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? '保存中...' : '保存'}
      </button>
    </form>
  );
}
```

## 📖 5. TasQ Flowのコンポーネント設計分析

### 1. ガントチャートコンポーネントの設計

```typescript
// 複雑な機能を小さなコンポーネントに分割
interface GanttChartProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
}

const GanttChart: React.FC<GanttChartProps> = ({ 
  tasks, 
  onTaskClick, 
  onTaskUpdate 
}) => {
  return (
    <div className="gantt-chart">
      <GanttHeader />
      <GanttTimeline />
      <GanttTaskList 
        tasks={tasks}
        onTaskClick={onTaskClick}
        onTaskUpdate={onTaskUpdate}
      />
    </div>
  );
};

// 各部品を独立したコンポーネントとして実装
const GanttHeader: React.FC = () => {
  return (
    <div className="gantt-header">
      {/* ヘッダー内容 */}
    </div>
  );
};

const GanttTimeline: React.FC = () => {
  return (
    <div className="gantt-timeline">
      {/* タイムライン内容 */}
    </div>
  );
};

const GanttTaskList: React.FC<{
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
}> = ({ tasks, onTaskClick, onTaskUpdate }) => {
  return (
    <div className="gantt-task-list">
      {tasks.map(task => (
        <GanttTaskRow
          key={task.id}
          task={task}
          onClick={() => onTaskClick(task)}
          onUpdate={(updates) => onTaskUpdate(task.id, updates)}
        />
      ))}
    </div>
  );
};
```

### 2. 再利用可能なUIコンポーネント

```typescript
// 汎用的なモーダルコンポーネント
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullScreen?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  maxWidth = 'md',
  fullScreen = false
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullScreen={fullScreen}
      fullWidth
    >
      {title && (
        <DialogTitle>
          {title}
          <IconButton
            onClick={onClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
      )}
      <DialogContent>
        {children}
      </DialogContent>
    </Dialog>
  );
};

// 特定の用途向けのモーダル
const TaskEditModal: React.FC<{
  open: boolean;
  task: Task | null;
  onClose: () => void;
  onSave: (task: Task) => void;
}> = ({ open, task, onClose, onSave }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={task ? 'タスク編集' : '新規タスク'}
      maxWidth="md"
    >
      <TaskForm
        initialTask={task}
        onSubmit={onSave}
        onCancel={onClose}
      />
    </Modal>
  );
};
```

## 🏆 レベルアップチャレンジ

### 初級（⭐）
1. 単一責任原則に従ってコンポーネントを分割しよう
2. プロップスの型定義を適切に設計しよう

### 中級（⭐⭐）
1. Compound Componentsパターンを実装しよう
2. カスタムフックでロジックを分離しよう

### 上級（⭐⭐⭐）
1. Polymorphic Componentsを作成しよう
2. 複雑なフォームコンポーネントを設計・実装しよう

## 📚 まとめ

良いコンポーネント設計は、**保守性・再利用性・テスタビリティ**を向上させます：

### 覚えておこう！
1. **単一責任**：一つのコンポーネントは一つのことだけを行う
2. **プロップス設計**：直感的で拡張しやすいAPIを提供する
3. **ロジック分離**：カスタムフックでビジネスロジックを分離する
4. **適切な抽象化**：共通機能を再利用可能にする

設計パターンを理解して、美しく保守しやすいコンポーネントを作りましょう！

## 🔗 次のステップ

- [エラーハンドリング学習ガイド](./Error-Handling-Learning-Guide.md)でエラー処理を学ぶ
- [付箋タブ実装チュートリアル](./Sticky-Notes-Background-Tutorial.md)で実践的な実装を学ぶ

## 💡 参考リソース

- [React Design Patterns](https://react-patterns.com/)
- [React Component Patterns](https://kentcdodds.com/blog/react-component-patterns)
- [Component Design System](https://designsystem.digital.gov/components/)