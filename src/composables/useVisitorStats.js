// 访客统计 Composable
// Copyright (C) 2024 Lipeaks FC Games

import { ref, computed, onMounted } from 'vue'

const STORAGE_KEY = 'lipeaks_visitor_stats'
const LAST_VISIT_KEY = 'lipeaks_last_visit'
const SESSION_KEY = 'lipeaks_session_id'

// 响应式数据
const totalVisitors = ref(0)
const todayVisitors = ref(0)
const yesterdayVisitors = ref(0)
const isNewVisitor = ref(false)

/**
 * 访客统计管理
 */
export function useVisitorStats() {
  
  // 生成会话ID
  const generateSessionId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  // 获取今日日期字符串
  const getTodayDateString = () => {
    return new Date().toISOString().split('T')[0]
  }

  // 获取昨日日期字符串
  const getYesterdayDateString = () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    return yesterday.toISOString().split('T')[0]
  }

  // 加载统计数据
  const loadStats = () => {
    try {
      const stats = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
        total: 0,
        daily: {},
        firstVisit: new Date().toISOString()
      }

      const today = getTodayDateString()
      const yesterday = getYesterdayDateString()

      // 设置总访问量
      totalVisitors.value = stats.total || 0

      // 设置今日访问量
      todayVisitors.value = stats.daily[today] || 0

      // 设置昨日访问量
      yesterdayVisitors.value = stats.daily[yesterday] || 0

      return stats
    } catch (error) {
      console.warn('Failed to load visitor stats:', error)
      return {
        total: 0,
        daily: {},
        firstVisit: new Date().toISOString()
      }
    }
  }

  // 保存统计数据
  const saveStats = (stats) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
    } catch (error) {
      console.warn('Failed to save visitor stats:', error)
    }
  }

  // 检查是否是新访客
  const checkNewVisitor = () => {
    const lastVisit = localStorage.getItem(LAST_VISIT_KEY)
    const sessionId = sessionStorage.getItem(SESSION_KEY)
    
    // 如果没有session ID，说明是新会话
    if (!sessionId) {
      sessionStorage.setItem(SESSION_KEY, generateSessionId())
      return true
    }

    // 如果有session ID但是是新的一天，也算新访问
    if (lastVisit) {
      const lastVisitDate = new Date(lastVisit).toISOString().split('T')[0]
      const today = getTodayDateString()
      return lastVisitDate !== today
    }

    return !lastVisit
  }

  // 增加访问计数
  const incrementVisit = () => {
    const stats = loadStats()
    const today = getTodayDateString()
    const now = new Date().toISOString()

    // 检查是否是新访客
    const isNew = checkNewVisitor()
    isNewVisitor.value = isNew

    if (isNew) {
      // 增加总访问量
      stats.total = (stats.total || 0) + 1
      totalVisitors.value = stats.total

      // 增加今日访问量
      stats.daily[today] = (stats.daily[today] || 0) + 1
      todayVisitors.value = stats.daily[today]

      // 记录最后访问时间
      localStorage.setItem(LAST_VISIT_KEY, now)

      // 清理过期的日常数据（保留最近30天）
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      const cutoffDate = thirtyDaysAgo.toISOString().split('T')[0]

      Object.keys(stats.daily).forEach(date => {
        if (date < cutoffDate) {
          delete stats.daily[date]
        }
      })

      // 保存更新后的统计数据
      saveStats(stats)
    }
  }

  // 获取网站运行天数
  const getDaysOnline = computed(() => {
    const stats = loadStats()
    if (!stats.firstVisit) return 0
    
    const firstVisitDate = new Date(stats.firstVisit)
    const today = new Date()
    const diffTime = Math.abs(today - firstVisitDate)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  })

  // 格式化数字显示
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  // 格式化的数字
  const formattedTotalVisitors = computed(() => formatNumber(totalVisitors.value))
  const formattedTodayVisitors = computed(() => formatNumber(todayVisitors.value))
  const formattedYesterdayVisitors = computed(() => formatNumber(yesterdayVisitors.value))

  // 获取访问趋势
  const getVisitTrend = computed(() => {
    if (yesterdayVisitors.value === 0) return 'new'
    if (todayVisitors.value > yesterdayVisitors.value) return 'up'
    if (todayVisitors.value < yesterdayVisitors.value) return 'down'
    return 'stable'
  })

  // 重置统计数据（仅开发调试用）
  const resetStats = () => {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(LAST_VISIT_KEY)
    sessionStorage.removeItem(SESSION_KEY)
    totalVisitors.value = 0
    todayVisitors.value = 0
    yesterdayVisitors.value = 0
    console.log('Visitor stats have been reset')
  }

  // 初始化
  const initialize = () => {
    loadStats()
    incrementVisit()
  }

  // 在组件挂载时自动初始化
  onMounted(() => {
    initialize()
  })

  return {
    // 响应式数据
    totalVisitors,
    todayVisitors,
    yesterdayVisitors,
    isNewVisitor,
    
    // 计算属性
    formattedTotalVisitors,
    formattedTodayVisitors,
    formattedYesterdayVisitors,
    getDaysOnline,
    getVisitTrend,
    
    // 方法
    initialize,
    resetStats,
    formatNumber
  }
}