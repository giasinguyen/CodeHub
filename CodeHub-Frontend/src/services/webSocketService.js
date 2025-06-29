import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { API_BASE_URL, STORAGE_KEYS } from '../constants';

class WebSocketService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.subscriptions = new Map();
    this.messageHandlers = new Map();
    this.connectionPromise = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
  }

  // Connect to WebSocket
  connect() {
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      try {
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        
        if (!token) {
          console.warn('🔌 [WebSocket] No auth token found');
          reject(new Error('No authentication token'));
          return;
        }

        // Create STOMP client with SockJS
        this.client = new Client({
          webSocketFactory: () => {
            // Remove /api from the URL for WebSocket connection
            const baseUrl = API_BASE_URL.replace('/api', '');
            const wsUrl = baseUrl + '/ws';
            console.log('🔌 [WebSocket] Connecting to:', wsUrl);
            return new SockJS(wsUrl);
          },
          
          connectHeaders: {
            Authorization: `Bearer ${token}`
          },

          debug: (str) => {
            console.log('🔌 [WebSocket Debug]', str);
          },

          onConnect: (frame) => {
            console.log('✅ [WebSocket] Connected successfully', frame);
            this.connected = true;
            this.reconnectAttempts = 0;
            this.connectionPromise = null;
            resolve(frame);
          },

          onStompError: (frame) => {
            console.error('❌ [WebSocket] STOMP Error:', frame);
            this.connected = false;
            this.connectionPromise = null;
            reject(new Error(frame.body || 'STOMP Error'));
          },

          onWebSocketError: (error) => {
            console.error('❌ [WebSocket] WebSocket Error:', error);
            this.connected = false;
            this.connectionPromise = null;
            reject(error);
          },

          onDisconnect: (frame) => {
            console.log('🔌 [WebSocket] Disconnected', frame);
            this.connected = false;
            this.connectionPromise = null;
            
            // Auto-reconnect if not manually disconnected
            if (this.reconnectAttempts < this.maxReconnectAttempts) {
              this.scheduleReconnect();
            }
          },

          // Heartbeat configuration
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,

          // Reconnection configuration
          reconnectDelay: this.reconnectDelay
        });

        // Activate the client
        this.client.activate();
        
      } catch (error) {
        console.error('❌ [WebSocket] Connection error:', error);
        this.connectionPromise = null;
        reject(error);
      }
    });

    return this.connectionPromise;
  }

  // Schedule reconnection
  scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.warn('🔌 [WebSocket] Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`🔌 [WebSocket] Scheduling reconnection attempt ${this.reconnectAttempts} in ${delay}ms`);
    
    setTimeout(() => {
      console.log(`🔌 [WebSocket] Reconnection attempt ${this.reconnectAttempts}`);
      this.connect().catch(error => {
        console.error('❌ [WebSocket] Reconnection failed:', error);
      });
    }, delay);
  }

  // Disconnect from WebSocket
  disconnect() {
    if (this.client && this.connected) {
      console.log('🔌 [WebSocket] Disconnecting...');
      
      // Clear all subscriptions
      this.subscriptions.forEach((subscription) => {
        subscription.unsubscribe();
      });
      this.subscriptions.clear();
      this.messageHandlers.clear();
      
      // Deactivate client
      this.client.deactivate();
      this.client = null;
      this.connected = false;
      this.connectionPromise = null;
      this.reconnectAttempts = this.maxReconnectAttempts; // Prevent auto-reconnect
    }
  }

  // Subscribe to a topic
  async subscribe(destination, callback, headers = {}) {
    if (!this.connected) {
      await this.connect();
    }

    if (!this.client || !this.connected) {
      throw new Error('WebSocket not connected');
    }

    console.log('📋 [WebSocket] Subscribing to:', destination);

    const subscription = this.client.subscribe(destination, (message) => {
      try {
        const body = JSON.parse(message.body);
        console.log('📨 [WebSocket] Message received:', { destination, body });
        callback(body);
      } catch (error) {
        console.error('❌ [WebSocket] Error parsing message:', error);
        callback(message.body);
      }
    }, headers);

    this.subscriptions.set(destination, subscription);
    return subscription;
  }

  // Unsubscribe from a topic
  unsubscribe(destination) {
    const subscription = this.subscriptions.get(destination);
    if (subscription) {
      console.log('🚫 [WebSocket] Unsubscribing from:', destination);
      subscription.unsubscribe();
      this.subscriptions.delete(destination);
    }
  }

  // Send message to server
  async sendMessage(destination, body = {}, headers = {}) {
    if (!this.connected) {
      await this.connect();
    }

    if (!this.client || !this.connected) {
      throw new Error('WebSocket not connected');
    }

    console.log('📤 [WebSocket] Sending message:', { destination, body });

    this.client.publish({
      destination,
      body: JSON.stringify(body),
      headers
    });
  }

  // Subscribe to chat room messages
  async subscribeToChatRoom(chatId, onMessage) {
    const destination = `/topic/chat/${chatId}`;
    return this.subscribe(destination, onMessage);
  }

  // Subscribe to typing notifications
  async subscribeToTyping(chatId, onTyping) {
    const destination = `/topic/chat/${chatId}/typing`;
    return this.subscribe(destination, onTyping);
  }

  // Subscribe to user's private messages
  async subscribeToUserMessages(onMessage) {
    const destination = '/user/queue/messages';
    return this.subscribe(destination, onMessage);
  }

  // Send chat message
  async sendChatMessage(messageData) {
    await this.sendMessage('/app/chat.sendMessage', messageData);
  }

  // Send typing notification
  async sendTypingNotification(chatId) {
    await this.sendMessage('/app/chat.typing', { chatId });
  }

  // Send stop typing notification
  async sendStopTypingNotification(chatId) {
    await this.sendMessage('/app/chat.stopTyping', { chatId });
  }

  // Mark messages as read
  async markAsRead(chatId) {
    await this.sendMessage('/app/chat.markAsRead', { chatId });
  }

  // Get connection status
  isConnected() {
    return this.connected && this.client && this.client.connected;
  }

  // Get client state
  getState() {
    return {
      connected: this.connected,
      reconnectAttempts: this.reconnectAttempts,
      subscriptions: Array.from(this.subscriptions.keys())
    };
  }
}

// Create singleton instance
const webSocketService = new WebSocketService();

export default webSocketService;
