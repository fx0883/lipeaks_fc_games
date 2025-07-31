/**
 * 浏览器兼容性检查工具
 * 用于验证EmulatorJS运行所需的浏览器特性
 */

class BrowserCompatibilityChecker {
  constructor() {
    this.results = {}
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
   * 检查所有浏览器兼容性要求
   * @returns {Object} 检查结果
   */
  checkAll() {
    console.log('🔍 开始浏览器兼容性检查...')

    this.results = {
      webassembly: this.checkWebAssembly(),
      sharedArrayBuffer: this.checkSharedArrayBuffer(),
      audioContext: this.checkAudioContext(),
      fullscreen: this.checkFullscreen(),
      indexedDB: this.checkIndexedDB(),
      fetch: this.checkFetch(),
      es6: this.checkES6(),
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    }

    this.generateReport()
    return this.results
  }

  /**
   * 检查WebAssembly支持
   */
  checkWebAssembly() {
    try {
      const isSupported = typeof WebAssembly !== 'undefined' && 
                         typeof WebAssembly.instantiate === 'function'
      
      return {
        supported: isSupported,
        details: isSupported ? 'WebAssembly API可用' : 'WebAssembly不受支持',
        required: true
      }
    } catch (error) {
      return {
        supported: false,
        details: `WebAssembly检查失败: ${error.message}`,
        required: true
      }
    }
  }

  /**
   * 检查SharedArrayBuffer支持
   */
  checkSharedArrayBuffer() {
    try {
      const isSupported = typeof SharedArrayBuffer !== 'undefined'
      
      return {
        supported: isSupported,
        details: isSupported ? 'SharedArrayBuffer可用' : 'SharedArrayBuffer不受支持',
        required: false, // 可选特性
        note: '需要HTTPS和特定的HTTP头部设置'
      }
    } catch (error) {
      return {
        supported: false,
        details: `SharedArrayBuffer检查失败: ${error.message}`,
        required: false
      }
    }
  }

  /**
   * 检查音频上下文支持
   */
  checkAudioContext() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      const isSupported = typeof AudioCtx !== 'undefined'
      
      return {
        supported: isSupported,
        details: isSupported ? '音频上下文API可用' : '音频上下文不受支持',
        required: true
      }
    } catch (error) {
      return {
        supported: false,
        details: `音频上下文检查失败: ${error.message}`,
        required: true
      }
    }
  }

  /**
   * 检查全屏API支持
   */
  checkFullscreen() {
    try {
      const isSupported = document.fullscreenEnabled || 
                         document.webkitFullscreenEnabled || 
                         document.mozFullScreenEnabled ||
                         document.msFullscreenEnabled
      
      return {
        supported: !!isSupported,
        details: isSupported ? '全屏API可用' : '全屏API不受支持',
        required: false // 可选特性
      }
    } catch (error) {
      return {
        supported: false,
        details: `全屏API检查失败: ${error.message}`,
        required: false
      }
    }
  }

  /**
   * 检查IndexedDB支持
   */
  checkIndexedDB() {
    try {
      const isSupported = 'indexedDB' in window
      
      return {
        supported: isSupported,
        details: isSupported ? 'IndexedDB可用' : 'IndexedDB不受支持',
        required: false // 存档功能需要
      }
    } catch (error) {
      return {
        supported: false,
        details: `IndexedDB检查失败: ${error.message}`,
        required: false
      }
    }
  }

  /**
   * 检查Fetch API支持
   */
  checkFetch() {
    try {
      const isSupported = typeof fetch !== 'undefined'
      
      return {
        supported: isSupported,
        details: isSupported ? 'Fetch API可用' : 'Fetch API不受支持',
        required: true
      }
    } catch (error) {
      return {
        supported: false,
        details: `Fetch API检查失败: ${error.message}`,
        required: true
      }
    }
  }

  /**
   * 检查ES6语法支持
   */
  checkES6() {
    try {
      // 测试ES6特性
      const testArrow = () => true
      const testTemplate = `template ${testArrow()}`
      const testLet = (() => { let x = 1; return x === 1 })()
      const testConst = (() => { const y = 2; return y === 2 })()
      const testPromise = typeof Promise !== 'undefined'
      
      const isSupported = testTemplate && testLet && testConst && testPromise
      
      return {
        supported: isSupported,
        details: isSupported ? 'ES6语法支持良好' : 'ES6语法支持不完整',
        required: true
      }
    } catch (error) {
      return {
        supported: false,
        details: `ES6语法检查失败: ${error.message}`,
        required: true
      }
    }
  }

  /**
   * 生成兼容性报告
   */
  generateReport() {
    console.log('📊 浏览器兼容性检查报告:')
    console.log('='.repeat(50))

    // 计算总体兼容性
    const requiredFeatures = Object.values(this.results).filter(r => r.required)
    const supportedRequired = requiredFeatures.filter(r => r.supported).length
    const totalRequired = requiredFeatures.length
    
    const optionalFeatures = Object.values(this.results).filter(r => r && !r.required)
    const supportedOptional = optionalFeatures.filter(r => r.supported).length
    const totalOptional = optionalFeatures.length

    console.log(`📱 用户代理: ${this.results.userAgent}`)
    console.log(`✅ 必需特性: ${supportedRequired}/${totalRequired} (${(supportedRequired/totalRequired*100).toFixed(1)}%)`)
    console.log(`🔧 可选特性: ${supportedOptional}/${totalOptional} (${(supportedOptional/totalOptional*100).toFixed(1)}%)`)
    console.log('')

    // 详细结果
    Object.entries(this.results).forEach(([key, result]) => {
      if (key === 'userAgent' || key === 'timestamp') return
      
      const status = result.supported ? '✅' : '❌'
      const required = result.required ? '(必需)' : '(可选)'
      const name = this.requirements[key] || key
      
      console.log(`${status} ${name} ${required}`)
      console.log(`   ${result.details}`)
      if (result.note) {
        console.log(`   注意: ${result.note}`)
      }
      console.log('')
    })

    // 总体评估
    if (supportedRequired === totalRequired) {
      console.log('🎉 浏览器完全兼容EmulatorJS!')
    } else {
      console.log('⚠️  浏览器不完全兼容，可能影响EmulatorJS运行')
    }

    // 建议
    this.generateRecommendations()
  }

  /**
   * 生成改进建议
   */
  generateRecommendations() {
    const recommendations = []

    if (!this.results.webassembly?.supported) {
      recommendations.push('请升级到支持WebAssembly的现代浏览器版本')
    }

    if (!this.results.sharedArrayBuffer?.supported) {
      recommendations.push('配置HTTPS和适当的HTTP头部以启用SharedArrayBuffer')
    }

    if (!this.results.audioContext?.supported) {
      recommendations.push('浏览器不支持音频API，游戏将无声音')
    }

    if (!this.results.fullscreen?.supported) {
      recommendations.push('全屏功能不可用，但不影响基本游戏功能')
    }

    if (recommendations.length > 0) {
      console.log('💡 改进建议:')
      recommendations.forEach((rec, index) => {
        console.log(`   ${index + 1}. ${rec}`)
      })
    }
  }

  /**
   * 检查特定浏览器版本
   */
  getBrowserInfo() {
    const ua = navigator.userAgent
    let browser = 'Unknown'
    let version = 'Unknown'

    if (ua.includes('Chrome/')) {
      browser = 'Chrome'
      version = ua.match(/Chrome\/(\d+)/)?.[1] || 'Unknown'
    } else if (ua.includes('Firefox/')) {
      browser = 'Firefox'
      version = ua.match(/Firefox\/(\d+)/)?.[1] || 'Unknown'
    } else if (ua.includes('Safari/') && !ua.includes('Chrome')) {
      browser = 'Safari'
      version = ua.match(/Version\/(\d+)/)?.[1] || 'Unknown'
    } else if (ua.includes('Edge/')) {
      browser = 'Edge'
      version = ua.match(/Edge\/(\d+)/)?.[1] || 'Unknown'
    }

    return { browser, version, userAgent: ua }
  }

  /**
   * 导出检查结果
   */
  exportResults() {
    const report = {
      summary: {
        browser: this.getBrowserInfo(),
        timestamp: this.results.timestamp,
        compatible: Object.values(this.results)
          .filter(r => r.required)
          .every(r => r.supported)
      },
      details: this.results,
      recommendations: this.getRecommendationsList()
    }

    const dataStr = JSON.stringify(report, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    
    const link = document.createElement('a')
    link.href = URL.createObjectURL(dataBlob)
    link.download = `browser_compatibility_${Date.now()}.json`
    link.click()

    return report
  }

  /**
   * 获取建议列表
   */
  getRecommendationsList() {
    const recommendations = []

    Object.entries(this.results).forEach(([key, result]) => {
      if (key === 'userAgent' || key === 'timestamp') return
      
      if (!result.supported && result.required) {
        recommendations.push({
          feature: key,
          issue: result.details,
          severity: 'high',
          suggestion: this.getSuggestionForFeature(key)
        })
      } else if (!result.supported) {
        recommendations.push({
          feature: key,
          issue: result.details,
          severity: 'low',
          suggestion: this.getSuggestionForFeature(key)
        })
      }
    })

    return recommendations
  }

  /**
   * 获取特定特性的建议
   */
  getSuggestionForFeature(feature) {
    const suggestions = {
      webassembly: '升级到Chrome 57+, Firefox 52+, Safari 11+, 或 Edge 16+',
      sharedArrayBuffer: '确保使用HTTPS并配置Cross-Origin-Embedder-Policy头部',
      audioContext: '升级浏览器或检查音频权限设置',
      fullscreen: '升级浏览器，全屏功能为增强特性',
      indexedDB: '启用浏览器存储功能，或使用其他存储方案',
      fetch: '升级到现代浏览器版本',
      es6: '升级到支持ES6的现代浏览器'
    }

    return suggestions[feature] || '请查阅EmulatorJS兼容性文档'
  }
}

// 导出单例实例
const browserChecker = new BrowserCompatibilityChecker()

export default browserChecker 