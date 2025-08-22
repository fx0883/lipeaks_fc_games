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

## 部署步骤（SPA 流程）

1. 构建项目：
   ```bash
   npm run build
   ```

2. 上传文件：
   - 将 `dist/` 目录下的所有文件上传到服务器
   - 确保 `_redirects` 和 `.htaccess` 文件也被上传

3. 配置服务器：
   - Netlify: 自动识别 `_redirects` 文件
   - Apache: 确保 `.htaccess` 文件在网站根目录
   - Nginx: 使用提供的 `nginx.conf` 配置

## 验证（SPA）
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

---

## Nuxt 3 SSR 在 cPanel（Node.js + Passenger）部署

> 本项目已集成 Nuxt 3（SSR + SEO）。推荐在 cPanel 的 Node.js 环境下运行服务端渲染。

### 1) 准备与环境变量
- cPanel → Setup Node.js App：创建/编辑应用，Node 18+
- 环境变量：
  - `NUXT_PUBLIC_BASE_URL=https://games.espressox.online`

### 2) 安装与构建
```bash
npm ci
npm run nuxt:build
```

### 3) 启动配置（Passenger）
- Application Startup File：`.output/server/index.mjs`
- Document Root（可选静态托管）：指向 `.output/public`
- 启动命令（如需手动）：
```bash
npm run nuxt:start
```

### 4) 缓存与静态资源
- 已在 `nuxt.config.ts` 配置：
  - `/_nuxt/**` 静态资源：`public, max-age=31536000, immutable`
  - `/api/**` 接口：`swr` 缓存（`maxAge: 300`）
- 如需进一步加速，可在 cPanel/服务商层启用 CDN/缓存。

### 5) 验证（SSR）
- `https://games.espressox.online/` 查看源代码应有完整 HTML 内容
- 分类/游戏/搜索页面首屏含数据（SSR 输出）
- `robots.txt`、`sitemap.xml`、`hreflang`、`canonical` 生效

### 6) 常用命令
```bash
# 本地开发（SSR）
npm run nuxt:dev

# 生产构建
npm run nuxt:build

# 生产启动（本地或服务器）
npm run nuxt:start
```