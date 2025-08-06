# 游戏列表分页实现方案

## 方案1：简单分页（推荐给当前项目）

### 优势
- 实现简单，开发成本低
- 用户熟悉的交互模式
- 对SEO友好
- 减少DOM节点数量

### 核心实现思路

```vue
<template>
  <div class="games-section">
    <!-- 游戏列表 -->
    <div class="game-list">
      <div 
        v-for="(game, index) in paginatedGames" 
        :key="game.id"
        class="game-card"
      >
        <!-- 游戏卡片内容 -->
      </div>
    </div>
    
    <!-- 分页组件 -->
    <Pagination
      :current-page="currentPage"
      :total-items="filteredGames.length"
      :items-per-page="itemsPerPage"
      @page-change="handlePageChange"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 分页参数
const currentPage = ref(1)
const itemsPerPage = ref(24) // 每页显示24个游戏

// 分页后的游戏列表
const paginatedGames = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredGames.value.slice(start, end)
})

// 总页数
const totalPages = computed(() => {
  return Math.ceil(filteredGames.value.length / itemsPerPage.value)
})

// 页码变化处理
const handlePageChange = (page) => {
  currentPage.value = page
  // 滚动到页面顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>
```

## 方案2：虚拟滚动（高性能）

### 优势
- 最佳性能表现
- 支持大量数据无限滚动
- 只渲染可见区域内容

### 核心实现思路

```vue
<template>
  <div class="virtual-scroll-container" ref="container" @scroll="handleScroll">
    <div class="virtual-scroll-spacer" :style="{ height: totalHeight + 'px' }">
      <div 
        class="virtual-scroll-content" 
        :style="{ transform: `translateY(${offsetY}px)` }"
      >
        <div
          v-for="(game, index) in visibleGames"
          :key="game.id"
          class="game-card"
          :style="{ height: itemHeight + 'px' }"
        >
          <!-- 游戏卡片内容 -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const container = ref(null)
const scrollTop = ref(0)
const containerHeight = ref(600)
const itemHeight = 300 // 每个游戏卡片高度
const itemsPerRow = ref(4) // 每行显示数量

// 可见区域计算
const visibleGames = computed(() => {
  const startIndex = Math.floor(scrollTop.value / itemHeight) * itemsPerRow.value
  const endIndex = startIndex + Math.ceil(containerHeight.value / itemHeight) * itemsPerRow.value + itemsPerRow.value
  
  return filteredGames.value.slice(startIndex, endIndex).map((game, index) => ({
    ...game,
    virtualIndex: startIndex + index
  }))
})

// 总高度
const totalHeight = computed(() => {
  return Math.ceil(filteredGames.value.length / itemsPerRow.value) * itemHeight
})

// 偏移量
const offsetY = computed(() => {
  return Math.floor(scrollTop.value / itemHeight) * itemHeight
})

const handleScroll = (e) => {
  scrollTop.value = e.target.scrollTop
}
</script>
```

## 方案3：无限滚动（用户体验好）

### 优势
- 流畅的用户体验
- 移动端友好
- 减少点击操作

### 核心实现思路

```vue
<template>
  <div class="games-section">
    <div class="game-list">
      <div 
        v-for="(game, index) in displayedGames" 
        :key="game.id"
        class="game-card"
      >
        <!-- 游戏卡片内容 -->
      </div>
    </div>
    
    <!-- 加载更多指示器 -->
    <div ref="loadMoreTrigger" class="load-more-trigger">
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else-if="hasMore" class="load-more-btn" @click="loadMore">
        加载更多
      </div>
      <div v-else class="no-more">没有更多游戏了</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const loadMoreTrigger = ref(null)
const loading = ref(false)
const currentCount = ref(24) // 当前显示数量
const batchSize = 24 // 每次加载数量

// 当前显示的游戏
const displayedGames = computed(() => {
  return filteredGames.value.slice(0, currentCount.value)
})

// 是否还有更多
const hasMore = computed(() => {
  return currentCount.value < filteredGames.value.length
})

// 加载更多
const loadMore = async () => {
  if (loading.value || !hasMore.value) return
  
  loading.value = true
  // 模拟异步加载延迟
  await new Promise(resolve => setTimeout(resolve, 500))
  
  currentCount.value = Math.min(
    currentCount.value + batchSize,
    filteredGames.value.length
  )
  loading.value = false
}

// 交叉观察器实现自动加载
let observer = null

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && hasMore.value) {
      loadMore()
    }
  })
  
  if (loadMoreTrigger.value) {
    observer.observe(loadMoreTrigger.value)
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>
```

## 性能对比

| 方案 | DOM节点数量 | 内存占用 | 实现复杂度 | 用户体验 | 推荐度 |
|------|------------|----------|------------|----------|--------|
| 简单分页 | 24个 | 低 | ⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 虚拟滚动 | ~30个 | 极低 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 无限滚动 | 递增 | 中等 | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

## 推荐实施步骤

1. **立即实施**：简单分页方案（解决当前性能问题）
2. **后续优化**：根据用户反馈考虑虚拟滚动或无限滚动
3. **配置化**：允许用户选择每页显示数量（12/24/48个）
4. **响应式适配**：移动端减少每页数量

## 额外优化建议

1. **图片懒加载**：只加载可见区域的图片
2. **骨架屏**：加载时显示占位内容
3. **缓存策略**：缓存已访问的页面数据
4. **预加载**：提前加载下一页数据