import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', {
  state: () => ({
    games: [],
    categories: [],
    loading: false,
    currentGame: null,
    categoryGames: {}, // 存储每个分类的游戏数据
    searchResults: [], // 存储搜索结果
    searchQuery: '' // 当前搜索关键词
  }),
  
  getters: {
    getGameById: (state) => {
      return (id) => {
        // 先在已加载的游戏中查找
        const game = state.games.find(game => game.id === id)
        if (game) return game
        
        // 如果没找到，在所有分类的游戏中查找
        for (const categoryId in state.categoryGames) {
          const categoryGame = state.categoryGames[categoryId].find(game => game.id === id)
          if (categoryGame) return categoryGame
        }
        
        return null
      }
    },
    
    getGamesByCategory: (state) => {
      return (categoryId) => {
        // 如果已经加载了该分类的游戏，直接返回
        if (state.categoryGames[categoryId]) {
          return state.categoryGames[categoryId]
        }
        
        // 否则返回空数组
        return []
      }
    },
    
    popularGames: (state) => {
      // 合并所有分类的游戏
      const allGames = [...state.games]
      
      for (const categoryId in state.categoryGames) {
        allGames.push(...state.categoryGames[categoryId])
      }
      
      // 去重
      const uniqueGames = Array.from(new Map(allGames.map(game => [game.id, game])).values())
      
      // 按播放次数排序，显示所有游戏而不限制数量
      return uniqueGames
        .sort((a, b) => b.playCount - a.playCount)
    },

    getCategoryById: (state) => {
      return (id) => state.categories.find(category => category.id === id)
    },
    
    // 获取所有游戏（用于搜索）
    getAllGames: (state) => {
      const allGames = [...state.games]
      
      for (const categoryId in state.categoryGames) {
        allGames.push(...state.categoryGames[categoryId])
      }
      
      // 去重
      return Array.from(new Map(allGames.map(game => [game.id, game])).values())
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
        // 加载失败时使用默认分类
        this.categories = [
          { id: 'action', name: '动作游戏', description: '动作类游戏', cover: '/placeholder.png', gamesUrl: '/data/games/action.json' },
          { id: 'rpg', name: '角色扮演', description: '角色扮演类游戏', cover: '/placeholder.png', gamesUrl: '/data/games/rpg.json' },
          { id: 'puzzle', name: '益智游戏', description: '益智类游戏', cover: '/placeholder.png', gamesUrl: '/data/games/puzzle.json' }
        ]
      } finally {
        this.loading = false
      }
    },

    async fetchGames() {
      // 这个方法保留用于兼容性，但实际上我们将使用fetchGamesByCategory
      this.loading = true
      try {
        const response = await fetch('/data/games.json')
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        this.games = await response.json()
      } catch (error) {
        console.error('Failed to fetch games:', error)
        // 加载失败时使用默认游戏数据
        this.games = [
          { 
            id: 'contra', 
            name: '魂斗罗', 
            cover: '/placeholder.png',
            category: 'action',
            description: '经典射击游戏',
            romPath: '/roms/contra.nes',
            playCount: 768
          }
        ]
      } finally {
        this.loading = false
      }
    },

    async fetchGamesByCategory(categoryId) {
      if (!categoryId) return []
      
      // 如果已经加载过该分类的游戏，直接返回
      if (this.categoryGames[categoryId]) {
        return this.categoryGames[categoryId]
      }
      
      this.loading = true
      try {
        // 查找分类信息
        const category = this.getCategoryById(categoryId)
        if (!category || !category.gamesUrl) {
          throw new Error(`Category not found or missing gamesUrl: ${categoryId}`)
        }
        
        // 加载分类游戏数据
        const response = await fetch(category.gamesUrl)
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        
        // 存储该分类的游戏数据
        const games = await response.json()
        this.categoryGames[categoryId] = games
        
        return games
      } catch (error) {
        console.error(`Failed to fetch games for category ${categoryId}:`, error)
        this.categoryGames[categoryId] = []
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
            if (!this.categoryGames[category.id]) {
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
      // 在所有已加载的游戏中查找并增加播放次数
      const game = this.getGameById(id)
      if (game) {
        game.playCount++
      }
    },
    
    // 初始化方法，加载所有数据
    async initialize() {
      await this.fetchCategories()
      // 不再预加载所有游戏，而是按需加载
      return true
    },
    
    // 搜索游戏
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
        
        // 加载所有分类的游戏数据
        const loadPromises = this.categories.map(category => 
          this.fetchGamesByCategory(category.id)
        )
        await Promise.all(loadPromises)
        
        // 获取所有游戏并进行搜索
        const allGames = this.getAllGames
        const lowerQuery = query.toLowerCase()
        
        // 在游戏名称、描述和作者中搜索
        this.searchResults = allGames.filter(game => 
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