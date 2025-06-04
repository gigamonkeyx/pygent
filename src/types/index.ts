// Core AI System Types
export interface ChatMessage {
  id: string;
  type: 'user' | 'agent' | 'system' | 'reasoning' | 'evolution';
  content: string | ReasoningContent | EvolutionContent;
  agentId?: string;
  timestamp: Date;
  metadata?: MessageMetadata;
}

export interface MessageMetadata {
  reasoning_mode?: ReasoningMode;
  confidence_score?: number;
  processing_time?: number;
  thought_path?: ThoughtNode[];
  documents_retrieved?: number;
  gpu_utilization?: number;
}

export interface ReasoningContent {
  query: string;
  response: string;
  reasoning_path: ThoughtNode[];
  documents_retrieved?: number;
  confidence_score: number;
  task_complexity: TaskComplexity;
  total_time: number;
}

export interface EvolutionContent {
  generation: number;
  fitness_score: number;
  recipe_changes: string[];
  performance_metrics: EvolutionMetrics;
  population_size: number;
  convergence_status: string;
}

// Reasoning System Types
export enum ReasoningMode {
  TOT_ONLY = 'tot_only',
  RAG_ONLY = 'rag_only',
  S3_RAG = 's3_rag',
  TOT_ENHANCED_RAG = 'tot_enhanced_rag',
  ADAPTIVE = 'adaptive'
}

export enum TaskComplexity {
  SIMPLE = 'simple',
  MODERATE = 'moderate',
  COMPLEX = 'complex',
  RESEARCH = 'research'
}

export interface ThoughtNode {
  id: string;
  content: string;
  depth: number;
  parent_id?: string;
  children: string[];
  value_score: number;
  confidence: number;
  reasoning_step: string;
  timestamp: Date;
}

export interface ReasoningState {
  isActive: boolean;
  currentNode?: ThoughtNode;
  thoughts: ThoughtNode[];
  processingTime: number;
  confidence: number;
  pathsExplored: number;
  mode: ReasoningMode;
  complexity: TaskComplexity;
}

// Evolution System Types
export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: Record<string, number>;
  steps: string[];
  fitness_score: number;
  generation: number;
  parent_ids?: string[];
  metadata: RecipeMetadata;
}

export interface RecipeMetadata {
  prep_time: number;
  cook_time: number;
  difficulty: string;
  yield: number;
  tags: string[];
  nutritional_info?: NutritionalInfo;
}

export interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface EvolutionMetrics {
  average_fitness: number;
  best_fitness: number;
  diversity_score: number;
  convergence_rate: number;
  mutation_rate: number;
  crossover_rate: number;
}

export interface EvolutionState {
  isRunning: boolean;
  currentGeneration: number;
  maxGenerations: number;
  populationSize: number;
  bestRecipes: Recipe[];
  fitnessHistory: FitnessData[];
  convergenceMetrics: ConvergenceData;
  elapsedTime: number;
}

export interface FitnessData {
  generation: number;
  average: number;
  best: number;
  worst: number;
  diversity: number;
  timestamp: Date;
}

export interface ConvergenceData {
  rate: number;
  plateau_generations: number;
  improvement_threshold: number;
  is_converged: boolean;
}

// Vector Search Types
export interface SearchMetrics {
  queriesPerSecond: number;
  averageLatency: number;
  accuracy: number;
  indexSize: number;
  memoryUsage: number;
  gpuUtilization: number;
}

export interface IndexStatus {
  name: string;
  type: string;
  dimension: number;
  vectorCount: number;
  isOptimized: boolean;
  lastUpdated: Date;
  buildTime: number;
}

export interface SearchResult {
  id: string;
  content: string;
  similarity: number;
  metadata: Record<string, any>;
  source: string;
}

// System Monitoring Types
export interface SystemMetrics {
  timestamp: Date;
  cpu: CPUMetrics;
  memory: MemoryMetrics;
  gpu: GPUMetrics;
  network: NetworkMetrics;
  ai_components: AIComponentMetrics;
}

export interface CPUMetrics {
  usage_percent: number;
  cores: number;
  frequency: number;
  temperature?: number;
}

export interface MemoryMetrics {
  total_gb: number;
  used_gb: number;
  available_gb: number;
  usage_percent: number;
}

export interface GPUMetrics {
  name: string;
  usage_percent: number;
  memory_total_gb: number;
  memory_used_gb: number;
  memory_free_gb: number;
  temperature: number;
  power_usage: number;
  fan_speed?: number;
}

export interface NetworkMetrics {
  bytes_sent: number;
  bytes_received: number;
  packets_sent: number;
  packets_received: number;
  connections: number;
}

export interface AIComponentMetrics {
  reasoning_requests: number;
  evolution_requests: number;
  search_requests: number;
  average_response_time: number;
  success_rate: number;
  error_count: number;
}

// MCP Server Types
export interface MCPServer {
  id: string;
  name: string;
  type: MCPServerType;
  status: MCPServerStatus;
  version: string;
  description: string;
  capabilities: string[];
  health: MCPServerHealth;
  config: MCPServerConfig;
  stats: MCPServerStats;
}

export enum MCPServerType {
  FILESYSTEM = 'filesystem',
  DATABASE = 'database',
  WEB = 'web',
  NLP = 'nlp',
  GRAPHICS = 'graphics',
  ANALYTICS = 'analytics',
  CUSTOM = 'custom'
}

export enum MCPServerStatus {
  RUNNING = 'running',
  STOPPED = 'stopped',
  ERROR = 'error',
  STARTING = 'starting',
  STOPPING = 'stopping'
}

export interface MCPServerHealth {
  status: 'healthy' | 'unhealthy' | 'unknown';
  last_check: Date;
  response_time: number;
  error_message?: string;
  uptime: number;
}

export interface MCPServerConfig {
  command: string[];
  environment: Record<string, string>;
  working_directory?: string;
  auto_restart: boolean;
  max_restarts: number;
  timeout: number;
}

export interface MCPServerStats {
  requests_total: number;
  requests_success: number;
  requests_error: number;
  average_response_time: number;
  last_request: Date;
  memory_usage: number;
}

// UI State Types
export interface UIState {
  sidebarOpen: boolean;
  activeView: ViewType;
  theme: 'light' | 'dark' | 'system';
  notifications: Notification[];
  loading: LoadingState;
}

export enum ViewType {
  CHAT = 'chat',
  REASONING = 'reasoning',
  EVOLUTION = 'evolution',
  SEARCH = 'search',
  RESEARCH_ANALYSIS = 'research_analysis',
  MONITORING = 'monitoring',
  MCP_MARKETPLACE = 'mcp_marketplace',
  OLLAMA = 'ollama',
  SETTINGS = 'settings'
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
  variant?: 'default' | 'destructive';
}

export interface LoadingState {
  global: boolean;
  chat: boolean;
  reasoning: boolean;
  evolution: boolean;
  search: boolean;
  mcp: boolean;
  ollama: boolean;
}

// Authentication Types
export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
  preferences: UserPreferences;
  created_at: Date;
  last_login: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  DEVELOPER = 'developer',
  USER = 'user',
  GUEST = 'guest'
}

export enum Permission {
  CHAT_ACCESS = 'chat_access',
  REASONING_CONTROL = 'reasoning_control',
  EVOLUTION_CONTROL = 'evolution_control',
  SEARCH_MANAGEMENT = 'search_management',
  MCP_MANAGEMENT = 'mcp_management',
  OLLAMA_MANAGEMENT = 'ollama_management',
  SYSTEM_MONITORING = 'system_monitoring',
  USER_MANAGEMENT = 'user_management',
  SETTINGS_MANAGEMENT = 'settings_management'
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  notifications: NotificationPreferences;
  dashboard: DashboardPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  system_alerts: boolean;
  ai_updates: boolean;
  mcp_events: boolean;
}

export interface DashboardPreferences {
  default_view: ViewType;
  sidebar_collapsed: boolean;
  auto_refresh: boolean;
  refresh_interval: number;
  chart_animations: boolean;
}

// API Response Types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// WebSocket Event Types
export interface WebSocketEvent {
  type: string;
  data: any;
  timestamp: Date;
  source?: string;
}

export interface ChatEvent extends WebSocketEvent {
  type: 'chat_message' | 'chat_response' | 'typing_start' | 'typing_stop';
  data: {
    message?: ChatMessage;
    user_id?: string;
    conversation_id?: string;
  };
}

export interface ReasoningEvent extends WebSocketEvent {
  type: 'reasoning_start' | 'reasoning_update' | 'reasoning_complete' | 'reasoning_error';
  data: {
    state?: ReasoningState;
    thought?: ThoughtNode;
    error?: string;
  };
}

export interface EvolutionEvent extends WebSocketEvent {
  type: 'evolution_start' | 'evolution_progress' | 'evolution_complete' | 'evolution_stop';
  data: {
    state?: EvolutionState;
    generation?: number;
    fitness?: FitnessData;
  };
}

export interface SystemEvent extends WebSocketEvent {
  type: 'system_metrics' | 'system_alert' | 'component_status';
  data: {
    metrics?: SystemMetrics;
    alert?: SystemAlert;
    component?: string;
    status?: string;
  };
}

export interface SystemAlert {
  id: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  component: string;
  message: string;
  timestamp: Date;
  resolved: boolean;
  metadata?: Record<string, any>;
}

// Ollama Types
export interface OllamaModel {
  name: string;
  size: number;
  digest: string;
  modified_at: string;
  details?: {
    format: string;
    family: string;
    families: string[];
    parameter_size: string;
    quantization_level: string;
  };
}

export interface OllamaServiceStatus {
  is_ready: boolean;
  url: string;
  available_models: string[];
  process_running: boolean;
  executable_path: string | null;
}

export interface OllamaMetrics {
  total_models: number;
  total_size: number;
  memory_usage: number;
  gpu_utilization?: number;
  active_models: string[];
  last_updated: Date;
}

export interface OllamaEvent extends WebSocketEvent {
  type: 'ollama_status' | 'ollama_model_update' | 'ollama_metrics' | 'ollama_error';
  data: {
    status?: OllamaServiceStatus;
    models?: OllamaModel[];
    metrics?: OllamaMetrics;
    error?: string;
  };
}
