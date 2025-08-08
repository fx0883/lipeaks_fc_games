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

import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', {
  state: () => ({
    // 统一的游戏数据存储 - 避免重复
    allGames: new Map(), // 使用Map存储所有游戏，key为gameId
    categories: [],
    loading: false,
    currentGame: null,
    loadedCategories: new Set(), // 记录已加载的分类
    searchResults: [], // 存储搜索结果
    searchQuery: '' // 当前搜索关键词
  }),
  
  getters: {
    // 根据ID获取游戏 - 直接从Map中获取，O(1)复杂度
    getGameById: (state) => {
      return (id) => state.allGames.get(id) || null
    },
    
    // 根据分类获取游戏 - 支持新的平台/子分类结构
    getGamesByCategory: (state) => {
      return (categoryId) => {
        return Array.from(state.allGames.values())
          .filter(game => {
            // 支持旧的category字段和新的platform/subCategory字段
            return game.category === categoryId || 
                   game.platform === categoryId || 
                   game.subCategory === categoryId
          })
      }
    },

    // 根据平台获取游戏
    getGamesByPlatform: (state) => {
      return (platform) => {
        return Array.from(state.allGames.values())
          .filter(game => game.platform === platform)
      }
    },

    // 根据平台和子分类获取游戏
    getGamesByPlatformAndSubCategory: (state) => {
      return (platform, subCategory) => {
        return Array.from(state.allGames.values())
          .filter(game => game.platform === platform && game.subCategory === subCategory)
      }
    },

    // 获取所有子分类
    getSubCategoriesByPlatform: (state) => {
      return (platform) => {
        const category = state.categories.find(cat => cat.id === platform)
        return category ? category.subCategories || [] : []
      }
    },
    
    // 推荐游戏 - 随机选择：FC游戏6个 + 街机游戏3个
    popularGames: (state) => {
      const allGames = Array.from(state.allGames.values())
      const fcGames = allGames.filter(game => game.platform === 'fc')
      const arcadeGames = allGames.filter(game => game.platform === 'arcade')
      
      // 随机打乱数组的函数
      const shuffleArray = (array) => {
        const shuffled = [...array]
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
        }
        return shuffled
      }
      
      // 随机选择FC游戏6个
      const selectedFcGames = shuffleArray(fcGames).slice(0, 6)
      
      // 随机选择街机游戏3个
      const selectedArcadeGames = shuffleArray(arcadeGames).slice(0, 3)
      
      // 合并并再次随机打乱显示顺序
      return shuffleArray([...selectedFcGames, ...selectedArcadeGames])
    },

    // 根据分类ID获取分类信息（支持主分类和子分类）
    getCategoryById: (state) => {
      return (id) => {
        // 先查找主分类
        const mainCategory = state.categories.find(category => category.id === id)
        if (mainCategory) return mainCategory
        
        // 如果没找到主分类，查找子分类
        for (const category of state.categories) {
          if (category.subCategories) {
            const subCategory = category.subCategories.find(sub => sub.id === id)
            if (subCategory) return subCategory
          }
        }
        return null
      }
    },
    
    // 获取所有游戏 - 直接转换Map为数组
    getAllGames: (state) => {
      return Array.from(state.allGames.values())
    },
    
    // 检查分类是否已加载
    isCategoryLoaded: (state) => {
      return (categoryId) => state.loadedCategories.has(categoryId)
    }
  },
  
  actions: {
    async fetchCategories() {
      this.loading = true
      try {
        const response = await fetch('/data/categories.json')
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        this.categories = await response.json()
      } catch (error) {
        console.error('Failed to fetch categories:', error)
        // 加载失败时使用默认分类（保持原有中文，数据不国际化）
        this.categories = [
          { id: 'action', name: '动作', description: '动作类游戏', cover: '/placeholder.png', gamesUrl: '/data/games/action.json' },
          { id: 'rpg', name: '角色', description: '角色扮演类游戏', cover: '/placeholder.png', gamesUrl: '/data/games/rpg.json' },
          { id: 'puzzle', name: '益智', description: '益智类游戏', cover: '/placeholder.png', gamesUrl: '/data/games/puzzle.json' }
        ]
      } finally {
        this.loading = false
      }
    },

    // 添加游戏到统一存储
    addGames(games) {
      if (!Array.isArray(games)) return
      
      games.forEach(game => {
        if (game && game.id) {
          // 确保游戏有基本属性
          const gameData = {
            playCount: 0,
            ...game
          }
          this.allGames.set(game.id, gameData)
        }
      })
    },

    async fetchGamesByCategory(categoryId) {
      if (!categoryId) return []
      
      // 如果已经加载过该分类的游戏，直接返回
      if (this.isCategoryLoaded(categoryId)) {
        return this.getGamesByCategory(categoryId)
      }
      
      this.loading = true
      try {
        // 查找分类信息（支持主分类和子分类）
        const category = this.getCategoryById(categoryId)
        
        if (!category) {
          throw new Error(`Category not found: ${categoryId}`)
        }
        
        // 如果是子分类且有gamesUrl，直接加载
        if (category.gamesUrl) {
          const response = await fetch(category.gamesUrl)
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
          }
          
          const games = await response.json()
          this.addGames(games)
          this.loadedCategories.add(categoryId)
          
          return this.getGamesByCategory(categoryId)
        }
        
        // 如果是主分类（如fc、arcade），需要加载所有子分类
        if (category.subCategories && category.subCategories.length > 0) {
          const allGames = []
          
          // 并行加载所有子分类
          const loadPromises = category.subCategories
            .filter(subCat => subCat.gamesUrl) // 只加载有gamesUrl的子分类
            .map(async (subCat) => {
              try {
                const response = await fetch(subCat.gamesUrl)
                if (!response.ok) {
                  console.warn(`Failed to load ${subCat.id}: HTTP ${response.status}`)
                  return []
                }
                const games = await response.json()
                this.loadedCategories.add(subCat.id) // 标记子分类也已加载
                return games
              } catch (error) {
                console.warn(`Failed to load subcategory ${subCat.id}:`, error)
                return []
              }
            })
          
          const results = await Promise.all(loadPromises)
          results.forEach(games => allGames.push(...games))
          
          this.addGames(allGames)
          this.loadedCategories.add(categoryId)
          
          return this.getGamesByCategory(categoryId)
        }
        
        throw new Error(`Category ${categoryId} has no gamesUrl or subCategories`)
        
      } catch (error) {
        console.error(`Failed to fetch games for category ${categoryId}:`, error)
        return []
      } finally {
        this.loading = false
      }
    },
    
    async fetchGameById(id) {
      this.loading = true
      try {
        // 先在已加载的游戏中查找
        let game = this.getGameById(id)
        
        if (!game) {
          // 如果没有找到，可能需要加载所有分类的游戏
          // 但这样效率较低，更好的方法是根据URL或其他信息确定游戏所属的分类
          // 然后只加载该分类的游戏
          
          // 这里我们假设游戏ID的格式可以帮助我们确定分类
          // 实际项目中可能需要更复杂的逻辑
          
          // 加载所有分类
          if (this.categories.length === 0) {
            await this.fetchCategories()
          }
          
          // 尝试加载每个分类的游戏，直到找到目标游戏
          for (const category of this.categories) {
            if (!this.isCategoryLoaded(category.id)) {
              await this.fetchGamesByCategory(category.id)
              game = this.getGameById(id)
              if (game) break
            }
          }
        }
        
        if (game) {
          this.currentGame = { ...game }
        } else {
          this.currentGame = null
        }
        
        return this.currentGame
      } catch (error) {
        console.error(`Failed to fetch game with id ${id}:`, error)
        return null
      } finally {
        this.loading = false
      }
    },
    
    incrementPlayCount(id) {
      // 直接在Map中更新播放次数
      const game = this.allGames.get(id)
      if (game) {
        game.playCount = (game.playCount || 0) + 1
      }
    },
    
    // 初始化方法，加载所有数据
    async initialize() {
      await this.fetchCategories()
      // 不再预加载所有游戏，而是按需加载
      return true
    },
    
    // 搜索游戏 - 优化版本
    async searchGames(query) {
      if (!query || query.trim() === '') {
        this.searchResults = []
        this.searchQuery = ''
        return []
      }
      
      this.searchQuery = query
      this.loading = true
      
      try {
        // 确保分类已加载
        if (this.categories.length === 0) {
          await this.fetchCategories()
        }
        
        // 按需加载分类数据（避免一次性加载所有分类）
        // 只在需要时加载尚未加载的分类
        const unloadedCategories = this.categories.filter(
          category => !this.isCategoryLoaded(category.id)
        )
        
        if (unloadedCategories.length > 0) {
          const loadPromises = unloadedCategories.map(category => 
            this.fetchGamesByCategory(category.id)
          )
          await Promise.all(loadPromises)
        }
        
        // 直接从Map中搜索，性能更佳
        const lowerQuery = query.toLowerCase()
        
        // 在游戏名称、描述和作者中搜索
        this.searchResults = this.getAllGames.filter(game => 
          game.name.toLowerCase().includes(lowerQuery) || 
          (game.description && game.description.toLowerCase().includes(lowerQuery)) ||
          (game.author && game.author.toLowerCase().includes(lowerQuery))
        )
        
        return this.searchResults
      } catch (error) {
        console.error('Search error:', error)
        this.searchResults = []
        return []
      } finally {
        this.loading = false
      }
    }
  }
}) 