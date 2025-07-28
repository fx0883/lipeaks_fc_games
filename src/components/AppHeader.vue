<template>
  <header class="app-header">
    <div class="container">
      <div class="logo">
        <router-link to="/">
          <h1>FC游戏乐园</h1>
        </router-link>
      </div>
      
      <nav class="main-nav">
        <ul>
          <li><router-link to="/">首页</router-link></li>
          <li v-for="category in categories" :key="category.id">
            <router-link :to="`/category/${category.id}`">{{ category.name }}</router-link>
          </li>
        </ul>
      </nav>
      
      <div class="search-box">
        <input 
          type="text" 
          placeholder="搜索游戏..." 
          v-model="searchQuery"
          @keyup.enter="handleSearch"
        >
        <button @click="handleSearch">搜索</button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/game'

const router = useRouter()
const gameStore = useGameStore()
const searchQuery = ref('')
const categories = ref([])

// 加载分类数据
const loadCategories = async () => {
  if (gameStore.categories.length === 0) {
    await gameStore.fetchCategories()
  }
  categories.value = gameStore.categories
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    // 跳转到搜索结果页面
    router.push({ 
      path: '/search', 
      query: { q: searchQuery.value.trim() } 
    })
  }
}

// 组件挂载时加载分类数据
onMounted(() => {
  loadCategories()
})
</script>

<style scoped>
.app-header {
  background-color: var(--color-background-soft);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo a {
  text-decoration: none;
  color: var(--color-text);
}

.logo h1 {
  margin: 0;
  font-size: 1.5rem;
}

.main-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
}

.main-nav li {
  margin-right: 15px;
  position: relative;
}

.main-nav a {
  text-decoration: none;
  color: var(--color-text);
  font-weight: 500;
}

.main-nav a:hover {
  color: var(--color-primary);
}

.search-box {
  display: flex;
}

.search-box input {
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: 4px 0 0 4px;
  outline: none;
}

.search-box button {
  padding: 8px 12px;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}

.search-box button:hover {
  background-color: var(--color-primary-dark);
}

@media (max-width: 768px) {
  .container {
    flex-wrap: wrap;
    height: auto;
    padding: 10px 20px;
  }
  
  .logo {
    margin-bottom: 10px;
  }
  
  .main-nav, .search-box {
    width: 100%;
    margin-bottom: 10px;
  }
  
  .main-nav ul {
    justify-content: center;
  }
  
  .search-box input {
    flex-grow: 1;
  }
}
</style> 