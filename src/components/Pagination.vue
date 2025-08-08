<!--
  Lipeaks FC Games - 分页组件
  Copyright (C) 2024 Lipeaks
-->
<template>
  <div class="pagination" v-if="totalPages > 1">
    <div class="pagination-info">
      <span class="info-text">
        {{ $t('pagination.showing', { start: startItem, end: endItem, total: totalItems }) }}
      </span>
      <select v-model="localItemsPerPage" @change="handleItemsPerPageChange" class="items-per-page-select">
        <option value="12">12 {{ $t('pagination.perPage') }}</option>
        <option value="24">24 {{ $t('pagination.perPage') }}</option>
        <option value="36">36 {{ $t('pagination.perPage') }}</option>
        <option value="48">48 {{ $t('pagination.perPage') }}</option>
      </select>
    </div>
    
    <div class="pagination-controls">
      <!-- 第一页 -->
      <button 
        :disabled="currentPage <= 1" 
        @click="goToPage(1)"
        class="pagination-btn first-btn"
        :title="$t('pagination.firstPage')"
      >
        <span class="btn-icon">⏮️</span>
      </button>
      
      <!-- 上一页 -->
      <button 
        :disabled="currentPage <= 1" 
        @click="goToPage(currentPage - 1)"
        class="pagination-btn prev-btn"
        :title="$t('pagination.prevPage')"
      >
        <span class="btn-icon">⬅️</span>
        <span class="btn-text">{{ $t('pagination.prev') }}</span>
      </button>
      
      <!-- 页码 -->
      <div class="page-numbers">
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="goToPage(page)"
          :class="[
            'page-btn',
            { 'active': page === currentPage }
          ]"
        >
          {{ page }}
        </button>
        
        <!-- 省略号 -->
        <span v-if="showEndEllipsis" class="ellipsis">...</span>
      </div>
      
      <!-- 下一页 -->
      <button 
        :disabled="currentPage >= totalPages" 
        @click="goToPage(currentPage + 1)"
        class="pagination-btn next-btn"
        :title="$t('pagination.nextPage')"
      >
        <span class="btn-text">{{ $t('pagination.next') }}</span>
        <span class="btn-icon">➡️</span>
      </button>
      
      <!-- 最后一页 -->
      <button 
        :disabled="currentPage >= totalPages" 
        @click="goToPage(totalPages)"
        class="pagination-btn last-btn"
        :title="$t('pagination.lastPage')"
      >
        <span class="btn-icon">⏭️</span>
      </button>
    </div>
    
    <!-- 跳转到指定页 -->
    <div class="pagination-jump">
      <span class="jump-label">{{ $t('pagination.goToPage') }}</span>
      <input 
        v-model.number="jumpPage" 
        @keyup.enter="goToJumpPage"
        type="number" 
        :min="1" 
        :max="totalPages"
        class="jump-input"
        :placeholder="$t('pagination.pageNumber')"
      >
      <button @click="goToJumpPage" class="jump-btn">
        {{ $t('pagination.go') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

// Props
const props = defineProps({
  currentPage: {
    type: Number,
    default: 1
  },
  totalItems: {
    type: Number,
    required: true
  },
  itemsPerPage: {
    type: Number,
    default: 24
  },
  maxVisiblePages: {
    type: Number,
    default: 7
  }
})

// Emits
const emit = defineEmits(['page-change', 'items-per-page-change'])

// 响应式数据
const localItemsPerPage = ref(props.itemsPerPage)
const jumpPage = ref('')

// 计算属性
const totalPages = computed(() => {
  return Math.ceil(props.totalItems / props.itemsPerPage)
})

const startItem = computed(() => {
  return (props.currentPage - 1) * props.itemsPerPage + 1
})

const endItem = computed(() => {
  return Math.min(props.currentPage * props.itemsPerPage, props.totalItems)
})

// 可见页码计算
const visiblePages = computed(() => {
  const pages = []
  const maxVisible = props.maxVisiblePages
  const current = props.currentPage
  const total = totalPages.value
  
  if (total <= maxVisible) {
    // 总页数少于最大显示数，显示所有页码
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // 计算显示范围
    const sidePages = Math.floor((maxVisible - 1) / 2)
    let startPage = Math.max(1, current - sidePages)
    let endPage = Math.min(total, current + sidePages)
    
    // 调整边界情况
    if (endPage - startPage + 1 < maxVisible) {
      if (startPage === 1) {
        endPage = Math.min(total, startPage + maxVisible - 1)
      } else {
        startPage = Math.max(1, endPage - maxVisible + 1)
      }
    }
    
    // 添加页码
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
  }
  
  return pages
})

const showEndEllipsis = computed(() => {
  const lastVisible = visiblePages.value[visiblePages.value.length - 1]
  return lastVisible < totalPages.value
})

// 方法
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value && page !== props.currentPage) {
    emit('page-change', page)
  }
}

const goToJumpPage = () => {
  const page = parseInt(jumpPage.value)
  if (page && page >= 1 && page <= totalPages.value) {
    goToPage(page)
    jumpPage.value = ''
  }
}

const handleItemsPerPageChange = () => {
  emit('items-per-page-change', parseInt(localItemsPerPage.value))
}

// 监听每页数量的外部变化
watch(() => props.itemsPerPage, (newValue) => {
  localItemsPerPage.value = newValue
})
</script>

<style scoped>
.pagination {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin: 2rem 0;
  padding: 1.5rem;
  background: var(--color-background);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
}

.pagination-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.info-text {
  color: var(--color-text-light);
  font-size: 0.9rem;
}

.items-per-page-select {
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  background: var(--color-background-soft);
  color: var(--color-text);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.items-per-page-select:hover {
  border-color: var(--color-primary);
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.pagination-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  background: var(--color-background-soft);
  color: var(--color-text);
  cursor: pointer;
  transition: all var(--transition-normal);
  font-size: 0.9rem;
}

.pagination-btn:hover:not(:disabled) {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
  transform: translateY(-2px);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-icon {
  font-size: 0.8rem;
}

.page-numbers {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.page-btn {
  min-width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  background: var(--color-background-soft);
  color: var(--color-text);
  cursor: pointer;
  transition: all var(--transition-normal);
  font-weight: 500;
}

.page-btn:hover {
  background: var(--color-primary-light);
  border-color: var(--color-primary);
  transform: translateY(-2px);
}

.page-btn.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
  font-weight: 600;
}

.ellipsis {
  padding: 0 0.5rem;
  color: var(--color-text-light);
}

.pagination-jump {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.jump-label {
  color: var(--color-text-light);
  font-size: 0.9rem;
}

.jump-input {
  width: 80px;
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  background: var(--color-background-soft);
  color: var(--color-text);
  text-align: center;
  font-size: 0.9rem;
}

.jump-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px var(--color-primary-light);
}

.jump-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-primary);
  border-radius: var(--border-radius);
  background: var(--color-primary);
  color: white;
  cursor: pointer;
  transition: all var(--transition-normal);
  font-size: 0.9rem;
}

.jump-btn:hover {
  background: var(--color-primary-dark);
  transform: translateY(-2px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .pagination {
    gap: 1rem;
    padding: 1rem;
  }
  
  .pagination-info {
    flex-direction: column;
    text-align: center;
  }
  
  .pagination-controls {
    justify-content: center;
    gap: 0.25rem;
  }
  
  .pagination-btn .btn-text {
    display: none;
  }
  
  .page-numbers {
    gap: 0.125rem;
  }
  
  .page-btn {
    min-width: 35px;
    height: 35px;
    font-size: 0.8rem;
  }
  
  .pagination-jump {
    gap: 0.5rem;
  }
  
  .jump-label {
    font-size: 0.8rem;
  }
  
  .jump-input {
    width: 60px;
  }
}

@media (max-width: 480px) {
  .first-btn,
  .last-btn {
    display: none;
  }
  
  .page-numbers {
    max-width: 200px;
    overflow-x: auto;
    padding: 0.25rem;
  }
}
</style>