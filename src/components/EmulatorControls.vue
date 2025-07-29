<template>
  <div class="emulator-controls" v-if="showControls">
    <div class="controls-group primary-controls">
      <!-- 播放/暂停按钮 -->
      <button 
        v-if="canPause || canResume"
        @click="togglePlayPause" 
        class="control-btn play-pause-btn"
        :class="{ active: isRunning }"
        :disabled="!canPause && !canResume"
        :title="isRunning ? $t('emulator.pauseTooltip') : $t('emulator.resumeTooltip')"
      >
        <span class="btn-icon">{{ isRunning ? '⏸️' : '▶️' }}</span>
        <span class="btn-text">{{ isRunning ? $t('emulator.pause') : $t('emulator.resume') }}</span>
      </button>
      
      <!-- 重启按钮 -->
      <button 
        v-if="showRestart"
        @click="handleRestart" 
        class="control-btn restart-btn"
        :disabled="!canRestart"
        :title="$t('emulator.restartTooltip')"
      >
        <span class="btn-icon">🔄</span>
        <span class="btn-text">{{ $t('emulator.restart') }}</span>
      </button>
    </div>
    
    <div v-if="showSecondaryControls" class="controls-group secondary-controls">
      <!-- 全屏按钮 -->
      <button 
        v-if="showFullscreen"
        @click="toggleFullscreen" 
        class="control-btn fullscreen-btn"
        :class="{ active: isFullscreen }"
        :disabled="!canFullscreen"
        :title="isFullscreen ? $t('emulator.exitFullscreenTooltip') : $t('emulator.fullscreenTooltip')"
      >
        <span class="btn-icon">{{ isFullscreen ? '🗗' : '⛶' }}</span>
        <span class="btn-text">{{ isFullscreen ? $t('emulator.exitFullscreen') : $t('emulator.fullscreen') }}</span>
      </button>
      
      <!-- 音量控制 -->
      <div v-if="showVolumeControl" class="volume-control">
        <button 
          @click="toggleMute" 
          class="control-btn volume-btn"
          :class="{ muted: isMuted }"
          :title="isMuted ? $t('emulator.unmuteTooltip') : $t('emulator.muteTooltip')"
        >
          <span class="btn-icon">{{ volumeIcon }}</span>
        </button>
        <div v-if="showVolumeSlider" class="volume-slider-container">
          <input 
            type="range" 
            v-model="volumeValue"
            @input="handleVolumeChange"
            min="0" 
            max="100" 
            step="5"
            class="volume-slider"
            :disabled="isMuted"
          />
          <span class="volume-text">{{ volumeValue }}%</span>
        </div>
      </div>
      
      <!-- 存档控制 -->
      <div v-if="showSaveControls" class="save-controls">
        <button 
          @click="handleSaveState" 
          class="control-btn save-btn"
          :disabled="!canSaveState"
          :title="$t('emulator.saveTooltip')"
        >
          <span class="btn-icon">💾</span>
          <span class="btn-text">{{ $t('emulator.save') }}</span>
        </button>
        <button 
          @click="handleLoadState" 
          class="control-btn load-btn"
          :disabled="!canLoadState"
          :title="$t('emulator.loadTooltip')"
        >
          <span class="btn-icon">📁</span>
          <span class="btn-text">{{ $t('emulator.load') }}</span>
        </button>
      </div>
      
      <!-- 控制设置按钮 -->
      <button 
        v-if="showKeyHelp"
        @click="toggleControlHelp" 
        class="control-btn controls-btn"
        :title="$t('emulator.controlsTooltip')"
      >
        <span class="btn-icon">🎮</span>
        <span class="btn-text">{{ $t('emulator.controls') }}</span>
      </button>
      
      <!-- 模拟器设置按钮 -->
      <button 
        @click="toggleSettings" 
        class="control-btn settings-btn"
        :title="$t('emulator.settingsTooltip')"
      >
        <span class="btn-icon">⚙️</span>
        <span class="btn-text">{{ $t('emulator.settings') }}</span>
      </button>
    </div>
    
    <!-- 扩展控制区域 -->
    <div v-if="showAdvancedControls" class="controls-group advanced-controls">
      <slot name="advanced-controls"></slot>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

// Props
const props = defineProps({
  // 控制显示
  showControls: {
    type: Boolean,
    default: true
  },
  showSecondaryControls: {
    type: Boolean,
    default: true
  },
  showAdvancedControls: {
    type: Boolean,
    default: false
  },
  
  // 具体控制项显示
  showRestart: {
    type: Boolean,
    default: true
  },
  showFullscreen: {
    type: Boolean,
    default: true
  },
  showVolumeControl: {
    type: Boolean,
    default: true
  },
  showVolumeSlider: {
    type: Boolean,
    default: true
  },
  showSaveControls: {
    type: Boolean,
    default: true
  },
  showKeyHelp: {
    type: Boolean,
    default: true
  },
  
  // 状态
  status: {
    type: String,
    default: 'idle'
  },
  volume: {
    type: Number,
    default: 100
  },
  isMuted: {
    type: Boolean,
    default: false
  },
  isFullscreen: {
    type: Boolean,
    default: false
  },
  showingKeyHelp: {
    type: Boolean,
    default: false
  },
  
  // 能力控制
  canPause: {
    type: Boolean,
    default: false
  },
  canResume: {
    type: Boolean,
    default: false
  },
  canRestart: {
    type: Boolean,
    default: false
  },
  canFullscreen: {
    type: Boolean,
    default: true
  },
  canSaveState: {
    type: Boolean,
    default: false
  },
  canLoadState: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits([
  'pause',
  'resume', 
  'restart',
  'fullscreen-enter',
  'fullscreen-exit',
  'volume-change',
  'mute-toggle',
  'save-state',
  'load-state',
  'settings-toggle',
  'control-help-toggle'
])

// 响应式数据
const volumeValue = ref(props.volume)

// 监听音量变化
watch(() => props.volume, (newVolume) => {
  volumeValue.value = newVolume
})

// 计算属性
const isRunning = computed(() => {
  return props.status === 'running'
})

const isPaused = computed(() => {
  return props.status === 'paused'
})

const volumeIcon = computed(() => {
  if (props.isMuted || volumeValue.value === 0) {
    return '🔇'
  } else if (volumeValue.value < 30) {
    return '🔈'
  } else if (volumeValue.value < 70) {
    return '🔉'
  } else {
    return '🔊'
  }
})

// 方法
const togglePlayPause = () => {
  if (isRunning.value && props.canPause) {
    emit('pause')
  } else if (isPaused.value && props.canResume) {
    emit('resume')
  }
}

const handleRestart = () => {
  if (props.canRestart) {
    emit('restart')
  }
}

const toggleFullscreen = () => {
  if (props.isFullscreen) {
    emit('fullscreen-exit')
  } else {
    emit('fullscreen-enter')
  }
}

const handleVolumeChange = (event) => {
  const newVolume = parseInt(event.target.value)
  emit('volume-change', newVolume)
}

const toggleMute = () => {
  emit('mute-toggle')
}

const handleSaveState = () => {
  if (props.canSaveState) {
    emit('save-state')
  }
}

const handleLoadState = () => {
  if (props.canLoadState) {
    emit('load-state')
  }
}

const toggleSettings = () => {
  emit('settings-toggle')
}

const toggleControlHelp = () => {
  emit('control-help-toggle')
}
</script>

<style scoped>
.emulator-controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.controls-group {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.primary-controls {
  justify-content: center;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.secondary-controls {
  justify-content: space-between;
  flex-wrap: wrap;
}

.advanced-controls {
  justify-content: center;
  padding-top: 8px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

/* 控制按钮通用样式 */
.control-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  color: #495057;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.1);
  min-width: 60px;
  justify-content: center;
}

.control-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.control-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.control-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #f8f9fa;
  color: #6c757d;
}

.control-btn.active {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  border-color: #0056b3;
}

/* 特定按钮样式 */
.play-pause-btn {
  background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%);
  color: white;
  border-color: #1e7e34;
  font-weight: 600;
  min-width: 80px;
}

.play-pause-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #218838 0%, #1c7430 100%);
}

.restart-btn {
  background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%);
  color: #212529;
  border-color: #e0a800;
}

.restart-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #e0a800 0%, #d39e00 100%);
}

.fullscreen-btn.active {
  background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
  color: white;
  border-color: #138496;
}

.volume-btn.muted {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
  border-color: #c82333;
}

.save-btn {
  background: linear-gradient(135deg, #6f42c1 0%, #59359a 100%);
  color: white;
  border-color: #59359a;
}

.load-btn {
  background: linear-gradient(135deg, #fd7e14 0%, #e55a00 100%);
  color: white;
  border-color: #e55a00;
}

.settings-btn.active {
  background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
  color: white;
  border-color: #5a6268;
}

/* 按钮内容 */
.btn-icon {
  font-size: 16px;
  line-height: 1;
}

.btn-text {
  font-size: 12px;
  font-weight: 500;
}

/* 音量控制 */
.volume-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.volume-slider-container {
  display: flex;
  align-items: center;
  gap: 6px;
}

.volume-slider {
  width: 80px;
  height: 4px;
  border-radius: 2px;
  background: #dee2e6;
  outline: none;
  cursor: pointer;
  -webkit-appearance: none;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #007bff;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.volume-slider::-moz-range-thumb {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #007bff;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.volume-slider:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.volume-text {
  font-size: 10px;
  color: #6c757d;
  min-width: 30px;
  text-align: right;
}

/* 存档控制 */
.save-controls {
  display: flex;
  gap: 6px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .emulator-controls {
    padding: 8px;
    gap: 8px;
  }
  
  .control-btn {
    padding: 6px 8px;
    min-width: 50px;
  }
  
  .btn-text {
    display: none;
  }
  
  .btn-icon {
    font-size: 18px;
  }
  
  .secondary-controls {
    justify-content: center;
  }
  
  .volume-slider {
    width: 60px;
  }
  
  .save-controls {
    gap: 4px;
  }
}

@media (max-width: 480px) {
  .controls-group {
    justify-content: center;
  }
  
  .secondary-controls {
    flex-direction: column;
    gap: 8px;
  }
  
  .volume-control,
  .save-controls {
    justify-content: center;
  }
}

/* 动画效果 */
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.control-btn.active {
  animation: pulse 2s infinite;
}

.control-btn:hover:not(:disabled) .btn-icon {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}
</style> 