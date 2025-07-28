<template>
  <div class="home">
    <h1>FC游戏乐园</h1>
    <div class="game-categories">
      <h2>游戏分类</h2>
      <div class="category-list">
        <div class="category-item" v-for="category in categories" :key="category.id">
          <router-link :to="`/category/${category.id}`">{{ category.name }}</router-link>
        </div>
      </div>
    </div>
    
    <div class="popular-games">
      <h2>热门游戏</h2>
      <div class="game-list" v-if="popularGames.length > 0">
        <div class="game-card" v-for="game in popularGames" :key="game.id">
          <router-link :to="`/game/${game.id}`">
            <div class="game-image">
              <img :src="game.cover" :alt="game.name">
            </div>
            <div class="game-info">
              <h3>{{ game.name }}</h3>
              <p>{{ game.description }}</p>
            </div>
          </router-link>
        </div>
      </div>
      <div class="loading" v-else-if="loading">
        <p>正在加载热门游戏...</p>
      </div>
      <div class="no-games" v-else>
        <p>暂无热门游戏</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useGameStore } from '../stores/game'

const gameStore = useGameStore()
const categories = computed(() => gameStore.categories)
const popularGames = computed(() => gameStore.popularGames)
const loading = computed(() => gameStore.loading)

// 加载初始数据
const loadInitialData = async () => {
  // 加载分类数据
  await gameStore.fetchCategories()
  
  // 加载几个主要分类的游戏，以便显示热门游戏
  // 这里我们选择加载action和rpg分类，因为它们通常包含较多热门游戏
  const mainCategories = ['action', 'rpg']
  for (const categoryId of mainCategories) {
    await gameStore.fetchGamesByCategory(categoryId)
  }
}

onMounted(async () => {
  await loadInitialData()
})
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.game-categories, .popular-games {
  margin-bottom: 40px;
}

.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
}

.category-item {
  background-color: var(--color-background-soft);
  padding: 10px 20px;
  border-radius: 4px;
}

.game-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.game-card {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.game-card:hover {
  transform: translateY(-5px);
}

.game-image img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.game-info {
  padding: 15px;
}

.game-info h3 {
  margin: 0 0 10px;
}

.game-info p {
  margin: 0;
  color: var(--color-text-light);
  font-size: 0.9em;
}

.loading, .no-games {
  text-align: center;
  padding: 50px 0;
  color: var(--color-text-light);
}
</style> 