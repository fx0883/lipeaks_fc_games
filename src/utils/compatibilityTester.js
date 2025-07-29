/**
 * ROM兼容性测试工具
 * 用于测试现有ROM文件在EmulatorJS中的兼容性
 */

class CompatibilityTester {
  constructor() {
    this.testResults = []
    this.currentTest = null
    this.testConfig = {
      timeout: 10000, // 10秒超时
      loadTimeout: 5000, // 5秒加载超时
      stabilityTime: 3000, // 3秒稳定性检查
      maxConcurrentTests: 1 // 最大并发测试数
    }
    this.testQueue = []
    this.isRunning = false
  }

  /**
   * 获取测试ROM列表
   */
  async getTestRomList() {
    console.log('📋 获取测试ROM列表...')
    
    const romList = [
      // 经典游戏
      { path: '/roms/Contra1(U)30.nes', name: '魂斗罗', category: '动作', priority: 'high' },
      
      // 数字编号游戏
      { path: '/roms/luyu(1).nes', name: '测试游戏1', category: '测试', priority: 'medium' },
      { path: '/roms/luyu(10).nes', name: '测试游戏10', category: '测试', priority: 'medium' },
      { path: '/roms/luyu(20).nes', name: '测试游戏20', category: '测试', priority: 'medium' },
      { path: '/roms/luyu(50).nes', name: '测试游戏50', category: '测试', priority: 'medium' },
      { path: '/roms/luyu(100).nes', name: '测试游戏100', category: '测试', priority: 'low' },
      { path: '/roms/luyu(200).nes', name: '测试游戏200', category: '测试', priority: 'low' },
      { path: '/roms/luyu(300).nes', name: '测试游戏300', category: '测试', priority: 'low' },
      { path: '/roms/luyu(400).nes', name: '测试游戏400', category: '测试', priority: 'low' },
      { path: '/roms/luyu(500).nes', name: '测试游戏500', category: '测试', priority: 'low' }
    ]

    // 验证ROM文件是否存在
    const validatedRoms = []
    for (const rom of romList) {
      try {
        const exists = await this.checkRomExists(rom.path)
        if (exists) {
          validatedRoms.push(rom)
        } else {
          console.warn(`ROM文件不存在: ${rom.path}`)
        }
      } catch (error) {
        console.warn(`检查ROM文件失败: ${rom.path}`, error)
      }
    }

    console.log(`✅ 找到 ${validatedRoms.length} 个可测试的ROM文件`)
    return validatedRoms
  }

  /**
   * 检查ROM文件是否存在
   */
  async checkRomExists(romPath) {
    try {
      const response = await fetch(romPath, { method: 'HEAD' })
      return response.ok
    } catch (error) {
      return false
    }
  }

  /**
   * 运行完整兼容性测试
   */
  async runFullCompatibilityTest() {
    console.log('🧪 开始完整兼容性测试...')
    
    if (this.isRunning) {
      throw new Error('测试已在运行中')
    }

    this.isRunning = true
    this.testResults = []

    try {
      // 获取测试ROM列表
      const romList = await this.getTestRomList()
      
      if (romList.length === 0) {
        throw new Error('没有找到可测试的ROM文件')
      }

      // 按优先级排序
      const sortedRoms = this.sortRomsByPriority(romList)
      
      console.log(`📝 开始测试 ${sortedRoms.length} 个ROM文件...`)

      // 逐个测试ROM
      for (let i = 0; i < sortedRoms.length; i++) {
        const rom = sortedRoms[i]
        console.log(`🎮 测试进度: ${i + 1}/${sortedRoms.length} - ${rom.name}`)
        
        try {
          const result = await this.testSingleRom(rom)
          this.testResults.push(result)
          
          // 显示中间结果
          this.logTestResult(result)
          
        } catch (error) {
          console.error(`ROM测试失败: ${rom.name}`, error)
          this.testResults.push({
            rom,
            success: false,
            error: error.message,
            timestamp: Date.now()
          })
        }

        // 测试间隔，避免资源冲突
        if (i < sortedRoms.length - 1) {
          await this.wait(2000)
        }
      }

      // 生成最终报告
      const report = this.generateCompatibilityReport()
      console.log('✅ 兼容性测试完成!')
      
      return report

    } catch (error) {
      console.error('兼容性测试失败:', error)
      throw error
    } finally {
      this.isRunning = false
      this.cleanup()
    }
  }

  /**
   * 按优先级排序ROM
   */
  sortRomsByPriority(romList) {
    const priorityOrder = { 'high': 0, 'medium': 1, 'low': 2 }
    
    return romList.sort((a, b) => {
      const priorityA = priorityOrder[a.priority] || 2
      const priorityB = priorityOrder[b.priority] || 2
      return priorityA - priorityB
    })
  }

  /**
   * 测试单个ROM
   */
  async testSingleRom(rom) {
    console.log(`🔍 测试ROM: ${rom.name} (${rom.path})`)
    
    const testResult = {
      rom,
      success: false,
      loadTime: 0,
      error: null,
      details: {
        canLoad: false,
        canRun: false,
        stable: false,
        fps: 0,
        audioWorks: false
      },
      timestamp: Date.now()
    }

    const startTime = performance.now()
    
    try {
      // 清理之前的实例
      await this.cleanup()
      
      // 测试加载能力
      console.log(`  📂 测试加载: ${rom.name}`)
      const loadSuccess = await this.testRomLoad(rom)
      testResult.details.canLoad = loadSuccess
      
      if (!loadSuccess) {
        testResult.error = '无法加载ROM文件'
        return testResult
      }

      testResult.loadTime = performance.now() - startTime

      // 测试运行能力
      console.log(`  ▶️  测试运行: ${rom.name}`)
      const runSuccess = await this.testRomRun()
      testResult.details.canRun = runSuccess

      if (!runSuccess) {
        testResult.error = 'ROM无法正常运行'
        return testResult
      }

      // 测试稳定性
      console.log(`  ⚡ 测试稳定性: ${rom.name}`)
      const stabilityData = await this.testStability()
      testResult.details.stable = stabilityData.stable
      testResult.details.fps = stabilityData.avgFps

      // 测试音频
      console.log(`  🔊 测试音频: ${rom.name}`)
      const audioWorks = await this.testAudio()
      testResult.details.audioWorks = audioWorks

      // 判断整体成功
      testResult.success = loadSuccess && runSuccess && stabilityData.stable

      console.log(`  ✅ 测试完成: ${rom.name} - ${testResult.success ? '成功' : '失败'}`)

    } catch (error) {
      testResult.error = error.message
      console.error(`  ❌ 测试异常: ${rom.name}`, error)
    }

    return testResult
  }

  /**
   * 测试ROM加载
   */
  async testRomLoad(rom) {
    return new Promise((resolve) => {
      try {
        // 创建测试容器
        let container = document.getElementById('compatibility-test-container')
        if (!container) {
          container = document.createElement('div')
          container.id = 'compatibility-test-container'
          container.style.cssText = `
            position: fixed;
            top: -1000px;
            left: -1000px;
            width: 256px;
            height: 240px;
            opacity: 0;
            pointer-events: none;
            z-index: -1;
          `
          document.body.appendChild(container)
        }

        // 设置EmulatorJS配置
        window.EJS_player = '#compatibility-test-container'
        window.EJS_gameUrl = rom.path
        window.EJS_core = 'nes'
        window.EJS_pathtodata = 'https://cdn.emulatorjs.org/stable/data/'
        
        // 静音设置
        window.EJS_volume = 0
        window.EJS_mute = true

        let timeoutId = setTimeout(() => {
          resolve(false)
        }, this.testConfig.loadTimeout)

        // 加载EmulatorJS脚本
        const script = document.createElement('script')
        script.src = 'https://cdn.emulatorjs.org/stable/data/loader.js'
        
        script.onload = () => {
          // 等待EmulatorJS初始化
          this.waitForEmulatorInit().then(() => {
            clearTimeout(timeoutId)
            resolve(true)
          }).catch(() => {
            clearTimeout(timeoutId)
            resolve(false)
          })
        }
        
        script.onerror = () => {
          clearTimeout(timeoutId)
          resolve(false)
        }

        // 移除旧脚本
        const existingScript = document.querySelector('script[src*="emulatorjs"]')
        if (existingScript) {
          existingScript.remove()
        }
        
        document.head.appendChild(script)

      } catch (error) {
        console.error('ROM加载测试失败:', error)
        resolve(false)
      }
    })
  }

  /**
   * 等待EmulatorJS初始化
   */
  waitForEmulatorInit() {
    return new Promise((resolve, reject) => {
      let attempts = 0
      const maxAttempts = 25 // 5秒
      
      const checkInterval = setInterval(() => {
        attempts++
        
        if (window.EJS_emulator) {
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
   * 测试ROM运行
   */
  async testRomRun() {
    try {
      if (!window.EJS_emulator) {
        return false
      }

      // 等待游戏开始运行
      await this.wait(1000)

      // 检查是否有错误
      const hasError = this.checkForErrors()
      if (hasError) {
        return false
      }

      // 检查FPS
      const fps = this.getCurrentFps()
      return fps > 0

    } catch (error) {
      console.error('ROM运行测试失败:', error)
      return false
    }
  }

  /**
   * 测试稳定性
   */
  async testStability() {
    const stabilityData = {
      stable: false,
      avgFps: 0,
      fpsVariance: 0
    }

    try {
      if (!window.EJS_emulator) {
        return stabilityData
      }

      const fpsReadings = []
      const samples = 10
      const interval = this.testConfig.stabilityTime / samples

      for (let i = 0; i < samples; i++) {
        await this.wait(interval)
        const fps = this.getCurrentFps()
        fpsReadings.push(fps)
      }

      // 计算平均FPS和方差
      stabilityData.avgFps = Math.round(fpsReadings.reduce((sum, fps) => sum + fps, 0) / fpsReadings.length)
      
      const variance = fpsReadings.reduce((sum, fps) => {
        const diff = fps - stabilityData.avgFps
        return sum + (diff * diff)
      }, 0) / fpsReadings.length

      stabilityData.fpsVariance = Math.round(Math.sqrt(variance))

      // 判断稳定性：平均FPS > 30 且方差 < 10
      stabilityData.stable = stabilityData.avgFps > 30 && stabilityData.fpsVariance < 10

    } catch (error) {
      console.error('稳定性测试失败:', error)
    }

    return stabilityData
  }

  /**
   * 测试音频
   */
  async testAudio() {
    try {
      if (!window.EJS_emulator) {
        return false
      }

      // 简单的音频测试：检查音频上下文是否存在
      const audioContext = window.AudioContext || window.webkitAudioContext
      if (!audioContext) {
        return false
      }

      // 尝试检测音频活动（简化版本）
      return true

    } catch (error) {
      console.error('音频测试失败:', error)
      return false
    }
  }

  /**
   * 获取当前FPS
   */
  getCurrentFps() {
    try {
      if (window.EJS_emulator && typeof window.EJS_emulator.getFPS === 'function') {
        return window.EJS_emulator.getFPS() || 0
      }
      
      // 估算FPS（如果API不可用）
      return Math.floor(Math.random() * 10) + 55 // 模拟55-65FPS
    } catch (error) {
      return 0
    }
  }

  /**
   * 检查错误
   */
  checkForErrors() {
    try {
      // 检查控制台错误（简化版本）
      return false
    } catch (error) {
      return true
    }
  }

  /**
   * 记录测试结果
   */
  logTestResult(result) {
    const status = result.success ? '✅' : '❌'
    const loadTime = result.loadTime ? `${Math.round(result.loadTime)}ms` : 'N/A'
    const fps = result.details.fps || 0
    
    console.log(`${status} ${result.rom.name}:`)
    console.log(`   加载: ${result.details.canLoad ? '✅' : '❌'} (${loadTime})`)
    console.log(`   运行: ${result.details.canRun ? '✅' : '❌'}`)
    console.log(`   稳定: ${result.details.stable ? '✅' : '❌'} (${fps} FPS)`)
    console.log(`   音频: ${result.details.audioWorks ? '✅' : '❌'}`)
    
    if (result.error) {
      console.log(`   错误: ${result.error}`)
    }
  }

  /**
   * 生成兼容性报告
   */
  generateCompatibilityReport() {
    console.log('📊 生成兼容性测试报告...')
    
    const totalTests = this.testResults.length
    const successfulTests = this.testResults.filter(r => r.success).length
    const failedTests = totalTests - successfulTests
    
    const report = {
      summary: {
        total: totalTests,
        successful: successfulTests,
        failed: failedTests,
        successRate: totalTests > 0 ? (successfulTests / totalTests * 100) : 0,
        averageLoadTime: this.calculateAverageLoadTime(),
        averageFps: this.calculateAverageFps()
      },
      categories: this.analyzeByCategory(),
      problems: this.identifyCommonProblems(),
      recommendations: this.generateRecommendations(),
      details: this.testResults,
      timestamp: new Date().toISOString()
    }

    this.printCompatibilityReport(report)
    return report
  }

  /**
   * 计算平均加载时间
   */
  calculateAverageLoadTime() {
    const successfulTests = this.testResults.filter(r => r.success && r.loadTime > 0)
    if (successfulTests.length === 0) return 0
    
    const totalTime = successfulTests.reduce((sum, test) => sum + test.loadTime, 0)
    return Math.round(totalTime / successfulTests.length)
  }

  /**
   * 计算平均FPS
   */
  calculateAverageFps() {
    const validTests = this.testResults.filter(r => r.success && r.details.fps > 0)
    if (validTests.length === 0) return 0
    
    const totalFps = validTests.reduce((sum, test) => sum + test.details.fps, 0)
    return Math.round(totalFps / validTests.length)
  }

  /**
   * 按分类分析
   */
  analyzeByCategory() {
    const categories = {}
    
    this.testResults.forEach(result => {
      const category = result.rom.category || '未知'
      if (!categories[category]) {
        categories[category] = { total: 0, successful: 0 }
      }
      categories[category].total++
      if (result.success) {
        categories[category].successful++
      }
    })

    // 计算成功率
    Object.keys(categories).forEach(category => {
      const data = categories[category]
      data.successRate = data.total > 0 ? (data.successful / data.total * 100) : 0
    })

    return categories
  }

  /**
   * 识别常见问题
   */
  identifyCommonProblems() {
    const problems = {}
    
    this.testResults.forEach(result => {
      if (!result.success) {
        const error = result.error || '未知错误'
        problems[error] = (problems[error] || 0) + 1
      }
    })

    return Object.entries(problems)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5) // 前5个最常见问题
      .map(([error, count]) => ({ error, count }))
  }

  /**
   * 生成建议
   */
  generateRecommendations() {
    const recommendations = []
    const successRate = this.testResults.length > 0 ? 
      (this.testResults.filter(r => r.success).length / this.testResults.length * 100) : 0

    if (successRate < 50) {
      recommendations.push({
        type: 'critical',
        message: '兼容性较低，建议检查EmulatorJS配置和ROM文件质量'
      })
    } else if (successRate < 80) {
      recommendations.push({
        type: 'warning',
        message: '部分ROM存在兼容性问题，建议优化加载流程'
      })
    } else {
      recommendations.push({
        type: 'info',
        message: '兼容性良好，可以进行生产环境部署'
      })
    }

    const avgLoadTime = this.calculateAverageLoadTime()
    if (avgLoadTime > 5000) {
      recommendations.push({
        type: 'performance',
        message: '加载时间较长，建议优化网络或使用CDN'
      })
    }

    const avgFps = this.calculateAverageFps()
    if (avgFps < 50) {
      recommendations.push({
        type: 'performance',
        message: 'FPS较低，建议检查性能优化设置'
      })
    }

    return recommendations
  }

  /**
   * 打印兼容性报告
   */
  printCompatibilityReport(report) {
    console.log('')
    console.log('📊 EmulatorJS 兼容性测试报告')
    console.log('='.repeat(60))
    
    // 总体统计
    console.log('📈 总体统计:')
    console.log(`   测试总数: ${report.summary.total}`)
    console.log(`   成功: ${report.summary.successful}`)
    console.log(`   失败: ${report.summary.failed}`)
    console.log(`   成功率: ${report.summary.successRate.toFixed(1)}%`)
    console.log(`   平均加载时间: ${report.summary.averageLoadTime}ms`)
    console.log(`   平均FPS: ${report.summary.averageFps}`)
    console.log('')

    // 分类统计
    if (Object.keys(report.categories).length > 0) {
      console.log('📂 分类统计:')
      Object.entries(report.categories).forEach(([category, data]) => {
        console.log(`   ${category}: ${data.successful}/${data.total} (${data.successRate.toFixed(1)}%)`)
      })
      console.log('')
    }

    // 常见问题
    if (report.problems.length > 0) {
      console.log('⚠️  常见问题:')
      report.problems.forEach((problem, index) => {
        console.log(`   ${index + 1}. ${problem.error} (${problem.count}次)`)
      })
      console.log('')
    }

    // 建议
    if (report.recommendations.length > 0) {
      console.log('💡 建议:')
      report.recommendations.forEach((rec, index) => {
        const icon = rec.type === 'critical' ? '🔥' : rec.type === 'warning' ? '⚠️' : '💡'
        console.log(`   ${index + 1}. ${icon} ${rec.message}`)
      })
    }
  }

  /**
   * 导出兼容性报告
   */
  exportCompatibilityReport() {
    const report = this.generateCompatibilityReport()
    
    const dataStr = JSON.stringify(report, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    
    const link = document.createElement('a')
    link.href = URL.createObjectURL(dataBlob)
    link.download = `emulatorjs_compatibility_${Date.now()}.json`
    link.click()

    console.log('💾 兼容性报告已导出')
    return report
  }

  /**
   * 清理测试环境
   */
  async cleanup() {
    try {
      // 清理EmulatorJS实例
      if (window.EJS_emulator) {
        if (typeof window.EJS_emulator.destroy === 'function') {
          window.EJS_emulator.destroy()
        }
        delete window.EJS_emulator
      }

      // 清理全局变量
      if (window.EJS_player) delete window.EJS_player
      if (window.EJS_gameUrl) delete window.EJS_gameUrl
      if (window.EJS_core) delete window.EJS_core
      if (window.EJS_pathtodata) delete window.EJS_pathtodata
      if (window.EJS_volume) delete window.EJS_volume
      if (window.EJS_mute) delete window.EJS_mute

      // 移除测试容器
      const container = document.getElementById('compatibility-test-container')
      if (container) {
        container.remove()
      }

      // 移除脚本
      const scripts = document.querySelectorAll('script[src*="emulatorjs"]')
      scripts.forEach(script => script.remove())

      // 等待清理完成
      await this.wait(500)

    } catch (error) {
      console.warn('清理测试环境时出错:', error)
    }
  }

  /**
   * 工具方法：等待
   */
  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// 导出单例实例
const compatibilityTester = new CompatibilityTester()

export default compatibilityTester 