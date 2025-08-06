<!--
  Lipeaks FC Games
  Copyright (C) 2024 Lipeaks

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
-->
<template>
  <div class="category-view gaming-bg">
    <!-- 分类英雄区域 -->
    <section class="category-hero animate-slide-up">
      <div class="hero-background">
        <div class="category-particles"></div>
        <div class="floating-icons">
          <div class="game-icon">{{ getCategoryIcon(categoryId) }}</div>
          <div class="game-icon">🎮</div>
          <div class="game-icon">⭐</div>
          <div class="game-icon">🏆</div>
        </div>
      </div>
      
      <div class="hero-content">
        <div class="category-badge animate-bounce">
          <span class="badge-icon">{{ getCategoryIcon(categoryId) }}</span>
          <span class="badge-text">{{ $t('category.categoryBadge') }}</span>
        </div>
        
        <h1 class="category-title">{{ category ? category.name : categoryId }}</h1>
        <p class="category-description" v-if="category">{{ category.description || $t('category.defaultDescription') }}</p>
        
        <div class="category-stats">
          <div class="stat-item">
            <div class="stat-icon">🎮</div>
            <div class="stat-info">
              <div class="stat-number gaming-score">{{ games.length }}</div>
              <div class="stat-label">{{ $t('category.totalGames') }}</div>
            </div>
          </div>
          
          <div class="stat-item">
            <div class="stat-icon">🔥</div>
            <div class="stat-info">
              <div class="stat-number gaming-score">{{ popularGamesCount }}</div>
              <div class="stat-label">{{ $t('category.popularGames') }}</div>
            </div>
          </div>
          
          <div class="stat-item">
            <div class="stat-icon">⏱️</div>
            <div class="stat-info">
              <div class="stat-number gaming-score">{{ totalPlayTime }}</div>
              <div class="stat-label">{{ $t('category.totalPlayTime') }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 筛选和排序区域 -->
    <section class="filters-section animate-fade-in animate-delay-300">
      <div class="filters-container">
        <div class="filter-group">
          <label class="filter-label">
            <span class="label-icon">🔍</span>
            {{ $t('category.searchInCategory') }}
          </label>
          <div class="search-input-wrapper">
            <input 
              type="text" 
              v-model="searchQuery" 
              :placeholder="$t('category.searchPlaceholder')"
              class="filter-input"
            >
            <span class="search-icon">🔍</span>
          </div>
        </div>
        
        <div class="filter-group">
          <label class="filter-label">
            <span class="label-icon">📊</span>
            {{ $t('category.sortBy') }}
          </label>
          <select v-model="sortBy" class="filter-select">
            <option value="name">{{ $t('category.sortByName') }}</option>
            <option value="playCount">{{ $t('category.sortByPopularity') }}</option>
            <option value="newest">{{ $t('category.sortByNewest') }}</option>
          </select>
        </div>
        
        <div class="view-toggle">
          <button 
            @click="viewMode = 'grid'" 
            :class="{ active: viewMode === 'grid' }"
            class="toggle-btn"
          >
            <span class="btn-icon">⊞</span>
            {{ $t('category.gridView') }}
          </button>
          <button 
            @click="viewMode = 'list'" 
            :class="{ active: viewMode === 'list' }"
            class="toggle-btn"
          >
            <span class="btn-icon">☰</span>
            {{ $t('category.listView') }}
          </button>
        </div>
      </div>
    </section>

    <!-- 游戏列表区域 -->
    <section class="games-section animate-slide-up animate-delay-500" v-if="filteredGames.length > 0">
      <div class="section-header">
        <h2 class="section-title">
          <span class="title-icon">🎯</span>
          {{ $t('category.gamesInCategory') }}
        </h2>
        <div class="results-count">
          <span class="count-text">{{ $t('category.showingResults', { count: paginatedGames.length, total: filteredGames.length }) }}</span>
          <span class="total-count" v-if="filteredGames.length !== games.length">
            ({{ $t('category.totalGames', { total: games.length }) }})
          </span>
        </div>
      </div>
      
      <div class="game-list" :class="{ 'list-view': viewMode === 'list', 'grid-view': viewMode === 'grid' }">
        <div 
          class="game-card" 
          v-for="(game, index) in paginatedGames" 
          :key="game.id"
          :class="{ 'animate-slide-up': true, [`animate-delay-${Math.min(index * 100, 500)}`]: true }"
          @click="navigateToGame(game.id)"
        >
          <div class="game-image-container">
            <img :src="game.cover || '/placeholder.png'" :alt="game.name" class="game-image">
            <div class="game-overlay">
              <div class="play-button">
                <span class="play-icon">▶</span>
              </div>
            </div>
            
            <!-- 游戏徽章 -->
            <div class="game-badges">
              <div class="gaming-badge" v-if="game.playCount > 100">
                <span class="badge-icon">🔥</span>
                {{ $t('category.hotBadge') }}
              </div>
              <div class="gaming-badge" v-if="game.playCount > 1000">
                <span class="badge-icon">👑</span>
                {{ $t('category.topBadge') }}
              </div>
            </div>
            
            <!-- 游戏评分 -->
            <div class="game-rating">
              <span class="stars">⭐⭐⭐⭐⭐</span>
              <span class="rating-value">5.0</span>
            </div>
          </div>
          
          <div class="game-info">
            <h3 class="game-title">{{ game.name }}</h3>
            <p class="game-description">{{ game.description || $t('category.noDescription') }}</p>
            
            <div class="game-meta">
              <div class="meta-item" v-if="game.author">
                <span class="meta-icon">👨‍💻</span>
                <span class="meta-text">{{ game.author }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-icon">🎯</span>
                <span class="meta-text">{{ game.playCount || 0 }} {{ $t('category.plays') }}</span>
              </div>
              <div class="meta-item" v-if="game.size">
                <span class="meta-icon">💾</span>
                <span class="meta-text">{{ game.size }}</span>
              </div>
            </div>
            
            <div class="game-actions">
              <button class="play-btn btn-gaming" @click.stop="navigateToGame(game.id)">
                <span class="btn-icon">🎮</span>
                {{ $t('category.playNow') }}
              </button>
              <button class="info-btn" @click.stop="showGameInfo(game)">
                <span class="btn-icon">ℹ️</span>
                {{ $t('category.moreInfo') }}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 分页组件 -->
      <Pagination
        v-if="filteredGames.length > 0"
        :current-page="currentPage"
        :total-items="filteredGames.length"
        :items-per-page="itemsPerPage"
        @page-change="handlePageChange"
        @items-per-page-change="handleItemsPerPageChange"
      />
    </section>

    <!-- 空状态 -->
    <section class="empty-state animate-fade-in" v-else-if="!loading">
      <div class="empty-content">
        <div class="empty-icon">🎮</div>
        <h3 class="empty-title">{{ searchQuery ? $t('category.noSearchResults') : $t('category.noGames') }}</h3>
        <p class="empty-description">
          {{ searchQuery ? $t('category.tryDifferentSearch') : $t('category.noGamesDescription') }}
        </p>
        <button class="empty-action" @click="clearSearch" v-if="searchQuery">
          <span class="btn-icon">🔄</span>
          {{ $t('category.clearSearch') }}
        </button>
        <router-link to="/" class="empty-action" v-else>
          <span class="btn-icon">🏠</span>
          {{ $t('category.backToHome') }}
        </router-link>
      </div>
    </section>

    <!-- 加载状态 -->
    <section class="loading-state animate-pulse" v-else>
      <div class="loading-spinner"></div>
      <p class="loading-text">{{ $t('category.loadingGames') }}</p>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGameStore } from '../stores/game'
import Pagination from '../components/Pagination.vue'

const route = useRoute()
const router = useRouter()
const gameStore = useGameStore()
const categoryId = computed(() => route.params.id)
const loading = computed(() => gameStore.loading)

// 筛选和排序状态
const searchQuery = ref('')
const sortBy = ref('name')
const viewMode = ref('grid')

// 分页状态
const currentPage = ref(1)
const itemsPerPage = ref(24)

// 获取分类信息（支持主分类和子分类）
const category = computed(() => {
  // 首先尝试获取主分类
  let cat = gameStore.getCategoryById(categoryId.value)
  if (cat) return cat
  
  // 如果不是主分类，查找是否为子分类
  const parentCategory = gameStore.categories.find(mainCat => 
    mainCat.subCategories && mainCat.subCategories.some(sub => sub.id === categoryId.value)
  )
  
  if (parentCategory) {
    const subCategory = parentCategory.subCategories.find(sub => sub.id === categoryId.value)
    return {
      ...subCategory,
      parentCategory: parentCategory
    }
  }
  
  return null
})

// 获取分类下的游戏
const games = computed(() => gameStore.getGamesByCategory(categoryId.value))

// 分类图标映射
const categoryIcons = {
  // 原有分类
  'action': '⚔️',
  'adventure': '🗺️',
  'puzzle': '🧩',
  'platform': '🏃',
  'racing': '🏎️',
  'sports': '⚽',
  'fighting': '🥊',
  'shooting': '🎯',
  'rpg': '🗡️',
  'strategy': '♟️',
  
  // 新的主分类
  'fc': '🎮',
  'arcade': '🕹️',
  
  // FC子分类
  'fc-action': '⚔️',
  'fc-stg': '🚁',
  'fc-rpg': '🗡️',
  'fc-puzzle': '🧩',
  'fc-spg': '⚽',
  'fc-tab': '🃏',
  'fc-etc': '📦',
  
  // 街机子分类
  'arcade-fighting': '🥊',
  'arcade-shooting': '🎯',
  'arcade-action': '💥',
  'arcade-puzzle': '🧩',
  'arcade-racing': '🏎️',
  'arcade-sports': '⚽',
  'arcade-etc': '📦'
}

const getCategoryIcon = (categoryId) => {
  return categoryIcons[categoryId] || '🎮'
}

// 计算统计数据
const popularGamesCount = computed(() => {
  return games.value.filter(game => (game.playCount || 0) > 100).length
})

const totalPlayTime = computed(() => {
  const totalPlays = games.value.reduce((sum, game) => sum + (game.playCount || 0), 0)
  return Math.round(totalPlays * 15) + 'min' // 假设平均每次15分钟
})

// 筛选和排序后的游戏列表
const filteredGames = computed(() => {
  let filtered = games.value

  // 搜索筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(game => 
      game.name.toLowerCase().includes(query) ||
      (game.description && game.description.toLowerCase().includes(query)) ||
      (game.author && game.author.toLowerCase().includes(query))
    )
  }

  // 排序
  filtered = [...filtered].sort((a, b) => {
    switch (sortBy.value) {
      case 'playCount':
        return (b.playCount || 0) - (a.playCount || 0)
      case 'newest':
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      case 'name':
      default:
        return a.name.localeCompare(b.name)
    }
  })

  return filtered
})

// 分页后的游戏列表
const paginatedGames = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredGames.value.slice(start, end)
})

// 导航到游戏页面
const navigateToGame = (gameId) => {
  const baseUrl = window.location.origin
  const gameUrl = `${baseUrl}/game/${gameId}`
  
  // 检测是否为移动设备
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                   ('ontouchstart' in window) ||
                   (navigator.maxTouchPoints > 0) ||
                   (window.innerWidth <= 768)
  
  if (isMobile) {
    // 移动端：创建隐藏链接并模拟点击，更兼容
    const link = document.createElement('a')
    link.href = gameUrl
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } else {
    // 桌面端：直接使用window.open
    window.open(gameUrl, '_blank', 'noopener,noreferrer')
  }
}

// 显示游戏详情（可以实现为模态框）
const showGameInfo = (game) => {
  // 这里可以实现游戏详情模态框
  console.log('Show game info:', game)
}

// 清除搜索
const clearSearch = () => {
  searchQuery.value = ''
  currentPage.value = 1
}

// 分页处理
const handlePageChange = (page) => {
  currentPage.value = page
  // 滚动到游戏列表顶部
  const gamesSection = document.querySelector('.games-section')
  if (gamesSection) {
    gamesSection.scrollIntoView({ behavior: 'smooth' })
  }
}

const handleItemsPerPageChange = (newItemsPerPage) => {
  itemsPerPage.value = newItemsPerPage
  currentPage.value = 1 // 重置到第一页
}

// 监听筛选条件变化，重置到第一页
watch([searchQuery, sortBy], () => {
  currentPage.value = 1
})

// 加载数据
const loadData = async () => {
  // 如果分类数据为空，先加载分类数据
  if (gameStore.categories.length === 0) {
    await gameStore.fetchCategories()
  }
  
  // 加载当前分类的游戏数据
  if (categoryId.value) {
    await gameStore.fetchGamesByCategory(categoryId.value)
  }
}

// 监听路由参数变化，重新获取游戏数据
watch(categoryId, () => {
  loadData()
})

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.category-view {
  min-height: 100vh;
}

/* 分类英雄区域 */
.category-hero {
  position: relative;
  padding: 4rem 0;
  text-align: center;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
}

.category-particles {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle at 20% 30%, rgba(79, 70, 229, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(16, 185, 129, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.1) 0%, transparent 50%);
  animation: gaming-bg-float 12s ease-in-out infinite;
}

.floating-icons {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.floating-icons .game-icon {
  position: absolute;
  font-size: 2rem;
  opacity: 0.3;
  animation: float var(--animation-float) ease-in-out infinite;
}

.floating-icons .game-icon:nth-child(1) { top: 20%; left: 10%; animation-delay: 0s; }
.floating-icons .game-icon:nth-child(2) { top: 30%; right: 15%; animation-delay: 1s; }
.floating-icons .game-icon:nth-child(3) { bottom: 40%; left: 20%; animation-delay: 2s; }
.floating-icons .game-icon:nth-child(4) { bottom: 20%; right: 10%; animation-delay: 3s; }

.hero-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 2;
}

.category-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(45deg, var(--color-gaming-purple), var(--color-primary));
  color: white;
  border-radius: var(--border-radius-full);
  font-weight: 600;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-gaming);
}

.badge-icon {
  font-size: 1.2rem;
}

.category-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  background: linear-gradient(45deg, var(--color-primary), var(--color-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.category-description {
  font-size: 1.2rem;
  color: var(--color-text-light);
  margin-bottom: 3rem;
  line-height: 1.6;
}

.category-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-md);
  transition: transform var(--transition-normal);
}

.stat-item:hover {
  transform: translateY(-5px);
}

.stat-icon {
  font-size: 2.5rem;
}

.stat-info {
  text-align: left;
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--color-text-light);
  font-weight: 600;
}

/* 筛选区域 */
.filters-section {
  padding: 2rem 0;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
}

.filters-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: var(--color-text);
  font-size: 0.9rem;
}

.label-icon {
  font-size: 1rem;
}

.search-input-wrapper {
  position: relative;
}

.filter-input {
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 2px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  font-size: 1rem;
  width: 250px;
  transition: all var(--transition-normal);
}

.filter-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.1);
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-light);
}

.filter-select {
  padding: 0.75rem 1rem;
  border: 2px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  font-size: 1rem;
  background: white;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.filter-select:focus {
  border-color: var(--color-primary);
  outline: none;
}

.view-toggle {
  display: flex;
  gap: 0.5rem;
  margin-left: auto;
}

.toggle-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--color-background);
  border: 2px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  cursor: pointer;
  transition: all var(--transition-normal);
  font-size: 0.9rem;
  font-weight: 500;
}

.toggle-btn:hover {
  background: var(--color-background-soft);
}

.toggle-btn.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.btn-icon {
  font-size: 1rem;
}

/* 游戏列表区域 */
.games-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text);
}

.title-icon {
  font-size: 2.2rem;
}

.results-count {
  padding: 0.5rem 1rem;
  background: var(--color-background-soft);
  border-radius: var(--border-radius-lg);
}

.count-text {
  font-size: 0.9rem;
  color: var(--color-text-light);
  font-weight: 500;
}

/* 游戏列表样式 */
.game-list.grid-view {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
}

.game-list.list-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.game-list.list-view .game-card {
  display: flex;
  align-items: center;
  padding: 1.5rem;
}

.game-list.list-view .game-image-container {
  width: 120px;
  height: 80px;
  flex-shrink: 0;
  margin-right: 1.5rem;
}

.game-list.list-view .game-info {
  flex: 1;
  padding: 0;
}

.game-card {
  background: var(--color-background);
  border-radius: var(--border-radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
  cursor: pointer;
  position: relative;
}

.game-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
}

.game-image-container {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.game-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-normal);
}

.game-card:hover .game-image {
  transform: scale(1.1);
}

.game-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.game-card:hover .game-overlay {
  opacity: 1;
}

.play-button {
  width: 60px;
  height: 60px;
  background: linear-gradient(45deg, var(--color-primary), var(--color-secondary));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  animation: pulse var(--animation-pulse) infinite;
}

.game-badges {
  position: absolute;
  top: 1rem;
  left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.game-rating {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.5rem;
  border-radius: var(--border-radius-lg);
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
}

.stars {
  font-size: 0.7rem;
}

.rating-value {
  font-weight: 600;
}

.game-info {
  padding: 1.5rem;
}

.game-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: var(--color-text);
}

.game-description {
  color: var(--color-text-light);
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.game-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.85rem;
  color: var(--color-text-light);
}

.meta-icon {
  font-size: 0.9rem;
}

.game-actions {
  display: flex;
  gap: 0.75rem;
}

.play-btn {
  flex: 1;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
}

.info-btn {
  padding: 0.75rem;
  background: var(--color-background-soft);
  border: 2px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  cursor: pointer;
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.85rem;
  color: var(--color-text-light);
}

.info-btn:hover {
  background: var(--color-background-mute);
  border-color: var(--color-primary);
}

/* 空状态 */
.empty-state {
  padding: 4rem 2rem;
  text-align: center;
}

.empty-content {
  max-width: 500px;
  margin: 0 auto;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 2rem;
  opacity: 0.5;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--color-text);
}

.empty-description {
  color: var(--color-text-light);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.empty-action {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--color-primary);
  color: white;
  text-decoration: none;
  border: none;
  border-radius: var(--border-radius-lg);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.empty-action:hover {
  background: var(--color-primary-dark);
  transform: translateY(-2px);
}

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 2rem;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid var(--color-border);
  border-top: 4px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  font-size: 1.1rem;
  color: var(--color-text-light);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .category-title {
    font-size: 2.5rem;
  }
  
  .category-stats {
    gap: 2rem;
  }
  
  .filters-container {
    flex-direction: column;
    align-items: stretch;
    gap: 1.5rem;
  }
  
  .view-toggle {
    margin-left: 0;
    justify-content: center;
  }
  
  .game-list.grid-view {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

@media (max-width: 768px) {
  .category-hero {
    padding: 2rem 0;
  }
  
  .category-title {
    font-size: 2rem;
  }
  
  .category-stats {
    flex-direction: column;
    gap: 1rem;
  }
  
  .stat-item {
    justify-content: center;
    text-align: center;
  }
  
  .filters-container {
    padding: 0 1rem;
  }
  
  .filter-input {
    width: 100%;
  }
  
  .games-section {
    padding: 2rem 1rem;
  }
  
  .section-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .game-list.grid-view {
    grid-template-columns: 1fr;
  }
  
  .game-list.list-view .game-card {
    flex-direction: column;
    text-align: center;
  }
  
  .game-list.list-view .game-image-container {
    width: 100%;
    height: 200px;
    margin-right: 0;
    margin-bottom: 1rem;
  }
}

@media (max-width: 480px) {
  .category-title {
    font-size: 1.8rem;
  }
  
  .floating-icons .game-icon {
    font-size: 1.5rem;
  }
  
  .game-actions {
    flex-direction: column;
  }
  
  .play-btn {
    flex: none;
  }
}
</style> 