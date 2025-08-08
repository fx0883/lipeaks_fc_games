# EmulatorJS 虚拟按钮快速参考

> **版本说明**：基于 EmulatorJS 4.2.3 版本标准

## FC模拟器默认配置

```javascript
// FC/NES 虚拟按钮配置 (data/src/emulator.js 第3549行)
window.EJS_VirtualGamepadSettings = [
    { "type": "button", "text": "A", "id": "a", "location": "right", "right": 5, "top": 70, "input_value": 8 },
    { "type": "button", "text": "B", "id": "b", "location": "right", "right": 75, "top": 70, "input_value": 0 },
    { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "right": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
    { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "input_value": 3 },
    { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "input_value": 2 }
];
```

## 街机模拟器默认配置

```javascript
// 街机 虚拟按钮配置 (data/src/emulator.js 第3751行)
window.EJS_VirtualGamepadSettings = [
    { "type": "button", "text": "A", "id": "a", "location": "right", "left": 40, "top": 80, "input_value": 0 },
    { "type": "button", "text": "B", "id": "b", "location": "right", "left": 81, "top": 40, "input_value": 8 },
    { "type": "button", "text": "X", "id": "x", "location": "right", "top": 40, "input_value": 1 },
    { "type": "button", "text": "Y", "id": "y", "location": "right", "left": 40, "input_value": 9 },
    { "type": "zone", "id": "dpad", "location": "left", "left": "50%", "top": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
    { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "input_value": 3 },
    { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "input_value": 2 }
];
```

## 街机6按钮布局

```javascript
// 街霸风格6按钮布局
window.EJS_VirtualGamepadSettings = [
    // 上排拳击
    { "type": "button", "text": "LP", "id": "lp", "location": "right", "left": 10, "top": 20, "input_value": 9 },
    { "type": "button", "text": "MP", "id": "mp", "location": "right", "left": 60, "top": 20, "input_value": 1 },
    { "type": "button", "text": "HP", "id": "hp", "location": "right", "left": 110, "top": 20, "input_value": 10 },
    // 下排踢击
    { "type": "button", "text": "LK", "id": "lk", "location": "right", "left": 10, "top": 80, "input_value": 8 },
    { "type": "button", "text": "MK", "id": "mk", "location": "right", "left": 60, "top": 80, "input_value": 0 },
    { "type": "button", "text": "HK", "id": "hk", "location": "right", "left": 110, "top": 80, "input_value": 11 },
    // 摇杆和系统按钮
    { "type": "zone", "id": "joystick", "location": "left", "joystickInput": true, "inputValues": [4, 5, 6, 7] },
    { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 30, "input_value": 3 },
    { "type": "button", "text": "Coin", "id": "coin", "location": "center", "left": -30, "input_value": 2 }
];
```

## 参数说明

| 参数 | 类型 | 说明 | 示例 |
|------|------|------|------|
| `type` | string | 按钮类型: `"button"`, `"dpad"`, `"zone"` | `"button"` |
| `text` | string | 按钮显示文本 | `"A"` |
| `id` | string | 按钮唯一标识 | `"a"` |
| `location` | string | 位置区域: `"left"`, `"right"`, `"center"`, `"top"` | `"right"` |
| `left` | number/string | 左边距(px或%) | `40` 或 `"50%"` |
| `right` | number | 右边距(px) | `10` |
| `top` | number | 上边距(px) | `70` |
| `input_value` | number | 输入值ID | `8` |
| `inputValues` | array | 输入值数组(方向键) | `[4, 5, 6, 7]` |
| `fontSize` | number | 字体大小(px) | `15` |
| `bold` | boolean | 粗体显示 | `true` |
| `block` | boolean | 块级显示 | `true` |
| `joystickInput` | boolean | 摇杆输入模式 | `false` |

## 输入值映射

| 输入值 | FC/NES | 街机 | 说明 |
|--------|--------|------|------|
| 0 | B按钮 | A按钮 | 主要动作按钮 |
| 1 | - | X按钮 | 次要动作按钮 |
| 2 | Select | Select/Coin | 选择/投币 |
| 3 | Start | Start | 开始按钮 |
| 4 | 上 | 上 | 方向键上 |
| 5 | 下 | 下 | 方向键下 |
| 6 | 左 | 左 | 方向键左 |
| 7 | 右 | 右 | 方向键右 |
| 8 | A按钮 | B按钮 | 次要/主要动作 |
| 9 | - | Y按钮 | 动作按钮 |
| 10 | L肩键 | L1肩键 | 左肩键 |
| 11 | R肩键 | R1肩键 | 右肩键 |

## 核心文件位置

- **主配置**: `data/src/emulator.js` (第3469行 `setVirtualGamepad()`)
- **FC配置**: `data/src/emulator.js` (第3549-3557行)
- **街机配置**: `data/src/emulator.js` (第3751-3760行)
- **样式文件**: `data/emulator.css` (第708-800行)
- **加载器**: `data/loader.js` (第92行)

## 快速使用

1. 在HTML页面中设置 `window.EJS_VirtualGamepadSettings`
2. 配置 EmulatorJS 基本参数
3. 加载 `data/loader.js`

```html
<script>
// 1. 设置虚拟按钮
window.EJS_VirtualGamepadSettings = [...];

// 2. 配置模拟器
window.EJS_player = '#game';
window.EJS_gameUrl = 'game.nes';
window.EJS_core = 'nes';
window.EJS_pathtodata = 'data/';
</script>

<!-- 3. 加载模拟器 -->
<script src="data/loader.js"></script>
``` 