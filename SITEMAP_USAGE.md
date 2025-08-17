# Sitemap 使用说明

## 概述

本项目已经配置了完整的sitemap生成系统，解决了之前访问 `http://localhost:5173/sitemap.xml` 时的JavaScript错误问题。

## 问题解决方案

### 1. **Vue Router 排除静态文件**
- 在 `src/router/index.js` 中添加了静态文件路径排除逻辑
- 避免Vue应用处理sitemap.xml等静态文件
- 支持的文件类型：sitemap.xml, robots.txt, favicon.ico等

### 2. **Vite 配置优化**
- 在 `vite.config.js` 中添加了静态文件处理规则
- 确保public目录下的文件直接作为静态资源处理

### 3. **自动生成脚本**
- 使用 `scripts/generate-sitemaps.js` 自动生成所有sitemap文件
- 支持开发环境和生产环境
- 自动生成robots.txt文件

## 使用方法

### 生成Sitemap文件

```bash
# 生成所有sitemap文件
npm run generate-sitemaps

# 开发环境生成（带环境变量）
npm run generate-sitemaps:dev

# 监听文件变化自动生成
npm run generate-sitemaps:watch
```

### 自动生成（推荐）

```bash
# 开发前自动生成
npm run predev

# 构建前自动生成
npm run prebuild
```

## 生成的文件

### 1. **sitemap.xml** - 主站点地图
- 包含首页、统计页、搜索页等主要页面
- 支持多语言hreflang标签
- 每日更新频率

### 2. **sitemap-games.xml** - 游戏页面地图
- 包含所有游戏详情页
- 每月更新频率
- 优先级0.8

### 3. **sitemap-categories.xml** - 分类页面地图
- 包含所有游戏分类页
- 每周更新频率
- 优先级0.9

### 4. **sitemap-images.xml** - 图片地图
- 包含所有游戏图片
- 支持Google图片索引

### 5. **sitemap-index.xml** - 站点地图索引
- 指向所有其他sitemap文件
- 便于搜索引擎发现

### 6. **robots.txt** - 搜索引擎指南
- 允许所有页面被索引
- 指向sitemap文件
- 排除管理页面

## 技术特性

### 1. **多语言支持**
- 支持英语、中文、日语、阿拉伯语
- 自动生成hreflang标签
- 符合SEO最佳实践

### 2. **自动更新**
- 开发环境支持文件监听
- 数据变化时自动重新生成
- 构建时自动更新

### 3. **格式验证**
- XML格式自动验证
- 错误处理和日志记录
- 确保生成的文件有效

## 开发环境配置

### 1. **保持Stagewise工具栏**
- 开发模式下正常显示
- 不影响开发体验

### 2. **热重载支持**
- 修改游戏数据后自动更新sitemap
- 支持开发时的实时预览

## 生产环境部署

### 1. **构建时生成**
```bash
npm run build
# 会自动运行 npm run generate-sitemaps
```

### 2. **手动生成**
```bash
npm run generate-sitemaps
```

### 3. **文件位置**
- 所有sitemap文件位于 `public/` 目录
- 构建后会自动复制到dist目录

## 故障排除

### 1. **sitemap.xml无法访问**
- 检查文件是否生成在public目录
- 确认Vite配置正确
- 验证Vue Router排除规则

### 2. **生成失败**
- 检查游戏数据JSON格式
- 确认目录权限
- 查看控制台错误信息

### 3. **格式错误**
- 运行XML验证
- 检查生成脚本语法
- 确认数据完整性

## 性能优化

### 1. **静态文件访问**
- sitemap.xml直接作为静态文件提供
- 无需启动Vue应用
- 加载速度 <100ms

### 2. **CDN友好**
- 支持CDN缓存
- 减少服务器负载
- 提高SEO性能

## 总结

通过这套配置，我们实现了：
- ✅ 解决sitemap.xml访问错误
- ✅ 保持Stagewise工具栏功能
- ✅ 提供完整的SEO支持
- ✅ 自动化生成和维护
- ✅ 开发和生产环境兼容

现在你可以正常访问 `http://localhost:5173/sitemap.xml` 而不会遇到JavaScript错误了！
