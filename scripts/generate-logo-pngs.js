#!/usr/bin/env node

/**
 * SVG转PNG Logo生成脚本
 * 使用Puppeteer将SVG logo转换为不同尺寸的PNG格式
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置
const CONFIG = {
  // logo配置
  logos: [
    { name: 'lipeaks-logo-original', theme: 'original' },
    { name: 'lipeaks-logo-light-theme', theme: 'light' },
    { name: 'lipeaks-logo-dark-theme', theme: 'dark' },
    { name: 'lipeaks-logo-monochrome', theme: 'monochrome' }
  ],
  
  // PNG尺寸配置
  sizes: [512, 256, 128, 64, 32, 16],
  
  // 路径配置
  svgDir: path.join(__dirname, '../docs/images/logos/svg'),
  pngDir: path.join(__dirname, '../docs/images/logos/png'),
  variantsDir: path.join(__dirname, '../docs/images/logos/variants'),
  
  // 输出质量
  quality: 100
};

class LogoPNGGenerator {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async init() {
    console.log('🚀 启动浏览器生成PNG logo...');
    this.browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    this.page = await this.browser.newPage();
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      console.log('✅ 浏览器已关闭');
    }
  }

  async convertSVGtoPNG(svgPath, outputPath, size) {
    try {
      // 读取SVG文件
      const svgContent = fs.readFileSync(svgPath, 'utf8');
      
      // 创建HTML页面包含SVG
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              margin: 0;
              padding: 0;
              background: transparent;
            }
            .logo-container {
              width: ${size}px;
              height: ${size}px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            svg {
              width: 100%;
              height: 100%;
            }
          </style>
        </head>
        <body>
          <div class="logo-container">
            ${svgContent}
          </div>
        </body>
        </html>
      `;
      
      // 设置页面内容
      await this.page.setContent(html);
      await this.page.setViewport({ width: size, height: size, deviceScaleFactor: 1 });
      
      // 等待渲染完成
      await this.page.waitForTimeout(500);
      
      // 确保输出目录存在
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      
      // 截取logo区域
      const logoElement = await this.page.$('.logo-container');
      await logoElement.screenshot({
        path: outputPath,
        type: 'png',
        background: 'transparent'
      });
      
      console.log(`✅ 已生成: ${path.basename(outputPath)} (${size}x${size})`);
      return outputPath;
      
    } catch (error) {
      console.error(`❌ 生成失败: ${outputPath}`, error.message);
      return null;
    }
  }

  async generateAllLogos() {
    console.log('\n📸 开始生成PNG logo...');
    
    let successCount = 0;
    let totalCount = 0;
    
    for (const logo of CONFIG.logos) {
      console.log(`\n🎨 处理: ${logo.name} (${logo.theme}主题)`);
      
      const svgPath = path.join(CONFIG.svgDir, `${logo.name}.svg`);
      
      if (!fs.existsSync(svgPath)) {
        console.error(`❌ SVG文件不存在: ${svgPath}`);
        continue;
      }
      
      for (const size of CONFIG.sizes) {
        totalCount++;
        
        // 确定输出目录
        let outputDir = CONFIG.pngDir;
        if (logo.theme !== 'original') {
          outputDir = CONFIG.variantsDir;
        }
        
        const filename = `${logo.name}-${size}x${size}.png`;
        const outputPath = path.join(outputDir, filename);
        
        const result = await this.convertSVGtoPNG(svgPath, outputPath, size);
        if (result) {
          successCount++;
        }
      }
    }
    
    console.log(`\n📊 生成统计: ${successCount}/${totalCount} 成功`);
  }

  async generateFavicons() {
    console.log('\n🌟 生成网站图标...');
    
    const originalSvgPath = path.join(CONFIG.svgDir, 'lipeaks-logo-original.svg');
    
    if (!fs.existsSync(originalSvgPath)) {
      console.error('❌ 原始SVG文件不存在，无法生成favicon');
      return;
    }
    
    // 生成favicon尺寸
    const faviconSizes = [16, 32, 48, 96, 144, 192];
    
    for (const size of faviconSizes) {
      const filename = `favicon-${size}x${size}.png`;
      const outputPath = path.join(CONFIG.variantsDir, filename);
      
      await this.convertSVGtoPNG(originalSvgPath, outputPath, size);
    }
    
    // 生成标准favicon.ico (32x32)
    const favicon32Path = path.join(CONFIG.variantsDir, 'favicon-32x32.png');
    const faviconPath = path.join(CONFIG.variantsDir, 'favicon.png');
    
    if (fs.existsSync(favicon32Path)) {
      fs.copyFileSync(favicon32Path, faviconPath);
      console.log('✅ 已生成标准favicon.png');
    }
  }

  async generateLogoIndex() {
    console.log('\n📋 生成logo文件索引...');
    
    const indexPath = path.join(path.dirname(CONFIG.svgDir), 'index.md');
    const timestamp = new Date().toISOString();
    
    let content = `# 🎨 Logo文件索引\n\n`;
    content += `> 生成时间: ${timestamp}\n\n`;
    
    // SVG文件
    content += `## 📂 SVG格式Logo\n\n`;
    const svgFiles = fs.readdirSync(CONFIG.svgDir).filter(f => f.endsWith('.svg'));
    svgFiles.sort().forEach(file => {
      content += `- ![${file}](svg/${file}) - ${file}\n`;
    });
    
    // PNG文件  
    content += `\n## 📂 PNG格式Logo\n\n`;
    
    // 标准PNG
    content += `### 标准尺寸\n\n`;
    if (fs.existsSync(CONFIG.pngDir)) {
      const pngFiles = fs.readdirSync(CONFIG.pngDir).filter(f => f.endsWith('.png'));
      pngFiles.sort().forEach(file => {
        content += `- ![${file}](png/${file}) - ${file}\n`;
      });
    }
    
    // 变体PNG
    content += `\n### 主题变体\n\n`;
    if (fs.existsSync(CONFIG.variantsDir)) {
      const variantFiles = fs.readdirSync(CONFIG.variantsDir).filter(f => f.endsWith('.png'));
      variantFiles.sort().forEach(file => {
        content += `- ![${file}](variants/${file}) - ${file}\n`;
      });
    }
    
    // 使用说明
    content += `\n## 📖 使用说明\n\n`;
    content += `### SVG Logo\n`;
    content += `- **原始版本**: \`lipeaks-logo-original.svg\` - 项目原始设计\n`;
    content += `- **亮色主题**: \`lipeaks-logo-light-theme.svg\` - 适用于浅色背景\n`;
    content += `- **暗色主题**: \`lipeaks-logo-dark-theme.svg\` - 适用于深色背景\n`;
    content += `- **单色版本**: \`lipeaks-logo-monochrome.svg\` - 适用于单色显示\n\n`;
    
    content += `### PNG Logo\n`;
    content += `- **多种尺寸**: 512px, 256px, 128px, 64px, 32px, 16px\n`;
    content += `- **透明背景**: 适合各种背景色\n`;
    content += `- **高质量**: 适合打印和高分辨率显示\n\n`;
    
    content += `### 网站图标\n`;
    content += `- **Favicon**: 16x16, 32x32, 48x48等多种尺寸\n`;
    content += `- **PWA图标**: 96x96, 144x144, 192x192\n\n`;
    
    content += `### 文件命名规范\n`;
    content += `\`\`\`\n`;
    content += `格式: [项目名]-logo-[主题]-[尺寸].[扩展名]\n\n`;
    content += `示例:\n`;
    content += `- lipeaks-logo-original.svg\n`;
    content += `- lipeaks-logo-light-theme-256x256.png\n`;
    content += `- favicon-32x32.png\n`;
    content += `\`\`\`\n\n`;
    
    fs.writeFileSync(indexPath, content);
    console.log(`✅ 索引已生成: ${indexPath}`);
  }
}

async function main() {
  console.log('🎯 Lipeaks FC Games - Logo PNG生成工具\n');
  
  const generator = new LogoPNGGenerator();
  
  try {
    await generator.init();
    await generator.generateAllLogos();
    await generator.generateFavicons();
    await generator.generateLogoIndex();
    
    console.log('\n🎉 所有Logo生成任务完成！');
    console.log(`📁 文件保存在:`);
    console.log(`   - SVG: ${CONFIG.svgDir}`);
    console.log(`   - PNG: ${CONFIG.pngDir}`);
    console.log(`   - 变体: ${CONFIG.variantsDir}`);
    
  } catch (error) {
    console.error('❌ 生成过程中发生错误:', error);
    process.exit(1);
  } finally {
    await generator.close();
  }
}

// 如果直接运行此脚本
if (import.meta.url.startsWith('file:') && process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(console.error);
}

export { LogoPNGGenerator, CONFIG };