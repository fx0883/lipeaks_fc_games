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
  <div class="game-view gaming-bg">
    <!-- 游戏头部信息 -->
    <section class="game-header animate-slide-up">
      <div class="game-hero">
        <div class="game-cover">
          <img :src="game?.cover || '/placeholder.png'" :alt="game?.name" class="cover-image">
          <div class="cover-overlay">
            <div class="play-status" v-if="game">
              <span class="gaming-badge">
                <span class="badge-icon">🎮</span>
                {{ $t('game.readyToPlay') }}
              </span>
            </div>
          </div>
        </div>
        
        <div class="game-info">
          <h1 class="game-title">{{ game ? getGameName(game) : $t('game.loading') }}</h1>
          
          <div class="game-meta" v-if="game">
            <div class="meta-item animate-slide-left animate-delay-100">
              <span class="meta-icon">📂</span>
              <span class="meta-label">{{ $t('game.category') }}:</span>
              <span class="meta-value category-tag">{{ categoryName }}</span>
            </div>
            
            <div class="meta-item animate-slide-left animate-delay-200">
              <span class="meta-icon">🎯</span>
              <span class="meta-label">{{ $t('game.playCount') }}:</span>
              <span class="gaming-score">{{ game.playCount || 0 }}</span>
            </div>
            
            <div class="meta-item animate-slide-left animate-delay-300" v-if="game.author">
              <span class="meta-icon">👨‍💻</span>
              <span class="meta-label">{{ $t('game.author') }}:</span>
              <span class="meta-value">{{ game.author }}</span>
            </div>
            
            <div class="meta-item animate-slide-left animate-delay-400" v-if="game.size">
              <span class="meta-icon">💾</span>
              <span class="meta-label">{{ $t('game.size') }}:</span>
              <span class="meta-value">{{ game.size }}</span>
            </div>
          </div>
          
          <!-- 游戏评分和徽章 -->
          <div class="game-badges" v-if="game">
            <div class="rating-section">
              <div class="star-rating">
                <span class="stars">⭐⭐⭐⭐⭐</span>
                <span class="rating-text">{{ $t('game.rating') }}: 5.0</span>
              </div>
            </div>
            
            <div class="achievement-badges">
              <div class="gaming-badge" v-if="game.playCount > 100">
                <span class="badge-icon">🏆</span>
                {{ $t('game.popularBadge') }}
              </div>
              <div class="gaming-badge" v-if="game.playCount > 1000">
                <span class="badge-icon">👑</span>
                {{ $t('game.legendaryBadge') }}
              </div>
              <div class="gaming-level" v-if="game.version">
                v{{ game.version }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 模拟器容器 -->
    <section class="emulator-section animate-fade-in animate-delay-500" v-if="game">
      <div class="emulator-container card-gaming">
        <div class="emulator-header">
          <h2 class="section-title">
            <span class="title-icon">🕹️</span>
            {{ $t('game.playGame') }}
          </h2>
          <div class="emulator-status">
            <div class="status-indicator" :class="{ active: isGameActive }">
              <span class="indicator-dot"></span>
              <span class="status-text">{{ isGameActive ? $t('game.running') : $t('game.ready') }}</span>
            </div>
          </div>
        </div>
        
        <!-- 使用重构后的FC模拟器组件 -->
        <FCEmulator 
          :rom-path="game.romPath" 
          :game-name="game.name"
          :core="game.core || getDefaultCore(game.category)"
          :show-controls="true"
          :show-status-info="true"
          @game-loaded="onGameLoaded"
          @game-started="onGameStarted"
          @paused="onGamePaused"
          @resumed="onGameResumed"
          @error="onGameError"
          @state-changed="onStateChanged"
        />
      </div>
    </section>

    <!-- 游戏信息详情 -->
    <section class="game-details animate-slide-up animate-delay-300" v-if="game">
      <div class="details-grid">
        <!-- 游戏描述 -->
        <div class="detail-card card">
          <h3 class="card-title">
            <span class="title-icon">📝</span>
            {{ $t('game.description') }}
          </h3>
          <p class="game-description">{{ getGameDescription(game) }}</p>
          
          <div class="game-specs" v-if="game.version || game.region">
            <div class="spec-item" v-if="game.version">
              <span class="spec-label">{{ $t('game.version') }}:</span>
              <span class="spec-value">{{ game.version }}</span>
            </div>
            <div class="spec-item" v-if="game.region">
              <span class="spec-label">{{ $t('game.region') }}:</span>
              <span class="spec-value">{{ game.region }}</span>
            </div>
          </div>
        </div>
        
        <!-- 游戏统计 -->
        <div class="detail-card card">
          <h3 class="card-title">
            <span class="title-icon">📊</span>
            {{ $t('game.statistics') }}
          </h3>
          
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-icon">🎮</div>
              <div class="stat-info">
                <div class="stat-value gaming-score">{{ game.playCount || 0 }}</div>
                <div class="stat-label">{{ $t('game.totalPlays') }}</div>
              </div>
            </div>
            
            <div class="stat-item">
              <div class="stat-icon">⏱️</div>
              <div class="stat-info">
                <div class="stat-value gaming-score">{{ gamePlayTime }}</div>
                <div class="stat-label">{{ $t('game.playTime') }}</div>
              </div>
            </div>
            
            <div class="stat-item">
              <div class="stat-icon">🏆</div>
              <div class="stat-info">
                <div class="stat-value gaming-score">{{ gameRank }}</div>
                <div class="stat-label">{{ $t('game.popularity') }}</div>
              </div>
            </div>
          </div>
          
          <!-- 进度条示例 -->
          <div class="progress-section">
            <div class="progress-label">{{ $t('game.completionRate') }}</div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: completionRate + '%' }"></div>
            </div>
            <div class="progress-text">{{ completionRate }}%</div>
          </div>
        </div>
        
        <!-- 控制说明 -->
        <div class="detail-card card">
          <h3 class="card-title">
            <span class="title-icon">🎯</span>
            {{ $t('game.controls') }}
          </h3>
          
          <div class="controls-grid">
            <div class="control-item" v-for="(control, index) in controlsData" :key="index">
              <kbd class="key">{{ control.key }}</kbd>
              <span class="control-desc">{{ control.desc }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 加载状态 -->
    <div class="loading-state animate-pulse" v-else>
      <div class="loading-spinner"></div>
      <p>{{ $t('game.loading') }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useGameStore } from '../stores/game'
import { useGameI18n } from '../composables/useGameI18n'
import FCEmulator from '../components/FCEmulator.vue'

const route = useRoute()
const { t } = useI18n()
const gameStore = useGameStore()
const { getGameName, getGameDescription } = useGameI18n()
const gameId = computed(() => route.params.id)
const game = computed(() => gameStore.currentGame)
const loading = computed(() => gameStore.loading)
const isGameActive = ref(false)

// 获取分类名称
const categoryName = computed(() => {
  if (!game.value || !game.value.category) return ''
  const category = gameStore.getCategoryById(game.value.category)
  return category ? category.name : game.value.category
})

// 根据游戏分类获取默认核心
const getDefaultCore = (category) => {
  const coreMapping = {
    'action': 'fceumm',  // FC动作游戏默认用fceumm
    'arcade': 'mame2003_plus',  // 街机游戏默认用mame2003_plus
    'nes': 'fceumm',
    'mame': 'mame2003_plus'
  }
  return coreMapping[category] || 'fceumm'
}

// 根据游戏核心类型获取控制说明
const controlsData = computed(() => {
  if (!game.value) return []
  
  const core = game.value.core || getDefaultCore(game.value.category)
  
  // MAME街机游戏的按键说明
  if (['mame2003_plus', 'mame2003', 'fbneo'].includes(core)) {
    return [
      { key: '↑↓←→', desc: t('game.movement') },
      { key: 'Z', desc: t('game.button1') },
      { key: 'X', desc: t('game.button2') },
      { key: 'A', desc: t('game.button3') },
      { key: 'S', desc: t('game.button4') },
      { key: 'V', desc: t('game.coin') },
      { key: 'Enter', desc: t('game.start') }
    ]
  }
  
  // FC游戏的按键说明 (默认)
  return [
    { key: '↑↓←→', desc: t('game.movement') },
    { key: 'Z', desc: t('game.buttonA') },
    { key: 'X', desc: t('game.buttonB') },
    { key: 'Enter', desc: t('game.start') },
    { key: 'V', desc: t('game.select') }
  ]
})

// 计算游戏统计数据
const gamePlayTime = computed(() => {
  // 模拟游戏时长计算
  const playCount = game.value?.playCount || 0
  const avgTime = 15 // 假设平均每次游玩15分钟
  return Math.round(playCount * avgTime) + 'min'
})

const gameRank = computed(() => {
  // 模拟游戏排名计算
  const allGames = gameStore.getAllGames
  const currentGame = game.value
  if (!currentGame) return 'N/A'
  
  const sortedGames = allGames.sort((a, b) => (b.playCount || 0) - (a.playCount || 0))
  const rank = sortedGames.findIndex(g => g.id === currentGame.id) + 1
  return rank > 0 ? `#${rank}` : 'N/A'
})

const completionRate = computed(() => {
  // 模拟完成度计算
  const playCount = game.value?.playCount || 0
  return Math.min(Math.round(playCount / 10), 100)
})

// 游戏事件处理
const onGameLoaded = () => {
  // 游戏加载完成 - 生产环境不输出日志
  isGameActive.value = true
}

const onGameStarted = () => {
  // 游戏开始时增加播放次数
  gameStore.incrementPlayCount(gameId.value)
  isGameActive.value = true
  // 游戏开始 - 生产环境不输出日志
}

const onGamePaused = () => {
  // 游戏暂停 - 生产环境不输出日志
  isGameActive.value = false
}

const onGameResumed = () => {
  // 游戏恢复 - 生产环境不输出日志
  isGameActive.value = true
}

const onGameError = (error) => {
  console.error(t('game.gameError'), error)
  isGameActive.value = false
  // 可以在这里显示用户友好的错误提示
}

const onStateChanged = (stateChange) => {
  // 状态变化 - 生产环境不输出日志
  // 可以在这里处理状态变化，如更新UI等
  isGameActive.value = ['running', 'ready'].includes(stateChange.to)
}

// 加载游戏数据
onMounted(async () => {
  // 如果分类数据为空，先加载分类数据
  if (gameStore.categories.length === 0) {
    await gameStore.fetchCategories()
  }
  
  // 加载游戏数据
  await gameStore.fetchGameById(gameId.value)
})
</script>

<style scoped>
.game-view {
  min-height: 100vh;
  padding: 2rem 0;
}

/* 游戏头部 */
.game-header {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  margin-bottom: 3rem;
}

.game-hero {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 3rem;
  align-items: start;
}

.game-cover {
  position: relative;
  border-radius: var(--border-radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-xl);
  transition: transform var(--transition-normal);
}

.game-cover:hover {
  transform: scale(1.05) rotate(2deg);
}

.cover-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

.cover-overlay {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.game-info {
  padding: 1rem 0;
}

.game-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 2rem;
  background: linear-gradient(45deg, var(--color-primary), var(--color-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.game-meta {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
}

.meta-item:hover {
  transform: translateX(10px);
  box-shadow: var(--shadow-md);
}

.meta-icon {
  font-size: 1.2rem;
}

.meta-label {
  font-weight: 600;
  color: var(--color-text-light);
}

.meta-value {
  font-weight: 500;
  color: var(--color-text);
}

.category-tag {
  background: linear-gradient(45deg, var(--color-accent), var(--color-accent-light));
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: var(--border-radius-full);
  font-size: 0.875rem;
  font-weight: 600;
}

/* 游戏徽章 */
.game-badges {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.rating-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.star-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stars {
  font-size: 1.5rem;
  filter: drop-shadow(0 0 5px var(--color-gaming-gold));
}

.rating-text {
  font-weight: 600;
  color: var(--color-text);
}

.achievement-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

/* 模拟器区域 */
.emulator-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  margin-bottom: 3rem;
}

.emulator-container {
  padding: 2rem;
  background: var(--color-background);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-border);
}

.emulator-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-text);
}

.title-icon {
  font-size: 2rem;
}

.emulator-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--color-background-mute);
  border-radius: var(--border-radius-full);
  transition: all var(--transition-normal);
}

.status-indicator.active {
  background: linear-gradient(45deg, var(--color-success), var(--color-gaming-neon));
  color: white;
}

.indicator-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-text-muted);
  transition: all var(--transition-normal);
}

.status-indicator.active .indicator-dot {
  background: white;
  animation: pulse var(--animation-pulse) infinite;
}

.status-text {
  font-size: 0.875rem;
  font-weight: 600;
}

/* 游戏详情 */
.game-details {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.detail-card {
  padding: 2rem;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--color-text);
}

.game-description {
  line-height: 1.8;
  color: var(--color-text-light);
  margin-bottom: 1.5rem;
}

.game-specs {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.spec-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--color-border);
}

.spec-label {
  font-weight: 600;
  color: var(--color-text-light);
}

.spec-value {
  font-weight: 500;
  color: var(--color-text);
}

/* 统计数据 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-item {
  text-align: center;
  padding: 1rem;
  background: var(--color-background-soft);
  border-radius: var(--border-radius-lg);
  transition: transform var(--transition-normal);
}

.stat-item:hover {
  transform: translateY(-5px);
}

.stat-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--color-text-light);
}

/* 进度条 */
.progress-section {
  margin-top: 1.5rem;
}

.progress-label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-text);
}

.progress-text {
  text-align: center;
  font-size: 0.875rem;
  font-weight: 600;
  margin-top: 0.5rem;
  color: var(--color-primary);
}

/* 控制说明 */
.controls-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.control-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: var(--color-background-soft);
  border-radius: var(--border-radius-lg);
  transition: all var(--transition-normal);
}

.control-item:hover {
  background: var(--color-background-mute);
  transform: translateX(5px);
}

.key {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  height: 2rem;
  padding: 0 0.5rem;
  background: linear-gradient(145deg, #f0f0f0, #d0d0d0);
  border: 2px solid #ccc;
  border-radius: 6px;
  font-family: var(--font-family-gaming);
  font-size: 0.875rem;
  font-weight: bold;
  color: var(--color-text);
  box-shadow: 
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    0 2px 4px rgba(0, 0, 0, 0.1);
}

.control-desc {
  font-size: 0.95rem;
  color: var(--color-text-light);
}

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
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

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .game-hero {
    grid-template-columns: 250px 1fr;
    gap: 2rem;
  }
  
  .game-title {
    font-size: 2.5rem;
  }
}

@media (max-width: 768px) {
  .game-view {
    padding: 1rem 0;
  }
  
  .game-header,
  .emulator-section,
  .game-details {
    padding: 0 1rem;
  }
  
  .game-hero {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    text-align: center;
  }
  
  .game-cover {
    max-width: 300px;
    margin: 0 auto;
  }
  
  .cover-image {
    height: 300px;
  }
  
  .game-title {
    font-size: 2rem;
  }
  
  .details-grid {
    grid-template-columns: 1fr;
  }
  
  .emulator-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  }
  
  .controls-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .game-title {
    font-size: 1.8rem;
  }
  
  .meta-item {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
  
  .achievement-badges {
    justify-content: center;
  }
}

/* 暗模式下的模拟器容器优化 */
[data-theme="dark"] .emulator-container {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-lg);
}

[data-theme="dark"] .detail-card {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-lg);
}

[data-theme="dark"] .meta-item {
  background: var(--color-background-mute);
  border: 1px solid var(--color-border);
}

[data-theme="dark"] .meta-item:hover {
  background: var(--color-background);
  border-color: var(--color-border-hover);
}
</style> 