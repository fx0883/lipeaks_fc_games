<template>
  <div class="search-view">
    <div class="search-header">
      <h1>{{ $t('search.resultsTitle', { query: searchQuery }) }}</h1>
      <p>{{ $t('search.resultsCount', { count: searchResults.length }) }}</p>
    </div>

    <div class="search-results" v-if="searchResults.length > 0">
      <div class="game-card" v-for="game in searchResults" :key="game.id" @click="navigateToGame(game.id)">
          <div class="game-image">
            <img :src="game.cover" :alt="game.name">
          </div>
          <div class="game-info">
            <h3>{{ getGameName(game) }}</h3>
            <div class="game-meta">
              <span class="category" v-if="getCategoryName(game.category)">{{ getCategoryName(game.category) }}</span>
              <span class="author" v-if="game.author">{{ game.author }}</span>
            </div>
            <p>{{ getGameDescription(game) }}</p>
          </div>
      </div>
    </div>

    <div class="no-results" v-else-if="!loading">
      <p>{{ $t('search.noResults', { query: searchQuery }) }}</p>
      <p>{{ $t('search.noResultsHelp') }}<router-link to="/">{{ $t('search.allGames') }}</router-link></p>
    </div>

    <div class="loading" v-if="loading">
      <p>{{ $t('search.searching') }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGameStore } from '../stores/game'
import { useGameI18n } from '../composables/useGameI18n'

const route = useRoute()
const router = useRouter()
const gameStore = useGameStore()
const { getGameName, getGameDescription } = useGameI18n()

const searchQuery = computed(() => route.query.q || '')
const searchResults = computed(() => gameStore.searchResults)
const loading = computed(() => gameStore.loading)

// 获取分类名称
const getCategoryName = (categoryId) => {
  if (!categoryId) return ''
  const category = gameStore.getCategoryById(categoryId)
  return category ? category.name : categoryId
}

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

// 执行搜索
const performSearch = async () => {
  if (searchQuery.value) {
    await gameStore.searchGames(searchQuery.value)
  }
}

// 监听路由参数变化，重新搜索
watch(() => route.query.q, () => {
  performSearch()
})

// 组件挂载时执行搜索
onMounted(() => {
  performSearch()
})
</script>

<style scoped>
.search-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.search-header {
  margin-bottom: 30px;
}

.search-header p {
  color: var(--color-text-light);
}

.search-results {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.game-card {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.game-card:hover {
  transform: translateY(-5px);
  cursor: pointer;
}

.game-image img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.game-info {
  padding: 15px;
}

.game-info h3 {
  margin: 0 0 10px;
}

.game-meta {
  display: flex;
  margin-bottom: 10px;
}

.game-meta span {
  margin-right: 15px;
  font-size: 0.9em;
  color: var(--color-text-light);
}

.game-info p {
  margin: 0;
  color: var(--color-text-light);
  font-size: 0.9em;
}

.no-results, .loading {
  text-align: center;
  padding: 50px 0;
  color: var(--color-text-light);
}

.no-results a {
  color: var(--color-primary);
  text-decoration: none;
}
</style> 