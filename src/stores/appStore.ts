import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { 
  ChatMessage, 
  ReasoningState, 
  EvolutionState, 
  SystemMetrics, 
  MCPServer, 
  UIState, 
  ViewType, 
  Notification,
  LoadingState,
  User,
  SearchMetrics,
  IndexStatus
} from '@/types';

interface AppState {
  // Authentication
  user: User | null;
  isAuthenticated: boolean;
  
  // Chat state
  conversations: Map<string, ChatMessage[]>;
  activeConversation: string;
  typingUsers: Set<string>;
  
  // AI component states
  reasoningState: ReasoningState;
  evolutionState: EvolutionState;
  searchMetrics: SearchMetrics | null;
  indexStatus: IndexStatus | null;
  
  // System state
  systemMetrics: SystemMetrics | null;
  mcpServers: MCPServer[];
  
  // UI state
  ui: UIState;
  
  // Actions
  setUser: (user: User | null) => void;
  setAuthenticated: (authenticated: boolean) => void;
  
  // Chat actions
  addMessage: (conversationId: string, message: ChatMessage) => void;
  updateMessage: (conversationId: string, messageId: string, updates: Partial<ChatMessage>) => void;
  setActiveConversation: (conversationId: string) => void;
  clearConversation: (conversationId: string) => void;
  setTypingUser: (userId: string, typing: boolean) => void;
  
  // Reasoning actions
  updateReasoningState: (state: Partial<ReasoningState>) => void;
  resetReasoningState: () => void;
  
  // Evolution actions
  updateEvolutionState: (state: Partial<EvolutionState>) => void;
  resetEvolutionState: () => void;
  
  // Search actions
  updateSearchMetrics: (metrics: SearchMetrics) => void;
  updateIndexStatus: (status: IndexStatus) => void;
  
  // System actions
  updateSystemMetrics: (metrics: SystemMetrics) => void;
  updateMCPServers: (servers: MCPServer[]) => void;
  updateMCPServer: (serverId: string, updates: Partial<MCPServer>) => void;
  
  // UI actions
  setActiveView: (view: ViewType) => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  markNotificationRead: (id: string) => void;
  setLoading: (component: keyof LoadingState, loading: boolean) => void;
}

const initialReasoningState: ReasoningState = {
  isActive: false,
  thoughts: [],
  processingTime: 0,
  confidence: 0,
  pathsExplored: 0,
  mode: 'adaptive' as any,
  complexity: 'moderate' as any
};

const initialEvolutionState: EvolutionState = {
  isRunning: false,
  currentGeneration: 0,
  maxGenerations: 100,
  populationSize: 20,
  bestRecipes: [],
  fitnessHistory: [],
  convergenceMetrics: {
    rate: 0,
    plateau_generations: 0,
    improvement_threshold: 0.01,
    is_converged: false
  },
  elapsedTime: 0
};

const initialUIState: UIState = {
  sidebarOpen: true,
  activeView: ViewType.CHAT,
  theme: 'system',
  notifications: [],
  loading: {
    global: false,
    chat: false,
    reasoning: false,
    evolution: false,
    search: false,
    mcp: false,
    ollama: false
  }
};

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        isAuthenticated: false,
        conversations: new Map([['default', []]]),
        activeConversation: 'default',
        typingUsers: new Set(),
        reasoningState: initialReasoningState,
        evolutionState: initialEvolutionState,
        searchMetrics: null,
        indexStatus: null,
        systemMetrics: null,
        mcpServers: [],
        ui: initialUIState,

        // Authentication actions
        setUser: (user) => set({ user }),
        setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

        // Chat actions
        addMessage: (conversationId, message) => {
          const conversations = new Map(get().conversations);
          const messages = conversations.get(conversationId) || [];
          conversations.set(conversationId, [...messages, message]);
          set({ conversations });
        },

        updateMessage: (conversationId, messageId, updates) => {
          const conversations = new Map(get().conversations);
          const messages = conversations.get(conversationId) || [];
          const updatedMessages = messages.map(msg => 
            msg.id === messageId ? { ...msg, ...updates } : msg
          );
          conversations.set(conversationId, updatedMessages);
          set({ conversations });
        },

        setActiveConversation: (activeConversation) => {
          const conversations = get().conversations;
          if (!conversations.has(activeConversation)) {
            conversations.set(activeConversation, []);
          }
          set({ activeConversation, conversations: new Map(conversations) });
        },

        clearConversation: (conversationId) => {
          const conversations = new Map(get().conversations);
          conversations.set(conversationId, []);
          set({ conversations });
        },

        setTypingUser: (userId, typing) => {
          const typingUsers = new Set(get().typingUsers);
          if (typing) {
            typingUsers.add(userId);
          } else {
            typingUsers.delete(userId);
          }
          set({ typingUsers });
        },

        // Reasoning actions
        updateReasoningState: (updates) => {
          const reasoningState = { ...get().reasoningState, ...updates };
          set({ reasoningState });
        },

        resetReasoningState: () => {
          set({ reasoningState: initialReasoningState });
        },

        // Evolution actions
        updateEvolutionState: (updates) => {
          const evolutionState = { ...get().evolutionState, ...updates };
          set({ evolutionState });
        },

        resetEvolutionState: () => {
          set({ evolutionState: initialEvolutionState });
        },

        // Search actions
        updateSearchMetrics: (searchMetrics) => set({ searchMetrics }),
        updateIndexStatus: (indexStatus) => set({ indexStatus }),

        // System actions
        updateSystemMetrics: (systemMetrics) => set({ systemMetrics }),

        updateMCPServers: (mcpServers) => set({ mcpServers }),

        updateMCPServer: (serverId, updates) => {
          const mcpServers = get().mcpServers.map(server =>
            server.id === serverId ? { ...server, ...updates } : server
          );
          set({ mcpServers });
        },

        // UI actions
        setActiveView: (activeView) => {
          const ui = { ...get().ui, activeView };
          set({ ui });
        },

        setSidebarOpen: (sidebarOpen) => {
          const ui = { ...get().ui, sidebarOpen };
          set({ ui });
        },

        setTheme: (theme) => {
          const ui = { ...get().ui, theme };
          set({ ui });
        },

        addNotification: (notification) => {
          const newNotification: Notification = {
            ...notification,
            id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date(),
            read: false
          };
          const ui = {
            ...get().ui,
            notifications: [...get().ui.notifications, newNotification]
          };
          set({ ui });
        },

        removeNotification: (id) => {
          const ui = {
            ...get().ui,
            notifications: get().ui.notifications.filter(n => n.id !== id)
          };
          set({ ui });
        },

        markNotificationRead: (id) => {
          const ui = {
            ...get().ui,
            notifications: get().ui.notifications.map(n =>
              n.id === id ? { ...n, read: true } : n
            )
          };
          set({ ui });
        },

        setLoading: (component, loading) => {
          const ui = {
            ...get().ui,
            loading: { ...get().ui.loading, [component]: loading }
          };
          set({ ui });
        }
      }),
      {
        name: 'pygent-factory-store',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          ui: {
            ...state.ui,
            notifications: [], // Don't persist notifications
            loading: initialUIState.loading // Reset loading state
          }
        })
      }
    ),
    {
      name: 'pygent-factory-store'
    }
  )
);

// Selectors for common state access patterns
export const useAuth = () => useAppStore(state => ({
  user: state.user,
  isAuthenticated: state.isAuthenticated,
  setUser: state.setUser,
  setAuthenticated: state.setAuthenticated
}));

export const useChat = () => useAppStore(state => ({
  conversations: state.conversations,
  activeConversation: state.activeConversation,
  typingUsers: state.typingUsers,
  addMessage: state.addMessage,
  updateMessage: state.updateMessage,
  setActiveConversation: state.setActiveConversation,
  clearConversation: state.clearConversation,
  setTypingUser: state.setTypingUser
}));

export const useReasoning = () => useAppStore(state => ({
  reasoningState: state.reasoningState,
  updateReasoningState: state.updateReasoningState,
  resetReasoningState: state.resetReasoningState
}));

export const useEvolution = () => useAppStore(state => ({
  evolutionState: state.evolutionState,
  updateEvolutionState: state.updateEvolutionState,
  resetEvolutionState: state.resetEvolutionState
}));

export const useSystem = () => useAppStore(state => ({
  systemMetrics: state.systemMetrics,
  mcpServers: state.mcpServers,
  updateSystemMetrics: state.updateSystemMetrics,
  updateMCPServers: state.updateMCPServers,
  updateMCPServer: state.updateMCPServer
}));

export const useUI = () => useAppStore(state => ({
  ui: state.ui,
  setActiveView: state.setActiveView,
  setSidebarOpen: state.setSidebarOpen,
  setTheme: state.setTheme,
  addNotification: state.addNotification,
  removeNotification: state.removeNotification,
  markNotificationRead: state.markNotificationRead,
  setLoading: state.setLoading
}));
