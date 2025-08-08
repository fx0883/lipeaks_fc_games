#!/usr/bin/env node

/**
 * Puppeteer自动截图脚本
 * 用于生成项目的各种截图素材
 * 使用方法：npm run screenshots
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES模块中获取__dirname的方法
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置选项
const CONFIG = {
  // 本地开发服务器地址
  baseUrl: 'http://localhost:5173',
  
  // 截图保存路径
  outputDir: path.join(__dirname, '../docs/images/screenshots'),
  
  // 截图质量 (0-100)
  quality: 90,
  
  // 等待时间 (毫秒)
  waitTime: 3000,
  
  // 页面超时时间 (毫秒)
  timeout: 30000,
  
  // 截图设备配置
  devices: {
    desktop: { width: 1920, height: 1080, deviceScaleFactor: 1 },
    tablet: { width: 1024, height: 768, deviceScaleFactor: 2 },
    mobile: { width: 375, height: 812, deviceScaleFactor: 3 }
  },
  
  // 语言配置
  languages: [
    { code: 'zh-CN', name: 'chinese' },
    { code: 'en-US', name: 'english' },
    { code: 'ja-JP', name: 'japanese' },
    { code: 'ar-AR', name: 'arabic' }
  ],
  
  // 要截图的页面
  pages: [
    { name: 'homepage', path: '/', description: '首页' },
    { name: 'fc-category', path: '/category/fc', description: 'FC游戏分类页' },
    { name: 'arcade-category', path: '/category/arcade', description: '街机游戏分类页' },
    { name: 'game-view', path: '/game/fc/1942', description: '游戏页面' },
    { name: 'search', path: '/search?q=魂', description: '搜索页面' },
    { name: 'stats', path: '/stats', description: '统计页面' }
  ]
};

class ScreenshotTaker {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async init() {
    console.log('🚀 启动浏览器...');
    this.browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });
    
    this.page = await this.browser.newPage();
    await this.page.setDefaultTimeout(CONFIG.timeout);
    
    // 设置用户代理
    await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      console.log('✅ 浏览器已关闭');
    }
  }

  async checkServer() {
    console.log('🔍 检查开发服务器...');
    try {
      await this.page.goto(CONFIG.baseUrl, { waitUntil: 'networkidle2' });
      console.log('✅ 服务器运行正常');
      return true;
    } catch (error) {
      console.error('❌ 无法连接到开发服务器:', error.message);
      console.log('💡 请确保开发服务器正在运行: npm run dev');
      return false;
    }
  }

  async setLanguage(langCode) {
    // 通过localStorage设置语言
    await this.page.evaluateOnNewDocument((lang) => {
      localStorage.setItem('language', lang);
    }, langCode);
  }

  async takeScreenshot(device, pageName, pagePath, langCode = 'zh-CN') {
    try {
      const deviceConfig = CONFIG.devices[device];
      await this.page.setViewport(deviceConfig);
      
      // 设置语言
      await this.setLanguage(langCode);
      
      // 导航到页面
      const url = `${CONFIG.baseUrl}${pagePath}`;
      console.log(`📸 截图: ${pageName} (${device}) - ${url}`);
      
      await this.page.goto(url, { 
        waitUntil: 'networkidle2',
        timeout: CONFIG.timeout 
      });
      
      // 等待页面完全加载
      await this.page.waitForTimeout(CONFIG.waitTime);
      
      // 滚动到顶部
      await this.page.evaluate(() => window.scrollTo(0, 0));
      
      // 等待动画完成
      await this.page.waitForTimeout(1000);
      
      // 生成文件名
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `${pageName}-${device}-${deviceConfig.width}x${deviceConfig.height}-${timestamp}.png`;
      const filepath = path.join(CONFIG.outputDir, device, filename);
      
      // 确保目录存在
      fs.mkdirSync(path.dirname(filepath), { recursive: true });
      
      // 截图
      await this.page.screenshot({
        path: filepath,
        type: 'png',
        fullPage: false
      });
      
      console.log(`✅ 已保存: ${filepath}`);
      return filepath;
      
    } catch (error) {
      console.error(`❌ 截图失败 ${pageName} (${device}):`, error.message);
      return null;
    }
  }

  async takeLanguageScreenshots() {
    console.log('\n🌍 开始多语言截图...');
    
    for (const lang of CONFIG.languages) {
      console.log(`\n📝 语言: ${lang.name} (${lang.code})`);
      
      // 只截图首页的多语言版本
      const homepagePath = '/';
      
      for (const device of ['desktop', 'mobile']) {
        const filename = `homepage-${lang.name}-${device}-${new Date().toISOString().slice(0, 10)}.png`;
        const filepath = path.join(CONFIG.outputDir, 'languages', filename);
        
        try {
          const deviceConfig = CONFIG.devices[device];
          await this.page.setViewport(deviceConfig);
          await this.setLanguage(lang.code);
          
          await this.page.goto(`${CONFIG.baseUrl}${homepagePath}`, { 
            waitUntil: 'networkidle2' 
          });
          
          await this.page.waitForTimeout(CONFIG.waitTime);
          await this.page.evaluate(() => window.scrollTo(0, 0));
          
          fs.mkdirSync(path.dirname(filepath), { recursive: true });
          
          await this.page.screenshot({
            path: filepath,
            type: 'png',
            fullPage: false
          });
          
          console.log(`✅ 已保存多语言截图: ${filepath}`);
          
        } catch (error) {
          console.error(`❌ 多语言截图失败 ${lang.name}:`, error.message);
        }
      }
    }
  }

  async takeAllScreenshots() {
    console.log('\n📸 开始批量截图...');
    
    let successCount = 0;
    let totalCount = 0;
    
    // 为每个页面和设备组合截图
    for (const pageConfig of CONFIG.pages) {
      console.log(`\n📄 页面: ${pageConfig.description}`);
      
      for (const device of Object.keys(CONFIG.devices)) {
        totalCount++;
        const result = await this.takeScreenshot(
          device, 
          pageConfig.name, 
          pageConfig.path
        );
        
        if (result) {
          successCount++;
        }
      }
    }
    
    console.log(`\n📊 截图统计: ${successCount}/${totalCount} 成功`);
  }

  async generateIndex() {
    console.log('\n📋 生成截图索引...');
    
    const indexPath = path.join(CONFIG.outputDir, 'index.md');
    const timestamp = new Date().toISOString();
    
    let content = `# 📸 截图索引\n\n`;
    content += `> 生成时间: ${timestamp}\n\n`;
    content += `## 📱 设备截图\n\n`;
    
    // 扫描截图文件
    const devices = ['desktop', 'tablet', 'mobile'];
    
    for (const device of devices) {
      const deviceDir = path.join(CONFIG.outputDir, device);
      content += `### ${device.charAt(0).toUpperCase() + device.slice(1)}\n\n`;
      
      if (fs.existsSync(deviceDir)) {
        const files = fs.readdirSync(deviceDir);
        files.sort().forEach(file => {
          if (file.endsWith('.png')) {
            content += `- ![${file}](${device}/${file})\n`;
          }
        });
      }
      content += '\n';
    }
    
    // 多语言截图
    content += `## 🌍 多语言截图\n\n`;
    const langDir = path.join(CONFIG.outputDir, 'languages');
    if (fs.existsSync(langDir)) {
      const files = fs.readdirSync(langDir);
      files.sort().forEach(file => {
        if (file.endsWith('.png')) {
          content += `- ![${file}](languages/${file})\n`;
        }
      });
    }
    
    fs.writeFileSync(indexPath, content);
    console.log(`✅ 索引已生成: ${indexPath}`);
  }
}

async function main() {
  console.log('🎯 Lipeaks FC Games - 自动截图工具\n');
  
  const screenshotTaker = new ScreenshotTaker();
  
  try {
    await screenshotTaker.init();
    
    // 检查服务器
    const serverOk = await screenshotTaker.checkServer();
    if (!serverOk) {
      process.exit(1);
    }
    
    // 执行截图
    await screenshotTaker.takeAllScreenshots();
    await screenshotTaker.takeLanguageScreenshots();
    await screenshotTaker.generateIndex();
    
    console.log('\n🎉 所有截图任务完成！');
    console.log(`📁 截图保存在: ${CONFIG.outputDir}`);
    
  } catch (error) {
    console.error('❌ 截图过程中发生错误:', error);
    process.exit(1);
  } finally {
    await screenshotTaker.close();
  }
}

// 如果直接运行此脚本（ES模块版本）
if (import.meta.url.startsWith('file:') && process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(console.error);
}

export { ScreenshotTaker, CONFIG };