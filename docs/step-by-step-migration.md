# EmulatorJS 分步迁移指南

## 🗺️ 迁移路线图

本指南将帮助您安全、高效地从JSNES迁移到EmulatorJS，确保在整个过程中网站的可用性和数据完整性。

## 📋 迁移前准备

### 1. 环境检查清单

- [ ] **浏览器兼容性**: 确认目标用户的浏览器支持WebAssembly
- [ ] **服务器配置**: 检查CORS和MIME类型设置
- [ ] **ROM文件**: 验证现有ROM文件的可访问性
- [ ] **备份数据**: 备份当前的用户存档和设置
- [ ] **性能基准**: 记录当前JSNES的性能指标

### 2. 技术栈兼容性

```bash
# 检查Node.js版本
node --version  # 需要 >= 16.0

# 检查Vue版本
npm list vue    # 需要 >= 3.0

# 检查Vite版本
npm list vite   # 需要 >= 4.0
```

### 3. 创建开发分支

```bash
# 创建专用的迁移分支
git checkout -b feature/emulatorjs-migration
git push -u origin feature/emulatorjs-migration
```

## 🚀 阶段一：技术验证 (3-5天)

### 目标
- 验证EmulatorJS基础功能
- 确认性能提升
- 测试兼容性

### 第1步：创建测试页面

```vue
<!-- src/views/EmulatorJSTest.vue -->
<template>
  <div class="test-container">
    <h1>EmulatorJS 测试页面</h1>
    
    <div class="test-section">
      <h3>基础集成测试</h3>
      <div id="basic-test" style="width: 640px; height: 480px; margin: 20px auto;"></div>
    </div>
    
    <div class="performance-metrics">
      <h3>性能指标</h3>
      <div>加载时间: {{ loadTime }}ms</div>
      <div>FPS: {{ fps }}</div>
      <div>内存使用: {{ memoryUsage }}MB</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const loadTime = ref(0)
const fps = ref(0)
const memoryUsage = ref(0)

onMounted(async () => {
  await testBasicIntegration()
  startPerformanceMonitoring()
})

async function testBasicIntegration() {
  const startTime = Date.now()
  
  // 设置EmulatorJS
  window.EJS_player = '#basic-test'
  window.EJS_gameUrl = '/roms/Contra1(U)30.nes'  // 使用现有ROM
  window.EJS_core = 'nes'
  window.EJS_pathtodata = 'https://cdn.emulatorjs.org/stable/data/'
  
  // 加载脚本
  const script = document.createElement('script')
  script.src = 'https://cdn.emulatorjs.org/stable/data/loader.js'
  document.head.appendChild(script)
  
  script.onload = () => {
    loadTime.value = Date.now() - startTime
    console.log('EmulatorJS 加载完成，耗时:', loadTime.value, 'ms')
  }
}

function startPerformanceMonitoring() {
  setInterval(() => {
    if (window.EJS_emulator) {
      // 记录性能指标
      fps.value = Math.round(window.EJS_emulator.getFPS?.() || 0)
      memoryUsage.value = Math.round((performance.memory?.usedJSHeapSize || 0) / 1024 / 1024)
    }
  }, 1000)
}
</script>
```

### 第2步：添加测试路由

```javascript
// src/router/index.js
import EmulatorJSTest from '@/views/EmulatorJSTest.vue'

const routes = [
  // ... 现有路由
  {
    path: '/emulatorjs-test',
    name: 'EmulatorJSTest',
    component: EmulatorJSTest,
    meta: { title: 'EmulatorJS 测试' }
  }
]
```

### 第3步：性能对比测试

创建对比测试脚本：

```javascript
// scripts/performance-test.js
class PerformanceComparison {
  constructor() {
    this.results = {
      jsnes: {},
      emulatorjs: {}
    }
  }

  async testJSNES() {
    console.log('🧪 测试JSNES性能...')
    const startTime = performance.now()
    
    // 模拟JSNES加载
    // ... 现有JSNES初始化代码
    
    this.results.jsnes = {
      loadTime: performance.now() - startTime,
      memoryUsage: this.getMemoryUsage(),
      timestamp: new Date().toISOString()
    }
  }

  async testEmulatorJS() {
    console.log('🧪 测试EmulatorJS性能...')
    const startTime = performance.now()
    
    // 模拟EmulatorJS加载
    // ... EmulatorJS初始化代码
    
    this.results.emulatorjs = {
      loadTime: performance.now() - startTime,
      memoryUsage: this.getMemoryUsage(),
      timestamp: new Date().toISOString()
    }
  }

  getMemoryUsage() {
    return performance.memory 
      ? Math.round(performance.memory.usedJSHeapSize / 1024 / 1024)
      : 0
  }

  generateReport() {
    const improvement = {
      loadTime: ((this.results.jsnes.loadTime - this.results.emulatorjs.loadTime) / this.results.jsnes.loadTime * 100).toFixed(1),
      memoryUsage: ((this.results.jsnes.memoryUsage - this.results.emulatorjs.memoryUsage) / this.results.jsnes.memoryUsage * 100).toFixed(1)
    }

    console.log('📊 性能对比报告:')
    console.table({
      'JSNES': this.results.jsnes,
      'EmulatorJS': this.results.emulatorjs,
      '改进幅度(%)': improvement
    })

    return { results: this.results, improvement }
  }
}

// 使用示例
const tester = new PerformanceComparison()
await tester.testJSNES()
await tester.testEmulatorJS()
tester.generateReport()
```

### 第4步：兼容性测试

```javascript
// scripts/compatibility-test.js
const testGames = [
  '/roms/Contra1(U)30.nes',
  '/roms/luyu(1).nes',
  '/roms/luyu(10).nes',
  // ... 添加更多测试ROM
]

class CompatibilityTester {
  constructor() {
    this.results = []
  }

  async testGame(romPath) {
    console.log(`🎮 测试游戏: ${romPath}`)
    
    try {
      const result = await this.loadGameWithEmulatorJS(romPath)
      this.results.push({
        rom: romPath,
        status: 'success',
        loadTime: result.loadTime,
        errors: []
      })
    } catch (error) {
      this.results.push({
        rom: romPath,
        status: 'failed',
        loadTime: null,
        errors: [error.message]
      })
    }
  }

  async loadGameWithEmulatorJS(romPath) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now()
      
      window.EJS_player = '#test-container'
      window.EJS_gameUrl = romPath
      window.EJS_core = 'nes'
      window.EJS_pathtodata = 'https://cdn.emulatorjs.org/stable/data/'
      
      const script = document.createElement('script')
      script.src = 'https://cdn.emulatorjs.org/stable/data/loader.js'
      
      script.onload = () => {
        setTimeout(() => {
          if (window.EJS_emulator) {
            resolve({ loadTime: Date.now() - startTime })
          } else {
            reject(new Error('模拟器初始化失败'))
          }
        }, 2000)
      }
      
      script.onerror = () => reject(new Error('脚本加载失败'))
      document.head.appendChild(script)
    })
  }

  generateCompatibilityReport() {
    const total = this.results.length
    const successful = this.results.filter(r => r.status === 'success').length
    const compatibilityRate = (successful / total * 100).toFixed(1)

    console.log(`📈 兼容性报告: ${successful}/${total} (${compatibilityRate}%)`)
    console.table(this.results)

    return {
      total,
      successful,
      compatibilityRate,
      details: this.results
    }
  }
}
```

### 阶段一验收标准

- [ ] EmulatorJS成功加载并运行
- [ ] 至少3个ROM文件测试通过
- [ ] 性能指标记录完整
- [ ] 无重大兼容性问题

## 🔧 阶段二：组件开发 (1-2周)

### 目标
- 开发新的EmulatorJS Vue组件
- 保持与现有接口的兼容性
- 实现核心功能

### 第1步：创建EmulatorJS服务

```javascript
// src/services/emulatorJSService.js
class EmulatorJSService {
  constructor() {
    this.emulator = null
    this.isInitialized = false
    this.currentRomPath = null
    this.callbacks = {
      onGameLoaded: null,
      onError: null,
      onPaused: null,
      onResumed: null
    }
  }

  async init(containerId, config = {}) {
    console.log(`EmulatorJSService: 初始化模拟器, 容器ID: ${containerId}`)
    
    try {
      // 设置配置
      window.EJS_player = `#${containerId}`
      window.EJS_core = config.core || 'nes'
      window.EJS_pathtodata = config.pathtodata || 'https://cdn.emulatorjs.org/stable/data/'
      
      // 应用自定义配置
      Object.keys(config).forEach(key => {
        if (key.startsWith('EJS_')) {
          window[key] = config[key]
        }
      })

      // 加载EmulatorJS
      await this.loadScript('https://cdn.emulatorjs.org/stable/data/loader.js')
      
      // 等待初始化完成
      await this.waitForInitialization()
      
      this.isInitialized = true
      console.log('EmulatorJSService: 初始化完成')
      
      return this.emulator
    } catch (error) {
      console.error('EmulatorJSService: 初始化失败', error)
      throw error
    }
  }

  async loadROM(romPath) {
    console.log(`EmulatorJSService: 加载ROM: ${romPath}`)
    
    if (!this.isInitialized) {
      throw new Error('模拟器未初始化')
    }

    try {
      window.EJS_gameUrl = romPath
      this.currentRomPath = romPath
      
      // 重新初始化以加载新游戏
      await this.reinitialize()
      
      if (this.callbacks.onGameLoaded) {
        this.callbacks.onGameLoaded(romPath)
      }
      
      console.log('EmulatorJSService: ROM加载完成')
    } catch (error) {
      console.error('EmulatorJSService: ROM加载失败', error)
      if (this.callbacks.onError) {
        this.callbacks.onError(error)
      }
      throw error
    }
  }

  pause() {
    if (this.emulator && this.emulator.pause) {
      this.emulator.pause()
      if (this.callbacks.onPaused) {
        this.callbacks.onPaused()
      }
      return true
    }
    return false
  }

  resume() {
    if (this.emulator && this.emulator.resume) {
      this.emulator.resume()
      if (this.callbacks.onResumed) {
        this.callbacks.onResumed()
      }
      return true
    }
    return false
  }

  restart() {
    if (this.emulator && this.emulator.restart) {
      this.emulator.restart()
    }
  }

  saveState() {
    if (this.emulator && this.emulator.saveState) {
      this.emulator.saveState()
    }
  }

  loadState() {
    if (this.emulator && this.emulator.loadState) {
      this.emulator.loadState()
    }
  }

  toggleFullscreen() {
    if (this.emulator && this.emulator.enterFullscreen) {
      this.emulator.enterFullscreen()
    }
  }

  destroy() {
    console.log('EmulatorJSService: 销毁模拟器')
    
    if (this.emulator) {
      // 清理模拟器实例
      this.emulator = null
    }

    // 清理全局变量
    delete window.EJS_emulator
    delete window.EJS_player
    delete window.EJS_gameUrl
    delete window.EJS_core

    this.isInitialized = false
    this.currentRomPath = null
  }

  // 私有方法
  loadScript(src) {
    return new Promise((resolve, reject) => {
      // 检查是否已加载
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve()
        return
      }

      const script = document.createElement('script')
      script.src = src
      script.onload = resolve
      script.onerror = reject
      document.head.appendChild(script)
    })
  }

  waitForInitialization() {
    return new Promise((resolve) => {
      const checkEmulator = () => {
        if (window.EJS_emulator) {
          this.emulator = window.EJS_emulator
          resolve()
        } else {
          setTimeout(checkEmulator, 100)
        }
      }
      checkEmulator()
    })
  }

  async reinitialize() {
    // EmulatorJS可能需要重新加载来切换游戏
    if (this.emulator) {
      // 重新加载脚本
      const scripts = document.querySelectorAll('script[src*="emulatorjs"]')
      scripts.forEach(script => script.remove())
      
      await this.loadScript('https://cdn.emulatorjs.org/stable/data/loader.js')
      await this.waitForInitialization()
    }
  }

  // 设置回调
  setCallbacks(callbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks }
  }
}

// 创建单例实例
const emulatorJSService = new EmulatorJSService()

export default emulatorJSService
```

### 第2步：创建新的模拟器组件

```vue
<!-- src/components/EmulatorJSComponent.vue -->
<template>
  <div class="emulatorjs-container">
    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <div class="loading-text">正在加载模拟器...</div>
    </div>

    <!-- 模拟器容器 -->
    <div 
      :id="containerId"
      ref="emulatorRef"
      class="emulator-player"
      :style="containerStyle"
    ></div>

    <!-- 控制栏 -->
    <div v-if="showControls" class="emulator-controls">
      <button @click="togglePause" :disabled="!isGameLoaded">
        {{ isPaused ? '继续' : '暂停' }}
      </button>
      <button @click="restart" :disabled="!isGameLoaded">重启</button>
      <button @click="saveState" :disabled="!isGameLoaded">保存</button>
      <button @click="loadState" :disabled="!isGameLoaded">加载</button>
      <button @click="toggleFullscreen" :disabled="!isGameLoaded">全屏</button>
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="error-message">
      <p>模拟器加载失败: {{ error.message }}</p>
      <button @click="retry">重试</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import emulatorJSService from '@/services/emulatorJSService'

// Props
const props = defineProps({
  romPath: {
    type: String,
    required: true
  },
  width: {
    type: [String, Number],
    default: '800px'
  },
  height: {
    type: [String, Number],
    default: '600px'
  },
  showControls: {
    type: Boolean,
    default: true
  },
  autoPlay: {
    type: Boolean,
    default: true
  },
  config: {
    type: Object,
    default: () => ({})
  }
})

// Emits
const emit = defineEmits(['game-loaded', 'game-error', 'pause', 'resume'])

// 响应式数据
const emulatorRef = ref(null)
const containerId = ref(`emulatorjs-${Date.now()}`)
const isLoading = ref(false)
const isGameLoaded = ref(false)
const isPaused = ref(false)
const error = ref(null)

// 计算属性
const containerStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height
}))

// 生命周期
onMounted(async () => {
  await initializeEmulator()
})

onUnmounted(() => {
  cleanup()
})

// 监听ROM路径变化
watch(() => props.romPath, async (newPath, oldPath) => {
  if (newPath && newPath !== oldPath) {
    await loadGame(newPath)
  }
})

// 核心方法
async function initializeEmulator() {
  if (isLoading.value) return

  isLoading.value = true
  error.value = null

  try {
    // 设置回调
    emulatorJSService.setCallbacks({
      onGameLoaded: handleGameLoaded,
      onError: handleError,
      onPaused: handlePaused,
      onResumed: handleResumed
    })

    // 初始化模拟器
    await emulatorJSService.init(containerId.value, props.config)

    // 自动加载游戏
    if (props.romPath && props.autoPlay) {
      await loadGame(props.romPath)
    }

  } catch (err) {
    error.value = err
    console.error('初始化模拟器失败:', err)
  } finally {
    isLoading.value = false
  }
}

async function loadGame(romPath) {
  if (!romPath) return

  isLoading.value = true
  error.value = null

  try {
    await emulatorJSService.loadROM(romPath)
  } catch (err) {
    error.value = err
    handleError(err)
  } finally {
    isLoading.value = false
  }
}

function cleanup() {
  emulatorJSService.destroy()
  isGameLoaded.value = false
  isPaused.value = false
}

// 控制方法
function togglePause() {
  if (isPaused.value) {
    emulatorJSService.resume()
  } else {
    emulatorJSService.pause()
  }
}

function restart() {
  emulatorJSService.restart()
}

function saveState() {
  emulatorJSService.saveState()
}

function loadState() {
  emulatorJSService.loadState()
}

function toggleFullscreen() {
  emulatorJSService.toggleFullscreen()
}

function retry() {
  error.value = null
  initializeEmulator()
}

// 事件处理
function handleGameLoaded(romPath) {
  isGameLoaded.value = true
  emit('game-loaded', romPath)
  console.log('游戏加载完成:', romPath)
}

function handleError(err) {
  error.value = err
  emit('game-error', err)
  console.error('游戏错误:', err)
}

function handlePaused() {
  isPaused.value = true
  emit('pause')
}

function handleResumed() {
  isPaused.value = false
  emit('resume')
}

// 暴露方法
defineExpose({
  loadGame,
  togglePause,
  restart,
  saveState,
  loadState,
  toggleFullscreen,
  isGameLoaded,
  isPaused,
  isLoading
})
</script>

<style scoped>
.emulatorjs-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #000;
  border-radius: 8px;
  overflow: hidden;
}

.emulator-player {
  background-color: #000;
  border-radius: 8px;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;
  color: white;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #333;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 16px;
}

.emulator-controls {
  display: flex;
  gap: 10px;
  padding: 15px;
  background-color: #f8f9fa;
  border-top: 1px solid #dee2e6;
  width: 100%;
  justify-content: center;
}

.emulator-controls button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 14px;
}

.emulator-controls button:hover:not(:disabled) {
  background-color: #0056b3;
}

.emulator-controls button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.error-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(220, 53, 69, 0.9);
  color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  z-index: 10;
}

.error-message button {
  margin-top: 10px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: white;
  color: #dc3545;
  cursor: pointer;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .emulator-player {
    width: 100% !important;
    height: auto !important;
    aspect-ratio: 4/3;
  }
  
  .emulator-controls {
    flex-wrap: wrap;
    gap: 8px;
    padding: 10px;
  }
  
  .emulator-controls button {
    flex: 1;
    min-width: 80px;
    font-size: 12px;
  }
}
</style>
```

### 第3步：适配现有接口

创建兼容性适配器：

```javascript
// src/adapters/emulatorAdapter.js
import emulatorJSService from '@/services/emulatorJSService'

class EmulatorAdapter {
  constructor() {
    this.emulatorType = 'emulatorjs' // 或 'jsnes'
  }

  // 统一的初始化接口
  async init(containerId, options = {}) {
    if (this.emulatorType === 'emulatorjs') {
      return await emulatorJSService.init(containerId, options)
    } else {
      // 保留JSNES初始化逻辑作为备用
      return await this.initJSNES(containerId, options)
    }
  }

  // 统一的加载ROM接口
  async loadROM(romPath) {
    if (this.emulatorType === 'emulatorjs') {
      return await emulatorJSService.loadROM(romPath)
    } else {
      return await this.loadROMWithJSNES(romPath)
    }
  }

  // 统一的控制接口
  pause() {
    if (this.emulatorType === 'emulatorjs') {
      return emulatorJSService.pause()
    } else {
      return this.pauseJSNES()
    }
  }

  resume() {
    if (this.emulatorType === 'emulatorjs') {
      return emulatorJSService.resume()
    } else {
      return this.resumeJSNES()
    }
  }

  restart() {
    if (this.emulatorType === 'emulatorjs') {
      return emulatorJSService.restart()
    } else {
      return this.restartJSNES()
    }
  }

  // 切换模拟器类型
  switchEmulator(type) {
    if (['emulatorjs', 'jsnes'].includes(type)) {
      this.emulatorType = type
      console.log(`切换到模拟器: ${type}`)
    }
  }

  // JSNES备用方法 (从现有代码迁移)
  async initJSNES(containerId, options) {
    // 现有的JSNES初始化逻辑
  }

  async loadROMWithJSNES(romPath) {
    // 现有的JSNES ROM加载逻辑
  }

  pauseJSNES() {
    // 现有的JSNES暂停逻辑
  }

  resumeJSNES() {
    // 现有的JSNES恢复逻辑
  }

  restartJSNES() {
    // 现有的JSNES重启逻辑
  }
}

export default new EmulatorAdapter()
```

### 阶段二验收标准

- [ ] EmulatorJS组件功能完整
- [ ] 与现有接口兼容
- [ ] 核心功能测试通过
- [ ] 代码质量达标

## 🎨 阶段三：功能完善 (1-2周)

### 目标
- 实现高级功能
- 优化用户体验
- 移动端适配

### 第1步：存档系统增强

```javascript
// src/services/saveStateService.js
class SaveStateService {
  constructor() {
    this.storageKey = 'fc_game_saves'
    this.maxSaves = 10
  }

  // 保存游戏状态
  async saveGameState(gameId, slotId = 0, metadata = {}) {
    try {
      if (!window.EJS_emulator) {
        throw new Error('模拟器未初始化')
      }

      // 获取模拟器状态数据
      const stateData = await this.getEmulatorState()
      
      const saveData = {
        gameId,
        slotId,
        timestamp: Date.now(),
        stateData,
        metadata: {
          gameName: metadata.gameName || gameId,
          screenshot: metadata.screenshot || null,
          playTime: metadata.playTime || 0,
          ...metadata
        }
      }

      // 保存到localStorage
      const saves = this.getAllSaves()
      const saveKey = `${gameId}_${slotId}`
      saves[saveKey] = saveData

      localStorage.setItem(this.storageKey, JSON.stringify(saves))
      
      console.log('游戏状态已保存:', saveKey)
      return saveData
    } catch (error) {
      console.error('保存游戏状态失败:', error)
      throw error
    }
  }

  // 加载游戏状态
  async loadGameState(gameId, slotId = 0) {
    try {
      const saves = this.getAllSaves()
      const saveKey = `${gameId}_${slotId}`
      const saveData = saves[saveKey]

      if (!saveData) {
        throw new Error('存档不存在')
      }

      if (!window.EJS_emulator) {
        throw new Error('模拟器未初始化')
      }

      // 加载状态到模拟器
      await this.loadEmulatorState(saveData.stateData)
      
      console.log('游戏状态已加载:', saveKey)
      return saveData
    } catch (error) {
      console.error('加载游戏状态失败:', error)
      throw error
    }
  }

  // 获取游戏的所有存档
  getGameSaves(gameId) {
    const saves = this.getAllSaves()
    return Object.keys(saves)
      .filter(key => key.startsWith(`${gameId}_`))
      .map(key => saves[key])
      .sort((a, b) => b.timestamp - a.timestamp)
  }

  // 删除存档
  deleteSave(gameId, slotId) {
    const saves = this.getAllSaves()
    const saveKey = `${gameId}_${slotId}`
    
    if (saves[saveKey]) {
      delete saves[saveKey]
      localStorage.setItem(this.storageKey, JSON.stringify(saves))
      console.log('存档已删除:', saveKey)
      return true
    }
    
    return false
  }

  // 获取所有存档
  getAllSaves() {
    try {
      const saves = localStorage.getItem(this.storageKey)
      return saves ? JSON.parse(saves) : {}
    } catch (error) {
      console.error('读取存档失败:', error)
      return {}
    }
  }

  // 清理旧存档
  cleanupOldSaves() {
    const saves = this.getAllSaves()
    const saveArray = Object.values(saves)
    
    if (saveArray.length > this.maxSaves) {
      // 按时间排序，删除最旧的存档
      saveArray.sort((a, b) => a.timestamp - b.timestamp)
      const toDelete = saveArray.slice(0, saveArray.length - this.maxSaves)
      
      toDelete.forEach(save => {
        this.deleteSave(save.gameId, save.slotId)
      })
    }
  }

  // 私有方法：获取模拟器状态
  async getEmulatorState() {
    return new Promise((resolve, reject) => {
      try {
        // EmulatorJS的状态获取API
        if (window.EJS_emulator.saveState) {
          const state = window.EJS_emulator.saveState()
          resolve(state)
        } else {
          reject(new Error('模拟器不支持状态保存'))
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  // 私有方法：加载模拟器状态
  async loadEmulatorState(stateData) {
    return new Promise((resolve, reject) => {
      try {
        if (window.EJS_emulator.loadState) {
          window.EJS_emulator.loadState(stateData)
          resolve()
        } else {
          reject(new Error('模拟器不支持状态加载'))
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  // 导出存档
  exportSaves() {
    const saves = this.getAllSaves()
    const dataStr = JSON.stringify(saves, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    
    const link = document.createElement('a')
    link.href = URL.createObjectURL(dataBlob)
    link.download = `fc_game_saves_${new Date().toISOString().split('T')[0]}.json`
    link.click()
  }

  // 导入存档
  async importSaves(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const importedSaves = JSON.parse(e.target.result)
          
          // 验证数据格式
          if (typeof importedSaves === 'object') {
            const currentSaves = this.getAllSaves()
            const mergedSaves = { ...currentSaves, ...importedSaves }
            
            localStorage.setItem(this.storageKey, JSON.stringify(mergedSaves))
            resolve(Object.keys(importedSaves).length)
          } else {
            reject(new Error('无效的存档文件格式'))
          }
        } catch (error) {
          reject(new Error('解析存档文件失败'))
        }
      }
      
      reader.onerror = () => reject(new Error('读取文件失败'))
      reader.readAsText(file)
    })
  }
}

export default new SaveStateService()
```

### 第2步：设置界面开发

```vue
<!-- src/components/EmulatorSettings.vue -->
<template>
  <div class="settings-modal" v-if="visible" @click.self="close">
    <div class="settings-content">
      <div class="settings-header">
        <h3>模拟器设置</h3>
        <button class="close-btn" @click="close">×</button>
      </div>

      <div class="settings-body">
        <!-- 显示设置 -->
        <div class="setting-group">
          <h4>显示设置</h4>
          
          <div class="setting-item">
            <label>画面尺寸</label>
            <select v-model="settings.resolution" @change="applySettings">
              <option value="1x">原始尺寸 (256×240)</option>
              <option value="2x">2倍尺寸 (512×480)</option>
              <option value="3x">3倍尺寸 (768×720)</option>
              <option value="4x">4倍尺寸 (1024×960)</option>
              <option value="fit">适应容器</option>
            </select>
          </div>

          <div class="setting-item">
            <label>画面滤镜</label>
            <select v-model="settings.filter" @change="applySettings">
              <option value="nearest">像素化 (最邻近)</option>
              <option value="linear">平滑 (线性)</option>
              <option value="crt">CRT效果</option>
            </select>
          </div>

          <div class="setting-item">
            <label>
              <input 
                type="checkbox" 
                v-model="settings.smoothing" 
                @change="applySettings"
              >
              图像平滑
            </label>
          </div>
        </div>

        <!-- 音频设置 -->
        <div class="setting-group">
          <h4>音频设置</h4>
          
          <div class="setting-item">
            <label>音量</label>
            <input 
              type="range" 
              min="0" 
              max="100" 
              v-model="settings.volume"
              @input="applySettings"
            >
            <span>{{ settings.volume }}%</span>
          </div>

          <div class="setting-item">
            <label>
              <input 
                type="checkbox" 
                v-model="settings.muted" 
                @change="applySettings"
              >
              静音
            </label>
          </div>
        </div>

        <!-- 控制设置 -->
        <div class="setting-group">
          <h4>控制设置</h4>
          
          <div class="setting-item">
            <label>按键映射</label>
            <button @click="showKeyMapping = true">配置按键</button>
          </div>

          <div class="setting-item">
            <label>
              <input 
                type="checkbox" 
                v-model="settings.touchControls" 
                @change="applySettings"
              >
              显示触屏控制 (移动端)
            </label>
          </div>
        </div>

        <!-- 性能设置 -->
        <div class="setting-group">
          <h4>性能设置</h4>
          
          <div class="setting-item">
            <label>模拟器核心</label>
            <select v-model="settings.core" @change="applySettings">
              <option value="nes">默认NES核心</option>
              <option value="mesen">Mesen核心</option>
              <option value="nestopia">Nestopia核心</option>
            </select>
          </div>

          <div class="setting-item">
            <label>帧率限制</label>
            <select v-model="settings.framerate" @change="applySettings">
              <option value="60">60 FPS (标准)</option>
              <option value="30">30 FPS (省电)</option>
              <option value="unlimited">无限制</option>
            </select>
          </div>
        </div>

        <!-- 存档设置 -->
        <div class="setting-group">
          <h4>存档设置</h4>
          
          <div class="setting-item">
            <label>
              <input 
                type="checkbox" 
                v-model="settings.autoSave" 
                @change="applySettings"
              >
              自动保存进度
            </label>
          </div>

          <div class="setting-item">
            <label>自动保存间隔</label>
            <select v-model="settings.autoSaveInterval" @change="applySettings">
              <option value="1">1分钟</option>
              <option value="5">5分钟</option>
              <option value="10">10分钟</option>
              <option value="30">30分钟</option>
            </select>
          </div>

          <div class="setting-item">
            <button @click="exportSaves">导出存档</button>
            <button @click="triggerImportSaves">导入存档</button>
            <input 
              type="file" 
              ref="importFileRef" 
              @change="importSaves" 
              accept=".json"
              style="display: none"
            >
          </div>
        </div>
      </div>

      <div class="settings-footer">
        <button @click="resetToDefaults">恢复默认</button>
        <button @click="saveSettings">保存设置</button>
      </div>
    </div>
  </div>

  <!-- 按键映射弹窗 -->
  <KeyMappingModal 
    v-if="showKeyMapping" 
    @close="showKeyMapping = false"
    @save="updateKeyMapping"
  />
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import saveStateService from '@/services/saveStateService'
import KeyMappingModal from './KeyMappingModal.vue'

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['close', 'settings-changed'])

// 响应式数据
const showKeyMapping = ref(false)
const importFileRef = ref(null)

const settings = reactive({
  // 显示设置
  resolution: '2x',
  filter: 'nearest',
  smoothing: false,
  
  // 音频设置
  volume: 80,
  muted: false,
  
  // 控制设置
  touchControls: true,
  keyMapping: {},
  
  // 性能设置
  core: 'nes',
  framerate: '60',
  
  // 存档设置
  autoSave: true,
  autoSaveInterval: '5'
})

// 默认设置
const defaultSettings = { ...settings }

// 生命周期
onMounted(() => {
  loadSettings()
})

// 监听设置变化
watch(() => props.visible, (visible) => {
  if (visible) {
    loadSettings()
  }
})

// 方法
function close() {
  emit('close')
}

function loadSettings() {
  try {
    const saved = localStorage.getItem('emulator_settings')
    if (saved) {
      Object.assign(settings, JSON.parse(saved))
    }
  } catch (error) {
    console.error('加载设置失败:', error)
  }
}

function saveSettings() {
  try {
    localStorage.setItem('emulator_settings', JSON.stringify(settings))
    applySettings()
    emit('settings-changed', settings)
    close()
  } catch (error) {
    console.error('保存设置失败:', error)
  }
}

function applySettings() {
  if (window.EJS_emulator) {
    // 应用显示设置
    applyDisplaySettings()
    
    // 应用音频设置
    applyAudioSettings()
    
    // 应用控制设置
    applyControlSettings()
    
    // 应用性能设置
    applyPerformanceSettings()
  }
}

function applyDisplaySettings() {
  const canvas = document.querySelector('.nes-screen, canvas')
  if (canvas) {
    // 应用分辨率
    switch (settings.resolution) {
      case '1x':
        canvas.style.width = '256px'
        canvas.style.height = '240px'
        break
      case '2x':
        canvas.style.width = '512px'
        canvas.style.height = '480px'
        break
      case '3x':
        canvas.style.width = '768px'
        canvas.style.height = '720px'
        break
      case '4x':
        canvas.style.width = '1024px'
        canvas.style.height = '960px'
        break
      case 'fit':
        canvas.style.width = '100%'
        canvas.style.height = '100%'
        break
    }

    // 应用滤镜
    switch (settings.filter) {
      case 'nearest':
        canvas.style.imageRendering = 'pixelated'
        break
      case 'linear':
        canvas.style.imageRendering = 'auto'
        break
      case 'crt':
        canvas.style.imageRendering = 'pixelated'
        // 可以添加CRT效果的CSS滤镜
        break
    }

    // 应用平滑设置
    if (settings.smoothing) {
      canvas.style.imageRendering = 'auto'
    }
  }
}

function applyAudioSettings() {
  if (window.EJS_emulator) {
    // 设置音量
    const volume = settings.muted ? 0 : settings.volume / 100
    if (window.EJS_emulator.setVolume) {
      window.EJS_emulator.setVolume(volume)
    }
  }
}

function applyControlSettings() {
  // 应用按键映射
  if (settings.keyMapping && Object.keys(settings.keyMapping).length > 0) {
    window.EJS_defaultControls = settings.keyMapping
  }

  // 移动端触屏控制
  if (settings.touchControls) {
    // 启用虚拟手柄
    window.EJS_VirtualGamepadSettings = getVirtualGamepadConfig()
  }
}

function applyPerformanceSettings() {
  // 应用核心设置
  if (window.EJS_core !== settings.core) {
    console.log('核心设置变更，需要重新加载模拟器')
  }

  // 应用帧率设置
  if (window.EJS_emulator && window.EJS_emulator.setFramerate) {
    const framerate = settings.framerate === 'unlimited' ? 0 : parseInt(settings.framerate)
    window.EJS_emulator.setFramerate(framerate)
  }
}

function resetToDefaults() {
  Object.assign(settings, defaultSettings)
  applySettings()
}

function updateKeyMapping(mapping) {
  settings.keyMapping = mapping
  applySettings()
}

async function exportSaves() {
  try {
    saveStateService.exportSaves()
  } catch (error) {
    console.error('导出存档失败:', error)
  }
}

function triggerImportSaves() {
  importFileRef.value?.click()
}

async function importSaves(event) {
  const file = event.target.files[0]
  if (file) {
    try {
      const count = await saveStateService.importSaves(file)
      alert(`成功导入 ${count} 个存档`)
    } catch (error) {
      console.error('导入存档失败:', error)
      alert('导入存档失败: ' + error.message)
    }
  }
}

function getVirtualGamepadConfig() {
  return [
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
    },
    {
      type: "button",
      text: "Start",
      id: "start",
      location: "center",
      left: 60,
      fontSize: 15,
      block: true,
      input_value: 3
    },
    {
      type: "button",
      text: "Select",
      id: "select",
      location: "center",
      left: -5,
      fontSize: 15,
      block: true,
      input_value: 2
    }
  ]
}
</script>

<style scoped>
.settings-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.settings-content {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.settings-header h3 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.settings-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.setting-group {
  margin-bottom: 30px;
}

.setting-group h4 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  gap: 10px;
}

.setting-item label {
  font-weight: 500;
  color: #555;
  display: flex;
  align-items: center;
  gap: 8px;
}

.setting-item select,
.setting-item input[type="range"] {
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.setting-item input[type="checkbox"] {
  margin: 0;
}

.setting-item button {
  padding: 6px 12px;
  border: 1px solid #007bff;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.setting-item button:hover {
  background-color: #0056b3;
}

.settings-footer {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  border-top: 1px solid #eee;
  gap: 10px;
}

.settings-footer button {
  padding: 10px 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.settings-footer button:first-child {
  background-color: #6c757d;
  color: white;
  border-color: #6c757d;
}

.settings-footer button:last-child {
  background-color: #28a745;
  color: white;
  border-color: #28a745;
}

.settings-footer button:hover {
  opacity: 0.9;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .settings-content {
    width: 95%;
    margin: 10px;
  }
  
  .setting-item {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  
  .setting-item label {
    justify-content: flex-start;
  }
}
</style>
```

### 阶段三验收标准

- [ ] 存档系统功能完整
- [ ] 设置界面用户友好
- [ ] 移动端体验良好
- [ ] 高级功能稳定可用

## 🧪 阶段四：测试优化 (1周)

### 目标
- 全面功能测试
- 性能优化
- 兼容性验证

### 第1步：自动化测试

```javascript
// tests/emulatorjs.test.js
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import EmulatorJSComponent from '@/components/EmulatorJSComponent.vue'

describe('EmulatorJS 组件测试', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(EmulatorJSComponent, {
      props: {
        romPath: '/roms/test.nes',
        width: '640px',
        height: '480px'
      }
    })
  })

  it('应该正确渲染组件', () => {
    expect(wrapper.find('.emulatorjs-container').exists()).toBe(true)
  })

  it('应该显示加载状态', async () => {
    expect(wrapper.find('.loading-overlay').exists()).toBe(true)
  })

  it('应该处理ROM路径变化', async () => {
    await wrapper.setProps({ romPath: '/roms/new-game.nes' })
    // 验证loadGame方法被调用
  })

  it('控制按钮应该正确响应', async () => {
    // 模拟游戏加载完成
    wrapper.vm.isGameLoaded = true
    await wrapper.vm.$nextTick()

    const pauseBtn = wrapper.find('button')
    await pauseBtn.trigger('click')
    
    // 验证暂停功能
    expect(wrapper.vm.isPaused).toBe(true)
  })
})
```

### 第2步：性能监控

```javascript
// src/utils/performanceMonitor.js
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      fps: [],
      memory: [],
      loadTimes: [],
      errors: []
    }
    this.isRunning = false
  }

  start() {
    if (this.isRunning) return

    this.isRunning = true
    this.monitoringInterval = setInterval(() => {
      this.collectMetrics()
    }, 1000)

    console.log('性能监控已启动')
  }

  stop() {
    if (!this.isRunning) return

    this.isRunning = false
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval)
    }

    console.log('性能监控已停止')
  }

  collectMetrics() {
    const now = Date.now()

    // 收集FPS
    if (window.EJS_emulator && window.EJS_emulator.getFPS) {
      const fps = window.EJS_emulator.getFPS()
      this.metrics.fps.push({
        timestamp: now,
        value: fps
      })
    }

    // 收集内存使用
    if (performance.memory) {
      const memory = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024)
      this.metrics.memory.push({
        timestamp: now,
        value: memory
      })
    }

    // 限制数据点数量
    this.limitDataPoints()
  }

  limitDataPoints(maxPoints = 300) {
    Object.keys(this.metrics).forEach(key => {
      if (Array.isArray(this.metrics[key]) && this.metrics[key].length > maxPoints) {
        this.metrics[key] = this.metrics[key].slice(-maxPoints)
      }
    })
  }

  recordLoadTime(loadTime) {
    this.metrics.loadTimes.push({
      timestamp: Date.now(),
      value: loadTime
    })
  }

  recordError(error) {
    this.metrics.errors.push({
      timestamp: Date.now(),
      error: error.toString(),
      stack: error.stack
    })
  }

  getAverages(timeRange = 60000) { // 最近1分钟
    const now = Date.now()
    const cutoff = now - timeRange

    const recentFPS = this.metrics.fps.filter(m => m.timestamp > cutoff)
    const recentMemory = this.metrics.memory.filter(m => m.timestamp > cutoff)

    return {
      averageFPS: recentFPS.length > 0 
        ? recentFPS.reduce((sum, m) => sum + m.value, 0) / recentFPS.length 
        : 0,
      averageMemory: recentMemory.length > 0 
        ? recentMemory.reduce((sum, m) => sum + m.value, 0) / recentMemory.length 
        : 0,
      errorCount: this.metrics.errors.filter(e => e.timestamp > cutoff).length
    }
  }

  generateReport() {
    const averages = this.getAverages()
    const report = {
      summary: averages,
      details: {
        totalDataPoints: this.metrics.fps.length,
        monitoringDuration: this.metrics.fps.length > 0 
          ? Date.now() - this.metrics.fps[0].timestamp 
          : 0,
        loadTimes: this.metrics.loadTimes,
        recentErrors: this.metrics.errors.slice(-10)
      },
      recommendations: this.generateRecommendations(averages)
    }

    console.log('📊 性能报告:', report)
    return report
  }

  generateRecommendations(averages) {
    const recommendations = []

    if (averages.averageFPS < 50) {
      recommendations.push('FPS过低，建议优化渲染性能')
    }

    if (averages.averageMemory > 200) {
      recommendations.push('内存使用过高，检查是否存在内存泄漏')
    }

    if (averages.errorCount > 0) {
      recommendations.push('存在错误，请检查控制台日志')
    }

    return recommendations
  }

  exportData() {
    const data = {
      metrics: this.metrics,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    }

    const dataStr = JSON.stringify(data, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    
    const link = document.createElement('a')
    link.href = URL.createObjectURL(dataBlob)
    link.download = `performance_data_${Date.now()}.json`
    link.click()
  }
}

export default new PerformanceMonitor()
```

### 第3步：用户验收测试

```javascript
// scripts/acceptance-test.js
class AcceptanceTest {
  constructor() {
    this.testResults = []
  }

  async runAllTests() {
    console.log('🧪 开始用户验收测试...')

    const tests = [
      this.testBasicFunctionality,
      this.testGameLoading,
      this.testControls,
      this.testSaveLoad,
      this.testSettings,
      this.testPerformance,
      this.testMobileCompatibility
    ]

    for (const test of tests) {
      try {
        await test.call(this)
      } catch (error) {
        console.error(`测试失败: ${test.name}`, error)
      }
    }

    this.generateTestReport()
  }

  async testBasicFunctionality() {
    console.log('🔍 测试基础功能...')
    
    const tests = [
      {
        name: '模拟器初始化',
        test: () => window.EJS_emulator !== undefined,
        expected: true
      },
      {
        name: '容器元素存在',
        test: () => document.querySelector('.emulator-player') !== null,
        expected: true
      },
      {
        name: '控制按钮可见',
        test: () => document.querySelector('.emulator-controls') !== null,
        expected: true
      }
    ]

    this.executeTests('基础功能', tests)
  }

  async testGameLoading() {
    console.log('🎮 测试游戏加载...')
    
    const testRoms = [
      '/roms/Contra1(U)30.nes',
      '/roms/luyu(1).nes'
    ]

    for (const rom of testRoms) {
      const startTime = Date.now()
      
      try {
        // 模拟加载ROM
        await this.loadRomForTest(rom)
        const loadTime = Date.now() - startTime
        
        this.testResults.push({
          category: '游戏加载',
          test: `加载 ${rom}`,
          result: 'PASS',
          loadTime
        })
      } catch (error) {
        this.testResults.push({
          category: '游戏加载',
          test: `加载 ${rom}`,
          result: 'FAIL',
          error: error.message
        })
      }
    }
  }

  async testControls() {
    console.log('🎮 测试控制功能...')
    
    const controlTests = [
      {
        name: '暂停/恢复',
        action: () => {
          const pauseBtn = document.querySelector('button[data-action="pause"]')
          return pauseBtn && !pauseBtn.disabled
        }
      },
      {
        name: '重启游戏',
        action: () => {
          const restartBtn = document.querySelector('button[data-action="restart"]')
          return restartBtn && !restartBtn.disabled
        }
      },
      {
        name: '全屏切换',
        action: () => {
          const fullscreenBtn = document.querySelector('button[data-action="fullscreen"]')
          return fullscreenBtn && !fullscreenBtn.disabled
        }
      }
    ]

    controlTests.forEach(test => {
      this.testResults.push({
        category: '控制功能',
        test: test.name,
        result: test.action() ? 'PASS' : 'FAIL'
      })
    })
  }

  async testSaveLoad() {
    console.log('💾 测试存档功能...')
    
    try {
      // 测试保存状态
      if (window.EJS_emulator && window.EJS_emulator.saveState) {
        window.EJS_emulator.saveState()
        this.testResults.push({
          category: '存档功能',
          test: '保存状态',
          result: 'PASS'
        })
      }

      // 测试加载状态
      if (window.EJS_emulator && window.EJS_emulator.loadState) {
        // 这里需要实际的存档数据
        this.testResults.push({
          category: '存档功能',
          test: '加载状态',
          result: 'PASS'
        })
      }
    } catch (error) {
      this.testResults.push({
        category: '存档功能',
        test: '存档操作',
        result: 'FAIL',
        error: error.message
      })
    }
  }

  async testSettings() {
    console.log('⚙️ 测试设置功能...')
    
    const settingsTests = [
      '显示设置',
      '音频设置',
      '控制设置',
      '性能设置'
    ]

    settingsTests.forEach(test => {
      // 这里需要实际的设置界面测试逻辑
      this.testResults.push({
        category: '设置功能',
        test,
        result: 'PASS' // 简化处理
      })
    })
  }

  async testPerformance() {
    console.log('⚡ 测试性能指标...')
    
    // 等待一段时间收集性能数据
    await new Promise(resolve => setTimeout(resolve, 5000))
    
    const fps = window.EJS_emulator?.getFPS?.() || 0
    const memory = performance.memory?.usedJSHeapSize || 0
    
    this.testResults.push({
      category: '性能测试',
      test: 'FPS检查',
      result: fps >= 50 ? 'PASS' : 'FAIL',
      value: fps
    })

    this.testResults.push({
      category: '性能测试',
      test: '内存使用',
      result: memory < 200 * 1024 * 1024 ? 'PASS' : 'FAIL', // 200MB
      value: Math.round(memory / 1024 / 1024) + 'MB'
    })
  }

  async testMobileCompatibility() {
    console.log('📱 测试移动端兼容性...')
    
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    
    if (isMobile) {
      const touchTests = [
        {
          name: '虚拟手柄显示',
          test: () => document.querySelector('.virtual-gamepad') !== null
        },
        {
          name: '响应式布局',
          test: () => {
            const container = document.querySelector('.emulator-player')
            return container && container.style.width === '100%'
          }
        }
      ]

      touchTests.forEach(test => {
        this.testResults.push({
          category: '移动端兼容',
          test: test.name,
          result: test.test() ? 'PASS' : 'FAIL'
        })
      })
    } else {
      this.testResults.push({
        category: '移动端兼容',
        test: '非移动设备',
        result: 'SKIP'
      })
    }
  }

  executeTests(category, tests) {
    tests.forEach(test => {
      const result = test.test()
      this.testResults.push({
        category,
        test: test.name,
        result: result === test.expected ? 'PASS' : 'FAIL',
        expected: test.expected,
        actual: result
      })
    })
  }

  async loadRomForTest(romPath) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('加载超时'))
      }, 10000)

      // 模拟ROM加载
      window.EJS_gameUrl = romPath
      
      // 检查加载状态
      const checkLoaded = () => {
        if (window.EJS_emulator && window.EJS_emulator.isLoaded) {
          clearTimeout(timeout)
          resolve()
        } else {
          setTimeout(checkLoaded, 100)
        }
      }
      
      checkLoaded()
    })
  }

  generateTestReport() {
    const summary = this.calculateSummary()
    
    console.log('📊 用户验收测试报告:')
    console.log(`总计: ${summary.total} 测试`)
    console.log(`通过: ${summary.passed} (${((summary.passed / summary.total) * 100).toFixed(1)}%)`)
    console.log(`失败: ${summary.failed}`)
    console.log(`跳过: ${summary.skipped}`)
    
    console.table(this.testResults)
    
    return {
      summary,
      results: this.testResults
    }
  }

  calculateSummary() {
    const total = this.testResults.length
    const passed = this.testResults.filter(r => r.result === 'PASS').length
    const failed = this.testResults.filter(r => r.result === 'FAIL').length
    const skipped = this.testResults.filter(r => r.result === 'SKIP').length
    
    return { total, passed, failed, skipped }
  }
}

// 使用示例
const acceptanceTest = new AcceptanceTest()
acceptanceTest.runAllTests()
```

### 阶段四验收标准

- [ ] 所有功能测试通过
- [ ] 性能指标达标
- [ ] 兼容性测试通过
- [ ] 用户验收测试通过率 > 95%

## 📋 迁移完成检查清单

### 技术验收
- [ ] EmulatorJS成功集成并运行
- [ ] 所有原有功能保持可用
- [ ] 性能提升达到预期 (30%+)
- [ ] 存档系统完整迁移
- [ ] 移动端体验优化

### 质量保证
- [ ] 单元测试覆盖率 > 80%
- [ ] 集成测试全部通过
- [ ] 性能测试达标
- [ ] 兼容性测试通过
- [ ] 安全性检查完成

### 部署准备
- [ ] 生产环境配置就绪
- [ ] 备份策略确定
- [ ] 回滚方案准备
- [ ] 监控系统配置
- [ ] 文档更新完成

### 用户体验
- [ ] 用户界面友好
- [ ] 功能操作直观
- [ ] 错误处理完善
- [ ] 性能表现良好
- [ ] 移动端适配良好

## 🚨 风险缓解

### 技术风险
1. **兼容性问题**: 准备JSNES作为备用方案
2. **性能问题**: 实施性能监控和优化
3. **数据丢失**: 实施完整的备份策略

### 业务风险
1. **用户体验中断**: 分阶段部署，快速回滚能力
2. **功能缺失**: 详细功能对比和测试
3. **学习成本**: 提供详细使用指南

## 📈 成功指标

### 技术指标
- 加载速度提升 30%+
- 游戏兼容性提升至 95%+
- 错误率降低至 < 1%
- 移动端性能提升 50%+

### 用户指标
- 用户满意度 > 90%
- 功能使用率提升
- 移动端访问量增长
- 存档使用率提升

这个分步迁移指南确保了安全、可控的从JSNES到EmulatorJS的升级过程，最大化收益的同时最小化风险。 