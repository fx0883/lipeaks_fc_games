/**
 * 模拟器适配器接口
 * 定义统一的模拟器操作接口，支持不同模拟器实现的无缝切换
 */

export const EmulatorEvents = {
  READY: 'ready',
  GAME_LOADED: 'gameLoaded',
  GAME_STARTED: 'gameStarted',
  PAUSED: 'paused',
  RESUMED: 'resumed',
  ERROR: 'error',
  LOADING_PROGRESS: 'loadingProgress',
  STATE_SAVED: 'stateSaved',
  STATE_LOADED: 'stateLoaded'
}

export const EmulatorStatus = {
  IDLE: 'idle',
  LOADING: 'loading',
  READY: 'ready',
  RUNNING: 'running',
  PAUSED: 'paused',
  ERROR: 'error'
}

/**
 * 模拟器配置接口
 * 支持所有EmulatorJS官方配置选项
 */
export class EmulatorConfig {
  constructor({
    // === 基础配置 ===
    containerId,
    romPath,
    core = 'fceumm',
    dataPath = '/emulatorjs/',
    gameName = 'NES Game',
    language = '',
    startOnLoaded = true,
    volume = 1,
    muted = false,
    
    // === 高级功能配置 ===
    // BIOS和ROM相关
    biosUrl = '',
    gamePatchUrl = '',
    gameParentUrl = '',
    loadStateURL = '',
    externalFiles = [],
    dontExtractBIOS = false,
    softLoad = false,
    
    // 作弊码功能
    cheats = [],
    
    // 联机功能
    netplayUrl = '',
    gameId = null,
    
    // 广告配置
    adUrl = '',
    adMode = 0,
    adTimer = 15,
    adSize = { width: 728, height: 90 },
    
    // 界面和控制
    color = '#74A0FF',
    alignStartButton = 'center',
    startButtonName = 'Start Game',
    backgroundImg = '',
    backgroundBlur = false,
    backgroundColor = '',
    hideSettings = false,
    
    // 虚拟手柄
    virtualGamepadSettings = {},
    buttonOpts = {},
    defaultControllers = {},
    controlScheme = {},
    
    // 高级选项
    fullscreenOnLoad = false,
    filePaths = {},
    cacheLimit = 1024,
    defaultOptions = {},
    threads = false,
    disableCue = false,
    capture = {},
    disableDatabases = false,
    disableLocalStorage = false,
    forceLegacyCores = false,
    noAutoFocus = false,
    videoRotation = 0,
    shaders = {}
  } = {}) {
    // 基础配置
    this.containerId = containerId
    this.romPath = romPath
    this.core = core
    this.dataPath = dataPath
    this.gameName = gameName
    this.language = language
    this.startOnLoaded = startOnLoaded
    this.volume = volume
    this.muted = muted
    
    // 高级功能配置
    this.biosUrl = biosUrl
    this.gamePatchUrl = gamePatchUrl
    this.gameParentUrl = gameParentUrl
    this.loadStateURL = loadStateURL
    this.externalFiles = externalFiles
    this.dontExtractBIOS = dontExtractBIOS
    this.softLoad = softLoad
    
    this.cheats = cheats
    
    this.netplayUrl = netplayUrl
    this.gameId = gameId
    
    this.adUrl = adUrl
    this.adMode = adMode
    this.adTimer = adTimer
    this.adSize = adSize
    
    this.color = color
    this.alignStartButton = alignStartButton
    this.startButtonName = startButtonName
    this.backgroundImg = backgroundImg
    this.backgroundBlur = backgroundBlur
    this.backgroundColor = backgroundColor
    this.hideSettings = hideSettings
    
    this.virtualGamepadSettings = virtualGamepadSettings
    this.buttonOpts = buttonOpts
    this.defaultControllers = defaultControllers
    this.controlScheme = controlScheme
    
    this.fullscreenOnLoad = fullscreenOnLoad
    this.filePaths = filePaths
    this.cacheLimit = cacheLimit
    this.defaultOptions = defaultOptions
    this.threads = threads
    this.disableCue = disableCue
    this.capture = capture
    this.disableDatabases = disableDatabases
    this.disableLocalStorage = disableLocalStorage
    this.forceLegacyCores = forceLegacyCores
    this.noAutoFocus = noAutoFocus
    this.videoRotation = videoRotation
    this.shaders = shaders
  }

  validate() {
    if (!this.containerId) {
      throw new Error('Container ID is required')
    }
    if (!this.romPath) {
      throw new Error('ROM path is required')
    }
    return true
  }
}

/**
 * 模拟器适配器接口
 * 所有模拟器实现都应该实现此接口
 */
export class IEmulatorAdapter {
  constructor() {
    this.status = EmulatorStatus.IDLE
    this.eventListeners = new Map()
  }

  /**
   * 初始化模拟器
   * @param {EmulatorConfig} config 模拟器配置
   * @returns {Promise<void>}
   */
  async initialize(config) {
    throw new Error('initialize method must be implemented')
  }

  /**
   * 加载游戏ROM
   * @param {string} romPath ROM文件路径
   * @returns {Promise<void>}
   */
  async loadGame(romPath) {
    throw new Error('loadGame method must be implemented')
  }

  /**
   * 暂停游戏
   * @returns {boolean} 是否成功暂停
   */
  pause() {
    throw new Error('pause method must be implemented')
  }

  /**
   * 恢复游戏
   * @returns {boolean} 是否成功恢复
   */
  resume() {
    throw new Error('resume method must be implemented')
  }

  /**
   * 重启游戏
   * @returns {boolean} 是否成功重启
   */
  restart() {
    throw new Error('restart method must be implemented')
  }

  /**
   * 设置音量
   * @param {number} volume 音量值 (0-1)
   * @returns {boolean} 是否成功设置
   */
  setVolume(volume) {
    throw new Error('setVolume method must be implemented')
  }

  /**
   * 静音/取消静音
   * @param {boolean} muted 是否静音
   * @returns {boolean} 是否成功设置
   */
  setMuted(muted) {
    throw new Error('setMuted method must be implemented')
  }

  /**
   * 进入全屏
   * @returns {boolean} 是否成功进入全屏
   */
  enterFullscreen() {
    throw new Error('enterFullscreen method must be implemented')
  }

  /**
   * 退出全屏
   * @returns {boolean} 是否成功退出全屏
   */
  exitFullscreen() {
    throw new Error('exitFullscreen method must be implemented')
  }

  /**
   * 保存游戏状态
   * @param {string} slotName 存档槽名称
   * @returns {Promise<boolean>} 是否成功保存
   */
  async saveState(slotName = 'auto') {
    throw new Error('saveState method must be implemented')
  }

  /**
   * 加载游戏状态
   * @param {string} slotName 存档槽名称
   * @returns {Promise<boolean>} 是否成功加载
   */
  async loadState(slotName = 'auto') {
    throw new Error('loadState method must be implemented')
  }

  /**
   * 销毁模拟器实例
   * @returns {Promise<void>}
   */
  async destroy() {
    throw new Error('destroy method must be implemented')
  }

  /**
   * 作弊码相关方法
   */
  
  /**
   * 添加作弊码
   * @param {string} description 作弊码描述
   * @param {string} code 作弊码内容
   * @returns {boolean} 是否成功添加
   */
  addCheat(description, code) {
    throw new Error('addCheat method must be implemented')
  }

  /**
   * 启用/禁用作弊码
   * @param {number} index 作弊码索引
   * @param {boolean} enabled 是否启用
   * @returns {boolean} 是否成功设置
   */
  setCheatEnabled(index, enabled) {
    throw new Error('setCheatEnabled method must be implemented')
  }

  /**
   * 删除作弊码
   * @param {number} index 作弊码索引
   * @returns {boolean} 是否成功删除
   */
  removeCheat(index) {
    throw new Error('removeCheat method must be implemented')
  }

  /**
   * 获取所有作弊码
   * @returns {Array} 作弊码列表
   */
  getCheats() {
    throw new Error('getCheats method must be implemented')
  }

  /**
   * 高级功能方法
   */

  /**
   * 截屏
   * @returns {Promise<string>} 截图的base64数据
   */
  async takeScreenshot() {
    throw new Error('takeScreenshot method must be implemented')
  }

  /**
   * 切换快进
   * @param {boolean} enabled 是否启用快进
   * @returns {boolean} 是否成功设置
   */
  toggleFastForward(enabled) {
    throw new Error('toggleFastForward method must be implemented')
  }

  /**
   * 设置快进倍率
   * @param {number} ratio 快进倍率
   * @returns {boolean} 是否成功设置
   */
  setFastForwardRatio(ratio) {
    throw new Error('setFastForwardRatio method must be implemented')
  }

  /**
   * 切换倒带功能
   * @param {boolean} enabled 是否启用倒带
   * @returns {boolean} 是否成功设置
   */
  toggleRewind(enabled) {
    throw new Error('toggleRewind method must be implemented')
  }

  /**
   * 获取模拟器实例（用于访问高级功能）
   * 注意：这个方法应该谨慎使用，主要用于访问适配器未封装的高级功能
   * @returns {*} 原生模拟器实例
   */
  getEmulatorInstance() {
    throw new Error('getEmulatorInstance method must be implemented')
  }

  /**
   * 获取当前状态
   * @returns {string} 当前状态
   */
  getStatus() {
    return this.status
  }

  /**
   * 检查是否正在运行
   * @returns {boolean}
   */
  isRunning() {
    return this.status === EmulatorStatus.RUNNING
  }

  /**
   * 检查是否已暂停
   * @returns {boolean}
   */
  isPaused() {
    return this.status === EmulatorStatus.PAUSED
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
} 