import { 
  IEmulatorAdapter, 
  EmulatorEvents, 
  EmulatorStatus, 
  EmulatorConfig 
} from '../interfaces/IEmulatorAdapter.js'

/**
 * EmulatorJS适配器实现
 * 封装EmulatorJS的具体实现，避免全局变量污染
 */
export class EmulatorJSAdapter extends IEmulatorAdapter {
  constructor() {
    super()
    this.config = null
    this.emulatorInstance = null
    this.containerId = null
    this.scriptElement = null
    this.loadingProgress = 0
    this.isDestroyed = false
    
    // 用于隔离的唯一命名空间
    this.namespace = `EJS_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // 绑定方法以确保正确的this上下文
    this.handleEmulatorReady = this.handleEmulatorReady.bind(this)
    this.handleGameStart = this.handleGameStart.bind(this)
    this.handleError = this.handleError.bind(this)
  }

  /**
   * 初始化模拟器
   * @param {EmulatorConfig} config 模拟器配置
   * @returns {Promise<void>}
   */
  async initialize(config) {
    if (this.isDestroyed) {
      throw new Error('Adapter has been destroyed')
    }

    // 验证配置
    config.validate()
    this.config = config
    this.containerId = config.containerId
    
    this.status = EmulatorStatus.LOADING
    this.emit(EmulatorEvents.LOADING_PROGRESS, { progress: 0 })

    try {
      // 验证ROM文件
      await this.validateRomFile(config.romPath)
      
      // 清理之前的实例
      await this.cleanup()
      
      // 设置EmulatorJS配置（使用命名空间避免冲突）
      this.setupEmulatorJSConfig()
      
      // 加载EmulatorJS脚本
      await this.loadEmulatorJSScript()
      
      // 等待模拟器初始化
      await this.waitForEmulatorInitialization()
      
      this.status = EmulatorStatus.READY
      this.emit(EmulatorEvents.READY)
      
    } catch (error) {
      this.status = EmulatorStatus.ERROR
      this.emit(EmulatorEvents.ERROR, { error: error.message })
      throw error
    }
  }

  /**
   * 验证ROM文件是否可访问
   * @param {string} romPath ROM文件路径
   * @returns {Promise<void>}
   */
  async validateRomFile(romPath) {
    const adjustedPath = romPath.startsWith('/') ? romPath : `/${romPath}`
    
    try {
      const response = await fetch(adjustedPath, { method: 'HEAD' })
      if (!response.ok) {
        throw new Error(`ROM文件无法访问 (状态码: ${response.status})`)
      }
    } catch (error) {
      throw new Error(`ROM文件验证失败: ${error.message}`)
    }
  }

  /**
   * 设置EmulatorJS配置
   */
  setupEmulatorJSConfig() {
    const globalConfig = {
      [`${this.namespace}_player`]: `#${this.containerId}`,
      [`${this.namespace}_gameUrl`]: this.config.romPath.startsWith('/') ? this.config.romPath : `/${this.config.romPath}`,
      [`${this.namespace}_core`]: this.config.core,
      [`${this.namespace}_pathtodata`]: this.config.dataPath,
      [`${this.namespace}_gameName`]: this.config.gameName,
      [`${this.namespace}_language`]: this.config.language,
      [`${this.namespace}_startOnLoaded`]: this.config.startOnLoaded,
      [`${this.namespace}_volume`]: this.config.volume,
      [`${this.namespace}_mute`]: this.config.muted,
      [`${this.namespace}_ready`]: this.handleEmulatorReady,
      [`${this.namespace}_onGameStart`]: this.handleGameStart
    }

    // 临时设置全局变量（仅在初始化期间）
    Object.keys(globalConfig).forEach(key => {
      const ejsKey = key.replace(this.namespace, 'EJS')
      window[ejsKey] = globalConfig[key]
    })
  }

  /**
   * 加载EmulatorJS脚本
   * @returns {Promise<void>}
   */
  async loadEmulatorJSScript() {
    return new Promise((resolve, reject) => {
      // 模拟加载进度
      const progressInterval = setInterval(() => {
        this.loadingProgress = Math.min(this.loadingProgress + Math.random() * 20, 90)
        this.emit(EmulatorEvents.LOADING_PROGRESS, { progress: this.loadingProgress })
      }, 200)

      this.scriptElement = document.createElement('script')
      this.scriptElement.src = `${this.config.dataPath}loader.js`
      this.scriptElement.dataset.namespace = this.namespace

      this.scriptElement.onload = () => {
        clearInterval(progressInterval)
        this.loadingProgress = 100
        this.emit(EmulatorEvents.LOADING_PROGRESS, { progress: this.loadingProgress })
        resolve()
      }

      this.scriptElement.onerror = () => {
        clearInterval(progressInterval)
        reject(new Error('EmulatorJS脚本加载失败'))
      }

      document.head.appendChild(this.scriptElement)
    })
  }

  /**
   * 等待模拟器初始化完成
   * @returns {Promise<void>}
   */
  async waitForEmulatorInitialization() {
    return new Promise((resolve, reject) => {
      let attempts = 0
      const maxAttempts = 100 // 20秒超时

      const checkInterval = setInterval(() => {
        attempts++

        if (window.EJS_emulator) {
          this.emulatorInstance = window.EJS_emulator
          clearInterval(checkInterval)
          resolve()
        } else if (attempts >= maxAttempts) {
          clearInterval(checkInterval)
          reject(new Error('EmulatorJS初始化超时'))
        }
      }, 200)
    })
  }

  /**
   * 处理模拟器就绪事件
   */
  handleEmulatorReady() {
    this.status = EmulatorStatus.READY
    this.emit(EmulatorEvents.READY)
  }

  /**
   * 处理游戏开始事件
   */
  handleGameStart() {
    this.status = EmulatorStatus.RUNNING
    this.emit(EmulatorEvents.GAME_STARTED)
  }

  /**
   * 处理错误事件
   * @param {Error} error 错误对象
   */
  handleError(error) {
    this.status = EmulatorStatus.ERROR
    this.emit(EmulatorEvents.ERROR, { error: error.message })
  }

  /**
   * 加载新游戏
   * @param {string} romPath ROM文件路径
   * @returns {Promise<void>}
   */
  async loadGame(romPath) {
    if (this.isDestroyed) {
      throw new Error('Adapter has been destroyed')
    }

    try {
      await this.validateRomFile(romPath)
      
      this.config.romPath = romPath
      window.EJS_gameUrl = romPath.startsWith('/') ? romPath : `/${romPath}`
      
      if (this.emulatorInstance && typeof this.emulatorInstance.restart === 'function') {
        this.emulatorInstance.restart()
      }
      
      this.emit(EmulatorEvents.GAME_LOADED, { romPath })
      
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }



  /**
   * 设置音量
   * @param {number} volume 音量值 (0-1)
   * @returns {boolean}
   */
  setVolume(volume) {
    if (this.emulatorInstance && typeof this.emulatorInstance.setVolume === 'function') {
      this.emulatorInstance.setVolume(volume)
      this.config.volume = volume
      return true
    }
    return false
  }

  /**
   * 设置静音状态
   * @param {boolean} muted 是否静音
   * @returns {boolean}
   */
  setMuted(muted) {
    if (this.emulatorInstance) {
      const volume = muted ? 0 : this.config.volume
      if (typeof this.emulatorInstance.setVolume === 'function') {
        this.emulatorInstance.setVolume(volume)
        this.config.muted = muted
        return true
      }
    }
    return false
  }

  /**
   * 进入全屏
   * @returns {boolean}
   */
  enterFullscreen() {
    try {
      // 获取模拟器容器元素
      const container = document.querySelector(`#${this.config.containerId}`) || 
                       document.querySelector('#emulator-container') ||
                       document.documentElement
      
      if (container.requestFullscreen) {
        container.requestFullscreen()
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen()
      } else if (container.msRequestFullscreen) {
        container.msRequestFullscreen()
      } else {
        console.warn('当前浏览器不支持全屏API')
        return false
      }
      return true
    } catch (error) {
      console.error('进入全屏失败:', error)
      return false
    }
  }

  /**
   * 退出全屏
   * @returns {boolean}
   */
  exitFullscreen() {
    try {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
      return true
    } catch (error) {
      console.error('退出全屏失败:', error)
      return false
    }
  }

  /**
   * 打开控制设置
   * @returns {boolean}
   */
  openControlSettings() {
    try {
      if (this.emulatorInstance && this.emulatorInstance.controlMenu) {
        this.emulatorInstance.controlMenu.style.display = ""
        return true
      } else {
        console.warn('控制设置菜单不可用')
        return false
      }
    } catch (error) {
      console.error('打开控制设置失败:', error)
      return false
    }
  }

  /**
   * 保存游戏状态
   * @param {string} slotName 存档槽名称
   * @returns {Promise<boolean>}
   */
  async saveState(slotName = 'auto') {
    if (this.emulatorInstance && typeof this.emulatorInstance.saveState === 'function') {
      try {
        this.emulatorInstance.saveState()
        this.emit(EmulatorEvents.STATE_SAVED, { slotName })
        return true
      } catch (error) {
        console.error('保存状态失败:', error)
        return false
      }
    }
    return false
  }

  /**
   * 加载游戏状态
   * @param {string} slotName 存档槽名称
   * @returns {Promise<boolean>}
   */
  async loadState(slotName = 'auto') {
    if (this.emulatorInstance && typeof this.emulatorInstance.loadState === 'function') {
      try {
        this.emulatorInstance.loadState()
        this.emit(EmulatorEvents.STATE_LOADED, { slotName })
        return true
      } catch (error) {
        console.error('加载状态失败:', error)
        return false
      }
    }
    return false
  }

  /**
   * 清理资源
   * @returns {Promise<void>}
   */
  async cleanup() {
    try {
      // 清理模拟器实例
      if (this.emulatorInstance) {
        if (typeof this.emulatorInstance.destroy === 'function') {
          this.emulatorInstance.destroy()
        }
        this.emulatorInstance = null
      }

      // 清理DOM
      if (this.containerId) {
        const container = document.getElementById(this.containerId)
        if (container) {
          container.innerHTML = ''
        }
      }

      // 移除脚本
      if (this.scriptElement) {
        this.scriptElement.remove()
        this.scriptElement = null
      }

      // 清理所有相关的脚本
      const scripts = document.querySelectorAll('script[src*="emulatorjs"], script[data-namespace]')
      scripts.forEach(script => {
        if (script.dataset.namespace === this.namespace || !script.dataset.namespace) {
          script.remove()
        }
      })

      // 清理全局变量
      this.cleanupGlobalVariables()

      // EmulatorJSAdapter: 资源已清理 - 生产环境不输出日志

    } catch (error) {
      console.error(`EmulatorJSAdapter[${this.namespace}]: 清理资源时出错:`, error)
    }
  }

  /**
   * 清理全局变量
   */
  cleanupGlobalVariables() {
    const globalVars = [
      'EJS_emulator',
      'EJS_player', 
      'EJS_gameUrl',
      'EJS_core',
      'EJS_pathtodata',
      'EJS_gameName',
      'EJS_language',
      'EJS_startOnLoaded',
      'EJS_volume',
      'EJS_mute',
      'EJS_ready',
      'EJS_onGameStart'
    ]

    globalVars.forEach(varName => {
      if (window[varName] !== undefined) {
        delete window[varName]
      }
    })
  }

  /**
   * 销毁适配器
   * @returns {Promise<void>}
   */
  async destroy() {
    if (this.isDestroyed) {
      return
    }

    this.isDestroyed = true
    this.status = EmulatorStatus.IDLE
    
    await this.cleanup()
    this.clearEventListeners()
    
    this.config = null
    this.containerId = null
    this.loadingProgress = 0
    
          // EmulatorJSAdapter: 适配器已销毁 - 生产环境不输出日志
  }
} 