# 搜索和筛选

> GIF演示规划文件

## 📋 基本信息

- **文件名**: `search-and-filter.gif`
- **时长**: 15秒
- **分辨率**: 1280x720
- **类型**: features

## 🎬 故事板序列

### 第1步: 打开搜索
- **时长**: 3秒
- **截图**: homepage-desktop

### 第2步: 搜索结果
- **时长**: 4秒
- **截图**: search-desktop

### 第3步: 选择游戏
- **时长**: 8秒
- **截图**: game-view-desktop

## 🛠️ 生成命令

使用FFmpeg生成实际GIF文件:
```bash
# 示例命令 (需要根据实际截图调整)
ffmpeg -framerate 15 -i "frame_%03d.png" \
  -vf "scale=1280:720" \
  -loop 0 search-and-filter.gif
```

