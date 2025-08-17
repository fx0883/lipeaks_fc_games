# 在网站中集成GA4跟踪代码

## 概述

本指南将帮助您在Vue.js网站中集成Google Analytics 4跟踪代码。我们将使用Vue 3的组合式API和Vue Router来实现页面浏览跟踪和自定义事件跟踪。

## 第一步：创建GA4服务文件

### 1.1 创建GA4服务
在 `src/services/` 目录下创建 `GoogleAnalytics.js` 文件：

```javascript
// src/services/GoogleAnalytics.js
class GoogleAnalytics {
  constructor() {
    this.measurementId = null;
    this.isInitialized = false;
  }

  // 初始化GA4
  init(measurementId) {
    if (this.isInitialized) return;
    
    this.measurementId = measurementId;
    
    // 加载GA4脚本
    this.loadScript();
    
    // 初始化数据层
    window.dataLayer = window.dataLayer || [];
    
    // 配置GA4
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };
    
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      page_title: document.title,
      page_location: window.location.href,
      send_page_view: false // 我们手动发送页面浏览事件
    });
    
    this.isInitialized = true;
    console.log('GA4 initialized with ID:', measurementId);
  }

  // 加载GA4脚本
  loadScript() {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
    document.head.appendChild(script);
  }

  // 发送页面浏览事件
  pageview(pagePath, pageTitle) {
    if (!this.isInitialized) return;
    
    window.gtag('config', this.measurementId, {
      page_path: pagePath,
      page_title: pageTitle,
      send_page_view: true
    });
    
    console.log('GA4 pageview sent:', { pagePath, pageTitle });
  }

  // 发送自定义事件
  event(eventName, parameters = {}) {
    if (!this.isInitialized) return;
    
    window.gtag('event', eventName, parameters);
    console.log('GA4 event sent:', eventName, parameters);
  }

  // 游戏相关事件
  trackGameStart(gameName, category) {
    this.event('game_start', {
      game_name: gameName,
      game_category: category,
      event_category: 'Games',
      event_label: gameName
    });
  }

  trackGameComplete(gameName, category, playTime) {
    this.event('game_complete', {
      game_name: gameName,
      game_category: category,
      play_time: playTime,
      event_category: 'Games',
      event_label: gameName
    });
  }

  // 搜索事件
  trackSearch(searchTerm, resultsCount) {
    this.event('search', {
      search_term: searchTerm,
      results_count: resultsCount,
      event_category: 'Search',
      event_label: searchTerm
    });
  }

  // 分类浏览事件
  trackCategoryView(categoryName, subCategory = null) {
    this.event('category_view', {
      category_name: categoryName,
      sub_category: subCategory,
      event_category: 'Navigation',
      event_label: categoryName
    });
  }
}

// 创建单例实例
const googleAnalytics = new GoogleAnalytics();
export default googleAnalytics;
```

## 第二步：配置环境变量

### 2.1 创建环境配置文件
在项目根目录创建 `.env` 文件：

```bash
# .env
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 2.2 创建生产环境配置
创建 `.env.production` 文件：

```bash
# .env.production
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

**注意**: 请将 `G-XXXXXXXXXX` 替换为您在GA4设置中获得的实际测量ID。

## 第三步：在主应用中初始化GA4

### 3.1 修改main.js
更新 `src/main.js` 文件：

```javascript
// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import i18n from './i18n'
import App from './App.vue'
import './style.css'
import googleAnalytics from './services/GoogleAnalytics'

// 创建应用实例
const app = createApp(App)

// 使用Pinia状态管理
app.use(createPinia())

// 使用Vue Router
app.use(router)

// 使用Vue I18n
app.use(i18n)

// 初始化GA4
const ga4Id = import.meta.env.VITE_GA4_MEASUREMENT_ID
if (ga4Id) {
  googleAnalytics.init(ga4Id)
  
  // 路由变化时发送页面浏览事件
  router.afterEach((to) => {
    googleAnalytics.pageview(to.path, to.meta.title || document.title)
  })
}

// 挂载应用
app.mount('#app')
```

## 第四步：在组件中使用GA4

### 4.1 在游戏组件中跟踪事件
更新 `src/components/FCEmulator.vue`：

```vue
<!-- 在script setup部分添加 -->
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import googleAnalytics from '../services/GoogleAnalytics'

// ... 现有代码 ...

// 游戏开始事件
const handleGameStart = () => {
  googleAnalytics.trackGameStart(props.gameName, props.category)
  // ... 现有游戏开始逻辑 ...
}

// 游戏完成事件
const handleGameComplete = (playTime) => {
  googleAnalytics.trackGameComplete(props.gameName, props.category, playTime)
  // ... 现有游戏完成逻辑 ...
}

// ... 现有代码 ...
</script>
```

### 4.2 在搜索组件中跟踪事件
更新 `src/components/AppHeader.vue`：

```vue
<!-- 在script setup部分添加 -->
<script setup>
import googleAnalytics from '../services/GoogleAnalytics'

// ... 现有代码 ...

// 搜索事件
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    // 模拟搜索结果数量（实际项目中应该从API获取）
    const resultsCount = 10
    googleAnalytics.trackSearch(searchQuery.value, resultsCount)
    
    // ... 现有搜索逻辑 ...
  }
}

// ... 现有代码 ...
</script>
```

## 第五步：添加隐私政策组件

### 5.1 创建Cookie同意组件
创建 `src/components/CookieConsent.vue`：

```vue
<template>
  <div v-if="showConsent" class="cookie-consent">
    <div class="cookie-content">
      <p>
        我们使用Cookie来改善您的浏览体验和分析网站流量。
        继续使用本网站即表示您同意我们的Cookie政策。
      </p>
      <div class="cookie-actions">
        <button @click="acceptCookies" class="btn-accept">接受</button>
        <button @click="rejectCookies" class="btn-reject">拒绝</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import googleAnalytics from '../services/GoogleAnalytics'

const showConsent = ref(false)

onMounted(() => {
  const consent = localStorage.getItem('cookie-consent')
  if (!consent) {
    showConsent.value = true
  }
})

const acceptCookies = () => {
  localStorage.setItem('cookie-consent', 'accepted')
  showConsent.value = false
  
  // 重新初始化GA4
  const ga4Id = import.meta.env.VITE_GA4_MEASUREMENT_ID
  if (ga4Id) {
    googleAnalytics.init(ga4Id)
  }
  
  // 发送同意事件
  googleAnalytics.event('cookie_consent', {
    consent_status: 'accepted',
    event_category: 'Privacy'
  })
}

const rejectCookies = () => {
  localStorage.setItem('cookie-consent', 'rejected')
  showConsent.value = false
  
  // 发送拒绝事件
  googleAnalytics.event('cookie_consent', {
    consent_status: 'rejected',
    event_category: 'Privacy'
  })
}
</script>

<style scoped>
.cookie-consent {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 1rem;
  z-index: 1000;
}

.cookie-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.cookie-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-accept, .btn-reject {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-accept {
  background: #4CAF50;
  color: white;
}

.btn-reject {
  background: #f44336;
  color: white;
}
</style>
```

### 5.2 在App.vue中添加Cookie同意组件
更新 `src/App.vue`：

```vue
<template>
  <div class="app-container">
    <AppHeader />
    
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <AppFooter />
    <CookieConsent />
    
    <!-- 仅在开发环境中显示stagewise工具栏 -->
    <StagewiseToolbar v-if="isDev" :config="stagwiseConfig" />
  </div>
</template>

<script setup>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import CookieConsent from './components/CookieConsent.vue'
import { StagewiseToolbar } from '@stagewise/toolbar-vue'
import VuePlugin from '@stagewise-plugins/vue'

// ... 现有代码 ...
</script>
```

## 第六步：测试和验证

### 6.1 本地测试
1. 启动开发服务器：`npm run dev`
2. 打开浏览器开发者工具
3. 查看Console中是否有GA4初始化成功的消息
4. 检查Network标签页中是否有对Google Analytics的请求

### 6.2 生产环境测试
1. 构建项目：`npm run build`
2. 部署到生产环境
3. 访问网站并检查GA4是否正常工作
4. 在GA4实时报告中查看数据

## 第七步：配置GA4事件

### 7.1 在GA4中创建自定义事件
1. 登录GA4
2. 进入"配置" → "事件"
3. 创建以下自定义事件：
   - `game_start`
   - `game_complete`
   - `search`
   - `category_view`
   - `cookie_consent`

### 7.2 配置转化目标
1. 在GA4中进入"配置" → "转化"
2. 添加以下转化事件：
   - `game_start` (游戏开始)
   - `search` (搜索行为)

## 重要提示

- **隐私合规**: 确保遵守GDPR等隐私法规
- **Cookie同意**: 在用户同意前不要收集数据
- **数据准确性**: 定期检查GA4数据是否准确
- **性能影响**: GA4脚本对网站性能影响很小

## 下一步

完成GA4集成后，请继续阅读：
- [配置事件跟踪和转化目标](./ga4-events.md)
- [Google Search Console设置指南](./gsc-setup.md)

## 常见问题

### Q: 为什么在本地开发环境中看不到GA4数据？
A: GA4通常只收集生产环境的数据。您可以使用GA4的调试模式来测试。

### Q: 如何验证GA4是否正常工作？
A: 使用浏览器开发者工具检查是否有对Google Analytics的请求，或在GA4实时报告中查看数据。

### Q: 可以禁用开发环境的GA4吗？
A: 是的，可以在环境变量中配置，只在生产环境启用GA4。
