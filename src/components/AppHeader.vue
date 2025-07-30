<template>
  <header class="app-header">
    <div class="container">
      <div class="logo">
        <a href="/" @click.prevent="openInNewTab('/')">
          <h1>{{ $t('app.title') }}</h1>
        </a>
      </div>
      
              <nav class="main-nav">
          <ul>
            <li v-for="category in categories" :key="category.id">
              <a :href="`/category/${category.id}`" @click.prevent="openInNewTab(`/category/${category.id}`)">{{ category.name }}</a>
            </li>
          </ul>
        </nav>
      
              <div class="search-box">
          <input 
            type="text" 
            :placeholder="$t('nav.searchPlaceholder')" 
            v-model="searchQuery"
            @keyup.enter="handleSearchInNewTab"
          >
          <button @click="handleSearchInNewTab">{{ $t('nav.searchButton') }}</button>
        </div>
        
        <div class="header-actions">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/game'
import LanguageSwitcher from './LanguageSwitcher.vue'

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

// 在新标签页中处理搜索
const handleSearchInNewTab = () => {
  if (searchQuery.value.trim()) {
    const baseUrl = window.location.origin
    window.open(`${baseUrl}/search?q=${encodeURIComponent(searchQuery.value.trim())}`, '_blank')
  }
}

// 在新标签页打开链接
const openInNewTab = (path) => {
  const baseUrl = window.location.origin
  window.open(baseUrl + path, '_blank')
}

// 组件挂载时加载分类数据
onMounted(() => {
  loadCategories()
})
</script>

<style scoped>
 .app-header {
   background-color: white;
   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
   border-bottom: 1px solid #e1e5e9;
 }

 .container {
   max-width: 1400px;
   margin: 0 auto;
   padding: 0 20px;
   height: 64px;
   display: flex;
   align-items: center;
   gap: 20px;
 }

 .logo {
   flex-shrink: 0;
 }
 
 .logo a {
   text-decoration: none;
   color: var(--color-text);
 }
 
 .logo h1 {
   margin: 0;
   font-size: 1.6rem;
   font-weight: 600;
   color: var(--color-primary);
 }

  .main-nav {
   flex-shrink: 0;
 }
 
 .main-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: nowrap;
  white-space: nowrap;
  gap: 4px;
}
 
 .main-nav li {
   position: relative;
   flex-shrink: 0;
 }

 .main-nav a {
   text-decoration: none;
   color: var(--color-text);
   font-weight: 500;
   padding: 10px 16px;
   border-radius: 20px;
   transition: all 0.3s ease;
   font-size: 14px;
   white-space: nowrap;
 }
 
 .main-nav a:hover {
   color: var(--color-primary);
   background-color: var(--color-background-soft);
   transform: translateY(-1px);
 }

 .search-box {
  display: flex;
  flex: 1;
  max-width: 300px;
  margin: 0 auto;
}
 
 .search-box input {
  flex: 1;
  padding: 8px 12px;
  border: 2px solid #e1e5e9;
  border-radius: 20px 0 0 20px;
  outline: none;
  font-size: 14px;
  background-color: #f6f7f8;
  transition: all 0.3s ease;
}
 
 .search-box input:focus {
   border-color: var(--color-primary);
   background-color: white;
 }
 
 .search-box button {
  padding: 8px 16px;
  background-color: #f6f7f8;
  color: var(--color-text);
  border: 2px solid #e1e5e9;
  border-left: none;
  border-radius: 0 20px 20px 0;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}
 
   .search-box button:hover {
    background-color: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
  }
  
  .header-actions {
    flex-shrink: 0;
    display: flex;
    align-items: center;
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