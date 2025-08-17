# 动态网站地图生成和提交指南

## 概述

网站地图（Sitemap）是帮助搜索引擎发现和索引您网站页面的重要工具。本指南将帮助您为Vue.js游戏网站创建动态网站地图，并自动提交到Google Search Console。

## 第一步：创建动态网站地图生成器

### 1.1 创建网站地图服务
在 `src/services/` 目录下创建 `SitemapGenerator.js` 文件：

```javascript
// src/services/SitemapGenerator.js
class SitemapGenerator {
  constructor() {
    this.baseUrl = 'https://games.espressox.online'
    this.categories = [
      { id: 'fc', name: 'FC游戏', priority: 0.8, changefreq: 'weekly' },
      { id: 'arcade', name: '街机游戏', priority: 0.8, changefreq: 'weekly' },
      { id: 'arcade2', name: '街机游戏2', priority: 0.8, changefreq: 'weekly' }
    ]
  }

  // 生成静态页面URL
  generateStaticUrls() {
    return [
      {
        loc: '/',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'daily',
        priority: 1.0
      },
      {
        loc: '/search',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: 0.6
      }
    ]
  }

  // 生成分类页面URL
  generateCategoryUrls() {
    return this.categories.map(category => ({
      loc: `/category/${category.id}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: category.changefreq,
      priority: category.priority
    }))
  }

  // 生成游戏页面URL（基于游戏数据）
  generateGameUrls(gamesData) {
    const gameUrls = []
    
    // FC游戏
    if (gamesData.fc && gamesData.fc.games) {
      gamesData.fc.games.forEach(game => {
        gameUrls.push({
          loc: `/game/${game.id}`,
          lastmod: new Date().toISOString().split('T')[0],
          changefreq: 'monthly',
          priority: 0.7
        })
      })
    }
    
    // 街机游戏
    if (gamesData.arcade && gamesData.arcade.games) {
      gamesData.arcade.games.forEach(game => {
        gameUrls.push({
          loc: `/game/${game.id}`,
          lastmod: new Date().toISOString().split('T')[0],
          changefreq: 'monthly',
          priority: 0.7
        })
      })
    }
    
    return gameUrls
  }

  // 生成完整的网站地图XML
  generateSitemapXml(gamesData = null) {
    const urls = [
      ...this.generateStaticUrls(),
      ...this.generateCategoryUrls(),
      ...(gamesData ? this.generateGameUrls(gamesData) : [])
    ]

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${this.baseUrl}${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`

    return xml
  }

  // 生成网站地图索引（如果页面数量超过50000）
  generateSitemapIndex(sitemaps) {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map(sitemap => `  <sitemap>
    <loc>${this.baseUrl}${sitemap.loc}</loc>
    <lastmod>${sitemap.lastmod}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`

    return xml
  }
}

export default SitemapGenerator
```

### 1.2 创建网站地图构建脚本
在项目根目录创建 `scripts/` 目录，并添加 `build-sitemap.js` 文件：

```javascript
// scripts/build-sitemap.js
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import SitemapGenerator from '../src/services/SitemapGenerator.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 读取游戏数据
function loadGamesData() {
  try {
    const fcGames = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/data/games/fc.json'), 'utf8'))
    const arcadeGames = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/data/games/arcade.json'), 'utf8'))
    const arcade2Games = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/data/games/arcade2.json'), 'utf8'))
    
    return {
      fc: fcGames,
      arcade: arcadeGames,
      arcade2: arcade2Games
    }
  } catch (error) {
    console.warn('无法加载游戏数据，将生成基础网站地图:', error.message)
    return null
  }
}

// 生成网站地图
function generateSitemap() {
  const generator = new SitemapGenerator()
  const gamesData = loadGamesData()
  
  // 生成主网站地图
  const sitemapXml = generator.generateSitemapXml(gamesData)
  const sitemapPath = path.join(__dirname, '../public/sitemap.xml')
  
  fs.writeFileSync(sitemapPath, sitemapXml, 'utf8')
  console.log('✅ 网站地图已生成:', sitemapPath)
  
  // 生成robots.txt
  const robotsTxt = `User-agent: *
Allow: /

# 网站地图位置
Sitemap: ${generator.baseUrl}/sitemap.xml

# 允许搜索引擎爬取所有页面
Disallow:

# 爬取延迟（可选）
Crawl-delay: 1`
  
  const robotsPath = path.join(__dirname, '../public/robots.txt')
  fs.writeFileSync(robotsPath, robotsTxt, 'utf8')
  console.log('✅ robots.txt已生成:', robotsPath)
  
  // 输出统计信息
  const urlCount = sitemapXml.match(/<url>/g)?.length || 0
  console.log(`📊 网站地图包含 ${urlCount} 个URL`)
}

// 运行生成器
generateSitemap()
```

## 第二步：配置构建脚本

### 2.1 更新package.json
在 `package.json` 中添加构建网站地图的脚本：

```json
{
  "name": "vue-lipeaks-game",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "license": "GPL-3.0-or-later",
  "scripts": {
    "dev": "vite",
    "build": "npm run build:sitemap && vite build",
    "build:sitemap": "node scripts/build-sitemap.js",
    "preview": "vite preview"
  },
  "dependencies": {
    "@emulatorjs/core-fbalpha2012_cps2": "^4.2.3",
    "pinia": "^3.0.3",
    "vue": "^3.5.17",
    "vue-i18n": "^9.9.1",
    "vue-router": "^4.5.1"
  },
  "devDependencies": {
    "@stagewise-plugins/vue": "^0.6.2",
    "@stagewise/toolbar-vue": "^0.6.2",
    "@vitejs/plugin-vue": "^6.0.0",
    "vite": "^7.0.4"
  }
}
```

### 2.2 创建网站地图配置文件
在项目根目录创建 `sitemap.config.js` 文件：

```javascript
// sitemap.config.js
export default {
  // 网站基础信息
  site: {
    baseUrl: 'https://games.espressox.online',
    name: 'Lipeaks FC Games',
    description: '经典FC游戏和街机游戏在线平台'
  },
  
  // 网站地图配置
  sitemap: {
    // 静态页面
    staticPages: [
      { path: '/', priority: 1.0, changefreq: 'daily' },
      { path: '/search', priority: 0.6, changefreq: 'weekly' },
      { path: '/about', priority: 0.5, changefreq: 'monthly' }
    ],
    
    // 分类页面
    categories: [
      { id: 'fc', name: 'FC游戏', priority: 0.8, changefreq: 'weekly' },
      { id: 'arcade', name: '街机游戏', priority: 0.8, changefreq: 'weekly' },
      { id: 'arcade2', name: '街机游戏2', priority: 0.8, changefreq: 'weekly' }
    ],
    
    // 游戏页面配置
    games: {
      priority: 0.7,
      changefreq: 'monthly',
      maxGames: 1000 // 限制游戏页面数量，避免网站地图过大
    }
  },
  
  // 搜索引擎配置
  searchEngines: {
    google: {
      submitUrl: 'https://www.google.com/ping?sitemap=',
      autoSubmit: true
    },
    bing: {
      submitUrl: 'https://www.bing.com/ping?sitemap=',
      autoSubmit: false
    }
  }
}
```

## 第三步：创建自动提交服务

### 3.1 创建搜索引擎提交服务
在 `src/services/` 目录下创建 `SearchEngineSubmitter.js` 文件：

```javascript
// src/services/SearchEngineSubmitter.js
class SearchEngineSubmitter {
  constructor() {
    this.baseUrl = 'https://games.espressox.online'
    this.sitemapUrl = `${this.baseUrl}/sitemap.xml`
  }

  // 提交到Google
  async submitToGoogle() {
    try {
      const response = await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(this.sitemapUrl)}`)
      
      if (response.ok) {
        console.log('✅ 网站地图已提交到Google')
        return true
      } else {
        console.error('❌ 提交到Google失败:', response.status)
        return false
      }
    } catch (error) {
      console.error('❌ 提交到Google时出错:', error)
      return false
    }
  }

  // 提交到Bing
  async submitToBing() {
    try {
      const response = await fetch(`https://www.bing.com/ping?sitemap=${encodeURIComponent(this.sitemapUrl)}`)
      
      if (response.ok) {
        console.log('✅ 网站地图已提交到Bing')
        return true
      } else {
        console.error('❌ 提交到Bing失败:', response.status)
        return false
      }
    } catch (error) {
      console.error('❌ 提交到Bing时出错:', error)
      return false
    }
  }

  // 提交到所有搜索引擎
  async submitToAll() {
    console.log('🚀 开始提交网站地图到搜索引擎...')
    
    const results = {
      google: await this.submitToGoogle(),
      bing: await this.submitToBing()
    }
    
    const successCount = Object.values(results).filter(Boolean).length
    console.log(`📊 提交完成: ${successCount}/${Object.keys(results).length} 成功`)
    
    return results
  }
}

export default SearchEngineSubmitter
```

### 3.2 创建自动提交脚本
在 `scripts/` 目录下创建 `submit-sitemap.js` 文件：

```javascript
// scripts/submit-sitemap.js
import SearchEngineSubmitter from '../src/services/SearchEngineSubmitter.js'

async function submitSitemap() {
  console.log('🚀 开始提交网站地图...')
  
  const submitter = new SearchEngineSubmitter()
  const results = await submitter.submitToAll()
  
  // 输出结果
  console.log('\n📊 提交结果:')
  Object.entries(results).forEach(([engine, success]) => {
    console.log(`${engine}: ${success ? '✅ 成功' : '❌ 失败'}`)
  })
  
  // 如果有失败的情况，提供建议
  const failedEngines = Object.entries(results).filter(([_, success]) => !success)
  if (failedEngines.length > 0) {
    console.log('\n💡 建议:')
    console.log('- 检查网络连接')
    console.log('- 确认网站地图URL可访问')
    console.log('- 稍后重试')
  }
}

// 运行提交器
submitSitemap().catch(console.error)
```

## 第四步：集成到构建流程

### 4.1 更新构建脚本
修改 `scripts/build-sitemap.js`，添加自动提交功能：

```javascript
// scripts/build-sitemap.js
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import SitemapGenerator from '../src/services/SitemapGenerator.js'
import SearchEngineSubmitter from '../src/services/SearchEngineSubmitter.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ... 现有代码 ...

// 主函数
async function main() {
  try {
    // 生成网站地图
    generateSitemap()
    
    // 检查是否为生产构建
    if (process.env.NODE_ENV === 'production') {
      console.log('\n🚀 生产环境构建，自动提交网站地图...')
      
      // 等待一段时间确保文件已生成
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // 提交到搜索引擎
      const submitter = new SearchEngineSubmitter()
      await submitter.submitToAll()
    }
    
    console.log('\n✅ 网站地图构建和提交完成!')
  } catch (error) {
    console.error('❌ 构建过程中出错:', error)
    process.exit(1)
  }
}

// 运行主函数
main()
```

### 4.2 添加环境变量
在 `.env.production` 文件中添加：

```bash
# .env.production
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
NODE_ENV=production
```

## 第五步：测试和验证

### 5.1 本地测试
1. 运行网站地图生成：`npm run build:sitemap`
2. 检查生成的文件：
   - `public/sitemap.xml`
   - `public/robots.txt`
3. 验证XML格式是否正确

### 5.2 生产环境测试
1. 运行完整构建：`npm run build`
2. 部署到生产环境
3. 访问以下URL验证：
   - `https://games.espressox.online/sitemap.xml`
   - `https://games.espressox.online/robots.txt`

### 5.3 手动提交测试
运行手动提交脚本：
```bash
node scripts/submit-sitemap.js
```

## 第六步：监控和优化

### 6.1 在GSC中监控
1. 登录Google Search Console
2. 进入"网站地图"部分
3. 检查网站地图状态和错误
4. 查看索引覆盖率报告

### 6.2 定期更新
建议的更新频率：
- **静态页面**: 每月更新
- **分类页面**: 每周更新
- **游戏页面**: 每月更新
- **robots.txt**: 仅在需要时更新

### 6.3 性能优化
- 压缩网站地图文件
- 使用gzip压缩
- 设置适当的缓存头
- 监控文件大小（建议小于50MB）

## 重要提示

- **文件大小**: 单个网站地图文件不应超过50MB
- **URL数量**: 单个网站地图不应超过50,000个URL
- **更新频率**: 根据内容变化频率调整更新周期
- **错误处理**: 及时处理GSC中报告的索引错误

## 下一步

完成网站地图设置后，请继续阅读：
- [配置搜索优化设置](./gsc-optimization.md)
- [基础SEO优化建议](./seo-optimization.md)

## 常见问题

### Q: 网站地图文件太大怎么办？
A: 可以分割成多个网站地图文件，并创建网站地图索引文件。

### Q: 如何知道搜索引擎是否已处理网站地图？
A: 在Google Search Console中查看"网站地图"报告，检查状态和错误信息。

### Q: 需要手动提交网站地图吗？
A: 不需要，我们的脚本会自动提交。但您也可以在GSC中手动提交。
