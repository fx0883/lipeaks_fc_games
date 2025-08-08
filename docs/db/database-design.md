# Lipeaks FC Games 数据库设计文档

## 📋 概述

本文档描述了 Lipeaks FC Games 项目的完整数据库设计方案，包括表结构、国际化支持、数据关系和迁移策略。

### 技术选型
- **数据库**：Dexie.js (IndexedDB 封装)
- **数据类型**：JSON 对象存储
- **国际化**：多表翻译策略
- **版本管理**：增量更新机制

---

## 🗄️ 数据库表结构

### 基础数据表

#### 1. `categories` - 游戏分类表
| 字段 | 类型 | 说明 | 索引 |
|------|------|------|------|
| id | string | 分类ID (arcade, action, etc.) | PK |
| cover | string | 封面图片路径 | |
| gamesUrl | string | 原始JSON文件路径(备份) | |
| createdAt | datetime | 创建时间 | |
| updatedAt | datetime | 更新时间 | |

**用途**：存储游戏分类的基础信息，替代原来的 `categories.json` 文件

**示例数据**：
```json
{
  "id": "arcade",
  "cover": "/images/categories/arcade.png",
  "gamesUrl": "/data/games/arcade.json",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

#### 2. `games` - 游戏基础信息表
| 字段 | 类型 | 说明 | 索引 |
|------|------|------|------|
| id | string | 游戏ID (19xx-arcade, contra-fc, etc.) | PK |
| author | string | 游戏作者/开发商 | |
| category | string | 所属分类ID | FK, Index |
| core | string | 模拟器核心 (fceumm, mame2003_plus, etc.) | Index |
| romPath | string | ROM文件路径 | |
| size | string | 游戏大小 | |
| region | string | 地区 (US, JP, etc.) | Index |
| version | string | 版本信息 | |
| cover | string | 封面图片 | |
| playCount | number | 游玩次数(从JSON迁移) | |
| createdAt | datetime | 创建时间 | |
| updatedAt | datetime | 更新时间 | |

**用途**：存储游戏的基础信息，替代原来的所有 `games/*.json` 文件

**示例数据**：
```json
{
  "id": "19xx-arcade",
  "author": "Capcom",
  "category": "arcade",
  "core": "mame2003_plus",
  "romPath": "/roms/19xx.zip",
  "size": "22MB",
  "region": "JP",
  "version": "",
  "cover": "/placeholder.png",
  "playCount": 0,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

---

### 国际化翻译表

#### 3. `categoryTranslations` - 分类翻译表
| 字段 | 类型 | 说明 | 索引 |
|------|------|------|------|
| categoryId | string | 分类ID | FK, PK |
| locale | string | 语言代码 (zh-CN, en-US, ja-JP) | PK |
| name | string | 分类名称 | |
| description | string | 分类描述 | |
| createdAt | datetime | 创建时间 | |
| updatedAt | datetime | 更新时间 | |

**用途**：存储分类的多语言翻译

**示例数据**：
```json
{
  "categoryId": "arcade",
  "locale": "zh-CN",
  "name": "街机",
  "description": "经典街机游戏，包括格斗、射击、动作等各类街机游戏",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

#### 4. `gameTranslations` - 游戏翻译表
| 字段 | 类型 | 说明 | 索引 |
|------|------|------|------|
| gameId | string | 游戏ID | FK, PK |
| locale | string | 语言代码 | PK |
| name | string | 游戏名称 | Index |
| description | string | 游戏描述 | |
| isOriginal | boolean | 是否为原始语言 | |
| translationSource | string | 翻译来源 (official, community, ai) | |
| createdAt | datetime | 创建时间 | |
| updatedAt | datetime | 更新时间 | |

**用途**：存储游戏的多语言翻译

**示例数据**：
```json
{
  "gameId": "19xx-arcade",
  "locale": "zh-CN",
  "name": "19XX：命运之战",
  "description": "19XX: The War Against Destiny是Capcom于1995年推出的经典纵版射击街机游戏...",
  "isOriginal": false,
  "translationSource": "community",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

---

### 统计数据表

#### 5. `gameStats` - 游戏统计表
| 字段 | 类型 | 说明 | 索引 |
|------|------|------|------|
| gameId | string | 游戏ID | PK, FK |
| totalPlayTime | number | 总游玩时间(毫秒) | |
| playCount | number | 游玩次数 | Index |
| highScore | number | 最高分 | |
| fastestTime | number | 最快通关时间(毫秒) | |
| completionRate | number | 完成度百分比(0-100) | |
| rating | number | 用户评分(1-5星) | Index |
| favorited | boolean | 是否收藏 | Index |
| firstPlayed | datetime | 首次游玩时间 | |
| lastPlayed | datetime | 最后游玩时间 | Index |
| createdAt | datetime | 创建时间 | |
| updatedAt | datetime | 更新时间 | |

**用途**：存储每个游戏的综合统计数据

**示例数据**：
```json
{
  "gameId": "19xx-arcade",
  "totalPlayTime": 7200000,
  "playCount": 25,
  "highScore": 99999,
  "fastestTime": 180000,
  "completionRate": 85,
  "rating": 5,
  "favorited": true,
  "firstPlayed": "2024-01-01T10:30:00Z",
  "lastPlayed": "2024-01-15T20:45:00Z",
  "createdAt": "2024-01-01T10:30:00Z",
  "updatedAt": "2024-01-15T20:45:00Z"
}
```

#### 6. `gameSessions` - 游戏会话记录表
| 字段 | 类型 | 说明 | 索引 |
|------|------|------|------|
| id | number | 会话ID(自增) | PK |
| gameId | string | 游戏ID | FK, Index |
| startTime | datetime | 开始时间 | Index |
| endTime | datetime | 结束时间 | |
| duration | number | 游玩时长(毫秒) | |
| score | number | 本次得分 | |
| achievements | string | 本次获得的成就(JSON) | |
| gameState | string | 游戏状态(completed, quit, etc.) | Index |
| createdAt | datetime | 创建时间 | |

**用途**：记录每次游玩的详细会话，用于分析游玩习惯

**示例数据**：
```json
{
  "id": 1,
  "gameId": "19xx-arcade",
  "startTime": "2024-01-15T20:00:00Z",
  "endTime": "2024-01-15T20:45:00Z",
  "duration": 2700000,
  "score": 85000,
  "achievements": "[\"first_boss_defeated\"]",
  "gameState": "completed",
  "createdAt": "2024-01-15T20:00:00Z"
}
```

---

### 用户行为表

#### 7. `achievements` - 成就系统表
| 字段 | 类型 | 说明 | 索引 |
|------|------|------|------|
| id | number | 成就ID(自增) | PK |
| gameId | string | 游戏ID | FK, Index |
| type | string | 成就类型(first_play, high_score, etc.) | Index |
| icon | string | 成就图标 | |
| unlocked | boolean | 是否已解锁 | Index |
| unlockedAt | datetime | 解锁时间 | |
| createdAt | datetime | 创建时间 | |

**用途**：实现成就系统，增加游戏的趣味性

#### 8. `achievementTranslations` - 成就翻译表
| 字段 | 类型 | 说明 | 索引 |
|------|------|------|------|
| achievementId | number | 成就ID | FK, PK |
| locale | string | 语言代码 | PK |
| title | string | 成就标题 | |
| description | string | 成就描述 | |
| createdAt | datetime | 创建时间 | |
| updatedAt | datetime | 更新时间 | |

**用途**：存储成就的多语言翻译

#### 9. `userPreferences` - 用户偏好设置表
| 字段 | 类型 | 说明 | 索引 |
|------|------|------|------|
| key | string | 设置键名 | PK |
| value | string | 设置值(JSON) | |
| type | string | 数据类型(string, number, boolean, object) | |
| description | string | 设置描述 | |
| updatedAt | datetime | 更新时间 | |

**用途**：存储用户的各种偏好设置（语言、音量、主题等）

**示例数据**：
```json
{
  "key": "language",
  "value": "zh-CN",
  "type": "string",
  "description": "界面语言设置",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

---

### 系统数据表

#### 10. `dataVersion` - 数据版本管理表
| 字段 | 类型 | 说明 | 索引 |
|------|------|------|------|
| key | string | 版本键名 | PK |
| version | string | 数据版本号 | |
| lastSync | datetime | 最后同步时间 | |
| checksum | string | 数据校验和 | |
| description | string | 版本描述 | |

**用途**：管理数据版本，支持增量更新和数据校验

#### 11. `searchHistory` - 搜索历史表
| 字段 | 类型 | 说明 | 索引 |
|------|------|------|------|
| id | number | 搜索ID(自增) | PK |
| query | string | 搜索关键词 | Index |
| resultCount | number | 搜索结果数量 | |
| searchTime | datetime | 搜索时间 | Index |
| category | string | 搜索分类(可选) | |
| locale | string | 搜索语言 | |

**用途**：记录搜索历史，提供搜索建议和热门关键词

---

## 🔗 表关系设计

### 一对多关系
- `categories` → `games`：一个分类包含多个游戏
- `categories` → `categoryTranslations`：一个分类有多个翻译
- `games` → `gameTranslations`：一个游戏有多个翻译
- `games` → `gameSessions`：一个游戏有多个游玩会话
- `games` → `achievements`：一个游戏有多个成就
- `achievements` → `achievementTranslations`：一个成就有多个翻译

### 一对一关系
- `games` → `gameStats`：每个游戏对应一个统计记录

---

## 🌍 国际化设计方案

### 支持的语言
#### 第一阶段
- `zh-CN`：简体中文（现有数据）
- `en-US`：英文（翻译/AI生成）

#### 第二阶段
- `ja-JP`：日文（很多游戏是日本游戏）
- `ko-KR`：韩文

#### 第三阶段
- `zh-TW`：繁体中文
- `es-ES`：西班牙文
- `fr-FR`：法文

### 翻译来源分类
- `official`：官方翻译（质量：100%）
- `community`：社区翻译（质量：85%）
- `manual`：手动翻译（质量：80%）
- `ai`：AI翻译（质量：70%）

### 语言回退机制
1. 优先显示当前设置语言
2. 如果没有翻译，回退到英文
3. 如果英文也没有，显示原始数据或键名

---

## 📊 数据迁移策略

### 现有数据迁移路径
1. `categories.json` → `categories` + `categoryTranslations` 表
2. `games/*.json` → `games` + `gameTranslations` 表
3. 现有 `playCount` → `gameStats` 表初始值

### 数据转换规则
- 保留所有现有中文数据作为 `zh-CN` 翻译
- 自动生成或手动添加英文翻译
- 分类名称使用预定义映射表翻译
- 游戏名称和描述通过AI或人工翻译

---

## 🔍 查询优化策略

### 索引设计原则
1. **主要查询路径**：按分类查询游戏
2. **搜索功能**：按游戏名称搜索
3. **统计功能**：按游玩次数、评分排序
4. **时间查询**：按最后游玩时间排序

### 复合索引
- `[gameId, locale]`：国际化查询
- `[category, lastPlayed]`：分类内最近游玩
- `[favorited, rating]`：收藏和评分组合查询

---

## 💾 存储空间估算

### 数据量预估
- **基础游戏数据**：~1000 款游戏 × 2KB = 2MB
- **翻译数据**：1000 × 4语言 × 1KB = 4MB  
- **统计数据**：1000 × 500B = 500KB
- **会话记录**：10000 条 × 200B = 2MB
- **成就数据**：5000 条 × 100B = 500KB

**总计预估**：~10MB（完全可控）

### IndexedDB 优势
- 支持 GB 级存储空间
- 异步操作不阻塞UI
- 支持事务和索引
- 离线可用

---

## 🚀 实施阶段规划

### 阶段一：基础迁移（1-2天）
1. 创建数据库结构
2. 实现基础数据导入
3. 修改现有数据获取逻辑

### 阶段二：国际化支持（2-3天）
1. 实现翻译数据导入
2. 创建国际化数据服务
3. 集成到现有组件

### 阶段三：统计功能（3-4天）
1. 实现游戏统计记录
2. 添加会话跟踪
3. 创建数据可视化

### 阶段四：高级功能（1周）
1. 成就系统
2. 搜索优化
3. 数据同步机制
4. 性能优化

---

## ⚡ 性能优化建议

### 数据访问优化
1. **懒加载**：只加载当前需要的数据
2. **缓存策略**：热门数据内存缓存
3. **批量操作**：使用 bulkAdd/bulkPut
4. **索引利用**：避免全表扫描

### 国际化优化
1. **预加载**：应用启动时加载当前语言
2. **按需加载**：切换语言时加载对应翻译
3. **缓存翻译**：避免重复查询

---

## 🔧 可扩展性设计

### 未来功能扩展
1. **云同步**：支持多设备数据同步
2. **社交功能**：分享成就和高分
3. **推荐系统**：基于游玩历史推荐游戏
4. **主题系统**：自定义界面主题

### 数据结构扩展
1. **游戏标签**：支持多维度分类
2. **用户评论**：游戏评价系统
3. **截图功能**：游戏截图存储
4. **mod支持**：游戏修改文件管理

---

此文档将作为数据库实施的指导文档，随着项目发展会持续更新和完善。 