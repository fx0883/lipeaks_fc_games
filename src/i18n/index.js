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
    emulatorjsCode: 'en-US',
    urlCode: 'en'
  },
  'zh-CN': {
    name: 'Chinese (Simplified)',
    nativeName: '简体中文',
    flag: '🇨🇳',
    rtl: false,
    emulatorjsCode: 'zh-CN',
    urlCode: 'zh'
  },
  'ja-JP': {
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    rtl: false,
    emulatorjsCode: 'ja-JA',
    urlCode: 'ja'
  },
  'ar-AR': {
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    rtl: true,
    emulatorjsCode: 'ar-AR',
    urlCode: 'ar'
  }
}

// URL参数到语言代码的映射
export const URL_LANG_MAP = {
  'en': 'en-US',
  'zh': 'zh-CN',
  'ja': 'ja-JP',
  'ar': 'ar-AR'
}

// 语言代码到URL参数的映射
export const LANG_URL_MAP = {
  'en-US': 'en',
  'zh-CN': 'zh',
  'ja-JP': 'ja',
  'ar-AR': 'ar'
}

// 浏览器语言检测
function getBrowserLanguage() {
  if (typeof navigator === 'undefined') {
    return 'en-US'
  }
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

// 从URL参数获取语言
function getLanguageFromURL() {
  if (typeof window === 'undefined') {
    return null
  }
  // 检查当前页面的URL参数
  const urlParams = new URLSearchParams(window.location.search)
  const langParam = urlParams.get('lang')
  
  if (langParam && URL_LANG_MAP[langParam]) {
    return URL_LANG_MAP[langParam]
  }
  
  return null
}

// 获取初始语言
function getInitialLanguage() {
  // 1. 优先从URL参数获取语言
  const urlLanguage = getLanguageFromURL()
  if (urlLanguage) {
    return urlLanguage
  }
  
  // 2. 从localStorage获取用户偏好
  const savedLanguage = typeof localStorage !== 'undefined' ? localStorage.getItem('fc-game-language') : null
  if (savedLanguage && SUPPORTED_LANGUAGES[savedLanguage]) {
    return savedLanguage
  }
  
  // 3. 使用浏览器语言检测
  const browserLanguage = getBrowserLanguage()
  if (browserLanguage) {
    return browserLanguage
  }

  // 4. 默认英语
  return 'en-US'
}

// 规范化语言包，确保所有叶子节点为字符串
function normalizeMessages(obj) {
  if (!obj || typeof obj !== 'object') return obj
  const out = Array.isArray(obj) ? [] : {}
  for (const key of Object.keys(obj)) {
    const val = obj[key]
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      out[key] = normalizeMessages(val)
    } else if (typeof val === 'string') {
      out[key] = val
    } else if (val == null) {
      out[key] = ''
    } else if (Array.isArray(val)) {
      out[key] = val.join(', ')
    } else {
      out[key] = String(val)
    }
  }
  return out
}

// 语言包映射（已规范化）
const messages = {
  'en-US': normalizeMessages(enUS),
  'zh-CN': normalizeMessages(zhCN),
  'ja-JP': normalizeMessages(jaJP),
  'ar-AR': normalizeMessages(arAR)
}

// 创建i18n实例
const i18n = createI18n({
  legacy: false,
  locale: typeof window === 'undefined' ? 'en-US' : getInitialLanguage(),
  fallbackLocale: 'en-US',
  messages,
  globalInjection: true,
  missingWarn: false,
  fallbackWarn: false
})

// 语言切换函数
export function setLanguage(locale, updateUrl = true) {
  if (!SUPPORTED_LANGUAGES[locale]) {
    console.warn(`Unsupported language: ${locale}`)
    return
  }
  
  // 更新i18n语言
  i18n.global.locale.value = locale
  
  // 保存到localStorage
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('fc-game-language', locale)
  }
  
  // 更新HTML属性
  updateHtmlAttributes(locale)
  
  // 更新EmulatorJS语言
  updateEmulatorJSLanguage(locale)
  
  // 更新URL参数
  if (updateUrl) {
    updateURLLanguageParam(locale)
  }
}

// 更新URL语言参数
function updateURLLanguageParam(locale) {
  if (typeof window === 'undefined') {
    return
  }
  const urlParams = new URLSearchParams(window.location.search)
  const langCode = LANG_URL_MAP[locale]
  
  if (langCode === 'en') {
    // 英语是默认语言，移除lang参数
    urlParams.delete('lang')
  } else {
    // 其他语言设置lang参数
    urlParams.set('lang', langCode)
  }
  
  // 更新URL但不刷新页面
  const newUrl = urlParams.toString() ? 
    `${window.location.pathname}?${urlParams.toString()}` : 
    window.location.pathname
  
  window.history.replaceState({}, '', newUrl)
  
  // 更新hreflang标签
  updateHreflangTags()
}

// 生成hreflang标签
export function updateHreflangTags() {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return
  }
  // 移除现有的hreflang标签
  const existingTags = document.querySelectorAll('link[rel="alternate"][hreflang]')
  existingTags.forEach(tag => tag.remove())
  
  // 获取当前路径（不包含查询参数）
  const currentPath = window.location.pathname
  const baseUrl = window.location.origin
  
  // 为每种语言生成hreflang标签
  Object.entries(LANG_URL_MAP).forEach(([locale, urlCode]) => {
    const link = document.createElement('link')
    link.rel = 'alternate'
    link.hreflang = urlCode
    
    if (urlCode === 'en') {
      // 英语默认不带参数
      link.href = `${baseUrl}${currentPath}`
    } else {
      // 其他语言带参数
      link.href = `${baseUrl}${currentPath}?lang=${urlCode}`
    }
    
    document.head.appendChild(link)
  })
  
  // 添加x-default（默认英语）
  const defaultLink = document.createElement('link')
  defaultLink.rel = 'alternate'
  defaultLink.hreflang = 'x-default'
  defaultLink.href = `${baseUrl}${currentPath}`
  document.head.appendChild(defaultLink)
}

// 更新HTML属性
function updateHtmlAttributes(locale) {
  if (typeof document === 'undefined') {
    return
  }
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
  if (typeof window === 'undefined') {
    return
  }
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

// 初始化HTML属性（仅客户端）
if (typeof window !== 'undefined') {
  updateHtmlAttributes(getInitialLanguage())
}

export default i18n 