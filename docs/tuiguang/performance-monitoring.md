# 性能监控和报告指南

## 概述

本指南将帮助您建立完整的网站性能监控体系，包括实时监控、性能报告和优化建议，确保网站始终保持最佳性能状态。

## 第一步：建立性能监控体系

### 1.1 核心性能指标监控
创建性能监控服务 `src/services/PerformanceMonitor.js`：

```javascript
// src/services/PerformanceMonitor.js
class PerformanceMonitor {
  constructor() {
    this.metrics = {}
    this.thresholds = {
      lcp: 2500,      // 最大内容绘制 (毫秒)
      fid: 100,       // 首次输入延迟 (毫秒)
      cls: 0.1,       // 累积布局偏移
      fcp: 1800,      // 首次内容绘制 (毫秒)
      ttfb: 600       // 首字节时间 (毫秒)
    }
    this.init()
  }

  init() {
    this.observeCoreWebVitals()
    this.observeResourceTiming()
    this.observeUserInteractions()
    this.observeErrors()
  }

  // 监控核心网页指标
  observeCoreWebVitals() {
    if ('PerformanceObserver' in window) {
      // 监控LCP
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        this.metrics.lcp = lastEntry.startTime
        this.checkThreshold('lcp', lastEntry.startTime)
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

      // 监控FID
      const fidObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.metrics.fid = entry.processingStart - entry.startTime
          this.checkThreshold('fid', this.metrics.fid)
        })
      })
      fidObserver.observe({ entryTypes: ['first-input'] })

      // 监控CLS
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0
        list.getEntries().forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        })
        this.metrics.cls = clsValue
        this.checkThreshold('cls', clsValue)
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })

      // 监控FCP
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        this.metrics.fcp = entries[entries.length - 1].startTime
        this.checkThreshold('fcp', this.metrics.fcp)
      })
      fcpObserver.observe({ entryTypes: ['paint'] })
    }
  }

  // 监控资源加载性能
  observeResourceTiming() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.initiatorType === 'img' || entry.initiatorType === 'script') {
            this.analyzeResourcePerformance(entry)
          }
        })
      })
      observer.observe({ entryTypes: ['resource'] })
    }
  }

  // 分析资源性能
  analyzeResourcePerformance(entry) {
    const resourceMetrics = {
      name: entry.name,
      type: entry.initiatorType,
      duration: entry.duration,
      size: entry.transferSize,
      dns: entry.domainLookupEnd - entry.domainLookupStart,
      tcp: entry.connectEnd - entry.connectStart,
      request: entry.responseStart - entry.requestStart,
      response: entry.responseEnd - entry.responseStart
    }

    // 检查资源性能问题
    if (entry.duration > 1000) {
      this.reportPerformanceIssue('slow_resource', resourceMetrics)
    }

    if (entry.transferSize > 500000) { // 500KB
      this.reportPerformanceIssue('large_resource', resourceMetrics)
    }
  }

  // 监控用户交互性能
  observeUserInteractions() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.metrics.interactions = this.metrics.interactions || []
          this.metrics.interactions.push({
            name: entry.name,
            duration: entry.duration,
            startTime: entry.startTime
          })

          // 检查交互延迟
          if (entry.duration > 100) {
            this.reportPerformanceIssue('slow_interaction', {
              name: entry.name,
              duration: entry.duration
            })
          }
        })
      })
      observer.observe({ entryTypes: ['interaction'] })
    }
  }

  // 监控错误
  observeErrors() {
    window.addEventListener('error', (event) => {
      this.reportError('javascript_error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      })
    })

    window.addEventListener('unhandledrejection', (event) => {
      this.reportError('unhandled_promise', {
        reason: event.reason
      })
    })
  }

  // 检查性能阈值
  checkThreshold(metric, value) {
    const threshold = this.thresholds[metric]
    if (threshold && value > threshold) {
      this.reportPerformanceIssue(`high_${metric}`, {
        metric,
        value,
        threshold
      })
    }
  }

  // 报告性能问题
  reportPerformanceIssue(type, data) {
    console.warn(`性能问题: ${type}`, data)
    
    // 发送到GA4
    if (window.gtag) {
      window.gtag('event', 'performance_issue', {
        event_category: 'Performance',
        event_label: type,
        ...data
      })
    }

    // 存储到本地
    this.storePerformanceIssue(type, data)
  }

  // 报告错误
  reportError(type, data) {
    console.error(`错误: ${type}`, data)
    
    // 发送到GA4
    if (window.gtag) {
      window.gtag('event', 'error', {
        event_category: 'Errors',
        event_label: type,
        ...data
      })
    }

    // 存储到本地
    this.storeError(type, data)
  }

  // 存储性能问题
  storePerformanceIssue(type, data) {
    const issues = JSON.parse(localStorage.getItem('performance_issues') || '[]')
    issues.push({
      type,
      data,
      timestamp: Date.now()
    })
    
    // 只保留最近100个问题
    if (issues.length > 100) {
      issues.splice(0, issues.length - 100)
    }
    
    localStorage.setItem('performance_issues', JSON.stringify(issues))
  }

  // 存储错误
  storeError(type, data) {
    const errors = JSON.parse(localStorage.getItem('errors') || '[]')
    errors.push({
      type,
      data,
      timestamp: Date.now()
    })
    
    // 只保留最近100个错误
    if (errors.length > 100) {
      errors.splice(0, errors.length - 100)
    }
    
    localStorage.setItem('errors', JSON.stringify(errors))
  }

  // 获取性能报告
  getPerformanceReport() {
    return {
      coreWebVitals: {
        lcp: this.metrics.lcp,
        fid: this.metrics.fid,
        cls: this.metrics.cls,
        fcp: this.metrics.fcp
      },
      resources: this.metrics.resources || [],
      interactions: this.metrics.interactions || [],
      issues: JSON.parse(localStorage.getItem('performance_issues') || '[]'),
      errors: JSON.parse(localStorage.getItem('errors') || '[]')
    }
  }

  // 清理旧数据
  cleanup() {
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
    
    // 清理性能问题
    const issues = JSON.parse(localStorage.getItem('performance_issues') || '[]')
    const filteredIssues = issues.filter(issue => issue.timestamp > oneWeekAgo)
    localStorage.setItem('performance_issues', JSON.stringify(filteredIssues))
    
    // 清理错误
    const errors = JSON.parse(localStorage.getItem('errors') || '[]')
    const filteredErrors = errors.filter(error => error.timestamp > oneWeekAgo)
    localStorage.setItem('errors', JSON.stringify(filteredErrors))
  }
}

export default new PerformanceMonitor()
```

### 1.2 集成到主应用
在 `src/main.js` 中初始化性能监控：

```javascript
// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import i18n from './i18n'
import App from './App.vue'
import './style.css'
import googleAnalytics from './services/GoogleAnalytics'
import PerformanceMonitor from './services/PerformanceMonitor'

// 创建应用实例
const app = createApp(App)

// 使用Pinia状态管理
app.use(createPinia())

// 使用Vue Router
app.use(router)

// 使用Vue I18n
app.use(i18n)

// 初始化GA4
const ga4Id = import.meta.env.VITE_GA4_MEASUREMENT_ID
if (ga4Id) {
  googleAnalytics.init(ga4Id)
  
  // 路由变化时发送页面浏览事件
  router.afterEach((to) => {
    googleAnalytics.pageview(to.path, to.meta.title || document.title)
  })
}

// 初始化性能监控
PerformanceMonitor.init()

// 定期清理性能数据
setInterval(() => {
  PerformanceMonitor.cleanup()
}, 24 * 60 * 60 * 1000) // 每24小时清理一次

// 挂载应用
app.mount('#app')
```

## 第二步：创建性能仪表板

### 2.1 性能监控组件
创建 `src/components/PerformanceDashboard.vue`：

```vue
<!-- src/components/PerformanceDashboard.vue -->
<template>
  <div class="performance-dashboard" v-if="showDashboard">
    <div class="dashboard-header">
      <h3>性能监控仪表板</h3>
      <button @click="closeDashboard" class="close-btn">×</button>
    </div>
    
    <div class="dashboard-content">
      <!-- 核心网页指标 -->
      <div class="metrics-section">
        <h4>核心网页指标</h4>
        <div class="metrics-grid">
          <div class="metric-card" :class="getMetricClass('lcp')">
            <div class="metric-label">LCP</div>
            <div class="metric-value">{{ formatMetric(report.coreWebVitals.lcp) }}</div>
            <div class="metric-status">{{ getMetricStatus('lcp') }}</div>
          </div>
          
          <div class="metric-card" :class="getMetricClass('fid')">
            <div class="metric-label">FID</div>
            <div class="metric-value">{{ formatMetric(report.coreWebVitals.fid) }}</div>
            <div class="metric-status">{{ getMetricStatus('fid') }}</div>
          </div>
          
          <div class="metric-card" :class="getMetricClass('cls')">
            <div class="metric-label">CLS</div>
            <div class="metric-value">{{ formatMetric(report.coreWebVitals.cls) }}</div>
            <div class="metric-status">{{ getMetricStatus('cls') }}</div>
          </div>
          
          <div class="metric-card" :class="getMetricClass('fcp')">
            <div class="metric-label">FCP</div>
            <div class="metric-value">{{ formatMetric(report.coreWebVitals.fcp) }}</div>
            <div class="metric-status">{{ getMetricStatus('fcp') }}</div>
          </div>
        </div>
      </div>
      
      <!-- 性能问题 -->
      <div class="metrics-section">
        <h4>性能问题 (最近24小时)</h4>
        <div class="issues-list">
          <div v-for="issue in recentIssues" :key="issue.timestamp" class="issue-item">
            <span class="issue-type">{{ issue.type }}</span>
            <span class="issue-time">{{ formatTime(issue.timestamp) }}</span>
          </div>
          <div v-if="recentIssues.length === 0" class="no-issues">
            暂无性能问题
          </div>
        </div>
      </div>
      
      <!-- 错误统计 -->
      <div class="metrics-section">
        <h4>错误统计 (最近24小时)</h4>
        <div class="errors-list">
          <div v-for="error in recentErrors" :key="error.timestamp" class="error-item">
            <span class="error-type">{{ error.type }}</span>
            <span class="error-time">{{ formatTime(error.timestamp) }}</span>
          </div>
          <div v-if="recentErrors.length === 0" class="no-errors">
            暂无错误
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import PerformanceMonitor from '../services/PerformanceMonitor'

const showDashboard = ref(false)
const report = ref({})
let updateInterval = null

// 计算最近24小时的问题
const recentIssues = computed(() => {
  const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000)
  return report.value.issues?.filter(issue => issue.timestamp > oneDayAgo) || []
})

// 计算最近24小时的错误
const recentErrors = computed(() => {
  const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000)
  return report.value.errors?.filter(error => error.timestamp > oneDayAgo) || []
})

// 获取指标样式类
const getMetricClass = (metric) => {
  const value = report.value.coreWebVitals?.[metric]
  if (!value) return 'unknown'
  
  const thresholds = {
    lcp: 2500,
    fid: 100,
    cls: 0.1,
    fcp: 1800
  }
  
  if (value <= thresholds[metric] * 0.8) return 'excellent'
  if (value <= thresholds[metric]) return 'good'
  if (value <= thresholds[metric] * 1.2) return 'needs-improvement'
  return 'poor'
}

// 获取指标状态
const getMetricStatus = (metric) => {
  const value = report.value.coreWebVitals?.[metric]
  if (!value) return '未知'
  
  const thresholds = {
    lcp: 2500,
    fid: 100,
    cls: 0.1,
    fcp: 1800
  }
  
  if (value <= thresholds[metric] * 0.8) return '优秀'
  if (value <= thresholds[metric]) return '良好'
  if (value <= thresholds[metric] * 1.2) return '需要改进'
  return '较差'
}

// 格式化指标值
const formatMetric = (value) => {
  if (!value) return 'N/A'
  
  if (value < 1000) return `${Math.round(value)}ms`
  if (value < 10000) return `${(value / 1000).toFixed(1)}s`
  return `${(value / 1000).toFixed(2)}s`
}

// 格式化时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString()
}

// 关闭仪表板
const closeDashboard = () => {
  showDashboard.value = false
}

// 更新性能报告
const updateReport = () => {
  report.value = PerformanceMonitor.getPerformanceReport()
}

onMounted(() => {
  // 仅在开发环境显示
  if (import.meta.env.DEV) {
    showDashboard.value = true
    updateReport()
    
    // 每5秒更新一次
    updateInterval = setInterval(updateReport, 5000)
  }
})

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
})
</script>

<style scoped>
.performance-dashboard {
  position: fixed;
  top: 20px;
  left: 20px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 400px;
  max-height: 80vh;
  overflow-y: auto;
  z-index: 1000;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  background: #f8f9fa;
  border-radius: 8px 8px 0 0;
}

.dashboard-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #666;
}

.dashboard-content {
  padding: 16px;
}

.metrics-section {
  margin-bottom: 24px;
}

.metrics-section h4 {
  margin: 0 0 12px 0;
  font-size: 13px;
  font-weight: 600;
  color: #333;
}

.metrics-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.metric-card {
  padding: 12px;
  border-radius: 6px;
  text-align: center;
  border: 1px solid #eee;
}

.metric-card.excellent {
  background: #d4edda;
  border-color: #c3e6cb;
}

.metric-card.good {
  background: #d1ecf1;
  border-color: #bee5eb;
}

.metric-card.needs-improvement {
  background: #fff3cd;
  border-color: #ffeaa7;
}

.metric-card.poor {
  background: #f8d7da;
  border-color: #f5c6cb;
}

.metric-card.unknown {
  background: #f8f9fa;
  border-color: #dee2e6;
}

.metric-label {
  font-size: 11px;
  color: #666;
  margin-bottom: 4px;
}

.metric-value {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.metric-status {
  font-size: 10px;
  color: #666;
}

.issues-list, .errors-list {
  max-height: 120px;
  overflow-y: auto;
}

.issue-item, .error-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
  font-size: 12px;
}

.issue-type, .error-type {
  color: #333;
  font-weight: 500;
}

.issue-time, .error-time {
  color: #666;
}

.no-issues, .no-errors {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 20px 0;
}
</style>
```

## 第三步：性能报告和分析

### 3.1 创建性能报告服务
创建 `src/services/PerformanceReporter.js`：

```javascript
// src/services/PerformanceReporter.js
class PerformanceReporter {
  constructor() {
    this.reports = []
    this.maxReports = 30 // 保留最近30天的报告
  }

  // 生成每日性能报告
  generateDailyReport() {
    const today = new Date().toISOString().split('T')[0]
    const report = {
      date: today,
      timestamp: Date.now(),
      metrics: this.calculateDailyMetrics(),
      issues: this.getDailyIssues(),
      errors: this.getDailyErrors(),
      recommendations: this.generateRecommendations()
    }

    this.reports.push(report)
    
    // 保持报告数量在限制内
    if (this.reports.length > this.maxReports) {
      this.reports.shift()
    }

    // 保存到本地存储
    this.saveReports()
    
    return report
  }

  // 计算每日指标
  calculateDailyMetrics() {
    const today = new Date().toISOString().split('T')[0]
    const todayIssues = this.getDailyIssues()
    const todayErrors = this.getDailyErrors()

    return {
      totalIssues: todayIssues.length,
      totalErrors: todayErrors.length,
      issueTypes: this.countIssueTypes(todayIssues),
      errorTypes: this.countErrorTypes(todayErrors),
      performanceScore: this.calculatePerformanceScore()
    }
  }

  // 获取每日问题
  getDailyIssues() {
    const today = new Date().toISOString().split('T')[0]
    const issues = JSON.parse(localStorage.getItem('performance_issues') || '[]')
    
    return issues.filter(issue => {
      const issueDate = new Date(issue.timestamp).toISOString().split('T')[0]
      return issueDate === today
    })
  }

  // 获取每日错误
  getDailyErrors() {
    const today = new Date().toISOString().split('T')[0]
    const errors = JSON.parse(localStorage.getItem('errors') || '[]')
    
    return errors.filter(error => {
      const errorDate = new Date(error.timestamp).toISOString().split('T')[0]
      return errorDate === today
    })
  }

  // 统计问题类型
  countIssueTypes(issues) {
    const counts = {}
    issues.forEach(issue => {
      counts[issue.type] = (counts[issue.type] || 0) + 1
    })
    return counts
  }

  // 统计错误类型
  countErrorTypes(errors) {
    const counts = {}
    errors.forEach(error => {
      counts[error.type] = (counts[error.type] || 0) + 1
    })
    return counts
  }

  // 计算性能分数
  calculatePerformanceScore() {
    const issues = this.getDailyIssues()
    const errors = this.getDailyErrors()
    
    let score = 100
    
    // 根据问题数量扣分
    score -= issues.length * 2
    score -= errors.length * 5
    
    // 根据问题严重程度扣分
    issues.forEach(issue => {
      if (issue.data.metric === 'lcp' && issue.data.value > 4000) score -= 10
      if (issue.data.metric === 'cls' && issue.data.value > 0.25) score -= 10
    })
    
    return Math.max(0, score)
  }

  // 生成优化建议
  generateRecommendations() {
    const recommendations = []
    const issues = this.getDailyIssues()
    const errors = this.getDailyErrors()

    // 分析LCP问题
    const lcpIssues = issues.filter(issue => issue.data.metric === 'lcp')
    if (lcpIssues.length > 0) {
      recommendations.push({
        type: 'performance',
        priority: 'high',
        title: '优化页面加载速度',
        description: '检测到页面加载速度较慢，建议优化图片、压缩资源、使用CDN等。',
        action: '检查并优化LCP指标'
      })
    }

    // 分析CLS问题
    const clsIssues = issues.filter(issue => issue.data.metric === 'cls')
    if (clsIssues.length > 0) {
      recommendations.push({
        type: 'ux',
        priority: 'medium',
        title: '减少页面布局偏移',
        description: '检测到页面布局偏移，建议为图片和媒体设置固定尺寸。',
        action: '优化CLS指标'
      })
    }

    // 分析JavaScript错误
    const jsErrors = errors.filter(error => error.type === 'javascript_error')
    if (jsErrors.length > 0) {
      recommendations.push({
        type: 'stability',
        priority: 'high',
        title: '修复JavaScript错误',
        description: '检测到JavaScript错误，建议检查代码并修复错误。',
        action: '修复JavaScript错误'
      })
    }

    return recommendations
  }

  // 保存报告
  saveReports() {
    localStorage.setItem('performance_reports', JSON.stringify(this.reports))
  }

  // 加载报告
  loadReports() {
    const saved = localStorage.getItem('performance_reports')
    if (saved) {
      this.reports = JSON.parse(saved)
    }
  }

  // 获取报告
  getReports() {
    return this.reports
  }

  // 获取最新报告
  getLatestReport() {
    return this.reports[this.reports.length - 1]
  }

  // 导出报告
  exportReport(format = 'json') {
    const report = this.generateDailyReport()
    
    if (format === 'json') {
      return JSON.stringify(report, null, 2)
    }
    
    if (format === 'csv') {
      return this.convertToCSV(report)
    }
    
    return report
  }

  // 转换为CSV格式
  convertToCSV(report) {
    const headers = ['日期', '性能分数', '问题数量', '错误数量', '建议数量']
    const row = [
      report.date,
      report.metrics.performanceScore,
      report.metrics.totalIssues,
      report.metrics.totalErrors,
      report.recommendations.length
    ]
    
    return [headers.join(','), row.join(',')].join('\n')
  }
}

export default new PerformanceReporter()
```

## 第四步：性能优化建议

### 4.1 自动性能优化
创建 `src/services/PerformanceOptimizer.js`：

```javascript
// src/services/PerformanceOptimizer.js
class PerformanceOptimizer {
  constructor() {
    this.optimizations = []
  }

  // 自动优化图片
  optimizeImages() {
    const images = document.querySelectorAll('img')
    images.forEach(img => {
      // 添加懒加载
      if (!img.loading) {
        img.loading = 'lazy'
      }
      
      // 添加解码属性
      if (!img.decoding) {
        img.decoding = 'async'
      }
      
      // 为没有alt的图片添加alt
      if (!img.alt) {
        img.alt = '图片'
      }
    })
  }

  // 优化字体加载
  optimizeFonts() {
    // 预加载关键字体
    const fontLinks = document.querySelectorAll('link[rel="preload"][as="font"]')
    fontLinks.forEach(link => {
      link.crossOrigin = 'anonymous'
    })
  }

  // 优化资源加载
  optimizeResources() {
    // 预连接到外部域名
    const externalDomains = [
      'https://www.google-analytics.com',
      'https://www.googletagmanager.com'
    ]
    
    externalDomains.forEach(domain => {
      const link = document.createElement('link')
      link.rel = 'preconnect'
      link.href = domain
      document.head.appendChild(link)
    })
  }

  // 应用所有优化
  applyOptimizations() {
    this.optimizeImages()
    this.optimizeFonts()
    this.optimizeResources()
    
    console.log('性能优化已应用')
  }
}

export default new PerformanceOptimizer()
```

## 重要提示

- **实时监控**: 持续监控网站性能指标
- **定期报告**: 生成每日/每周性能报告
- **及时优化**: 根据监控数据快速优化
- **用户反馈**: 结合用户反馈进行优化

## 下一步

完成性能监控设置后，请继续阅读：
- [持续优化策略](./continuous-optimization.md)

## 常见问题

### Q: 性能监控会影响网站性能吗？
A: 性能监控代码经过优化，对网站性能影响很小，通常小于1%。

### Q: 如何设置性能阈值？
A: 可以根据Google推荐的核心网页指标标准设置，或根据业务需求自定义。

### Q: 性能数据保存多久？
A: 建议保存30天的数据，平衡存储空间和数据价值。
