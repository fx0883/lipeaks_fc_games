# 响应式设计

> GIF演示规划文件

## 📋 基本信息

- **文件名**: `responsive-design.gif`
- **时长**: 15秒
- **分辨率**: 1280x720
- **类型**: features

## 🎬 故事板序列

### 第1步: 桌面端视图
- **时长**: 5秒
- **截图**: homepage-desktop

### 第2步: 过渡效果
- **时长**: 2秒
- **过渡**: zoom

### 第3步: 平板端视图
- **时长**: 5秒
- **截图**: homepage-tablet

### 第4步: 过渡效果
- **时长**: 1秒
- **过渡**: zoom

### 第5步: 移动端视图
- **时长**: 2秒
- **截图**: homepage-mobile

## 🛠️ 生成命令

使用FFmpeg生成实际GIF文件:
```bash
# 示例命令 (需要根据实际截图调整)
ffmpeg -framerate 15 -i "frame_%03d.png" \
  -vf "scale=1280:720" \
  -loop 0 responsive-design.gif
```

