import { createRouter, createWebHistory } from 'vue-router'

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
    meta: { title: '首页 - FC游戏乐园' }
  },
  {
    path: '/game/:id',
    name: 'game',
    component: GameView,
    meta: { title: '游戏 - FC游戏乐园' }
  },
  {
    path: '/category/:id',
    name: 'category',
    component: CategoryView,
    meta: { title: '分类 - FC游戏乐园' }
  },
  {
    path: '/search',
    name: 'search',
    component: SearchView,
    meta: { title: '搜索结果 - FC游戏乐园' }
  },

  {
    path: '/emulator-test',
    redirect: '/emulatorjs-test'
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
    meta: { title: '页面未找到 - FC游戏乐园' }
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 全局前置守卫，用于设置页面标题
router.beforeEach((to, from, next) => {
  // 为搜索页面动态设置标题
  if (to.name === 'search' && to.query.q) {
    document.title = `搜索"${to.query.q}" - FC游戏乐园`
  } else {
    document.title = to.meta.title || 'FC游戏乐园'
  }
  next()
})

export default router 