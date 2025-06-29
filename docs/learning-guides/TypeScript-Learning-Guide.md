# TypeScript 学習ガイド

## 📚 はじめに

このガイドでは、JavaScriptの知識をベースにTypeScriptを学びます。TasQ Flowプロジェクトで実際に使われているTypeScriptコードを理解できるようになることを目標とします。

## 🎯 学習目標

- TypeScriptの基本的な型システムを理解する
- 型定義の書き方を習得する
- インターフェースと型エイリアスの使い方を学ぶ
- ジェネリクスの基礎を理解する
- React + TypeScriptの実践的な使い方を身につける

## 📖 1. TypeScriptとは？

### なぜTypeScriptを使うのか？

JavaScriptの問題点：
```javascript
// JavaScriptだと...
function addUser(user) {
  // userに何が入っているか分からない
  console.log(user.name); // エラーになるかも？
  console.log(user.age);  // 存在するかも不明
}

addUser("田中太郎"); // 文字列を渡してもエラーにならない！
```

TypeScriptの解決策：
```typescript
// TypeScriptなら...
interface User {
  name: string;
  age: number;
}

function addUser(user: User) {
  console.log(user.name); // 必ず存在することが保証される
  console.log(user.age);  // 型が正しいことも保証される
}

addUser("田中太郎"); // ❌ コンパイルエラー！型が違います
addUser({ name: "田中太郎", age: 25 }); // ✅ OK!
```

## 📖 2. 基本的な型

### プリミティブ型

```typescript
// 文字列
let userName: string = "田中太郎";
userName = 123; // ❌ エラー：数値は代入できません

// 数値
let age: number = 25;
age = "25歳"; // ❌ エラー：文字列は代入できません

// 真偽値
let isActive: boolean = true;
isActive = 1; // ❌ エラー：数値は代入できません

// null と undefined
let data: null = null;
let value: undefined = undefined;

// any（何でも入る - なるべく使わない）
let anything: any = "文字列";
anything = 123; // OK（でも型安全性が失われる）
```

### 配列

```typescript
// 数値の配列
let numbers: number[] = [1, 2, 3, 4, 5];
numbers.push("6"); // ❌ エラー：文字列は追加できません

// 文字列の配列
let names: string[] = ["田中", "佐藤", "鈴木"];

// 別の書き方
let scores: Array<number> = [90, 85, 78];

// 複数の型を持つ配列
let mixed: (string | number)[] = ["田中", 25, "佐藤", 30];
```

### オブジェクト

```typescript
// オブジェクトの型定義
let user: {
  name: string;
  age: number;
  email?: string; // ?は省略可能
} = {
  name: "田中太郎",
  age: 25
  // emailは省略可能なのでなくてもOK
};

// 関数を含むオブジェクト
let calculator: {
  add: (a: number, b: number) => number;
  subtract: (a: number, b: number) => number;
} = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b
};
```

## 📖 3. 関数の型定義

### 基本的な関数

```typescript
// 引数と戻り値の型を指定
function add(a: number, b: number): number {
  return a + b;
}

// アロー関数
const multiply = (a: number, b: number): number => {
  return a * b;
};

// 戻り値がない場合はvoid
function logMessage(message: string): void {
  console.log(message);
}

// オプショナル引数
function greet(name: string, prefix?: string): string {
  if (prefix) {
    return `${prefix} ${name}さん`;
  }
  return `こんにちは、${name}さん`;
}

greet("田中"); // "こんにちは、田中さん"
greet("田中", "おはよう"); // "おはよう 田中さん"
```

### デフォルト引数

```typescript
function createTask(
  title: string,
  priority: number = 50,
  completed: boolean = false
): Task {
  return {
    id: Date.now().toString(),
    title,
    priority,
    completed
  };
}

// 使い方
createTask("買い物"); // priorityは50、completedはfalse
createTask("会議", 80); // completedはfalse
createTask("レポート", 90, true); // すべて指定
```

## 📖 4. インターフェースと型エイリアス

### インターフェース

```typescript
// 基本的なインターフェース
interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: number;
  createdAt: Date;
}

// インターフェースを使う
const newTask: Task = {
  id: "task-1",
  title: "TypeScriptを学ぶ",
  completed: false,
  priority: 80,
  createdAt: new Date()
};

// インターフェースの拡張
interface DetailedTask extends Task {
  assignee: string;
  tags: string[];
  dueDate?: Date;
}

// ネストしたインターフェース
interface Project {
  id: string;
  name: string;
  tasks: Task[];
  members: {
    id: string;
    name: string;
    role: "admin" | "member" | "viewer";
  }[];
}
```

### 型エイリアス

```typescript
// 基本的な型エイリアス
type UserID = string;
type Age = number;

// ユニオン型
type Status = "pending" | "in-progress" | "completed" | "cancelled";

// 関数の型
type ClickHandler = (event: React.MouseEvent) => void;

// 複雑な型の組み合わせ
type TaskUpdate = {
  title?: string;
  description?: string;
  completed?: boolean;
} & {
  updatedAt: Date;
  updatedBy: string;
};
```

### インターフェース vs 型エイリアス

```typescript
// インターフェース - 拡張可能
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

// 同名のインターフェースは自動的にマージされる
interface Animal {
  age: number;
}

// 型エイリアス - より柔軟
type Pet = Dog | Cat; // ユニオン型
type PetName = Pet["name"]; // 型の一部を抽出
```

## 📖 5. ジェネリクス

### 基本的なジェネリクス

```typescript
// ジェネリクスを使わない場合
function getFirstNumber(arr: number[]): number {
  return arr[0];
}

function getFirstString(arr: string[]): string {
  return arr[0];
}

// ジェネリクスを使う場合
function getFirst<T>(arr: T[]): T {
  return arr[0];
}

// 使い方
const firstNumber = getFirst<number>([1, 2, 3]); // 1
const firstName = getFirst<string>(["田中", "佐藤"]); // "田中"
const firstTask = getFirst<Task>(tasks); // Task型
```

### コンポーネントでのジェネリクス

```typescript
// 汎用的なリストコンポーネント
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string;
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map(item => (
        <li key={keyExtractor(item)}>
          {renderItem(item)}
        </li>
      ))}
    </ul>
  );
}

// 使い方
<List
  items={tasks}
  renderItem={(task) => <span>{task.title}</span>}
  keyExtractor={(task) => task.id}
/>
```

## 📖 6. React + TypeScript

### コンポーネントの型定義

```typescript
// 関数コンポーネント
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  variant = "primary",
  disabled = false 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {label}
    </button>
  );
};
```

### イベントハンドラーの型

```typescript
// 各種イベントの型
const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  console.log("クリックされました");
};

const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  console.log(event.target.value);
};

const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  // フォーム処理
};

const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
  if (event.key === "Enter") {
    // Enter キーが押された時の処理
  }
};
```

### useState の型

```typescript
// 明示的な型指定
const [count, setCount] = useState<number>(0);
const [user, setUser] = useState<User | null>(null);
const [tasks, setTasks] = useState<Task[]>([]);

// 複雑な状態の型
interface FormData {
  title: string;
  description: string;
  priority: number;
  tags: string[];
}

const [formData, setFormData] = useState<FormData>({
  title: "",
  description: "",
  priority: 50,
  tags: []
});

// 状態更新
setFormData(prev => ({
  ...prev,
  title: "新しいタイトル"
}));
```

## 🎯 実践：TasQ Flowの型定義

### タスクの型定義

```typescript
// types/task.ts
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
  checklist: ChecklistItem[];
}

export type TaskStatus = 
  | "notStarted" 
  | "inProgress" 
  | "completed" 
  | "onHold";

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

// タスクの更新用の型（すべてオプショナル）
export type TaskUpdate = Partial<Omit<Task, "id">>;
```

### ストアの型定義

```typescript
// stores/types.ts
interface AppState {
  tasks: Task[];
  selectedTaskId: string | null;
  viewMode: ViewMode;
  isLoading: boolean;
  error: string | null;
}

interface AppActions {
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: TaskUpdate) => void;
  deleteTask: (id: string) => void;
  selectTask: (id: string | null) => void;
  setViewMode: (mode: ViewMode) => void;
  setError: (error: string | null) => void;
}

export type AppStore = AppState & AppActions;
```

## 🎁 実践的なTips

### 1. 型の絞り込み（Type Guards）

```typescript
// typeof を使った型ガード
function processValue(value: string | number) {
  if (typeof value === "string") {
    // ここでは value は string 型
    return value.toUpperCase();
  } else {
    // ここでは value は number 型
    return value * 2;
  }
}

// in 演算子を使った型ガード
interface Bird {
  fly: () => void;
  layEggs: () => void;
}

interface Fish {
  swim: () => void;
  layEggs: () => void;
}

function move(pet: Bird | Fish) {
  if ("fly" in pet) {
    pet.fly(); // Bird として扱える
  } else {
    pet.swim(); // Fish として扱える
  }
}
```

### 2. ユーティリティ型

```typescript
// Partial - すべてのプロパティをオプショナルに
type PartialTask = Partial<Task>;

// Required - すべてのプロパティを必須に
type RequiredTask = Required<Task>;

// Pick - 特定のプロパティだけを抽出
type TaskSummary = Pick<Task, "id" | "title" | "status">;

// Omit - 特定のプロパティを除外
type TaskWithoutDates = Omit<Task, "startDate" | "endDate">;

// Record - キーと値の型を指定したオブジェクト
type TaskMap = Record<string, Task>;
```

### 3. 型アサーション

```typescript
// as を使った型アサーション
const inputElement = document.getElementById("task-input") as HTMLInputElement;
inputElement.value = "新しいタスク";

// ! を使った非null アサーション
const title = task.title!; // title が絶対に存在することを保証

// 型ガードを使った安全な方法（推奨）
if (task.title) {
  const title = task.title; // ここでは string 型
}
```

## 🏆 レベルアップチャレンジ

### 初級（⭐）
1. User インターフェースを定義して、ユーザー情報を管理しよう
2. 関数に適切な型を付けて、型安全にしよう

```typescript
// ヒント
interface User {
  // ここにプロパティを定義
}

function createUser(/* 引数の型は？ */): /* 戻り値の型は？ */ {
  // 実装
}
```

### 中級（⭐⭐）
1. ジェネリクスを使った汎用的なフィルター関数を作ろう
2. React コンポーネントに適切な型を付けよう

### 上級（⭐⭐⭐）
1. 型安全な状態管理システムを作ろう
2. APIレスポンスの型定義と型ガードを実装しよう

## 📚 まとめ

TypeScriptは最初は難しく感じるかもしれませんが、以下の利点があります：

- ✅ **エラーの早期発見**：実行前にバグを見つけられる
- ✅ **自動補完**：IDEが賢くコードを提案してくれる
- ✅ **リファクタリング**：安全にコードを変更できる
- ✅ **ドキュメント効果**：型がコードの仕様書になる

段階的に型を追加していけば、必ず使いこなせるようになります！

## 🔗 次のステップ

- [状態管理学習ガイド](./State-Management-Learning-Guide.md)へ進む
- [コンポーネント設計学習ガイド](./Component-Design-Learning-Guide.md)で設計を学ぶ

## 💡 参考リソース

- [TypeScript公式ドキュメント](https://www.typescriptlang.org/ja/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [TypeScript Deep Dive](https://typescript-jp.gitbook.io/deep-dive/)