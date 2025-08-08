/**
 * 移动设备检测和触摸控制工具
 */

/**
 * 检测是否为移动设备
 * @returns {boolean}
 */
export function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         ('ontouchstart' in window) ||
         (navigator.maxTouchPoints > 0) ||
         (window.innerWidth <= 768)
}

/**
 * 检测是否为触摸设备
 * @returns {boolean}
 */
export function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

/**
 * 检测设备方向
 * @returns {string} 'portrait' | 'landscape'
 */
export function getDeviceOrientation() {
  return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
}

/**
 * 获取FC/NES游戏的虚拟手柄配置 (标准2按钮布局)
 * @param {string} orientation 设备方向
 * @returns {Array}
 */
export function getFCVirtualGamepadSettings(orientation = 'landscape') {
  // 使用EmulatorJS 4.2.3标准FC配置，不区分横竖屏以保持一致性
  return [
    { "type": "button", "text": "B", "id": "b", "location": "right", "right": 75, "top": 70, "bold": true, "input_value": 0 },
    { "type": "button", "text": "A", "id": "a", "location": "right", "right": 5, "top": 70, "bold": true, "input_value": 8 },
    { "type": "dpad", "id": "dpad", "location": "left", "left": "50%", "right": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
    { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
    { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 }
  ]
}

/**
 * 获取MAME街机游戏的虚拟手柄配置 (标准4按钮布局)
 * @param {string} orientation 设备方向
 * @returns {Array}
 */
export function getMAMEVirtualGamepadSettings(orientation = 'landscape') {
  // 使用EmulatorJS 4.2.3标准街机配置
  return [
    { "type": "button", "text": "Y", "id": "y", "location": "right", "left": 40, "bold": true, "input_value": 9 },
    { "type": "button", "text": "X", "id": "x", "location": "right", "top": 40, "bold": true, "input_value": 1 },
    { "type": "button", "text": "B", "id": "b", "location": "right", "left": 81, "top": 40, "bold": true, "input_value": 8 },
    { "type": "button", "text": "A", "id": "a", "location": "right", "left": 40, "top": 80, "bold": true, "input_value": 0 },
    { "type": "zone", "id": "dpad", "location": "left", "left": "50%", "top": "50%", "joystickInput": false, "inputValues": [4, 5, 6, 7] },
    { "type": "button", "text": "Start", "id": "start", "location": "center", "left": 60, "fontSize": 15, "block": true, "input_value": 3 },
    { "type": "button", "text": "Select", "id": "select", "location": "center", "left": -5, "fontSize": 15, "block": true, "input_value": 2 }
  ]
}

/**
 * 根据游戏核心获取虚拟手柄配置
 * @param {string} core 游戏核心
 * @param {string} orientation 设备方向
 * @returns {Array}
 */
export function getVirtualGamepadForCore(core, orientation = 'landscape') {
  // FC/NES核心
  if (core === 'fceumm' || core === 'nestopia' || core === 'nes') {
    return getFCVirtualGamepadSettings(orientation)
  } 
  // 街机核心
  else if (core === 'mame2003' || core === 'mame2003_plus' || core === 'fbneo' || core === 'fbalpha2012_cps1' || core === 'fbalpha2012_cps2') {
    return getMAMEVirtualGamepadSettings(orientation)
  }
  
  // 默认返回FC配置
  return getFCVirtualGamepadSettings(orientation)
} 