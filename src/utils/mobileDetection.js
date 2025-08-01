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
 * 获取FC/NES游戏的虚拟手柄配置 (4按钮布局)
 * @param {string} orientation 设备方向
 * @returns {Array}
 */
export function getFCVirtualGamepadSettings(orientation = 'landscape') {
  const isPortrait = orientation === 'portrait'
  
  return [
    // 方向键 (左侧，与右侧按钮对称)
    {
      type: "dpad",
      location: "left",
      left: isPortrait ? "52%" : "30%",
      top: isPortrait ? "69%" : "59%", 
      inputValues: [4, 5, 6, 7], // 上下左右
      size: isPortrait ? 100 : 90
    },
    
    // 右侧4按钮布局 (十字形，与左侧方向键对称)
    // 上按钮: Y
    {
      type: "button",
      text: "Y",
      id: "y",
      location: "right",
      left: isPortrait ? 35 : 2,
      top: isPortrait ? 10 : 0,
      bold: true,
      input_value: 9, // Y按钮
      size: isPortrait ? 45 : 42
    },
    
    // 左按钮: X
    {
      type: "button", 
      text: "X",
      id: "x",
      location: "right",
      left: isPortrait ? -10 : -40,
      top: isPortrait ? 50 : 40, // 与方向键中心对齐
      bold: true,
      input_value: 1, // X按钮
      size: isPortrait ? 45 : 42
    },
    
    // 右按钮: A (FC传统布局)
    {
      type: "button",
      text: "A",
      id: "a",
      location: "right",
      left: isPortrait ? 82 : 49,
      top: isPortrait ? 50 : 40, // 与方向键中心对齐
      bold: true,
      input_value: 8, // A按钮
      size: isPortrait ? 45 : 42
    },
    
    // 下按钮: B
    {
      type: "button", 
      text: "B",
      id: "b",
      location: "right",
      left: isPortrait ? 35 : 2,
      top: isPortrait ? 90 : 80,
      bold: true,
      input_value: 0, // B按钮
      size: isPortrait ? 45 : 42
    },
    
    // 系统按钮 (通过CSS样式设置为圆角长方形)
    {
      type: "button",
      text: "SELECT",
      id: "select",
      location: "center",
      left: isPortrait ? 25 : 30, // 按钮中心位置
      top: isPortrait ? 35 : 20,
      bold: false,
      input_value: 2,
      size: isPortrait ? 35 : 30
    },
    {
      type: "button",
      text: "START",
      id: "start",
      location: "center",
      left: isPortrait ? 75 : 70, // 按钮中心位置
      top: isPortrait ? 35 : 20,
      bold: false,
      input_value: 3,
      size: isPortrait ? 35 : 30
    }
  ]
}

/**
 * 获取MAME街机游戏的虚拟手柄配置 (4按钮布局)
 * @param {string} orientation 设备方向
 * @returns {Array}
 */
export function getMAMEVirtualGamepadSettings(orientation = 'landscape') {
  const isPortrait = orientation === 'portrait'
  
  return [
    // 摇杆 (左侧，与右侧按钮对称)
    {
      type: "dpad",
      location: "left",
      left: isPortrait ? "22%" : "30%",
      top: isPortrait ? "69%" : "59%", // 与右侧按钮中心对齐
      inputValues: [4, 5, 6, 7], // 上下左右
      size: isPortrait ? 110 : 100
    },
    
    // 右侧4按钮布局 (十字形，与左侧摇杆对称)
    // 上按钮: 1
    {
      type: "button",
      text: "1",
      id: "btn1",
      location: "right",
      left: isPortrait ? 45 : 22,
      top: isPortrait ? 10 : 0,
      bold: true,
      input_value: 0, // 按钮1
      size: isPortrait ? 25 : 22
    },
    
    // 左按钮: 4
    {
      type: "button", 
      text: "4",
      id: "btn4",
      location: "right",
      left: isPortrait ? 3 : -20,
      top: isPortrait ? 50 : 40, // 与摇杆中心对齐
      bold: true,
      input_value: 9, // 按钮4
      size: isPortrait ? 25 : 22
    },
    
    // 右按钮: 2
    {
      type: "button", 
      text: "2",
      id: "btn2",
      location: "right",
      left: isPortrait ? 85 : 62,
      top: isPortrait ? 50 : 40, // 与摇杆中心对齐
      bold: true,
      input_value: 8, // 按钮2
      size: isPortrait ? 25 : 22
    },
    
    // 下按钮: 3
    {
      type: "button",
      text: "3",
      id: "btn3",
      location: "right",
      left: isPortrait ? 45 : 22,
      top: isPortrait ? 90 : 80,
      bold: true,
      input_value: 1, // 按钮3
      size: isPortrait ? 25 : 22  
    },
    
    // 系统按钮 (通过CSS样式设置为圆角长方形)
    {
      type: "button",
      text: "COIN",
      id: "coin",
      location: "center",
      left: isPortrait ? 25 : 30, // 按钮中心位置
      top: isPortrait ? 20 : 15,
      bold: false,
      input_value: 2, // SELECT键作为投币
      size: isPortrait ? 35 : 30
    },
    {
      type: "button",
      text: "START",
      id: "start",
      location: "center",
      left: isPortrait ? 75 : 70, // 按钮中心位置
      top: isPortrait ? 20 : 15,
      bold: false,
      input_value: 3,
      size: isPortrait ? 35 : 30
    }
  ]
}

/**
 * 根据游戏核心获取虚拟手柄配置
 * @param {string} core 游戏核心
 * @param {string} orientation 设备方向
 * @returns {Array}
 */
export function getVirtualGamepadForCore(core, orientation = 'landscape') {
  if (core === 'fceumm' || core === 'nestopia') {
    return getFCVirtualGamepadSettings(orientation)
  } else if (core === 'mame2003' || core === 'mame2003_plus') {
    return getMAMEVirtualGamepadSettings(orientation)
  }
  
  // 默认返回FC配置
  return getFCVirtualGamepadSettings(orientation)
} 