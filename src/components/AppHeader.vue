<template>
  <header class="app-header">
    <div class="container">
      <div class="logo">
        <router-link to="/">
          <h1>{{ $t('app.title') }}</h1>
        </router-link>
      </div>
      
      <!-- 桌面端导航 -->
      <nav class="main-nav desktop-nav">
        <ul>
          <li v-for="category in categories" :key="category.id">
            <router-link :to="`/category/${category.id}`">{{ category.name }}</router-link>
          </li>
        </ul>
      </nav>
      
      <div class="search-box desktop-search">
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
        <!-- 移动端菜单按钮 -->
        <button class="mobile-menu-btn" @click="toggleMobileMenu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>
    
    <!-- 移动端菜单 -->
    <div class="mobile-menu" :class="{ 'active': isMobileMenuOpen }">
      <div class="mobile-search">
        <input 
          type="text" 
          :placeholder="$t('nav.searchPlaceholder')" 
          v-model="searchQuery"
          @keyup.enter="handleSearchInNewTab"
        >
        <button @click="handleSearchInNewTab">{{ $t('nav.searchButton') }}</button>
      </div>
      <nav class="mobile-nav">
        <ul>
          <li v-for="category in categories" :key="category.id">
            <router-link :to="`/category/${category.id}`" @click="closeMobileMenu">{{ category.name }}</router-link>
          </li>
        </ul>
      </nav>
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
const isMobileMenuOpen = ref(false)

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

// 移动端菜单控制
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
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
    gap: 12px;
  }

  /* 移动端菜单按钮 */
  .mobile-menu-btn {
    display: none;
    flex-direction: column;
    width: 32px;
    height: 32px;
    background-color: #f6f7f8;
    border: 2px solid #e1e5e9;
    border-radius: 8px;
    cursor: pointer;
    padding: 6px;
    justify-content: space-between;
    transition: all 0.3s ease;
    position: relative;
  }

  .mobile-menu-btn:hover {
    background-color: var(--color-primary);
    border-color: var(--color-primary);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .mobile-menu-btn:active {
    transform: translateY(0);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  }

  .mobile-menu-btn span {
    width: 100%;
    height: 2px;
    background-color: var(--color-text);
    transition: all 0.3s ease;
    border-radius: 1px;
  }

  .mobile-menu-btn:hover span {
    background-color: white;
  }

  /* 移动端菜单 */
  .mobile-menu {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: white;
    border-top: 1px solid #e1e5e9;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
  }

  .mobile-menu.active {
    max-height: 500px;
  }

  .mobile-search {
    padding: 16px;
    border-bottom: 1px solid #e1e5e9;
    display: flex;
  }

  .mobile-search input {
    flex: 1;
    padding: 8px 12px;
    border: 2px solid #e1e5e9;
    border-radius: 20px 0 0 20px;
    outline: none;
    font-size: 14px;
    background-color: #f6f7f8;
  }

  .mobile-search button {
    padding: 8px 16px;
    background-color: #f6f7f8;
    color: var(--color-text);
    border: 2px solid #e1e5e9;
    border-left: none;
    border-radius: 0 20px 20px 0;
    cursor: pointer;
    font-size: 14px;
  }

  .mobile-nav ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .mobile-nav li {
    border-bottom: 1px solid #f0f0f0;
  }

  .mobile-nav a {
    display: block;
    padding: 16px;
    text-decoration: none;
    color: var(--color-text);
    font-weight: 500;
    transition: background-color 0.2s ease;
  }

  .mobile-nav a:hover {
    background-color: #f6f7f8;
    color: var(--color-primary);
  }

@media (max-width: 768px) {
  .app-header {
    position: relative;
  }

  .container {
    height: 56px;
    padding: 0 16px;
  }

  .logo h1 {
    font-size: 1.2rem;
  }

  /* 隐藏桌面端元素 */
  .desktop-nav,
  .desktop-search {
    display: none;
  }

  /* 显示移动端元素 */
  .mobile-menu-btn {
    display: flex;
  }

  .mobile-menu {
    display: block;
  }

  .header-actions {
    margin-left: auto;
  }
}
</style> 