<template>
  <footer class="app-footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>关于我们</h3>
          <p>FC游戏乐园是一个怀旧FC游戏在线平台，让您重温经典游戏的乐趣。</p>
        </div>
        
        <div class="footer-section">
          <h3>快速链接</h3>
          <ul>
            <li><router-link to="/">首页</router-link></li>
            <li><router-link to="/category/action">动作游戏</router-link></li>
            <li><router-link to="/category/adventure">冒险游戏</router-link></li>
            <li><router-link to="/category/puzzle">益智游戏</router-link></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h3>联系我们</h3>
          <p>邮箱：contact@fcgame.com</p>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} FC游戏乐园. 保留所有权利.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.app-footer {
  background-color: var(--color-background-soft);
  padding: 40px 0 20px;
  margin-top: 60px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  margin-bottom: 30px;
}

.footer-section h3 {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 1.2rem;
}

.footer-section p {
  margin: 0;
  color: var(--color-text-light);
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section li {
  margin-bottom: 10px;
}

.footer-section a {
  color: var(--color-text-light);
  text-decoration: none;
}

.footer-section a:hover {
  color: var(--color-primary);
}

.footer-bottom {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid var(--color-border);
  color: var(--color-text-light);
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
  }
}
</style> 