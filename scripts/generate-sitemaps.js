/**
 * 生成XML站点地图
 * 为Lipeaks FC Games生成多个站点地图文件
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 网站基本信息
const SITE_URL = 'https://games.espressox.online';
const LANGUAGES = ['en', 'zh', 'ja', 'ar'];
const CURRENT_DATE = new Date().toISOString().split('T')[0];

// XML头部
const XML_HEADER = '<?xml version="1.0" encoding="UTF-8"?>\n';
const SITEMAP_HEADER = `${XML_HEADER}<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;
const SITEMAP_FOOTER = '</urlset>';

// 生成hreflang链接
function generateHreflangLinks(path) {
  return LANGUAGES.map(lang => {
    const href = lang === 'en' 
      ? `${SITE_URL}${path}`
      : `${SITE_URL}${path}${path.includes('?') ? '&' : '?'}lang=${lang}`;
    return `    <xhtml:link rel="alternate" hreflang="${lang}" href="${href}" />`;
  }).join('\n');
}

// 生成URL条目
function generateUrlEntry(path, lastmod = CURRENT_DATE, changefreq = 'weekly', priority = '0.8') {
  const hreflangLinks = generateHreflangLinks(path);
  
  return `  <url>
    <loc>${SITE_URL}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
${hreflangLinks}
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${path}" />
  </url>`;
}

// 读取游戏数据
function loadGameData() {
  const gamesData = {};
  const gamesDir = path.join(__dirname, '../public/data/games');
  
  try {
    const platforms = ['fc', 'arcade'];
    
    platforms.forEach(platform => {
      const platformDir = path.join(gamesDir, platform);
      if (fs.existsSync(platformDir)) {
        const files = fs.readdirSync(platformDir);
        
        files.forEach(file => {
          if (file.endsWith('.json')) {
            const filePath = path.join(platformDir, file);
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            
            if (data.games && Array.isArray(data.games)) {
              if (!gamesData[platform]) gamesData[platform] = [];
              gamesData[platform].push(...data.games);
            }
          }
        });
      }
    });
  } catch (error) {
    console.error('Error loading game data:', error);
  }
  
  return gamesData;
}

// 读取分类数据
function loadCategoryData() {
  try {
    const categoriesPath = path.join(__dirname, '../public/data/categories.json');
    if (fs.existsSync(categoriesPath)) {
      return JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));
    }
  } catch (error) {
    console.error('Error loading category data:', error);
  }
  return {};
}

// 生成主站点地图
function generateMainSitemap() {
  const urls = [
    generateUrlEntry('/', CURRENT_DATE, 'daily', '1.0'),
    generateUrlEntry('/stats', CURRENT_DATE, 'weekly', '0.6'),
    generateUrlEntry('/search', CURRENT_DATE, 'weekly', '0.7'),
  ];

  return SITEMAP_HEADER + urls.join('\n') + '\n' + SITEMAP_FOOTER;
}

// 生成游戏站点地图
function generateGamesSitemap() {
  const gamesData = loadGameData();
  const urls = [];

  Object.entries(gamesData).forEach(([platform, games]) => {
    games.forEach(game => {
      if (game.id) {
        // 单个游戏页面
        const gamePath = `/game/${game.id}`;
        urls.push(generateUrlEntry(gamePath, CURRENT_DATE, 'monthly', '0.8'));
      }
    });
  });

  return SITEMAP_HEADER + urls.join('\n') + '\n' + SITEMAP_FOOTER;
}

// 生成分类站点地图
function generateCategoriesSitemap() {
  const categories = loadCategoryData();
  const urls = [];

  // 平台分类
  const platforms = ['fc', 'arcade'];
  platforms.forEach(platform => {
    urls.push(generateUrlEntry(`/category/${platform}`, CURRENT_DATE, 'weekly', '0.9'));
  });

  // 游戏类型分类
  if (categories.categories) {
    Object.keys(categories.categories).forEach(categoryKey => {
      urls.push(generateUrlEntry(`/category/${categoryKey}`, CURRENT_DATE, 'weekly', '0.8'));
    });
  }

  return SITEMAP_HEADER + urls.join('\n') + '\n' + SITEMAP_FOOTER;
}

// 生成内容站点地图（将来的内容页面）
function generateContentSitemap() {
  const urls = [
    // 将来可以添加游戏攻略、历史文章等内容页面
    // generateUrlEntry('/guides/contra-walkthrough', CURRENT_DATE, 'monthly', '0.7'),
    // generateUrlEntry('/articles/nes-history', CURRENT_DATE, 'monthly', '0.6'),
  ];

  return SITEMAP_HEADER + urls.join('\n') + '\n' + SITEMAP_FOOTER;
}

// 生成图片站点地图
function generateImagesSitemap() {
  const urls = [];
  const gamesData = loadGameData();

  Object.entries(gamesData).forEach(([platform, games]) => {
    games.forEach(game => {
      if (game.image) {
        const imageUrl = game.image.startsWith('http') 
          ? game.image 
          : `${SITE_URL}${game.image}`;
        
        urls.push(`  <url>
    <loc>${imageUrl}</loc>
    <lastmod>${CURRENT_DATE}</lastmod>
    <image:image>
      <image:loc>${imageUrl}</image:loc>
      <image:title>${game.title || game.name}</image:title>
      <image:caption>${game.description || game.title || game.name}</image:caption>
    </image:image>
  </url>`);
      }
    });
  });

  const header = `${XML_HEADER}<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;
  return header + urls.join('\n') + '\n' + SITEMAP_FOOTER;
}

// 生成站点地图索引
function generateSitemapIndex() {
  const sitemaps = [
    'sitemap.xml',
    'sitemap-games.xml',
    'sitemap-categories.xml',
    'sitemap-content.xml',
    'sitemap-images.xml'
  ];

  const header = `${XML_HEADER}<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  const footer = '</sitemapindex>';
  
  const entries = sitemaps.map(sitemap => `  <sitemap>
    <loc>${SITE_URL}/${sitemap}</loc>
    <lastmod>${CURRENT_DATE}</lastmod>
  </sitemap>`);

  return header + entries.join('\n') + '\n' + footer;
}

// 主函数
function generateAllSitemaps() {
  const outputDir = path.join(__dirname, '../public');
  
  // 确保输出目录存在
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    // 生成各个站点地图
    const sitemaps = {
      'sitemap.xml': generateMainSitemap(),
      'sitemap-games.xml': generateGamesSitemap(),
      'sitemap-categories.xml': generateCategoriesSitemap(),
      'sitemap-content.xml': generateContentSitemap(),
      'sitemap-images.xml': generateImagesSitemap(),
      'sitemap-index.xml': generateSitemapIndex()
    };

    // 写入文件
    Object.entries(sitemaps).forEach(([filename, content]) => {
      const filePath = path.join(outputDir, filename);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Generated: ${filename}`);
    });

    console.log('\n🎉 All sitemaps generated successfully!');
    console.log(`📍 Files created in: ${outputDir}`);
    
  } catch (error) {
    console.error('❌ Error generating sitemaps:', error);
    process.exit(1);
  }
}

// 运行生成器
if (import.meta.url === `file://${process.argv[1]}`) {
  generateAllSitemaps();
}

export { generateAllSitemaps };