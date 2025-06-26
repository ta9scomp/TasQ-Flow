import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  Collapse,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import {
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
  Home as HomeIcon,
  BugReport as BugIcon,
} from '@mui/icons-material';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
  retryCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🚨 ErrorBoundary caught an error:', error);
    console.error('📋 Error Info:', errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // エラー情報をローカルストレージに保存
    this.saveErrorToStorage(error, errorInfo);

    // カスタムエラーハンドラが提供されている場合は実行
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  saveErrorToStorage(error: Error, errorInfo: ErrorInfo) {
    try {
      const errorLog = {
        timestamp: new Date().toISOString(),
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
        errorInfo: {
          componentStack: errorInfo.componentStack,
        },
        userAgent: navigator.userAgent,
        url: window.location.href,
        retryCount: this.state.retryCount,
      };

      const existingLogs = JSON.parse(localStorage.getItem('errorLogs') || '[]');
      existingLogs.push(errorLog);
      
      // 最新の10件のみ保持
      if (existingLogs.length > 10) {
        existingLogs.splice(0, existingLogs.length - 10);
      }
      
      localStorage.setItem('errorLogs', JSON.stringify(existingLogs));
    } catch (storageError) {
      console.error('Failed to save error to storage:', storageError);
    }
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      retryCount: prevState.retryCount + 1,
    }));
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  toggleDetails = () => {
    this.setState(prevState => ({
      showDetails: !prevState.showDetails,
    }));
  };

  render() {
    if (this.state.hasError) {
      // カスタムフォールバックが提供されている場合はそれを使用
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error, errorInfo, showDetails, retryCount } = this.state;

      return (
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.default',
            p: 3,
          }}
        >
          <Card sx={{ maxWidth: 600, width: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <ErrorIcon color="error" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h5" color="error" sx={{ fontWeight: 'bold' }}>
                    😕 申し訳ございません
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    予期しないエラーが発生しました
                  </Typography>
                </Box>
              </Box>

              <Alert severity="error" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  {error?.message || 'アプリケーションでエラーが発生しました。'}
                </Typography>
              </Alert>

              {retryCount > 0 && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                  <Typography variant="body2">
                    再試行回数: {retryCount}回
                    {retryCount >= 3 && ' - 問題が継続する場合はページをリロードしてください。'}
                  </Typography>
                </Alert>
              )}

              <Box sx={{ mb: 3 }}>
                <Button
                  variant="text"
                  startIcon={showDetails ? <CollapseIcon /> : <ExpandIcon />}
                  onClick={this.toggleDetails}
                  size="small"
                >
                  技術的な詳細を{showDetails ? '非表示' : '表示'}
                </Button>
                
                <Collapse in={showDetails}>
                  <Paper sx={{ p: 2, mt: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                      <BugIcon sx={{ mr: 1, fontSize: 16 }} />
                      エラー詳細
                    </Typography>
                    
                    {error && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          エラー名:
                        </Typography>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                          {error.name}
                        </Typography>
                        
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                          メッセージ:
                        </Typography>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                          {error.message}
                        </Typography>
                      </Box>
                    )}

                    {error?.stack && (
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          スタックトレース:
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontFamily: 'monospace', 
                            fontSize: '0.75rem',
                            wordBreak: 'break-all',
                            maxHeight: 200,
                            overflow: 'auto',
                            bgcolor: 'background.paper',
                            p: 1,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                          }}
                        >
                          {error.stack}
                        </Typography>
                      </Box>
                    )}

                    {errorInfo?.componentStack && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          コンポーネントスタック:
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontFamily: 'monospace', 
                            fontSize: '0.75rem',
                            wordBreak: 'break-all',
                            maxHeight: 150,
                            overflow: 'auto',
                            bgcolor: 'background.paper',
                            p: 1,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                          }}
                        >
                          {errorInfo.componentStack}
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                </Collapse>
              </Box>
            </CardContent>

            <CardActions sx={{ justifyContent: 'space-between', px: 3, pb: 3 }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<RefreshIcon />}
                  onClick={this.handleRetry}
                  color="primary"
                >
                  再試行
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<HomeIcon />}
                  onClick={this.handleGoHome}
                >
                  ホームに戻る
                </Button>
              </Box>

              <Button
                variant="text"
                onClick={this.handleReload}
                size="small"
                color="secondary"
              >
                ページをリロード
              </Button>
            </CardActions>
          </Card>
        </Box>
      );
    }

    return this.props.children;
  }
}

// エラーログ取得ユーティリティ
export const getErrorLogs = (): unknown[] => {
  try {
    return JSON.parse(localStorage.getItem('errorLogs') || '[]');
  } catch {
    return [];
  }
};

// エラーログクリアユーティリティ
export const clearErrorLogs = (): void => {
  try {
    localStorage.removeItem('errorLogs');
  } catch (error) {
    console.error('Failed to clear error logs:', error);
  }
};

// エラーレポート生成ユーティリティ
export const generateErrorReport = (): string => {
  const logs = getErrorLogs();
  const report = {
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    errorCount: logs.length,
    errors: logs,
  };
  
  return JSON.stringify(report, null, 2);
};