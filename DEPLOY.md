# 部署说明

## 问题描述
当使用Vue Router的History模式时，直接访问游戏页面URL（如 `/game/fc-101-emocheng1-renwukulouban`）会出现404错误，而首页可以正常访问。

## 原因分析
- Vue Router使用History API模式 (`createWebHistory()`)
- 首页 `/` 对应物理文件 `index.html`，可以直接访问
- 游戏页面 `/game/xxx` 不是物理路径，服务器找不到对应文件
- 需要配置服务器将所有不存在的路径重定向到 `index.html`，让Vue Router处理路由

## 解决方案

### 1. Netlify 部署
项目已包含 `public/_redirects` 文件：
```
# Netlify redirects for Vue Router history mode
/*    /index.html   200
```

### 2. Apache 服务器
项目已包含 `public/.htaccess` 文件：
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### 3. Nginx 服务器
使用提供的 `nginx.conf` 配置，关键部分：
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

## 部署步骤

1. **构建项目**：
   ```bash
   npm run build
   ```

2. **上传文件**：
   - 将 `dist/` 目录下的所有文件上传到服务器
   - 确保 `_redirects` 和 `.htaccess` 文件也被上传

3. **配置服务器**：
   - **Netlify**: 自动识别 `_redirects` 文件
   - **Apache**: 确保 `.htaccess` 文件在网站根目录
   - **Nginx**: 使用提供的 `nginx.conf` 配置

## 验证
部署完成后，应该可以直接访问：
- 首页: `https://games.espressox.online/`
- 游戏页面: `https://games.espressox.online/game/fc-101-emocheng1-renwukulouban`
- 分类页面: `https://games.espressox.online/category/fc-action`

## 注意事项
- 确保服务器支持EmulatorJS所需的CORS头：
  - `Cross-Origin-Embedder-Policy: credentialless`
  - `Cross-Origin-Opener-Policy: same-origin`
- ROM文件和数据文件路径要正确
- 检查游戏数据文件是否正确上传到 `/data/games/` 目录