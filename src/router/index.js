// Lipeaks FC Games
// Copyright (C) 2024 Lipeaks
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { createRouter, createWebHistory } from 'vue-router'
import i18n, { setLanguage, URL_LANG_MAP } from '../i18n'

// 导入视图组件
const HomeView = () => import('../views/HomeView.vue')
const GameView = () => import('../views/GameView.vue')
const CategoryView = () => import('../views/CategoryView.vue')
const SearchView = () => import('../views/SearchView.vue')
const StatsView = () => import('../views/StatsView.vue')
const NotFoundView = () => import('../views/NotFoundView.vue')

// 静态文件路径列表，这些路径不应该被Vue Router处理
const STATIC_PATHS = [
  '/sitemap.xml',
  '/sitemap-index.xml',
  '/sitemap-games.xml',
  '/sitemap-categories.xml',
  '/sitemap-content.xml',
  '/sitemap-images.xml',
  '/robots.txt',
  '/favicon.ico',
  '/404.html'
]

// 检查是否为静态文件路径
function isStaticPath(path) {
  return STATIC_PATHS.some(staticPath => path.startsWith(staticPath))
}

// 路由配置
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { titleKey: 'routes.home' }
  },
  {
    path: '/game/:id',
    name: 'game',
    component: GameView,
    meta: { titleKey: 'routes.game' }
  },
  {
    path: '/category/:id',
    name: 'category',
    component: CategoryView,
    meta: { titleKey: 'routes.category' }
  },
  {
    path: '/search',
    name: 'search',
    component: SearchView,
    meta: { titleKey: 'routes.search' }
  },
  {
    path: '/stats',
    name: 'stats',
    component: StatsView,
    meta: { titleKey: 'routes.stats' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
    meta: { titleKey: 'routes.notFound' },
    // 添加beforeEnter守卫，排除静态文件路径
    beforeEnter: (to, from, next) => {
      if (isStaticPath(to.path)) {
        // 如果是静态文件路径，不进行路由处理
        next(false)
        return
      }
      next()
    }
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 全局前置守卫，用于语言检测和页面标题设置
router.beforeEach((to, from, next) => {
  // 检查是否为静态文件路径
  if (isStaticPath(to.path)) {
    // 静态文件路径不进行Vue应用处理
    next(false)
    return
  }

  const { t } = i18n.global
  
  // 检查URL语言参数
  const langParam = to.query.lang
  if (langParam && URL_LANG_MAP[langParam]) {
    // 如果URL有有效的语言参数，切换语言但不更新URL（避免无限循环）
    const targetLanguage = URL_LANG_MAP[langParam]
    if (i18n.global.locale.value !== targetLanguage) {
      setLanguage(targetLanguage, false) // false表示不更新URL
    }
  }
  
  // 为搜索页面动态设置标题
  if (to.name === 'search' && to.query.q) {
    document.title = t('routes.searchWithQuery', { query: to.query.q })
  } else if (to.meta.titleKey) {
    document.title = t(to.meta.titleKey)
  } else {
    document.title = t('app.title')
  }
  
  next()
})

export default router 