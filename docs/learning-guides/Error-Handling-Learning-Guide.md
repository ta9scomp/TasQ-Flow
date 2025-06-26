# エラーハンドリング 学習ガイド

**対象**: プログラミング初心者・学習者  
**難易度**: ⭐⭐⭐☆☆（中級）  
**学習時間**: 約2-3時間

---

## 📚 このガイドで学べること

- エラーハンドリングとは何か？
- なぜエラーハンドリングが重要なのか？
- Reactでのエラーハンドリングの基本
- 実際のコードを見ながら理解を深める
- エラーが起きた時の対処法

---

## 🤔 エラーハンドリングって何？

### 分かりやすい例え話

想像してみてください。あなたが料理をしているとき：

- **材料がない**：冷蔵庫に卵がない！
- **火が強すぎる**：焦げちゃった！
- **調味料を入れ過ぎた**：しょっぱくなった！

プログラムでも同じようなことが起こります：

- **データがない**：サーバーからデータが来ない！
- **ネットワークエラー**：インターネットに繋がらない！
- **バグ**：プログラムが予期しない動きをした！

**エラーハンドリング**とは、こうした「想定外の出来事」に対して、適切に対処する仕組みのことです。

---

## 🎯 なぜ大切なの？

### ❌ エラーハンドリングがない場合

```
アプリが突然クラッシュ！
白い画面になって何も表示されない...
ユーザー：「えっ、何これ？」😰
```

### ✅ エラーハンドリングがある場合

```
「申し訳ございません。一時的な問題が発生しました。
[再試行] ボタンを押すか、しばらくお待ちください。」
ユーザー：「わかりやすい！」😊
```

---

## 🧱 基本的な仕組み

### 1. エラーをキャッチする

```typescript
// 悪い例：エラーが起きると止まる
function badExample() {
  const data = getSomeData(); // ここでエラーが起きるかも
  return data.name; // エラーが起きると止まる！
}

// 良い例：エラーをキャッチする
function goodExample() {
  try {
    const data = getSomeData();
    return data.name;
  } catch (error) {
    console.log('エラーが起きました:', error);
    return 'データが取得できませんでした';
  }
}
```

### 2. わかりやすく説明

```typescript
// 初心者向けの説明
try {
  // ここで何かを試す（try = 試す）
  const result = riskyOperation();
  return result;
} catch (error) {
  // エラーが起きたらここで捕まえる（catch = 捕まえる）
  console.log('問題が起きました！');
  return null;
}
```

---

## 🎨 Reactでのエラーハンドリング

### ErrorBoundary（エラーの境界線）

ErrorBoundaryは、エラーが起きた時に「この範囲だけ」を特別な表示にする仕組みです。

```typescript
// 簡単な例で理解しよう
class SimpleErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false }; // エラーが起きたかどうかを記録
  }

  // エラーが起きたときに呼ばれる特別な関数
  static getDerivedStateFromError(error) {
    return { hasError: true }; // 「エラーが起きた」と記録
  }

  render() {
    if (this.state.hasError) {
      // エラーが起きた時の表示
      return (
        <div>
          <h2>😢 何か問題が起きました</h2>
          <p>申し訳ございません。ページをリロードしてください。</p>
        </div>
      );
    }

    // 普通の時はそのまま表示
    return this.props.children;
  }
}
```

### 使い方

```typescript
function App() {
  return (
    <SimpleErrorBoundary>
      <Header />
      <MainContent />
      <Footer />
    </SimpleErrorBoundary>
  );
}
```

この場合、`Header`、`MainContent`、`Footer`のどこかでエラーが起きても、エラーメッセージが表示されてアプリが完全に止まることはありません。

---

## 🔧 実際のTasQ Flowでの実装

### 1. エラーの種類を分ける

TasQ Flowでは、エラーを種類分けしています：

```typescript
// エラーの種類
interface ErrorType {
  network: 'ネットワーク';     // インターネット接続の問題
  validation: 'バリデーション'; // 入力内容の問題
  permission: '権限';         // アクセス権限の問題
  data: 'データ';            // データの問題
  performance: 'パフォーマンス'; // 動作が重い問題
}
```

### 2. ユーザーに優しい通知

```typescript
// エラーメッセージの例
const userFriendlyMessages = {
  network: {
    title: 'インターネット接続エラー',
    message: 'インターネット接続を確認してください',
    action: '再試行'
  },
  validation: {
    title: '入力内容エラー',
    message: '入力内容を確認してください',
    action: '修正'
  }
};
```

### 3. 自動復旧機能

```typescript
// 簡単な自動復旧の例
function autoRetry(operation, maxRetries = 3) {
  let retryCount = 0;

  function tryOperation() {
    try {
      return operation(); // 操作を試す
    } catch (error) {
      retryCount++;
      
      if (retryCount < maxRetries) {
        console.log(`失敗しました。${retryCount}回目の再試行...`);
        setTimeout(tryOperation, 1000); // 1秒後に再試行
      } else {
        console.log('最大再試行回数に達しました');
        throw error;
      }
    }
  }

  return tryOperation();
}
```

---

## 🎮 ハンズオン：簡単な例を作ってみよう

### ステップ1: 基本のエラーハンドリング

```typescript
// エラーが起きる可能性がある関数
function riskyCalculation(a: number, b: number) {
  if (b === 0) {
    throw new Error('0で割ることはできません！');
  }
  return a / b;
}

// エラーハンドリング付きの関数
function safeCalculation(a: number, b: number) {
  try {
    const result = riskyCalculation(a, b);
    console.log(`結果: ${result}`);
    return result;
  } catch (error) {
    console.log(`エラー: ${error.message}`);
    return null;
  }
}

// 試してみよう！
safeCalculation(10, 2); // 結果: 5
safeCalculation(10, 0); // エラー: 0で割ることはできません！
```

### ステップ2: Reactコンポーネントでのエラーハンドリング

```typescript
import React, { useState } from 'react';

function Calculator() {
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleCalculation = (a: number, b: number) => {
    try {
      // エラーをリセット
      setError('');
      
      if (b === 0) {
        throw new Error('0で割ることはできません');
      }
      
      const calculation = a / b;
      setResult(`結果: ${calculation}`);
    } catch (err) {
      setError(err.message);
      setResult('');
    }
  };

  return (
    <div>
      <h3>電卓アプリ</h3>
      <button onClick={() => handleCalculation(10, 2)}>
        10 ÷ 2 を計算
      </button>
      <button onClick={() => handleCalculation(10, 0)}>
        10 ÷ 0 を計算（エラーになる）
      </button>
      
      {result && <p style={{ color: 'green' }}>{result}</p>}
      {error && <p style={{ color: 'red' }}>エラー: {error}</p>}
    </div>
  );
}
```

---

## 🎁 実践的なTips

### 1. エラーメッセージは分かりやすく

```typescript
// ❌ 悪い例
throw new Error('ERR_INVALID_INPUT_VALIDATION_FAILED');

// ✅ 良い例
throw new Error('名前は3文字以上で入力してください');
```

### 2. ログを残そう

```typescript
function handleError(error: Error, context: string) {
  // 開発者向けの詳細ログ
  console.error(`エラー発生場所: ${context}`, error);
  
  // ユーザー向けの分かりやすいメッセージ
  showUserMessage('申し訳ございません。しばらくしてから再度お試しください。');
}
```

### 3. 復旧可能なエラーには「再試行」ボタン

```typescript
function NetworkErrorComponent({ onRetry }: { onRetry: () => void }) {
  return (
    <div>
      <p>ネットワークエラーが発生しました</p>
      <button onClick={onRetry}>再試行</button>
    </div>
  );
}
```

---

## 🏆 レベルアップチャレンジ

### 初級（⭐）
1. try-catchを使った簡単なエラーハンドリングを書いてみよう
2. エラーが起きた時にアラートを表示するコードを書いてみよう

### 中級（⭐⭐）
1. 異なる種類のエラーを判定して、それぞれ違うメッセージを表示しよう
2. 自動で3回まで再試行する機能を作ってみよう

### 上級（⭐⭐⭐）
1. ErrorBoundaryコンポーネントを自分で作ってみよう
2. エラーログを保存して、後で確認できる機能を作ってみよう

---

## 📖 参考資料

### Reactの公式ドキュメント
- [Error Boundaries](https://ja.react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)

### MDN Web Docs（日本語）
- [try...catch文](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/try...catch)
- [Error オブジェクト](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Error)

### TypeScript公式ドキュメント
- [Exception Handling](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#control-flow-analysis)

---

## 💡 まとめ

エラーハンドリングは、**ユーザーに優しいアプリ**を作るために欠かせない技術です。

### 覚えておこう！
1. **try-catch**でエラーをキャッチ
2. **分かりやすいメッセージ**でユーザーに説明
3. **再試行機能**で復旧のチャンスを提供
4. **ログ**で原因を特定できるようにする

最初は難しく感じるかもしれませんが、一歩ずつ実践していけば必ず身につきます。頑張ってください！ 🚀

---

**次のステップ**: [Reactコンポーネント設計 学習ガイド](./React-Component-Design-Learning-Guide.md)

---

**質問や疑問があれば、いつでも開発チームにお聞きください！**