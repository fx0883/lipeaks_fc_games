<template>
  <div class="category-view">
    <div class="category-header">
      <h1>{{ category ? category.name : categoryId }}</h1>
      <p v-if="category">{{ category.description }}</p>
      <p>共 {{ games.length }} 款游戏</p>
    </div>

    <div class="game-list" v-if="games.length > 0">
      <div class="game-card" v-for="game in games" :key="game.id">
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

    <div class="no-games" v-else-if="!loading">
      <p>该分类下暂无游戏</p>
    </div>

    <div class="loading" v-else>
      <p>正在加载游戏数据...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useGameStore } from '../stores/game'

const route = useRoute()
const gameStore = useGameStore()
const categoryId = computed(() => route.params.id)
const loading = computed(() => gameStore.loading)

// 获取分类信息
const category = computed(() => gameStore.getCategoryById(categoryId.value))

// 获取分类下的游戏
const games = computed(() => gameStore.getGamesByCategory(categoryId.value))

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
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.category-header {
  margin-bottom: 30px;
}

.category-header p {
  color: var(--color-text-light);
}

.game-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
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

.no-games, .loading {
  text-align: center;
  padding: 50px 0;
  color: var(--color-text-light);
}
</style> 