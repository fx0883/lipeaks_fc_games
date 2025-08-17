# Google Search Console (GSC) 设置指南

## 概述

Google Search Console是一个免费工具，帮助您监控网站在Google搜索结果中的表现，并确保网站被正确索引。本指南将帮助您设置GSC并验证网站所有权。

## 第一步：访问Google Search Console

### 1.1 打开GSC
1. 访问 [search.google.com/search-console](https://search.google.com/search-console)
2. 使用您的Google账户登录（建议使用与GA4相同的账户）
3. 如果是首次使用，会看到欢迎页面

## 第二步：添加网站属性

### 2.1 选择属性类型
1. 在GSC欢迎页面，点击"添加资源"
2. 选择"网址前缀"作为属性类型
3. 输入您的网站URL：`https://games.espressox.online`
4. 点击"继续"

### 2.2 选择验证方法
GSC提供多种验证方法，我们推荐使用HTML标签验证：

1. 选择"HTML标签"验证方法
2. 复制提供的HTML标签代码
3. 记录下验证代码（稍后需要添加到网站中）

**示例验证代码**：
```html
<meta name="google-site-verification" content="xxxxxxxxxxxxxxxxxxxxxx" />
```

## 第三步：在网站中添加验证代码

### 3.1 修改index.html
在 `index.html` 文件的 `<head>` 部分添加验证代码：

```html
<!doctype html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Lipeaks FC Games - Play classic FC games online.">
    <meta name="author" content="Lipeaks">
    
    <!-- Google Search Console 验证 -->
    <meta name="google-site-verification" content="xxxxxxxxxxxxxxxxxxxxxx" />
    
    <title>Lipeaks FC Games</title>
    <!-- ... 现有样式 ... -->
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

**注意**: 请将 `xxxxxxxxxxxxxxxxxxxxxx` 替换为您在GSC中获得的实际验证代码。

### 3.2 部署验证代码
1. 保存修改后的 `index.html` 文件
2. 重新构建项目：`npm run build`
3. 部署到生产环境
4. 确保验证代码在 `https://games.espressox.online` 上可见

## 第四步：验证网站所有权

### 4.1 回到GSC验证
1. 在GSC中点击"验证"按钮
2. 系统会检查您的网站是否包含验证代码
3. 如果验证成功，您会看到确认消息

### 4.2 验证失败的处理
如果验证失败，请检查：
- 验证代码是否正确添加到HTML中
- 网站是否已重新部署
- 是否有缓存问题（可以尝试强制刷新）

## 第五步：配置GSC设置

### 5.1 设置首选域名
1. 在GSC中进入"设置" → "域名设置"
2. 设置首选域名为 `https://games.espressox.online`
3. 点击"保存"

### 5.2 配置地理位置目标
1. 在GSC中进入"设置" → "国际定位"
2. 设置目标国家/地区为 `中国`
3. 设置目标语言为 `中文（简体）`

### 5.3 配置用户和权限
1. 在GSC中进入"设置" → "用户和权限"
2. 如果需要，可以添加其他用户并设置权限级别

## 第六步：提交网站地图

### 6.1 生成网站地图
在项目根目录创建 `sitemap.xml` 文件：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://games.espressox.online/</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://games.espressox.online/category/fc</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://games.espressox.online/category/arcade</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://games.espressox.online/search</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>
```

### 6.2 部署网站地图
1. 将 `sitemap.xml` 文件放到 `public/` 目录中
2. 重新构建和部署项目
3. 确保网站地图可以通过 `https://games.espressox.online/sitemap.xml` 访问

### 6.3 在GSC中提交网站地图
1. 在GSC中进入"网站地图"
2. 点击"添加新的网站地图"
3. 输入：`sitemap.xml`
4. 点击"提交"

## 第七步：配置robots.txt

### 7.1 创建robots.txt
在 `public/` 目录中创建 `robots.txt` 文件：

```txt
User-agent: *
Allow: /

# 网站地图位置
Sitemap: https://games.espressox.online/sitemap.xml

# 允许搜索引擎爬取所有页面
Disallow:

# 爬取延迟（可选）
Crawl-delay: 1
```

### 7.2 部署robots.txt
1. 将 `robots.txt` 文件放到 `public/` 目录中
2. 重新构建和部署项目
3. 确保可以通过 `https://games.espressox.online/robots.txt` 访问

## 第八步：测试和验证

### 8.1 测试网站地图
1. 访问 `https://games.espressox.online/sitemap.xml`
2. 确认XML格式正确
3. 检查所有URL是否可访问

### 8.2 测试robots.txt
1. 访问 `https://games.espressox.online/robots.txt`
2. 确认内容正确
3. 使用Google的robots.txt测试工具验证

### 8.3 检查GSC状态
1. 在GSC中查看"覆盖率"报告
2. 检查是否有索引错误
3. 查看"性能"报告中的搜索查询数据

## 第九步：监控和优化

### 9.1 定期检查GSC报告
- **覆盖率**: 检查页面索引状态
- **性能**: 查看搜索查询和点击数据
- **移动设备可用性**: 检查移动端问题
- **核心网页指标**: 监控页面性能

### 9.2 处理索引问题
1. 检查"覆盖率"报告中的错误
2. 修复404错误和重定向问题
3. 确保重要页面被正确索引

## 重要提示

- **验证代码**: 验证完成后不要删除验证代码
- **定期更新**: 定期更新网站地图和robots.txt
- **性能监控**: 关注GSC中的性能报告
- **错误处理**: 及时处理索引错误和问题

## 下一步

完成GSC设置后，请继续阅读：
- [生成和提交网站地图](./sitemap-generation.md)
- [配置搜索优化设置](./gsc-optimization.md)

## 常见问题

### Q: 验证失败怎么办？
A: 检查验证代码是否正确添加，确保网站已重新部署，清除浏览器缓存。

### Q: 网站地图多久更新一次？
A: 建议每周更新一次，或者在内容有重大变化时更新。

### Q: 需要等待多久才能看到数据？
A: 通常需要几天到几周时间，Google才能完全索引您的网站。
