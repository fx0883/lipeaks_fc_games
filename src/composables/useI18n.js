import { computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { setLanguage, getCurrentLanguageConfig, SUPPORTED_LANGUAGES } from '../i18n'

/**
 * 扩展的国际化组合函数
 * 提供了EmulatorJS语言联动和额外的国际化功能
 */
export function useExtendedI18n() {
  const { locale, t } = useI18n()
  
  // 当前语言配置
  const currentLanguageConfig = computed(() => getCurrentLanguageConfig())
  
  // 是否为RTL语言
  const isRTL = computed(() => currentLanguageConfig.value.rtl)
  
  // 切换语言
  const switchLanguage = (newLocale) => {
    setLanguage(newLocale)
  }
  
  // 获取所有可用语言
  const availableLanguages = computed(() => SUPPORTED_LANGUAGES)
  
  // EmulatorJS语言联动
  const setupEmulatorJSLanguageSync = () => {
    // 监听语言变化
    watch(locale, (newLocale) => {
      updateEmulatorJSLanguage(newLocale)
    }, { immediate: true })
    
    // 监听EmulatorJS语言变化事件
    window.addEventListener('emulatorjs-language-change', handleEmulatorJSLanguageChange)
  }
  
  // 更新EmulatorJS语言
  const updateEmulatorJSLanguage = (locale) => {
    const config = SUPPORTED_LANGUAGES[locale]
    if (!config) return
    
    const emulatorjsLang = config.emulatorjsCode
    
    // 查找所有EmulatorJS实例并更新语言
    const emulatorElements = document.querySelectorAll('[data-emulatorjs]')
    emulatorElements.forEach(element => {
      const emulatorInstance = element._emulatorjs
      if (emulatorInstance && typeof emulatorInstance.setLanguage === 'function') {
        emulatorInstance.setLanguage(emulatorjsLang)
      }
    })
    
    // 通过全局变量设置语言（如果EmulatorJS支持）
    if (window.EJS_language !== emulatorjsLang) {
      window.EJS_language = emulatorjsLang
    }
    
    // 更新EmulatorJS配置中的语言
    if (window.EJS_config) {
      window.EJS_config.language = emulatorjsLang
    }
  }
  
  // 处理EmulatorJS语言变化事件
  const handleEmulatorJSLanguageChange = (event) => {
    const { language } = event.detail
    console.log(`EmulatorJS language changed to: ${language}`)
  }
  
  // 格式化文本（支持插值）
  const formatText = (key, params = {}) => {
    return t(key, params)
  }
  
  // 获取本地化的错误消息
  const getErrorMessage = (errorType, params = {}) => {
    const errorKey = `errors.${errorType}`
    return t(errorKey, params)
  }
  
  // 获取本地化的日期格式
  const formatDate = (date, options = {}) => {
    const locale = currentLanguageConfig.value.code || 'en-US'
    return new Intl.DateTimeFormat(locale, options).format(date)
  }
  
  // 获取本地化的数字格式
  const formatNumber = (number, options = {}) => {
    const locale = currentLanguageConfig.value.code || 'en-US'
    return new Intl.NumberFormat(locale, options).format(number)
  }
  
  // 清理函数
  const cleanup = () => {
    window.removeEventListener('emulatorjs-language-change', handleEmulatorJSLanguageChange)
  }
  
  // 组件挂载时设置
  onMounted(() => {
    setupEmulatorJSLanguageSync()
  })
  
  return {
    // 基础i18n
    t,
    locale,
    
    // 语言配置
    currentLanguageConfig,
    availableLanguages,
    isRTL,
    
    // 语言切换
    switchLanguage,
    
    // 格式化函数
    formatText,
    formatDate,
    formatNumber,
    
    // 错误处理
    getErrorMessage,
    
    // EmulatorJS集成
    updateEmulatorJSLanguage,
    
    // 清理
    cleanup
  }
}

/**
 * 简化的国际化Hook，用于组件中快速使用
 */
export function useQuickI18n() {
  const { t, switchLanguage, currentLanguageConfig, isRTL } = useExtendedI18n()
  
  return {
    t,
    switchLanguage,
    currentLang: currentLanguageConfig,
    isRTL
  }
} 