// 游戏统计 Composable
// Copyright (C) 2024 Lipeaks FC Games

import { ref, computed } from 'vue'

const GAME_STATS_KEY = 'lipeaks_game_stats'
const INDIVIDUAL_GAME_STATS_KEY = 'lipeaks_individual_game_stats'
const INITIAL_PLAY_COUNT = 12589

// 响应式数据
const totalPlayCount = ref(INITIAL_PLAY_COUNT)
const individualGameStats = ref(new Map())

/**
 * 游戏统计管理
 */
export function useGameStats() {
  
  // 加载统计数据
  const loadGameStats = () => {
    try {
      const stats = JSON.parse(localStorage.getItem(GAME_STATS_KEY)) || {
        totalPlays: INITIAL_PLAY_COUNT,
        lastUpdated: new Date().toISOString()
      }
      
      // 确保至少有初始值
      if (!stats.totalPlays || stats.totalPlays < INITIAL_PLAY_COUNT) {
        stats.totalPlays = INITIAL_PLAY_COUNT
      }
      
      totalPlayCount.value = stats.totalPlays
      return stats
    } catch (error) {
      console.warn('Failed to load game stats:', error)
      const defaultStats = {
        totalPlays: INITIAL_PLAY_COUNT,
        lastUpdated: new Date().toISOString()
      }
      totalPlayCount.value = INITIAL_PLAY_COUNT
      return defaultStats
    }
  }

  // 保存统计数据
  const saveGameStats = (stats) => {
    try {
      stats.lastUpdated = new Date().toISOString()
      localStorage.setItem(GAME_STATS_KEY, JSON.stringify(stats))
    } catch (error) {
      console.warn('Failed to save game stats:', error)
    }
  }

  // 加载单个游戏统计数据
  const loadIndividualGameStats = () => {
    try {
      const data = localStorage.getItem(INDIVIDUAL_GAME_STATS_KEY)
      if (data) {
        const parsed = JSON.parse(data)
        individualGameStats.value = new Map(Object.entries(parsed))
      }
    } catch (error) {
      console.warn('Failed to load individual game stats:', error)
      individualGameStats.value = new Map()
    }
  }

  // 保存单个游戏统计数据
  const saveIndividualGameStats = () => {
    try {
      const data = Object.fromEntries(individualGameStats.value)
      localStorage.setItem(INDIVIDUAL_GAME_STATS_KEY, JSON.stringify(data))
    } catch (error) {
      console.warn('Failed to save individual game stats:', error)
    }
  }

  // 生成5-10之间的随机数
  const generateRandomPlayTime = () => {
    return Math.floor(Math.random() * 6) + 5 // 5-10之间的随机整数
  }

  // 增加游戏播放次数
  const incrementGamePlayCount = () => {
    const stats = loadGameStats()
    stats.totalPlays = (stats.totalPlays || INITIAL_PLAY_COUNT) + 1
    totalPlayCount.value = stats.totalPlays
    saveGameStats(stats)
    
    // 返回新的播放次数用于调试
    return stats.totalPlays
  }

  // 增加单个游戏播放次数
  const incrementIndividualGamePlayCount = (gameId) => {
    if (!gameId) return null
    
    loadIndividualGameStats()
    
    const currentStats = individualGameStats.value.get(gameId) || {
      playCount: 0,
      totalPlayTime: 0,
      lastPlayed: null
    }
    
    // 增加播放次数
    currentStats.playCount += 1
    
    // 增加游戏时长（播放次数 × 5-10分钟的随机数）
    const additionalTime = generateRandomPlayTime()
    currentStats.totalPlayTime += additionalTime
    
    // 更新最后游玩时间
    currentStats.lastPlayed = new Date().toISOString()
    
    // 保存到Map
    individualGameStats.value.set(gameId, currentStats)
    
    // 持久化保存
    saveIndividualGameStats()
    
    return currentStats
  }

  // 重置游戏统计（开发用）
  const resetGameStats = () => {
    const stats = {
      totalPlays: INITIAL_PLAY_COUNT,
      lastUpdated: new Date().toISOString()
    }
    totalPlayCount.value = INITIAL_PLAY_COUNT
    saveGameStats(stats)
    return INITIAL_PLAY_COUNT
  }

  // 获取格式化的播放次数
  const getFormattedPlayCount = computed(() => {
    const count = totalPlayCount.value
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M'
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K'
    }
    return count.toString()
  })

  // 获取单个游戏统计数据
  const getIndividualGameStats = (gameId) => {
    if (!gameId) return null
    
    // 只在Map为空时才加载，避免重复加载
    if (individualGameStats.value.size === 0) {
      loadIndividualGameStats()
    }
    
    return individualGameStats.value.get(gameId) || {
      playCount: 0,
      totalPlayTime: 0,
      lastPlayed: null
    }
  }

  // 计算单个游戏完成度
  const getGameCompletionRate = (gameId) => {
    const stats = getIndividualGameStats(gameId)
    if (!stats) return 0
    
    // 完成度 = 游戏时长 / 10000，最大100%
    const completion = Math.min((stats.totalPlayTime / 10000) * 100, 100)
    return Math.round(completion)
  }

  // 格式化游戏时长显示
  const getFormattedGamePlayTime = (gameId) => {
    const stats = getIndividualGameStats(gameId)
    if (!stats) return '0min'
    
    const minutes = stats.totalPlayTime
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60)
      const remainingMinutes = minutes % 60
      return remainingMinutes > 0 ? `${hours}h${remainingMinutes}min` : `${hours}h`
    }
    return `${minutes}min`
  }

  // 重置单个游戏统计（开发用）
  const resetIndividualGameStats = (gameId = null) => {
    if (gameId) {
      individualGameStats.value.delete(gameId)
    } else {
      individualGameStats.value.clear()
    }
    saveIndividualGameStats()
  }

  // 初始化统计数据
  const initializeGameStats = () => {
    loadGameStats()
    loadIndividualGameStats()
  }

  return {
    // 响应式数据
    totalPlayCount,
    individualGameStats,
    
    // 计算属性
    getFormattedPlayCount,
    
    // 全局统计方法
    incrementGamePlayCount,
    resetGameStats,
    initializeGameStats,
    loadGameStats,
    
    // 单个游戏统计方法
    incrementIndividualGamePlayCount,
    getIndividualGameStats,
    getGameCompletionRate,
    getFormattedGamePlayTime,
    resetIndividualGameStats
  }
}