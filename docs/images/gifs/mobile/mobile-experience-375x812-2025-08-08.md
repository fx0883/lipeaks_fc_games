# 移动端体验

> GIF演示规划文件

## 📋 基本信息

- **文件名**: `mobile-experience.gif`
- **时长**: 20秒
- **分辨率**: 375x812
- **类型**: mobile

## 🎬 故事板序列

### 第1步: 移动端首页
- **时长**: 5秒
- **截图**: homepage-mobile

### 第2步: 移动端分类
- **时长**: 5秒
- **截图**: fc-category-mobile

### 第3步: 移动端游戏
- **时长**: 10秒
- **截图**: game-view-mobile

## 🛠️ 生成命令

使用FFmpeg生成实际GIF文件:
```bash
# 示例命令 (需要根据实际截图调整)
ffmpeg -framerate 15 -i "frame_%03d.png" \
  -vf "scale=375:812" \
  -loop 0 mobile-experience.gif
```

