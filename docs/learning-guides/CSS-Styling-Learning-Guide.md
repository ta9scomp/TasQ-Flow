# CSS・スタイリング 学習ガイド

**対象**: HTML・JavaScript基礎を学んだ初学者  
**難易度**: ⭐⭐☆☆☆（初級〜中級）  
**学習時間**: 約3-4時間

---

## 📚 このガイドで学べること

- CSS基礎の復習と応用
- Reactでのスタイリング方法
- Material-UI（MUI）の使い方
- TasQ Flowで使われているスタイリング技術
- モダンなCSS技術（Flexbox、Grid、アニメーション）

---

## 🎨 Reactでのスタイリング方法

### 1. インラインスタイル

```tsx
// 基本的な書き方
function ColorfulButton() {
  const buttonStyle = {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  };

  return (
    <button style={buttonStyle}>
      クリック
    </button>
  );
}

// 動的なスタイル
function DynamicButton({ isPrimary }) {
  return (
    <button
      style={{
        backgroundColor: isPrimary ? '#2196F3' : '#666',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: isPrimary ? '25px' : '5px',
        transition: 'all 0.3s ease'
      }}
    >
      {isPrimary ? 'メインボタン' : 'サブボタン'}
    </button>
  );
}
```

### 2. CSSクラス

```css
/* styles.css */
.primary-button {
  background-color: #2196F3;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.primary-button:hover {
  background-color: #1976D2;
}

.secondary-button {
  background-color: transparent;
  color: #2196F3;
  border: 1px solid #2196F3;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}
```

```tsx
// コンポーネントで使用
import './styles.css';

function StyledButtons() {
  return (
    <div>
      <button className="primary-button">メインボタン</button>
      <button className="secondary-button">サブボタン</button>
    </div>
  );
}
```

### 3. 条件付きクラス

```tsx
function ToggleButton({ isActive, onClick }) {
  return (
    <button
      className={`base-button ${isActive ? 'active' : 'inactive'}`}
      onClick={onClick}
    >
      {isActive ? 'アクティブ' : '非アクティブ'}
    </button>
  );
}
```

---

## 🎭 Material-UI（MUI）の使い方

### 1. 基本コンポーネント

```tsx
import {
  Button,
  TextField,
  Typography,
  Box,
  Paper,
  Card,
  CardContent
} from '@mui/material';

function BasicMUIExample() {
  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h4" gutterBottom>
        ユーザー登録
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="お名前"
          variant="outlined"
          fullWidth
        />
        
        <TextField
          label="メールアドレス"
          type="email"
          variant="outlined"
          fullWidth
        />
        
        <Button
          variant="contained"
          color="primary"
          size="large"
        >
          登録
        </Button>
      </Box>
    </Paper>
  );
}
```

### 2. sx prop（スタイル設定）

```tsx
function SxPropExample() {
  return (
    <Box
      sx={{
        // 基本のスタイル
        width: 300,
        height: 200,
        backgroundColor: 'primary.main',
        color: 'primary.contrastText',
        
        // レスポンシブ対応
        p: { xs: 1, sm: 2, md: 3 }, // パディング
        fontSize: { xs: '14px', md: '16px' },
        
        // ホバー効果
        '&:hover': {
          backgroundColor: 'primary.dark',
          transform: 'scale(1.05)',
        },
        
        // アニメーション
        transition: 'all 0.3s ease',
      }}
    >
      マテリアルUIボックス
    </Box>
  );
}
```

### 3. カスタムテーマ

```tsx
import { createTheme, ThemeProvider } from '@mui/material/styles';

const customTheme = createTheme({
  palette: {
    primary: {
      main: '#FF6B6B', // メインカラー
      light: '#FF8E8E',
      dark: '#FF4848',
    },
    secondary: {
      main: '#4ECDC4',
    },
  },
  typography: {
    fontFamily: '"Noto Sans JP", sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 600,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={customTheme}>
      <YourComponents />
    </ThemeProvider>
  );
}
```

---

## 🏗️ TasQ Flowのスタイリング技術

### 1. ガラスモーフィズム（透明感のあるデザイン）

```tsx
function GlassmorphismCard() {
  return (
    <Box
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: 3,
        padding: 3,
        boxShadow: `
          0 8px 32px 0 rgba(0, 0, 0, 0.15),
          inset 0 1px 0 0 rgba(255, 255, 255, 0.3)
        `,
      }}
    >
      <Typography variant="h6">
        ガラスのような透明感
      </Typography>
      <Typography variant="body2">
        美しいガラスモーフィズムデザイン
      </Typography>
    </Box>
  );
}
```

### 2. グラデーション背景

```tsx
function GradientBackground() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `
          linear-gradient(135deg, #667eea 0%, #764ba2 100%)
        `,
        // 複数のグラデーション
        backgroundImage: `
          radial-gradient(circle at 25% 25%, rgba(138, 43, 226, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, rgba(30, 144, 255, 0.05) 0%, transparent 50%),
          linear-gradient(135deg, #667eea 0%, #764ba2 100%)
        `,
      }}
    >
      <Typography variant="h2" color="white" textAlign="center" pt={10}>
        美しいグラデーション
      </Typography>
    </Box>
  );
}
```

### 3. ホバーアニメーション

```tsx
function AnimatedButton() {
  return (
    <Button
      variant="contained"
      sx={{
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        border: 0,
        borderRadius: 3,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        color: 'white',
        height: 48,
        padding: '0 30px',
        
        // アニメーション
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        
        '&:hover': {
          transform: 'translateY(-2px) scale(1.05)',
          boxShadow: '0 6px 20px 4px rgba(255, 105, 135, .4)',
          background: 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)',
        },
        
        '&:active': {
          transform: 'translateY(0px) scale(1.02)',
          transition: 'all 0.1s ease',
        }
      }}
    >
      アニメーション付きボタン
    </Button>
  );
}
```

---

## 📱 レスポンシブデザイン

### 1. ブレイクポイントの使い方

```tsx
function ResponsiveLayout() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' }, // モバイルは縦、デスクトップは横
        gap: { xs: 1, sm: 2, md: 3 }, // 画面サイズによってギャップを変更
        p: { xs: 1, sm: 2, md: 3 }, // パディングも画面サイズで調整
      }}
    >
      <Paper
        sx={{
          flex: { xs: '1', md: '2' }, // デスクトップでは2倍の幅
          p: 2,
        }}
      >
        メインコンテンツ
      </Paper>
      
      <Paper
        sx={{
          flex: '1',
          p: 2,
          display: { xs: 'none', md: 'block' }, // モバイルでは非表示
        }}
      >
        サイドバー（デスクトップのみ）
      </Paper>
    </Box>
  );
}
```

### 2. モバイルファースト設計

```tsx
function MobileFirstCard() {
  return (
    <Card
      sx={{
        // モバイル（デフォルト）
        width: '100%',
        margin: 1,
        
        // タブレット以上
        [theme.breakpoints.up('sm')]: {
          width: '400px',
          margin: 2,
        },
        
        // デスクトップ以上
        [theme.breakpoints.up('md')]: {
          width: '500px',
          margin: 3,
        },
      }}
    >
      <CardContent>
        <Typography variant="h6">
          レスポンシブカード
        </Typography>
      </CardContent>
    </Card>
  );
}
```

---

## 🎮 実践：カードコンポーネントを作ろう

### Step 1: 基本のカード

```tsx
function BasicTaskCard({ task }) {
  return (
    <Card sx={{ m: 1 }}>
      <CardContent>
        <Typography variant="h6">{task.title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {task.description}
        </Typography>
      </CardContent>
    </Card>
  );
}
```

### Step 2: スタイルを追加

```tsx
function StyledTaskCard({ task }) {
  return (
    <Card
      sx={{
        m: 1,
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="h6">{task.title}</Typography>
          <Chip
            label={task.priority}
            color={task.priority === 'high' ? 'error' : 'default'}
            size="small"
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          {task.description}
        </Typography>
        
        <LinearProgress
          variant="determinate"
          value={task.progress}
          sx={{ mb: 1 }}
        />
        
        <Typography variant="caption">
          進捗: {task.progress}%
        </Typography>
      </CardContent>
    </Card>
  );
}
```

### Step 3: アニメーションを追加

```tsx
import { keyframes } from '@mui/material/styles';

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

function AnimatedTaskCard({ task, index }) {
  return (
    <Card
      sx={{
        m: 1,
        animation: `${slideIn} 0.5s ease-out`,
        animationDelay: `${index * 0.1}s`, // 順番にアニメーション
        animationFillMode: 'both',
        
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        
        '&:hover': {
          transform: 'translateY(-4px) scale(1.02)',
          boxShadow: `
            0 8px 25px 0 rgba(0, 0, 0, 0.15),
            0 4px 10px 0 rgba(0, 0, 0, 0.1)
          `,
        }
      }}
    >
      <CardContent>
        {/* カード内容 */}
      </CardContent>
    </Card>
  );
}
```

---

## 🧩 Flexbox と Grid

### 1. Flexboxレイアウト

```tsx
function FlexboxExample() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row', // 横並び
        justifyContent: 'space-between', // 均等配置
        alignItems: 'center', // 中央揃え
        gap: 2, // 要素間のスペース
        p: 2,
      }}
    >
      <Typography variant="h6">タイトル</Typography>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="outlined">編集</Button>
        <Button variant="contained">保存</Button>
      </Box>
    </Box>
  );
}
```

### 2. CSS Grid

```tsx
function GridExample() {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 2,
        p: 2,
      }}
    >
      {tasks.map((task, index) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </Box>
  );
}
```

---

## 🎁 実践的なTips

### 1. ダークモードサポート

```tsx
import { useTheme } from '@mui/material/styles';

function DarkModeCard() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  return (
    <Card
      sx={{
        backgroundColor: isDark 
          ? 'rgba(255, 255, 255, 0.05)' 
          : 'rgba(0, 0, 0, 0.02)',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${
          isDark 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(0, 0, 0, 0.1)'
        }`,
      }}
    >
      <CardContent>
        <Typography>ダークモード対応カード</Typography>
      </CardContent>
    </Card>
  );
}
```

### 2. 条件付きスタイル

```tsx
function ConditionalStyling({ status, priority }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success.main';
      case 'in-progress': return 'warning.main';
      case 'pending': return 'grey.500';
      default: return 'text.primary';
    }
  };

  return (
    <Paper
      sx={{
        p: 2,
        borderLeft: `4px solid`,
        borderLeftColor: getStatusColor(status),
        opacity: status === 'completed' ? 0.7 : 1,
        transform: priority === 'high' ? 'scale(1.02)' : 'none',
      }}
    >
      <Typography color={getStatusColor(status)}>
        {status} - {priority}
      </Typography>
    </Paper>
  );
}
```

### 3. アクセシビリティ配慮

```tsx
function AccessibleButton({ onClick, disabled, children }) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      sx={{
        // キーボードフォーカス時のスタイル
        '&:focus-visible': {
          outline: '2px solid',
          outlineColor: 'primary.main',
          outlineOffset: '2px',
        },
        
        // 無効状態のスタイル
        '&:disabled': {
          opacity: 0.5,
          cursor: 'not-allowed',
        },
        
        // 最小タップサイズ確保（モバイル）
        minHeight: 44,
        minWidth: 44,
      }}
      aria-label="ボタンの説明" // スクリーンリーダー用
    >
      {children}
    </Button>
  );
}
```

---

## 🏆 レベルアップチャレンジ

### 初級（⭐）
1. ボタンの色を変えるコンポーネントを作ろう
2. ホバー時に色が変わるカードを作ろう

### 中級（⭐⭐）
1. レスポンシブなナビゲーションバーを作ろう
2. アニメーション付きのモーダルを作ろう

### 上級（⭐⭐⭐）
1. ガラスモーフィズムデザインのダッシュボードを作ろう
2. ダークモード切替機能付きのテーマシステムを作ろう

---

## 📖 参考資料

### Material-UI公式
- [MUI Components](https://mui.com/material-ui/getting-started/)
- [Theming](https://mui.com/material-ui/customization/theming/)

### CSS関連
- [CSS Grid Complete Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [Flexbox Complete Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)

### デザインインスピレーション
- [Dribbble](https://dribbble.com/)
- [Material Design](https://material.io/design)

---

## 💡 まとめ

ReactでのCSS・スタイリングは、**コンポーネント単位**で考えることが重要です。

### 覚えておこう！
1. **sx prop**：Material-UIでの柔軟なスタイリング
2. **レスポンシブ**：画面サイズに応じた最適化
3. **アニメーション**：ユーザー体験の向上
4. **アクセシビリティ**：誰でも使いやすいデザイン

美しいUIは、ユーザーにとっての使いやすさと開発者にとっての保守性を両立できます。一歩ずつスキルアップしていきましょう！ 🎨

---

**次のステップ**: [TypeScript学習ガイド](./TypeScript-Learning-Guide.md)

---

**質問や疑問があれば、いつでも開発チームにお聞きください！**