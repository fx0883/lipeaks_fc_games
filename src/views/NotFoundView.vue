<template>
  <div class="not-found">
    <h1>404</h1>
    <h2>页面未找到</h2>
    <p>抱歉，您访问的页面不存在。</p>
    <router-link to="/" class="home-link">返回首页</router-link>
  </div>
</template>

<style scoped>
.not-found {
  max-width: 600px;
  margin: 100px auto;
  text-align: center;
}

h1 {
  font-size: 6rem;
  margin: 0;
  color: var(--color-primary);
}

h2 {
  margin-top: 0;
}

p {
  margin-bottom: 30px;
  color: var(--color-text-light);
}

.home-link {
  display: inline-block;
  padding: 10px 20px;
  background-color: var(--color-primary);
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.home-link:hover {
  background-color: var(--color-primary-dark);
}
</style> 