# ボタンサイズの制御方法

## 現在のボタンサイズを決める要素

### BackToMainButton.tsx の場合：

```typescript
sx={{
  // 内側の余白（これが主にサイズを決める）
  padding: '8px 16px',  // 上下8px、左右16px
  
  // その他のサイズに影響する要素：
  fontWeight: 500,      // フォントの太さ
  borderRadius: '8px',  // 角の丸み（サイズには影響しない）
  // アイコン: <ArrowBackIcon /> + テキスト: "← メインに戻る"
}}
```

## サイズを明示的に制御する方法

### 1. 固定サイズで指定
```typescript
sx={{
  width: '150px',        // 幅を固定
  height: '40px',        // 高さを固定
  minWidth: '100px',     // 最小幅
  maxWidth: '200px',     // 最大幅
}}
```

### 2. paddingでサイズ調整
```typescript
sx={{
  padding: '12px 24px',  // より大きなボタン
  padding: '6px 12px',   // より小さなボタン
  px: 3,                 // 左右のpadding（Material-UIの単位：8px × 3 = 24px）
  py: 1.5,               // 上下のpadding（8px × 1.5 = 12px）
}}
```

### 3. Material-UIのsizeプロップ
```typescript
<Button
  size="small"    // 小さいサイズ
  size="medium"   // 通常サイズ（デフォルト）
  size="large"    // 大きいサイズ
/>
```

### 4. フォントサイズでの調整
```typescript
sx={{
  fontSize: '14px',      // 小さい文字
  fontSize: '16px',      // 通常文字
  fontSize: '18px',      // 大きい文字
}}
```

## 実際の計算例

### 現在のBackToMainButtonの実際のサイズ：

```
高さ ≈ 
  フォントサイズ(約14px) + 
  上下padding(8px × 2) + 
  ボーダー(約2px) + 
  Material-UIの内部余白
  = 約38-42px

幅 ≈ 
  アイコン幅(約20px) + 
  アイコンとテキストの間隔(約8px) + 
  テキスト幅("← メインに戻る" 約100px) + 
  左右padding(16px × 2)
  = 約144px
```

## サイズカスタマイズの例

### 大きなボタン
```typescript
sx={{
  padding: '16px 32px',
  fontSize: '18px',
  minWidth: '180px',
}}
```

### 小さなボタン
```typescript
sx={{
  padding: '4px 8px',
  fontSize: '12px',
  minWidth: '80px',
}}
```

### 正方形ボタン
```typescript
sx={{
  width: '50px',
  height: '50px',
  minWidth: '50px',  // Material-UIのデフォルト最小幅を上書き
  padding: 0,
}}
```

### フルサイズボタン
```typescript
sx={{
  width: '100%',         // 親要素の全幅
  padding: '12px 0',
}}
```

## 確認方法

ブラウザの開発者ツールで実際のサイズを確認できます：
1. F12キーで開発者ツールを開く
2. ボタンを右クリック → 「検証」
3. Elementsタブでサイズを確認
4. Computedタブで計算済みのスタイルを確認