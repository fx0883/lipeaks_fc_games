// Lipeaks FC Games
// Copyright (C) 2024 Lipeaks
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { useI18n } from 'vue-i18n'

/**
 * 游戏国际化 Composable
 * 提供游戏名称和描述的智能翻译功能
 */
export function useGameI18n() {
  const { t, locale } = useI18n()

  /**
   * 翻译游戏名称
   * @param {Object} game - 游戏对象
   * @returns {String} 翻译后的游戏名称
   */
  const getGameName = (game) => {
    if (!game || !game.name) return ''
    
    // 如果当前语言是中文，直接返回原名
    if (locale.value === 'zh-CN') {
      return game.name
    }
    
    // 尝试从翻译文件中查找具体的游戏名称翻译
    const gameTranslationKey = `games.names.${game.id}`
    const specificTranslation = t(gameTranslationKey, null, { missingWarn: false, fallbackWarn: false })
    if (specificTranslation && specificTranslation !== gameTranslationKey) {
      return specificTranslation
    }
    
    // 应用通用翻译规则
    return applyNameTranslationRules(game.name)
  }

  /**
   * 强制翻译游戏名称（用于测试，忽略当前语言）
   * @param {Object} game - 游戏对象
   * @param {String} targetLocale - 目标语言
   * @returns {String} 翻译后的游戏名称
   */
  const forceTranslateGameName = (game, targetLocale = 'en-US') => {
    if (!game || !game.name) return ''
    
    // 临时切换语言进行翻译测试
    const originalLocale = locale.value
    
    // 模拟目标语言环境
    const mockT = (key, defaultValue, options) => {
      const translations = {
        'en-US': {
          'games.nameRules.directMappings.恶魔城': 'Castlevania',
          'games.nameRules.directMappings.魂斗罗': 'Contra',
          'games.nameRules.directMappings.超级马里奥': 'Super Mario',
          'games.nameRules.directMappings.塞尔达传说': 'The Legend of Zelda',
          'games.nameRules.directMappings.拳皇': 'The King of Fighters',
          'games.nameRules.directMappings.街头霸王': 'Street Fighter',
          'games.nameRules.directMappings.合金弹头': 'Metal Slug'
        }
      }
      return translations[targetLocale]?.[key] || defaultValue
    }
    
    // 直接应用翻译规则
    return applyNameTranslationRules(game.name)
  }

  /**
   * 翻译游戏描述
   * @param {Object} game - 游戏对象
   * @returns {String} 翻译后的游戏描述
   */
  const getGameDescription = (game) => {
    if (!game) return ''
    
    // 如果当前语言是中文，直接返回原描述
    if (locale.value === 'zh-CN') {
      return game.description || t('games.noDescription')
    }
    
    // 尝试从翻译文件中查找具体的游戏描述翻译
    const descTranslationKey = `games.descriptions.${game.id}`
    const specificTranslation = t(descTranslationKey, null, { missingWarn: false, fallbackWarn: false })
    if (specificTranslation && specificTranslation !== descTranslationKey) {
      return specificTranslation
    }
    
    // 应用通用描述翻译规则
    return applyDescriptionTranslationRules(game)
  }

  /**
   * 应用游戏名称翻译规则
   * @param {String} chineseName - 中文游戏名称
   * @returns {String} 翻译后的名称
   */
  const applyNameTranslationRules = (chineseName) => {
    if (!chineseName) return ''
    
    let translatedName = chineseName
    
    // 获取翻译规则
    const nameRules = t('games.nameRules', {}, { missingWarn: false, fallbackWarn: false })
    if (nameRules && typeof nameRules === 'object') {
      
      // 应用直接映射规则
      if (nameRules.directMappings) {
        for (const [chinese, translation] of Object.entries(nameRules.directMappings)) {
          if (translatedName.includes(chinese)) {
            translatedName = translatedName.replace(new RegExp(chinese, 'g'), translation)
          }
        }
      }
      
      // 应用版本标识翻译
      if (nameRules.versionMarkers) {
        for (const [chinese, translation] of Object.entries(nameRules.versionMarkers)) {
          if (translatedName.includes(chinese)) {
            translatedName = translatedName.replace(new RegExp(chinese, 'g'), translation)
          }
        }
      }
      
      // 应用游戏系列翻译
      if (nameRules.gameSeries) {
        for (const [chinese, translation] of Object.entries(nameRules.gameSeries)) {
          if (translatedName.includes(chinese)) {
            translatedName = translatedName.replace(new RegExp(chinese, 'g'), translation)
          }
        }
      }
    }
    
    return translatedName
  }

  /**
   * 应用游戏描述翻译规则
   * @param {Object} game - 游戏对象
   * @returns {String} 翻译后的描述
   */
  const applyDescriptionTranslationRules = (game) => {
    if (!game.description) {
      return t('games.noDescription')
    }
    
    // 解析原始描述的模式：游戏名 - 类型平台游戏
    const descPattern = /^(.+?)\s*-\s*(.+?)游戏$/
    const match = game.description.match(descPattern)
    
    if (match) {
      const gameName = match[1]
      const gameType = match[2]
      
      // 翻译游戏类型
      const translatedType = translateGameType(gameType)
      const translatedGameName = applyNameTranslationRules(gameName)
      
      // 构建新的描述
      const platformName = getPlatformDisplayName(game.platform)
      return t('games.descriptionTemplate', {
        gameName: translatedGameName,
        gameType: translatedType,
        platform: platformName
      })
    }
    
    // 如果无法解析，返回通用描述
    const platformName = getPlatformDisplayName(game.platform)
    return t('games.genericDescription', {
      platform: platformName
    })
  }

  /**
   * 翻译游戏类型
   * @param {String} chineseType - 中文游戏类型
   * @returns {String} 翻译后的类型
   */
  const translateGameType = (chineseType) => {
    const typeTranslations = t('games.gameTypes', {}, { missingWarn: false, fallbackWarn: false })
    if (typeTranslations && typeof typeTranslations === 'object') {
      return typeTranslations[chineseType] || chineseType
    }
    return chineseType
  }

  /**
   * 获取平台显示名称
   * @param {String} platform - 平台ID
   * @returns {String} 平台显示名称
   */
  const getPlatformDisplayName = (platform) => {
    const platformTranslations = t('games.platforms', {}, { missingWarn: false, fallbackWarn: false })
    if (platformTranslations && typeof platformTranslations === 'object') {
      return platformTranslations[platform] || platform
    }
    return platform
  }

  /**
   * 获取简短的游戏描述（用于卡片显示）
   * @param {Object} game - 游戏对象
   * @returns {String} 简短描述
   */
  const getShortGameDescription = (game) => {
    if (!game) return ''
    
    const fullDescription = getGameDescription(game)
    
    // 如果描述过长，截取并添加省略号
    const maxLength = 80
    if (fullDescription.length > maxLength) {
      return fullDescription.substring(0, maxLength) + '...'
    }
    
    return fullDescription
  }

  /**
   * 根据游戏信息生成SEO友好的描述
   * @param {Object} game - 游戏对象
   * @returns {String} SEO描述
   */
  const getSEODescription = (game) => {
    if (!game) return ''
    
    const gameName = getGameName(game)
    const platformName = getPlatformDisplayName(game.platform)
    
    return t('games.seoDescription', {
      gameName,
      platform: platformName,
      author: game.author || t('games.unknownAuthor'),
      playCount: game.playCount || 0
    })
  }

  return {
    getGameName,
    getGameDescription,
    getShortGameDescription,
    getSEODescription,
    translateGameType,
    getPlatformDisplayName,
    forceTranslateGameName,
    // 添加调试函数
    getCurrentLocale: () => locale.value,
    testTranslation: (gameName) => applyNameTranslationRules(gameName)
  }
}