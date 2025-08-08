const fs = require('fs');
const path = require('path');

// 读取图片文件夹中的所有文件
const imagesDir = path.join(__dirname, '../public/roms/images/fc');
const outputFile = 'fc_new.json'; // 直接输出到当前目录

// 游戏分类映射规则
const categoryMapping = {
  // 动作类关键词
  'action': ['冒险岛', '马里奥', '超级马', '魂斗罗', '忍者', '龙剑传', '恶魔城', '洛克人', '成龙', '踢王', '激龟', '双截龙', '怒', '街头霸王', '拳皇', '快打旋风'],
  // 射击类关键词  
  'stg': ['沙罗曼蛇', '宇宙巡航', '雷电', '1942', '1943', '坦克', '空狼', '飞狼', '战机', '银河', '星际战士', '飞机', '射击'],
  // 角色扮演类关键词
  'rpg': ['最终幻想', '勇者斗恶龙', '重装机兵', '火焰纹章', '女神转生', '伊苏', '西游记', '封神榜', '圣铃传说', '霸王', '三国'],
  // 益智类关键词
  'puzzle': ['俄罗斯方块', '泡泡龙', '推箱子', '拼图', '消除', '方块', '益智', '黑白棋', '五子棋', '纸牌', '扑克'],
  // 体育类关键词
  'spg': ['足球', '篮球', '网球', '高尔夫', '棒球', '热血', '运动', '体育', '赛车', '摩托', 'F1', '赛跑'],
  // 桌游类关键词
  'tab': ['麻将', '扑克', '21点', '黑杰克', '棋', '牌', '象棋', '围棋'],
  // 其他类为默认分类
  'etc': []
};

// 根据游戏名判断分类
function getGameCategory(gameName) {
  for (const [category, keywords] of Object.entries(categoryMapping)) {
    if (category === 'etc') continue; // 跳过其他类，作为默认值
    
    for (const keyword of keywords) {
      if (gameName.includes(keyword)) {
        return `fc-${category}`;
      }
    }
  }
  return 'fc-etc'; // 默认分类
}

// 清理游戏名称，移除版本信息和修饰词
function cleanGameName(fileName) {
  let gameName = fileName.replace('-0.png', '');
  
  // 移除编号前缀（如 "1.", "100.", "12人街霸" 等）
  gameName = gameName.replace(/^\d+\./, '');
  
  // 移除常见的修饰词
  const modifiers = [
    '无敌版', '无限版', '加强版', '超级版', 'HACK版', 'hack版', 'Hack版',
    '修改版', '完美版', '特别版', '完全版', '最终版', '中文版', '汉化版',
    '不死版', '无限血版', '无限命版', '无限人版', '人数版', '生命版', '弹药版',
    '无敌', '无限血', '无限命', '无限人', '人数不减', '生命不减', '弹药不减',
    '不死', '不减血', '不减命', '不减', '全满',
    'ＨＡＣＫ', 'Beta', 'beta', 'BETA',
    '\\(无敌版\\)', '\\(加强版\\)', '\\(超级版\\)', '\\(修改版\\)', '\\(完美版\\)',
    '\\(无限.*?\\)', '\\[.*?汉化.*?\\]', '\\[.*?HACK.*?\\]'
  ];
  
  for (const modifier of modifiers) {
    gameName = gameName.replace(new RegExp(modifier, 'gi'), '');
  }
  
  // 清理特殊字符和多余空格
  gameName = gameName.replace(/[()（）\[\]【】{}]/g, ''); // 移除括号
  gameName = gameName.replace(/[-_\s]+/g, ' '); // 统一分隔符为空格
  gameName = gameName.replace(/\s+/g, ' ').trim(); // 合并多个空格
  
  // 如果清理后为空或太短，返回原始名称的清理版本
  if (!gameName || gameName.length < 2) {
    gameName = fileName.replace('-0.png', '').replace(/^\d+\./, '');
  }
  
  return gameName;
}

// 生成游戏ID
function generateGameId(fileName) {
  const baseName = fileName.replace('-0.png', '');
  // 创建更简洁的ID
  let id = baseName
    .replace(/^\d+\./, '') // 移除数字前缀
    .replace(/[^\w\u4e00-\u9fff]/g, '-') // 非字母数字汉字替换为破折号
    .replace(/-+/g, '-') // 合并多个破折号
    .replace(/^-|-$/g, '') // 移除首尾破折号
    .toLowerCase();
  
  return `fc-${id}`;
}

// 生成描述
function generateDescription(gameName, originalName) {
  const category = getGameCategory(originalName);
  const categoryNames = {
    'fc-action': '动作',
    'fc-stg': '射击',
    'fc-rpg': '角色扮演',
    'fc-puzzle': '益智',
    'fc-spg': '体育',
    'fc-tab': '桌游',
    'fc-etc': '经典'
  };
  
  const categoryName = categoryNames[category] || '经典';
  return `${gameName} - ${categoryName}FC游戏`;
}

console.log('开始生成FC游戏数据...');
console.log('图片目录:', imagesDir);
console.log('输出文件:', outputFile);

try {
  // 检查目录是否存在
  if (!fs.existsSync(imagesDir)) {
    throw new Error(`图片目录不存在: ${imagesDir}`);
  }
  
  // 读取图片文件列表
  const imageFiles = fs.readdirSync(imagesDir)
    .filter(file => file.endsWith('-0.png'))
    .sort();
  
  console.log(`找到 ${imageFiles.length} 个图片文件`);
  
  // 生成游戏数据
  const games = imageFiles.map((fileName, index) => {
    const originalName = fileName.replace('-0.png', '');
    const cleanName = cleanGameName(fileName);
    const gameId = generateGameId(fileName);
    const category = getGameCategory(originalName);
    const romFileName = originalName + '.nes';
    
    // 显示处理进度
    if (index % 500 === 0) {
      console.log(`处理进度: ${index + 1}/${imageFiles.length}`);
    }
    
    return {
      id: gameId,
      name: cleanName,
      platform: "fc",
      subCategory: category,
      romPath: `/roms/fc/${romFileName}`,
      cover: `/roms/images/fc/${fileName}`,
      core: "fceumm",
      author: "未知",
      region: "CN",
      size: "未知",
      version: "",
      description: generateDescription(cleanName, originalName),
      playCount: 0
    };
  });
  
  // 写入JSON文件
  fs.writeFileSync(outputFile, JSON.stringify(games, null, 2), 'utf8');
  
  console.log(`成功生成 ${games.length} 个游戏条目`);
  console.log(`文件已保存到: ${path.resolve(outputFile)}`);
  
  // 统计各分类数量
  const categoryStats = {};
  games.forEach(game => {
    categoryStats[game.subCategory] = (categoryStats[game.subCategory] || 0) + 1;
  });
  
  console.log('\n分类统计:');
  Object.entries(categoryStats)
    .sort(([,a], [,b]) => b - a) // 按数量排序
    .forEach(([category, count]) => {
      console.log(`${category}: ${count} 个游戏`);
    });
  
  // 显示一些示例
  console.log('\n前10个游戏示例:');
  games.slice(0, 10).forEach(game => {
    console.log(`- ${game.name} (${game.subCategory})`);
  });
  
} catch (error) {
  console.error('生成过程中出现错误:', error);
} 