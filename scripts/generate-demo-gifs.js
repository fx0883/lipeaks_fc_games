#!/usr/bin/env node

/**
 * 演示GIF生成脚本
 * 使用现有截图创建动画演示GIF
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置
const CONFIG = {
  // 截图路径
  screenshotsDir: path.join(__dirname, '../docs/images/screenshots'),
  
  // GIF输出路径
  gifsDir: path.join(__dirname, '../docs/images/gifs'),
  
  // 演示配置
  demos: [
    {
      name: 'game-launch-sequence',
      type: 'gameplay',
      title: '游戏启动序列',
      duration: 30,
      resolution: { width: 1280, height: 720 },
      sequence: [
        { image: 'homepage-desktop', duration: 2000, description: '首页展示' },
        { image: 'fc-category-desktop', duration: 3000, description: '选择FC分类' },
        { image: 'game-view-desktop', duration: 5000, description: '游戏加载界面' },
        { transition: 'fade', duration: 1000 },
        { text: '游戏运行中...', duration: 19000, description: '模拟游戏过程' }
      ]
    },
    {
      name: 'search-and-filter',
      type: 'features',
      title: '搜索和筛选',
      duration: 15,
      resolution: { width: 1280, height: 720 },
      sequence: [
        { image: 'homepage-desktop', duration: 3000, description: '打开搜索' },
        { image: 'search-desktop', duration: 4000, description: '搜索结果' },
        { image: 'game-view-desktop', duration: 8000, description: '选择游戏' }
      ]
    },
    {
      name: 'language-switching',
      type: 'features',
      title: '语言切换',
      duration: 10,
      resolution: { width: 1280, height: 720 },
      sequence: [
        { image: 'homepage-chinese-desktop', duration: 2000, description: '中文界面' },
        { transition: 'slide', duration: 1000 },
        { image: 'homepage-english-desktop', duration: 3000, description: '英文界面' },
        { transition: 'slide', duration: 1000 },
        { image: 'homepage-japanese-desktop', duration: 3000, description: '日文界面' }
      ]
    },
    {
      name: 'mobile-experience',
      type: 'mobile',
      title: '移动端体验',
      duration: 20,
      resolution: { width: 375, height: 812 },
      sequence: [
        { image: 'homepage-mobile', duration: 5000, description: '移动端首页' },
        { image: 'fc-category-mobile', duration: 5000, description: '移动端分类' },
        { image: 'game-view-mobile', duration: 10000, description: '移动端游戏' }
      ]
    },
    {
      name: 'responsive-design',
      type: 'features',
      title: '响应式设计',
      duration: 15,
      resolution: { width: 1280, height: 720 },
      sequence: [
        { image: 'homepage-desktop', duration: 5000, description: '桌面端视图' },
        { transition: 'zoom', duration: 2000 },
        { image: 'homepage-tablet', duration: 5000, description: '平板端视图' },
        { transition: 'zoom', duration: 1000 },
        { image: 'homepage-mobile', duration: 2000, description: '移动端视图' }
      ]
    },
    {
      name: 'game-statistics',
      type: 'features',
      title: '游戏统计',
      duration: 10,
      resolution: { width: 1280, height: 720 },
      sequence: [
        { image: 'stats-desktop', duration: 3000, description: '统计页面' },
        { text: '数据更新中...', duration: 4000, description: '模拟数据更新' },
        { image: 'stats-desktop', duration: 3000, description: '更新完成' }
      ]
    }
  ],
  
  // GIF设置
  gifSettings: {
    quality: 80,
    frameRate: 15, // 降低帧率以减小文件大小
    maxSize: 5 * 1024 * 1024 // 5MB
  }
};

class DemoGIFGenerator {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async init() {
    console.log('🚀 启动浏览器生成演示GIF...');
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

  async createAnimatedDemo(demo) {
    console.log(`\n🎬 创建演示: ${demo.title}`);
    
    try {
      await this.page.setViewport(demo.resolution);
      
      // 创建HTML容器
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              margin: 0;
              padding: 0;
              background: #f5f5f5;
              font-family: Arial, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
            }
            .demo-container {
              width: 100%;
              height: 100vh;
              position: relative;
              overflow: hidden;
              background: white;
              box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            }
            .screenshot {
              width: 100%;
              height: 100%;
              object-fit: contain;
              position: absolute;
              top: 0;
              left: 0;
              opacity: 0;
              transition: opacity 0.5s ease-in-out;
            }
            .screenshot.active {
              opacity: 1;
            }
            .text-overlay {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              background: rgba(0,0,0,0.8);
              color: white;
              padding: 20px 40px;
              border-radius: 10px;
              font-size: 24px;
              text-align: center;
              opacity: 0;
              transition: opacity 0.3s ease;
            }
            .text-overlay.active {
              opacity: 1;
            }
            .progress-bar {
              position: absolute;
              bottom: 20px;
              left: 20px;
              right: 20px;
              height: 4px;
              background: rgba(255,255,255,0.3);
              border-radius: 2px;
              overflow: hidden;
            }
            .progress-fill {
              height: 100%;
              background: #4f46e5;
              width: 0%;
              transition: width 0.3s ease;
            }
            .demo-title {
              position: absolute;
              top: 20px;
              left: 20px;
              background: rgba(0,0,0,0.8);
              color: white;
              padding: 8px 16px;
              border-radius: 6px;
              font-size: 14px;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="demo-container">
            <div class="demo-title">${demo.title}</div>
            <div class="progress-bar">
              <div class="progress-fill" id="progressFill"></div>
            </div>
          </div>
        </body>
        </html>
      `;
      
      await this.page.setContent(html);
      
      // 准备输出目录
      const outputDir = path.join(CONFIG.gifsDir, demo.type);
      fs.mkdirSync(outputDir, { recursive: true });
      
      // 生成帧序列
      const frames = [];
      let totalTime = 0;
      
      for (const step of demo.sequence) {
        const frameCount = Math.ceil((step.duration / 1000) * CONFIG.gifSettings.frameRate);
        
        for (let i = 0; i < frameCount; i++) {
          const progress = (totalTime + (i / frameCount) * step.duration) / (demo.duration * 1000);
          
          if (step.image) {
            // 查找对应的截图文件
            const screenshotPath = this.findScreenshot(step.image);
            if (screenshotPath) {
              frames.push({
                type: 'image',
                path: screenshotPath,
                progress: progress * 100,
                description: step.description
              });
            }
          } else if (step.text) {
            frames.push({
              type: 'text',
              text: step.text,
              progress: progress * 100,
              description: step.description
            });
          }
        }
        
        totalTime += step.duration;
      }
      
      console.log(`📸 准备生成 ${frames.length} 帧...`);
      
      // 输出文件路径
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `${demo.name}-${demo.resolution.width}x${demo.resolution.height}-${timestamp}.gif`;
      const outputPath = path.join(outputDir, filename);
      
      // 由于Puppeteer无法直接生成GIF，我们生成一个帧序列的说明
      // 在实际项目中，你需要使用专门的GIF生成库如 gifencoder 或 ffmpeg
      
      console.log(`✅ 演示规划完成: ${filename}`);
      console.log(`   - 总帧数: ${frames.length}`);
      console.log(`   - 时长: ${demo.duration}秒`);
      console.log(`   - 分辨率: ${demo.resolution.width}x${demo.resolution.height}`);
      console.log(`   - 预计文件大小: ~${Math.round(frames.length * 50 / 1024)}KB`);
      
      return {
        success: true,
        path: outputPath,
        frames: frames.length,
        demo: demo
      };
      
    } catch (error) {
      console.error(`❌ 生成演示失败: ${demo.title}`, error.message);
      return { success: false, error: error.message, demo: demo };
    }
  }

  findScreenshot(imageName) {
    // 查找对应的截图文件
    const extensions = ['.png', '.jpg', '.jpeg'];
    const directories = ['desktop', 'mobile', 'tablet', 'languages'];
    
    for (const dir of directories) {
      for (const ext of extensions) {
        const possiblePaths = [
          path.join(CONFIG.screenshotsDir, dir, `${imageName}-${dir === 'desktop' ? '1920x1080' : dir === 'mobile' ? '375x812' : '1024x768'}-2025-08-08${ext}`),
          path.join(CONFIG.screenshotsDir, dir, `${imageName}${ext}`),
          path.join(CONFIG.screenshotsDir, 'languages', `${imageName}-2025-08-08${ext}`)
        ];
        
        for (const imgPath of possiblePaths) {
          if (fs.existsSync(imgPath)) {
            return imgPath;
          }
        }
      }
    }
    
    console.warn(`⚠️ 未找到截图: ${imageName}`);
    return null;
  }

  async generateAllDemos() {
    console.log('\n🎬 开始生成所有演示GIF...');
    
    const results = [];
    let successCount = 0;
    
    for (const demo of CONFIG.demos) {
      const result = await this.createAnimatedDemo(demo);
      results.push(result);
      
      if (result.success) {
        successCount++;
      }
    }
    
    console.log(`\n📊 生成统计: ${successCount}/${CONFIG.demos.length} 成功`);
    return results;
  }

  async generateGIFIndex() {
    console.log('\n📋 生成GIF文件索引...');
    
    const indexPath = path.join(CONFIG.gifsDir, 'index.md');
    const timestamp = new Date().toISOString();
    
    let content = `# 🎬 演示GIF索引\n\n`;
    content += `> 生成时间: ${timestamp}\n\n`;
    content += `## 📂 GIF分类\n\n`;
    
    // 按类型分组
    const typeGroups = {
      'gameplay': '🎮 游戏操作',
      'features': '⚡ 功能演示', 
      'mobile': '📱 移动端体验'
    };
    
    for (const [type, title] of Object.entries(typeGroups)) {
      content += `### ${title}\n\n`;
      
      const typeDemos = CONFIG.demos.filter(demo => demo.type === type);
      typeDemos.forEach(demo => {
        const filename = `${demo.name}-${demo.resolution.width}x${demo.resolution.height}-2025-08-08.gif`;
        content += `#### ${demo.title}\n`;
        content += `- **文件**: [\`${filename}\`](${type}/${filename})\n`;
        content += `- **时长**: ${demo.duration}秒\n`;
        content += `- **分辨率**: ${demo.resolution.width}x${demo.resolution.height}\n`;
        content += `- **用途**: ${demo.title}演示\n\n`;
      });
    }
    
    // 使用说明
    content += `## 📖 使用说明\n\n`;
    content += `### GIF规格\n`;
    content += `- **格式**: 优化的GIF\n`;
    content += `- **帧率**: ${CONFIG.gifSettings.frameRate}fps\n`;
    content += `- **质量**: ${CONFIG.gifSettings.quality}%\n`;
    content += `- **最大文件大小**: ${CONFIG.gifSettings.maxSize / (1024*1024)}MB\n\n`;
    
    content += `### 故事板序列\n\n`;
    CONFIG.demos.forEach(demo => {
      content += `#### ${demo.title} (${demo.duration}秒)\n`;
      content += `\`\`\`\n`;
      content += `故事板:\n`;
      demo.sequence.forEach((step, index) => {
        const duration = step.duration / 1000;
        if (step.image) {
          content += `${index + 1}. ${step.description} (${duration}秒)\n`;
        } else if (step.text) {
          content += `${index + 1}. ${step.text} (${duration}秒)\n`;
        } else if (step.transition) {
          content += `${index + 1}. ${step.transition}过渡 (${duration}秒)\n`;
        }
      });
      content += `\`\`\`\n\n`;
    });
    
    content += `### 文件命名规范\n`;
    content += `\`\`\`\n`;
    content += `格式: [演示名称]-[分辨率]-[日期].gif\n\n`;
    content += `示例:\n`;
    content += `- game-launch-sequence-1280x720-2025-08-08.gif\n`;
    content += `- language-switching-1280x720-2025-08-08.gif\n`;
    content += `- mobile-experience-375x812-2025-08-08.gif\n`;
    content += `\`\`\`\n\n`;
    
    content += `## 🛠️ 生成工具\n\n`;
    content += `重新生成GIF演示:\n`;
    content += `\`\`\`bash\n`;
    content += `npm run generate-gifs\n`;
    content += `\`\`\`\n\n`;
    
    content += `## 📝 注意事项\n\n`;
    content += `1. **实际GIF生成**: 当前脚本生成演示规划，需要配合专业GIF工具(如FFmpeg)生成实际文件\n`;
    content += `2. **文件大小**: 保持GIF文件在5MB以内以确保网络加载速度\n`;
    content += `3. **质量平衡**: 在文件大小和视觉质量之间找到平衡点\n`;
    content += `4. **用途优化**: 不同用途的GIF可以采用不同的压缩设置\n\n`;
    
    fs.writeFileSync(indexPath, content);
    console.log(`✅ 索引已生成: ${indexPath}`);
  }

  async createGIFPlaceholders() {
    console.log('\n🖼️ 创建GIF占位文件...');
    
    for (const demo of CONFIG.demos) {
      const outputDir = path.join(CONFIG.gifsDir, demo.type);
      fs.mkdirSync(outputDir, { recursive: true });
      
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `${demo.name}-${demo.resolution.width}x${demo.resolution.height}-${timestamp}.md`;
      const placeholderPath = path.join(outputDir, filename);
      
      let content = `# ${demo.title}\n\n`;
      content += `> GIF演示规划文件\n\n`;
      content += `## 📋 基本信息\n\n`;
      content += `- **文件名**: \`${demo.name}.gif\`\n`;
      content += `- **时长**: ${demo.duration}秒\n`;
      content += `- **分辨率**: ${demo.resolution.width}x${demo.resolution.height}\n`;
      content += `- **类型**: ${demo.type}\n\n`;
      
      content += `## 🎬 故事板序列\n\n`;
      demo.sequence.forEach((step, index) => {
        content += `### 第${index + 1}步: ${step.description || step.text || '过渡效果'}\n`;
        content += `- **时长**: ${step.duration / 1000}秒\n`;
        if (step.image) {
          content += `- **截图**: ${step.image}\n`;
        }
        if (step.text) {
          content += `- **文本**: ${step.text}\n`;
        }
        if (step.transition) {
          content += `- **过渡**: ${step.transition}\n`;
        }
        content += `\n`;
      });
      
      content += `## 🛠️ 生成命令\n\n`;
      content += `使用FFmpeg生成实际GIF文件:\n`;
      content += `\`\`\`bash\n`;
      content += `# 示例命令 (需要根据实际截图调整)\n`;
      content += `ffmpeg -framerate ${CONFIG.gifSettings.frameRate} -i "frame_%03d.png" \\\n`;
      content += `  -vf "scale=${demo.resolution.width}:${demo.resolution.height}" \\\n`;
      content += `  -loop 0 ${demo.name}.gif\n`;
      content += `\`\`\`\n\n`;
      
      fs.writeFileSync(placeholderPath, content);
    }
    
    console.log('✅ GIF占位文件已创建');
  }
}

async function main() {
  console.log('🎯 Lipeaks FC Games - 演示GIF生成工具\n');
  
  const generator = new DemoGIFGenerator();
  
  try {
    await generator.init();
    await generator.generateAllDemos();
    await generator.createGIFPlaceholders();
    await generator.generateGIFIndex();
    
    console.log('\n🎉 所有GIF演示规划完成！');
    console.log(`📁 文件保存在: ${CONFIG.gifsDir}`);
    console.log('\n💡 下一步: 使用专业工具(如FFmpeg)根据规划生成实际GIF文件');
    
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

export { DemoGIFGenerator, CONFIG };