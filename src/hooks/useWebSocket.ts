import { useEffect, useRef, useState, useCallback } from 'react';

export interface WebSocketMessage {
  type: 'task_update' | 'task_create' | 'task_delete' | 'project_update' | 'member_join' | 'member_leave' | 'conflict_detected' | 'heartbeat';
  payload: any;
  timestamp: number;
  userId: string;
  projectId?: string;
  teamId?: string;
}

interface UseWebSocketOptions {
  url: string;
  protocols?: string | string[];
  onMessage?: (message: WebSocketMessage) => void;
  onError?: (error: Event) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  reconnectAttempts?: number;
  reconnectInterval?: number;
}

interface WebSocketState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  lastMessage: WebSocketMessage | null;
  connectionId: string | null;
}

export const useWebSocket = (options: UseWebSocketOptions) => {
  const {
    url,
    protocols,
    onMessage,
    onError,
    onConnect,
    onDisconnect,
    reconnectAttempts = 5,
    reconnectInterval = 3000,
  } = options;

  const [state, setState] = useState<WebSocketState>({
    isConnected: false,
    isConnecting: false,
    error: null,
    lastMessage: null,
    connectionId: null,
  });

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectCountRef = useRef(0);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const heartbeatIntervalRef = useRef<number | null>(null);

  // メッセージ送信
  const sendMessage = useCallback((message: Partial<WebSocketMessage>) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const fullMessage: WebSocketMessage = {
        type: message.type || 'heartbeat',
        payload: message.payload || {},
        timestamp: Date.now(),
        userId: message.userId || 'anonymous',
        projectId: message.projectId,
        teamId: message.teamId,
      };
      
      wsRef.current.send(JSON.stringify(fullMessage));
      return true;
    }
    return false;
  }, []);

  // ハートビート送信
  const sendHeartbeat = useCallback(() => {
    sendMessage({
      type: 'heartbeat',
      payload: { status: 'alive' },
      userId: 'current_user', // TODO: 実際のユーザーIDを取得
    });
  }, [sendMessage]);

  // WebSocket接続
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      wsRef.current = new WebSocket(url, protocols);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        setState(prev => ({
          ...prev,
          isConnected: true,
          isConnecting: false,
          error: null,
        }));
        
        reconnectCountRef.current = 0;
        onConnect?.();

        // ハートビート開始
        heartbeatIntervalRef.current = setInterval(sendHeartbeat, 30000);
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          setState(prev => ({ ...prev, lastMessage: message }));
          onMessage?.(message);
        } catch (error) {
          console.error('WebSocket message parse error:', error);
        }
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket disconnected');
        setState(prev => ({
          ...prev,
          isConnected: false,
          isConnecting: false,
        }));

        if (heartbeatIntervalRef.current) {
          clearInterval(heartbeatIntervalRef.current);
          heartbeatIntervalRef.current = null;
        }

        onDisconnect?.();

        // 自動再接続
        if (reconnectCountRef.current < reconnectAttempts) {
          reconnectCountRef.current++;
          console.log(`Reconnecting... (${reconnectCountRef.current}/${reconnectAttempts})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setState(prev => ({
          ...prev,
          error: 'WebSocket connection error',
          isConnecting: false,
        }));
        onError?.(error);
      };

    } catch (error) {
      console.error('WebSocket connection failed:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to establish WebSocket connection',
        isConnecting: false,
      }));
    }
  }, [url, protocols, onMessage, onError, onConnect, onDisconnect, reconnectAttempts, reconnectInterval, sendHeartbeat]);

  // WebSocket切断
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setState(prev => ({
      ...prev,
      isConnected: false,
      isConnecting: false,
    }));
  }, []);

  // クリーンアップ
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    ...state,
    connect,
    disconnect,
    sendMessage,
    reconnect: () => {
      disconnect();
      setTimeout(connect, 1000);
    },
  };
};