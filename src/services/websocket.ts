import {
  WebSocketEvent,
  ChatEvent,
  ReasoningEvent,
  EvolutionEvent,
  SystemEvent,
  ChatMessage,
  ReasoningState,
  EvolutionState,
  SystemMetrics
} from '@/types';

export type EventHandler<T = any> = (data: T) => void;

// WebSocket message format (matches backend)
interface WebSocketMessage {
  type: string;
  data: any;
}

class WebSocketService {
  private ws: WebSocket | null = null;
  private eventHandlers: Map<string, EventHandler[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnecting = false;
  private url = '';

  constructor() {
    this.setupEventHandlers();
  }

  connect(url: string = '/'): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        resolve(true);
        return;
      }

      if (this.isConnecting) {
        // Wait for current connection attempt
        const checkConnection = () => {
          if (this.ws?.readyState === WebSocket.OPEN) {
            resolve(true);
          } else if (!this.isConnecting) {
            reject(new Error('Connection failed'));
          } else {
            setTimeout(checkConnection, 100);
          }
        };
        checkConnection();
        return;
      }

      this.isConnecting = true;

      // Determine WebSocket URL
      let wsUrl: string;
      if (url.startsWith('ws')) {
        wsUrl = url;
      } else {
        // Use environment variable or construct from current location
        const envWsUrl = import.meta.env.VITE_WS_URL;
        if (envWsUrl) {
          wsUrl = envWsUrl;
        } else {
          // For development with Vite proxy, use relative path
          const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
          const host = window.location.host;
          wsUrl = `${protocol}//${host}/ws`;
        }
      }
      this.url = wsUrl;

      try {
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log('WebSocket connected to:', wsUrl);
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          this.emit('connection_status', { connected: true });

          // Send a ping to test the connection
          this.sendMessage('ping', { timestamp: new Date().toISOString() });

          resolve(true);
        };

        this.ws.onclose = (event) => {
          console.log('WebSocket disconnected:', event.reason || 'connection closed');
          this.isConnecting = false;
          this.emit('connection_status', { connected: false, reason: event.reason });

          // Auto-reconnect unless it was a clean close
          if (event.code !== 1000) {
            this.handleReconnect();
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error occurred:', error);
          this.isConnecting = false;
          // Don't emit connection_error as it might cause the error loop
          // this.emit('connection_error', { error: 'WebSocket connection failed' });

          setTimeout(() => {
            if (this.ws?.readyState !== WebSocket.OPEN) {
              reject(new Error('Backend not available - running in offline mode'));
            }
          }, 2000);
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
    this.eventHandlers.clear();
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      this.emit('connection_failed', { attempts: this.reconnectAttempts });
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms`);

    setTimeout(() => {
      if (!this.ws || this.ws.readyState === WebSocket.CLOSED) {
        this.connect(this.url);
      }
    }, delay);
  }

  private sendMessage(type: string, data: any): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn(`Cannot send message '${type}' - WebSocket not connected`);
      return;
    }

    const message: WebSocketMessage = { type, data };
    this.ws.send(JSON.stringify(message));
  }

  private handleMessage(message: WebSocketMessage): void {
    console.log('Received WebSocket message:', message);

    // Handle different message types
    switch (message.type) {
      case 'pong':
        // Handle ping response
        break;
      case 'chat_response':
        this.emit('chat_response', message.data);
        break;
      case 'typing_indicator':
        this.emit('typing_indicator', message.data);
        break;
      case 'reasoning_update':
        this.emit('reasoning_update', message.data);
        break;
      case 'reasoning_complete':
        this.emit('reasoning_complete', message.data);
        break;
      case 'evolution_progress':
        this.emit('evolution_progress', message.data);
        break;
      case 'evolution_complete':
        this.emit('evolution_complete', message.data);
        break;
      case 'system_metrics':
        this.emit('system_metrics', message.data);
        break;
      case 'system_alert':
        this.emit('system_alert', message.data);
        break;
      case 'mcp_server_status':
        this.emit('mcp_server_status', message.data);
        break;
      case 'mcp_server_health':
        this.emit('mcp_server_health', message.data);
        break;
      case 'ollama_status':
        this.emit('ollama_status', message.data);
        break;
      case 'ollama_model_update':
        this.emit('ollama_model_update', message.data);
        break;
      case 'ollama_metrics':
        this.emit('ollama_metrics', message.data);
        break;
      case 'ollama_error':
        this.emit('ollama_error', message.data);
        break;
      case 'error':
        console.error('Server error:', message.data);
        this.emit('connection_error', message.data);
        break;
      default:
        console.warn('Unknown message type:', message.type);
    }
  }



  private setupEventHandlers(): void {
    // Initialize event handler maps
    const eventTypes = [
      'connection_status',
      'connection_error',
      'connection_failed',
      'chat_response',
      'typing_indicator',
      'reasoning_update',
      'reasoning_complete',
      'evolution_progress',
      'evolution_complete',
      'system_metrics',
      'system_alert',
      'mcp_server_status',
      'mcp_server_health',
      'ollama_status',
      'ollama_model_update',
      'ollama_metrics',
      'ollama_error'
    ];

    eventTypes.forEach(eventType => {
      this.eventHandlers.set(eventType, []);
    });
  }

  // Event subscription methods
  on<T = any>(event: string, handler: EventHandler<T>): () => void {
    const handlers = this.eventHandlers.get(event) || [];
    handlers.push(handler);
    this.eventHandlers.set(event, handlers);

    // Return unsubscribe function
    return () => {
      const currentHandlers = this.eventHandlers.get(event) || [];
      const index = currentHandlers.indexOf(handler);
      if (index > -1) {
        currentHandlers.splice(index, 1);
        this.eventHandlers.set(event, currentHandlers);
      }
    };
  }

  off(event: string, handler?: EventHandler): void {
    if (!handler) {
      this.eventHandlers.set(event, []);
      return;
    }

    const handlers = this.eventHandlers.get(event) || [];
    const index = handlers.indexOf(handler);
    if (index > -1) {
      handlers.splice(index, 1);
      this.eventHandlers.set(event, handlers);
    }
  }

  private emit<T = any>(event: string, data: T): void {
    const handlers = this.eventHandlers.get(event) || [];
    handlers.forEach(handler => {
      try {
        handler(data);
      } catch (error) {
        console.error(`Error in event handler for ${event}:`, error);
        // Don't send error events to the server to prevent error loops
      }
    });
  }

  // Message sending methods
  sendChatMessage(message: ChatMessage): void {
    this.sendMessage('chat_message', {
      message,
      timestamp: new Date()
    });
  }

  startReasoning(config: {
    query: string;
    mode?: string;
    max_depth?: number;
    search_strategy?: string;
  }): void {
    this.sendMessage('start_reasoning', {
      ...config,
      timestamp: new Date()
    });
  }

  stopReasoning(): void {
    this.sendMessage('stop_reasoning', {
      timestamp: new Date()
    });
  }

  startEvolution(config: {
    recipe_id?: string;
    population_size?: number;
    max_generations?: number;
    mutation_rate?: number;
  }): void {
    this.sendMessage('start_evolution', {
      ...config,
      timestamp: new Date()
    });
  }

  stopEvolution(): void {
    this.sendMessage('stop_evolution', {
      timestamp: new Date()
    });
  }

  requestSystemMetrics(): void {
    this.sendMessage('request_system_metrics', {
      timestamp: new Date()
    });
  }

  manageMCPServer(action: 'start' | 'stop' | 'restart', serverId: string): void {
    this.sendMessage('mcp_server_action', {
      action,
      server_id: serverId,
      timestamp: new Date()
    });
  }

  // Utility methods
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  getConnectionState(): {
    connected: boolean;
    reconnectAttempts: number;
    isConnecting: boolean;
  } {
    return {
      connected: this.isConnected(),
      reconnectAttempts: this.reconnectAttempts,
      isConnecting: this.isConnecting
    };
  }
}

// Create singleton instance
export const websocketService = new WebSocketService();

// Export types for use in components
export type {
  EventHandler,
  ChatEvent,
  ReasoningEvent,
  EvolutionEvent,
  SystemEvent
};
