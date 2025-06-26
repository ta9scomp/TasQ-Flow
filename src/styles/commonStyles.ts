// 共通スタイル定義
import { styled } from '@mui/material/styles';
import { Box, Paper, Button } from '@mui/material';

// レスポンシブ対応のメインコンテナ
export const ResponsiveContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '1200px',
  margin: '0 auto',
  padding: theme.spacing(2),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(3),
  },
  [theme.breakpoints.up('lg')]: {
    padding: theme.spacing(4),
  },
}));

// カード風のコンテナ
export const StyledCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(1.5),
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  transition: 'box-shadow 0.3s ease',
  '&:hover': {
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
  },
}));

// セクションヘッダー
export const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(3),
  padding: theme.spacing(1, 0),
  borderBottom: `1px solid ${theme.palette.divider}`,
  
  '& h1, & h2, & h3, & h4, & h5, & h6': {
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
}));

// プライマリアクションボタン
export const PrimaryActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1.5, 3),
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  
  '&:hover': {
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
    transform: 'translateY(-1px)',
  },
  
  '&:active': {
    transform: 'translateY(0)',
  },
}));

// セカンダリアクションボタン
export const SecondaryActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1, 2),
  fontWeight: 500,
  textTransform: 'none',
  border: `1px solid ${theme.palette.divider}`,
  
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

// ステータス表示用のチップ
export const StatusChip = styled(Box)<{ status: 'success' | 'warning' | 'error' | 'info' }>(
  ({ theme, status }) => {
    const colors = {
      success: {
        bg: theme.palette.success.light,
        text: theme.palette.success.dark,
      },
      warning: {
        bg: theme.palette.warning.light,
        text: theme.palette.warning.dark,
      },
      error: {
        bg: theme.palette.error.light,
        text: theme.palette.error.dark,
      },
      info: {
        bg: theme.palette.primary.light,
        text: theme.palette.primary.dark,
      },
    };
    
    return {
      display: 'inline-flex',
      alignItems: 'center',
      padding: theme.spacing(0.5, 1.5),
      borderRadius: theme.spacing(2),
      fontSize: '0.75rem',
      fontWeight: 500,
      backgroundColor: colors[status].bg,
      color: colors[status].text,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    };
  }
);

// グリッドレイアウト用のコンテナ
export const GridContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(3),
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
  },
  
  [theme.breakpoints.up('lg')]: {
    gap: theme.spacing(4),
  },
}));

// フレックスレイアウト用のコンテナ
export const FlexContainer = styled(Box)<{ 
  direction?: 'row' | 'column';
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  wrap?: boolean;
  gap?: number;
}>(({ theme, direction = 'row', justify = 'flex-start', align = 'center', wrap = false, gap = 2 }) => ({
  display: 'flex',
  flexDirection: direction,
  justifyContent: justify,
  alignItems: align,
  flexWrap: wrap ? 'wrap' : 'nowrap',
  gap: theme.spacing(gap),
}));

// スクロール可能なコンテナ
export const ScrollableContainer = styled(Box)<{ maxHeight?: string | number }>(
  ({ theme, maxHeight = '400px' }) => ({
    maxHeight,
    overflowY: 'auto',
    padding: theme.spacing(1),
    
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    
    '&::-webkit-scrollbar-track': {
      background: theme.palette.grey[100],
      borderRadius: '4px',
    },
    
    '&::-webkit-scrollbar-thumb': {
      background: theme.palette.grey[400],
      borderRadius: '4px',
      
      '&:hover': {
        background: theme.palette.grey[500],
      },
    },
  })
);

// アイコン付きのテキスト
export const IconText = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  
  '& svg': {
    fontSize: '1.25rem',
    color: theme.palette.text.secondary,
  },
}));

// バッジ付きのアイテム
export const BadgedItem = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'inline-flex',
  
  '& .badge': {
    position: 'absolute',
    top: -theme.spacing(1),
    right: -theme.spacing(1),
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    borderRadius: '50%',
    minWidth: theme.spacing(2.5),
    height: theme.spacing(2.5),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: 600,
  },
}));

// ローディング状態のオーバーレイ
export const LoadingOverlay = styled(Box)<{ loading?: boolean }>(({ loading = false }) => ({
  position: 'relative',
  
  ...(loading && {
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999,
    },
  }),
}));

// アニメーション付きのフェードイン
export const FadeInContainer = styled(Box)(() => ({
  animation: 'fadeIn 0.3s ease-in',
  
  '@keyframes fadeIn': {
    from: {
      opacity: 0,
      transform: 'translateY(20px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
}));

// 共通のスペーシング
export const spacingVariants = {
  xs: 1,
  sm: 2,
  md: 3,
  lg: 4,
  xl: 5,
} as const;

// 共通のブレークポイント
export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
} as const;

// 共通のz-index値
export const zIndexLevels = {
  drawer: 1200,
  appBar: 1100,
  modal: 1300,
  snackbar: 1400,
  tooltip: 1500,
} as const;