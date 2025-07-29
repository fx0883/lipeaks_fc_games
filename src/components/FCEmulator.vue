<template>
  <div class="fc-emulator">
    <div class="emulator-container">
      <!-- 模拟器状态显示组件 -->
      <EmulatorStatus
        :is-loading="isLoading"
        :loading-message="loadingMessage"
        :progress="loadingProgress"
        :has-error="hasError"
        :error-message="errorMessage"
        :error-details="errorDetails"
        :error-type="errorType"
        :status="status"
        :status-duration="statusDuration"
        :show-status-info="showStatusInfo"
        @retry="handleRetry"
      />
      
      <!-- 模拟器容器 -->
      <div :id="containerId" class="emulator-viewport"></div>
      
      <!-- 模拟器控制组件 -->
      <EmulatorControls
        v-if="showControls"
        :show-controls="isGameLoaded"
        :show-restart="false"
        :show-fullscreen="false"
        :show-save-controls="false"
        :status="status"
        :volume="volume"
        :is-muted="isMuted"
        :is-fullscreen="isFullscreen"
        :showing-key-help="showKeyHelp"
        :can-pause="canPause"
        :can-resume="canResume"
        :can-restart="canRestart"
        :can-fullscreen="canFullscreen"
        :can-save-state="canSaveState"
        :can-load-state="canLoadState"
        @pause="handlePause"
        @resume="handleResume"
        @restart="handleRestart"
        @fullscreen-enter="handleFullscreenEnter"
        @fullscreen-exit="handleFullscreenExit"
        @volume-change="handleVolumeChange"
        @mute-toggle="handleMuteToggle"
        @save-state="handleSaveState"
        @load-state="handleLoadState"
        @key-help-toggle="toggleKeyHelp"
      />
      
      <!-- 按键说明弹窗 -->
      <div v-if="showKeyHelp" class="key-help-modal" @click.self="hideKeyHelp">
        <div class="key-help-content">
          <div class="key-help-header">
            <h3>游戏按键说明</h3>
            <button class="close-btn" @click="hideKeyHelp">×</button>
          </div>
          <div class="key-help-body">
            <div class="key-item" v-for="keyMapping in keyMappings" :key="keyMapping.name">
              <span class="key-name">{{ keyMapping.name }}</span>
              <span class="key-value">{{ keyMapping.key }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import EmulatorStatus from './EmulatorStatus.vue'
import EmulatorControls from './EmulatorControls.vue'
import { EmulatorService } from '../services/EmulatorService.js'
import { EmulatorConfig } from '../interfaces/IEmulatorAdapter.js'

// Props
const props = defineProps({
    romPath: {
      type: String,
      required: true
    },
    containerId: {
      type: String,
      default: 'emulator'
    },
    dataPath: {
      type: String,
      default: '/emulatorjs/data/'
  },
  gameName: {
    type: String,
    default: 'NES Game'
  },
  showControls: {
    type: Boolean,
    default: true
  },
  showStatusInfo: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits([
  'game-loaded',
  'game-started',
  'paused',
  'resumed',
  'error',
  'state-changed'
])

// 响应式数据
const emulatorService = ref(null)
const isGameLoaded = ref(false)
const isLoading = ref(false)
const loadingMessage = ref('')
const loadingProgress = ref(0)
const hasError = ref(false)
const errorMessage = ref('')
const errorDetails = ref('')
const errorType = ref('unknown')
const status = ref('idle')
const statusDuration = ref(0)
const volume = ref(100)
const isMuted = ref(false)
const isFullscreen = ref(false)
const showKeyHelp = ref(false)

// 按键映射配置 - 使用扩展的i18n
import { useExtendedI18n } from '../composables/useI18n'
const { t, updateEmulatorJSLanguage, currentLanguageConfig } = useExtendedI18n()

const keyMappings = computed(() => [
  { name: t('controls.up'), key: 'W' },
  { name: t('controls.down'), key: 'S' },
  { name: t('controls.left'), key: 'A' },
  { name: t('controls.right'), key: 'D' },
  { name: t('controls.buttonA'), key: 'J' },
  { name: t('controls.buttonAA'), key: 'Z' },
  { name: t('controls.buttonB'), key: 'K' },
  { name: t('controls.buttonBB'), key: 'X' },
  { name: t('controls.start'), key: 'Enter' },
  { name: t('controls.select'), key: 'Ctrl' }
])

// EmulatorJS语言同步
watch(currentLanguageConfig, (newConfig) => {
  if (emulatorService.value) {
    // 更新EmulatorJS语言
    updateEmulatorJSLanguage(newConfig.emulatorjsCode)
  }
}, { immediate: true })

// 计算属性
const canPause = computed(() => status.value === 'running')
const canResume = computed(() => status.value === 'paused')
const canRestart = computed(() => status.value === 'running' || status.value === 'paused')
const canFullscreen = computed(() => isGameLoaded.value)
const canSaveState = computed(() => status.value === 'running' || status.value === 'paused')
const canLoadState = computed(() => status.value === 'running' || status.value === 'paused')

// 监听ROM路径变化
watch(() => props.romPath, async (newRomPath, oldRomPath) => {
  if (newRomPath !== oldRomPath && emulatorService.value) {
    await loadGame(newRomPath)
  }
})

// 初始化模拟器
const initEmulator = async () => {
  try {
    isLoading.value = true
    hasError.value = false
    loadingMessage.value = t('emulator.initializing')
    loadingProgress.value = 0

    // 创建模拟器服务
    emulatorService.value = new EmulatorService()
    
    // 设置事件监听器
    setupEventListeners()
    
    // 创建配置
    const config = new EmulatorConfig({
      containerId: props.containerId,
      romPath: props.romPath,
      dataPath: props.dataPath,
      gameName: props.gameName,
      volume: volume.value / 100,
      muted: isMuted.value
    })
    
    // 初始化服务
    await emulatorService.value.initialize(config)
    
    console.log('FCEmulator: 模拟器初始化成功')
    
  } catch (error) {
    console.error('FCEmulator: 初始化失败:', error)
    hasError.value = true
    errorMessage.value = error.message
    errorDetails.value = error.stack
    errorType.value = 'emulator'
    isLoading.value = false
    emit('error', error.message)
  }
}

// 设置事件监听器
const setupEventListeners = () => {
  if (!emulatorService.value) return
  
  emulatorService.value.addEventListener('ready', handleReady)
  emulatorService.value.addEventListener('gameStarted', handleGameStarted)
  emulatorService.value.addEventListener('paused', handlePaused)
  emulatorService.value.addEventListener('resumed', handleResumed)
  emulatorService.value.addEventListener('error', handleError)
  emulatorService.value.addEventListener('loadingProgress', handleLoadingProgress)
  emulatorService.value.addEventListener('stateChanged', handleStateChanged)
}

// 事件处理器
const handleReady = () => {
  isGameLoaded.value = true
  isLoading.value = false
  emit('game-loaded')
}

const handleGameStarted = () => {
  emit('game-started')
}

const handlePaused = () => {
  emit('paused')
}

const handleResumed = () => {
  emit('resumed')
}

const handleError = (data) => {
  hasError.value = true
  errorMessage.value = data.error || '未知错误'
  errorType.value = 'emulator'
  isLoading.value = false
}

const handleLoadingProgress = (data) => {
  loadingProgress.value = data.progress || 0
}

const handleStateChanged = (stateChange) => {
  status.value = stateChange.to
  statusDuration.value = Date.now() - stateChange.timestamp
  emit('state-changed', stateChange)
}

// 控制方法
const handleRetry = async () => {
  hasError.value = false
  errorMessage.value = ''
  await initEmulator()
}

const handlePause = async () => {
  if (emulatorService.value) {
    emulatorService.value.pause()
  }
}

const handleResume = async () => {
  if (emulatorService.value) {
    emulatorService.value.resume()
  }
}

const handleRestart = async () => {
  if (emulatorService.value) {
    emulatorService.value.restart()
  }
}

const handleFullscreenEnter = () => {
  if (emulatorService.value) {
    const success = emulatorService.value.enterFullscreen()
    if (success) {
      isFullscreen.value = true
    }
  }
}

const handleFullscreenExit = () => {
  if (emulatorService.value) {
    const success = emulatorService.value.exitFullscreen()
    if (success) {
      isFullscreen.value = false
    }
  }
}

const handleVolumeChange = (newVolume) => {
  volume.value = newVolume
  if (emulatorService.value) {
    emulatorService.value.setVolume(newVolume / 100)
  }
}

const handleMuteToggle = () => {
  isMuted.value = !isMuted.value
  if (emulatorService.value) {
    emulatorService.value.setMuted(isMuted.value)
  }
}

const handleSaveState = async () => {
  if (emulatorService.value) {
    await emulatorService.value.saveState()
  }
}

const handleLoadState = async () => {
  if (emulatorService.value) {
    await emulatorService.value.loadState()
  }
}

const toggleKeyHelp = () => {
  showKeyHelp.value = !showKeyHelp.value
}

const hideKeyHelp = () => {
  showKeyHelp.value = false
}

// 加载游戏
const loadGame = async (romPath) => {
  if (emulatorService.value) {
    loadingMessage.value = '正在加载游戏...'
    await emulatorService.value.loadGame(romPath)
  }
}

// 全屏状态监听
const handleFullscreenChange = () => {
  const isInFullscreen = !!(document.fullscreenElement || 
                           document.webkitFullscreenElement || 
                           document.msFullscreenElement)
  if (!isInFullscreen) {
    isFullscreen.value = false
  }
}

// 获取控制器（向后兼容）
const getControls = () => {
  return {
    pause: handlePause,
    resume: handleResume,
    restart: handleRestart,
    toggleSound: handleMuteToggle,
    toggleFullscreen: () => {
      if (isFullscreen.value) {
        handleFullscreenExit()
      } else {
        handleFullscreenEnter()
      }
    },
    showKeyHelp: () => { showKeyHelp.value = true },
    hideKeyHelp: () => { showKeyHelp.value = false }
  }
}

// 生命周期
onMounted(async () => {
  console.log('FCEmulator: 组件挂载，开始初始化')
  
  // 监听全屏状态变化
  document.addEventListener('fullscreenchange', handleFullscreenChange)
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.addEventListener('msfullscreenchange', handleFullscreenChange)
  
  // 初始化模拟器
  await initEmulator()
})

onBeforeUnmount(async () => {
  console.log('FCEmulator: 组件卸载，释放资源')
  
    // 移除全屏事件监听器
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.removeEventListener('msfullscreenchange', handleFullscreenChange)
  
  // 销毁模拟器服务
  if (emulatorService.value) {
    await emulatorService.value.destroy()
    emulatorService.value = null
  }
})

// 暴露方法给父组件
defineExpose({
  getControls,
  loadGame,
  getStatus: () => status.value,
  getService: () => emulatorService.value
})
</script>

<style scoped>
.fc-emulator {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.emulator-container {
  position: relative;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 2px solid #e9ecef;
}

.emulator-viewport {
  width: 100%;
  height: 500px;
  background-color: #000;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 按键说明弹窗样式 */
.key-help-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.key-help-content {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 16px;
  padding: 24px;
  max-width: 420px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.key-help-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 12px;
}

.key-help-header h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
}

.close-btn {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 1px solid #dee2e6;
  font-size: 20px;
  cursor: pointer;
  color: #6c757d;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-btn:hover {
  color: #333;
  background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
  transform: scale(1.1);
}

.key-help-body {
  display: grid;
  gap: 8px;
}

.key-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 8px;
  border: 1px solid #e9ecef;
  transition: all 0.2s ease;
}

.key-item:hover {
  background: linear-gradient(135deg, #e9ecef 0%, #f8f9fa 100%);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.key-name {
  font-weight: 600;
  color: #495057;
  font-size: 14px;
}

.key-value {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  padding: 6px 10px;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  font-weight: bold;
  font-size: 12px;
  min-width: 40px;
  text-align: center;
  border: 1px solid #0056b3;
  box-shadow: 0 2px 4px rgba(0, 123, 255, 0.3);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .fc-emulator {
    max-width: 100%;
    margin: 0;
  }
  
  .emulator-viewport {
    height: 300px;
  }
  
  .key-help-content {
    margin: 16px;
    width: calc(100% - 32px);
    padding: 20px;
  }
  
  .key-item {
    padding: 8px 12px;
  }
  
  .key-name {
    font-size: 13px;
  }
  
  .key-value {
    padding: 4px 8px;
    font-size: 11px;
    min-width: 32px;
  }
}

@media (max-width: 480px) {
  .emulator-viewport {
    height: 240px;
  }
  
  .key-help-content {
    margin: 8px;
    width: calc(100% - 16px);
    padding: 16px;
  }
  
  .key-help-body {
    gap: 6px;
  }
}

/* 动画效果 */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.key-help-content {
  animation: slideIn 0.3s ease-out;
}
</style> 