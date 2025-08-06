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
    <!-- 第一层：Logo + 搜索 + 操作 -->
    <div class="header-top">
      <div class="header-container">
        <!-- Logo区域 -->
        <div class="logo-section">
          <router-link to="/" class="logo-link">
            <div class="logo-icon">🎮</div>
            <div class="logo-text">
              <h1>{{ $t('app.title') }}</h1>
              <span class="logo-subtitle">经典游戏平台</span>
            </div>
          </router-link>
        </div>

        <!-- 右侧操作区 -->
        <div class="header-actions">
          <!-- 搜索框 -->
          <div class="search-container">
            <div class="search-box" :class="{ 'focused': isSearchFocused }">
              <div class="search-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <input 
                type="text" 
                :placeholder="$t('nav.searchPlaceholder')" 
                v-model="searchQuery"
                @keyup.enter="handleSearch"
                @focus="isSearchFocused = true"
                @blur="isSearchFocused = false"
                class="search-input"
              >
              <button @click="handleSearch" class="search-btn" v-if="searchQuery">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- 快捷操作 -->
          <div class="quick-actions">
            <button class="action-btn theme-toggle" @click="toggleTheme" title="切换主题">
              <span class="btn-icon">{{ isDarkTheme ? '🌞' : '🌙' }}</span>
            </button>
            <LanguageSwitcher class="language-switcher" />
          </div>

          <!-- 移动端菜单按钮 -->
          <button 
            class="mobile-menu-toggle" 
            @click="toggleMobileMenu"
            :class="{ 'active': isMobileMenuOpen }"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </div>

    <!-- 第二层：横排导航菜单 -->
    <nav class="header-nav desktop-nav">
      <div class="nav-container">
        <!-- 第一排：街机游戏主分类 + 所有街机子分类 -->
        <div class="nav-row first-row">
          <!-- 街机游戏主分类 -->
          <router-link 
            :to="`/category/arcade`" 
            class="nav-link main-category"
            :class="{ 'active': isActiveCategory('arcade') }"
          >
            <span class="nav-icon">🕹️</span>
            <span class="nav-text">{{ getCategoryName(arcadeCategory) }}</span>
          </router-link>
          
          <!-- 所有街机子分类 -->
          <template v-if="arcadeCategory && arcadeCategory.subCategories">
            <router-link 
              v-for="subCategory in arcadeCategory.subCategories" 
              :key="subCategory.id"
              :to="`/category/${subCategory.id}`" 
              class="nav-link sub-category"
              :class="{ 'active': isActiveSubCategory(subCategory.id) }"
            >
              <span class="nav-icon">{{ getSubCategoryIcon(subCategory.id) }}</span>
              <span class="nav-text">{{ getShortSubCategoryName(subCategory, '街机') }}</span>
            </router-link>
          </template>
        </div>

        <!-- 第二排：FC游戏主分类 + 所有FC子分类 -->
        <div class="nav-row second-row">
          <!-- FC游戏主分类 -->
          <router-link 
            :to="`/category/fc`" 
            class="nav-link main-category"
            :class="{ 'active': isActiveCategory('fc') }"
          >
            <span class="nav-icon">🎮</span>
            <span class="nav-text">{{ getCategoryName(fcCategory) }}</span>
          </router-link>

          <!-- 所有FC子分类 -->
          <template v-if="fcCategory && fcCategory.subCategories">
            <router-link 
              v-for="subCategory in fcCategory.subCategories" 
              :key="subCategory.id"
              :to="`/category/${subCategory.id}`" 
              class="nav-link sub-category"
              :class="{ 'active': isActiveSubCategory(subCategory.id) }"
            >
              <span class="nav-icon">{{ getSubCategoryIcon(subCategory.id) }}</span>
              <span class="nav-text">{{ getShortSubCategoryName(subCategory, 'FC') }}</span>
            </router-link>
          </template>
        </div>
      </div>
    </nav>

    <!-- 移动端菜单 -->
    <div class="mobile-menu" :class="{ 'open': isMobileMenuOpen }">
      <div class="mobile-search">
        <div class="search-box">
          <div class="search-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <input 
            type="text" 
            :placeholder="$t('nav.searchPlaceholder')" 
            v-model="mobileSearchQuery"
            @keyup.enter="handleMobileSearch"
            class="search-input"
          >
        </div>
      </div>
      
      <nav class="mobile-nav">
        <div v-for="category in categories" :key="category.id" class="mobile-category">
          <div class="mobile-category-header" @click="toggleMobileCategory(category.id)">
            <span class="category-icon">{{ getCategoryIcon(category.id) }}</span>
            <span class="category-name">{{ getCategoryName(category) }}</span>
            <span class="expand-icon" :class="{ 'expanded': expandedCategories.includes(category.id) }">▼</span>
          </div>
          
          <div class="mobile-subcategories" :class="{ 'expanded': expandedCategories.includes(category.id) }">
            <router-link 
              :to="`/category/${category.id}`" 
              class="mobile-nav-link all-link"
              @click="closeMobileMenu"
            >
              <span class="link-icon">📋</span>
              <span>全部{{ getCategoryName(category) }}</span>
            </router-link>
            <router-link 
              v-for="subCategory in category.subCategories" 
              :key="subCategory.id"
              :to="`/category/${subCategory.id}`" 
              class="mobile-nav-link"
              @click="closeMobileMenu"
            >
              <span class="link-icon">{{ getSubCategoryIcon(subCategory.id) }}</span>
              <span>{{ getCategoryName(subCategory) }}</span>
            </router-link>
          </div>
        </div>
      </nav>
    </div>

    <!-- 移动端遮罩 -->
    <div 
      class="mobile-overlay" 
      :class="{ 'show': isMobileMenuOpen }"
      @click="closeMobileMenu"
    ></div>
  </header>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useGameStore } from '../stores/game'
import { useCategoryI18n } from '../composables/useCategoryI18n'
import LanguageSwitcher from './LanguageSwitcher.vue'

const router = useRouter()
const route = useRoute()
const gameStore = useGameStore()
const { getCategoryName, getShortSubCategoryName } = useCategoryI18n()

// 响应式数据
const searchQuery = ref('')
const mobileSearchQuery = ref('')
const categories = ref([])
const isMobileMenuOpen = ref(false)
const isSearchFocused = ref(false)
const expandedCategories = ref([])
const isDarkTheme = ref(false)

// 初始化主题
const initTheme = () => {
  // 从localStorage读取保存的主题
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    isDarkTheme.value = savedTheme === 'dark'
  } else {
    // 如果没有保存的主题，检测系统偏好
    isDarkTheme.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  // 应用主题
  document.documentElement.setAttribute('data-theme', isDarkTheme.value ? 'dark' : 'light')
}

// 分类图标映射
const categoryIcons = {
  'fc': '🎮',
  'arcade': '🕹️'
}

const subCategoryIcons = {
  // FC子分类
  'fc-action': '⚔️',
  'fc-stg': '🚁',
  'fc-rpg': '🗡️',
  'fc-puzzle': '🧩',
  'fc-spg': '⚽',
  'fc-tab': '🃏',
  'fc-etc': '📦',
  
  // 街机子分类
  'arcade-fighting': '🥊',
  'arcade-shooting': '🎯',
  'arcade-action': '💥',
  'arcade-puzzle': '🧩',
  'arcade-racing': '🏎️',
  'arcade-sports': '⚽',
  'arcade-etc': '📦'
}

// 计算属性
const isActiveCategory = computed(() => (categoryId) => {
  return route.path.includes(`/category/${categoryId}`)
})

const isActiveSubCategory = computed(() => (subCategoryId) => {
  return route.path.includes(`/category/${subCategoryId}`)
})

const fcCategory = computed(() => {
  return categories.value.find(cat => cat.id === 'fc')
})

const arcadeCategory = computed(() => {
  return categories.value.find(cat => cat.id === 'arcade')
})

// 方法
const loadCategories = async () => {
  if (gameStore.categories.length === 0) {
    await gameStore.fetchCategories()
  }
  categories.value = gameStore.categories
}

const getCategoryIcon = (categoryId) => {
  return categoryIcons[categoryId] || '🎲'
}

const getSubCategoryIcon = (subCategoryId) => {
  return subCategoryIcons[subCategoryId] || '🎯'
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ 
      path: '/search', 
      query: { q: searchQuery.value.trim() } 
    })
    searchQuery.value = ''
  }
}

const handleMobileSearch = () => {
  if (mobileSearchQuery.value.trim()) {
    router.push({ 
      path: '/search', 
      query: { q: mobileSearchQuery.value.trim() } 
    })
    mobileSearchQuery.value = ''
    closeMobileMenu()
  }
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  if (isMobileMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
  document.body.style.overflow = ''
}

const toggleMobileCategory = (categoryId) => {
  const index = expandedCategories.value.indexOf(categoryId)
  if (index > -1) {
    expandedCategories.value.splice(index, 1)
  } else {
    expandedCategories.value.push(categoryId)
  }
}

const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value
  // 这里可以添加主题切换逻辑
  document.documentElement.setAttribute('data-theme', isDarkTheme.value ? 'dark' : 'light')
  // 保存主题到localStorage
  localStorage.setItem('theme', isDarkTheme.value ? 'dark' : 'light')
}

// 生命周期
onMounted(() => {
  initTheme() // 初始化主题
  loadCategories()
})
</script>

<style scoped>
/* CSS变量定义 */
:root {
  --header-height: 110px;
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  --success-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  --shadow-light: 0 2px 20px rgba(0, 0, 0, 0.08);
  --shadow-medium: 0 4px 25px rgba(0, 0, 0, 0.12);
  --shadow-heavy: 0 8px 40px rgba(0, 0, 0, 0.16);
  --border-radius: 12px;
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 主容器 */
.app-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: var(--primary-gradient);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: var(--shadow-medium);
  transition: all 0.3s ease;
}

/* 深色主题头部适配 */
[data-theme="dark"] .app-header {
  --primary-gradient: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

/* 浅色主题头部适配 */
[data-theme="light"] .app-header {
  --primary-gradient: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.08);
}

/* 第一层：Logo + 搜索 + 操作 */
.header-top {
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
}

[data-theme="light"] .header-top {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
}

/* Logo区域 */
.logo-section {
  flex-shrink: 0;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: white;
  transition: var(--transition);
}

.logo-link:hover {
  transform: translateY(-1px);
}

/* 浅色主题Logo适配 */
[data-theme="light"] .logo-link {
  color: var(--color-text);
}

.logo-icon {
  font-size: 28px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.logo-text h1 {
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  background: linear-gradient(45deg, #fff, #f0f8ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}

/* 浅色主题Logo文字适配 */
[data-theme="light"] .logo-text h1 {
  background: linear-gradient(45deg, var(--color-text), var(--color-primary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.logo-subtitle {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  margin-top: -2px;
  display: block;
}

/* 浅色主题Logo副标题适配 */
[data-theme="light"] .logo-subtitle {
  color: var(--color-text-light);
}

/* 右侧操作区 */
.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

/* 搜索框 */
.search-container {
  position: relative;
}

.search-box {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  padding: 0 16px;
  transition: var(--transition);
  width: 280px;
}

.search-box.focused {
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

/* 浅色主题搜索框适配 */
[data-theme="light"] .search-box {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

[data-theme="light"] .search-box.focused {
  background: white;
  border-color: var(--color-primary);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.search-icon {
  color: rgba(255, 255, 255, 0.8);
  margin-right: 12px;
  transition: var(--transition);
}

.search-box.focused .search-icon {
  color: var(--color-primary);
}

/* 浅色主题搜索图标适配 */
[data-theme="light"] .search-icon {
  color: var(--color-text-light);
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  padding: 12px 0;
  color: white;
  font-size: 14px;
  font-weight: 500;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.search-box.focused .search-input {
  color: var(--color-text);
}

.search-box.focused .search-input::placeholder {
  color: #999;
}

/* 浅色主题搜索输入适配 */
[data-theme="light"] .search-input {
  color: var(--color-text);
}

[data-theme="light"] .search-input::placeholder {
  color: var(--color-text-muted);
}

/* 暗色主题下搜索框获得焦点时的文字颜色 */
[data-theme="dark"] .search-box.focused .search-input {
  color: #1f2937; /* 深色文字 */
}

[data-theme="dark"] .search-box.focused .search-input::placeholder {
  color: #6b7280; /* 深色占位符 */
}

.search-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: var(--transition);
}

.search-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* 浅色主题搜索按钮适配 */
[data-theme="light"] .search-btn {
  color: var(--color-text-light);
}

[data-theme="light"] .search-btn:hover {
  background: rgba(0, 0, 0, 0.1);
}

/* 暗色主题下搜索框获得焦点时的按钮颜色 */
[data-theme="dark"] .search-box.focused .search-btn {
  color: #374151; /* 深色按钮 */
}

[data-theme="dark"] .search-box.focused .search-btn:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #1f2937; /* 更深的颜色 */
}

/* 快捷操作 */
.quick-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  cursor: pointer;
  transition: var(--transition);
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.btn-icon {
  font-size: 16px;
}

/* 移动端菜单按钮 */
.mobile-menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  cursor: pointer;
  padding: 8px;
  transition: var(--transition);
}

.mobile-menu-toggle:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
}

.mobile-menu-toggle span {
  width: 100%;
  height: 2px;
  background: white;
  border-radius: 1px;
  transition: var(--transition);
}

/* 浅色主题移动端菜单按钮适配 */
[data-theme="light"] .mobile-menu-toggle {
  background: rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.2);
}

[data-theme="light"] .mobile-menu-toggle:hover {
  background: rgba(0, 0, 0, 0.15);
}

[data-theme="light"] .mobile-menu-toggle span {
  background: var(--color-text);
}

.mobile-menu-toggle.active span:nth-child(1) {
  transform: rotate(45deg) translate(8px, 8px);
}

.mobile-menu-toggle.active span:nth-child(2) {
  opacity: 0;
}

.mobile-menu-toggle.active span:nth-child(3) {
  transform: rotate(-45deg) translate(8px, -8px);
}

/* 第二层：横排导航菜单 */
.header-nav {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

/* 导航行 */
.nav-row {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 8px 0;
  flex-wrap: wrap;
}

.first-row {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.second-row {
  padding-bottom: 12px;
}

/* 统一的导航链接样式 */
.nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 18px;
  text-decoration: none;
  color: white;
  font-weight: 600;
  font-size: 14px;
  transition: var(--transition);
  white-space: nowrap;
}

.nav-link:hover,
.nav-link.active {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-1px);
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.2);
}

/* 浅色主题导航链接适配 */
[data-theme="light"] .nav-link {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: var(--color-text);
}

[data-theme="light"] .nav-link:hover,
[data-theme="light"] .nav-link.active {
  background: white;
  border-color: var(--color-primary);
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.1);
  color: var(--color-primary);
}

/* 主分类特殊样式 */
.nav-link.main-category {
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.3);
  font-weight: 700;
  font-size: 15px;
  padding: 9px 20px;
}

.nav-link.main-category:hover,
.nav-link.main-category.active {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
}

/* 浅色主题主分类适配 */
[data-theme="light"] .nav-link.main-category {
  background: var(--color-primary);
  border: 2px solid var(--color-primary);
  color: white;
}

[data-theme="light"] .nav-link.main-category:hover,
[data-theme="light"] .nav-link.main-category.active {
  background: var(--color-primary-dark);
  border-color: var(--color-primary-dark);
  color: white;
  box-shadow: 0 4px 20px rgba(79, 70, 229, 0.3);
}

/* 子分类样式 */
.nav-link.sub-category {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  font-size: 13px;
  padding: 6px 14px;
  color: rgba(255, 255, 255, 0.95);
}

.nav-link.sub-category:hover,
.nav-link.sub-category.active {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  color: white;
}

/* 浅色主题子分类适配 */
[data-theme="light"] .nav-link.sub-category {
  background: rgba(79, 70, 229, 0.1);
  border: 1px solid rgba(79, 70, 229, 0.2);
  color: var(--color-text);
}

[data-theme="light"] .nav-link.sub-category:hover,
[data-theme="light"] .nav-link.sub-category.active {
  background: rgba(79, 70, 229, 0.15);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.nav-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.nav-text {
  font-weight: inherit;
}

/* 移动端菜单 */
.mobile-menu {
  position: fixed;
  top: var(--header-height);
  right: -100%;
  width: 320px;
  height: calc(100vh - var(--header-height));
  background: white;
  box-shadow: var(--shadow-heavy);
  transition: var(--transition);
  overflow-y: auto;
  z-index: 999;
}

.mobile-menu.open {
  right: 0;
}

/* 浅色主题移动端菜单适配 */
[data-theme="dark"] .mobile-menu {
  background: var(--color-background-soft);
}

.mobile-search {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  background: linear-gradient(135deg, #f8f9ff 0%, #e8f4fd 100%);
}

/* 浅色主题移动端搜索区适配 */
[data-theme="dark"] .mobile-search {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border-bottom: 1px solid #475569;
}

.mobile-search .search-box {
  background: white;
  border: 1px solid #e9ecef;
  width: 100%;
}

/* 浅色主题移动端搜索框适配 */
[data-theme="dark"] .mobile-search .search-box {
  background: var(--color-background-mute);
  border: 1px solid var(--color-border);
}

.mobile-search .search-icon {
  color: #999;
}

/* 浅色主题移动端搜索图标适配 */
[data-theme="dark"] .mobile-search .search-icon {
  color: var(--color-text-light);
}

.mobile-search .search-input {
  color: var(--color-text);
}

.mobile-search .search-input::placeholder {
  color: #999;
}

/* 浅色主题移动端搜索输入适配 */
[data-theme="dark"] .mobile-search .search-input::placeholder {
  color: var(--color-text-muted);
}

/* 移动端导航 */
.mobile-nav {
  padding: 0;
}

.mobile-category {
  border-bottom: 1px solid #f8f9fa;
}

/* 浅色主题移动端分类适配 */
[data-theme="dark"] .mobile-category {
  border-bottom: 1px solid var(--color-border);
}

.mobile-category-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  cursor: pointer;
  transition: var(--transition);
  background: white;
}

.mobile-category-header:hover {
  background: #f8f9ff;
}

/* 浅色主题移动端分类标题适配 */
[data-theme="dark"] .mobile-category-header {
  background: var(--color-background-soft);
}

[data-theme="dark"] .mobile-category-header:hover {
  background: var(--color-background-mute);
}

.category-name {
  flex: 1;
  font-weight: 600;
  font-size: 16px;
  color: var(--color-text);
}

.expand-icon {
  font-size: 12px;
  color: #999;
  transition: var(--transition);
}

/* 浅色主题移动端展开图标适配 */
[data-theme="dark"] .expand-icon {
  color: var(--color-text-muted);
}

.expand-icon.expanded {
  transform: rotate(180deg);
}

.mobile-subcategories {
  max-height: 0;
  overflow: hidden;
  transition: var(--transition);
  background: #fafbfc;
}

/* 浅色主题移动端子分类背景适配 */
[data-theme="dark"] .mobile-subcategories {
  background: var(--color-background-mute);
}

.mobile-subcategories.expanded {
  max-height: 500px;
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px 12px 52px;
  text-decoration: none;
  color: var(--color-text);
  font-weight: 500;
  font-size: 14px;
  transition: var(--transition);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.mobile-nav-link:hover {
  background: white;
  padding-left: 56px;
  color: var(--color-primary);
}

/* 浅色主题移动端导航链接适配 */
[data-theme="dark"] .mobile-nav-link {
  border-bottom: 1px solid var(--color-border);
}

[data-theme="dark"] .mobile-nav-link:hover {
  background: var(--color-background-soft);
}

.mobile-nav-link.all-link {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin: 8px 16px;
  border-radius: 8px;
  padding-left: 20px;
}

.mobile-nav-link.all-link:hover {
  padding-left: 24px;
  transform: translateX(4px);
}

/* 浅色主题移动端全部链接适配 */
[data-theme="dark"] .mobile-nav-link.all-link {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
}

.link-icon {
  font-size: 16px;
}

/* 移动端遮罩 */
.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 998;
  opacity: 0;
  visibility: hidden;
  transition: var(--transition);
}

.mobile-overlay.show {
  opacity: 1;
  visibility: visible;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .header-container {
    gap: 24px;
    padding: 0 20px;
  }
  
  .nav-container {
    padding: 0 20px;
  }
  
  .search-box {
    width: 240px;
  }
  
  .nav-row {
    gap: 10px;
  }
  
  .nav-link {
    padding: 6px 14px;
    font-size: 13px;
  }
  
  .nav-link.main-category {
    font-size: 14px;
    padding: 7px 18px;
  }
  
  .nav-link.sub-category {
    font-size: 12px;
    padding: 5px 12px;
  }
}

@media (max-width: 992px) {
  .header-container {
    gap: 16px;
    padding: 0 16px;
  }
  
  .nav-container {
    padding: 0 16px;
  }
  
  .search-box {
    width: 200px;
  }
  
  .logo-text h1 {
    font-size: 18px;
  }
  
  .logo-subtitle {
    display: none;
  }
  
  .nav-row {
    gap: 8px;
  }
  
  .nav-link {
    padding: 5px 12px;
    font-size: 12px;
  }
  
  .nav-link.main-category {
    font-size: 13px;
    padding: 6px 16px;
  }
  
  .nav-link.sub-category {
    font-size: 11px;
    padding: 4px 10px;
  }
  
  .nav-icon {
    font-size: 14px;
  }
}

@media (max-width: 768px) {
  .header-container {
    height: 50px;
    gap: 12px;
  }
  
  .desktop-nav,
  .search-container,
  .quick-actions .action-btn {
    display: none;
  }
  
  .mobile-menu-toggle {
    display: flex;
  }
  
  .logo-icon {
    font-size: 24px;
  }
  
  .logo-text h1 {
    font-size: 16px;
  }
  
  :root {
    --header-height: 50px;
  }
}

@media (max-width: 480px) {
  .header-container {
    padding: 0 12px;
  }
  
  .mobile-menu {
    width: 100%;
    right: -100%;
  }
  
  .mobile-menu.open {
    right: 0;
  }
}

/* 深色主题支持 */
[data-theme="dark"] .app-header {
  --primary-gradient: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
}

[data-theme="dark"] .header-nav {
  background: rgba(0, 0, 0, 0.1);
}

/* 滚动条样式 */
.mobile-menu::-webkit-scrollbar {
  width: 6px;
}

.mobile-menu::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.mobile-menu::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 3px;
}

.mobile-menu::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
}

/* 深色主题滚动条适配 */
[data-theme="dark"] .mobile-menu::-webkit-scrollbar-track {
  background: var(--color-background-mute);
}

[data-theme="dark"] .mobile-menu::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
}

[data-theme="dark"] .mobile-menu::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-secondary-dark) 100%);
}
</style> 