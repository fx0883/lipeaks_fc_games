# 🎬 FFmpeg GIF生成命令

本文档提供使用FFmpeg从截图生成GIF文件的具体命令。

## 📋 前置要求

1. 安装FFmpeg: [https://ffmpeg.org/download.html](https://ffmpeg.org/download.html)
2. 确保截图文件存在于 `docs/images/screenshots/` 目录

## 🎮 游戏启动序列 GIF

```bash
# 创建临时工作目录
mkdir temp_gif_frames

# 复制和重命名截图文件
cp "docs/images/screenshots/desktop/homepage-desktop-1920x1080-2025-08-08.png" temp_gif_frames/frame_001.png
cp "docs/images/screenshots/desktop/fc-category-desktop-1920x1080-2025-08-08.png" temp_gif_frames/frame_002.png
cp "docs/images/screenshots/desktop/game-view-desktop-1920x1080-2025-08-08.png" temp_gif_frames/frame_003.png

# 生成游戏启动序列GIF
ffmpeg -y \
  -f image2 -framerate 0.5 -i temp_gif_frames/frame_%03d.png \
  -vf "scale=1280:720:flags=lanczos,palettegen" \
  temp_palette.png

ffmpeg -y \
  -f image2 -framerate 0.5 -i temp_gif_frames/frame_%03d.png \
  -i temp_palette.png \
  -vf "scale=1280:720:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=3" \
  -loop 0 \
  docs/images/gifs/gameplay/game-launch-sequence-1280x720.gif

# 清理临时文件
rm -rf temp_gif_frames temp_palette.png
```

## ⚡ 语言切换 GIF

```bash
# 创建临时工作目录
mkdir temp_lang_frames

# 复制多语言截图
cp "docs/images/screenshots/languages/homepage-chinese-desktop-2025-08-08.png" temp_lang_frames/frame_001.png
cp "docs/images/screenshots/languages/homepage-english-desktop-2025-08-08.png" temp_lang_frames/frame_002.png
cp "docs/images/screenshots/languages/homepage-japanese-desktop-2025-08-08.png" temp_lang_frames/frame_003.png

# 生成语言切换GIF
ffmpeg -y \
  -f image2 -framerate 0.3 -i temp_lang_frames/frame_%03d.png \
  -vf "scale=1280:720:flags=lanczos,palettegen" \
  temp_palette.png

ffmpeg -y \
  -f image2 -framerate 0.3 -i temp_lang_frames/frame_%03d.png \
  -i temp_palette.png \
  -vf "scale=1280:720:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=3" \
  -loop 0 \
  docs/images/gifs/features/language-switching-1280x720.gif

# 清理临时文件
rm -rf temp_lang_frames temp_palette.png
```

## 🔍 搜索和筛选 GIF

```bash
# 创建临时工作目录
mkdir temp_search_frames

# 复制截图文件
cp "docs/images/screenshots/desktop/homepage-desktop-1920x1080-2025-08-08.png" temp_search_frames/frame_001.png
cp "docs/images/screenshots/desktop/search-desktop-1920x1080-2025-08-08.png" temp_search_frames/frame_002.png
cp "docs/images/screenshots/desktop/game-view-desktop-1920x1080-2025-08-08.png" temp_search_frames/frame_003.png

# 生成搜索筛选GIF
ffmpeg -y \
  -f image2 -framerate 0.4 -i temp_search_frames/frame_%03d.png \
  -vf "scale=1280:720:flags=lanczos,palettegen" \
  temp_palette.png

ffmpeg -y \
  -f image2 -framerate 0.4 -i temp_search_frames/frame_%03d.png \
  -i temp_palette.png \
  -vf "scale=1280:720:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=3" \
  -loop 0 \
  docs/images/gifs/features/search-and-filter-1280x720.gif

# 清理临时文件
rm -rf temp_search_frames temp_palette.png
```

## 📱 移动端体验 GIF

```bash
# 创建临时工作目录
mkdir temp_mobile_frames

# 复制移动端截图
cp "docs/images/screenshots/mobile/homepage-mobile-375x812-2025-08-08.png" temp_mobile_frames/frame_001.png
cp "docs/images/screenshots/mobile/fc-category-mobile-375x812-2025-08-08.png" temp_mobile_frames/frame_002.png
cp "docs/images/screenshots/mobile/game-view-mobile-375x812-2025-08-08.png" temp_mobile_frames/frame_003.png

# 生成移动端体验GIF
ffmpeg -y \
  -f image2 -framerate 0.3 -i temp_mobile_frames/frame_%03d.png \
  -vf "scale=375:812:flags=lanczos,palettegen" \
  temp_palette.png

ffmpeg -y \
  -f image2 -framerate 0.3 -i temp_mobile_frames/frame_%03d.png \
  -i temp_palette.png \
  -vf "scale=375:812:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=3" \
  -loop 0 \
  docs/images/gifs/mobile/mobile-experience-375x812.gif

# 清理临时文件
rm -rf temp_mobile_frames temp_palette.png
```

## 🎨 响应式设计 GIF

```bash
# 创建临时工作目录
mkdir temp_responsive_frames

# 复制不同尺寸截图
cp "docs/images/screenshots/desktop/homepage-desktop-1920x1080-2025-08-08.png" temp_responsive_frames/frame_001.png
cp "docs/images/screenshots/tablet/homepage-tablet-1024x768-2025-08-08.png" temp_responsive_frames/frame_002.png
cp "docs/images/screenshots/mobile/homepage-mobile-375x812-2025-08-08.png" temp_responsive_frames/frame_003.png

# 统一尺寸 (调整为1280x720展示区域)
ffmpeg -y -i temp_responsive_frames/frame_001.png -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2:white" temp_responsive_frames/frame_001_resized.png
ffmpeg -y -i temp_responsive_frames/frame_002.png -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2:white" temp_responsive_frames/frame_002_resized.png
ffmpeg -y -i temp_responsive_frames/frame_003.png -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2:white" temp_responsive_frames/frame_003_resized.png

# 生成响应式设计GIF
ffmpeg -y \
  -f image2 -framerate 0.4 -i temp_responsive_frames/frame_%03d_resized.png \
  -vf "palettegen" \
  temp_palette.png

ffmpeg -y \
  -f image2 -framerate 0.4 -i temp_responsive_frames/frame_%03d_resized.png \
  -i temp_palette.png \
  -vf "[0:v][1:v]paletteuse=dither=bayer:bayer_scale=3" \
  -loop 0 \
  docs/images/gifs/features/responsive-design-1280x720.gif

# 清理临时文件
rm -rf temp_responsive_frames temp_palette.png
```

## 📊 游戏统计 GIF

```bash
# 创建临时工作目录
mkdir temp_stats_frames

# 复制统计页面截图
cp "docs/images/screenshots/desktop/stats-desktop-1920x1080-2025-08-08.png" temp_stats_frames/frame_001.png
cp "docs/images/screenshots/desktop/stats-desktop-1920x1080-2025-08-08.png" temp_stats_frames/frame_002.png
cp "docs/images/screenshots/desktop/stats-desktop-1920x1080-2025-08-08.png" temp_stats_frames/frame_003.png

# 生成游戏统计GIF
ffmpeg -y \
  -f image2 -framerate 0.5 -i temp_stats_frames/frame_%03d.png \
  -vf "scale=1280:720:flags=lanczos,palettegen" \
  temp_palette.png

ffmpeg -y \
  -f image2 -framerate 0.5 -i temp_stats_frames/frame_%03d.png \
  -i temp_palette.png \
  -vf "scale=1280:720:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=3" \
  -loop 0 \
  docs/images/gifs/features/game-statistics-1280x720.gif

# 清理临时文件
rm -rf temp_stats_frames temp_palette.png
```

## 🔧 批量生成脚本

### Windows (PowerShell)

```powershell
# create-all-gifs.ps1

Write-Host "🎬 开始生成所有GIF文件..." -ForegroundColor Green

# 游戏启动序列
Write-Host "生成游戏启动序列GIF..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "temp_gif_frames"
Copy-Item "docs\images\screenshots\desktop\homepage-desktop-1920x1080-2025-08-08.png" "temp_gif_frames\frame_001.png"
Copy-Item "docs\images\screenshots\desktop\fc-category-desktop-1920x1080-2025-08-08.png" "temp_gif_frames\frame_002.png"
Copy-Item "docs\images\screenshots\desktop\game-view-desktop-1920x1080-2025-08-08.png" "temp_gif_frames\frame_003.png"

ffmpeg -y -f image2 -framerate 0.5 -i temp_gif_frames\frame_%03d.png -vf "scale=1280:720:flags=lanczos,palettegen" temp_palette.png
ffmpeg -y -f image2 -framerate 0.5 -i temp_gif_frames\frame_%03d.png -i temp_palette.png -vf "scale=1280:720:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=3" -loop 0 docs\images\gifs\gameplay\game-launch-sequence-1280x720.gif

Remove-Item -Recurse -Force temp_gif_frames
Remove-Item temp_palette.png

# 语言切换
Write-Host "生成语言切换GIF..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "temp_lang_frames"
Copy-Item "docs\images\screenshots\languages\homepage-chinese-desktop-2025-08-08.png" "temp_lang_frames\frame_001.png"
Copy-Item "docs\images\screenshots\languages\homepage-english-desktop-2025-08-08.png" "temp_lang_frames\frame_002.png"
Copy-Item "docs\images\screenshots\languages\homepage-japanese-desktop-2025-08-08.png" "temp_lang_frames\frame_003.png"

ffmpeg -y -f image2 -framerate 0.3 -i temp_lang_frames\frame_%03d.png -vf "scale=1280:720:flags=lanczos,palettegen" temp_palette.png
ffmpeg -y -f image2 -framerate 0.3 -i temp_lang_frames\frame_%03d.png -i temp_palette.png -vf "scale=1280:720:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=3" -loop 0 docs\images\gifs\features\language-switching-1280x720.gif

Remove-Item -Recurse -Force temp_lang_frames
Remove-Item temp_palette.png

Write-Host "✅ 所有GIF文件生成完成！" -ForegroundColor Green
```

### Linux/macOS (Bash)

```bash
#!/bin/bash
# create-all-gifs.sh

echo "🎬 开始生成所有GIF文件..."

# 游戏启动序列
echo "生成游戏启动序列GIF..."
mkdir -p temp_gif_frames
cp "docs/images/screenshots/desktop/homepage-desktop-1920x1080-2025-08-08.png" temp_gif_frames/frame_001.png
cp "docs/images/screenshots/desktop/fc-category-desktop-1920x1080-2025-08-08.png" temp_gif_frames/frame_002.png
cp "docs/images/screenshots/desktop/game-view-desktop-1920x1080-2025-08-08.png" temp_gif_frames/frame_003.png

ffmpeg -y -f image2 -framerate 0.5 -i temp_gif_frames/frame_%03d.png -vf "scale=1280:720:flags=lanczos,palettegen" temp_palette.png
ffmpeg -y -f image2 -framerate 0.5 -i temp_gif_frames/frame_%03d.png -i temp_palette.png -vf "scale=1280:720:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=3" -loop 0 docs/images/gifs/gameplay/game-launch-sequence-1280x720.gif

rm -rf temp_gif_frames temp_palette.png

# 语言切换
echo "生成语言切换GIF..."
mkdir -p temp_lang_frames
cp "docs/images/screenshots/languages/homepage-chinese-desktop-2025-08-08.png" temp_lang_frames/frame_001.png
cp "docs/images/screenshots/languages/homepage-english-desktop-2025-08-08.png" temp_lang_frames/frame_002.png
cp "docs/images/screenshots/languages/homepage-japanese-desktop-2025-08-08.png" temp_lang_frames/frame_003.png

ffmpeg -y -f image2 -framerate 0.3 -i temp_lang_frames/frame_%03d.png -vf "scale=1280:720:flags=lanczos,palettegen" temp_palette.png
ffmpeg -y -f image2 -framerate 0.3 -i temp_lang_frames/frame_%03d.png -i temp_palette.png -vf "scale=1280:720:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=3" -loop 0 docs/images/gifs/features/language-switching-1280x720.gif

rm -rf temp_lang_frames temp_palette.png

echo "✅ 所有GIF文件生成完成！"
```

## 📝 注意事项

1. **FFmpeg参数说明**:
   - `-framerate`: 控制帧率，数值越小动画越慢
   - `-vf scale`: 调整输出尺寸
   - `palettegen` + `paletteuse`: 生成优化的调色板以减小文件大小
   - `-loop 0`: 无限循环

2. **文件大小优化**:
   - 降低帧率 (framerate)
   - 减少颜色数量 (调色板)
   - 优化图片尺寸

3. **质量设置**:
   - `flags=lanczos`: 高质量缩放算法
   - `dither=bayer`: 优化的抖动算法

4. **兼容性**:
   - GIF格式支持最广泛
   - WebM格式文件更小但兼容性较差

## 🚀 快速开始

1. 安装FFmpeg
2. 确保截图文件存在
3. 选择对应平台的批量生成脚本
4. 运行脚本生成所有GIF文件

生成的GIF文件将保存在 `docs/images/gifs/` 对应的子目录中。