// 批量重命名中文文件名为英文（拼音）
// Copyright (C) 2024 Lipeaks FC Games

const fs = require('fs');
const path = require('path');

// 简化的中文拼音映射表
const pinyinMap = {
  // 常用汉字拼音映射
  '恶': 'e', '魔': 'mo', '城': 'cheng', '无': 'wu', '敌': 'di', '版': 'ban',
  '古': 'gu', '巴': 'ba', '战': 'zhan', '士': 'shi', '闪': 'shan', '烁': 'shuo', '不': 'bu', '死': 'si',
  '能': 'neng', '源': 'yuan', '有': 'you', '限': 'xian', '生': 'sheng', '命': 'ming', '血': 'xue',
  '人': 'ren', '物': 'wu', '骷': 'ku', '髅': 'lou', '僵': 'jiang', '尸': 'shi',
  '冒': 'mao', '险': 'xian', '岛': 'dao', '完': 'wan', '全': 'quan',
  '龙': 'long', '忍': 'ren', '者': 'zhe', '神': 'shen', '龟': 'gui', '传': 'chuan',
  '成': 'cheng', '加': 'jia', '强': 'qiang', '激': 'ji', '海': 'hai', '盗': 'dao',
  '街': 'jie', '霸': 'ba', '王': 'wang', '超': 'chao', '级': 'ji', '马': 'ma', '里': 'li', '奥': 'ao',
  '踢': 'ti', '主': 'zhu', '角': 'jiao', '怒': 'nu', '洛': 'luo', '克': 'ke',
  '魂': 'hun', '斗': 'dou', '罗': 'luo', '代': 'dai', '散': 'san', '弹': 'dan', '枪': 'qiang',
  '隐': 'yin', '藏': 'cang', '子': 'zi', '星': 'xing', '际': 'ji', '增': 'zeng', '音': 'yin', '乐': 'le',
  '测': 'ce', '试': 'shi', '选': 'xuan', '关': 'guan', '世': 'shi', '嘉': 'jia', '体': 'ti', '力': 'li',
  '中': 'zhong', '文': 'wen', '减': 'jian', '剑': 'jian', '外': 'wai', '模': 'mo', '式': 'shi',
  '假': 'jia', '面': 'mian', '花': 'hua', '丸': 'wan', '释': 'shi', '放': 'fang', '术': 'shu', '消': 'xiao', '耗': 'hao',
  '空': 'kong', '百': 'bai', '弹': 'dan', '药': 'yao', '快': 'kuai', '速': 'su', '升': 'sheng', '套': 'tao', '道': 'dao', '具': 'ju',
  '魔': 'mo', '法': 'fa', '技': 'ji', '能': 'neng', '熊': 'xiong', '猫': 'mao',
  '马': 'ma', '博': 'bo', '赤': 'chi', '影': 'ying', '高': 'gao', '艳': 'yan',
  '功': 'gong', '夫': 'fu', '双': 'shuang', '截': 'jie', '复': 'fu', '仇': 'chou', '塔': 'ta', '石': 'shi',
  '背': 'bei', '叛': 'pan', '佛': 'fo', '易': 'yi', '组': 'zu', '吸': 'xi', '男': 'nan', '爵': 'jue',
  '靳': 'jin', '大': 'da', '治': 'zhi', '阿': 'a', '渊': 'yuan', '幻': 'huan', '想': 'xiang',
  '刀': 'dao', '魂': 'hun', '魄': 'po', '少': 'shao', '年': 'nian', '拳': 'quan', '皇': 'huang',
  '说': 'shuo', '使': 'shi', '徒': 'tu', '牙': 'ya', '章': 'zhang', '金': 'jin', '明': 'ming',
  '赛': 'sai', '车': 'che', '音': 'yin', '速': 'su', '机': 'ji', '械': 'xie', '坦': 'tan', '克': 'ke',
  '银': 'yin', '河': 'he', '号': 'hao', '宇': 'yu', '宙': 'zhou', '巡': 'xun', '航': 'hang',
  '赌': 'du', '沙': 'sha', '曼': 'man', '蛇': 'she', '极': 'ji', '上': 'shang', '后': 'hou', '原': 'yuan', '地': 'di',
  '复': 'fu', '活': 'huo', '保': 'bao', '留': 'liu', '武': 'wu', '器': 'qi', '随': 'sui', '附': 'fu',
  '护': 'hu', '盾': 'dun', '帝': 'di', '国': 'guo', '第': 'di', '二': 'er', '次': 'ci', '器': 'qi', '人': 'ren',
  '幅': 'fu', '唯': 'wei', '一': 'yi', '纳': 'na', '梦': 'meng', '幻': 'huan'
};

// 中文字符转拼音
function chineseToPinyin(chinese) {
  return chinese.split('').map(char => {
    return pinyinMap[char] || char;
  }).join('');
}

// 文件名安全化处理
function sanitizeFileName(filename) {
  return filename
    // 中文转拼音
    .replace(/[\u4e00-\u9fff]/g, char => pinyinMap[char] || 'x')
    // 替换特殊字符为连字符
    .replace(/[\s\(\)\[\]（）【】\+\-\=\_\.\,\!\@\#\$\%\^\&\*\~\`\;\:\'\"\?\/\\\|\<\>]/g, '-')
    // 移除连续的连字符
    .replace(/-+/g, '-')
    // 移除开头和结尾的连字符
    .replace(/^-+|-+$/g, '')
    // 转为小写
    .toLowerCase();
}

// 生成新文件名（去除数字前缀）
function generateNewFileName(oldFileName) {
  const ext = path.extname(oldFileName);
  const nameWithoutExt = path.basename(oldFileName, ext);
  
  // 移除开头的数字前缀（如 "100."）
  const nameWithoutPrefix = nameWithoutExt.replace(/^\d+\./, '');
  
  // 安全化处理
  const safeName = sanitizeFileName(nameWithoutPrefix);
  
  return safeName + ext;
}

// 确保文件名唯一性
function ensureUniqueFileName(newFileName, existingNames, basePath) {
  const ext = path.extname(newFileName);
  const nameWithoutExt = path.basename(newFileName, ext);
  
  let counter = 1;
  let uniqueName = newFileName;
  
  while (existingNames.has(uniqueName) || fs.existsSync(path.join(basePath, uniqueName))) {
    uniqueName = `${nameWithoutExt}-${counter}${ext}`;
    counter++;
  }
  
  return uniqueName;
}

// 扫描目录获取所有需要重命名的文件
function scanChineseFiles(dirPath) {
  const files = [];
  
  if (!fs.existsSync(dirPath)) {
    console.log(`目录不存在: ${dirPath}`);
    return files;
  }
  
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isFile() && /[\u4e00-\u9fff]/.test(item)) {
      files.push({
        oldPath: fullPath,
        oldName: item,
        dirPath: dirPath
      });
    }
  }
  
  return files;
}

// 生成文件重命名映射
function generateFileMapping() {
  console.log('📊 扫描需要重命名的文件...');
  
  // FC ROM 文件
  const fcRomFiles = scanChineseFiles('public/roms/fc');
  console.log(`发现 FC ROM 文件: ${fcRomFiles.length} 个`);
  
  // FC 截图文件
  const fcImageFiles = scanChineseFiles('public/roms/images/fc');
  console.log(`发现 FC 截图文件: ${fcImageFiles.length} 个`);
  
  const allFiles = [...fcRomFiles, ...fcImageFiles];
  const mapping = [];
  const usedNames = new Set();
  
  for (const file of allFiles) {
    const newName = generateNewFileName(file.oldName);
    const uniqueName = ensureUniqueFileName(newName, usedNames, file.dirPath);
    
    usedNames.add(uniqueName);
    
    mapping.push({
      oldPath: file.oldPath,
      newPath: path.join(file.dirPath, uniqueName),
      oldName: file.oldName,
      newName: uniqueName,
      type: file.dirPath.includes('images') ? 'image' : 'rom'
    });
  }
  
  return mapping;
}

// 执行文件重命名
function renameFiles(mapping) {
  console.log('🔄 开始重命名文件...');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const item of mapping) {
    try {
      fs.renameSync(item.oldPath, item.newPath);
      console.log(`✅ ${item.oldName} → ${item.newName}`);
      successCount++;
    } catch (error) {
      console.error(`❌ 重命名失败: ${item.oldName} - ${error.message}`);
      errorCount++;
    }
  }
  
  console.log(`\n📊 重命名统计: 成功 ${successCount} 个, 失败 ${errorCount} 个`);
  return mapping;
}

// 更新JSON文件中的路径引用
function updateJsonFiles(mapping) {
  console.log('📝 更新JSON文件中的路径引用...');
  
  // 创建路径映射表
  const pathMapping = {};
  mapping.forEach(item => {
    if (item.type === 'rom') {
      pathMapping[`/roms/fc/${item.oldName}`] = `/roms/fc/${item.newName}`;
    } else if (item.type === 'image') {
      pathMapping[`/roms/images/fc/${item.oldName}`] = `/roms/images/fc/${item.newName}`;
    }
  });
  
  // 更新FC游戏JSON文件
  const fcJsonDir = 'public/data/games/fc';
  const jsonFiles = fs.readdirSync(fcJsonDir).filter(f => f.endsWith('.json'));
  
  let totalUpdates = 0;
  
  for (const jsonFile of jsonFiles) {
    const jsonPath = path.join(fcJsonDir, jsonFile);
    console.log(`更新文件: ${jsonFile}`);
    
    try {
      const content = fs.readFileSync(jsonPath, 'utf8');
      let updatedContent = content;
      let fileUpdates = 0;
      
      // 替换所有路径引用
      for (const [oldPath, newPath] of Object.entries(pathMapping)) {
        const regex = new RegExp(oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        const matches = updatedContent.match(regex);
        if (matches) {
          updatedContent = updatedContent.replace(regex, newPath);
          fileUpdates += matches.length;
        }
      }
      
      if (fileUpdates > 0) {
        fs.writeFileSync(jsonPath, updatedContent, 'utf8');
        console.log(`  ✅ 更新了 ${fileUpdates} 个路径引用`);
        totalUpdates += fileUpdates;
      } else {
        console.log(`  ℹ️  无需更新`);
      }
      
    } catch (error) {
      console.error(`  ❌ 更新失败: ${error.message}`);
    }
  }
  
  console.log(`\n📊 JSON更新统计: 总共更新 ${totalUpdates} 个路径引用`);
}

// 验证重命名结果
function verifyRenaming(mapping) {
  console.log('🔍 验证重命名结果...');
  
  let successCount = 0;
  let missingCount = 0;
  
  for (const item of mapping) {
    if (fs.existsSync(item.newPath)) {
      successCount++;
    } else {
      console.error(`❌ 文件不存在: ${item.newPath}`);
      missingCount++;
    }
  }
  
  console.log(`📊 验证结果: 成功 ${successCount} 个, 缺失 ${missingCount} 个`);
  
  // 验证JSON文件中是否还有中文路径
  console.log('🔍 检查JSON文件中是否还有中文路径...');
  
  const fcJsonDir = 'public/data/games/fc';
  const jsonFiles = fs.readdirSync(fcJsonDir).filter(f => f.endsWith('.json'));
  
  let chinesePathCount = 0;
  
  for (const jsonFile of jsonFiles) {
    const jsonPath = path.join(fcJsonDir, jsonFile);
    const content = fs.readFileSync(jsonPath, 'utf8');
    
    const chineseMatches = content.match(/["']\/roms\/[^"']*[\u4e00-\u9fff][^"']*["']/g);
    if (chineseMatches) {
      console.log(`⚠️  ${jsonFile} 仍包含 ${chineseMatches.length} 个中文路径`);
      chinesePathCount += chineseMatches.length;
    }
  }
  
  if (chinesePathCount === 0) {
    console.log('✅ 所有JSON文件已成功更新，无中文路径残留');
  } else {
    console.log(`⚠️  仍有 ${chinesePathCount} 个中文路径需要处理`);
  }
}

// 主函数
function main() {
  console.log('🚀 开始批量重命名中文文件...\n');
  
  try {
    // 1. 生成文件映射
    const mapping = generateFileMapping();
    
    if (mapping.length === 0) {
      console.log('✅ 没有发现需要重命名的中文文件');
      return;
    }
    
    console.log(`\n📋 总共需要重命名 ${mapping.length} 个文件\n`);
    
    // 2. 执行文件重命名
    renameFiles(mapping);
    
    // 3. 更新JSON文件
    updateJsonFiles(mapping);
    
    // 4. 验证结果
    verifyRenaming(mapping);
    
    console.log('\n🎉 批量重命名任务完成！');
    
  } catch (error) {
    console.error('❌ 执行过程中发生错误:', error.message);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = {
  generateFileMapping,
  renameFiles,
  updateJsonFiles,
  verifyRenaming,
  main
};