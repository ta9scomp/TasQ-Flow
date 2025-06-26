# React基礎 学習ガイド

**対象**: HTML・JavaScript基礎を学んだ初学者  
**難易度**: ⭐⭐☆☆☆（初級〜中級）  
**学習時間**: 約4-5時間

---

## 📚 このガイドで学べること

- Reactとは何か？なぜ使うのか？
- コンポーネントという考え方
- JSXの書き方と使い方
- 状態（state）とイベントハンドリング
- 実際にTasQ Flowで使われているReactコードを理解

---

## 🤔 Reactって何？

### 分かりやすい例え話：レゴブロック

普通のWebサイトを作るのは、**粘土で作品を作る**ようなものです：
- 一から全部作らないといけない
- 修正するときは全体をいじる必要がある
- 似たような部分も毎回作り直し

Reactは、**レゴブロックで作品を作る**ようなものです：
- 小さなパーツ（コンポーネント）を組み合わせる
- パーツを再利用できる
- 一部だけ修正・交換できる

```html
<!-- 普通のHTML：同じようなボタンを何度も書く -->
<button onclick="saveData()">保存</button>
<button onclick="deleteData()">削除</button>
<button onclick="editData()">編集</button>
```

```tsx
// React：ボタンコンポーネントを作って再利用
<Button onClick={saveData}>保存</Button>
<Button onClick={deleteData}>削除</Button>
<Button onClick={editData}>編集</Button>
```

---

## 🧱 コンポーネントとは？

### 1. 関数のような仕組み

```tsx
// 普通のJavaScript関数
function greet(name) {
  return `こんにちは、${name}さん！`;
}

// Reactコンポーネント（UIを返す関数）
function Greeting(props) {
  return <h1>こんにちは、{props.name}さん！</h1>;
}
```

### 2. 使い方

```tsx
// HTML風に書ける！
function App() {
  return (
    <div>
      <Greeting name="田中" />
      <Greeting name="佐藤" />
      <Greeting name="鈴木" />
    </div>
  );
}
```

### 3. 実際の画面での表示

```html
<!-- 結果はこうなる -->
<div>
  <h1>こんにちは、田中さん！</h1>
  <h1>こんにちは、佐藤さん！</h1>
  <h1>こんにちは、鈴木さん！</h1>
</div>
```

---

## ✨ JSXとは？

JSXは、**JavaScript + HTML**のような書き方です。

### 基本的な書き方

```tsx
// ❌ 普通のJavaScriptだとこう書く
function createButton() {
  const button = document.createElement('button');
  button.textContent = 'クリック';
  button.addEventListener('click', handleClick);
  return button;
}

// ✅ JSXだとこう書ける！
function Button() {
  return <button onClick={handleClick}>クリック</button>;
}
```

### JSXのルール

```tsx
// 1. 一つの親要素で囲む
function Good() {
  return (
    <div>
      <h1>タイトル</h1>
      <p>内容</p>
    </div>
  );
}

// 2. JavaScript表現は{}で囲む
function Profile() {
  const userName = '田中太郎';
  const age = 25;
  
  return (
    <div>
      <h1>名前: {userName}</h1>
      <p>年齢: {age}歳</p>
      <p>来年は{age + 1}歳になります</p>
    </div>
  );
}

// 3. className（classではない）
function StyledComponent() {
  return <div className="my-style">スタイル付き</div>;
}
```

---

## 🎮 状態（State）を使ってみよう

### 状態とは？

状態（State）は、**コンポーネントが覚えておくデータ**です。

```tsx
import { useState } from 'react';

function Counter() {
  // useState：状態を作る魔法の関数
  // [現在の値, 値を変える関数] = useState(初期値)
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1); // countを1増やす
  };

  return (
    <div>
      <p>現在のカウント: {count}</p>
      <button onClick={increment}>+1</button>
    </div>
  );
}
```

### ステップバイステップで理解

```tsx
// Step 1: 基本の表示
function Step1() {
  return <p>いいね: 0</p>;
}

// Step 2: 状態を追加
function Step2() {
  const [likes, setLikes] = useState(0);
  return <p>いいね: {likes}</p>;
}

// Step 3: ボタンを追加
function Step3() {
  const [likes, setLikes] = useState(0);
  
  const handleLike = () => {
    setLikes(likes + 1);
  };
  
  return (
    <div>
      <p>いいね: {likes}</p>
      <button onClick={handleLike}>👍</button>
    </div>
  );
}

// Step 4: 複数の状態を管理
function Step4() {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  
  return (
    <div>
      <p>いいね: {likes} | よくない: {dislikes}</p>
      <button onClick={() => setLikes(likes + 1)}>👍</button>
      <button onClick={() => setDislikes(dislikes + 1)}>👎</button>
    </div>
  );
}
```

---

## 🎯 実践：簡単なToDoアプリを作ろう

### Step 1: 基本構造

```tsx
import { useState } from 'react';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [inputText, setInputText] = useState('');

  return (
    <div>
      <h1>📝 ToDoアプリ</h1>
      <input 
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="やることを入力..."
      />
      <button>追加</button>
      
      <ul>
        {todos.map((todo, index) => (
          <li key={index}>{todo}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Step 2: タスク追加機能

```tsx
function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [inputText, setInputText] = useState('');

  const addTodo = () => {
    if (inputText.trim() !== '') {
      setTodos([...todos, inputText]); // 新しい配列を作成
      setInputText(''); // 入力欄をクリア
    }
  };

  return (
    <div>
      <h1>📝 ToDoアプリ</h1>
      <input 
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="やることを入力..."
      />
      <button onClick={addTodo}>追加</button>
      
      <ul>
        {todos.map((todo, index) => (
          <li key={index}>{todo}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Step 3: 削除機能

```tsx
function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [inputText, setInputText] = useState('');

  const addTodo = () => {
    if (inputText.trim() !== '') {
      setTodos([...todos, inputText]);
      setInputText('');
    }
  };

  const deleteTodo = (indexToDelete) => {
    const newTodos = todos.filter((_, index) => index !== indexToDelete);
    setTodos(newTodos);
  };

  return (
    <div>
      <h1>📝 ToDoアプリ</h1>
      <input 
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="やることを入力..."
      />
      <button onClick={addTodo}>追加</button>
      
      <ul>
        {todos.map((todo, index) => (
          <li key={index}>
            {todo}
            <button onClick={() => deleteTodo(index)}>削除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 🏗️ TasQ Flowで使われているReactパターン

### 1. Material-UIコンポーネント

```tsx
// TasQ Flowでよく使われるパターン
import { Button, Typography, Box } from '@mui/material';

function TaskCard({ task }) {
  return (
    <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
      <Typography variant="h6">{task.title}</Typography>
      <Typography variant="body2">{task.description}</Typography>
      <Button variant="contained" color="primary">
        編集
      </Button>
    </Box>
  );
}
```

### 2. プロパティ（Props）の受け渡し

```tsx
// 親コンポーネント
function TaskList() {
  const tasks = [
    { id: 1, title: 'ミーティング準備', description: '資料作成' },
    { id: 2, title: 'コードレビュー', description: '新機能の確認' }
  ];

  return (
    <div>
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}

// 子コンポーネント
function TaskCard({ task }) {
  return (
    <div>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
    </div>
  );
}
```

### 3. イベントハンドリング

```tsx
function EditableTask({ task, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);

  const saveTask = () => {
    onUpdate({ ...task, title });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div>
        <input 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={saveTask}>保存</button>
        <button onClick={() => setIsEditing(false)}>キャンセル</button>
      </div>
    );
  }

  return (
    <div>
      <h3>{task.title}</h3>
      <button onClick={() => setIsEditing(true)}>編集</button>
    </div>
  );
}
```

---

## 🎁 実践的なTips

### 1. コンポーネントは小さく作る

```tsx
// ❌ 大きすぎるコンポーネント
function BigComponent() {
  return (
    <div>
      <header>...</header>
      <nav>...</nav>
      <main>...</main>
      <footer>...</footer>
    </div>
  );
}

// ✅ 小さなコンポーネントに分割
function App() {
  return (
    <div>
      <Header />
      <Navigation />
      <MainContent />
      <Footer />
    </div>
  );
}
```

### 2. 状態は必要な場所にだけ

```tsx
// ❌ すべてを最上位で管理
function App() {
  const [userProfile, setUserProfile] = useState({});
  const [taskList, setTaskList] = useState([]);
  const [stickyNotes, setStickyNotes] = useState([]);
  // ...
}

// ✅ 関連するコンポーネントで管理
function TaskSection() {
  const [taskList, setTaskList] = useState([]);
  // タスク関連の状態はここで管理
}

function ProfileSection() {
  const [userProfile, setUserProfile] = useState({});
  // プロフィール関連の状態はここで管理
}
```

### 3. わかりやすい名前をつける

```tsx
// ❌ わかりにくい名前
function Comp1({ data, fn }) {
  return <div onClick={fn}>{data}</div>;
}

// ✅ わかりやすい名前
function TaskCard({ task, onTaskClick }) {
  return <div onClick={onTaskClick}>{task.title}</div>;
}
```

---

## 🏆 レベルアップチャレンジ

### 初級（⭐）
1. 「Hello World」を表示するコンポーネントを作ってみよう
2. 名前を入力すると挨拶を表示するコンポーネントを作ってみよう

```tsx
// ヒント
function GreetingApp() {
  const [name, setName] = useState('');
  
  return (
    <div>
      <input 
        value={name}
        onChange={/* ここを埋めよう */}
        placeholder="お名前を入力"
      />
      <p>こんにちは、{/* ここを埋めよう */}さん！</p>
    </div>
  );
}
```

### 中級（⭐⭐）
1. カウンターアプリを作ろう（+1、-1、リセットボタン付き）
2. 色を変えられるボタンを作ろう

### 上級（⭐⭐⭐）
1. 完全なToDoアプリを作ろう（追加・削除・完了チェック）
2. 付箋メモアプリを作ろう（追加・削除・編集）

---

## 📖 参考資料

### React公式ドキュメント（日本語）
- [React入門](https://ja.react.dev/learn)
- [useState Hook](https://ja.react.dev/reference/react/useState)

### MDN Web Docs
- [JavaScript基礎](https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide)
- [ES6の新機能](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference)

### おすすめの学習リソース
- [JavaScript Primer](https://jsprimer.net/)
- [React Tutorial](https://ja.react.dev/learn/tutorial-tic-tac-toe)

---

## 💡 まとめ

Reactは、**コンポーネント**という小さなパーツを組み合わせてWebアプリを作る技術です。

### 覚えておこう！
1. **コンポーネント**：再利用可能なUIパーツ
2. **JSX**：JavaScript + HTMLのような書き方
3. **useState**：コンポーネントの状態管理
4. **Props**：コンポーネント間のデータ受け渡し

最初は「なんで普通のHTMLじゃダメなの？」と思うかもしれませんが、慣れるとReactの便利さがわかります。小さなコンポーネントから始めて、少しずつ覚えていきましょう！ 🚀

---

**次のステップ**: [CSS・スタイリング学習ガイド](./CSS-Styling-Learning-Guide.md)

---

**質問や疑問があれば、いつでも開発チームにお聞きください！**