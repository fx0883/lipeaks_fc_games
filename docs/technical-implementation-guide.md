# EmulatorJS 技术实施指南

## 🚀 快速开始

### 环境要求

- **Node.js**: 16.0+ 
- **Vue**: 3.0+
- **Vite**: 4.0+
- **现代浏览器**: 支持WebAssembly

### 基础集成示例

```html
<!-- 最简单的集成方式 -->
<div style="width:640px;height:480px;max-width:100%">
  <div id="game"></div>
</div>
<script type="text/javascript">
    EJS_player = '#game';
    EJS_gameUrl = '/roms/your-game.nes'; 
    EJS_core = 'nes';
    EJS_pathtodata = 'https://cdn.emulatorjs.org/stable/data/';
</script>
<script src="https://cdn.emulatorjs.org/stable/data/loader.js"></script>
```

## 📦 Vue 3 组件集成

### 1. 新建 EmulatorJS 组件

```vue
<!-- src/components/EmulatorJS.vue -->
<template>
  <div class="emulator-container">
    <div 
      ref="emulatorRef" 
      :id="containerId"
      class="emulator-player"
      :style="{ width: width, height: height }"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

// Props
const props = defineProps({
  gameUrl: {
    type: String,
    required: true
  },
  core: {
    type: String,
    default: 'nes'
  },
  width: {
    type: String,
    default: '640px'
  },
  height: {
    type: String,
    default: '480px'
  },
  biosUrl: {
    type: String,
    default: ''
  },
  // 控制选项
  lightgun: {
    type: Boolean,
    default: false
  },
  // 自定义配置
  customConfig: {
    type: Object,
    default: () => ({})
  }
})

// Emits
const emit = defineEmits(['loaded', 'error', 'paused', 'resumed'])

// 响应式数据
const emulatorRef = ref(null)
const containerId = ref(`emulator-${Date.now()}`)
const isLoaded = ref(false)
const isLoading = ref(false)

// 生命周期
onMounted(async () => {
  await nextTick()
  await loadEmulator()
})

onUnmounted(() => {
  cleanup()
})

// 核心方法
async function loadEmulator() {
  if (isLoading.value) return
  
  isLoading.value = true
  
  try {
    // 设置全局配置
    window.EJS_player = `#${containerId.value}`
    window.EJS_gameUrl = props.gameUrl
    window.EJS_core = props.core
    window.EJS_pathtodata = 'https://cdn.emulatorjs.org/stable/data/'
    
    if (props.biosUrl) {
      window.EJS_biosUrl = props.biosUrl
    }
    
    if (props.lightgun) {
      window.EJS_lightgun = props.lightgun
    }
    
    // 应用自定义配置
    Object.assign(window, props.customConfig)
    
    // 加载EmulatorJS
    await loadScript('https://cdn.emulatorjs.org/stable/data/loader.js')
    
    // 等待模拟器初始化
    await waitForEmulator()
    
    isLoaded.value = true
    emit('loaded')
  } catch (error) {
    console.error('EmulatorJS加载失败:', error)
    emit('error', error)
  } finally {
    isLoading.value = false
  }
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

function waitForEmulator() {
  return new Promise((resolve) => {
    const checkEmulator = () => {
      if (window.EJS_emulator) {
        resolve()
      } else {
        setTimeout(checkEmulator, 100)
      }
    }
    checkEmulator()
  })
}

function cleanup() {
  // 清理全局变量
  if (window.EJS_emulator) {
    // EmulatorJS没有提供官方的销毁方法，但可以清理DOM
    const container = document.getElementById(containerId.value)
    if (container) {
      container.innerHTML = ''
    }
  }
}

// 公开方法
function pause() {
  if (window.EJS_emulator && window.EJS_emulator.pause) {
    window.EJS_emulator.pause()
    emit('paused')
  }
}

function resume() {
  if (window.EJS_emulator && window.EJS_emulator.resume) {
    window.EJS_emulator.resume()
    emit('resumed')
  }
}

function restart() {
  if (window.EJS_emulator && window.EJS_emulator.restart) {
    window.EJS_emulator.restart()
  }
}

function saveState() {
  if (window.EJS_emulator && window.EJS_emulator.saveState) {
    window.EJS_emulator.saveState()
  }
}

function loadState() {
  if (window.EJS_emulator && window.EJS_emulator.loadState) {
    window.EJS_emulator.loadState()
  }
}

// 暴露方法给父组件
defineExpose({
  pause,
  resume,
  restart,
  saveState,
  loadState,
  isLoaded,
  isLoading
})
</script>

<style scoped>
.emulator-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000;
  border-radius: 8px;
  overflow: hidden;
}

.emulator-player {
  background-color: #000;
}
</style>
```

### 2. 在游戏页面中使用

```vue
<!-- src/views/GameView.vue 或 src/components/FCEmulator.vue -->
<template>
  <div class="game-container">
    <div class="game-header">
      <h2>{{ game?.name }}</h2>
      <div class="game-controls">
        <button @click="togglePause" :disabled="!emulatorLoaded">
          {{ isPaused ? '继续' : '暂停' }}
        </button>
        <button @click="restart" :disabled="!emulatorLoaded">重启</button>
        <button @click="saveState" :disabled="!emulatorLoaded">保存</button>
        <button @click="loadState" :disabled="!emulatorLoaded">加载</button>
      </div>
    </div>
    
    <div class="emulator-wrapper">
      <EmulatorJS
        ref="emulatorRef"
        :game-url="romPath"
        :core="'nes'"
        :width="'800px'"
        :height="'600px'"
        @loaded="onEmulatorLoaded"
        @error="onEmulatorError"
        @paused="onPaused"
        @resumed="onResumed"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useGameStore } from '@/stores/game'
import EmulatorJS from '@/components/EmulatorJS.vue'

const route = useRoute()
const gameStore = useGameStore()
const emulatorRef = ref(null)

// 状态管理
const emulatorLoaded = ref(false)
const isPaused = ref(false)

// 计算属性
const game = computed(() => gameStore.currentGame)
const romPath = computed(() => {
  const gameId = route.params.id
  // 这里需要根据您的游戏数据结构调整
  return `/roms/${gameId}.nes`
})

// 事件处理
function onEmulatorLoaded() {
  emulatorLoaded.value = true
  console.log('模拟器加载完成')
}

function onEmulatorError(error) {
  console.error('模拟器加载错误:', error)
  // 可以显示错误提示给用户
}

function onPaused() {
  isPaused.value = true
}

function onResumed() {
  isPaused.value = false
}

// 控制方法
function togglePause() {
  if (isPaused.value) {
    emulatorRef.value?.resume()
  } else {
    emulatorRef.value?.pause()
  }
}

function restart() {
  emulatorRef.value?.restart()
}

function saveState() {
  emulatorRef.value?.saveState()
}

function loadState() {
  emulatorRef.value?.loadState()
}
</script>

<style scoped>
.game-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.game-controls {
  display: flex;
  gap: 10px;
}

.game-controls button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
}

.game-controls button:hover:not(:disabled) {
  background-color: #0056b3;
}

.game-controls button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.emulator-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
```

## ⚙️ 高级配置

### 1. 自定义控制器映射

```javascript
// 设置自定义按键映射
window.EJS_defaultControls = {
  0: { // 玩家1
    0: { value: 'x', value2: 'BUTTON_2' },      // B键
    1: { value: 's', value2: 'BUTTON_4' },      // Y键
    2: { value: 'v', value2: 'SELECT' },        // Select
    3: { value: 'enter', value2: 'START' },     // Start
    4: { value: 'up arrow', value2: 'DPAD_UP' },
    5: { value: 'down arrow', value2: 'DPAD_DOWN' },
    6: { value: 'left arrow', value2: 'DPAD_LEFT' },
    7: { value: 'right arrow', value2: 'DPAD_RIGHT' },
    8: { value: 'z', value2: 'BUTTON_1' },      // A键
    9: { value: 'a', value2: 'BUTTON_3' }       // X键
  }
}
```

### 2. 自定义虚拟手柄 (移动端)

```javascript
window.EJS_VirtualGamepadSettings = [
  {
    type: "button",
    text: "A",
    id: "a",
    location: "right",
    left: 40,
    top: 80,
    bold: true,
    input_value: 8
  },
  {
    type: "button", 
    text: "B",
    id: "b",
    location: "right",
    left: 81,
    top: 40,
    bold: true,
    input_value: 0
  },
  {
    type: "dpad",
    location: "left",
    left: "20%",
    top: "50%",
    inputValues: [4, 5, 6, 7]
  }
]
```

### 3. 存档系统集成

```vue
<script setup>
// 扩展存档功能
function saveToLocalStorage(slotId = 0) {
  if (window.EJS_emulator) {
    const saveData = window.EJS_emulator.getSaveData()
    localStorage.setItem(`game_save_${slotId}`, JSON.stringify(saveData))
  }
}

function loadFromLocalStorage(slotId = 0) {
  const saveData = localStorage.getItem(`game_save_${slotId}`)
  if (saveData && window.EJS_emulator) {
    window.EJS_emulator.loadSaveData(JSON.parse(saveData))
  }
}

// 自动保存功能
function enableAutoSave(intervalMinutes = 5) {
  setInterval(() => {
    saveToLocalStorage('auto')
  }, intervalMinutes * 60 * 1000)
}
</script>
```

## 🔧 性能优化

### 1. 懒加载优化

```vue
<script setup>
import { defineAsyncComponent } from 'vue'

// 只在需要时加载EmulatorJS组件
const EmulatorJS = defineAsyncComponent(() => 
  import('@/components/EmulatorJS.vue')
)
</script>
```

### 2. 资源预加载

```javascript
// 预加载EmulatorJS资源
function preloadEmulatorJS() {
  const link = document.createElement('link')
  link.rel = 'preload'
  link.href = 'https://cdn.emulatorjs.org/stable/data/loader.js'
  link.as = 'script'
  document.head.appendChild(link)
}

// 在应用启动时调用
preloadEmulatorJS()
```

### 3. 内存管理

```javascript
// 组件销毁时的清理
onUnmounted(() => {
  // 停止模拟器
  if (window.EJS_emulator && window.EJS_emulator.stop) {
    window.EJS_emulator.stop()
  }
  
  // 清理内存
  if (window.EJS_emulator) {
    window.EJS_emulator = null
  }
  
  // 清理DOM
  const container = document.getElementById(containerId.value)
  if (container) {
    container.innerHTML = ''
  }
})
```

## 🐛 常见问题解决

### 1. CORS 问题

如果遇到ROM文件加载的CORS问题，确保：

```javascript
// 在Vite配置中添加
// vite.config.js
export default defineConfig({
  server: {
    cors: true,
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin'
    }
  }
})
```

### 2. 路由切换时的清理

```vue
<script setup>
import { onBeforeRouteLeave } from 'vue-router'

onBeforeRouteLeave((to, from, next) => {
  // 暂停模拟器
  if (window.EJS_emulator) {
    window.EJS_emulator.pause()
  }
  next()
})
</script>
```

### 3. 移动端适配

```css
/* 响应式设计 */
@media (max-width: 768px) {
  .emulator-player {
    width: 100% !important;
    height: auto !important;
    aspect-ratio: 4/3;
  }
}
```

## 📱 移动端优化

### 1. 触屏控制

```javascript
// 启用触屏控制
window.EJS_mouse = false
window.EJS_multitap = false
window.EJS_gamepads = true
```

### 2. 性能模式

```javascript
// 移动端性能优化
window.EJS_threads = navigator.hardwareConcurrency || 2
window.EJS_lowLatency = true
```

## 🚦 测试指南

### 1. 功能测试清单

- [ ] ROM文件正常加载
- [ ] 游戏正常运行
- [ ] 暂停/恢复功能
- [ ] 存档/读档功能
- [ ] 按键控制响应
- [ ] 音频播放正常
- [ ] 全屏功能
- [ ] 移动端虚拟手柄

### 2. 性能测试

```javascript
// 性能监控
function monitorPerformance() {
  setInterval(() => {
    if (window.EJS_emulator) {
      console.log('FPS:', window.EJS_emulator.getFPS())
      console.log('Memory:', (performance.memory?.usedJSHeapSize / 1024 / 1024).toFixed(2) + 'MB')
    }
  }, 5000)
}
```

这个技术实施指南提供了完整的EmulatorJS集成方案，包括Vue 3组件封装、高级配置、性能优化和常见问题解决。建议按照这个指南逐步实施，确保每个步骤都经过充分测试。 