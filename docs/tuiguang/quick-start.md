# 快速开始指南

## 🚀 5分钟快速部署

本指南将帮助您在5分钟内快速部署Google Analytics 4和Google Search Console，让您的网站 https://games.espressox.online 被Google收录。

## 第一步：Google Analytics 4 部署 (2分钟)

### 1.1 创建GA4账户
1. 访问 [analytics.google.com](https://analytics.google.com)
2. 点击"开始衡量"
3. 选择"网站" → 填写网站信息 → 创建
4. 复制测量ID (格式: G-XXXXXXXXXX)

### 1.2 快速集成
在项目根目录创建 `.env.production` 文件：
```bash
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

运行构建命令：
```bash
npm run build
```

## 第二步：Google Search Console 部署 (2分钟)

### 2.1 验证网站所有权
1. 访问 [search.google.com/search-console](https://search.google.com/search-console)
2. 添加资源: `https://games.espressox.online`
3. 选择"HTML标签"验证方法
4. 复制验证代码

### 2.2 添加验证代码
在 `index.html` 的 `<head>` 部分添加：
```html
<meta name="google-site-verification" content="您的验证代码" />
```

重新构建和部署：
```bash
npm run build
```

## 第三步：生成网站地图 (1分钟)

### 3.1 自动生成
运行网站地图生成命令：
```bash
npm run build:sitemap
```

### 3.2 提交到GSC
1. 在GSC中进入"网站地图"
2. 添加新的网站地图: `sitemap.xml`
3. 点击"提交"

## ✅ 完成！

现在您的网站已经：
- ✅ 集成了Google Analytics 4
- ✅ 验证了Google Search Console所有权
- ✅ 生成了网站地图
- ✅ 提交了网站地图到Google

## 📊 验证部署

### 检查GA4
1. 访问您的网站
2. 在GA4实时报告中查看数据
3. 等待24-48小时查看完整数据

### 检查GSC
1. 在GSC中查看"覆盖率"报告
2. 检查网站地图状态
3. 等待几天查看索引状态

## 🔄 后续步骤

完成快速部署后，建议继续阅读详细指南：

1. [GA4事件跟踪配置](./ga4-events.md)
2. [GSC搜索优化设置](./gsc-optimization.md)
3. [基础SEO优化建议](./seo-optimization.md)
4. [性能监控和报告](./performance-monitoring.md)

## ⚠️ 注意事项

- 确保网站使用HTTPS
- 验证代码部署后不要删除
- 网站地图会自动更新
- 数据收集需要时间，请耐心等待

## 🆘 遇到问题？

如果遇到问题，请检查：
1. 验证代码是否正确添加
2. 网站是否已重新部署
3. 环境变量是否正确设置
4. 网络连接是否正常

## 📞 技术支持

如需技术支持，请参考：
- [Google Analytics帮助中心](https://support.google.com/analytics/)
- [Google Search Console帮助中心](https://support.google.com/webmasters/)
- 项目文档中的详细指南
