// 验证游戏名称翻译
const fs = require('fs');
const path = require('path');

// 读取英文翻译规则
const enTranslations = JSON.parse(fs.readFileSync('src/i18n/locales/en-US.json', 'utf8'));

// 读取一个FC游戏文件
const fcActionGames = JSON.parse(fs.readFileSync('public/data/games/fc/fc-action.json', 'utf8'));

console.log('=== 游戏名称翻译验证 ===\n');

// 模拟翻译函数
function translateGameName(gameName, rules) {
  if (!gameName || !rules) return gameName;
  
  let translatedName = gameName;
  
  // 应用直接映射
  if (rules.directMappings) {
    for (const [chinese, english] of Object.entries(rules.directMappings)) {
      if (translatedName.includes(chinese)) {
        translatedName = translatedName.replace(new RegExp(chinese, 'g'), english);
      }
    }
  }
  
  // 应用版本标识
  if (rules.versionMarkers) {
    for (const [chinese, english] of Object.entries(rules.versionMarkers)) {
      if (translatedName.includes(chinese)) {
        translatedName = translatedName.replace(new RegExp(chinese.replace(/[()[\]]/g, '\\$&'), 'g'), english);
      }
    }
  }
  
  return translatedName;
}

// 测试前10个游戏
const testGames = fcActionGames.slice(0, 10);
const nameRules = enTranslations.games?.nameRules;

console.log('翻译规则检查:');
console.log('- 直接映射数量:', Object.keys(nameRules?.directMappings || {}).length);
console.log('- 版本标识数量:', Object.keys(nameRules?.versionMarkers || {}).length);
console.log();

console.log('游戏名称翻译测试:');
console.log('原始名称 → 翻译名称');
console.log('─'.repeat(50));

testGames.forEach((game, index) => {
  const translated = translateGameName(game.name, nameRules);
  const hasChanged = translated !== game.name;
  const status = hasChanged ? '✅ 已翻译' : '⚪ 无变化';
  
  console.log(`${index + 1}. ${game.name}`);
  console.log(`   → ${translated} ${status}`);
  console.log();
});

console.log('=== 验证完成 ===');