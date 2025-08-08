# 📸 Puppeteer自动截图使用指南

本指南详细说明如何使用Puppeteer自动截图工具为Lipeaks FC Games项目生成各种截图素材。

## 🎯 概览

Puppeteer截图工具可以自动生成：
- **多设备截图** - 桌面端、平板端、移动端
- **多语言截图** - 中文、英文、日文、阿拉伯文
- **多页面截图** - 首页、分类页、游戏页、搜索页等
- **自动索引** - 生成截图文件索引

## 📁 目录结构

截图将保存在以下目录结构中：

```
docs/images/
├── screenshots/
│   ├── desktop/          # 桌面端截图 (1920x1080)
│   ├── tablet/           # 平板端截图 (1024x768)
│   ├── mobile/           # 移动端截图 (375x812)
│   ├── languages/        # 多语言截图
│   └── index.md          # 截图索引文件
├── gifs/                 # GIF动图 (手动创建)
├── logos/                # Logo文件 (手动创建)
└── social/               # 社交媒体素材 (手动创建)
```

## 🛠️ 安装和配置

### 1. 安装依赖

```bash
# 安装Puppeteer
npm install

# 或单独安装Puppeteer
npm run screenshots:install
```

### 2. 启动开发服务器

**重要**: 截图工具需要本地开发服务器运行在 `http://localhost:5173`

```bash
# 启动开发服务器
npm run dev
```

确保看到类似输出：
```
➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### 3. 运行截图工具

在新的终端窗口中运行：

```bash
# 运行自动截图
npm run screenshots
```

## 📸 截图配置

### 设备配置

```javascript
devices: {
  desktop: { width: 1920, height: 1080, deviceScaleFactor: 1 },
  tablet: { width: 1024, height: 768, deviceScaleFactor: 2 },
  mobile: { width: 375, height: 812, deviceScaleFactor: 3 }
}
```

### 语言配置

```javascript
languages: [
  { code: 'zh-CN', name: 'chinese' },    // 中文
  { code: 'en-US', name: 'english' },    // 英文
  { code: 'ja-JP', name: 'japanese' },   // 日文
  { code: 'ar-AR', name: 'arabic' }      // 阿拉伯文
]
```

### 页面配置

```javascript
pages: [
  { name: 'homepage', path: '/', description: '首页' },
  { name: 'fc-category', path: '/category/fc', description: 'FC游戏分类页' },
  { name: 'arcade-category', path: '/category/arcade', description: '街机游戏分类页' },
  { name: 'game-view', path: '/game/fc/1942', description: '游戏页面' },
  { name: 'search', path: '/search?q=mario', description: '搜索页面' },
  { name: 'stats', path: '/stats', description: '统计页面' }
]
```

## 🚀 使用步骤

### 第一步：准备环境

1. **确保开发服务器运行**
   ```bash
   npm run dev
   ```

2. **验证页面可访问**
   - 打开浏览器访问 `http://localhost:5173`
   - 确保所有页面正常加载

### 第二步：执行截图

```bash
# 运行截图工具
npm run screenshots
```

### 第三步：查看结果

截图完成后，你会看到：

```
🎉 所有截图任务完成！
📁 截图保存在: D:\GitHub\lipeaks_fc_games\docs\images\screenshots
```

## 📋 截图输出

### 文件命名规则

```
格式: [页面名称]-[设备类型]-[分辨率]-[日期].png

示例:
- homepage-desktop-1920x1080-2024-01-15.png
- fc-category-mobile-375x812-2024-01-15.png
- homepage-chinese-desktop-2024-01-15.png
```

### 生成的文件

每次运行会生成：

**标准截图** (6页面 × 3设备 = 18张)
- `homepage-desktop-1920x1080-[日期].png`
- `homepage-tablet-1024x768-[日期].png`
- `homepage-mobile-375x812-[日期].png`
- `fc-category-desktop-1920x1080-[日期].png`
- ... (其他页面类似)

**多语言截图** (4语言 × 2设备 = 8张)
- `homepage-chinese-desktop-[日期].png`
- `homepage-chinese-mobile-[日期].png`
- `homepage-english-desktop-[日期].png`
- ... (其他语言类似)

**索引文件**
- `docs/images/screenshots/index.md` - 自动生成的截图索引

## ⚙️ 高级配置

### 修改配置选项

编辑 `scripts/take-screenshots.js` 中的配置：

```javascript
const CONFIG = {
  // 本地服务器地址
  baseUrl: 'http://localhost:5173',
  
  // 截图质量 (0-100)
  quality: 90,
  
  // 等待时间 (毫秒)
  waitTime: 3000,
  
  // 页面超时时间 (毫秒)
  timeout: 30000
};
```

### 添加新页面

在配置中添加新页面：

```javascript
pages: [
  // ... 现有页面
  { 
    name: 'about', 
    path: '/about', 
    description: '关于页面' 
  }
]
```

### 添加新设备

添加新的设备配置：

```javascript
devices: {
  // ... 现有设备
  'large-desktop': { 
    width: 2560, 
    height: 1440, 
    deviceScaleFactor: 1 
  }
}
```

## 🔧 故障排除

### 常见问题

#### 1. 无法连接到开发服务器

**错误**: `❌ 无法连接到开发服务器`

**解决方案**:
- 确保 `npm run dev` 正在运行
- 检查端口是否为 5173
- 确保没有防火墙阻止

#### 2. 截图空白或不完整

**错误**: 截图显示空白页面

**解决方案**:
- 增加等待时间 (`waitTime: 5000`)
- 检查页面是否需要更长加载时间
- 确保所有资源都已加载

#### 3. 内存不足

**错误**: `Out of memory` 或截图进程崩溃

**解决方案**:
- 减少并发截图数量
- 增加 `--max-old-space-size` 参数
- 分批处理截图

#### 4. 某些页面截图失败

**错误**: 特定页面截图失败

**解决方案**:
- 检查页面路径是否正确
- 确保页面在所有语言下都可访问
- 检查页面是否有特殊加载要求

### 调试模式

启用有头模式进行调试：

```javascript
// 在 take-screenshots.js 中修改
this.browser = await puppeteer.launch({
  headless: false,  // 改为 false
  // ... 其他配置
});
```

## 📈 性能优化

### 加速截图

1. **减少等待时间**
   ```javascript
   waitTime: 2000  // 从 3000 减少到 2000
   ```

2. **并行处理**
   ```javascript
   // 可以考虑并行处理不同设备的截图
   ```

3. **跳过不需要的页面**
   ```javascript
   // 注释掉不需要的页面
   ```

### 减少文件大小

1. **降低质量**
   ```javascript
   quality: 80  // 从 90 降低到 80
   ```

2. **使用WebP格式**
   ```javascript
   type: 'webp'  // 替代 'png'
   ```

## 📊 自动化集成

### CI/CD集成

在GitHub Actions中集成：

```yaml
# .github/workflows/screenshots.yml
name: Generate Screenshots
on:
  push:
    branches: [main]

jobs:
  screenshots:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run dev &
      - run: sleep 10
      - run: npm run screenshots
      - uses: actions/upload-artifact@v2
        with:
          name: screenshots
          path: docs/images/screenshots/
```

### 定期更新

设置定期截图更新：

```bash
# 添加到 crontab (Linux/Mac)
0 6 * * 1 cd /path/to/project && npm run screenshots
```

## 🎨 后续处理

### 手动优化

截图生成后，可以进行：

1. **图片压缩** - 使用 TinyPNG 等工具
2. **添加标注** - 使用图片编辑软件添加说明
3. **创建拼接图** - 组合多个截图
4. **生成GIF** - 使用截图序列创建动画

### 社交媒体素材

基于截图创建：

1. **Twitter卡片** (1200x675)
2. **Facebook封面** (1200x630)  
3. **GitHub社交预览** (1280x640)

## 📝 最佳实践

### 截图前检查

- [ ] 开发服务器正常运行
- [ ] 所有页面链接有效
- [ ] 游戏数据已加载
- [ ] UI界面完整显示

### 质量保证

- [ ] 检查截图清晰度
- [ ] 验证多语言显示正确
- [ ] 确保响应式布局正常
- [ ] 测试所有设备尺寸

### 文件管理

- [ ] 定期清理旧截图
- [ ] 维护截图索引
- [ ] 备份重要截图
- [ ] 版本控制管理

## 🤝 贡献指南

如需改进截图工具：

1. Fork 项目
2. 创建功能分支
3. 测试新功能
4. 提交 Pull Request

---

通过这个自动化截图工具，你可以快速生成高质量的项目展示图片，大大提升项目的视觉吸引力！🎨✨