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

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import i18n, { updateHreflangTags } from './i18n'
import App from './App.vue'
import './style.css'
import { initToolbar } from '@stagewise/toolbar'

// 静态文件路径列表，这些路径不应该启动Vue应用
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

// 检查当前路径是否为静态文件
const currentPath = window.location.pathname
if (isStaticPath(currentPath)) {
  // 如果是静态文件路径，不启动Vue应用
  console.log(`Static file path detected: ${currentPath}, skipping Vue app initialization`)
  
  // 设置页面标题
  if (currentPath.includes('sitemap')) {
    document.title = 'Sitemap - Lipeaks FC Games'
  } else if (currentPath.includes('robots')) {
    document.title = 'Robots.txt - Lipeaks FC Games'
  }
  
  // 阻止Vue应用启动
  process.exit = () => {} // 防止process.exit报错
} else {
  // 正常启动Vue应用
  console.log(`Starting Vue app for path: ${currentPath}`)
  
  // 创建应用实例
  const app = createApp(App)

  // 使用Pinia状态管理
  app.use(createPinia())

  // 使用Vue Router
  app.use(router)

  // 使用Vue I18n
  app.use(i18n)

  // 初始化 Stagewise 工具栏 (仅在开发模式)
  if (import.meta.env.DEV) {
    initToolbar({
      plugins: [],
    })
  }

  // 挂载应用
  app.mount('#app')

  // 初始化hreflang标签
  updateHreflangTags()
}
