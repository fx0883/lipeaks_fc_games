/**
 * 现代化模拟器工具类
 * 基于新的服务层架构，提供测试、兼容性检查和性能监控功能
 */

import { EmulatorService } from '../services/EmulatorService.js'
import { EmulatorConfig } from '../interfaces/IEmulatorAdapter.js'
import { globalResourceManager } from '../services/ResourceManager.js'
import { globalErrorHandler } from '../services/ErrorHandler.js'
import { getConfig } from '../config/index.js'

/**
 * 模拟器测试工具
 * 使用统一的服务层进行测试，避免重复代码
 */
export class ModernEmulatorTester {
  constructor() {
    this.testResults = []
    this.isRunning = false
    this.currentService = null
  }

  /**
   * 测试ROM兼容性
   * @param {string[]} romPaths ROM文件路径列表
   * @param {Object} options 测试选项
   * @returns {Promise<Array>} 测试结果
   */
  async testROMCompatibility(romPaths, options = {}) {
    const { 
      timeout = getConfig('emulator.initTimeout', 20000),
      stabilityTime = 3000,
      enableAudioTest = true,
      enablePerformanceTest = true
    } = options

    this.isRunning = true
    this.testResults = []

    try {
      for (const romPath of romPaths) {
        if (!this.isRunning) break

        const result = await this.testSingleROM(romPath, {
          timeout,
          stabilityTime,
          enableAudioTest,
          enablePerformanceTest
        })

        this.testResults.push(result)
        
        // 清理服务实例
        if (this.currentService) {
          await this.currentService.destroy()
          this.currentService = null
        }

        // 短暂延迟避免资源冲突
        await this.wait(500)
      }

      return this.testResults
    } finally {
      this.isRunning = false
    }
  }

  /**
   * 测试单个ROM文件
   * @param {string} romPath ROM文件路径
   * @param {Object} options 测试选项
   * @returns {Promise<Object>} 测试结果
   */
  async testSingleROM(romPath, options) {
    const startTime = Date.now()
    const testId = `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    const result = {
      romPath,
      testId,
      startTime: new Date(startTime).toISOString(),
      success: false,
      loadTime: 0,
      errors: [],
      warnings: [],
      performance: {},
      compatibility: {
        loading: false,
        running: false,
        audio: false,
        controls: false,
        stability: false
      }
    }

    try {
      // 1. 创建测试容器
      const containerId = `emulator-test-${testId}`
      this.createTestContainer(containerId)

      // 2. 创建模拟器服务
      this.currentService = new EmulatorService()

      // 3. 设置事件监听
      let gameLoadedResolver
      const gameLoadedPromise = new Promise(resolve => {
        gameLoadedResolver = resolve
      })

      this.currentService.addEventListener('ready', () => {
        result.compatibility.loading = true
        gameLoadedResolver('ready')
      })

      this.currentService.addEventListener('gameStarted', () => {
        result.compatibility.running = true
        gameLoadedResolver('started')
      })

      this.currentService.addEventListener('error', (data) => {
        result.errors.push(data.error)
        gameLoadedResolver('error')
      })

      // 4. 初始化模拟器
      const config = new EmulatorConfig({
        containerId,
        romPath,
        dataPath: getConfig('emulator.dataPath'),
        startOnLoaded: true
      })

      const loadStartTime = Date.now()
      await this.currentService.initialize(config)
      result.loadTime = Date.now() - loadStartTime

      // 5. 等待游戏加载或超时
      const gameStatus = await Promise.race([
        gameLoadedPromise,
        this.createTimeoutPromise(options.timeout, 'Game loading timeout')
      ])

      if (gameStatus === 'error') {
        throw new Error(result.errors[result.errors.length - 1] || 'Unknown error')
      }

      // 6. 稳定性测试
      if (options.stabilityTime > 0) {
        await this.wait(options.stabilityTime)
        result.compatibility.stability = this.currentService.getStatus() === 'running'
      }

      // 7. 音频测试
      if (options.enableAudioTest) {
        result.compatibility.audio = await this.testAudioCompatibility()
      }

      // 8. 控制测试
      result.compatibility.controls = await this.testControlsCompatibility()

      // 9. 性能测试
      if (options.enablePerformanceTest) {
        result.performance = await this.measurePerformance()
      }

      result.success = Object.values(result.compatibility).every(Boolean)

    } catch (error) {
      result.errors.push(error.message)
      result.success = false
    } finally {
      result.endTime = new Date().toISOString()
      result.duration = Date.now() - startTime
      
      // 清理测试容器
      this.removeTestContainer(testId)
    }

    return result
  }

  /**
   * 测试音频兼容性
   * @returns {Promise<boolean>}
   */
  async testAudioCompatibility() {
    try {
      if (!this.currentService) return false

      // 测试音量控制
      const volumeResult = this.currentService.setVolume(0.5)
      const muteResult = this.currentService.setMuted(true)
      this.currentService.setMuted(false)

      return volumeResult && muteResult
    } catch (error) {
      return false
    }
  }

  /**
   * 测试控制兼容性
   * @returns {Promise<boolean>}
   */
  async testControlsCompatibility() {
    try {
      if (!this.currentService) return false

      // 测试暂停/恢复
      const pauseResult = this.currentService.pause()
      await this.wait(100)
      const resumeResult = this.currentService.resume()

      return pauseResult && resumeResult
    } catch (error) {
      return false
    }
  }

  /**
   * 性能测量
   * @returns {Promise<Object>}
   */
  async measurePerformance() {
    const metrics = {
      memoryUsage: 0,
      cpuUsage: 0,
      fps: 0,
      cacheStats: {}
    }

    try {
      // 内存使用情况
      if (performance.memory) {
        metrics.memoryUsage = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024)
      }

      // 缓存统计
      metrics.cacheStats = globalResourceManager.getCacheStats()

      // CPU使用率（简化估算）
      const startTime = performance.now()
      let iterations = 0
      const duration = 100 // 100ms测试

      while (performance.now() - startTime < duration) {
        iterations++
      }

      // 基于迭代次数估算CPU使用率
      metrics.cpuUsage = Math.max(0, Math.min(100, 100 - (iterations / 10000)))

    } catch (error) {
      console.warn('Performance measurement error:', error)
    }

    return metrics
  }

  /**
   * 创建测试容器
   * @param {string} containerId 容器ID
   */
  createTestContainer(containerId) {
    const container = document.createElement('div')
    container.id = containerId
    container.style.cssText = `
      position: absolute;
      top: -9999px;
      left: -9999px;
      width: 640px;
      height: 480px;
      visibility: hidden;
      pointer-events: none;
    `
    document.body.appendChild(container)
  }

  /**
   * 移除测试容器
   * @param {string} testId 测试ID
   */
  removeTestContainer(testId) {
    const containerId = `emulator-test-${testId}`
    const container = document.getElementById(containerId)
    if (container) {
      container.remove()
    }
  }

  /**
   * 创建超时Promise
   * @param {number} timeout 超时时间
   * @param {string} message 超时消息
   * @returns {Promise}
   */
  createTimeoutPromise(timeout, message) {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error(message)), timeout)
    })
  }

  /**
   * 等待指定时间
   * @param {number} ms 毫秒数
   * @returns {Promise}
   */
  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * 停止测试
   */
  stop() {
    this.isRunning = false
  }

  /**
   * 获取测试结果摘要
   * @returns {Object}
   */
  getSummary() {
    const total = this.testResults.length
    const successful = this.testResults.filter(r => r.success).length
    const failed = total - successful

    const avgLoadTime = total > 0 
      ? this.testResults.reduce((sum, r) => sum + r.loadTime, 0) / total 
      : 0

    return {
      total,
      successful,
      failed,
      successRate: total > 0 ? (successful / total * 100).toFixed(2) + '%' : '0%',
      avgLoadTime: Math.round(avgLoadTime) + 'ms',
      errors: this.testResults.flatMap(r => r.errors)
    }
  }

  /**
   * 导出测试报告
   * @param {string} format 导出格式 ('json' | 'csv')
   * @returns {string}
   */
  exportReport(format = 'json') {
    if (format === 'csv') {
      return this.exportCSV()
    }
    
    return JSON.stringify({
      summary: this.getSummary(),
      results: this.testResults,
      timestamp: new Date().toISOString(),
      environment: {
        userAgent: navigator.userAgent,
        config: getConfig()
      }
    }, null, 2)
  }

  /**
   * 导出CSV格式报告
   * @returns {string}
   */
  exportCSV() {
    const headers = [
      'ROM Path', 'Success', 'Load Time (ms)', 'Loading', 'Running', 
      'Audio', 'Controls', 'Stability', 'Memory (MB)', 'Errors'
    ]

    const rows = this.testResults.map(result => [
      result.romPath,
      result.success,
      result.loadTime,
      result.compatibility.loading,
      result.compatibility.running,
      result.compatibility.audio,
      result.compatibility.controls,
      result.compatibility.stability,
      result.performance.memoryUsage || 0,
      result.errors.join('; ')
    ])

    return [headers, ...rows].map(row => 
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n')
  }
}

/**
 * 浏览器兼容性检查器（现代化版本）
 */
export class ModernBrowserChecker {
  constructor() {
    this.requirements = {
      webassembly: 'WebAssembly支持',
      sharedArrayBuffer: 'SharedArrayBuffer支持', 
      audioContext: '音频上下文支持',
      fullscreen: '全屏API支持',
      indexedDB: 'IndexedDB支持',
      fetch: 'Fetch API支持',
      es6: 'ES6语法支持'
    }
  }

  /**
   * 执行完整的兼容性检查
   * @returns {Object} 检查结果
   */
  checkAll() {
    const results = {}
    let allPassed = true

    for (const [feature, description] of Object.entries(this.requirements)) {
      const passed = this.checkFeature(feature)
      results[feature] = {
        supported: passed,
        description,
        required: true
      }
      
      if (!passed) allPassed = false
    }

    return {
      compatible: allPassed,
      results,
      summary: this.generateSummary(results),
      recommendations: this.getRecommendations(results)
    }
  }

  /**
   * 检查单个特性
   * @param {string} feature 特性名称
   * @returns {boolean}
   */
  checkFeature(feature) {
    switch (feature) {
      case 'webassembly':
        return typeof WebAssembly !== 'undefined'
      
      case 'sharedArrayBuffer':
        return typeof SharedArrayBuffer !== 'undefined'
      
      case 'audioContext':
        return typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined'
      
      case 'fullscreen':
        return document.fullscreenEnabled || document.webkitFullscreenEnabled || document.msFullscreenEnabled
      
      case 'indexedDB':
        return typeof indexedDB !== 'undefined'
      
      case 'fetch':
        return typeof fetch !== 'undefined'
      
      case 'es6':
        try {
          // 测试基本ES6特性
          eval('const test = () => {}; class Test {}; [1,2,3].map(x => x)')
          return true
        } catch {
          return false
        }
      
      default:
        return false
    }
  }

  /**
   * 生成摘要信息
   * @param {Object} results 检查结果
   * @returns {Object}
   */
  generateSummary(results) {
    const supported = Object.values(results).filter(r => r.supported).length
    const total = Object.keys(results).length
    const percentage = Math.round((supported / total) * 100)

    return {
      supported,
      total,
      percentage,
      status: percentage === 100 ? 'excellent' : percentage >= 80 ? 'good' : 'poor'
    }
  }

  /**
   * 获取推荐建议
   * @param {Object} results 检查结果
   * @returns {Array}
   */
  getRecommendations(results) {
    const recommendations = []

    if (!results.webassembly?.supported) {
      recommendations.push({
        type: 'critical',
        message: '请升级到支持WebAssembly的现代浏览器',
        action: '升级浏览器到Chrome 57+, Firefox 52+, Safari 11+, Edge 16+'
      })
    }

    if (!results.sharedArrayBuffer?.supported) {
      recommendations.push({
        type: 'warning', 
        message: 'SharedArrayBuffer不支持，可能影响多线程性能',
        action: '确保使用HTTPS并设置正确的CORS头部'
      })
    }

    if (!results.audioContext?.supported) {
      recommendations.push({
        type: 'warning',
        message: '音频功能可能受限',
        action: '升级浏览器以获得完整音频支持'
      })
    }

    return recommendations
  }
}

/**
 * 性能比较工具（现代化版本）
 */
export class ModernPerformanceComparer {
  constructor() {
    this.testResults = new Map()
  }

  /**
   * 比较不同配置的性能
   * @param {Array} configs 配置列表
   * @param {string} romPath 测试ROM路径
   * @returns {Promise<Object>} 比较结果
   */
  async compareConfigurations(configs, romPath) {
    const results = {}

    for (const config of configs) {
      console.log(`Testing configuration: ${config.name}`)
      
      const metrics = await this.testConfiguration(config, romPath)
      results[config.name] = metrics

      // 清理间隔
      await this.wait(1000)
    }

    return {
      results,
      comparison: this.generateComparison(results),
      recommendation: this.getPerformanceRecommendation(results)
    }
  }

  /**
   * 测试单个配置
   * @param {Object} config 配置
   * @param {string} romPath ROM路径
   * @returns {Promise<Object>}
   */
  async testConfiguration(config, romPath) {
    const tester = new ModernEmulatorTester()
    
    try {
      const testResult = await tester.testSingleROM(romPath, {
        ...config.options,
        enablePerformanceTest: true
      })

      return {
        ...testResult.performance,
        loadTime: testResult.loadTime,
        success: testResult.success,
        compatibility: testResult.compatibility
      }
    } finally {
      // 确保清理
      tester.stop()
    }
  }

  /**
   * 生成性能比较
   * @param {Object} results 测试结果
   * @returns {Object}
   */
  generateComparison(results) {
    const metrics = ['loadTime', 'memoryUsage', 'cpuUsage']
    const comparison = {}

    for (const metric of metrics) {
      const values = Object.entries(results).map(([name, data]) => ({
        name,
        value: data[metric] || 0
      }))

      // 排序找出最佳和最差
      values.sort((a, b) => {
        // 对于时间和使用率，越小越好
        return metric === 'loadTime' || metric.includes('Usage') 
          ? a.value - b.value 
          : b.value - a.value
      })

      comparison[metric] = {
        best: values[0],
        worst: values[values.length - 1],
        values: values
      }
    }

    return comparison
  }

  /**
   * 获取性能推荐
   * @param {Object} results 测试结果
   * @returns {Object}
   */
  getPerformanceRecommendation(results) {
    const recommendations = []
    
    // 找出综合表现最佳的配置
    const scores = Object.entries(results).map(([name, data]) => {
      let score = 0
      
      // 加载时间得分（越低越好）
      score += Math.max(0, 100 - (data.loadTime / 100))
      
      // 内存使用得分（越低越好）
      score += Math.max(0, 100 - data.memoryUsage)
      
      // 成功率得分
      score += data.success ? 50 : 0
      
      return { name, score, data }
    })

    scores.sort((a, b) => b.score - a.score)

    return {
      recommended: scores[0],
      alternatives: scores.slice(1, 3),
      reasons: this.generateRecommendationReasons(scores[0])
    }
  }

  /**
   * 生成推荐理由
   * @param {Object} recommended 推荐配置
   * @returns {Array}
   */
  generateRecommendationReasons(recommended) {
    const reasons = []
    const data = recommended.data

    if (data.loadTime < 2000) {
      reasons.push('加载速度优秀')
    }

    if (data.memoryUsage < 50) {
      reasons.push('内存使用效率高')
    }

    if (data.success) {
      reasons.push('兼容性良好')
    }

    return reasons
  }

  /**
   * 等待函数
   * @param {number} ms 毫秒
   * @returns {Promise}
   */
  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// 导出便捷实例
export const emulatorTester = new ModernEmulatorTester()
export const browserChecker = new ModernBrowserChecker()
export const performanceComparer = new ModernPerformanceComparer() 