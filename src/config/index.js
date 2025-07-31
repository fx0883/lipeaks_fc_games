/**
 * 应用配置管理中心
 * 统一管理所有配置项，提供类型安全的配置访问
 */

// 默认配置
const defaultConfig = {
  // 模拟器配置
  emulator: {
    defaultCore: 'fceumm',
    dataPath: '/emulatorjs/data/',
    defaultVolume: 100,
    autoSave: true,
    saveInterval: 30000, // 30秒自动保存间隔
    maxRetries: 3,
    retryDelay: 1000,
    initTimeout: 20000 // 20秒初始化超时
  },
  
  // UI配置
  ui: {
    theme: 'light',
    language: 'zh-CN',
    showStatusInfo: true,
    showControls: true,
    showProgress: true,
    animationsEnabled: true,
    compactMode: false
  },
  
  // 性能配置
  performance: {
    enableCaching: true,
    maxCacheSize: 50 * 1024 * 1024, // 50MB
    preloadCategories: false,
    lazyLoading: true,
    debounceSearchDelay: 300,
    maxConcurrentLoads: 3
  },
  
  // 错误处理配置
  error: {
    maxHistorySize: 100,
    enableMonitoring: false,
    monitoringEndpoint: null,
    showErrorDetails: false, // 生产环境关闭
    autoRetry: true,
    notificationDuration: 5000
  },
  
  // 资源管理配置
  resources: {
    romBaseUrl: '/roms/',
    dataBaseUrl: '/data/',
    cdnEnabled: false,
    cdnBaseUrl: 'https://cdn.emulatorjs.org/stable/data/',
    compressionEnabled: true,
    preloadResources: []
  },
  
  // 调试配置
  debug: {
    enabled: import.meta.env.DEV,
    verboseLogging: false,
    performanceMonitoring: import.meta.env.DEV,
    errorStackTrace: import.meta.env.DEV
  }
}

/**
 * 配置管理器类
 */
class ConfigManager {
  constructor() {
    this.config = { ...defaultConfig }
    this.listeners = new Set()
    this.loadUserConfig()
  }

  /**
   * 加载用户配置
   */
  loadUserConfig() {
    try {
      const userConfig = localStorage.getItem('fc-game-config')
      if (userConfig) {
        const parsed = JSON.parse(userConfig)
        this.mergeConfig(parsed)
      }
    } catch (error) {
      console.warn('Failed to load user config:', error)
    }
  }

  /**
   * 保存用户配置
   */
  saveUserConfig() {
    try {
      localStorage.setItem('fc-game-config', JSON.stringify(this.config))
    } catch (error) {
      console.warn('Failed to save user config:', error)
    }
  }

  /**
   * 深度合并配置
   * @param {Object} newConfig 新配置
   */
  mergeConfig(newConfig) {
    this.config = this.deepMerge(this.config, newConfig)
    this.notifyListeners()
  }

  /**
   * 深度合并对象
   * @param {Object} target 目标对象
   * @param {Object} source 源对象
   * @returns {Object}
   */
  deepMerge(target, source) {
    const result = { ...target }
    
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (this.isObject(source[key]) && this.isObject(target[key])) {
          result[key] = this.deepMerge(target[key], source[key])
        } else {
          result[key] = source[key]
        }
      }
    }
    
    return result
  }

  /**
   * 检查是否为对象
   * @param {*} obj 要检查的值
   * @returns {boolean}
   */
  isObject(obj) {
    return obj && typeof obj === 'object' && !Array.isArray(obj)
  }

  /**
   * 获取配置值
   * @param {string} path 配置路径，如 'emulator.defaultCore'
   * @param {*} defaultValue 默认值
   * @returns {*}
   */
  get(path, defaultValue = undefined) {
    const keys = path.split('.')
    let current = this.config
    
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key]
      } else {
        return defaultValue
      }
    }
    
    return current
  }

  /**
   * 设置配置值
   * @param {string} path 配置路径
   * @param {*} value 配置值
   */
  set(path, value) {
    const keys = path.split('.')
    const lastKey = keys.pop()
    let current = this.config
    
    // 创建嵌套对象路径
    for (const key of keys) {
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {}
      }
      current = current[key]
    }
    
    current[lastKey] = value
    this.saveUserConfig()
    this.notifyListeners()
  }

  /**
   * 重置到默认配置
   */
  reset() {
    this.config = { ...defaultConfig }
    this.saveUserConfig()
    this.notifyListeners()
  }

  /**
   * 重置特定分组的配置
   * @param {string} group 配置分组名
   */
  resetGroup(group) {
    if (defaultConfig[group]) {
      this.config[group] = { ...defaultConfig[group] }
      this.saveUserConfig()
      this.notifyListeners()
    }
  }

  /**
   * 获取整个配置对象
   * @returns {Object}
   */
  getAll() {
    return { ...this.config }
  }

  /**
   * 获取特定分组的配置
   * @param {string} group 配置分组名
   * @returns {Object}
   */
  getGroup(group) {
    return this.config[group] ? { ...this.config[group] } : {}
  }

  /**
   * 添加配置变化监听器
   * @param {Function} listener 监听器函数
   */
  addListener(listener) {
    this.listeners.add(listener)
  }

  /**
   * 移除配置变化监听器
   * @param {Function} listener 监听器函数
   */
  removeListener(listener) {
    this.listeners.delete(listener)
  }

  /**
   * 通知所有监听器
   */
  notifyListeners() {
    this.listeners.forEach(listener => {
      try {
        listener(this.config)
      } catch (error) {
        console.error('Config listener error:', error)
      }
    })
  }

  /**
   * 验证配置
   * @returns {Object} 验证结果
   */
  validate() {
    const errors = []
    const warnings = []

    // 验证模拟器配置
    if (this.get('emulator.defaultVolume') < 0 || this.get('emulator.defaultVolume') > 100) {
      errors.push('emulator.defaultVolume must be between 0 and 100')
    }

    if (this.get('performance.maxCacheSize') < 0) {
      errors.push('performance.maxCacheSize must be positive')
    }

    // 验证路径配置
    if (!this.get('emulator.dataPath').endsWith('/')) {
      warnings.push('emulator.dataPath should end with "/"')
    }

    return { errors, warnings, isValid: errors.length === 0 }
  }

  /**
   * 导出配置为JSON
   * @returns {string}
   */
  export() {
    return JSON.stringify(this.config, null, 2)
  }

  /**
   * 从JSON导入配置
   * @param {string} jsonConfig JSON配置字符串
   */
  import(jsonConfig) {
    try {
      const newConfig = JSON.parse(jsonConfig)
      this.mergeConfig(newConfig)
    } catch (error) {
      throw new Error(`Invalid JSON config: ${error.message}`)
    }
  }
}

// 创建全局配置管理器实例
export const configManager = new ConfigManager()

// 便捷访问方法
export const getConfig = (path, defaultValue) => configManager.get(path, defaultValue)
export const setConfig = (path, value) => configManager.set(path, value)
export const getEmulatorConfig = () => configManager.getGroup('emulator')
export const getUIConfig = () => configManager.getGroup('ui')
export const getPerformanceConfig = () => configManager.getGroup('performance')

// 预设配置
export const presets = {
  // 性能优先配置
  performance: {
    performance: {
      enableCaching: true,
      maxCacheSize: 100 * 1024 * 1024,
      preloadCategories: true,
      lazyLoading: false,
      maxConcurrentLoads: 5
    },
    emulator: {
      autoSave: false,
      saveInterval: 60000
    }
  },
  
  // 节省内存配置
  memoryEfficient: {
    performance: {
      enableCaching: true,
      maxCacheSize: 10 * 1024 * 1024,
      preloadCategories: false,
      lazyLoading: true,
      maxConcurrentLoads: 1
    },
    emulator: {
      autoSave: true,
      saveInterval: 10000
    }
  },
  
  // 调试配置
  debug: {
    debug: {
      enabled: true,
      verboseLogging: true,
      performanceMonitoring: true,
      errorStackTrace: true
    },
    error: {
      showErrorDetails: true,
      enableMonitoring: true
    }
  }
}

/**
 * 应用预设配置
 * @param {string} presetName 预设名称
 */
export const applyPreset = (presetName) => {
  if (presets[presetName]) {
    configManager.mergeConfig(presets[presetName])
  } else {
    throw new Error(`Unknown preset: ${presetName}`)
  }
}

export default configManager 