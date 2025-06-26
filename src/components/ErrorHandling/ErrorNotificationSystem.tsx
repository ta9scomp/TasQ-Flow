import React, { useState, useEffect } from 'react';
import {
  Snackbar,
  Alert,
  AlertTitle,
  IconButton,
  Box,
  Slide,
  Portal,
  Fade,
  Typography,
  Button,
  Chip,
} from '@mui/material';
import {
  Close as CloseIcon,
  Refresh as RetryIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
} from '@mui/icons-material';
import type { TransitionProps } from '@mui/material/transitions';
import { 
  errorNotificationManager, 
  type ErrorNotification, 
  type AppError 
} from '../../utils/errorHandling';

// スライドトランジション
function SlideTransition(props: TransitionProps & { children: React.ReactElement }) {
  return <Slide {...props} direction="left" />;
}

interface ErrorAlertProps {
  notification: ErrorNotification;
  onClose: (id: string) => void;
  onRetry?: (error: AppError) => void;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ notification, onClose, onRetry }) => {
  const [showDetails, setShowDetails] = useState(false);
  const { error } = notification;

  const getSeverity = (errorType: AppError['type']): 'error' | 'warning' | 'info' => {
    switch (errorType) {
      case 'permission':
      case 'validation':
        return 'warning';
      case 'performance':
        return 'info';
      default:
        return 'error';
    }
  };

  const getIcon = (errorType: AppError['type']): string => {
    switch (errorType) {
      case 'network': return '🌐';
      case 'validation': return '📝';
      case 'permission': return '🔒';
      case 'data': return '📊';
      case 'performance': return '⚡';
      default: return '❗';
    }
  };

  return (
    <Alert
      severity={getSeverity(error.type)}
      action={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {error.retryable && onRetry && (
            <IconButton
              color="inherit"
              size="small"
              onClick={() => onRetry(error)}
              aria-label="retry"
            >
              <RetryIcon fontSize="small" />
            </IconButton>
          )}
          <IconButton
            color="inherit"
            size="small"
            onClick={() => onClose(notification.id)}
            aria-label="close"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      }
      sx={{ mb: 1 }}
    >
      <AlertTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <span>{getIcon(error.type)}</span>
        {error.type.toUpperCase()} ERROR
        <Chip 
          label={error.code} 
          size="small" 
          variant="outlined" 
          sx={{ ml: 1 }}
        />
      </AlertTitle>
      
      <Typography variant="body2" sx={{ mb: 1 }}>
        {error.userMessage}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button
          size="small"
          startIcon={showDetails ? <CollapseIcon /> : <ExpandIcon />}
          onClick={() => setShowDetails(!showDetails)}
        >
          詳細
        </Button>
        
        <Typography variant="caption" color="text.secondary">
          {error.timestamp.toLocaleTimeString()}
        </Typography>
      </Box>

      {showDetails && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            技術的な詳細:
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
            {error.message}
          </Typography>
          
          {notification.context && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                コンテキスト:
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                {JSON.stringify(notification.context, null, 2)}
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Alert>
  );
};

interface ErrorNotificationSystemProps {
  maxNotifications?: number;
  autoHideDuration?: number;
  position?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
  onRetry?: (error: AppError) => void;
}

export const ErrorNotificationSystem: React.FC<ErrorNotificationSystemProps> = ({
  maxNotifications = 3,
  position = { vertical: 'top', horizontal: 'right' },
  onRetry,
}) => {
  const [notifications, setNotifications] = useState<ErrorNotification[]>([]);
  const [openSnackbars, setOpenSnackbars] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleNotifications = (newNotifications: ErrorNotification[]) => {
      setNotifications(newNotifications.slice(-maxNotifications));
      
      // 新しい通知のSnackbarを開く
      newNotifications.slice(-maxNotifications).forEach(notification => {
        if (!openSnackbars.has(notification.id)) {
          setOpenSnackbars(prev => new Set([...prev, notification.id]));
        }
      });
    };

    errorNotificationManager.addListener(handleNotifications);

    return () => {
      errorNotificationManager.removeListener(handleNotifications);
    };
  }, [maxNotifications, openSnackbars]);

  const handleClose = (id: string) => {
    setOpenSnackbars(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
    
    // 少し遅れて通知を削除
    setTimeout(() => {
      errorNotificationManager.removeNotification(id);
    }, 300);
  };

  const handleRetry = (error: AppError) => {
    if (onRetry) {
      onRetry(error);
    } else {
      // デフォルトの再試行動作（ページリロード）
      window.location.reload();
    }
  };

  return (
    <Portal>
      <Box
        sx={{
          position: 'fixed',
          top: position.vertical === 'top' ? 24 : 'auto',
          bottom: position.vertical === 'bottom' ? 24 : 'auto',
          left: position.horizontal === 'left' ? 24 : 'auto',
          right: position.horizontal === 'right' ? 24 : 'auto',
          zIndex: 1400,
          maxWidth: 400,
          width: '100%',
        }}
      >
        {notifications.map((notification) => (
          <Fade
            key={notification.id}
            in={openSnackbars.has(notification.id)}
            timeout={300}
          >
            <Box>
              <ErrorAlert
                notification={notification}
                onClose={handleClose}
                onRetry={handleRetry}
              />
            </Box>
          </Fade>
        ))}
      </Box>
    </Portal>
  );
};

// Toast通知用のシンプルなSnackbar
interface ToastNotificationProps {
  message: string;
  severity?: 'success' | 'error' | 'warning' | 'info';
  open: boolean;
  onClose: () => void;
  autoHideDuration?: number;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({
  message,
  severity = 'info',
  open,
  onClose,
  autoHideDuration = 4000,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      TransitionComponent={SlideTransition}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

// エラー統計表示コンポーネント
export const ErrorStatistics: React.FC = () => {
  const [errorLogs, setErrorLogs] = useState<unknown[]>([]);

  useEffect(() => {
    const logs = errorNotificationManager.getNotifications();
    setErrorLogs(logs);
  }, []);

  const errorsByType = errorLogs.reduce((acc, log) => {
    const errorLog = log as ErrorNotification;
    const type = errorLog.error?.type || 'unknown';
    const typedAcc = acc as Record<string, number>;
    typedAcc[type] = (typedAcc[type] || 0) + 1;
    return typedAcc;
  }, {} as Record<string, number>);

  const totalErrors = errorLogs.length;
  const last24Hours = errorLogs.filter(log => {
    const errorLog = log as ErrorNotification;
    const logTime = new Date(errorLog.timestamp).getTime();
    const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
    return logTime > dayAgo;
  }).length;

  return (
    <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        📊 エラー統計
      </Typography>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 1, mb: 2 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" color="error.main">
            {totalErrors}
          </Typography>
          <Typography variant="caption">
            総エラー数
          </Typography>
        </Box>
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" color="warning.main">
            {last24Hours}
          </Typography>
          <Typography variant="caption">
            過去24時間
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          エラータイプ別:
        </Typography>
        {Object.entries(errorsByType as Record<string, number>).map(([type, count]) => (
          <Box key={type} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2">{type}:</Typography>
            <Typography variant="body2" fontWeight="bold">{String(count)}</Typography>
          </Box>
        ))}
      </Box>

      <Button
        size="small"
        onClick={() => {
          errorNotificationManager.clearAllNotifications();
          setErrorLogs([]);
        }}
      >
        ログクリア
      </Button>
    </Box>
  );
};