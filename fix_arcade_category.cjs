// 修复街机分类的国际化键
const fs = require('fs')

// 读取文件
const content = fs.readFileSync('public/data/categories.json', 'utf8')

// 替换街机主分类的描述
const updatedContent = content.replace(
  '"description": "经典街机游戏合集，包含格斗、射击、动作等各类经典街机游戏",',
  '"descriptionKey": "categories.arcade.description",'
)

// 写回文件
fs.writeFileSync('public/data/categories.json', updatedContent)

console.log('已修复街机分类的国际化键')