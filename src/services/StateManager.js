import { EmulatorStatus, EmulatorEvents } from '../interfaces/IEmulatorAdapter.js'

/**
 * 状态管理服务
 * 管理模拟器的状态、生命周期和状态转换
 */
export class StateManager {
  constructor() {
    this.currentStatus = EmulatorStatus.IDLE
    this.statusHistory = []
    this.stateListeners = new Map()
    this.maxHistorySize = 50
    this.transitionRules = this.defineTransitionRules()
  }

  /**
   * 定义状态转换规则
   * @returns {Map} 状态转换规则映射
   */
  defineTransitionRules() {
    const rules = new Map()
    
    // 从空闲状态可以转换到的状态
    rules.set(EmulatorStatus.IDLE, new Set([
      EmulatorStatus.LOADING,
      EmulatorStatus.ERROR
    ]))
    
    // 从加载状态可以转换到的状态
    rules.set(EmulatorStatus.LOADING, new Set([
      EmulatorStatus.READY,
      EmulatorStatus.ERROR,
      EmulatorStatus.IDLE
    ]))
    
    // 从就绪状态可以转换到的状态
    rules.set(EmulatorStatus.READY, new Set([
      EmulatorStatus.RUNNING,
      EmulatorStatus.ERROR,
      EmulatorStatus.IDLE,
      EmulatorStatus.LOADING
    ]))
    
    // 从运行状态可以转换到的状态
    rules.set(EmulatorStatus.RUNNING, new Set([
      EmulatorStatus.PAUSED,
      EmulatorStatus.ERROR,
      EmulatorStatus.IDLE,
      EmulatorStatus.LOADING,
      EmulatorStatus.READY
    ]))
    
    // 从暂停状态可以转换到的状态
    rules.set(EmulatorStatus.PAUSED, new Set([
      EmulatorStatus.RUNNING,
      EmulatorStatus.ERROR,
      EmulatorStatus.IDLE,
      EmulatorStatus.LOADING,
      EmulatorStatus.READY
    ]))
    
    // 从错误状态可以转换到的状态
    rules.set(EmulatorStatus.ERROR, new Set([
      EmulatorStatus.IDLE,
      EmulatorStatus.LOADING
    ]))
    
    return rules
  }

  /**
   * 获取当前状态
   * @returns {string}
   */
  getCurrentStatus() {
    return this.currentStatus
  }

  /**
   * 检查状态转换是否有效
   * @param {string} fromStatus 源状态
   * @param {string} toStatus 目标状态
   * @returns {boolean}
   */
  isValidTransition(fromStatus, toStatus) {
    if (fromStatus === toStatus) {
      return true // 同状态转换总是有效的
    }
    
    const allowedTransitions = this.transitionRules.get(fromStatus)
    return allowedTransitions ? allowedTransitions.has(toStatus) : false
  }

  /**
   * 设置状态
   * @param {string} newStatus 新状态
   * @param {Object} metadata 状态元数据
   * @returns {boolean} 是否成功设置
   */
  setStatus(newStatus, metadata = {}) {
    const oldStatus = this.currentStatus
    
    // 验证状态转换
    if (!this.isValidTransition(oldStatus, newStatus)) {
      console.warn(`Invalid state transition: ${oldStatus} -> ${newStatus}`)
      return false
    }
    
    // 更新状态
    this.currentStatus = newStatus
    
    // 记录状态变化
    const stateChange = {
      from: oldStatus,
      to: newStatus,
      timestamp: Date.now(),
      metadata
    }
    
    this.addToHistory(stateChange)
    
    // 通知监听器
    this.notifyListeners(newStatus, stateChange)
    
    console.log(`StateManager: Status changed from ${oldStatus} to ${newStatus}`, metadata)
    return true
  }

  /**
   * 强制设置状态（跳过验证）
   * @param {string} newStatus 新状态
   * @param {Object} metadata 状态元数据
   */
  forceSetStatus(newStatus, metadata = {}) {
    const oldStatus = this.currentStatus
    this.currentStatus = newStatus
    
    const stateChange = {
      from: oldStatus,
      to: newStatus,
      timestamp: Date.now(),
      metadata: { ...metadata, forced: true }
    }
    
    this.addToHistory(stateChange)
    this.notifyListeners(newStatus, stateChange)
    
    console.warn(`StateManager: Force status change from ${oldStatus} to ${newStatus}`, metadata)
  }

  /**
   * 重置状态到空闲
   */
  reset() {
    this.setStatus(EmulatorStatus.IDLE, { reason: 'reset' })
  }

  /**
   * 检查状态
   */
  isIdle() {
    return this.currentStatus === EmulatorStatus.IDLE
  }

  isLoading() {
    return this.currentStatus === EmulatorStatus.LOADING
  }

  isReady() {
    return this.currentStatus === EmulatorStatus.READY
  }

  isRunning() {
    return this.currentStatus === EmulatorStatus.RUNNING
  }

  isPaused() {
    return this.currentStatus === EmulatorStatus.PAUSED
  }

  isError() {
    return this.currentStatus === EmulatorStatus.ERROR
  }

  /**
   * 检查是否可以执行操作
   * @param {string} operation 操作名称
   * @returns {boolean}
   */
  canPerformOperation(operation) {
    switch (operation) {
      case 'initialize':
        return this.isIdle() || this.isError()
      
      case 'loadGame':
        return this.isReady() || this.isRunning() || this.isPaused()
      
      case 'pause':
        return this.isRunning()
      
      case 'resume':
        return this.isPaused()
      
      case 'restart':
        return this.isRunning() || this.isPaused()
      
      case 'saveState':
      case 'loadState':
        return this.isRunning() || this.isPaused()
      
      case 'destroy':
        return !this.isIdle()
      
      default:
        return false
    }
  }

  /**
   * 添加状态监听器
   * @param {string} status 要监听的状态
   * @param {function} callback 回调函数
   */
  addStatusListener(status, callback) {
    if (!this.stateListeners.has(status)) {
      this.stateListeners.set(status, new Set())
    }
    this.stateListeners.get(status).add(callback)
  }

  /**
   * 添加全局状态监听器（监听所有状态变化）
   * @param {function} callback 回调函数
   */
  addGlobalListener(callback) {
    this.addStatusListener('*', callback)
  }

  /**
   * 移除状态监听器
   * @param {string} status 状态
   * @param {function} callback 回调函数
   */
  removeStatusListener(status, callback) {
    if (this.stateListeners.has(status)) {
      this.stateListeners.get(status).delete(callback)
    }
  }

  /**
   * 通知状态监听器
   * @param {string} newStatus 新状态
   * @param {Object} stateChange 状态变化信息
   */
  notifyListeners(newStatus, stateChange) {
    // 通知特定状态的监听器
    if (this.stateListeners.has(newStatus)) {
      this.stateListeners.get(newStatus).forEach(callback => {
        try {
          callback(stateChange)
        } catch (error) {
          console.error(`Error in status listener for ${newStatus}:`, error)
        }
      })
    }
    
    // 通知全局监听器
    if (this.stateListeners.has('*')) {
      this.stateListeners.get('*').forEach(callback => {
        try {
          callback(stateChange)
        } catch (error) {
          console.error('Error in global status listener:', error)
        }
      })
    }
  }

  /**
   * 添加到历史记录
   * @param {Object} stateChange 状态变化信息
   */
  addToHistory(stateChange) {
    this.statusHistory.unshift(stateChange)
    
    // 限制历史记录大小
    if (this.statusHistory.length > this.maxHistorySize) {
      this.statusHistory = this.statusHistory.slice(0, this.maxHistorySize)
    }
  }

  /**
   * 获取状态历史
   * @param {number} limit 限制数量
   * @returns {Array}
   */
  getStatusHistory(limit = 10) {
    return this.statusHistory.slice(0, limit)
  }

  /**
   * 获取最后一次状态变化
   * @returns {Object|null}
   */
  getLastStatusChange() {
    return this.statusHistory.length > 0 ? this.statusHistory[0] : null
  }

  /**
   * 获取状态持续时间
   * @returns {number} 毫秒数
   */
  getStatusDuration() {
    const lastChange = this.getLastStatusChange()
    return lastChange ? Date.now() - lastChange.timestamp : 0
  }

  /**
   * 获取状态统计信息
   * @returns {Object}
   */
  getStatusStats() {
    const stats = {
      currentStatus: this.currentStatus,
      statusDuration: this.getStatusDuration(),
      totalTransitions: this.statusHistory.length,
      validTransitions: this.statusHistory.filter(change => !change.metadata?.forced).length,
      forcedTransitions: this.statusHistory.filter(change => change.metadata?.forced).length
    }
    
    // 按状态统计转换次数
    const transitionStats = {}
    this.statusHistory.forEach(change => {
      const key = `${change.from}->${change.to}`
      transitionStats[key] = (transitionStats[key] || 0) + 1
    })
    stats.transitionCounts = transitionStats
    
    // 状态持续时间统计
    const durationStats = {}
    for (let i = 0; i < this.statusHistory.length - 1; i++) {
      const current = this.statusHistory[i]
      const next = this.statusHistory[i + 1]
      const duration = current.timestamp - next.timestamp
      
      if (!durationStats[current.from]) {
        durationStats[current.from] = { total: 0, count: 0, avg: 0 }
      }
      
      durationStats[current.from].total += duration
      durationStats[current.from].count++
      durationStats[current.from].avg = durationStats[current.from].total / durationStats[current.from].count
    }
    stats.durationStats = durationStats
    
    return stats
  }

  /**
   * 等待状态变化
   * @param {string} targetStatus 目标状态
   * @param {number} timeout 超时时间（毫秒）
   * @returns {Promise<Object>} 状态变化信息
   */
  waitForStatus(targetStatus, timeout = 5000) {
    return new Promise((resolve, reject) => {
      // 如果已经是目标状态，立即返回
      if (this.currentStatus === targetStatus) {
        resolve({
          from: this.currentStatus,
          to: targetStatus,
          timestamp: Date.now(),
          metadata: { immediate: true }
        })
        return
      }
      
      // 设置超时
      const timeoutId = setTimeout(() => {
        this.removeStatusListener(targetStatus, listener)
        reject(new Error(`Timeout waiting for status ${targetStatus}`))
      }, timeout)
      
      // 添加监听器
      const listener = (stateChange) => {
        clearTimeout(timeoutId)
        this.removeStatusListener(targetStatus, listener)
        resolve(stateChange)
      }
      
      this.addStatusListener(targetStatus, listener)
    })
  }

  /**
   * 清除状态历史
   */
  clearHistory() {
    this.statusHistory = []
  }

  /**
   * 清除所有监听器
   */
  clearListeners() {
    this.stateListeners.clear()
  }

  /**
   * 销毁状态管理器
   */
  destroy() {
    this.clearListeners()
    this.clearHistory()
    this.currentStatus = EmulatorStatus.IDLE
    console.log('StateManager: Destroyed')
  }
} 