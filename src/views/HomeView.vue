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
  <div class="home">
    <!-- 英雄区域 -->
    <section class="hero-section">
      <div class="hero-background">
        <div class="gaming-particles"></div>
        <div class="floating-icons">
          <div class="game-icon">🎮</div>
          <div class="game-icon">🕹️</div>
          <div class="game-icon">👾</div>
          <div class="game-icon">🎯</div>
          <div class="game-icon">⭐</div>
        </div>
      </div>
      <div class="hero-content">
        <h1 class="hero-title">{{ $t('app.title') }}</h1>
        <p class="hero-subtitle">{{ $t('home.heroSubtitle') }}</p>
        <div class="hero-stats">
          <div class="stat-item">
            <div class="stat-number">{{ totalGames }}</div>
            <div class="stat-label">{{ $t('home.totalGames') }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ categories.length }}</div>
            <div class="stat-label">{{ $t('home.categories') }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ totalPlays }}</div>
            <div class="stat-label">{{ $t('home.totalPlays') }}</div>
          </div>
        </div>
        <button class="hero-cta" @click="scrollToGames">
          {{ $t('home.startPlaying') }}
          <span class="cta-arrow">🚀</span>
        </button>
      </div>
    </section>

    <!-- 游戏分类区域 -->
    <section class="categories-section" ref="categoriesRef">
      <div class="section-header">
        <h2 class="section-title">{{ $t('home.gameCategories') }}</h2>
        <p class="section-subtitle">{{ $t('home.categoriesSubtitle') }}</p>
      </div>
      <div class="category-grid">
        <div class="category-card" v-for="category in categories" :key="category.id" @click="navigateToCategory(category.id)">
          <div class="category-icon">🎯</div>
          <h3 class="category-name">{{ category.name }}</h3>
          <p class="category-desc">{{ category.description || $t('home.categoryDefaultDesc') }}</p>
          <div class="category-stats">
            <span class="game-count">{{ getCategoryGameCount(category.id) }} {{ $t('home.games') }}</span>
          </div>
          <div class="category-overlay">
            <span class="play-text">{{ $t('home.playNow') }}</span>
        </div>
      </div>
    </div>
    </section>
    
    <!-- 热门游戏区域 -->
    <section class="popular-games-section" ref="gamesRef">
      <div class="section-header">
        <h2 class="section-title">{{ $t('home.popularGames') }}</h2>
        <p class="section-subtitle">{{ $t('home.popularGamesSubtitle') }}</p>
      </div>
      <div class="games-grid" v-if="popularGames.length > 0">
        <div class="game-card" v-for="game in popularGames.slice(0, 8)" :key="game.id" @click="navigateToGame(game.id)">
          <div class="game-image-container">
            <img :src="game.cover || '/placeholder.png'" :alt="game.name" class="game-image">
            <div class="game-overlay">
              <div class="play-button">
                <span class="play-icon">▶</span>
              </div>
            </div>
            <div class="game-rating">
              <span class="rating-stars">⭐⭐⭐⭐⭐</span>
            </div>
            </div>
            <div class="game-info">
            <h3 class="game-title">{{ game.name }}</h3>
            <p class="game-description">{{ game.description || $t('home.noDescription') }}</p>
            <div class="game-stats">
              <span class="play-count">🎮 {{ game.playCount || 0 }} {{ $t('home.plays') }}</span>
              <span class="game-category">📂 {{ getCategoryName(game.category) }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="loading-state" v-else-if="loading">
        <div class="loading-spinner"></div>
        <p>{{ $t('home.loadingPopularGames') }}</p>
      </div>
      <div class="empty-state" v-else>
        <div class="empty-icon">🎮</div>
        <p>{{ $t('home.noPopularGames') }}</p>
      </div>
    </section>

    <!-- 特色功能区域 -->
    <section class="features-section">
      <div class="section-header">
        <h2 class="section-title">{{ $t('home.features') }}</h2>
      </div>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">⚡</div>
          <h3>{{ $t('home.instantPlay') }}</h3>
          <p>{{ $t('home.instantPlayDesc') }}</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">💾</div>
          <h3>{{ $t('home.saveProgress') }}</h3>
          <p>{{ $t('home.saveProgressDesc') }}</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🌍</div>
          <h3>{{ $t('home.multiLanguage') }}</h3>
          <p>{{ $t('home.multiLanguageDesc') }}</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">📱</div>
          <h3>{{ $t('home.mobileReady') }}</h3>
          <p>{{ $t('home.mobileReadyDesc') }}</p>
      </div>
    </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/game'

const router = useRouter()
const gameStore = useGameStore()
const categoriesRef = ref(null)
const gamesRef = ref(null)

const categories = computed(() => gameStore.categories)
const popularGames = computed(() => gameStore.popularGames)
const loading = computed(() => gameStore.loading)

// 计算统计数据
const totalGames = computed(() => gameStore.getAllGames.length)
const totalPlays = computed(() => {
  return gameStore.getAllGames.reduce((total, game) => total + (game.playCount || 0), 0)
})

// 获取分类游戏数量
const getCategoryGameCount = (categoryId) => {
  return gameStore.getGamesByCategory(categoryId).length
}

// 获取分类名称
const getCategoryName = (categoryId) => {
  const category = gameStore.getCategoryById(categoryId)
  return category ? category.name : categoryId
}

// 导航方法
const navigateToCategory = (categoryId) => {
  router.push(`/category/${categoryId}`)
}

const navigateToGame = (gameId) => {
  router.push(`/game/${gameId}`)
}

const scrollToGames = () => {
  gamesRef.value?.scrollIntoView({ behavior: 'smooth' })
}

// 加载初始数据
const loadInitialData = async () => {
  // 加载分类数据
  await gameStore.fetchCategories()
  
  // 加载所有分类的游戏数据，以便显示完整的热门游戏列表
  const allCategories = gameStore.categories.map(cat => cat.id)
  for (const categoryId of allCategories) {
    await gameStore.fetchGamesByCategory(categoryId)
  }
}

onMounted(async () => {
  await loadInitialData()
})
</script>

<style scoped>
.home {
  min-height: 100vh;
}

/* 英雄区域样式 */
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.gaming-particles {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    radial-gradient(circle at 80% 50%, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    radial-gradient(circle at 40% 80%, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 100px 100px, 150px 150px, 120px 120px;
  animation: particles-float 20s infinite linear;
}

@keyframes particles-float {
  0% { transform: translateY(0px) rotate(0deg); }
  100% { transform: translateY(-100px) rotate(360deg); }
}

.floating-icons {
  position: absolute;
  width: 100%;
  height: 100%;
}

.game-icon {
  position: absolute;
  font-size: 2rem;
  opacity: 0.3;
  animation: float 6s ease-in-out infinite;
}

.game-icon:nth-child(1) { top: 20%; left: 10%; animation-delay: 0s; }
.game-icon:nth-child(2) { top: 60%; left: 20%; animation-delay: 1s; }
.game-icon:nth-child(3) { top: 30%; right: 15%; animation-delay: 2s; }
.game-icon:nth-child(4) { top: 70%; right: 25%; animation-delay: 3s; }
.game-icon:nth-child(5) { top: 45%; left: 50%; animation-delay: 4s; }

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
  max-width: 800px;
  padding: 0 20px;
}

.hero-title {
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  background: linear-gradient(45deg, #fff, #f0f8ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-bottom: 3rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 3rem;
  font-weight: 700;
  color: #ffd700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.stat-label {
  font-size: 1rem;
  opacity: 0.8;
  margin-top: 0.5rem;
}

.hero-cta {
  background: linear-gradient(45deg, #ff6b6b, #ee5a24);
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.hero-cta:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
}

.cta-arrow {
  transition: transform 0.3s ease;
}

.hero-cta:hover .cta-arrow {
  transform: translateX(5px);
}

/* 通用区域样式 */
.categories-section,
.popular-games-section,
.features-section {
  padding: 5rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 1rem;
  background: linear-gradient(45deg, var(--color-primary), var(--color-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-subtitle {
  font-size: 1.2rem;
  color: var(--color-text-light);
  max-width: 600px;
  margin: 0 auto;
}

/* 分类网格样式 */
.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.category-card {
  position: relative;
  background: white;
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.category-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.category-card:hover::before {
  left: 100%;
}

.category-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.category-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.category-name {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--color-text);
}

.category-desc {
  color: var(--color-text-light);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.category-stats {
  color: var(--color-primary);
  font-weight: 500;
}

.category-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, var(--color-primary), var(--color-secondary));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 20px;
}

.category-card:hover .category-overlay {
  opacity: 0.95;
}

.play-text {
  font-size: 1.2rem;
  font-weight: 600;
}

/* 游戏网格样式 */
.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.game-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.game-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.game-image-container {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.game-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
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
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.game-card:hover .game-overlay {
  opacity: 1;
}

.play-button {
  width: 60px;
  height: 60px;
  background: var(--color-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  transition: transform 0.3s ease;
}

.game-card:hover .play-button {
  transform: scale(1.1);
}

.game-rating {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 15px;
  font-size: 0.8rem;
}

.game-info {
  padding: 1.5rem;
}

.game-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-text);
}

.game-description {
  color: var(--color-text-light);
  margin-bottom: 1rem;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.game-stats {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: var(--color-text-light);
}

/* 特色功能样式 */
.features-section {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--color-text);
}

.feature-card p {
  color: var(--color-text-light);
  line-height: 1.6;
}

/* 加载和空状态 */
.loading-state,
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--color-text-light);
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid var(--color-border);
  border-top: 3px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.2rem;
  }
  
  .hero-stats {
    flex-direction: column;
    gap: 1rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .categories-section,
  .popular-games-section,
  .features-section {
    padding: 3rem 1rem;
  }
  
  .category-grid,
  .games-grid,
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style> 