/**
 * 错误处理服务
 * 提供统一的错误处理、分类和用户友好的错误信息
 */

export const ErrorTypes = {
  NETWORK: 'network',
  VALIDATION: 'validation', 
  EMULATOR: 'emulator',
  RESOURCE: 'resource',
  PERMISSION: 'permission',
  TIMEOUT: 'timeout',
  UNKNOWN: 'unknown'
}

export const ErrorSeverity = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
}

/**
 * 错误信息类
 */
export class ErrorInfo {
  constructor({
    type = ErrorTypes.UNKNOWN,
    severity = ErrorSeverity.MEDIUM,
    code = null,
    message = '',
    userMessage = '',
    details = {},
    timestamp = Date.now(),
    stack = null,
    recoverable = true
  } = {}) {
    this.type = type
    this.severity = severity
    this.code = code
    this.message = message
    this.userMessage = userMessage
    this.details = details
    this.timestamp = timestamp
    this.stack = stack
    this.recoverable = recoverable
  }

  /**
   * 获取用户友好的错误信息
   * @returns {string}
   */
  getUserFriendlyMessage() {
    return this.userMessage || this.getDefaultUserMessage()
  }

  /**
   * 获取默认的用户友好信息
   * @returns {string}
   */
  getDefaultUserMessage() {
    switch (this.type) {
      case ErrorTypes.NETWORK:
        return '网络连接出现问题，请检查网络连接后重试'
      case ErrorTypes.VALIDATION:
        return '输入的信息有误，请检查后重试'
      case ErrorTypes.EMULATOR:
        return '模拟器运行出现问题，请尝试重新启动'
      case ErrorTypes.RESOURCE:
        return '游戏资源加载失败，请检查文件是否存在'
      case ErrorTypes.PERMISSION:
        return '没有足够的权限执行此操作'
      case ErrorTypes.TIMEOUT:
        return '操作超时，请重试'
      default:
        return '发生了未知错误，请重试'
    }
  }
}

/**
 * 错误处理服务
 */
export class ErrorHandler {
  constructor() {
    this.errorListeners = new Set()
    this.errorHistory = []
    this.maxHistorySize = 100
    this.setupGlobalErrorHandling()
  }

  /**
   * 设置全局错误处理
   */
  setupGlobalErrorHandling() {
    // 处理JavaScript错误
    window.addEventListener('error', (event) => {
      const errorInfo = this.parseJavaScriptError(event)
      this.handleError(errorInfo)
    })

    // 处理Promise拒绝
    window.addEventListener('unhandledrejection', (event) => {
      const errorInfo = this.parsePromiseError(event)
      this.handleError(errorInfo)
    })
  }

  /**
   * 解析JavaScript错误
   * @param {ErrorEvent} event 错误事件
   * @returns {ErrorInfo}
   */
  parseJavaScriptError(event) {
    let type = ErrorTypes.UNKNOWN
    let severity = ErrorSeverity.MEDIUM

    // 根据错误信息分类
    if (event.filename?.includes('emulatorjs')) {
      type = ErrorTypes.EMULATOR
      severity = ErrorSeverity.HIGH
    } else if (event.message?.includes('fetch') || event.message?.includes('network')) {
      type = ErrorTypes.NETWORK
      severity = ErrorSeverity.MEDIUM
    }

    return new ErrorInfo({
      type,
      severity,
      message: event.message,
      details: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      },
      stack: event.error?.stack
    })
  }

  /**
   * 解析Promise错误
   * @param {PromiseRejectionEvent} event Promise拒绝事件
   * @returns {ErrorInfo}
   */
  parsePromiseError(event) {
    const reason = event.reason
    let type = ErrorTypes.UNKNOWN
    let message = ''

    if (reason instanceof Error) {
      message = reason.message
      if (reason.name === 'TypeError') {
        type = ErrorTypes.VALIDATION
      } else if (reason.name === 'NetworkError') {
        type = ErrorTypes.NETWORK
      }
    } else if (typeof reason === 'string') {
      message = reason
    }

    return new ErrorInfo({
      type,
      message,
      stack: reason?.stack
    })
  }

  /**
   * 处理错误
   * @param {Error|ErrorInfo|string} error 错误对象
   * @param {Object} context 错误上下文
   */
  handleError(error, context = {}) {
    let errorInfo

    // 标准化错误信息
    if (error instanceof ErrorInfo) {
      errorInfo = error
    } else if (error instanceof Error) {
      errorInfo = this.createErrorInfoFromError(error, context)
    } else if (typeof error === 'string') {
      errorInfo = new ErrorInfo({
        message: error,
        details: context
      })
    } else {
      errorInfo = new ErrorInfo({
        message: '未知错误',
        details: { originalError: error, context }
      })
    }

    // 添加到历史记录
    this.addToHistory(errorInfo)

    // 记录错误
    this.logError(errorInfo)

    // 通知监听器
    this.notifyListeners(errorInfo)

    // 发送到监控服务
    this.sendToMonitoring(errorInfo)
  }

  /**
   * 从Error对象创建ErrorInfo
   * @param {Error} error 原始错误
   * @param {Object} context 上下文信息
   * @returns {ErrorInfo}
   */
  createErrorInfoFromError(error, context) {
    let type = ErrorTypes.UNKNOWN
    let severity = ErrorSeverity.MEDIUM

    // 根据错误类型分类
    if (error.name === 'NetworkError' || error.message.includes('fetch')) {
      type = ErrorTypes.NETWORK
    } else if (error.name === 'ValidationError' || error.message.includes('required')) {
      type = ErrorTypes.VALIDATION
    } else if (error.message.includes('timeout')) {
      type = ErrorTypes.TIMEOUT
    } else if (error.message.includes('ROM') || error.message.includes('EmulatorJS')) {
      type = ErrorTypes.EMULATOR
      severity = ErrorSeverity.HIGH
    }

    return new ErrorInfo({
      type,
      severity,
      message: error.message,
      details: { 
        name: error.name,
        ...context 
      },
      stack: error.stack
    })
  }

  /**
   * 创建特定类型的错误
   * @param {string} type 错误类型
   * @param {string} message 错误信息
   * @param {Object} options 选项
   * @returns {ErrorInfo}
   */
  createError(type, message, options = {}) {
    return new ErrorInfo({
      type,
      message,
      ...options
    })
  }

  /**
   * 创建网络错误
   * @param {string} message 错误信息
   * @param {Object} details 详细信息
   * @returns {ErrorInfo}
   */
  createNetworkError(message, details = {}) {
    return this.createError(ErrorTypes.NETWORK, message, {
      severity: ErrorSeverity.MEDIUM,
      details,
      userMessage: '网络连接出现问题，请检查网络后重试'
    })
  }

  /**
   * 创建验证错误
   * @param {string} message 错误信息
   * @param {Object} details 详细信息
   * @returns {ErrorInfo}
   */
  createValidationError(message, details = {}) {
    return this.createError(ErrorTypes.VALIDATION, message, {
      severity: ErrorSeverity.LOW,
      details,
      userMessage: '输入信息有误，请检查后重试'
    })
  }

  /**
   * 创建模拟器错误
   * @param {string} message 错误信息
   * @param {Object} details 详细信息
   * @returns {ErrorInfo}
   */
  createEmulatorError(message, details = {}) {
    return this.createError(ErrorTypes.EMULATOR, message, {
      severity: ErrorSeverity.HIGH,
      details,
      userMessage: '模拟器运行出现问题，请尝试重新启动'
    })
  }

  /**
   * 创建资源错误
   * @param {string} message 错误信息
   * @param {Object} details 详细信息
   * @returns {ErrorInfo}
   */
  createResourceError(message, details = {}) {
    return this.createError(ErrorTypes.RESOURCE, message, {
      severity: ErrorSeverity.MEDIUM,
      details,
      userMessage: '游戏资源加载失败，请检查文件是否存在'
    })
  }

  /**
   * 添加错误监听器
   * @param {function} listener 监听器函数
   */
  addErrorListener(listener) {
    this.errorListeners.add(listener)
  }

  /**
   * 移除错误监听器
   * @param {function} listener 监听器函数
   */
  removeErrorListener(listener) {
    this.errorListeners.delete(listener)
  }

  /**
   * 通知所有监听器
   * @param {ErrorInfo} errorInfo 错误信息
   */
  notifyListeners(errorInfo) {
    this.errorListeners.forEach(listener => {
      try {
        listener(errorInfo)
      } catch (error) {
        console.error('Error in error listener:', error)
      }
    })
  }

  /**
   * 记录错误到控制台
   * @param {ErrorInfo} errorInfo 错误信息
   */
  logError(errorInfo) {
    const logLevel = this.getLogLevel(errorInfo.severity)
    const logMessage = `[${errorInfo.type.toUpperCase()}] ${errorInfo.message}`
    
    console[logLevel](logMessage, {
      details: errorInfo.details,
      stack: errorInfo.stack,
      timestamp: new Date(errorInfo.timestamp).toISOString()
    })
  }

  /**
   * 获取日志级别
   * @param {string} severity 错误严重程度
   * @returns {string}
   */
  getLogLevel(severity) {
    switch (severity) {
      case ErrorSeverity.LOW:
        return 'info'
      case ErrorSeverity.MEDIUM:
        return 'warn'
      case ErrorSeverity.HIGH:
      case ErrorSeverity.CRITICAL:
        return 'error'
      default:
        return 'log'
    }
  }

  /**
   * 添加到历史记录
   * @param {ErrorInfo} errorInfo 错误信息
   */
  addToHistory(errorInfo) {
    this.errorHistory.unshift(errorInfo)
    
    // 限制历史记录大小
    if (this.errorHistory.length > this.maxHistorySize) {
      this.errorHistory = this.errorHistory.slice(0, this.maxHistorySize)
    }
  }

  /**
   * 获取错误历史
   * @param {number} limit 限制数量
   * @returns {ErrorInfo[]}
   */
  getErrorHistory(limit = 10) {
    return this.errorHistory.slice(0, limit)
  }

  /**
   * 清除错误历史
   */
  clearHistory() {
    this.errorHistory = []
  }

  /**
   * 发送到监控服务
   * @param {ErrorInfo} errorInfo 错误信息
   */
  sendToMonitoring(errorInfo) {
    // 只在生产环境发送高严重程度的错误
    if (import.meta.env.PROD && 
        (errorInfo.severity === ErrorSeverity.HIGH || errorInfo.severity === ErrorSeverity.CRITICAL)) {
      
      try {
        // 集成外部监控服务 (如Sentry, LogRocket等)
        if (window.Sentry) {
          window.Sentry.captureException(new Error(errorInfo.message), {
            tags: {
              type: errorInfo.type,
              severity: errorInfo.severity
            },
            extra: errorInfo.details
          })
        }

        // 或者发送到自定义监控端点
        if (this.monitoringEndpoint) {
          fetch(this.monitoringEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              error: errorInfo,
              userAgent: navigator.userAgent,
              url: window.location.href,
              timestamp: errorInfo.timestamp
            })
          }).catch(() => {
            // 静默处理监控服务的错误
          })
        }
      } catch (error) {
        console.warn('Failed to send error to monitoring service:', error)
      }
    }
  }

  /**
   * 设置监控端点
   * @param {string} endpoint 监控服务端点
   */
  setMonitoringEndpoint(endpoint) {
    this.monitoringEndpoint = endpoint
  }

  /**
   * 销毁错误处理器
   */
  destroy() {
    this.errorListeners.clear()
    this.clearHistory()
    
    // 移除全局错误监听器
    window.removeEventListener('error', this.handleError)
    window.removeEventListener('unhandledrejection', this.handleError)
  }
}

// 创建全局错误处理器实例
export const globalErrorHandler = new ErrorHandler() 