import { EmulatorJSAdapter } from '../adapters/EmulatorJSAdapter.js'
import { 
  EmulatorConfig, 
  EmulatorEvents, 
  EmulatorStatus 
} from '../interfaces/IEmulatorAdapter.js'
import { StateManager } from './StateManager.js'
import { globalResourceManager } from './ResourceManager.js'
import { globalErrorHandler } from './ErrorHandler.js'

/**
 * 模拟器服务
 * 整合适配器、资源管理、状态管理和错误处理，提供统一的模拟器服务接口
 */
export class EmulatorService {
  constructor() {
    this.adapter = null
    this.stateManager = new StateManager()
    this.resourceManager = globalResourceManager
    this.errorHandler = globalErrorHandler
    this.config = null
    this.isInitialized = false
    this.eventListeners = new Map()
    
    // 绑定方法以确保正确的this上下文
    this.handleAdapterEvent = this.handleAdapterEvent.bind(this)
    this.handleStateChange = this.handleStateChange.bind(this)
    this.handleError = this.handleError.bind(this)
    
    // 设置错误处理
    this.setupErrorHandling()
  }

  /**
   * 设置错误处理
   */
  setupErrorHandling() {
    this.errorHandler.addErrorListener(this.handleError)
  }

  /**
   * 初始化模拟器服务
   * @param {Object} config 配置对象
   * @returns {Promise<void>}
   */
  async initialize(config) {
    if (this.isInitialized) {
      console.warn('EmulatorService: Already initialized')
      return
    }

    try {
      // 验证配置
      this.config = new EmulatorConfig(config)
      this.config.validate()
      
      // 设置状态监听
      this.stateManager.addGlobalListener(this.handleStateChange)
      
      // 创建适配器
      this.adapter = new EmulatorJSAdapter()
      
      // 设置适配器事件监听
      this.setupAdapterListeners()
      
      // 初始化适配器
      await this.adapter.initialize(this.config)
      
      this.isInitialized = true
      // EmulatorService: 初始化成功 - 生产环境不输出日志
      
    } catch (error) {
      const errorInfo = this.errorHandler.createEmulatorError(
        `Failed to initialize emulator service: ${error.message}`,
        { config: this.config }
      )
      this.errorHandler.handleError(errorInfo)
      throw error
    }
  }

  /**
   * 设置适配器事件监听器
   */
  setupAdapterListeners() {
    if (!this.adapter) return
    
    // 监听所有适配器事件
    Object.values(EmulatorEvents).forEach(event => {
      this.adapter.addEventListener(event, (data) => {
        this.handleAdapterEvent(event, data)
      })
    })
  }

  /**
   * 处理适配器事件
   * @param {string} event 事件名称
   * @param {*} data 事件数据
   */
  handleAdapterEvent(event, data) {
          // EmulatorService: 适配器事件 - 生产环境不输出日志
    
    // 更新状态管理器的状态
    switch (event) {
      case EmulatorEvents.READY:
        this.stateManager.setStatus(EmulatorStatus.READY, { source: 'adapter' })
        break
      
      case EmulatorEvents.GAME_STARTED:
        this.stateManager.setStatus(EmulatorStatus.RUNNING, { source: 'adapter' })
        break
      
      case EmulatorEvents.PAUSED:
        this.stateManager.setStatus(EmulatorStatus.PAUSED, { source: 'adapter' })
        break
      
      case EmulatorEvents.RESUMED:
        this.stateManager.setStatus(EmulatorStatus.RUNNING, { source: 'adapter' })
        break
      
      case EmulatorEvents.ERROR:
        this.stateManager.setStatus(EmulatorStatus.ERROR, { 
          source: 'adapter', 
          error: data.error 
        })
        break
      
      case EmulatorEvents.LOADING_PROGRESS:
        // 状态管理器已经在加载状态，只需要传递进度信息
        break
    }
    
    // 向外部监听器传播事件
    this.emit(event, data)
  }

  /**
   * 处理状态变化
   * @param {Object} stateChange 状态变化信息
   */
  handleStateChange(stateChange) {
          // EmulatorService: 状态变化 - 生产环境不输出日志
    
    // 向外部监听器传播状态变化事件
    this.emit('stateChanged', stateChange)
  }

  /**
   * 处理错误
   * @param {ErrorInfo} errorInfo 错误信息
   */
  handleError(errorInfo) {
    // 对于模拟器相关的高严重程度错误，更新状态
    if (errorInfo.type === 'emulator' && 
        (errorInfo.severity === 'high' || errorInfo.severity === 'critical')) {
      this.stateManager.forceSetStatus(EmulatorStatus.ERROR, {
        source: 'errorHandler',
        errorType: errorInfo.type,
        errorMessage: errorInfo.message
      })
    }
  }

  /**
   * 加载游戏ROM
   * @param {string} romPath ROM文件路径
   * @returns {Promise<void>}
   */
  async loadGame(romPath) {
    this.ensureInitialized()
    
    if (!this.stateManager.canPerformOperation('loadGame')) {
      throw new Error(`Cannot load game in current state: ${this.stateManager.getCurrentStatus()}`)
    }
    
    try {
      this.stateManager.setStatus(EmulatorStatus.LOADING, { 
        operation: 'loadGame',
        romPath 
      })
      
      // 验证ROM文件
      await this.resourceManager.loadROM(romPath)
      
      // 加载游戏到适配器
      await this.adapter.loadGame(romPath)
      
      // EmulatorService: 游戏加载成功 - 生产环境不输出日志
      
    } catch (error) {
      const errorInfo = this.errorHandler.createResourceError(
        `Failed to load game: ${error.message}`,
        { romPath }
      )
      this.errorHandler.handleError(errorInfo)
      throw error
    }
  }



  /**
   * 设置音量
   * @param {number} volume 音量值 (0-1)
   * @returns {boolean}
   */
  setVolume(volume) {
    this.ensureInitialized()
    
    if (volume < 0 || volume > 1) {
      throw new Error('Volume must be between 0 and 1')
    }
    
    const result = this.adapter.setVolume(volume)
    if (result) {
      // EmulatorService: 音量设置 - 生产环境不输出日志
    }
    return result
  }

  /**
   * 设置静音状态
   * @param {boolean} muted 是否静音
   * @returns {boolean}
   */
  setMuted(muted) {
    this.ensureInitialized()
    
    const result = this.adapter.setMuted(muted)
    if (result) {
      // EmulatorService: 静音设置 - 生产环境不输出日志
    }
    return result
  }

  /**
   * 进入全屏
   * @returns {boolean}
   */
  enterFullscreen() {
    this.ensureInitialized()
    return this.adapter.enterFullscreen()
  }

  /**
   * 退出全屏
   * @returns {boolean}
   */
  exitFullscreen() {
    this.ensureInitialized()
    return this.adapter.exitFullscreen()
  }

  /**
   * 打开控制设置
   * @returns {boolean}
   */
  openControlSettings() {
    this.ensureInitialized()
    return this.adapter.openControlSettings()
  }

  /**
   * 保存游戏状态
   * @param {string} slotName 存档槽名称
   * @returns {Promise<boolean>}
   */
  async saveState(slotName = 'auto') {
    this.ensureInitialized()
    
    if (!this.stateManager.canPerformOperation('saveState')) {
      console.warn('Cannot save state in current state:', this.stateManager.getCurrentStatus())
      return false
    }
    
    try {
      const result = await this.adapter.saveState(slotName)
      if (result) {
        // EmulatorService: 状态已保存 - 生产环境不输出日志
      }
      return result
    } catch (error) {
      const errorInfo = this.errorHandler.createEmulatorError(
        `Failed to save state: ${error.message}`,
        { slotName }
      )
      this.errorHandler.handleError(errorInfo)
      return false
    }
  }

  /**
   * 加载游戏状态
   * @param {string} slotName 存档槽名称
   * @returns {Promise<boolean>}
   */
  async loadState(slotName = 'auto') {
    this.ensureInitialized()
    
    if (!this.stateManager.canPerformOperation('loadState')) {
      console.warn('Cannot load state in current state:', this.stateManager.getCurrentStatus())
      return false
    }
    
    try {
      const result = await this.adapter.loadState(slotName)
      if (result) {
        // EmulatorService: 状态已加载 - 生产环境不输出日志
      }
      return result
    } catch (error) {
      const errorInfo = this.errorHandler.createEmulatorError(
        `Failed to load state: ${error.message}`,
        { slotName }
      )
      this.errorHandler.handleError(errorInfo)
      return false
    }
  }

  /**
   * 获取当前状态
   * @returns {string}
   */
  getStatus() {
    return this.stateManager.getCurrentStatus()
  }

  /**
   * 检查是否可以执行操作
   * @param {string} operation 操作名称
   * @returns {boolean}
   */
  canPerformOperation(operation) {
    return this.stateManager.canPerformOperation(operation)
  }

  /**
   * 获取状态统计信息
   * @returns {Object}
   */
  getStatusStats() {
    return this.stateManager.getStatusStats()
  }

  /**
   * 获取资源缓存统计信息
   * @returns {Object}
   */
  getResourceStats() {
    return this.resourceManager.getCacheStats()
  }

  /**
   * 获取错误历史
   * @param {number} limit 限制数量
   * @returns {Array}
   */
  getErrorHistory(limit = 10) {
    return this.errorHandler.getErrorHistory(limit)
  }

  /**
   * 等待特定状态
   * @param {string} targetStatus 目标状态
   * @param {number} timeout 超时时间
   * @returns {Promise<Object>}
   */
  async waitForStatus(targetStatus, timeout = 5000) {
    return this.stateManager.waitForStatus(targetStatus, timeout)
  }

  /**
   * 添加事件监听器
   * @param {string} event 事件名称
   * @param {function} callback 回调函数
   */
  addEventListener(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set())
    }
    this.eventListeners.get(event).add(callback)
  }

  /**
   * 移除事件监听器
   * @param {string} event 事件名称
   * @param {function} callback 回调函数
   */
  removeEventListener(event, callback) {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event).delete(callback)
    }
  }

  /**
   * 触发事件
   * @param {string} event 事件名称
   * @param {*} data 事件数据
   */
  emit(event, data) {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event).forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error)
        }
      })
    }
  }

  /**
   * 清除所有事件监听器
   */
  clearEventListeners() {
    this.eventListeners.clear()
  }

  /**
   * 确保服务已初始化
   */
  ensureInitialized() {
    if (!this.isInitialized || !this.adapter) {
      throw new Error('EmulatorService not initialized')
    }
  }

  /**
   * 销毁模拟器服务
   * @returns {Promise<void>}
   */
  async destroy() {
          // EmulatorService: 开始销毁 - 生产环境不输出日志
    
    try {
      // 销毁适配器
      if (this.adapter) {
        await this.adapter.destroy()
        this.adapter = null
      }
      
      // 重置状态管理器
      this.stateManager.destroy()
      
      // 清理事件监听器
      this.clearEventListeners()
      
      // 移除错误处理监听器
      this.errorHandler.removeErrorListener(this.handleError)
      
      this.isInitialized = false
      this.config = null
      
              // EmulatorService: 销毁成功 - 生产环境不输出日志
      
    } catch (error) {
      console.error('EmulatorService: Error during destruction:', error)
      throw error
    }
  }
}

/**
 * 模拟器服务工厂
 * 提供创建和管理模拟器服务实例的工厂方法
 */
export class EmulatorServiceFactory {
  constructor() {
    this.instances = new Map()
  }

  /**
   * 创建模拟器服务实例
   * @param {string} id 实例ID
   * @param {Object} config 配置
   * @returns {Promise<EmulatorService>}
   */
  async createInstance(id, config) {
    if (this.instances.has(id)) {
      throw new Error(`EmulatorService instance with id '${id}' already exists`)
    }
    
    const service = new EmulatorService()
    await service.initialize(config)
    
    this.instances.set(id, service)
    return service
  }

  /**
   * 获取模拟器服务实例
   * @param {string} id 实例ID
   * @returns {EmulatorService|null}
   */
  getInstance(id) {
    return this.instances.get(id) || null
  }

  /**
   * 销毁模拟器服务实例
   * @param {string} id 实例ID
   * @returns {Promise<boolean>}
   */
  async destroyInstance(id) {
    const service = this.instances.get(id)
    if (!service) {
      return false
    }
    
    await service.destroy()
    this.instances.delete(id)
    return true
  }

  /**
   * 销毁所有实例
   * @returns {Promise<void>}
   */
  async destroyAll() {
    const destroyPromises = Array.from(this.instances.keys()).map(id => 
      this.destroyInstance(id)
    )
    await Promise.all(destroyPromises)
  }

  /**
   * 获取所有实例ID
   * @returns {string[]}
   */
  getAllInstanceIds() {
    return Array.from(this.instances.keys())
  }
}

// 创建全局工厂实例
export const globalEmulatorServiceFactory = new EmulatorServiceFactory() 