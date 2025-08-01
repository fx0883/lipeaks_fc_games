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
  <header class="app-header">
    <!-- 第一层：Logo + 搜索 + 操作按钮 -->
    <div class="header-top">
      <div class="container">
        <div class="logo">
          <router-link to="/">
            <h1>{{ $t('app.title') }}</h1>
          </router-link>
        </div>
        
        <div class="search-box desktop-search">
          <input 
            type="text" 
            :placeholder="$t('nav.searchPlaceholder')" 
            v-model="searchQuery"
            @keyup.enter="handleSearchInNewTab"
          >
          <button @click="handleSearchInNewTab">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="sr-only">{{ $t('nav.searchButton') }}</span>
          </button>
        </div>
        
        <div class="header-actions">
          <LanguageSwitcher />
          <!-- 移动端菜单按钮 -->
          <button class="mobile-menu-btn" @click="toggleMobileMenu" :aria-expanded="isMobileMenuOpen">
            <span></span>
            <span></span>
            <span></span>
            <span class="sr-only">菜单</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 第二层：导航菜单 -->
    <nav class="header-nav desktop-nav">
      <div class="container">
        <div class="nav-categories">
          <template v-for="category in categories" :key="category.id">
            <!-- 主分类 -->
            <div class="category-group">
              <router-link :to="`/category/${category.id}`" class="main-category">
                {{ category.name }}
              </router-link>
              
              <!-- 子分类 -->
              <div class="sub-categories" v-if="category.subCategories && category.subCategories.length > 0">
                <router-link 
                  v-for="subCategory in category.subCategories" 
                  :key="subCategory.id"
                  :to="`/category/${subCategory.id}`"
                  class="sub-category"
                >
                  {{ subCategory.name }}
                </router-link>
              </div>
            </div>
          </template>
        </div>
      </div>
    </nav>
    
    <!-- 移动端菜单 -->
    <div class="mobile-menu" :class="{ 'active': isMobileMenuOpen }">
      <div class="mobile-search">
        <input 
          type="text" 
          :placeholder="$t('nav.searchPlaceholder')" 
          v-model="searchQuery"
          @keyup.enter="handleMobileSearch"
        >
        <button @click="handleMobileSearch">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      <nav class="mobile-nav">
        <!-- 动态渲染移动端菜单 -->
        <div v-for="category in categories" :key="category.id" class="mobile-nav-section">
          <h4 class="nav-section-title">{{ category.name }}</h4>
          <ul>
            <!-- 主分类链接 -->
            <li>
              <router-link :to="`/category/${category.id}`" @click="closeMobileMenu">
                全部{{ category.name }}
              </router-link>
            </li>
            
            <!-- 子分类链接 -->
            <li v-for="subCategory in category.subCategories" :key="subCategory.id">
              <router-link :to="`/category/${subCategory.id}`" @click="closeMobileMenu">
                {{ subCategory.name }}
              </router-link>
            </li>
          </ul>
        </div>
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

// 在新标签页中处理搜索（桌面端）
const handleSearchInNewTab = () => {
  if (searchQuery.value.trim()) {
    const baseUrl = window.location.origin
    window.open(`${baseUrl}/search?q=${encodeURIComponent(searchQuery.value.trim())}`, '_blank')
  }
}

// 移动端搜索处理（当前页面导航）
const handleMobileSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ 
      path: '/search', 
      query: { q: searchQuery.value.trim() } 
    })
    closeMobileMenu() // 关闭移动菜单
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
/* 隐藏屏幕阅读器文本 */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* 主容器 */
.app-header {
  background-color: white;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border-bottom: 1px solid #e1e5e9;
  position: sticky;
  top: 0;
  z-index: 100;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 第一层：Logo + 搜索 + 操作 */
.header-top {
  border-bottom: 1px solid #f0f0f0;
}

.header-top .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 64px;
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
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-primary);
  letter-spacing: -0.02em;
}

/* 搜索框 */
.search-box {
  display: flex;
  align-items: center;
  flex: 1;
  max-width: 400px;
  margin: 0 20px;
  background-color: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 24px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.search-box:focus-within {
  border-color: var(--color-primary);
  background-color: white;
  box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.1);
}

.search-box input {
  flex: 1;
  padding: 12px 16px;
  border: none;
  outline: none;
  font-size: 14px;
  background: transparent;
  color: var(--color-text);
}

.search-box input::placeholder {
  color: #6c757d;
}

.search-box button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #6c757d;
  transition: all 0.3s ease;
}

.search-box button:hover {
  color: var(--color-primary);
  background-color: rgba(var(--color-primary-rgb), 0.1);
}

/* 头部操作区 */
.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

/* 第二层：导航菜单 */
.header-nav {
  background-color: #fafbfc;
}

.header-nav .container {
  padding: 12px 20px;
}

.nav-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  justify-content: center;
  align-items: flex-start;
}

.category-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.main-category {
  text-decoration: none;
  color: var(--color-primary);
  font-weight: 700;
  font-size: 16px;
  padding: 8px 16px;
  border-radius: 20px;
  background-color: rgba(var(--color-primary-rgb), 0.1);
  transition: all 0.3s ease;
  white-space: nowrap;
}

.main-category:hover {
  background-color: var(--color-primary);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(var(--color-primary-rgb), 0.3);
}

.sub-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
}

.sub-category {
  text-decoration: none;
  color: var(--color-text);
  font-size: 13px;
  font-weight: 500;
  padding: 4px 12px;
  border-radius: 14px;
  background-color: white;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.sub-category:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
  background-color: rgba(var(--color-primary-rgb), 0.05);
  transform: translateY(-1px);
}

/* 移动端菜单按钮 */
.mobile-menu-btn {
  display: none;
  flex-direction: column;
  width: 40px;
  height: 40px;
  background-color: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  padding: 8px;
  justify-content: space-between;
  transition: all 0.3s ease;
  position: relative;
}

.mobile-menu-btn:hover {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(var(--color-primary-rgb), 0.3);
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
  border-top: 1px solid #e9ecef;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  z-index: 1000;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s ease;
}

.mobile-menu.active {
  max-height: 80vh;
  overflow-y: auto;
}

.mobile-search {
  padding: 16px;
  border-bottom: 1px solid #e9ecef;
  background-color: #fafbfc;
}

.mobile-search .search-box {
  margin: 0;
  max-width: none;
}

.mobile-nav-section {
  border-bottom: 1px solid #f0f0f0;
}

.nav-section-title {
  margin: 0;
  padding: 16px;
  background-color: #fafbfc;
  color: var(--color-primary);
  font-size: 15px;
  font-weight: 700;
  border-bottom: 1px solid #e9ecef;
}

.mobile-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.mobile-nav li {
  border-bottom: 1px solid #f8f9fa;
}

.mobile-nav a {
  display: block;
  padding: 14px 16px 14px 32px;
  text-decoration: none;
  color: var(--color-text);
  font-weight: 500;
  font-size: 14px;
  transition: all 0.3s ease;
}

.mobile-nav a:hover {
  background-color: rgba(var(--color-primary-rgb), 0.05);
  color: var(--color-primary);
  padding-left: 36px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .app-header {
    position: relative;
  }

  .header-top .container {
    min-height: 56px;
    padding: 0 16px;
  }

  .logo h1 {
    font-size: 1.4rem;
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
}

@media (max-width: 1200px) {
  .nav-categories {
    gap: 24px;
  }

  .main-category {
    font-size: 15px;
    padding: 6px 14px;
  }

  .sub-category {
    font-size: 12px;
    padding: 3px 10px;
  }
}

@media (max-width: 992px) {
  .nav-categories {
    gap: 20px;
  }

  .main-category {
    font-size: 14px;
    padding: 6px 12px;
  }

  .sub-category {
    font-size: 11px;
    padding: 2px 8px;
  }

  .search-box {
    max-width: 300px;
    margin: 0 10px;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .header-top .container {
    gap: 15px;
  }

  .search-box {
    max-width: 250px;
  }
}

/* 活跃路由样式 */
.router-link-active.main-category {
  background-color: var(--color-primary);
  color: white;
}

.router-link-active.sub-category {
  color: var(--color-primary);
  border-color: var(--color-primary);
  background-color: rgba(var(--color-primary-rgb), 0.1);
}
</style> 