<template>
  <div class="language-switcher">
    <div class="current-language" @click="toggleDropdown" :class="{ active: showDropdown }">
      <span class="flag">{{ currentLanguageConfig.flag }}</span>
      <span class="name">{{ currentLanguageConfig.nativeName }}</span>
      <span class="arrow" :class="{ rotated: showDropdown }">▼</span>
    </div>
    
    <transition name="dropdown">
      <div v-if="showDropdown" class="language-dropdown" @click.stop>
        <div 
          v-for="(config, locale) in availableLanguages" 
          :key="locale"
          class="language-option"
          :class="{ active: locale === currentLocale }"
          @click="selectLanguage(locale)"
        >
          <span class="flag">{{ config.flag }}</span>
          <div class="language-info">
            <span class="native-name">{{ config.nativeName }}</span>
            <span class="english-name">{{ config.name }}</span>
          </div>
          <span v-if="locale === currentLocale" class="check">✓</span>
        </div>
      </div>
    </transition>
    
    <!-- 点击外部关闭下拉菜单 -->
    <div v-if="showDropdown" class="dropdown-backdrop" @click="closeDropdown"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { SUPPORTED_LANGUAGES, setLanguage, getCurrentLanguageConfig } from '../i18n'

const { locale } = useI18n()
const showDropdown = ref(false)

// 计算属性
const currentLocale = computed(() => locale.value)
const currentLanguageConfig = computed(() => getCurrentLanguageConfig())
const availableLanguages = computed(() => SUPPORTED_LANGUAGES)

// 方法
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const closeDropdown = () => {
  showDropdown.value = false
}

const selectLanguage = (newLocale) => {
  if (newLocale !== currentLocale.value) {
    setLanguage(newLocale)
  }
  closeDropdown()
}

// 键盘事件处理
const handleKeydown = (event) => {
  if (event.key === 'Escape' && showDropdown.value) {
    closeDropdown()
  }
}

// 生命周期
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.language-switcher {
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.current-language {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
  min-width: 120px;
  justify-content: space-between;
}

.current-language:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.current-language.active {
  background: rgba(255, 255, 255, 0.15);
  border-color: var(--color-primary);
}

.flag {
  font-size: 18px;
  line-height: 1;
}

.name {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text);
  flex: 1;
}

.arrow {
  font-size: 12px;
  color: var(--color-text-light);
  transition: transform 0.2s ease;
}

.arrow.rotated {
  transform: rotate(180deg);
}

.language-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 1000;
  backdrop-filter: blur(10px);
}

.language-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid var(--color-border);
}

.language-option:last-child {
  border-bottom: none;
}

.language-option:hover {
  background: var(--color-background-mute);
}

.language-option.active {
  background: rgba(var(--color-primary-rgb), 0.1);
}

.language-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.native-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text);
  line-height: 1.2;
}

.english-name {
  font-size: 12px;
  color: var(--color-text-light);
  line-height: 1.2;
}

.check {
  color: var(--color-primary);
  font-weight: bold;
  font-size: 16px;
}

.dropdown-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}

/* 下拉动画 */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}

/* RTL支持 */
:global(.rtl) .language-switcher {
  direction: rtl;
}

:global(.rtl) .current-language {
  flex-direction: row-reverse;
}

:global(.rtl) .language-dropdown {
  left: auto;
  right: 0;
}

:global(.rtl) .language-option {
  flex-direction: row-reverse;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .current-language {
    min-width: 100px;
    padding: 6px 10px;
  }
  
  .name {
    font-size: 13px;
  }
  
  .flag {
    font-size: 16px;
  }
  
  .language-option {
    padding: 10px 14px;
  }
  
  .native-name {
    font-size: 13px;
  }
  
  .english-name {
    font-size: 11px;
  }
}

/* 深色主题支持 */
@media (prefers-color-scheme: dark) {
  .current-language {
    background: rgba(0, 0, 0, 0.2);
    border-color: rgba(255, 255, 255, 0.1);
  }
  
  .current-language:hover {
    background: rgba(0, 0, 0, 0.3);
    border-color: rgba(255, 255, 255, 0.2);
  }
  
  .language-dropdown {
    background: var(--color-background-soft);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
}
</style> 