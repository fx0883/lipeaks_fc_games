import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './style.css'
import nesService from './services/nesService'

// 创建应用实例
const app = createApp(App)

// 使用Pinia状态管理
app.use(createPinia())

// 使用Vue Router
app.use(router)

// 挂载应用
app.mount('#app')

// 添加浏览器关闭事件处理
window.addEventListener('beforeunload', () => {
  console.log('浏览器关闭事件触发，释放NES资源')
  nesService.destroy()
})
