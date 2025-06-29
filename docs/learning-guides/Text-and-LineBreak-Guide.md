# React/JSXでの改行とテキスト表示 学習ガイド

このガイドでは、React/JSXで改行や複数行テキストを表示する様々な方法を学びます。

## 📚 目次
1. [基本的な改行方法](#基本的な改行方法)
2. [複数行テキストの表示](#複数行テキストの表示)
3. [特殊文字とエスケープ](#特殊文字とエスケープ)
4. [Material-UIでのテキスト表示](#material-uiでのテキスト表示)
5. [実践的な例](#実践的な例)

## 基本的な改行方法

### 1. `<br />`タグを使う方法

最もシンプルな改行方法です：

```jsx
function SimpleLineBreak() {
  return (
    <div>
      1行目のテキスト<br />
      2行目のテキスト<br />
      3行目のテキスト
    </div>
  );
}
```

### 2. 複数の要素に分ける方法

各行を別々の要素として扱います：

```jsx
function MultipleElements() {
  return (
    <div>
      <p>段落1の内容です</p>
      <p>段落2の内容です</p>
      <p>段落3の内容です</p>
    </div>
  );
}

// または
function LineByLine() {
  return (
    <div>
      <div>1行目</div>
      <div>2行目</div>
      <div>3行目</div>
    </div>
  );
}
```

### 3. 配列とmapを使った動的な改行

テキストのリストから動的に生成する場合：

```jsx
function DynamicLines() {
  const lines = [
    'ReactはUIライブラリです',
    'コンポーネントベースで開発します',
    '状態管理も簡単です'
  ];

  return (
    <div>
      {lines.map((line, index) => (
        <div key={index}>{line}</div>
      ))}
    </div>
  );
}
```

## 複数行テキストの表示

### 1. `white-space: pre-line`を使う方法

改行文字`\n`を実際の改行として表示：

```jsx
function PreLineText() {
  const multilineText = `1行目のテキスト
2行目のテキスト
3行目のテキスト`;

  return (
    <div style={{ whiteSpace: 'pre-line' }}>
      {multilineText}
    </div>
  );
}
```

### 2. `white-space: pre-wrap`を使う方法

改行とスペースを保持：

```jsx
function PreWrapText() {
  const codeText = `function hello() {
    console.log("Hello");
    return true;
  }`;

  return (
    <pre style={{ whiteSpace: 'pre-wrap' }}>
      {codeText}
    </pre>
  );
}
```

### 3. テンプレートリテラルを使う方法

```jsx
function TemplateText() {
  return (
    <div style={{ whiteSpace: 'pre-line' }}>
      {`こんにちは！
      
これは複数行の
テキストです。

空行も表示されます。`}
    </div>
  );
}
```

## 特殊文字とエスケープ

### 1. HTMLエンティティ

特殊文字を表示する場合：

```jsx
function SpecialCharacters() {
  return (
    <div>
      <p>著作権: &copy; 2024</p>
      <p>商標: &trade;</p>
      <p>登録商標: &reg;</p>
      <p>引用符: &ldquo;こんにちは&rdquo;</p>
      <p>矢印: &larr; &uarr; &rarr; &darr;</p>
      <p>ハート: &hearts;</p>
    </div>
  );
}
```

### 2. JSXでの特殊文字

```jsx
function JSXSpecialChars() {
  return (
    <div>
      {/* 中括弧を表示 */}
      <p>{'{ }'}</p>
      
      {/* より小さい・より大きい */}
      <p>{'< >'}</p>
      
      {/* アンパサンド */}
      <p>{'&'}</p>
    </div>
  );
}
```

## Material-UIでのテキスト表示

### 1. Typography コンポーネント

```jsx
import { Typography } from '@mui/material';

function MuiText() {
  return (
    <div>
      <Typography variant="h6">
        見出しテキスト
      </Typography>
      
      <Typography variant="body1">
        本文の1行目<br />
        本文の2行目
      </Typography>
      
      <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
        {`複数行の
        テキストを
        表示します`}
      </Typography>
    </div>
  );
}
```

### 2. Box コンポーネントでのスタイリング

```jsx
import { Box } from '@mui/material';

function StyledText() {
  return (
    <Box
      sx={{
        whiteSpace: 'pre-line',
        fontFamily: 'monospace',
        backgroundColor: '#f5f5f5',
        p: 2,
        borderRadius: 1,
      }}
    >
      {`コード例:
      const x = 10;
      const y = 20;
      console.log(x + y);`}
    </Box>
  );
}
```

## 実践的な例

### 1. メッセージ表示コンポーネント

```jsx
function MessageDisplay({ messages }) {
  return (
    <Box sx={{ p: 2 }}>
      {messages.map((msg, index) => (
        <Card key={index} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">
              {msg.author} - {msg.timestamp}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ whiteSpace: 'pre-wrap', mt: 1 }}
            >
              {msg.content}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
```

### 2. コード表示コンポーネント

```jsx
function CodeDisplay({ code, language }) {
  return (
    <Box
      sx={{
        backgroundColor: '#282c34',
        color: '#abb2bf',
        p: 2,
        borderRadius: 1,
        overflow: 'auto',
      }}
    >
      <Typography
        component="pre"
        sx={{
          margin: 0,
          whiteSpace: 'pre',
          fontFamily: '"Fira Code", monospace',
          fontSize: '14px',
        }}
      >
        {code}
      </Typography>
    </Box>
  );
}
```

### 3. リスト表示コンポーネント

```jsx
function TodoList({ items }) {
  return (
    <List>
      {items.map((item, index) => (
        <ListItem key={index}>
          <ListItemText
            primary={item.title}
            secondary={
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ whiteSpace: 'pre-line' }}
              >
                {item.description}
              </Typography>
            }
          />
        </ListItem>
      ))}
    </List>
  );
}
```

## 💡 ベストプラクティス

### 1. 適切な方法を選ぶ

- **単純な改行**: `<br />`タグ
- **段落**: `<p>`タグ
- **リスト形式**: `map`関数
- **フォーマット保持**: `white-space: pre-wrap`
- **コード表示**: `<pre>`タグ

### 2. パフォーマンスを考慮

```jsx
// ❌ 非効率な例
function BadExample() {
  return (
    <div>
      {text.split('\n').map((line, i) => (
        <div key={Math.random()}>{line}</div> // Mathc.randomはダメ
      ))}
    </div>
  );
}

// ✅ 効率的な例
function GoodExample() {
  return (
    <div>
      {text.split('\n').map((line, i) => (
        <div key={i}>{line}</div> // インデックスを使用
      ))}
    </div>
  );
}
```

### 3. アクセシビリティ

```jsx
function AccessibleText() {
  return (
    <div role="article">
      <h1>記事タイトル</h1>
      <p>段落1の内容...</p>
      <p>段落2の内容...</p>
      <section aria-label="コード例">
        <pre>
          <code>{codeContent}</code>
        </pre>
      </section>
    </div>
  );
}
```

## 🎯 練習問題

### 問題1: 基本的な改行

以下のテキストを3つの異なる方法で表示してください：
```
React
TypeScript
Material-UI
```

### 問題2: 動的なリスト

配列から動的にリストを生成し、各項目に番号を付けて表示してください。

### 問題3: 複雑なフォーマット

以下のような表示を実装してください：
```
タイトル: React学習ガイド
作成日: 2024年1月1日

内容:
  - 基礎編
    ・コンポーネント
    ・Props
    ・State
  
  - 応用編
    ・Hooks
    ・Context
    ・Router
```

## 🔍 トラブルシューティング

### 改行が表示されない

```jsx
// ❌ 改行が無視される
<div>{multilineText}</div>

// ✅ 改行が表示される
<div style={{ whiteSpace: 'pre-line' }}>{multilineText}</div>
```

### 余分なスペースが表示される

```jsx
// ❌ インデントが表示される
<div style={{ whiteSpace: 'pre-wrap' }}>
  {`
    テキスト
  `}
</div>

// ✅ インデントを除去
<div style={{ whiteSpace: 'pre-wrap' }}>
{`テキスト`}
</div>
```

## 📚 関連リソース

- [MDN: white-space](https://developer.mozilla.org/ja/docs/Web/CSS/white-space)
- [React公式: JSXの基礎](https://ja.react.dev/learn/writing-markup-with-jsx)
- [Material-UI Typography](https://mui.com/material-ui/react-typography/)

---

このガイドで改行とテキスト表示の基本をマスターできました！
次は実際のプロジェクトで活用してみましょう。