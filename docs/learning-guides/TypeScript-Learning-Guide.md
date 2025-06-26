# TypeScript 学習ガイド

**対象**: JavaScript基礎を学んだ初学者  
**難易度**: ⭐⭐⭐☆☆（中級）  
**学習時間**: 約3-4時間

---

## 📚 このガイドで学べること

- TypeScriptとは何か？なぜ使うのか？
- 基本的な型の使い方
- Reactでの型定義
- エラーの読み方と対処法
- TasQ Flowで使われている実際のTypeScript

---

## 🤔 TypeScriptって何？

### 分かりやすい例え話：設計図付きの組み立て

**JavaScript**は、**説明書なしの組み立て**のようなものです：
```javascript
// 何が入ってくるかわからない
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

calculateTotal("文字列"); // エラーになるけど実行時まで分からない
```

**TypeScript**は、**詳しい設計図付きの組み立て**です：
```typescript
// 何が入ってくるか明確
interface Item {
  name: string;
  price: number;
}

function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

calculateTotal("文字列"); // エラー！書く時点で間違いがわかる
```

---

## 🎯 TypeScriptの基本型

### 1. プリミティブ型

```typescript
// 基本的な型
let userName: string = "田中太郎";
let age: number = 25;
let isActive: boolean = true;

// 配列
let numbers: number[] = [1, 2, 3, 4, 5];
let names: string[] = ["田中", "佐藤", "鈴木"];

// null や undefined
let maybe: string | null = null; // string または null
let optional: string | undefined = undefined;
```

### 2. オブジェクト型

```typescript
// オブジェクトの型定義
interface User {
  id: number;
  name: string;
  email: string;
  age?: number; // ? = オプショナル（あってもなくてもOK）
}

// 使い方
const user: User = {
  id: 1,
  name: "田中太郎",
  email: "tanaka@example.com"
  // age は省略OK
};

// 関数の型
function greetUser(user: User): string {
  return `こんにちは、${user.name}さん！`;
}
```

### 3. 関数の型

```typescript
// 関数の型定義方法1
function add(a: number, b: number): number {
  return a + b;
}

// 関数の型定義方法2
const multiply = (a: number, b: number): number => {
  return a * b;
};

// 関数型の変数
type MathFunction = (a: number, b: number) => number;
const divide: MathFunction = (a, b) => a / b;
```

---

## ⚛️ ReactでのTypeScript

### 1. コンポーネントのPropsの型定義

```typescript
// Propsの型を定義
interface GreetingProps {
  name: string;
  age?: number; // オプショナル
  onGreet?: () => void; // 関数もオプショナル
}

// コンポーネント
function Greeting({ name, age, onGreet }: GreetingProps) {
  return (
    <div>
      <h1>こんにちは、{name}さん！</h1>
      {age && <p>{age}歳ですね</p>}
      {onGreet && <button onClick={onGreet}>挨拶</button>}
    </div>
  );
}

// 使用例
function App() {
  return (
    <Greeting 
      name="田中"
      age={25}
      onGreet={() => alert("こんにちは！")}
    />
  );
}
```

### 2. useState の型

```typescript
import { useState } from 'react';

function Counter() {
  // TypeScriptが自動で型を推測
  const [count, setCount] = useState(0); // number型として推測

  // 明示的に型を指定
  const [message, setMessage] = useState<string>("Hello");

  // 複雑な型の場合
  interface Todo {
    id: number;
    text: string;
    completed: boolean;
  }
  
  const [todos, setTodos] = useState<Todo[]>([]); // Todo配列

  return (
    <div>
      <p>カウント: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}
```

### 3. イベントハンドラーの型

```typescript
import { ChangeEvent, FormEvent } from 'react';

function ContactForm() {
  const [email, setEmail] = useState<string>("");

  // input要素の変更イベント
  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  // フォーム送信イベント
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("送信:", email);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={handleEmailChange}
        placeholder="メールアドレス"
      />
      <button type="submit">送信</button>
    </form>
  );
}
```

---

## 🛠️ よく使う型のパターン

### 1. Union型（複数の型のいずれか）

```typescript
// 文字列または数値
let id: string | number = "user123";
id = 456; // これもOK

// 特定の文字列のみ
type Status = "pending" | "completed" | "cancelled";
let taskStatus: Status = "pending"; // OK
let taskStatus2: Status = "running"; // エラー！

// 関数の引数でも使える
function processData(data: string | number | boolean) {
  if (typeof data === "string") {
    return data.toUpperCase(); // string のメソッドが使える
  } else if (typeof data === "number") {
    return data.toFixed(2); // number のメソッドが使える
  }
  return data; // boolean
}
```

### 2. Array型とObject型

```typescript
// 配列の型
interface Task {
  id: number;
  title: string;
  completed: boolean;
}

let tasks: Task[] = [
  { id: 1, title: "買い物", completed: false },
  { id: 2, title: "掃除", completed: true }
];

// オブジェクトの型（キーが動的）
interface TaskMap {
  [key: string]: Task; // 文字列のキーでTask型の値
}

let taskMap: TaskMap = {
  "task1": { id: 1, title: "買い物", completed: false },
  "task2": { id: 2, title: "掃除", completed: true }
};
```

### 3. 関数の引数と戻り値

```typescript
// 基本的な関数
function formatName(firstName: string, lastName: string): string {
  return `${lastName} ${firstName}`;
}

// オプショナル引数
function greet(name: string, title?: string): string {
  if (title) {
    return `こんにちは、${title} ${name}さん`;
  }
  return `こんにちは、${name}さん`;
}

// デフォルト引数
function createUser(name: string, role: string = "user"): User {
  return { name, role };
}

// 戻り値が void（何も返さない）
function logMessage(message: string): void {
  console.log(message);
}
```

---

## 🎮 実践：ToDoアプリをTypeScriptで作ろう

### Step 1: 型定義

```typescript
// ToDo項目の型
interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
}

// Propsの型
interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}
```

### Step 2: コンポーネント実装

```typescript
import { useState, ChangeEvent, FormEvent } from 'react';

function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState<string>("");

  const addTodo = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (inputText.trim() === "") return;

    const newTodo: Todo = {
      id: Date.now(),
      text: inputText.trim(),
      completed: false,
      createdAt: new Date()
    };

    setTodos([...todos, newTodo]);
    setInputText("");
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id 
        ? { ...todo, completed: !todo.completed }
        : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  return (
    <div>
      <h1>📝 TypeScript ToDoアプリ</h1>
      
      <form onSubmit={addTodo}>
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="新しいタスクを入力..."
        />
        <button type="submit">追加</button>
      </form>

      <TodoList
        todos={todos}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
      />
    </div>
  );
}

// TodoList コンポーネント
function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  return (
    <ul>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

// TodoItem コンポーネント
function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <li>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span style={{ 
        textDecoration: todo.completed ? 'line-through' : 'none' 
      }}>
        {todo.text}
      </span>
      <button onClick={() => onDelete(todo.id)}>削除</button>
    </li>
  );
}
```

---

## 🏗️ TasQ FlowでのTypeScript使用例

### 1. タスクの型定義

```typescript
// TasQ Flowのタスク型
interface Task {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  progress: number; // 0-100
  priority: number; // 0-100
  status: 'notStarted' | 'inProgress' | 'completed' | 'onHold';
  assignees: string[];
  tags: string[];
  checklist: ChecklistItem[];
  parentId?: string; // 親タスクのID
}

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}
```

### 2. コンポーネントのProps

```typescript
// ガントチャートコンポーネントのProps
interface GanttChartProps {
  tasks: Task[];
  startDate: Date;
  endDate: Date;
  onTaskClick?: (task: Task) => void;
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
  readonly?: boolean;
}

// タスクカードコンポーネント
interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: Task['status']) => void;
}
```

### 3. カスタムフック

```typescript
// カスタムフックの型定義
interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
}

function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 実装...

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask
  };
}
```

---

## 🚨 エラーの読み方と対処法

### 1. よくあるエラーと解決法

```typescript
// エラー例1: プロパティが存在しない
interface User {
  name: string;
  age: number;
}

const user: User = { name: "田中" }; 
// エラー: Property 'age' is missing

// 解決法1: 必要なプロパティを追加
const user: User = { name: "田中", age: 25 };

// 解決法2: プロパティをオプショナルにする
interface User {
  name: string;
  age?: number; // オプショナル
}
```

```typescript
// エラー例2: 型が一致しない
function processNumber(num: number): string {
  return num; // エラー: Type 'number' is not assignable to type 'string'
}

// 解決法: 正しい型に変換
function processNumber(num: number): string {
  return num.toString(); // 文字列に変換
}
```

```typescript
// エラー例3: null の可能性
function getLength(text: string | null): number {
  return text.length; // エラー: Object is possibly 'null'
}

// 解決法: null チェック
function getLength(text: string | null): number {
  if (text === null) {
    return 0;
  }
  return text.length;
}
```

### 2. デバッグのコツ

```typescript
// 1. console.log で型を確認
function debugFunction(data: unknown) {
  console.log("データの型:", typeof data);
  console.log("データの値:", data);
  
  // 型ガード
  if (typeof data === 'string') {
    console.log("文字列です:", data.toUpperCase());
  }
}

// 2. as を使った型アサーション（注意して使用）
const userInput = document.getElementById('input') as HTMLInputElement;
console.log(userInput.value); // HTMLInputElement として扱う

// 3. 型チェック関数を作る
function isTask(obj: any): obj is Task {
  return obj && 
         typeof obj.id === 'string' &&
         typeof obj.title === 'string' &&
         obj.startDate instanceof Date;
}

if (isTask(someData)) {
  // ここでは someData は Task 型として扱われる
  console.log(someData.title);
}
```

---

## 🏆 レベルアップチャレンジ

### 初級（⭐）
1. 基本的な型（string, number, boolean）を使った変数を作ろう
2. 簡単なインターフェースを定義してオブジェクトを作ろう

### 中級（⭐⭐）
1. ジェネリクス（型の引数）を使った関数を作ろう
2. カスタムフックを TypeScript で作ろう

### 上級（⭐⭐⭐）
1. 複雑な型（Union型、Intersection型）を使いこなそう
2. 型ガード関数を作って安全な型変換をしよう

---

## 📖 参考資料

### TypeScript公式
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TypeScript Playground](https://www.typescriptlang.org/play)

### React + TypeScript
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [React公式 TypeScript](https://ja.react.dev/learn/typescript)

---

## 💡 まとめ

TypeScriptは、**型安全性**によってバグを事前に防ぐ強力な言語です。

### 覚えておこう！
1. **型定義**：何が入ってくるか明確にする
2. **インターフェース**：オブジェクトの形を定義
3. **エラーメッセージ**：親切な警告を活用
4. **段階的導入**：少しずつ型を追加していく

最初は「面倒だな」と感じるかもしれませんが、慣れると「型があって安心」と感じるようになります。大規模なアプリ開発では必須の技術です！ 🛡️

---

**次のステップ**: [状態管理学習ガイド](./State-Management-Learning-Guide.md)

---

**質問や疑問があれば、いつでも開発チームにお聞きください！**