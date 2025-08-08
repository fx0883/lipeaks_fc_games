// 分类国际化辅助函数
// Copyright (C) 2024 Lipeaks FC Games

import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

/**
 * 分类国际化组合函数
 * 提供分类名称和描述的国际化支持
 */
export function useCategoryI18n() {
  const { t } = useI18n()

  /**
   * 获取分类的国际化名称
   * @param {Object} category - 分类对象
   * @returns {string} 国际化的分类名称
   */
  const getCategoryName = (category) => {
    if (!category) return ''
    
    // 如果有 nameKey，使用国际化
    if (category.nameKey) {
      return t(category.nameKey)
    }
    
    // 向后兼容：如果没有 nameKey，回退到 name 字段
    return category.name || ''
  }

  /**
   * 获取分类的国际化描述
   * @param {Object} category - 分类对象
   * @returns {string} 国际化的分类描述
   */
  const getCategoryDescription = (category) => {
    if (!category) return ''
    
    // 如果有 descriptionKey，使用国际化
    if (category.descriptionKey) {
      return t(category.descriptionKey)
    }
    
    // 向后兼容：如果没有 descriptionKey，回退到 description 字段
    return category.description || ''
  }

  /**
   * 获取带有国际化名称和描述的分类对象
   * @param {Object} category - 原始分类对象
   * @returns {Object} 包含国际化名称和描述的分类对象
   */
  const getLocalizedCategory = (category) => {
    if (!category) return null
    
    return {
      ...category,
      localizedName: getCategoryName(category),
      localizedDescription: getCategoryDescription(category)
    }
  }

  /**
   * 获取带有国际化信息的分类列表
   * @param {Array} categories - 分类列表
   * @returns {Array} 包含国际化信息的分类列表
   */
  const getLocalizedCategories = (categories) => {
    if (!Array.isArray(categories)) return []
    
    return categories.map(category => {
      const localizedCategory = getLocalizedCategory(category)
      
      // 处理子分类
      if (category.subCategories && Array.isArray(category.subCategories)) {
        localizedCategory.subCategories = category.subCategories.map(subCategory =>
          getLocalizedCategory(subCategory)
        )
      }
      
      return localizedCategory
    })
  }

  /**
   * 根据分类ID获取国际化名称
   * @param {string} categoryId - 分类ID
   * @param {Array} categories - 分类列表
   * @returns {string} 国际化的分类名称
   */
  const getCategoryNameById = (categoryId, categories) => {
    if (!categoryId || !Array.isArray(categories)) return ''
    
    // 查找主分类
    const mainCategory = categories.find(cat => cat.id === categoryId)
    if (mainCategory) {
      return getCategoryName(mainCategory)
    }
    
    // 查找子分类
    for (const category of categories) {
      if (category.subCategories && Array.isArray(category.subCategories)) {
        const subCategory = category.subCategories.find(sub => sub.id === categoryId)
        if (subCategory) {
          return getCategoryName(subCategory)
        }
      }
    }
    
    return ''
  }

  /**
   * 获取子分类的简短名称（去除前缀）
   * @param {Object} subCategory - 子分类对象
   * @param {string} mainCategoryPrefix - 主分类前缀（如 'FC', '街机'）
   * @returns {string} 简短的子分类名称
   */
  const getShortSubCategoryName = (subCategory, mainCategoryPrefix = '') => {
    const fullName = getCategoryName(subCategory)
    
    if (!mainCategoryPrefix) {
      // 自动检测前缀
      if (fullName.startsWith('FC')) {
        return fullName.replace('FC', '')
      } else if (fullName.startsWith('街机')) {
        return fullName.replace('街机', '')
      } else if (fullName.startsWith('Arcade ')) {
        return fullName.replace('Arcade ', '')
      } else if (fullName.startsWith('FC ')) {
        return fullName.replace('FC ', '')
      }
    } else {
      // 使用指定前缀
      return fullName.replace(mainCategoryPrefix, '')
    }
    
    return fullName
  }

  /**
   * 检查分类是否需要国际化更新
   * @param {Object} category - 分类对象
   * @returns {boolean} 是否需要更新
   */
  const needsI18nUpdate = (category) => {
    if (!category) return false
    return !category.nameKey || !category.descriptionKey
  }

  /**
   * 为组件提供响应式的本地化分类数据
   * @param {Array|Object} categoriesRef - 响应式的分类数据
   * @returns {Object} 响应式的本地化分类数据
   */
  const useLocalizedCategories = (categoriesRef) => {
    return computed(() => {
      if (Array.isArray(categoriesRef.value)) {
        return getLocalizedCategories(categoriesRef.value)
      } else if (categoriesRef.value) {
        return getLocalizedCategory(categoriesRef.value)
      }
      return []
    })
  }

  return {
    // 基础方法
    getCategoryName,
    getCategoryDescription,
    getLocalizedCategory,
    getLocalizedCategories,
    getCategoryNameById,
    getShortSubCategoryName,
    
    // 响应式组合
    useLocalizedCategories,
    
    // 工具方法
    needsI18nUpdate
  }
}