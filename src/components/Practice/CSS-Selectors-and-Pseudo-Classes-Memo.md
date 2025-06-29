# CSS セレクタと疑似クラス メモ

## &記法について

`&:focus`や`&:active`は、CSS-in-JSでの**疑似クラス**の記述方法です。
`&`は現在の要素自身を指し、疑似クラスと組み合わせて使用します。

## 疑似クラスの種類

### インタラクション系

#### `:hover`
- マウスホバー時のスタイル
```typescript
'&:hover': {
  backgroundColor: 'blue',
  transform: 'scale(1.05)',
}
```

#### `:active`
- 要素がアクティブ（クリック中）の状態
```typescript
'&:active': {
  transform: 'scale(0.95)',
  backgroundColor: 'darkblue',
}
```

#### `:focus`
- 要素にフォーカスが当たっている状態
```typescript
'&:focus': {
  outline: 'none',
  boxShadow: '0 0 0 2px blue',
}
```

#### `:focus-visible`
- キーボードナビゲーション時のフォーカス
```typescript
'&:focus-visible': {
  outline: '2px solid blue',
}
```

#### `:focus-within`
- 子要素にフォーカスがある場合
```typescript
'&:focus-within': {
  borderColor: 'blue',
}
```

### 状態系

#### `:disabled`
- 無効化された要素
```typescript
'&:disabled': {
  opacity: 0.5,
  cursor: 'not-allowed',
}
```

#### `:checked`
- チェックボックス・ラジオボタンがチェック済み
```typescript
'&:checked': {
  backgroundColor: 'green',
}
```

#### `:valid` / `:invalid`
- フォーム要素の妥当性
```typescript
'&:valid': {
  borderColor: 'green',
},
'&:invalid': {
  borderColor: 'red',
}
```

### 構造系

#### `:first-child` / `:last-child`
- 最初・最後の子要素
```typescript
'&:first-child': {
  marginTop: 0,
},
'&:last-child': {
  marginBottom: 0,
}
```

#### `:nth-child(n)`
- n番目の子要素
```typescript
'&:nth-child(2n)': { // 偶数番目
  backgroundColor: 'lightgray',
},
'&:nth-child(odd)': { // 奇数番目
  backgroundColor: 'white',
}
```

#### `:only-child`
- 唯一の子要素
```typescript
'&:only-child': {
  textAlign: 'center',
}
```

#### `:empty`
- 中身が空の要素
```typescript
'&:empty': {
  display: 'none',
}
```

## 疑似要素

#### `::before` / `::after`
- 要素の前後にコンテンツを挿入
```typescript
'&::before': {
  content: '"★"',
  marginRight: '8px',
  color: 'gold',
},
'&::after': {
  content: '""',
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'linear-gradient(...)',
}
```

#### `::first-line` / `::first-letter`
- 最初の行・文字
```typescript
'&::first-line': {
  fontWeight: 'bold',
},
'&::first-letter': {
  fontSize: '2em',
  float: 'left',
}
```

## 組み合わせ例

### ボタンの完全なインタラクション
```typescript
sx={{
  backgroundColor: 'blue',
  color: 'white',
  border: 'none',
  padding: '12px 24px',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  
  // ホバー時
  '&:hover': {
    backgroundColor: 'darkblue',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  },
  
  // クリック時
  '&:active': {
    transform: 'translateY(0)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  },
  
  // フォーカス時
  '&:focus': {
    outline: 'none',
    boxShadow: '0 0 0 3px rgba(0,0,255,0.3)',
  },
  
  // 無効化時
  '&:disabled': {
    backgroundColor: 'gray',
    cursor: 'not-allowed',
    transform: 'none',
  },
}}
```

### カードのホバーアニメーション
```typescript
sx={{
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
    
    // 子要素への影響
    '& .card-title': {
      color: 'blue',
    },
    '& .card-image': {
      transform: 'scale(1.1)',
    },
  },
}}
```

## Material-UI特有の疑似クラス

### `.Mui-selected`
- Material-UIコンポーネントの選択状態
```typescript
'&.Mui-selected': {
  backgroundColor: 'primary.main',
  color: 'white',
}
```

### `.Mui-disabled`
- Material-UIコンポーネントの無効状態
```typescript
'&.Mui-disabled': {
  opacity: 0.6,
}
```

### `.Mui-error`
- Material-UIコンポーネントのエラー状態
```typescript
'&.Mui-error': {
  borderColor: 'error.main',
}
```

## 高度な使用例

### 複数の疑似クラスの組み合わせ
```typescript
'&:hover:not(:disabled)': {
  backgroundColor: 'blue',
},
'&:focus:not(:focus-visible)': {
  outline: 'none',
}
```

### メディアクエリとの組み合わせ
```typescript
'&:hover': {
  '@media (min-width: 768px)': {
    transform: 'scale(1.05)',
  },
}
```

## 注意点

1. **パフォーマンス**: 複雑な疑似クラスは描画性能に影響する可能性
2. **アクセシビリティ**: `:focus-visible`を活用してキーボードユーザーを考慮
3. **ブラウザサポート**: 新しい疑似クラスはブラウザ対応を確認
4. **コードの可読性**: 過度に複雑にせず、適切にコメントを記載

## 実践テンプレート

```typescript
// 基本的なインタラクティブ要素
const interactiveElementSx = {
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  
  '&:hover': {
    // ホバー時の変化
  },
  '&:active': {
    // クリック時の変化
  },
  '&:focus': {
    outline: 'none',
    // フォーカス時の変化
  },
  '&:disabled': {
    cursor: 'not-allowed',
    opacity: 0.6,
  },
};
```