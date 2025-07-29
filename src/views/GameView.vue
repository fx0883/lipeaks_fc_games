<template>
  <div class="game-view">
    <div class="game-header">
      <h1>{{ game ? game.name : '加载中...' }}</h1>
      <div class="game-meta" v-if="game">
        <span class="category">{{ categoryName }}</span>
        <span class="separator">|</span>
        <span class="play-count">已玩 {{ game.playCount }} 次</span>
        <span class="separator">|</span>
        <span class="author">{{ game.author }}</span>
        <span class="separator">|</span>
        <span class="size">{{ game.size }}</span>
      </div>
    </div>

    <div class="game-container" v-if="game">
      <!-- 使用重构后的FC模拟器组件 -->
      <FCEmulator 
        :rom-path="game.romPath" 
        :game-name="game.name"
        :show-controls="true"
        :show-status-info="true"
        @game-loaded="onGameLoaded"
        @game-started="onGameStarted"
        @paused="onGamePaused"
        @resumed="onGameResumed"
        @error="onGameError"
        @state-changed="onStateChanged"
      />
    </div>

    <div class="game-loading" v-else>
      <p>正在加载游戏...</p>
    </div>

    <div class="game-description" v-if="game">
      <h2>游戏介绍</h2>
      <p>{{ game.description }}</p>
      <p v-if="game.version">版本: {{ game.version }}</p>
      <p>地区: {{ game.region }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useGameStore } from '../stores/game'
import FCEmulator from '../components/FCEmulator.vue'

const route = useRoute()
const gameStore = useGameStore()
const gameId = computed(() => route.params.id)
const game = computed(() => gameStore.currentGame)
const loading = computed(() => gameStore.loading)

// 获取分类名称
const categoryName = computed(() => {
  if (!game.value || !game.value.category) return ''
  const category = gameStore.getCategoryById(game.value.category)
  return category ? category.name : game.value.category
})

// 游戏事件处理
const onGameLoaded = () => {
  console.log('Game loaded:', game.value?.name)
}

const onGameStarted = () => {
  // 游戏开始时增加播放次数
  gameStore.incrementPlayCount(gameId.value)
  console.log('Game started:', game.value?.name)
}

const onGamePaused = () => {
  console.log('Game paused:', game.value?.name)
}

const onGameResumed = () => {
  console.log('Game resumed:', game.value?.name)
}

const onGameError = (error) => {
  console.error('Game error:', error)
  // 可以在这里显示用户友好的错误提示
}

const onStateChanged = (stateChange) => {
  console.log('Game state changed:', stateChange)
  // 可以在这里处理状态变化，如更新UI等
}

// 加载游戏数据
onMounted(async () => {
  // 如果分类数据为空，先加载分类数据
  if (gameStore.categories.length === 0) {
    await gameStore.fetchCategories()
  }
  
  // 加载游戏数据
  await gameStore.fetchGameById(gameId.value)
})
</script>

<style scoped>
.game-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.game-header {
  margin-bottom: 20px;
}

.game-meta {
  color: var(--color-text-light);
}

.separator {
  margin: 0 10px;
}

.game-container {
  margin-bottom: 30px;
}

.game-description {
  margin-top: 30px;
  margin-bottom: 30px;
}

.game-loading {
  text-align: center;
  padding: 50px 0;
  color: var(--color-text-light);
}
</style> 