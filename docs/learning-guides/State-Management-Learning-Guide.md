# 状態管理 学習ガイド

**対象**: React基礎を学んだ初学者  
**難易度**: ⭐⭐⭐☆☆（中級）  
**学習時間**: 約2-3時間

---

## 📚 このガイドで学べること

- 状態管理とは何か？なぜ必要なのか？
- Reactの基本的な状態管理（useState）の復習
- プロパティドリリング問題と解決策
- Zustand（TasQ Flowで使用）の使い方
- 実際のアプリで状態管理を実装する方法

---

## 🤔 状態管理って何？

### 分かりやすい例え話：家族の情報共有

**状態管理なし**は、**家族がバラバラに情報を管理**している状態：
```
お父さん：「晩御飯は何？」
お母さん：「え、何か決めてたっけ？」
子供：「僕はピザがいい！」
おばあちゃん：「私は和食がいいわ」
→ みんなバラバラで混乱！
```

**状態管理あり**は、**家族の掲示板で情報を一元管理**：
```
家族掲示板：
- 今日の晩御飯: カレー
- 明日の予定: 映画鑑賞
- 買い物リスト: 人参、じゃがいも、お肉
→ みんなが同じ情報を見られる！
```

---

## 🧱 Reactの状態管理の基本

### 1. 単一コンポーネント内の状態（useState）

```tsx
import { useState } from 'react';

function Counter() {
  // このカウントは Counter コンポーネント内だけで使える
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>カウント: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}
```

### 2. 親から子への状態の受け渡し（Props）

```tsx
function App() {
  const [user, setUser] = useState({ name: "田中", age: 25 });

  return (
    <div>
      <UserProfile user={user} />
      <UserEditor user={user} onUserChange={setUser} />
    </div>
  );
}

function UserProfile({ user }) {
  return (
    <div>
      <h2>{user.name}さんのプロフィール</h2>
      <p>年齢: {user.age}歳</p>
    </div>
  );
}

function UserEditor({ user, onUserChange }) {
  return (
    <div>
      <input
        value={user.name}
        onChange={(e) => onUserChange({ ...user, name: e.target.value })}
      />
    </div>
  );
}
```

---

## 🚨 プロパティドリリング問題

### 問題：深いコンポーネントに状態を渡すのが大変

```tsx
// ❌ プロパティドリリング問題
function App() {
  const [user, setUser] = useState({ name: "田中" });
  
  return <Layout user={user} setUser={setUser} />;
}

function Layout({ user, setUser }) {
  return (
    <div>
      <Header user={user} setUser={setUser} />
      <Content user={user} setUser={setUser} />
    </div>
  );
}

function Header({ user, setUser }) {
  return (
    <header>
      <Navigation user={user} setUser={setUser} />
    </header>
  );
}

function Navigation({ user, setUser }) {
  return (
    <nav>
      <UserMenu user={user} setUser={setUser} />
    </nav>
  );
}

function UserMenu({ user, setUser }) {
  // やっとここで使える！でも長すぎる...
  return <div>{user.name}</div>;
}
```

### 解決策：グローバル状態管理

```tsx
// ✅ グローバル状態で解決
function App() {
  return <Layout />;
}

function Layout() {
  return (
    <div>
      <Header />
      <Content />
    </div>
  );
}

function UserMenu() {
  const user = useUserStore((state) => state.user); // 直接取得！
  return <div>{user.name}</div>;
}
```

---

## 🎯 Zustand の使い方

TasQ FlowではZustandという軽量な状態管理ライブラリを使用しています。

### 1. 基本的なストアの作成

```typescript
import { create } from 'zustand';

// ストアの型を定義
interface CounterStore {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

// ストアを作成
const useCounterStore = create<CounterStore>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));
```

### 2. コンポーネントでの使用

```tsx
function Counter() {
  // 必要な状態とアクションを取得
  const { count, increment, decrement, reset } = useCounterStore();

  return (
    <div>
      <h2>カウンター: {count}</h2>
      <button onClick={increment}>+1</button>
      <button onClick={decrement}>-1</button>
      <button onClick={reset}>リセット</button>
    </div>
  );
}

function AnotherComponent() {
  // 別のコンポーネントでも同じ状態にアクセスできる
  const count = useCounterStore((state) => state.count);
  
  return <p>別の場所からのカウント: {count}</p>;
}
```

### 3. 部分的な状態選択（パフォーマンス最適化）

```tsx
function OptimizedComponent() {
  // count だけを監視（他の状態が変わっても再レンダリングされない）
  const count = useCounterStore((state) => state.count);
  
  // increment 関数だけを取得
  const increment = useCounterStore((state) => state.increment);
  
  return (
    <div>
      <p>{count}</p>
      <button onClick={increment}>+1</button>
    </div>
  );
}
```

---

## 🎮 実践：ToDoアプリの状態管理

### Step 1: ToDoストアの作成

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
  clearCompleted: () => void;
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
  
  clearCompleted: () => set((state) => ({
    todos: state.todos.filter(todo => !todo.completed)
  })),
}));
```

### Step 2: コンポーネントの実装

```tsx
// メインアプリ
function TodoApp() {
  return (
    <div>
      <h1>📝 ToDoアプリ（Zustand版）</h1>
      <TodoInput />
      <TodoList />
      <TodoStats />
    </div>
  );
}

// 新しいToDo入力
function TodoInput() {
  const [inputText, setInputText] = useState('');
  const addTodo = useTodoStore((state) => state.addTodo);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      addTodo(inputText.trim());
      setInputText('');
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="新しいタスクを入力..."
      />
      <button type="submit">追加</button>
    </form>
  );
}

// ToDoリスト
function TodoList() {
  const todos = useTodoStore((state) => state.todos);
  
  return (
    <ul>
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}

// 個別のToDoアイテム
function TodoItem({ todo }: { todo: Todo }) {
  const { toggleTodo, deleteTodo } = useTodoStore((state) => ({
    toggleTodo: state.toggleTodo,
    deleteTodo: state.deleteTodo,
  }));
  
  return (
    <li>
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
  );
}

// 統計情報
function TodoStats() {
  const { todos, clearCompleted } = useTodoStore((state) => ({
    todos: state.todos,
    clearCompleted: state.clearCompleted,
  }));
  
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const activeTodos = totalTodos - completedTodos;
  
  return (
    <div>
      <p>
        全体: {totalTodos} | 
        完了: {completedTodos} | 
        残り: {activeTodos}
      </p>
      {completedTodos > 0 && (
        <button onClick={clearCompleted}>
          完了済みをクリア
        </button>
      )}
    </div>
  );
}
```

---

## 🏗️ TasQ Flowでの状態管理

### 1. アプリストアの設計

```typescript
interface AppStore {
  // ビューの状態
  selectedView: 'home' | 'teams';
  selectedTeamId?: string;
  selectedProjectId?: string;
  viewMode: 'gantt' | 'members' | 'sticky' | 'todo' | 'history' | 'settings';
  sidebarOpen: boolean;

  // データの状態
  tasks: Task[];
  projects: Project[];
  teams: Team[];

  // アクション
  setSelectedView: (view: 'home' | 'teams') => void;
  setSelectedTeamId: (teamId: string | undefined) => void;
  setSelectedProjectId: (projectId: string | undefined) => void;
  setViewMode: (mode: ViewMode) => void;
  setSidebarOpen: (open: boolean) => void;
  
  // タスク関連のアクション
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
}
```

### 2. 永続化（ローカルストレージ保存）

```typescript
import { persist } from 'zustand/middleware';

const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      selectedView: 'home',
      selectedTeamId: undefined,
      // ... 他の状態

      setSelectedView: (view) => set({ selectedView: view }),
      // ... 他のアクション
    }),
    {
      name: 'tasq-flow-storage', // ローカルストレージのキー
      partialize: (state) => ({
        // 保存したい状態だけを選択
        selectedView: state.selectedView,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);
```

### 3. ミドルウェアの使用

```typescript
import { subscribeWithSelector } from 'zustand/middleware';

const useAppStore = create<AppStore>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        // ストアの定義
      }),
      { name: 'tasq-flow-storage' }
    )
  )
);

// 状態の変化を監視
useAppStore.subscribe(
  (state) => state.selectedProjectId,
  (selectedProjectId) => {
    if (selectedProjectId) {
      console.log('プロジェクトが選択されました:', selectedProjectId);
    }
  }
);
```

---

## 🎁 実践的なTips

### 1. 状態の分割

```typescript
// ❌ すべてを一つのストアに入れる
interface BigStore {
  user: User;
  todos: Todo[];
  notifications: Notification[];
  settings: Settings;
  // ... 他にもたくさん
}

// ✅ 関連する状態ごとに分割
const useUserStore = create<UserStore>(...);
const useTodoStore = create<TodoStore>(...);
const useNotificationStore = create<NotificationStore>(...);
const useSettingsStore = create<SettingsStore>(...);
```

### 2. computed値（計算されたデータ）

```typescript
const useTodoStore = create<TodoStore>((set, get) => ({
  todos: [],
  
  // 計算されたデータを取得するメソッド
  getStats: () => {
    const todos = get().todos;
    return {
      total: todos.length,
      completed: todos.filter(t => t.completed).length,
      active: todos.filter(t => !t.completed).length,
    };
  },
  
  // または getter として
  get stats() {
    const todos = get().todos;
    return {
      total: todos.length,
      completed: todos.filter(t => t.completed).length,
      active: todos.filter(t => !t.completed).length,
    };
  },
}));

// 使用時
function Stats() {
  const stats = useTodoStore((state) => state.getStats());
  return <div>完了: {stats.completed}/{stats.total}</div>;
}
```

### 3. 非同期アクション

```typescript
const useApiStore = create<ApiStore>((set) => ({
  loading: false,
  error: null,
  data: null,
  
  fetchData: async () => {
    set({ loading: true, error: null });
    
    try {
      const response = await fetch('/api/data');
      const data = await response.json();
      set({ data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));
```

---

## 🏆 レベルアップチャレンジ

### 初級（⭐）
1. カウンターアプリをZustandで作り直してみよう
2. ショッピングカートの状態管理を作ってみよう

### 中級（⭐⭐）
1. ToDoアプリに「カテゴリー」機能を追加しよう
2. ローカルストレージ保存機能を追加しよう

### 上級（⭐⭐⭐）
1. 複数のストアを組み合わせた複雑なアプリを作ろう
2. 最適化（メモ化、部分選択）を考慮したストア設計をしよう

---

## 📖 参考資料

### Zustand公式
- [Zustand GitHub](https://github.com/pmndrs/zustand)
- [Zustand TypeScript Guide](https://github.com/pmndrs/zustand#typescript)

### React状態管理
- [React State Management](https://ja.react.dev/learn/managing-state)
- [State Management Patterns](https://kentcdodds.com/blog/application-state-management-with-react)

---

## 💡 まとめ

状態管理は、**アプリの情報を整理整頓する技術**です。

### 覚えておこう！
1. **ローカル状態**：コンポーネント内だけで使うなら useState
2. **グローバル状態**：複数のコンポーネントで共有するなら Zustand
3. **状態の分割**：関連する状態をまとめて管理
4. **パフォーマンス**：必要な部分だけを監視

最初は「なんで複雑にするの？」と思うかもしれませんが、アプリが大きくなるにつれて状態管理の重要性がわかります。TasQ Flowのような複雑なアプリには必須の技術です！ 🗂️

---

**次のステップ**: [コンポーネント設計学習ガイド](./Component-Design-Learning-Guide.md)

---

**質問や疑問があれば、いつでも開発チームにお聞きください！**