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
 */
export class EmulatorConfig {
  constructor({
    containerId,
    romPath,
    core = 'fceumm',
    dataPath = '/emulatorjs/',
    gameName = 'NES Game',
    language = '',
    startOnLoaded = true,
    volume = 1,
    muted = false
  } = {}) {
    this.containerId = containerId
    this.romPath = romPath
    this.core = core
    this.dataPath = dataPath
    this.gameName = gameName
    this.language = language
    this.startOnLoaded = startOnLoaded
    this.volume = volume
    this.muted = muted
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