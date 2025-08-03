# EmulatorJS 虚拟按钮配置指南

本文档详细说明如何配置 EmulatorJS 中 FC（红白机/NES）模拟器和街机模拟器的虚拟按钮设置。

> **版本说明**：本文档基于 EmulatorJS 4.2.3 版本编写，确保与最新标准保持一致。

## 目录
- [概述](#概述)
- [核心代码文件](#核心代码文件)
- [FC模拟器虚拟按钮配置](#fc模拟器虚拟按钮配置)
- [街机模拟器虚拟按钮配置](#街机模拟器虚拟按钮配置)
- [自定义虚拟按钮](#自定义虚拟按钮)
- [样式自定义](#样式自定义)
- [使用示例](#使用示例)
- [故障排除](#故障排除)

## 概述

EmulatorJS 的虚拟按钮系统允许在移动设备上提供触摸控制界面。系统会根据不同的游戏机类型自动配置相应的按钮布局，同时支持完全自定义配置。

### 主要特性
- **自动适配**：根据游戏机类型自动选择合适的按钮布局
- **完全自定义**：支持通过 JavaScript 配置自定义按钮
- **多语言支持**：按钮文本支持本地化
- **响应式设计**：适配不同屏幕尺寸
- **左手模式**：支持左右手操作切换

## 核心代码文件

### 1. 主要 JavaScript 文件

#### `data/src/emulator.js`
- **作用**：包含虚拟按钮的核心逻辑
- **关键函数**：
  - `setVirtualGamepad()` (第3469行)：创建和配置虚拟按钮
  - `getControlScheme()` (第2468行)：获取当前游戏机的控制方案
  - `setupSettingsMenu()` (第5055行)：设置菜单中的虚拟按钮选项

#### `data/loader.js`
- **作用**：加载虚拟按钮配置
- **关键代码**：
```javascript
config.VirtualGamepadSettings = window.EJS_VirtualGamepadSettings;
```

### 2. 样式文件

#### `data/emulator.css`
- **作用**：定义虚拟按钮的外观和布局
- **关键 CSS 类**：
  - `.ejs_virtualGamepad_parent` (第708行)：虚拟按钮容器
  - `.ejs_virtualGamepad_left` (第729行)：左侧区域（方向键）
  - `.ejs_virtualGamepad_right` (第737行)：右侧区域（动作按钮）
  - `.ejs_virtualGamepad_button` (第745行)：按钮样式

### 3. 本地化文件

#### `data/localization/zh.json`
- **作用**：中文按钮文本
- **示例**：
```json
{
    "Start": "开始",
    "Select": "选择",
    "Fast": "加速",
    "Slow": "减速"
}
```

## FC模拟器虚拟按钮配置

### 默认按钮布局

FC模拟器的虚拟按钮配置位于 `data/src/emulator.js` 第3549-3557行：

```javascript
} else if ("nes" === this.getControlScheme()) {
    info = [
        { "type": "button", "text": "B", "id": "b", "location": "right", "right": 75, "top": 70, "bold": true, "input_value": 0 },
        { "type": "button", "text": "A", "id": "a", "location": "right", "right": 5, "top": 70, "bold": true, "input_value": 8 },
        { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "right": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
        { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
        { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 }
    ];
    info.push(...speedControlButtons);
}
```

### 按钮配置详解

#### A 按钮
- **位置**：右侧区域，距离右边5px，距离顶部70px
- **输入值**：8
- **样式**：粗体显示

#### B 按钮  
- **位置**：右侧区域，距离右边75px，距离顶部70px
- **输入值**：0
- **样式**：粗体显示

#### 方向键 (D-Pad)
- **位置**：左侧区域，居中显示
- **输入值**：[4, 5, 6, 7] 对应 [上, 下, 左, 右]
- **类型**：方向键区域，非摇杆输入

#### Start 按钮
- **位置**：中心区域，距离左边60px
- **输入值**：3
- **样式**：块级显示，字体大小15px

#### Select 按钮
- **位置**：中心区域，距离左边-5px
- **输入值**：2
- **样式**：块级显示，字体大小15px

### 速度控制按钮

系统会自动添加速度控制按钮（定义在第3477-3483行）：

```javascript
const speedControlButtons = [
    { "type": "button", "text": "Fast", "id": "speed_fast", "location": "center", "left": -35, "top": 50, "fontSize": 15, "block": true, "input_value": 27 },
    { "type": "button", "text": "Slow", "id": "speed_slow", "location": "center", "left": 95, "top": 50, "fontSize": 15, "block": true, "input_value": 29 },
];
```

## 街机模拟器虚拟按钮配置

### 默认按钮布局

街机模拟器使用默认配置（第3751-3760行），适用于大多数街机游戏：

```javascript
} else {
    info = [
        { "type": "button", "text": "Y", "id": "y", "location": "right", "left": 40, "bold": true, "input_value": 9 },
        { "type": "button", "text": "X", "id": "x", "location": "right", "top": 40, "bold": true, "input_value": 1 },
        { "type": "button", "text": "B", "id": "b", "location": "right", "left": 81, "top": 40, "bold": true, "input_value": 8 },
        { "type": "button", "text": "A", "id": "a", "location": "right", "left": 40, "top": 80, "bold": true, "input_value": 0 },
        { "type": "zone", "id": "dpad", "location": "left", "left": "50%", "top": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
        { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
        { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 }
    ];
    info.push(...speedControlButtons);
}
```

### 街机按钮布局说明

街机模拟器采用标准的4按钮布局：

#### 动作按钮组
- **A 按钮**：右下角，输入值 0
- **B 按钮**：右中，输入值 8  
- **X 按钮**：右上，输入值 1
- **Y 按钮**：左中，输入值 9

#### 方向控制
- **摇杆区域**：左侧，支持8方向输入
- **输入值**：[4, 5, 6, 7] 对应 [上, 下, 左, 右]

#### 系统按钮
- **Start**：开始游戏/投币
- **Select**：选择/设置

### 键盘映射

默认键盘控制映射（第3118-3175行）：

```javascript
this.defaultControllers = {
    0: {
        0: { "value": "x", "value2": "BUTTON_2" },      // B按钮
        1: { "value": "s", "value2": "BUTTON_4" },      // X按钮
        2: { "value": "v", "value2": "SELECT" },        // Select
        3: { "value": "enter", "value2": "START" },     // Start
        4: { "value": "up arrow", "value2": "DPAD_UP" },    // 方向键上
        5: { "value": "down arrow", "value2": "DPAD_DOWN" }, // 方向键下
        6: { "value": "left arrow", "value2": "DPAD_LEFT" }, // 方向键左
        7: { "value": "right arrow", "value2": "DPAD_RIGHT" },// 方向键右
        8: { "value": "z", "value2": "BUTTON_1" },      // A按钮
        9: { "value": "a", "value2": "BUTTON_3" },      // Y按钮
        // ... 更多映射
    }
};
```

## 自定义虚拟按钮

### 通过 JavaScript 配置

在 HTML 页面中，可以通过设置 `window.EJS_VirtualGamepadSettings` 来自定义虚拟按钮：

```html
<script>
window.EJS_VirtualGamepadSettings = [
    // FC模拟器自定义配置示例
    {
        "type": "button",
        "text": "A",
        "id": "a",
        "location": "right",
        "right": 10,
        "top": 60,
        "bold": true,
        "input_value": 8
    },
    {
        "type": "button", 
        "text": "B",
        "id": "b",
        "location": "right",
        "right": 80,
        "top": 60,
        "bold": true,
        "input_value": 0
    },
    {
        "type": "dpad",
        "id": "dpad",
        "location": "left",
        "left": "50%",
        "top": "50%",
        "joystickInput": false,
        "inputValues": [4, 5, 6, 7]
    },
    {
        "type": "button",
        "text": "Start",
        "id": "start", 
        "location": "center",
        "left": 50,
        "fontSize": 14,
        "block": true,
        "input_value": 3
    },
    {
        "type": "button",
        "text": "Select",
        "id": "select",
        "location": "center", 
        "left": -10,
        "fontSize": 14,
        "block": true,
        "input_value": 2
    }
];
</script>
```

### 配置参数说明

#### 基本参数
- **type**：按钮类型
  - `"button"`：普通按钮
  - `"dpad"`：方向键
  - `"zone"`：摇杆区域

- **text**：按钮显示文本
- **id**：按钮唯一标识符
- **location**：按钮位置区域
  - `"left"`：左侧区域
  - `"right"`：右侧区域  
  - `"center"`：中心区域
  - `"top"`：顶部区域

#### 位置参数
- **left**：距离左边的距离（px或百分比）
- **right**：距离右边的距离（px）
- **top**：距离顶部的距离（px）

#### 样式参数
- **bold**：是否粗体显示（boolean）
- **fontSize**：字体大小（px）
- **block**：是否块级显示（boolean）

#### 功能参数
- **input_value**：输入值ID
- **inputValues**：输入值数组（用于方向键和摇杆）
- **joystickInput**：是否为摇杆输入（boolean）

### 街机游戏6按钮布局示例

```javascript
window.EJS_VirtualGamepadSettings = [
    // 街机6按钮布局（街霸风格）
    { "type": "button", "text": "LP", "id": "lp", "location": "right", "left": 10, "top": 20, "input_value": 9 },
    { "type": "button", "text": "MP", "id": "mp", "location": "right", "left": 60, "top": 20, "input_value": 1 },
    { "type": "button", "text": "HP", "id": "hp", "location": "right", "left": 110, "top": 20, "input_value": 10 },
    { "type": "button", "text": "LK", "id": "lk", "location": "right", "left": 10, "top": 80, "input_value": 8 },
    { "type": "button", "text": "MK", "id": "mk", "location": "right", "left": 60, "top": 80, "input_value": 0 },
    { "type": "button", "text": "HK", "id": "hk", "location": "right", "left": 110, "top": 80, "input_value": 11 },
    { "type": "zone", "id": "joystick", "location": "left", "left": "50%", "top": "50%", "joystickInput": true, "inputValues": [4, 5, 6, 7] },
    { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 30, "fontSize": 15, "block": true, "input_value": 3 },
    { "type": "button", "text": "Coin", "id": "coin", "location": "center", "left": -30, "fontSize": 15, "block": true, "input_value": 2 }
];
```

## 样式自定义

### CSS 类说明

#### 容器类
```css
.ejs_virtualGamepad_parent {
    width: 100%;
    position: absolute;
    bottom: 50px;
}
```

#### 区域类
```css
.ejs_virtualGamepad_left {
    position: absolute;
    bottom: 50px;
    width: 125px;
    height: 125px;
    left: 10px;
}

.ejs_virtualGamepad_right {
    position: absolute;
    bottom: 50px;
    width: 130px;
    height: 130px;
    right: 10px;
}
```

#### 按钮类
```css
.ejs_virtualGamepad_button {
    position: absolute;
    font-size: 20px;
    width: 50px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    border: 1px solid #ccc;
    border-radius: 50%;
    font-weight: bold;
    background-color: rgba(255, 255, 255, 0.15);
    user-select: none;
    transition: all .2s;
}

.ejs_virtualGamepad_button_down {
    background-color: #000000ad;
}
```

### 自定义样式示例

```css
/* 自定义FC按钮样式 */
.ejs_virtualGamepad_button {
    background-color: rgba(255, 0, 0, 0.3); /* 红色半透明背景 */
    border: 2px solid #ff0000; /* 红色边框 */
    color: white;
    font-size: 18px;
}

/* 按下状态 */
.ejs_virtualGamepad_button_down {
    background-color: rgba(255, 0, 0, 0.8);
    transform: scale(0.95);
}

/* 方向键样式 */
.ejs_dpad_main {
    opacity: 0.8;
    background-color: rgba(0, 0, 255, 0.2); /* 蓝色半透明 */
}
```

## 使用示例

### 完整的FC模拟器页面示例

```html
<!DOCTYPE html>
<html>
<head>
    <title>FC模拟器 - 自定义虚拟按钮</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
    <div id="game"></div>
    
    <script>
    // FC模拟器虚拟按钮配置
    window.EJS_VirtualGamepadSettings = [
        {
            "type": "button",
            "text": "A",
            "id": "a",
            "location": "right",
            "right": 10,
            "top": 70,
            "bold": true,
            "input_value": 8
        },
        {
            "type": "button", 
            "text": "B",
            "id": "b",
            "location": "right",
            "right": 70,
            "top": 70,
            "bold": true,
            "input_value": 0
        },
        {
            "type": "dpad",
            "id": "dpad",
            "location": "left",
            "left": "50%",
            "top": "50%",
            "joystickInput": false,
            "inputValues": [4, 5, 6, 7]
        },
        {
            "type": "button",
            "text": "Start",
            "id": "start",
            "location": "center",
            "left": 60,
            "fontSize": 15,
            "block": true,
            "input_value": 3
        },
        {
            "type": "button",
            "text": "Select", 
            "id": "select",
            "location": "center",
            "left": -5,
            "fontSize": 15,
            "block": true,
            "input_value": 2
        }
    ];
    
    // EmulatorJS 配置
    window.EJS_player = '#game';
    window.EJS_gameUrl = 'games/mario.nes';
    window.EJS_core = 'nes';
    window.EJS_pathtodata = 'data/';
    </script>
    
    <script src="data/loader.js"></script>
</body>
</html>
```

### 街机游戏页面示例

```html
<!DOCTYPE html>
<html>
<head>
    <title>街机模拟器 - 6按钮布局</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
    <div id="game"></div>
    
    <script>
    // 街机6按钮布局配置
    window.EJS_VirtualGamepadSettings = [
        // 上排拳击按钮
        { "type": "button", "text": "LP", "id": "lp", "location": "right", "left": 0, "top": 10, "fontSize": 14, "input_value": 9 },
        { "type": "button", "text": "MP", "id": "mp", "location": "right", "left": 50, "top": 10, "fontSize": 14, "input_value": 1 },
        { "type": "button", "text": "HP", "id": "hp", "location": "right", "left": 100, "top": 10, "fontSize": 14, "input_value": 10 },
        
        // 下排踢击按钮
        { "type": "button", "text": "LK", "id": "lk", "location": "right", "left": 0, "top": 70, "fontSize": 14, "input_value": 8 },
        { "type": "button", "text": "MK", "id": "mk", "location": "right", "left": 50, "top": 70, "fontSize": 14, "input_value": 0 },
        { "type": "button", "text": "HK", "id": "hk", "location": "right", "left": 100, "top": 70, "fontSize": 14, "input_value": 11 },
        
        // 摇杆
        { "type": "zone", "id": "joystick", "location": "left", "left": "50%", "top": "50%", "joystickInput": true, "inputValues": [4, 5, 6, 7] },
        
        // 系统按钮
        { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 40, "fontSize": 15, "block": true, "input_value": 3 },
        { "type": "button", "text": "Coin", "id": "coin", "location": "center", "left": -20, "fontSize": 15, "block": true, "input_value": 2 }
    ];
    
    // EmulatorJS 配置
    window.EJS_player = '#game';
    window.EJS_gameUrl = 'games/sf2.zip';
    window.EJS_core = 'arcade';
    window.EJS_pathtodata = 'data/';
    </script>
    
    <script src="data/loader.js"></script>
</body>
</html>
```

## 设置菜单配置

### 虚拟按钮设置选项

虚拟按钮的设置菜单配置位于 `data/src/emulator.js` 第5055-5070行：

```javascript
if (this.touch || this.hasTouchScreen) {
    const virtualGamepad = createSettingParent(true, "Virtual Gamepad", home);
    
    addToMenu(this.localization("Virtual Gamepad"), "virtual-gamepad", {
        "enabled": this.localization("Enabled"),
        "disabled": this.localization("Disabled")
    }, this.isMobile ? "enabled" : "disabled", virtualGamepad, true);
    
    addToMenu(this.localization("Menu Bar Button"), "menu-bar-button", {
        "visible": this.localization("visible"),
        "hidden": this.localization("hidden")
    }, "visible", virtualGamepad, true);
    
    addToMenu(this.localization("Left Handed Mode"), "virtual-gamepad-left-handed-mode", {
        "enabled": this.localization("Enabled"),
        "disabled": this.localization("Disabled")
    }, "disabled", virtualGamepad, true);
    
    checkForEmptyMenu(virtualGamepad);
}
```

### 设置选项说明

1. **Virtual Gamepad**：开启/关闭虚拟按钮显示
2. **Menu Bar Button**：显示/隐藏菜单栏按钮
3. **Left Handed Mode**：左手模式，交换左右区域位置

### 设置值处理

设置值的处理逻辑位于第4290-4300行：

```javascript
if (id === "virtual-gamepad") {
    this.toggleVirtualGamepad(value !== "disabled");
} else if (id === "virtual-gamepad-left-handed-mode") {
    this.toggleVirtualGamepadLeftHanded(value !== "disabled");
}
```

## 故障排除

### 常见问题

#### 1. 虚拟按钮不显示
**可能原因**：
- 设备未检测为触摸设备
- 虚拟按钮被禁用

**解决方法**：
```javascript
// 强制启用虚拟按钮
window.EJS_VirtualGamepadSettings = [...]; // 设置自定义配置
// 或在设置菜单中启用虚拟按钮
```

#### 2. 按钮位置不正确
**可能原因**：
- 位置参数设置错误
- 屏幕尺寸适配问题

**解决方法**：
```javascript
// 调整位置参数
{
    "type": "button",
    "left": 50,  // 调整左边距
    "top": 60,   // 调整上边距
    "right": 10  // 或使用右边距
}
```

#### 3. 按钮无响应
**可能原因**：
- `input_value` 设置错误
- 按钮类型不匹配

**解决方法**：
```javascript
// 检查输入值映射
{
    "input_value": 0,  // 确保输入值正确
    "type": "button"   // 确保类型正确
}
```

#### 4. 自定义配置无效
**可能原因**：
- 配置格式错误
- 必需参数缺失

**解决方法**：
```javascript
// 完整的按钮配置示例
{
    "type": "button",        // 必需
    "text": "A",            // 必需
    "id": "a",              // 必需
    "location": "right",     // 必需
    "input_value": 8         // 必需
}
```

### 调试技巧

#### 1. 开启调试模式
```javascript
window.EJS_DEBUG_XX = true;
```

#### 2. 检查配置有效性
配置验证逻辑位于第3486-3527行，会在控制台输出警告信息。

#### 3. 检查CSS样式
使用浏览器开发者工具检查虚拟按钮的CSS类是否正确应用。

#### 4. 测试输入值
可以通过控制台手动触发输入来测试：
```javascript
// 测试按钮输入
emulator.gameManager.simulateInput(0, 8, 1); // 按下A按钮
emulator.gameManager.simulateInput(0, 8, 0); // 释放A按钮
```

## 总结

EmulatorJS 的虚拟按钮系统提供了灵活而强大的配置选项，支持从简单的默认布局到完全自定义的复杂配置。通过理解核心代码结构和配置参数，开发者可以为不同类型的游戏创建最适合的触摸控制界面。

关键要点：
- 了解不同游戏机类型的默认配置
- 掌握自定义配置的参数结构
- 合理使用CSS样式进行外观定制
- 注意移动设备的触摸体验优化
- 利用调试工具解决配置问题

通过本文档的指导，您应该能够成功配置和自定义 EmulatorJS 的虚拟按钮系统。 