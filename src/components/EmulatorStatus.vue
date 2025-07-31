<template>
  <div class="emulator-status">
    <!-- 加载状态显示 -->
    <div v-if="isLoading" class="loading-overlay" :class="overlayClass">
      <div class="loading-content">
        <div class="spinner"></div>
        <p class="loading-message">{{ loadingMessage }}</p>
        <div v-if="showProgress" class="progress-bar">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
        <span v-if="showProgress" class="progress-text">{{ progress.toFixed(0) }}%</span>
      </div>
    </div>
    
    <!-- 错误状态显示 -->
    <div v-if="hasError" class="error-display" :class="overlayClass">
      <div class="error-content">
        <div class="error-icon">{{ errorIcon }}</div>
        <h3 class="error-title">{{ errorTitle }}</h3>
        <p class="error-message">{{ errorMessage }}</p>
        <div v-if="showRetry" class="error-actions">
          <button @click="handleRetry" class="retry-btn">
            <span class="btn-icon">🔄</span>
            <span class="btn-text">重试</span>
          </button>
          <button v-if="showDetails" @click="toggleDetails" class="details-btn">
            <span class="btn-icon">{{ showErrorDetails ? '👆' : '👇' }}</span>
            <span class="btn-text">{{ showErrorDetails ? '隐藏详情' : '查看详情' }}</span>
          </button>
        </div>
        <div v-if="showErrorDetails && errorDetails" class="error-details">
          <pre>{{ errorDetails }}</pre>
        </div>
      </div>
    </div>
    
    <!-- 状态信息显示 -->
    <div v-if="showStatusInfo && statusInfo" class="status-info">
      <div class="status-badge" :class="statusBadgeClass">
        <span class="status-icon">{{ statusIcon }}</span>
        <span class="status-text">{{ statusText }}</span>
      </div>
      <div v-if="statusDuration > 0" class="status-duration">
        {{ formatDuration(statusDuration) }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

// Props
const props = defineProps({
  // 加载状态
  isLoading: {
    type: Boolean,
    default: false
  },
  loadingMessage: {
    type: String,
    default: '正在加载...'
  },
  progress: {
    type: Number,
    default: 0
  },
  showProgress: {
    type: Boolean,
    default: true
  },
  
  // 错误状态
  hasError: {
    type: Boolean,
    default: false
  },
  errorMessage: {
    type: String,
    default: ''
  },
  errorDetails: {
    type: String,
    default: null
  },
  errorType: {
    type: String,
    default: 'unknown'
  },
  showRetry: {
    type: Boolean,
    default: true
  },
  
  // 状态信息
  status: {
    type: String,
    default: 'idle'
  },
  statusDuration: {
    type: Number,
    default: 0
  },
  showStatusInfo: {
    type: Boolean,
    default: false
  },
  
  // 样式选项
  overlayClass: {
    type: String,
    default: ''
  }
})

// Emits
const emit = defineEmits(['retry', 'dismiss'])

// 响应式数据
const showErrorDetails = ref(false)

// 计算属性
const statusIcon = computed(() => {
  switch (props.status) {
    case 'idle': return '⏸️'
    case 'loading': return '⏳'
    case 'ready': return '✅'
    case 'running': return '▶️'
    case 'paused': return '⏸️'
    case 'error': return '❌'
    default: return '❓'
  }
})

const statusText = computed(() => {
  switch (props.status) {
    case 'idle': return '空闲'
    case 'loading': return '加载中'
    case 'ready': return '就绪'
    case 'running': return '运行中'
    case 'paused': return '已暂停'
    case 'error': return '错误'
    default: return '未知状态'
  }
})

const statusBadgeClass = computed(() => {
  return `status-${props.status}`
})

const errorIcon = computed(() => {
  switch (props.errorType) {
    case 'network': return '🌐'
    case 'resource': return '📁'
    case 'emulator': return '🎮'
    case 'validation': return '⚠️'
    case 'timeout': return '⏰'
    default: return '❌'
  }
})

const errorTitle = computed(() => {
  switch (props.errorType) {
    case 'network': return '网络错误'
    case 'resource': return '资源错误'
    case 'emulator': return '模拟器错误'
    case 'validation': return '验证错误'
    case 'timeout': return '超时错误'
    default: return '发生错误'
  }
})

const showDetails = computed(() => {
  return props.errorDetails && props.errorDetails.length > 0
})

const statusInfo = computed(() => {
  return props.status !== 'idle' || props.statusDuration > 0
})

// 方法
const handleRetry = () => {
  emit('retry')
}

const toggleDetails = () => {
  showErrorDetails.value = !showErrorDetails.value
}

const formatDuration = (ms) => {
  if (ms < 1000) {
    return `${ms}ms`
  } else if (ms < 60000) {
    return `${(ms / 1000).toFixed(1)}s`
  } else {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}m ${seconds}s`
  }
}
</script>

<style scoped>
.emulator-status {
  position: relative;
  width: 100%;
  height: 100%;
}

/* 覆盖层通用样式 */
.loading-overlay,
.error-display {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  z-index: 10;
}

/* 加载状态样式 */
.loading-overlay {
  background: rgba(0, 0, 0, 0.8);
}

.loading-content {
  text-align: center;
  color: white;
  padding: 24px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #007bff;
  animation: spin 1s ease-in-out infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-message {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 500;
}

.progress-bar {
  width: 200px;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
  margin: 12px auto 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #007bff, #0056b3);
  transition: width 0.3s ease;
  border-radius: 4px;
}

.progress-text {
  font-size: 14px;
  opacity: 0.8;
  font-weight: 500;
}

/* 错误状态样式 */
.error-display {
  background: rgba(220, 53, 69, 0.1);
  border: 2px dashed #dc3545;
}

.error-content {
  text-align: center;
  color: #dc3545;
  padding: 24px;
  max-width: 400px;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.error-title {
  margin: 0 0 12px 0;
  font-size: 20px;
  font-weight: 600;
}

.error-message {
  margin: 0 0 16px 0;
  color: #721c24;
  font-size: 14px;
  line-height: 1.5;
}

.error-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 16px;
}

.retry-btn,
.details-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.retry-btn {
  background: #ffc107;
  color: #212529;
}

.retry-btn:hover {
  background: #e0a800;
  transform: translateY(-1px);
}

.details-btn {
  background: #6c757d;
  color: white;
}

.details-btn:hover {
  background: #5a6268;
}

.btn-icon {
  font-size: 14px;
}

.btn-text {
  font-size: 14px;
}

.error-details {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 12px;
  margin-top: 12px;
  text-align: left;
}

.error-details pre {
  margin: 0;
  font-size: 12px;
  font-family: 'Courier New', monospace;
  white-space: pre-wrap;
  word-break: break-word;
  color: #666;
}

/* 状态信息样式 */
.status-info {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 5;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.status-badge.status-idle {
  color: #6c757d;
  background: rgba(108, 117, 125, 0.1);
}

.status-badge.status-loading {
  color: #007bff;
  background: rgba(0, 123, 255, 0.1);
}

.status-badge.status-ready {
  color: #28a745;
  background: rgba(40, 167, 69, 0.1);
}

.status-badge.status-running {
  color: #17a2b8;
  background: rgba(23, 162, 184, 0.1);
}

.status-badge.status-paused {
  color: #ffc107;
  background: rgba(255, 193, 7, 0.1);
}

.status-badge.status-error {
  color: #dc3545;
  background: rgba(220, 53, 69, 0.1);
}

.status-icon {
  font-size: 12px;
}

.status-text {
  font-size: 11px;
}

.status-duration {
  font-size: 10px;
  color: #6c757d;
  background: rgba(255, 255, 255, 0.8);
  padding: 2px 6px;
  border-radius: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .loading-content,
  .error-content {
    padding: 16px;
  }
  
  .error-title {
    font-size: 18px;
  }
  
  .error-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .progress-bar {
    width: 150px;
  }
  
  .status-info {
    top: 4px;
    right: 4px;
  }
  
  .status-badge {
    padding: 2px 6px;
    font-size: 10px;
  }
}
</style> 