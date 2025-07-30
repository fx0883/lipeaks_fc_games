<script setup>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import { StagewiseToolbar } from '@stagewise/toolbar-vue'
import VuePlugin from '@stagewise-plugins/vue'

// 配置stagewise，仅在开发环境中启用
const isDev = import.meta.env.DEV
const stagwiseConfig = {
  plugins: [VuePlugin],
}
</script>

<template>
  <div class="app">
    <AppHeader />
    
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <AppFooter />
    
    <!-- 仅在开发环境中显示stagewise工具栏 -->
    <StagewiseToolbar v-if="isDev" :config="stagwiseConfig" />
  </div>
</template>

<style>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* 最小高度，允许内容超出时滚动 */
}

.main-content {
  flex: 1;
}

/* 页面过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}


</style>
