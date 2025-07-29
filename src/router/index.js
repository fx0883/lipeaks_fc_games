import { createRouter, createWebHistory } from 'vue-router'
import i18n from '../i18n'

// 导入视图组件
const HomeView = () => import('../views/HomeView.vue')
const GameView = () => import('../views/GameView.vue')
const CategoryView = () => import('../views/CategoryView.vue')
const SearchView = () => import('../views/SearchView.vue')
const NotFoundView = () => import('../views/NotFoundView.vue')


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
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
    meta: { titleKey: 'routes.notFound' }
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 全局前置守卫，用于设置页面标题
router.beforeEach((to, from, next) => {
  const { t } = i18n.global
  
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