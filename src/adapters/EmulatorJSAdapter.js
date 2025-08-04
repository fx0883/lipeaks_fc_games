// Lipeaks FC Games
// Copyright (C) 2024 Lipeaks
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { 
  IEmulatorAdapter, 
  EmulatorEvents, 
  EmulatorStatus, 
  EmulatorConfig 
} from '../interfaces/IEmulatorAdapter.js'
import { 
  isMobileDevice, 
  isTouchDevice, 
  getDeviceOrientation, 
  getVirtualGamepadForCore 
} from '../utils/mobileDetection.js'

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
   * 传递所有官方支持的配置选项到EmulatorJS
   */
  setupEmulatorJSConfig() {
    const globalConfig = {
      // 基础必需配置
      [`${this.namespace}_player`]: `#${this.containerId}`,
      [`${this.namespace}_gameUrl`]: this.config.romPath.startsWith('/') ? this.config.romPath : `/${this.config.romPath}`,
      [`${this.namespace}_core`]: this.config.core,
      [`${this.namespace}_pathtodata`]: this.config.dataPath,
      [`${this.namespace}_gameName`]: this.config.gameName,
      [`${this.namespace}_language`]: this.config.language,
      [`${this.namespace}_startOnLoaded`]: this.config.startOnLoaded,
      [`${this.namespace}_volume`]: this.config.volume,
      [`${this.namespace}_mute`]: this.config.muted,
      
      // 事件回调
      [`${this.namespace}_ready`]: this.handleEmulatorReady,
      [`${this.namespace}_onGameStart`]: this.handleGameStart,
      
      // BIOS和ROM相关
      [`${this.namespace}_biosUrl`]: this.config.biosUrl,
      [`${this.namespace}_gamePatchUrl`]: this.config.gamePatchUrl,
      [`${this.namespace}_gameParentUrl`]: this.config.gameParentUrl,
      [`${this.namespace}_loadStateURL`]: this.config.loadStateURL,
      [`${this.namespace}_externalFiles`]: this.config.externalFiles,
      [`${this.namespace}_dontExtractBIOS`]: this.config.dontExtractBIOS,
      [`${this.namespace}_softLoad`]: this.config.softLoad,
      
      // 作弊码功能
      [`${this.namespace}_cheats`]: this.config.cheats,
      
      // 联机功能
      [`${this.namespace}_netplayServer`]: this.config.netplayUrl,
      [`${this.namespace}_gameID`]: this.config.gameId,
      
      // 广告配置
      [`${this.namespace}_AdUrl`]: this.config.adUrl,
      [`${this.namespace}_AdMode`]: this.config.adMode,
      [`${this.namespace}_AdTimer`]: this.config.adTimer,
      [`${this.namespace}_AdSize`]: this.config.adSize,
      
      // 界面和控制
      [`${this.namespace}_color`]: this.config.color,
      [`${this.namespace}_alignStartButton`]: this.config.alignStartButton,
      [`${this.namespace}_startButtonName`]: this.config.startButtonName,
      [`${this.namespace}_backgroundImage`]: this.config.backgroundImg,
      [`${this.namespace}_backgroundBlur`]: this.config.backgroundBlur,
      [`${this.namespace}_backgroundColor`]: this.config.backgroundColor,
      [`${this.namespace}_hideSettings`]: this.config.hideSettings,
      
      // 虚拟手柄
      [`${this.namespace}_VirtualGamepadSettings`]: this.config.virtualGamepadSettings,
      [`${this.namespace}_Buttons`]: this.config.buttonOpts,
      [`${this.namespace}_defaultControls`]: this.config.defaultControllers,
      [`${this.namespace}_controlScheme`]: this.config.controlScheme,
      
      // 高级选项
      [`${this.namespace}_fullscreenOnLoaded`]: this.config.fullscreenOnLoad,
      [`${this.namespace}_paths`]: this.config.filePaths,
      [`${this.namespace}_CacheLimit`]: this.config.cacheLimit,
      [`${this.namespace}_defaultOptions`]: this.config.defaultOptions,
      [`${this.namespace}_threads`]: this.config.threads,
      [`${this.namespace}_disableCue`]: this.config.disableCue,
      [`${this.namespace}_screenCapture`]: this.config.capture,
      [`${this.namespace}_disableDatabases`]: this.config.disableDatabases,
      [`${this.namespace}_disableLocalStorage`]: this.config.disableLocalStorage,
      [`${this.namespace}_forceLegacyCores`]: this.config.forceLegacyCores,
      [`${this.namespace}_noAutoFocus`]: this.config.noAutoFocus,
      [`${this.namespace}_videoRotation`]: this.config.videoRotation,
      [`${this.namespace}_shaders`]: this.config.shaders
    }

    // 检测移动设备并添加虚拟手柄配置
    if (isMobileDevice() || isTouchDevice()) {
      const orientation = getDeviceOrientation()
      const virtualGamepadSettings = getVirtualGamepadForCore(this.config.core, orientation)
      globalConfig[`${this.namespace}_VirtualGamepadSettings`] = virtualGamepadSettings
      
      // 启用触摸控制相关设置
      globalConfig[`${this.namespace}_disableDatabases`] = true // 减少移动端加载时间
      globalConfig[`${this.namespace}_noAutoFocus`] = true // 防止移动端自动聚焦问题
      globalConfig[`${this.namespace}_volume`] = 0 // 初始静音，避免AudioContext警告
    }

    // 临时设置全局变量（仅在初始化期间）
    // 只设置有意义的配置值，避免传递空值导致EmulatorJS初始化问题
    Object.keys(globalConfig).forEach(key => {
      const ejsKey = key.replace(this.namespace, 'EJS')
      const value = globalConfig[key]
      
      // 跳过空对象、空数组或undefined值（除非是明确的false/0值）
      if (this.isValidConfigValue(value)) {
        window[ejsKey] = value
      }
    })
  }

  /**
   * 验证配置值是否有效
   * @param {*} value 配置值
   * @returns {boolean} 是否为有效配置值
   */
  isValidConfigValue(value) {
    // null 或 undefined 无效
    if (value === null || value === undefined) {
      return false
    }
    
    // 空字符串无效（除非是明确的空字符串配置）
    if (value === '') {
      return false
    }
    
    // 空对象无效
    if (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0) {
      return false
    }
    
    // 空数组无效
    if (Array.isArray(value) && value.length === 0) {
      return false
    }
    
    // 其他值（包括false、0等）都是有效的
    return true
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
      // 基础变量
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
      'EJS_onGameStart',
      // 高级功能变量
      'EJS_biosUrl',
      'EJS_gamePatchUrl',
      'EJS_gameParentUrl',
      'EJS_loadStateURL',
      'EJS_externalFiles',
      'EJS_dontExtractBIOS',
      'EJS_softLoad',
      'EJS_cheats',
      'EJS_netplayServer',
      'EJS_gameID',
      'EJS_AdUrl',
      'EJS_AdMode',
      'EJS_AdTimer',
      'EJS_AdSize',
      'EJS_color',
      'EJS_alignStartButton',
      'EJS_startButtonName',
      'EJS_backgroundImage',
      'EJS_backgroundBlur',
      'EJS_backgroundColor',
      'EJS_hideSettings',
      'EJS_VirtualGamepadSettings',
      'EJS_Buttons',
      'EJS_defaultControls',
      'EJS_controlScheme',
      'EJS_fullscreenOnLoaded',
      'EJS_paths',
      'EJS_CacheLimit',
      'EJS_defaultOptions',
      'EJS_threads',
      'EJS_disableCue',
      'EJS_screenCapture',
      'EJS_disableDatabases',
      'EJS_disableLocalStorage',
      'EJS_forceLegacyCores',
      'EJS_noAutoFocus',
      'EJS_videoRotation',
      'EJS_shaders'
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

  // ========== 高级功能方法 ==========

  /**
   * 获取模拟器实例（用于访问高级功能）
   * @returns {*} 原生EmulatorJS实例
   */
  getEmulatorInstance() {
    return window.EJS_emulator || this.emulatorInstance
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
    try {
      const emulator = this.getEmulatorInstance()
      if (emulator && emulator.cheats) {
        emulator.cheats.push({
          desc: description,
          code: code,
          checked: false,
          is_permanent: false
        })
        // 更新作弊码UI（如果存在）
        if (typeof emulator.updateCheatUI === 'function') {
          emulator.updateCheatUI()
        }
        // 保存设置
        if (typeof emulator.saveSettings === 'function') {
          emulator.saveSettings()
        }
        return true
      }
    } catch (error) {
      console.error('添加作弊码失败:', error)
    }
    return false
  }

  /**
   * 启用/禁用作弊码
   * @param {number} index 作弊码索引
   * @param {boolean} enabled 是否启用
   * @returns {boolean} 是否成功设置
   */
  setCheatEnabled(index, enabled) {
    try {
      const emulator = this.getEmulatorInstance()
      if (emulator && emulator.cheats && emulator.cheats[index]) {
        emulator.cheats[index].checked = enabled
        // 调用模拟器的作弊码变更方法
        if (typeof emulator.cheatChanged === 'function') {
          emulator.cheatChanged(enabled, emulator.cheats[index].code, index)
        }
        // 保存设置
        if (typeof emulator.saveSettings === 'function') {
          emulator.saveSettings()
        }
        return true
      }
    } catch (error) {
      console.error('设置作弊码状态失败:', error)
    }
    return false
  }

  /**
   * 删除作弊码
   * @param {number} index 作弊码索引
   * @returns {boolean} 是否成功删除
   */
  removeCheat(index) {
    try {
      const emulator = this.getEmulatorInstance()
      if (emulator && emulator.cheats && emulator.cheats[index]) {
        // 先禁用作弊码
        if (emulator.cheats[index].checked && typeof emulator.cheatChanged === 'function') {
          emulator.cheatChanged(false, emulator.cheats[index].code, index)
        }
        // 删除作弊码
        emulator.cheats.splice(index, 1)
        // 更新UI
        if (typeof emulator.updateCheatUI === 'function') {
          emulator.updateCheatUI()
        }
        // 保存设置
        if (typeof emulator.saveSettings === 'function') {
          emulator.saveSettings()
        }
        return true
      }
    } catch (error) {
      console.error('删除作弊码失败:', error)
    }
    return false
  }

  /**
   * 获取所有作弊码
   * @returns {Array} 作弊码列表
   */
  getCheats() {
    try {
      const emulator = this.getEmulatorInstance()
      if (emulator && emulator.cheats) {
        return [...emulator.cheats] // 返回副本，避免外部修改
      }
    } catch (error) {
      console.error('获取作弊码列表失败:', error)
    }
    return []
  }

  /**
   * 高级功能方法
   */

  /**
   * 截屏
   * @returns {Promise<string>} 截图的base64数据
   */
  async takeScreenshot() {
    try {
      const emulator = this.getEmulatorInstance()
      if (emulator && emulator.gameManager && typeof emulator.gameManager.screenshot === 'function') {
        emulator.gameManager.screenshot()
        // 截图功能通常是异步的，我们返回一个提示
        return 'Screenshot taken (saved to browser downloads)'
      }
    } catch (error) {
      console.error('截屏失败:', error)
    }
    throw new Error('Screenshot functionality not available')
  }

  /**
   * 切换快进
   * @param {boolean} enabled 是否启用快进
   * @returns {boolean} 是否成功设置
   */
  toggleFastForward(enabled) {
    try {
      const emulator = this.getEmulatorInstance()
      if (emulator && emulator.gameManager && typeof emulator.gameManager.toggleFastForward === 'function') {
        emulator.gameManager.toggleFastForward(enabled ? 1 : 0)
        return true
      }
    } catch (error) {
      console.error('切换快进失败:', error)
    }
    return false
  }

  /**
   * 设置快进倍率
   * @param {number} ratio 快进倍率
   * @returns {boolean} 是否成功设置
   */
  setFastForwardRatio(ratio) {
    try {
      const emulator = this.getEmulatorInstance()
      if (emulator && emulator.gameManager && typeof emulator.gameManager.setFastForwardRatio === 'function') {
        emulator.gameManager.setFastForwardRatio(ratio)
        return true
      }
    } catch (error) {
      console.error('设置快进倍率失败:', error)
    }
    return false
  }

  /**
   * 切换倒带功能
   * @param {boolean} enabled 是否启用倒带
   * @returns {boolean} 是否成功设置
   */
  toggleRewind(enabled) {
    try {
      const emulator = this.getEmulatorInstance()
      if (emulator && emulator.gameManager && typeof emulator.gameManager.toggleRewind === 'function') {
        emulator.gameManager.toggleRewind(enabled ? 1 : 0)
        return true
      }
    } catch (error) {
      console.error('切换倒带失败:', error)
    }
    return false
  }
} 