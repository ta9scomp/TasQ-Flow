# 状態管理 学習ガイド

## 📚 はじめに

このガイドでは、Reactアプリケーションの状態管理について学びます。特にZustandライブラリを使用した、TasQ Flowのような複雑なアプリケーションでの状態管理方法を理解していきます。

## 🎯 学習目標

- Reactの状態管理の基本概念を理解する
- useStateの限界とグローバル状態の必要性を知る
- Zustandの基本的な使い方を習得する
- 状態の設計パターンを学ぶ
- TasQ Flowでの実践的な状態管理を理解する

## 📖 1. 状態管理とは？

### 状態（State）の基本概念

状態とは、**アプリケーションが記憶しておく必要があるデータ**のことです。

```typescript
// 例：カウンターアプリの状態
const [count, setCount] = useState(0);
// ↑ countが「現在の状態」、setCountが「状態を変更する関数」

// 例：ToDoアプリの状態
const [todos, setTodos] = useState([
  { id: 1, text: "買い物", completed: false },
  { id: 2, text: "掃除", completed: true }
]);
```

### ローカル状態 vs グローバル状態

```typescript
// ローカル状態（1つのコンポーネント内でのみ使用）
function Counter() {
  const [count, setCount] = useState(0); // ← この状態は Counter コンポーネント内でのみ使える
  
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}

// グローバル状態（複数のコンポーネントで共有）
function App() {
  const [user, setUser] = useState(null); // ← この状態を複数のコンポーネントで使いたい
  
  return (
    <div>
      <Header user={user} />         {/* プロップスとして渡す */}
      <Sidebar user={user} />        {/* プロップスとして渡す */}
      <MainContent user={user} />    {/* プロップスとして渡す */}
    </div>
  );
}
```

## 📖 2. useStateの限界

### Props Drilling問題

```typescript
// 😰 Props Drilling: 深い階層にデータを渡すのが大変
function App() {
  const [user, setUser] = useState({ name: "田中太郎" });
  
  return <Layout user={user} setUser={setUser} />;
}

function Layout({ user, setUser }) {
  return <Sidebar user={user} setUser={setUser} />;
}

function Sidebar({ user, setUser }) {
  return <UserProfile user={user} setUser={setUser} />;
}

function UserProfile({ user, setUser }) {
  return (
    <div>
      <p>{user.name}</p>
      <button onClick={() => setUser({ name: "新しい名前" })}>
        名前変更
      </button>
    </div>
  );
}
```

### 状態の散在問題

```typescript
// 😰 関連する状態が色々な場所に散らばっている
function TaskApp() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // TaskList コンポーネント
  // FilterBar コンポーネント
  // LoadingSpinner コンポーネント
  // ErrorMessage コンポーネント
  
  // これらのコンポーネントに状態を渡すのが大変...
}
```

## 📖 3. Zustandとは？

### Zustandの特徴

Zustandは**シンプルで軽量**な状態管理ライブラリです：

- ✅ **簡単**：覚えることが少ない
- ✅ **軽量**：ファイルサイズが小さい
- ✅ **TypeScript対応**：型安全
- ✅ **React DevTools対応**：デバッグしやすい

### 基本的な使い方

```typescript
import { create } from 'zustand';

// ストア（状態の保管場所）を作成
interface CounterStore {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

const useCounterStore = create<CounterStore>((set) => ({
  // 初期状態
  count: 0,
  
  // 状態を変更するアクション
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));

// コンポーネントで使用
function Counter() {
  const { count, increment, decrement, reset } = useCounterStore();
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+1</button>
      <button onClick={decrement}>-1</button>
      <button onClick={reset}>リセット</button>
    </div>
  );
}

// 別のコンポーネントからも同じ状態にアクセス可能
function DisplayCounter() {
  const count = useCounterStore((state) => state.count);
  
  return <h2>現在のカウント: {count}</h2>;
}
```

## 📖 4. 実践：ToDoアプリを作ろう

### Step 1: 基本的なToDoストア

```typescript
interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

interface TodoStore {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
}

const useTodoStore = create<TodoStore>((set) => ({
  todos: [],
  
  addTodo: (text: string) => set((state) => ({
    todos: [
      ...state.todos,
      {
        id: Date.now().toString(),
        text,
        completed: false,
        createdAt: new Date(),
      }
    ]
  })),
  
  toggleTodo: (id: string) => set((state) => ({
    todos: state.todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
  })),
  
  deleteTodo: (id: string) => set((state) => ({
    todos: state.todos.filter(todo => todo.id !== id)
  })),
}));
```

### Step 2: フィルタリング機能を追加

```typescript
type FilterType = 'all' | 'active' | 'completed';

interface TodoStore {
  todos: Todo[];
  filter: FilterType;
  
  // ゲッター（計算プロパティ）
  filteredTodos: Todo[];
  activeCount: number;
  completedCount: number;
  
  // アクション
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  setFilter: (filter: FilterType) => void;
  clearCompleted: () => void;
}

const useTodoStore = create<TodoStore>((set, get) => ({
  todos: [],
  filter: 'all',
  
  // 計算プロパティ
  get filteredTodos() {
    const { todos, filter } = get();
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  },
  
  get activeCount() {
    return get().todos.filter(todo => !todo.completed).length;
  },
  
  get completedCount() {
    return get().todos.filter(todo => todo.completed).length;
  },
  
  // アクション
  addTodo: (text: string) => set((state) => ({
    todos: [
      ...state.todos,
      {
        id: Date.now().toString(),
        text,
        completed: false,
        createdAt: new Date(),
      }
    ]
  })),
  
  toggleTodo: (id: string) => set((state) => ({
    todos: state.todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
  })),
  
  deleteTodo: (id: string) => set((state) => ({
    todos: state.todos.filter(todo => todo.id !== id)
  })),
  
  setFilter: (filter: FilterType) => set({ filter }),
  
  clearCompleted: () => set((state) => ({
    todos: state.todos.filter(todo => !todo.completed)
  })),
}));
```

### Step 3: コンポーネントで使用

```typescript
// ToDoリストコンポーネント
function TodoList() {
  const filteredTodos = useTodoStore((state) => state.filteredTodos);
  const toggleTodo = useTodoStore((state) => state.toggleTodo);
  const deleteTodo = useTodoStore((state) => state.deleteTodo);
  
  return (
    <ul>
      {filteredTodos.map(todo => (
        <li key={todo.id}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleTodo(todo.id)}
          />
          <span style={{ 
            textDecoration: todo.completed ? 'line-through' : 'none' 
          }}>
            {todo.text}
          </span>
          <button onClick={() => deleteTodo(todo.id)}>削除</button>
        </li>
      ))}
    </ul>
  );
}

// ToDo追加コンポーネント
function TodoInput() {
  const [text, setText] = useState('');
  const addTodo = useTodoStore((state) => state.addTodo);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      addTodo(text);
      setText('');
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="新しいToDoを入力..."
      />
      <button type="submit">追加</button>
    </form>
  );
}

// フィルターコンポーネント
function TodoFilter() {
  const { filter, setFilter, activeCount, completedCount } = useTodoStore();
  
  return (
    <div>
      <button 
        onClick={() => setFilter('all')}
        style={{ fontWeight: filter === 'all' ? 'bold' : 'normal' }}
      >
        すべて ({activeCount + completedCount})
      </button>
      <button 
        onClick={() => setFilter('active')}
        style={{ fontWeight: filter === 'active' ? 'bold' : 'normal' }}
      >
        アクティブ ({activeCount})
      </button>
      <button 
        onClick={() => setFilter('completed')}
        style={{ fontWeight: filter === 'completed' ? 'bold' : 'normal' }}
      >
        完了済み ({completedCount})
      </button>
    </div>
  );
}
```

## 📖 5. TasQ Flowの状態管理

### アプリケーション全体の状態設計

```typescript
// types/index.ts
export interface Task {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  priority: number;
  status: TaskStatus;
  assignees: string[];
  tags: string[];
  parentId?: string;
}

export type ViewMode = 'gantt' | 'members' | 'sticky' | 'todo' | 'history' | 'settings';
export type TaskStatus = 'notStarted' | 'inProgress' | 'completed' | 'onHold';

// stores/useAppStore.ts
interface AppState {
  // 基本状態
  selectedView: 'home' | 'teams';
  selectedTeamId?: string;
  selectedProjectId?: string;
  viewMode: ViewMode;
  sidebarOpen: boolean;
  
  // タスク管理
  tasks: Task[];
  selectedTaskId?: string;
  
  // UI状態
  isLoading: boolean;
  error: string | null;
}

interface AppActions {
  // ナビゲーション
  setSelectedView: (view: 'home' | 'teams') => void;
  setSelectedTeamId: (teamId: string | undefined) => void;
  setSelectedProjectId: (projectId: string | undefined) => void;
  setViewMode: (mode: ViewMode) => void;
  setSidebarOpen: (open: boolean) => void;
  
  // タスク操作
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  setSelectedTaskId: (id: string | undefined) => void;
  
  // ユーティリティ
  getSelectedProject: () => Project | undefined;
  getTasksByProject: (projectId: string) => Task[];
}

export const useAppStore = create<AppState & AppActions>((set, get) => ({
  // 初期状態
  selectedView: 'home',
  selectedTeamId: undefined,
  selectedProjectId: undefined,
  viewMode: 'gantt',
  sidebarOpen: false,
  tasks: [],
  selectedTaskId: undefined,
  isLoading: false,
  error: null,
  
  // アクション
  setSelectedView: (view) => set({ selectedView: view }),
  setSelectedTeamId: (teamId) => set({ selectedTeamId: teamId }),
  setSelectedProjectId: (projectId) => set({ selectedProjectId: projectId }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  
  addTask: (task) => set((state) => ({ 
    tasks: [...state.tasks, task] 
  })),
  
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map(task => 
      task.id === id ? { ...task, ...updates } : task
    )
  })),
  
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter(task => task.id !== id)
  })),
  
  setSelectedTaskId: (id) => set({ selectedTaskId: id }),
  
  // ゲッター
  getSelectedProject: () => {
    const { selectedProjectId } = get();
    if (!selectedProjectId) return undefined;
    return getProjectById(selectedProjectId);
  },
  
  getTasksByProject: (projectId) => {
    const { tasks } = get();
    return tasks.filter(task => task.projectId === projectId);
  },
}));
```

## 📖 6. 状態の永続化

### localStorageとの連携

```typescript
import { persist } from 'zustand/middleware';

const useTodoStore = create<TodoStore>()(
  persist(
    (set, get) => ({
      todos: [],
      filter: 'all',
      
      // アクション...
      addTodo: (text: string) => set((state) => ({
        todos: [...state.todos, /* new todo */]
      })),
      // ...
    }),
    {
      name: 'todo-storage', // localStorageのキー名
      // 保存したくないプロパティを除外
      partialize: (state) => ({ 
        todos: state.todos,
        filter: state.filter 
      }),
    }
  )
);
```

### セッションストレージとの連携

```typescript
import { createJSONStorage } from 'zustand/middleware';

const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // ストアの定義...
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => sessionStorage), // sessionStorageを使用
    }
  )
);
```

## 🎁 実践的なパターン

### 1. 非同期処理の管理

```typescript
interface ApiStore {
  users: User[];
  isLoading: boolean;
  error: string | null;
  
  fetchUsers: () => Promise<void>;
  createUser: (userData: CreateUserData) => Promise<void>;
}

const useApiStore = create<ApiStore>((set, get) => ({
  users: [],
  isLoading: false,
  error: null,
  
  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch('/api/users');
      const users = await response.json();
      set({ users, isLoading: false });
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
    }
  },
  
  createUser: async (userData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      
      const newUser = await response.json();
      
      set((state) => ({ 
        users: [...state.users, newUser],
        isLoading: false 
      }));
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
    }
  },
}));
```

### 2. 状態のスライス分割

```typescript
// 大きなストアを機能ごとに分割
const createTaskSlice = (set, get) => ({
  tasks: [],
  selectedTaskId: null,
  
  addTask: (task) => set((state) => ({ 
    tasks: [...state.tasks, task] 
  })),
  selectTask: (id) => set({ selectedTaskId: id }),
});

const createUISlice = (set, get) => ({
  sidebarOpen: false,
  theme: 'light',
  
  toggleSidebar: () => set((state) => ({ 
    sidebarOpen: !state.sidebarOpen 
  })),
  setTheme: (theme) => set({ theme }),
});

const useAppStore = create((set, get) => ({
  ...createTaskSlice(set, get),
  ...createUISlice(set, get),
}));
```

### 3. セレクター（最適化）

```typescript
// 必要な部分のみを購読して再レンダリングを最適化
function TaskList() {
  // ❌ 悪い例：ストア全体を購読
  const store = useAppStore();
  
  // ✅ 良い例：必要な部分のみを購読
  const tasks = useAppStore((state) => state.tasks);
  const addTask = useAppStore((state) => state.addTask);
  
  return (
    <div>
      {tasks.map(task => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
}

// 複雑なセレクター
const useFilteredTasks = (filter: string) => {
  return useAppStore((state) => 
    state.tasks.filter(task => 
      task.title.toLowerCase().includes(filter.toLowerCase())
    )
  );
};
```

## 🏆 レベルアップチャレンジ

### 初級（⭐）
1. シンプルなカウンターストアを作ってみよう
2. ToDoアプリに編集機能を追加しよう

### 中級（⭐⭐）
1. 非同期処理を含むAPIストアを作ろう
2. 複数のストアを組み合わせて使ってみよう

### 上級（⭐⭐⭐）
1. TasQ Flow風のタスク管理ストアを作ろう
2. 最適化されたセレクターを実装しよう

## 📚 まとめ

状態管理は、Reactアプリケーションの**心臓部**です：

### 覚えておこう！
1. **ローカル vs グローバル**：適切な場所で状態を管理する
2. **Zustand**：シンプルで軽量な状態管理ライブラリ
3. **非同期処理**：API通信も状態管理で処理する
4. **最適化**：セレクターで無駄な再レンダリングを防ぐ

状態管理をマスターすれば、複雑なアプリケーションも綺麗に整理できます！

## 🔗 次のステップ

- [コンポーネント設計学習ガイド](./Component-Design-Learning-Guide.md)で設計を学ぶ
- [エラーハンドリング学習ガイド](./Error-Handling-Learning-Guide.md)でエラー処理を学ぶ

## 💡 参考リソース

- [Zustand公式ドキュメント](https://zustand-demo.pmnd.rs/)
- [React状態管理の比較](https://react.dev/learn/managing-state)
- [状態管理のベストプラクティス](https://react.dev/learn/choosing-the-state-structure)