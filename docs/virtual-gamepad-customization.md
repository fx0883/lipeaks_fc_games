# 虚拟手柄按钮位置和形状自定义指南

## 📋 概述

本文档详细说明如何在 EmulatorJS 项目中自定义虚拟手柄的按钮位置、大小和形状。所有配置都基于 EmulatorJS 的 `EJS_VirtualGamepadSettings` 全局变量。

## 🎯 核心配置文件

### 主配置文件
- **文件路径**: `src/utils/mobileDetection.js`
- **作用**: 定义 Vue 应用中的虚拟手柄配置
- **函数**: 
  - `getFCVirtualGamepadSettings(orientation)` - FC/NES 游戏配置
  - `getMAMEVirtualGamepadSettings(orientation)` - MAME 街机游戏配置

### 测试页面（需要同步更新）
- `public/fc-emulator.html` - FC 游戏独立测试页面
- `public/mame-emulator.html` - MAME 游戏独立测试页面  
- `public/mobile-test.html` - 移动端综合测试页面

## 🎮 按钮配置结构

### 基本按钮对象

```javascript
{
  type: "button",              // 按钮类型: "button" | "dpad"
  text: "A",                   // 按钮显示文字
  id: "button_a",              // 按钮唯一标识符
  location: "right",           // 按钮区域: "left" | "right" | "center"
  left: 85,                    // 水平位置 (百分比或像素)
  top: 70,                     // 垂直位置 (百分比或像素)
  bold: true,                  // 文字是否加粗
  input_value: 8,              // 按钮映射值 (对应 EmulatorJS 按钮)
  size: 45,                    // 按钮大小 (像素)
  
  // 可选: 形状相关属性
  shape: "rounded-rect",       // 按钮形状: "circle" | "rounded-rect"
  width: 55,                   // 长方形按钮宽度 (像素)
  height: 20                   // 长方形按钮高度 (像素)
}
```

### 方向键（D-Pad）对象

```javascript
{
  type: "dpad",                // 方向键类型
  location: "left",            // 通常放在左侧
  left: "12%",                 // 水平位置
  top: "55%",                  // 垂直位置  
  inputValues: [4, 5, 6, 7],   // 方向映射: [上, 下, 左, 右]
  size: 90                     // 方向键大小
}
```

## 📐 坐标系统详解

### 位置坐标 (left, top)

```javascript
// 百分比定位（推荐）
left: isPortrait ? "8%" : "12%"    // 字符串格式，相对于屏幕宽度
top: isPortrait ? "70%" : "55%"    // 字符串格式，相对于屏幕高度

// 数值定位
left: isPortrait ? 75 : 70         // 数字格式，作为百分比处理
top: isPortrait ? 60 : 50          // 数字格式，作为百分比处理
```

### 坐标系参考

```
屏幕坐标系:
0% ─────────── 100%
│  ┌─────────┐  │
│  │ 游戏区域 │  │ 
│  │         │  │
│  └─────────┘  │
│               │
100%            │

左上角 = (0%, 0%)
右下角 = (100%, 100%)
屏幕中心 = (50%, 50%)
```

## 🎯 当前按钮布局

### FC/NES 游戏十字形布局

```
         Y(上)
         │
X(左) ────┼──── A(右)  
         │
         B(下)

坐标配置:
Y: 上按钮 - (75, 55) 横屏 | (75, 55) 竖屏
X: 左按钮 - (60, 70) 横屏 | (60, 70) 竖屏  
A: 右按钮 - (90, 70) 横屏 | (85, 70) 竖屏
B: 下按钮 - (75, 85) 横屏 | (75, 75) 竖屏
```

### MAME 游戏十字形布局

```
         1(上)
         │
4(左) ────┼──── 2(右)
         │  
         3(下)

坐标配置:
1: 上按钮 - (75, 55) 横屏 | (75, 55) 竖屏
4: 左按钮 - (60, 70) 横屏 | (60, 70) 竖屏
2: 右按钮 - (90, 70) 横屏 | (85, 70) 竖屏  
3: 下按钮 - (75, 85) 横屏 | (75, 75) 竖屏
```

### 系统按钮（圆角长方形）

```
[SELECT/COIN]    [START]

位置:
SELECT/COIN: (35, 35) 横屏 | (40, 20) 竖屏
START: (65, 35) 横屏 | (60, 20) 竖屏

形状属性:
shape: "rounded-rect"
width: 60 竖屏 | 55 横屏
height: 25 竖屏 | 20 横屏
```

## 🔧 修改按钮位置

### 1. 调整单个按钮位置

```javascript
// 原始 A 按钮配置
{
  text: "A",
  left: isPortrait ? 90 : 85,    // 当前位置
  top: isPortrait ? 70 : 60,
  // ... 其他属性
}

// 向左移动 10 个单位
{
  text: "A", 
  left: isPortrait ? 80 : 75,    // 减少 left 值
  top: isPortrait ? 70 : 60,     // top 保持不变
}

// 向上移动 10 个单位  
{
  text: "A",
  left: isPortrait ? 90 : 85,    // left 保持不变
  top: isPortrait ? 60 : 50,     // 减少 top 值
}
```

### 2. 调整按钮间距

```javascript
// 增加十字形按钮的间距
const centerX = isPortrait ? 75 : 70;  // 中心点 X
const centerY = isPortrait ? 70 : 60;  // 中心点 Y  
const spacing = 20;                     // 间距

// 上按钮
top: centerY - spacing,

// 下按钮
top: centerY + spacing,

// 左按钮  
left: centerX - spacing,

// 右按钮
left: centerX + spacing,
```

### 3. 响应式配置

```javascript
// 根据屏幕方向调整
const buttonConfig = {
  text: "A",
  left: isPortrait ? 竖屏位置 : 横屏位置,
  top: isPortrait ? 竖屏位置 : 横屏位置,
  size: isPortrait ? 竖屏大小 : 横屏大小,
};

// 实际示例
{
  text: "A",
  left: isPortrait ? 85 : 80,     // 竖屏稍微靠右
  top: isPortrait ? 75 : 65,      // 竖屏稍微靠下  
  size: isPortrait ? 55 : 50,     // 竖屏按钮稍大
}
```

## 🎨 修改按钮形状

### 圆形按钮（默认）

```javascript
{
  type: "button",
  text: "A",
  // ... 位置属性
  // 无需额外形状属性，默认为圆形
}
```

### 圆角长方形按钮

```javascript
{
  type: "button", 
  text: "START",
  // ... 位置属性
  shape: "rounded-rect",           // 指定圆角长方形
  width: isPortrait ? 60 : 55,     // 按钮宽度
  height: isPortrait ? 25 : 20,    // 按钮高度
}
```

### 自定义按钮大小

```javascript
// 小按钮
{
  size: isPortrait ? 40 : 35,
  width: isPortrait ? 50 : 45,     // 圆角长方形用
  height: isPortrait ? 20 : 18,
}

// 中等按钮
{
  size: isPortrait ? 50 : 45, 
  width: isPortrait ? 60 : 55,
  height: isPortrait ? 25 : 20,
}

// 大按钮
{
  size: isPortrait ? 60 : 55,
  width: isPortrait ? 70 : 65, 
  height: isPortrait ? 30 : 25,
}
```

## 🎮 按钮映射值参考

### EmulatorJS 标准映射

| input_value | 对应按钮 | FC 游戏作用 | MAME 游戏作用 |
|-------------|----------|-------------|---------------|
| 0 | Button 1 / B | B按钮 (跑步/取消) | 按钮1 (轻拳/射击) |
| 1 | Button 2 / X | X按钮 | 按钮3 (重拳) |
| 8 | Button 3 / A | A按钮 (跳跃/确认) | 按钮2 (中拳) |
| 9 | Button 4 / Y | Y按钮 | 按钮4 (轻腿) |
| 2 | SELECT | 选择键 | 投币 (COIN) |
| 3 | START | 开始键 | 开始游戏 |
| 4 | UP | 上方向 | 上方向 |
| 5 | DOWN | 下方向 | 下方向 |
| 6 | LEFT | 左方向 | 左方向 |
| 7 | RIGHT | 右方向 | 右方向 |

### 6按钮格斗游戏映射（可选）

| input_value | 格斗游戏按钮 |
|-------------|-------------|
| 0 | 轻拳 (LP) |
| 8 | 中拳 (MP) |
| 1 | 重拳 (HP) |
| 9 | 轻腿 (LK) |
| 5 | 中腿 (MK) |
| 10 | 重腿 (HK) |

## 📝 完整修改流程

### Step 1: 分析需求

```javascript
// 确定要修改的内容
1. 哪些按钮需要移动？
2. 移动到什么位置？
3. 需要改变大小吗？
4. 需要改变形状吗？
5. 横屏和竖屏是否需要不同配置？
```

### Step 2: 修改主配置文件

```bash
# 打开主配置文件
code src/utils/mobileDetection.js

# 修改对应的函数:
# - getFCVirtualGamepadSettings() 
# - getMAMEVirtualGamepadSettings()
```

### Step 3: 同步测试页面

```bash
# 更新独立测试页面（保持配置一致）
code public/fc-emulator.html
code public/mame-emulator.html  
code public/mobile-test.html
```

### Step 4: 测试验证

```bash
# 启动开发服务器
npm run dev

# 在移动设备或模拟器中测试
# 检查按钮位置、大小、响应性
```

## 🛠️ 调试技巧

### 开发者工具调试

```javascript
// 在浏览器控制台查看当前配置
console.log('Virtual Gamepad Settings:', window.EJS_VirtualGamepadSettings);

// 检查设备方向
console.log('Device orientation:', window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');

// 检查屏幕尺寸
console.log('Screen size:', window.innerWidth, 'x', window.innerHeight);
```

### 快速测试配置

```javascript
// 临时修改配置（用于快速测试）
window.EJS_VirtualGamepadSettings = [
  {
    type: "button",
    text: "TEST",
    location: "center", 
    left: 50,
    top: 50,
    input_value: 8,
    size: 60
  }
];
```

### 可视化调试

```css
/* 添加临时样式查看按钮边界 */
.ejs-virtual-gamepad-button {
  border: 2px solid red !important;
  opacity: 0.8 !important;
}
```

## ⚠️ 注意事项

### 1. 坐标边界限制

```javascript
// 确保按钮不超出屏幕边界
const minPosition = 5;     // 最小边距 5%
const maxPosition = 95;    // 最大边距 95%

left: Math.max(minPosition, Math.min(maxPosition, 你的位置值));
top: Math.max(minPosition, Math.min(maxPosition, 你的位置值));
```

### 2. 按钮重叠检测

```javascript
// 确保按钮间有足够间距
const buttonSize = 50;
const minSpacing = buttonSize * 0.3;  // 30% 的按钮大小作为最小间距

// 检查两个按钮是否重叠的函数
function checkButtonOverlap(button1, button2) {
  const dx = Math.abs(button1.left - button2.left);
  const dy = Math.abs(button1.top - button2.top);
  return dx < minSpacing && dy < minSpacing;
}
```

### 3. 性能优化

```javascript
// 避免在配置中使用复杂计算
// 不好的做法:
left: isPortrait ? calculateComplexPosition() : otherCalculation(),

// 好的做法:
const portraitLeft = 75;  // 预计算的值
const landscapeLeft = 70;
left: isPortrait ? portraitLeft : landscapeLeft,
```

### 4. 兼容性考虑

```javascript
// 确保配置兼容不同 EmulatorJS 版本
const baseConfig = {
  type: "button",
  text: "A", 
  location: "right",
  left: 85,
  top: 70,
  input_value: 8,
  size: 45
};

// 仅在支持时添加形状属性
if (supportsCustomShapes) {
  baseConfig.shape = "rounded-rect";
  baseConfig.width = 55;
  baseConfig.height = 20;
}
```

## 📚 相关资源

### 官方文档
- [EmulatorJS 官方仓库](https://github.com/EmulatorJS/EmulatorJS)
- [EmulatorJS 虚拟手柄文档](https://github.com/EmulatorJS/EmulatorJS/wiki/Virtual-Gamepad)

### 项目文件
- `src/utils/mobileDetection.js` - 主配置文件
- `public/button-position-guide.html` - 可视化调整指南
- `public/emulator-controls-guide.html` - 控制说明页面
- `docs/virtual-gamepad-customization.md` - 本技术文档

### 测试页面
- `http://localhost:5173/mobile-test.html` - 移动端测试
- `http://localhost:5173/fc-emulator.html` - FC 游戏测试
- `http://localhost:5173/mame-emulator.html` - MAME 游戏测试

---

**最后更新**: 2024年12月

**版本**: 1.0

**维护者**: EmulatorJS Vue 项目团队 