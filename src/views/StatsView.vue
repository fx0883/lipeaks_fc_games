<!--
  Lipeaks FC Games - 统计页面
  Copyright (C) 2024 Lipeaks
-->
<template>
  <div class="stats-view">
    <div class="container">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1 class="page-title">
          <span class="title-icon">📊</span>
          {{ $t('stats.visitorStatistics') }}
        </h1>
        <p class="page-subtitle">{{ $t('stats.pageSubtitle') }}</p>
      </div>

      <!-- 主要统计数据 -->
      <div class="stats-section">
        <VisitorStats :compact="false" :show-trend="true" />
      </div>

      <!-- 网站信息 -->
      <div class="site-info-section">
        <div class="info-grid">
          <div class="info-card">
            <div class="card-icon">🎮</div>
            <div class="card-content">
              <div class="card-value">{{ gameCount }}</div>
              <div class="card-label">{{ $t('home.totalGames') }}</div>
            </div>
          </div>
          
          <div class="info-card">
            <div class="card-icon">📂</div>
            <div class="card-content">
              <div class="card-value">{{ categoryCount }}</div>
              <div class="card-label">{{ $t('home.categories') }}</div>
            </div>
          </div>
          
          <div class="info-card">
            <div class="card-icon">🌐</div>
            <div class="card-content">
              <div class="card-value">{{ $t('stats.multiPlatform') }}</div>
              <div class="card-label">{{ $t('stats.platformSupport') }}</div>
            </div>
          </div>
          
          <div class="info-card">
            <div class="card-icon">🆓</div>
            <div class="card-content">
              <div class="card-value">{{ $t('stats.freeForever') }}</div>
              <div class="card-label">{{ $t('stats.serviceType') }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 技术信息 -->
      <div class="tech-info-section">
        <h2 class="section-title">{{ $t('stats.techInfo') }}</h2>
        <div class="tech-grid">
          <div class="tech-item">
            <span class="tech-icon">⚡</span>
            <span class="tech-name">Vue 3</span>
            <span class="tech-desc">{{ $t('stats.frontendFramework') }}</span>
          </div>
          
          <div class="tech-item">
            <span class="tech-icon">🎨</span>
            <span class="tech-name">CSS3</span>
            <span class="tech-desc">{{ $t('stats.styling') }}</span>
          </div>
          
          <div class="tech-item">
            <span class="tech-icon">📱</span>
            <span class="tech-name">PWA</span>
            <span class="tech-desc">{{ $t('stats.progressiveWebApp') }}</span>
          </div>
          
          <div class="tech-item">
            <span class="tech-icon">🚀</span>
            <span class="tech-name">Vite</span>
            <span class="tech-desc">{{ $t('stats.buildTool') }}</span>
          </div>
        </div>
      </div>

      <!-- 隐私声明 -->
      <div class="privacy-section">
        <h2 class="section-title">{{ $t('stats.privacyTitle') }}</h2>
        <div class="privacy-content">
          <div class="privacy-item">
            <span class="privacy-icon">🔒</span>
            <div class="privacy-text">
              <h3>{{ $t('stats.localStorage') }}</h3>
              <p>{{ $t('stats.localStorageDesc') }}</p>
            </div>
          </div>
          
          <div class="privacy-item">
            <span class="privacy-icon">🚫</span>
            <div class="privacy-text">
              <h3>{{ $t('stats.noCookies') }}</h3>
              <p>{{ $t('stats.noCookiesDesc') }}</p>
            </div>
          </div>
          
          <div class="privacy-item">
            <span class="privacy-icon">📊</span>
            <div class="privacy-text">
              <h3>{{ $t('stats.anonymousData') }}</h3>
              <p>{{ $t('stats.anonymousDataDesc') }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 开发者选项 -->
      <div v-if="isDevelopment" class="dev-section">
        <h2 class="section-title">{{ $t('stats.developerOptions') }}</h2>
        <div class="dev-actions">
          <button @click="resetStats" class="dev-btn reset-btn">
            <span class="btn-icon">🔄</span>
            {{ $t('stats.resetStats') }}
          </button>
          <button @click="showRawData = !showRawData" class="dev-btn">
            <span class="btn-icon">🔍</span>
            {{ showRawData ? $t('stats.hideRawData') : $t('stats.showRawData') }}
          </button>
        </div>
        
        <div v-if="showRawData" class="raw-data">
          <h3>{{ $t('stats.rawDataTitle') }}</h3>
          <pre>{{ rawStatsData }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useGameStore } from '../stores/game'
import { useVisitorStats } from '../composables/useVisitorStats'
import VisitorStats from '../components/VisitorStats.vue'

// Store
const gameStore = useGameStore()

// 访客统计
const {
  totalVisitors,
  todayVisitors,
  yesterdayVisitors,
  getDaysOnline,
  resetStats
} = useVisitorStats()

// 本地状态
const showRawData = ref(false)

// 计算属性
const isDevelopment = computed(() => import.meta.env.DEV)

const gameCount = computed(() => {
  return gameStore.getAllGames.length || 0
})

const categoryCount = computed(() => {
  let count = 0
  gameStore.categories.forEach(category => {
    count += 1 + (category.subCategories ? category.subCategories.length : 0)
  })
  return count
})

const rawStatsData = computed(() => {
  return JSON.stringify({
    totalVisitors: totalVisitors.value,
    todayVisitors: todayVisitors.value,
    yesterdayVisitors: yesterdayVisitors.value,
    daysOnline: getDaysOnline.value,
    gameCount: gameCount.value,
    categoryCount: categoryCount.value,
    localStorage: {
      visitorStats: localStorage.getItem('lipeaks_visitor_stats'),
      lastVisit: localStorage.getItem('lipeaks_last_visit')
    },
    sessionStorage: {
      sessionId: sessionStorage.getItem('lipeaks_session_id')
    }
  }, null, 2)
})

// 方法
const handleResetStats = () => {
  if (confirm('确定要重置所有访客统计数据吗？此操作不可撤销。')) {
    resetStats()
  }
}

// 生命周期
onMounted(async () => {
  // 确保加载了分类数据
  if (gameStore.categories.length === 0) {
    await gameStore.fetchCategories()
  }
})
</script>

<style scoped>
.stats-view {
  min-height: 100vh;
  padding: 2rem 0;
  background: var(--color-background);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 1rem 0;
}

.title-icon {
  font-size: 3rem;
}

.page-subtitle {
  font-size: 1.2rem;
  color: var(--color-text-light);
  margin: 0;
}

.stats-section {
  margin-bottom: 3rem;
}

.site-info-section,
.tech-info-section,
.privacy-section,
.dev-section {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 1.5rem 0;
  text-align: center;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.info-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  transition: all var(--transition-normal);
}

.info-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.card-icon {
  font-size: 2rem;
}

.card-content {
  flex: 1;
}

.card-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1.2;
}

.card-label {
  font-size: 0.9rem;
  color: var(--color-text-light);
  margin-top: 0.25rem;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.tech-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--color-background-soft);
  border-radius: var(--border-radius);
  transition: background-color var(--transition-normal);
}

.tech-item:hover {
  background: var(--color-background-mute);
}

.tech-icon {
  font-size: 1.5rem;
}

.tech-name {
  font-weight: 600;
  color: var(--color-text);
  min-width: 60px;
}

.tech-desc {
  color: var(--color-text-light);
  font-size: 0.9rem;
}

.privacy-content {
  display: grid;
  gap: 1.5rem;
}

.privacy-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
}

.privacy-icon {
  font-size: 1.5rem;
  margin-top: 0.25rem;
}

.privacy-text h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text);
}

.privacy-text p {
  margin: 0;
  color: var(--color-text-light);
  line-height: 1.5;
}

.dev-section {
  border-top: 2px solid var(--color-border);
  padding-top: 2rem;
}

.dev-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  justify-content: center;
}

.dev-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  background: var(--color-background);
  color: var(--color-text);
  cursor: pointer;
  transition: all var(--transition-normal);
  font-size: 0.9rem;
}

.dev-btn:hover {
  background: var(--color-background-soft);
}

.reset-btn {
  border-color: #dc2626;
  color: #dc2626;
}

.reset-btn:hover {
  background: #fef2f2;
}

.raw-data {
  background: var(--color-background-soft);
  border-radius: var(--border-radius);
  padding: 1rem;
}

.raw-data h3 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  color: var(--color-text);
}

.raw-data pre {
  background: var(--color-background-mute);
  padding: 1rem;
  border-radius: var(--border-radius);
  overflow-x: auto;
  font-size: 0.8rem;
  line-height: 1.4;
  color: var(--color-text);
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .title-icon {
    font-size: 2.2rem;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .tech-grid {
    grid-template-columns: 1fr;
  }
  
  .tech-item {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
  
  .dev-actions {
    flex-direction: column;
    align-items: center;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 0.5rem;
  }
  
  .privacy-item,
  .info-card {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }
}
</style>