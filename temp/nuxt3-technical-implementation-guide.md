# Nuxt 3 迁移技术实现指南

## 项目配置

### 1. nuxt.config.ts 配置

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  // 开发模式配置
  devtools: { enabled: true },
  
  // 应用配置
  app: {
    head: {
      title: 'Lipeaks - Play Classic NES & Arcade Games Online Free',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Play hundreds of classic NES and arcade games online for free. No download required.' },
        { name: 'keywords', content: 'classic games, NES games, arcade games, retro gaming, online emulator, free games' },
        { name: 'author', content: 'Lipeaks' },
        { name: 'robots', content: 'index, follow' },
        { name: 'language', content: 'English' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.ico' },
        { rel: 'canonical', href: 'https://games.espressox.online/' }
      ],
      script: [
        // Google Analytics
        {
          src: 'https://www.googletagmanager.com/gtag/js?id=G-MHXR0NTN69',
          async: true
        }
      ]
    }
  },

  // 模块配置
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap'
  ],

  // 国际化配置
  i18n: {
    locales: [
      { code: 'en', iso: 'en-US', name: 'English', file: 'en-US.json' },
      { code: 'zh', iso: 'zh-CN', name: '简体中文', file: 'zh-CN.json' },
      { code: 'ja', iso: 'ja-JP', name: '日本語', file: 'ja-JP.json' },
      { code: 'ar', iso: 'ar-AR', name: 'العربية', file: 'ar-AR.json' }
    ],
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'fc-game-language',
      redirectOn: 'root'
    }
  },

  // Pinia配置
  pinia: {
    autoImports: ['defineStore', 'acceptHMRUpdate']
  },

  // 构建配置
  build: {
    transpile: ['@emulatorjs/core-fbalpha2012_cps2']
  },

  // 运行时配置
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE || 'https://games.espressox.online',
      gtagId: process.env.GTAG_ID || 'G-MHXR0NTN69'
    }
  },

  // 开发服务器配置
  devServer: {
    port: 3000,
    host: '0.0.0.0'
  },

  // 静态资源配置
  nitro: {
    static: {
      maxAge: 31536000 // 1年缓存
    }
  },

  // 实验性功能
  experimental: {
    payloadExtraction: false,
    inlineSSRStyles: false,
    renderJsonPayloads: true
  }
})
```

### 2. TypeScript 配置

```typescript
// tsconfig.json
{
  "extends": "./.nuxt/tsconfig.json",
  "compilerOptions": {
    "strict": true,
    "skipLibCheck": true,
    "types": [
      "@nuxt/types",
      "@pinia/nuxt",
      "@nuxtjs/i18n"
    ]
  }
}
```

## 目录结构迁移

### 3. 目录结构对比

```
# 原Vue项目结构
src/
├── components/
├── views/
├── router/
├── stores/
├── composables/
└── i18n/

# Nuxt 3项目结构
├── components/
├── pages/
├── layouts/
├── stores/
├── composables/
├── middleware/
├── plugins/
├── server/
└── locales/
```

### 4. 页面路由迁移

```vue
<!-- pages/index.vue (原 HomeView.vue) -->
<template>
  <div class="home">
    <!-- 保持原有模板内容 -->
  </div>
</template>

<script setup>
// 使用Nuxt的useHead进行SEO优化
useHead({
  title: 'Lipeaks - Play Classic NES & Arcade Games Online Free',
  meta: [
    { name: 'description', content: 'Play hundreds of classic NES and arcade games online for free.' },
    { property: 'og:title', content: 'Lipeaks - Play Classic NES & Arcade Games Online Free' },
    { property: 'og:description', content: 'Play hundreds of classic NES and arcade games online for free.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://games.espressox.online/' }
  ],
  link: [
    { rel: 'canonical', href: 'https://games.espressox.online/' }
  ]
})

// 服务端数据获取
const { data: categories } = await useFetch('/api/categories')
const { data: popularGames } = await useFetch('/api/games/popular')

// 保持原有的组件逻辑
</script>
```

```vue
<!-- pages/game/[id].vue (原 GameView.vue) -->
<template>
  <div class="game-view">
    <!-- 保持原有模板内容 -->
  </div>
</template>

<script setup>
const route = useRoute()
const { t } = useI18n()

// 动态SEO配置
const { data: game } = await useFetch(`/api/games/${route.params.id}`)

// 动态设置页面SEO
useHead(() => ({
  title: game.value ? `${game.value.name} - Play Online Free | Lipeaks` : 'Game Not Found',
  meta: [
    { name: 'description', content: game.value?.description || 'Play classic retro game online for free.' },
    { property: 'og:title', content: game.value ? `${game.value.name} - Play Online Free | Lipeaks` : 'Game Not Found' },
    { property: 'og:description', content: game.value?.description || 'Play classic retro game online for free.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: game.value?.cover || '/placeholder.png' }
  ],
  link: [
    { rel: 'canonical', href: `https://games.espressox.online/game/${route.params.id}` }
  ]
}))

// 结构化数据
useJsonld(() => ({
  '@context': 'https://schema.org',
  '@type': 'VideoGame',
  name: game.value?.name,
  description: game.value?.description,
  genre: game.value?.category,
  url: `https://games.espressox.online/game/${route.params.id}`,
  image: game.value?.cover,
  publisher: {
    '@type': 'Organization',
    name: 'Lipeaks'
  }
}))
</script>
```

## 状态管理迁移

### 5. Pinia Store 迁移

```typescript
// stores/game.ts
export const useGameStore = defineStore('game', () => {
  // 状态
  const allGames = ref(new Map())
  const categories = ref([])
  const loading = ref(false)
  const currentGame = ref(null)
  const loadedCategories = ref(new Set())
  const searchResults = ref([])
  const searchQuery = ref('')

  // 计算属性
  const getGameById = computed(() => (id: string) => allGames.value.get(id) || null)
  
  const getGamesByCategory = computed(() => (categoryId: string) => {
    return Array.from(allGames.value.values())
      .filter(game => game.category === categoryId || game.platform === categoryId)
  })

  const popularGames = computed(() => {
    const allGamesArray = Array.from(allGames.value.values())
    const fcGames = allGamesArray.filter(game => game.platform === 'fc')
    const arcadeGames = allGamesArray.filter(game => game.platform === 'arcade')
    
    // 随机选择逻辑保持不变
    return shuffleArray([...fcGames.slice(0, 6), ...arcadeGames.slice(0, 3)])
  })

  // 动作
  const fetchCategories = async () => {
    loading.value = true
    try {
      const { data } = await useFetch('/api/categories')
      if (data.value) {
        categories.value = data.value
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      loading.value = false
    }
  }

  const fetchGamesByCategory = async (categoryId: string) => {
    if (loadedCategories.value.has(categoryId)) return
    
    try {
      const { data } = await useFetch(`/api/games/category/${categoryId}`)
      if (data.value) {
        data.value.forEach(game => {
          allGames.value.set(game.id, game)
        })
        loadedCategories.value.add(categoryId)
      }
    } catch (error) {
      console.error(`Failed to fetch games for category ${categoryId}:`, error)
    }
  }

  const searchGames = async (query: string) => {
    searchQuery.value = query
    if (!query.trim()) {
      searchResults.value = []
      return
    }
    
    try {
      const { data } = await useFetch(`/api/games/search?q=${encodeURIComponent(query)}`)
      if (data.value) {
        searchResults.value = data.value
      }
    } catch (error) {
      console.error('Search failed:', error)
      searchResults.value = []
    }
  }

  return {
    // 状态
    allGames: readonly(allGames),
    categories: readonly(categories),
    loading: readonly(loading),
    currentGame: readonly(currentGame),
    searchResults: readonly(searchResults),
    searchQuery: readonly(searchQuery),
    
    // 计算属性
    getGameById,
    getGamesByCategory,
    popularGames,
    
    // 动作
    fetchCategories,
    fetchGamesByCategory,
    searchGames
  }
})
```

## 国际化配置

### 6. Nuxt I18n 配置

```typescript
// plugins/i18n.client.ts
export default defineNuxtPlugin(() => {
  const { locale, locales } = useI18n()
  
  // 监听语言变化
  watch(locale, (newLocale) => {
    // 更新HTML属性
    document.documentElement.lang = newLocale
    document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr'
    
    // 更新localStorage
    localStorage.setItem('fc-game-language', newLocale)
    
    // 更新EmulatorJS语言
    updateEmulatorJSLanguage(newLocale)
  })
})

// 更新EmulatorJS语言的函数
function updateEmulatorJSLanguage(locale: string) {
  const langMap = {
    'en': 'en-US',
    'zh': 'zh-CN',
    'ja': 'ja-JA',
    'ar': 'ar-AR'
  }
  
  const emulatorjsLang = langMap[locale] || 'en-US'
  
  window.dispatchEvent(new CustomEvent('emulatorjs-language-change', {
    detail: { language: emulatorjsLang }
  }))
}
```

## 中间件配置

### 7. 路由中间件

```typescript
// middleware/seo.global.ts
export default defineNuxtRouteMiddleware((to) => {
  // 设置基础SEO标签
  useHead({
    title: 'Lipeaks - Play Classic NES & Arcade Games Online Free',
    meta: [
      { name: 'robots', content: 'index, follow' },
      { name: 'language', content: 'English' }
    ]
  })
  
  // 设置基础结构化数据
  useJsonld({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Lipeaks',
    url: 'https://games.espressox.online/',
    description: 'Play classic NES and arcade games online for free'
  })
})
```

```typescript
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to) => {
  // 检查用户权限
  const user = useUser()
  
  if (to.meta.requiresAuth && !user.value) {
    return navigateTo('/login')
  }
})
```

## 服务端API配置

### 8. 服务端路由

```typescript
// server/api/games/[id].get.ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  try {
    // 从数据库或文件系统获取游戏数据
    const game = await getGameById(id)
    
    if (!game) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Game not found'
      })
    }
    
    return game
  } catch (error) {
    console.error('Failed to fetch game:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
```

```typescript
// server/api/categories.get.ts
export default defineEventHandler(async (event) => {
  try {
    // 获取分类数据
    const categories = await getCategories()
    return categories
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
```

## 性能优化配置

### 9. 图片优化

```vue
<!-- 使用Nuxt Image组件 -->
<template>
  <div class="game-card">
    <NuxtImg
      :src="game.cover"
      :alt="game.name"
      width="300"
      height="200"
      loading="lazy"
      placeholder
      format="webp"
    />
  </div>
</template>
```

### 10. 代码分割配置

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  // 其他配置...
  
  build: {
    transpile: ['@emulatorjs/core-fbalpha2012_cps2']
  },
  
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vue-core': ['vue'],
            'emulator': ['@emulatorjs/core-fbalpha2012_cps2'],
            'utils': ['pinia', 'vue-i18n']
          }
        }
      }
    }
  }
})
```

## 部署配置

### 11. 生产构建配置

```bash
# package.json scripts
{
  "scripts": {
    "build": "nuxt build",
    "preview": "nuxt preview",
    "generate": "nuxt generate",
    "start": "nuxt start"
  }
}
```

### 12. 环境变量配置

```bash
# .env
NUXT_PUBLIC_API_BASE=https://games.espressox.online
NUXT_PUBLIC_GTAG_ID=G-MHXR0NTN69
NUXT_PUBLIC_EMULATOR_CDN=https://cdn.emulatorjs.org
```

## 测试配置

### 13. 单元测试配置

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true
  }
})
```

### 14. E2E测试配置

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    }
  ]
})
```

## 监控和分析

### 15. 性能监控

```typescript
// plugins/analytics.client.ts
export default defineNuxtPlugin(() => {
  const { $gtag } = useNuxtApp()
  
  // 页面性能监控
  if (typeof window !== 'undefined' && 'performance' in window) {
    window.addEventListener('load', () => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      
      $gtag('event', 'timing_complete', {
        name: 'load',
        value: Math.round(perfData.loadEventEnd - perfData.loadEventStart)
      })
    })
  }
})
```

### 16. SEO监控

```typescript
// composables/useSEOMonitoring.ts
export const useSEOMonitoring = () => {
  const trackPageView = (pageData: any) => {
    // 发送页面浏览数据到分析服务
    $gtag('event', 'page_view', {
      page_title: pageData.title,
      page_location: pageData.url,
      page_path: pageData.path
    })
  }
  
  const trackSearch = (query: string) => {
    $gtag('event', 'search', {
      search_term: query
    })
  }
  
  return {
    trackPageView,
    trackSearch
  }
}
```

## 迁移检查清单

### 17. 功能验证清单

- [ ] 页面路由正常工作
- [ ] 游戏加载功能正常
- [ ] 多语言切换正常
- [ ] 搜索功能正常
- [ ] 模拟器功能正常
- [ ] 响应式设计正常
- [ ] SEO标签正确生成
- [ ] 性能指标达标
- [ ] 错误处理正常
- [ ] 数据持久化正常

### 18. SEO验证清单

- [ ] 服务端渲染正常
- [ ] Meta标签正确生成
- [ ] 结构化数据正确
- [ ] 多语言SEO正确
- [ ] Hreflang标签正确
- [ ] Canonical URL正确
- [ ] Open Graph标签正确
- [ ] Twitter Card标签正确
- [ ] 页面加载性能良好
- [ ] 搜索引擎友好

这个技术实现指南提供了完整的Nuxt 3迁移方案，确保在提升SEO的同时保持所有现有功能的完整性。
