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