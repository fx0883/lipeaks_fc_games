<!--
  Lipeaks FC Games - 访客统计组件
  Copyright (C) 2024 Lipeaks
-->
<template>
  <div class="visitor-stats">
    <!-- 紧凑模式 -->
    <div v-if="compact" class="stats-compact">
      <div class="stat-item">
        <span class="stat-icon">👥</span>
        <span class="stat-value">{{ formattedTotalVisitors }}</span>
        <span class="stat-label">{{ $t('stats.totalVisitors') }}</span>
      </div>
    </div>
    
    <!-- 完整模式 -->
    <div v-else class="stats-full">
      <div class="stats-header">
        <h4 class="stats-title">
          <span class="title-icon">📊</span>
          {{ $t('stats.visitorStatistics') }}
        </h4>
        <div class="stats-trend" :class="trendClass">
          <span class="trend-icon">{{ trendIcon }}</span>
        </div>
      </div>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <div class="stat-value">{{ formattedTotalVisitors }}</div>
            <div class="stat-label">{{ $t('stats.totalVisitors') }}</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">📅</div>
          <div class="stat-content">
            <div class="stat-value">{{ formattedTodayVisitors }}</div>
            <div class="stat-label">{{ $t('stats.todayVisitors') }}</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">🕒</div>
          <div class="stat-content">
            <div class="stat-value">{{ formattedYesterdayVisitors }}</div>
            <div class="stat-label">{{ $t('stats.yesterdayVisitors') }}</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">⏰</div>
          <div class="stat-content">
            <div class="stat-value">{{ getDaysOnline }}</div>
            <div class="stat-label">{{ $t('stats.daysOnline') }}</div>
          </div>
        </div>
      </div>
      
      <!-- 新访客提示 -->
      <div v-if="isNewVisitor && showWelcome" class="welcome-message">
        <span class="welcome-icon">🎉</span>
        <span class="welcome-text">{{ $t('stats.welcomeNewVisitor') }}</span>
        <button @click="showWelcome = false" class="welcome-close">×</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useVisitorStats } from '../composables/useVisitorStats'

// Props
const props = defineProps({
  compact: {
    type: Boolean,
    default: false
  },
  showTrend: {
    type: Boolean,
    default: true
  }
})

// 使用访客统计
const {
  totalVisitors,
  todayVisitors,
  yesterdayVisitors,
  isNewVisitor,
  formattedTotalVisitors,
  formattedTodayVisitors,
  formattedYesterdayVisitors,
  getDaysOnline,
  getVisitTrend
} = useVisitorStats()

// 本地状态
const showWelcome = ref(true)

// 趋势样式和图标
const trendClass = computed(() => {
  if (!props.showTrend) return ''
  return `trend-${getVisitTrend.value}`
})

const trendIcon = computed(() => {
  if (!props.showTrend) return ''
  switch (getVisitTrend.value) {
    case 'up': return '📈'
    case 'down': return '📉'
    case 'stable': return '➡️'
    case 'new': return '✨'
    default: return '📊'
  }
})
</script>

<style scoped>
.visitor-stats {
  width: 100%;
  font-family: var(--font-family);
}

/* 紧凑模式样式 */
.stats-compact {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: var(--color-background-soft);
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
}

.stats-compact .stat-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.85rem;
}

.stats-compact .stat-icon {
  font-size: 1rem;
}

.stats-compact .stat-value {
  font-weight: 600;
  color: var(--color-primary);
}

.stats-compact .stat-label {
  color: var(--color-text-light);
}

/* 完整模式样式 */
.stats-full {
  background: var(--color-background);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--color-border);
  overflow: hidden;
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--color-background-soft);
  border-bottom: 1px solid var(--color-border);
}

.stats-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text);
}

.title-icon {
  font-size: 1.2rem;
}

.stats-trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: var(--border-radius);
  font-size: 0.9rem;
  font-weight: 500;
}

.trend-up {
  background: #dcfce7;
  color: #16a34a;
}

.trend-down {
  background: #fef2f2;
  color: #dc2626;
}

.trend-stable {
  background: #f1f5f9;
  color: #64748b;
}

.trend-new {
  background: #fef3c7;
  color: #d97706;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--color-background-soft);
  border-radius: var(--border-radius);
  transition: all var(--transition-normal);
}

.stat-card:hover {
  background: var(--color-background-mute);
  transform: translateY(-2px);
}

.stat-card .stat-icon {
  font-size: 1.5rem;
  opacity: 0.8;
}

.stat-content {
  flex: 1;
  min-width: 0;
}

.stat-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1.2;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--color-text-light);
  margin-top: 0.1rem;
}

/* 欢迎消息 */
.welcome-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 1rem 1rem;
  padding: 0.75rem;
  background: linear-gradient(135deg, #fef3c7, #fbbf24);
  border-radius: var(--border-radius);
  font-size: 0.9rem;
  font-weight: 500;
  color: #92400e;
  animation: slideIn 0.3s ease-out;
}

.welcome-icon {
  font-size: 1.1rem;
}

.welcome-text {
  flex: 1;
}

.welcome-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  font-weight: bold;
  color: #92400e;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: var(--border-radius);
  transition: background-color var(--transition-normal);
}

.welcome-close:hover {
  background: rgba(146, 64, 14, 0.1);
}

/* 动画 */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
    padding: 0.75rem;
  }
  
  .stat-card {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
    padding: 0.5rem;
  }
  
  .stat-card .stat-icon {
    font-size: 1.2rem;
  }
  
  .stat-value {
    font-size: 1rem;
  }
  
  .stat-label {
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .stats-header {
    padding: 0.75rem;
  }
  
  .stats-title {
    font-size: 1rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 0.5rem;
    padding: 0.5rem;
  }
  
  .welcome-message {
    margin: 0 0.5rem 0.5rem;
    padding: 0.5rem;
    font-size: 0.8rem;
  }
}
</style>