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
  <footer class="app-footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>{{ $t('footer.aboutUs') }}</h3>
          <p>{{ $t('footer.aboutUsDesc') }}</p>
        </div>
        
        <div class="footer-section">
          <h3>{{ $t('footer.quickLinks') }}</h3>
          
          <!-- 动态渲染分类菜单 -->
          <div v-for="category in categories" :key="category.id" class="category-row">
            <!-- 主分类 -->
            <router-link :to="`/category/${category.id}`" class="main-category">
              {{ category.name }}
            </router-link>
            
            <!-- 子分类 -->
            <template v-if="category.subCategories && category.subCategories.length > 0">
              <template v-for="subCategory in category.subCategories" :key="subCategory.id">
                <span class="separator">|</span>
                <router-link :to="`/category/${subCategory.id}`">
                  {{ subCategory.name }}
                </router-link>
              </template>
            </template>
          </div>
        </div>
        
        <div class="footer-section">
          <h3>{{ $t('footer.contactUs') }}</h3>
          <p>{{ $t('footer.email') }}</p>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>{{ $t('footer.copyright', { year: currentYear, author: 'Lipeaks' }) }}</p>
        <p class="license-info">
          <span>
            {{ $t('footer.licensedUnder', { licenseName: 'GPL-3.0' }) }}
            <a href="https://www.gnu.org/licenses/gpl-3.0.html" target="_blank" rel="noopener noreferrer">
              GPL-3.0
            </a>
          </span>
          <span class="separator">|</span>
          <span>
            <a href="https://github.com/fx0883/lipeaks_fc_games" target="_blank" rel="noopener noreferrer">
              {{ $t('footer.sourceCode') }}
            </a>
          </span>
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useGameStore } from '../stores/game'

const gameStore = useGameStore()
const categories = ref([])
const currentYear = computed(() => new Date().getFullYear())

// 加载分类数据
const loadCategories = async () => {
  if (gameStore.categories.length === 0) {
    await gameStore.fetchCategories()
  }
  categories.value = gameStore.categories
}

// 组件挂载时加载分类数据
onMounted(() => {
  loadCategories()
})
</script>

<style scoped>
.app-footer {
  background-color: var(--color-background-soft);
  padding: 40px 0 20px;
  margin-top: 60px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  margin-bottom: 30px;
}

.footer-section h3 {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 1.2rem;
}

.footer-section p {
  margin: 0;
  color: var(--color-text-light);
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section li {
  margin-bottom: 10px;
}

.category-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 15px;
  line-height: 1.6;
}

.category-row a {
  color: var(--color-text-light);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.category-row a:hover {
  color: var(--color-primary);
}

.category-row .main-category {
  font-weight: bold;
  color: var(--color-primary);
  font-size: 1rem;
}

.category-row .separator {
  margin: 0 8px;
  color: var(--color-border);
  user-select: none;
}

.footer-section a {
  color: var(--color-text-light);
  text-decoration: none;
}

.footer-section a:hover {
  color: var(--color-primary);
}

.footer-bottom {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid var(--color-border);
}

.license-info {
  font-size: 0.9rem;
  color: var(--color-text-light);
  margin-top: 8px;
}

.license-info a {
  color: var(--color-primary);
  text-decoration: none;
}

.license-info a:hover {
  text-decoration: underline;
}

.license-info .separator {
  margin: 0 10px;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
  }
  
  .category-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .category-row .separator {
    display: none;
  }
  
  .category-row a {
    display: block;
    padding: 4px 0;
  }
}
</style> 