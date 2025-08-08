# 语言切换

> GIF演示规划文件

## 📋 基本信息

- **文件名**: `language-switching.gif`
- **时长**: 10秒
- **分辨率**: 1280x720
- **类型**: features

## 🎬 故事板序列

### 第1步: 中文界面
- **时长**: 2秒
- **截图**: homepage-chinese-desktop

### 第2步: 过渡效果
- **时长**: 1秒
- **过渡**: slide

### 第3步: 英文界面
- **时长**: 3秒
- **截图**: homepage-english-desktop

### 第4步: 过渡效果
- **时长**: 1秒
- **过渡**: slide

### 第5步: 日文界面
- **时长**: 3秒
- **截图**: homepage-japanese-desktop

## 🛠️ 生成命令

使用FFmpeg生成实际GIF文件:
```bash
# 示例命令 (需要根据实际截图调整)
ffmpeg -framerate 15 -i "frame_%03d.png" \
  -vf "scale=1280:720" \
  -loop 0 language-switching.gif
```

