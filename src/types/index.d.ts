/**
 * 项目通用类型定义
 */

// 游戏相关类型
export interface Game {
  id: string
  name: string
  cover?: string
  category: string
  description?: string
  romPath: string
  playCount?: number
  author?: string
  version?: string
  region?: string
  size?: string
  releasedAt?: string
  [key: string]: any
}

export interface Category {
  id: string
  name: string
  description?: string
  cover?: string
  gamesUrl: string
}

// 模拟器相关类型
export interface EmulatorConfig {
  containerId: string
  romPath: string
  core?: string
  dataPath?: string
  gameName?: string
  language?: string
  startOnLoaded?: boolean
  volume?: number
  muted?: boolean
}

export interface EmulatorState {
  status: 'idle' | 'loading' | 'ready' | 'running' | 'paused' | 'error'
  isGameLoaded: boolean
  isLoading: boolean
  hasError: boolean
  errorMessage?: string
  loadingProgress: number
}

export interface EmulatorEvents {
  ready: () => void
  gameLoaded: () => void
  gameStarted: () => void
  paused: () => void
  resumed: () => void
  error: (error: string) => void
  loadingProgress: (progress: number) => void
  stateChanged: (change: StateChange) => void
}

export interface StateChange {
  from: string
  to: string
  timestamp: number
  metadata?: Record<string, any>
}

// 错误处理类型
export interface ErrorInfo {
  type: 'network' | 'validation' | 'emulator' | 'resource' | 'permission' | 'timeout' | 'unknown'
  severity: 'low' | 'medium' | 'high' | 'critical'
  code?: string
  message: string
  userMessage?: string
  details?: Record<string, any>
  timestamp: number
  stack?: string
  recoverable: boolean
}

// 资源管理类型
export interface ResourceInfo {
  url: string
  type: 'script' | 'rom' | 'data' | 'image' | 'style'
  size: number
  status: 'pending' | 'loading' | 'loaded' | 'error' | 'cached'
  loadTime: number
  errorCount: number
  lastAccessed: number
  metadata?: Record<string, any>
}

// 状态管理器类型
export interface StateManagerConfig {
  maxHistorySize?: number
}

// Vue相关类型扩展
export interface GameStore {
  // State
  allGames: Map<string, Game>
  categories: Category[]
  loading: boolean
  currentGame: Game | null
  loadedCategories: Set<string>
  searchResults: Game[]
  searchQuery: string
  
  // Getters
  getGameById: (id: string) => Game | null
  getGamesByCategory: (categoryId: string) => Game[]
  popularGames: Game[]
  getCategoryById: (id: string) => Category | undefined
  getAllGames: Game[]
  isCategoryLoaded: (categoryId: string) => boolean
  
  // Actions
  addGames: (games: Game[]) => void
  fetchCategories: () => Promise<void>
  fetchGamesByCategory: (categoryId: string) => Promise<Game[]>
  fetchGameById: (id: string) => Promise<Game | null>
  incrementPlayCount: (id: string) => void
  initialize: () => Promise<boolean>
  searchGames: (query: string) => Promise<Game[]>
}

// 组件Props类型
export interface FCEmulatorProps {
  romPath: string
  containerId?: string
  dataPath?: string
  gameName?: string
  showControls?: boolean
  showStatusInfo?: boolean
}

export interface EmulatorStatusProps {
  isLoading?: boolean
  loadingMessage?: string
  progress?: number
  showProgress?: boolean
  hasError?: boolean
  errorMessage?: string
  errorDetails?: string
  errorType?: string
  showRetry?: boolean
  status?: string
  statusDuration?: number
  showStatusInfo?: boolean
  overlayClass?: string
}

export interface EmulatorControlsProps {
  showControls?: boolean
  showSecondaryControls?: boolean
  showAdvancedControls?: boolean
  showRestart?: boolean
  showFullscreen?: boolean
  showVolumeControl?: boolean
  showVolumeSlider?: boolean
  showSaveControls?: boolean
  showKeyHelp?: boolean
  status?: string
  volume?: number
  isMuted?: boolean
  isFullscreen?: boolean
  showingKeyHelp?: boolean
  canPause?: boolean
  canResume?: boolean
  canRestart?: boolean
  canFullscreen?: boolean
  canSaveState?: boolean
  canLoadState?: boolean
}

// 浏览器兼容性类型
export interface BrowserCompatibility {
  webassembly: boolean
  sharedArrayBuffer: boolean
  audioContext: boolean
  fullscreen: boolean
  indexedDB: boolean
  fetch: boolean
  es6: boolean
}

// 性能监控类型
export interface PerformanceMetrics {
  loadTime: number
  fps: number
  memoryUsage: number
  cpuUsage?: number
  timestamp: number
}

// 配置管理类型
export interface AppConfig {
  emulator: {
    defaultCore: string
    dataPath: string
    volume: number
    autoSave: boolean
  }
  ui: {
    theme: 'light' | 'dark' | 'auto'
    language: string
    showStatusInfo: boolean
    showControls: boolean
  }
  performance: {
    enableCaching: boolean
    maxCacheSize: number
    preloadCategories: boolean
  }
}

// 工具函数类型
export type EventListener<T = any> = (data: T) => void
export type EmptyFunction = () => void
export type AsyncFunction<T = any> = () => Promise<T>

// 泛型工具类型
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>

// 全局变量类型声明 (for EmulatorJS)
declare global {
  interface Window {
    // EmulatorJS全局变量
    EJS_player?: string
    EJS_gameUrl?: string
    EJS_core?: string
    EJS_pathtodata?: string
    EJS_gameName?: string
    EJS_language?: string
    EJS_startOnLoaded?: boolean
    EJS_volume?: number
    EJS_mute?: boolean
    EJS_ready?: () => void
    EJS_onGameStart?: () => void
    EJS_emulator?: any
    
    // 浏览器特性
    webkitFullscreenElement?: Element
    msFullscreenElement?: Element
    webkitExitFullscreen?: () => void
    msExitFullscreen?: () => void
  }
}

export {} 