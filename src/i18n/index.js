import { createI18n } from 'vue-i18n'

// 导入语言包
import enUS from './locales/en-US.json'
import zhCN from './locales/zh-CN.json'
import jaJP from './locales/ja-JP.json'
import arAR from './locales/ar-AR.json'

// 支持的语言配置
export const SUPPORTED_LANGUAGES = {
  'en-US': {
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    rtl: false,
    emulatorjsCode: 'en-US'
  },
  'zh-CN': {
    name: 'Chinese (Simplified)',
    nativeName: '简体中文',
    flag: '🇨🇳',
    rtl: false,
    emulatorjsCode: 'zh-CN'
  },
  'ja-JP': {
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    rtl: false,
    emulatorjsCode: 'ja-JA'
  },
  'ar-AR': {
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    rtl: true,
    emulatorjsCode: 'ar-AR'
  }
}

// 浏览器语言检测
function getBrowserLanguage() {
  const browserLang = navigator.language || navigator.userLanguage
  
  // 精确匹配
  if (SUPPORTED_LANGUAGES[browserLang]) {
    return browserLang
  }
  
  // 前缀匹配 (如 en-GB -> en-US)
  const langPrefix = browserLang.split('-')[0]
  const matchedLang = Object.keys(SUPPORTED_LANGUAGES).find(lang => 
    lang.startsWith(langPrefix)
  )
  
  return matchedLang || 'en-US'
}

// 获取初始语言
function getInitialLanguage() {
  // 1. 从localStorage获取用户偏好
  const savedLanguage = localStorage.getItem('fc-game-language')
  if (savedLanguage && SUPPORTED_LANGUAGES[savedLanguage]) {
    return savedLanguage
  }
  
  // 2. 检测浏览器语言
  return getBrowserLanguage()
}

// 语言包映射
const messages = {
  'en-US': enUS,
  'zh-CN': zhCN,
  'ja-JP': jaJP,
  'ar-AR': arAR
}

// 创建i18n实例
const i18n = createI18n({
  legacy: false,
  locale: getInitialLanguage(),
  fallbackLocale: 'en-US',
  messages,
  globalInjection: true,
  missingWarn: false,
  fallbackWarn: false
})

// 语言切换函数
export function setLanguage(locale) {
  if (!SUPPORTED_LANGUAGES[locale]) {
    console.warn(`Unsupported language: ${locale}`)
    return
  }
  
  // 更新i18n语言
  i18n.global.locale.value = locale
  
  // 保存到localStorage
  localStorage.setItem('fc-game-language', locale)
  
  // 更新HTML属性
  updateHtmlAttributes(locale)
  
  // 更新EmulatorJS语言
  updateEmulatorJSLanguage(locale)
}

// 更新HTML属性
function updateHtmlAttributes(locale) {
  const html = document.documentElement
  const config = SUPPORTED_LANGUAGES[locale]
  
  html.setAttribute('lang', locale)
  html.setAttribute('dir', config.rtl ? 'rtl' : 'ltr')
  
  // 更新页面标题的语言
  if (config.rtl) {
    html.classList.add('rtl')
  } else {
    html.classList.remove('rtl')
  }
}

// 更新EmulatorJS语言
function updateEmulatorJSLanguage(locale) {
  const config = SUPPORTED_LANGUAGES[locale]
  const emulatorjsLang = config.emulatorjsCode
  
  // 通过全局事件通知EmulatorJS更新语言
  window.dispatchEvent(new CustomEvent('emulatorjs-language-change', {
    detail: { language: emulatorjsLang }
  }))
}

// 获取当前语言配置
export function getCurrentLanguageConfig() {
  const currentLocale = i18n.global.locale.value
  return SUPPORTED_LANGUAGES[currentLocale]
}

// 初始化HTML属性
updateHtmlAttributes(getInitialLanguage())

export default i18n 