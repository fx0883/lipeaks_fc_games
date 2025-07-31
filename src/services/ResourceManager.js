import { ErrorTypes, globalErrorHandler } from './ErrorHandler.js'

/**
 * 资源类型枚举
 */
export const ResourceType = {
  SCRIPT: 'script',
  ROM: 'rom',
  DATA: 'data',
  IMAGE: 'image',
  STYLE: 'style'
}

/**
 * 资源状态枚举
 */
export const ResourceStatus = {
  PENDING: 'pending',
  LOADING: 'loading',
  LOADED: 'loaded',
  ERROR: 'error',
  CACHED: 'cached'
}

/**
 * 资源信息类
 */
export class ResourceInfo {
  constructor({
    url,
    type,
    size = 0,
    status = ResourceStatus.PENDING,
    loadTime = 0,
    errorCount = 0,
    lastAccessed = Date.now(),
    metadata = {}
  } = {}) {
    this.url = url
    this.type = type
    this.size = size
    this.status = status
    this.loadTime = loadTime
    this.errorCount = errorCount
    this.lastAccessed = lastAccessed
    this.metadata = metadata
  }
}

/**
 * 资源管理服务
 * 负责EmulatorJS相关资源的加载、缓存和清理
 */
export class ResourceManager {
  constructor() {
    this.resourceCache = new Map()
    this.loadingPromises = new Map()
    this.scriptElements = new Map()
    this.loadListeners = new Set()
    this.maxCacheSize = 50 * 1024 * 1024 // 50MB
    this.currentCacheSize = 0
    this.maxRetries = 3
    this.retryDelay = 1000
  }

  /**
   * 验证资源是否可访问
   * @param {string} url 资源URL
   * @param {string} type 资源类型
   * @returns {Promise<ResourceInfo>}
   */
  async validateResource(url, type = ResourceType.DATA) {
    const resourceInfo = new ResourceInfo({ url, type })
    
    try {
      resourceInfo.status = ResourceStatus.LOADING
      const startTime = Date.now()
      
      const response = await fetch(url, { 
        method: 'HEAD',
        cache: 'no-cache'
      })
      
      if (!response.ok) {
        throw new Error(`Resource not accessible (status: ${response.status})`)
      }
      
      resourceInfo.size = parseInt(response.headers.get('content-length') || '0')
      resourceInfo.loadTime = Date.now() - startTime
      resourceInfo.status = ResourceStatus.LOADED
      resourceInfo.metadata = {
        contentType: response.headers.get('content-type'),
        lastModified: response.headers.get('last-modified'),
        etag: response.headers.get('etag')
      }
      
      this.updateCache(url, resourceInfo)
      return resourceInfo
      
    } catch (error) {
      resourceInfo.status = ResourceStatus.ERROR
      resourceInfo.errorCount++
      
      const errorInfo = globalErrorHandler.createResourceError(
        `Failed to validate resource: ${error.message}`,
        { url, type, attempts: resourceInfo.errorCount }
      )
      
      globalErrorHandler.handleError(errorInfo)
      throw error
    }
  }

  /**
   * 加载ROM文件
   * @param {string} romPath ROM文件路径
   * @returns {Promise<ResourceInfo>}
   */
  async loadROM(romPath) {
    const adjustedPath = romPath.startsWith('/') ? romPath : `/${romPath}`
    const cacheKey = `rom:${adjustedPath}`
    
    // 检查缓存
    if (this.resourceCache.has(cacheKey)) {
      const cached = this.resourceCache.get(cacheKey)
      cached.lastAccessed = Date.now()
      return cached
    }
    
    // 检查是否正在加载
    if (this.loadingPromises.has(cacheKey)) {
      return this.loadingPromises.get(cacheKey)
    }
    
    const loadPromise = this.validateResource(adjustedPath, ResourceType.ROM)
    this.loadingPromises.set(cacheKey, loadPromise)
    
    try {
      const result = await loadPromise
      this.loadingPromises.delete(cacheKey)
      this.notifyLoadListeners('rom', { path: adjustedPath, status: 'loaded' })
      return result
    } catch (error) {
      this.loadingPromises.delete(cacheKey)
      this.notifyLoadListeners('rom', { path: adjustedPath, status: 'error', error })
      throw error
    }
  }

  /**
   * 加载EmulatorJS脚本
   * @param {string} scriptPath 脚本路径
   * @param {string} namespace 命名空间
   * @returns {Promise<ResourceInfo>}
   */
  async loadEmulatorScript(scriptPath, namespace = 'default') {
    const cacheKey = `script:${scriptPath}`
    
    // 检查是否已加载
    if (this.scriptElements.has(cacheKey)) {
      const existingInfo = this.resourceCache.get(cacheKey)
      if (existingInfo) {
        existingInfo.lastAccessed = Date.now()
        return existingInfo
      }
    }
    
    // 检查是否正在加载
    if (this.loadingPromises.has(cacheKey)) {
      return this.loadingPromises.get(cacheKey)
    }
    
    const loadPromise = this.loadScriptElement(scriptPath, namespace)
    this.loadingPromises.set(cacheKey, loadPromise)
    
    try {
      const result = await loadPromise
      this.loadingPromises.delete(cacheKey)
      this.notifyLoadListeners('script', { path: scriptPath, status: 'loaded' })
      return result
    } catch (error) {
      this.loadingPromises.delete(cacheKey)
      this.notifyLoadListeners('script', { path: scriptPath, status: 'error', error })
      throw error
    }
  }

  /**
   * 实际加载脚本元素
   * @param {string} scriptPath 脚本路径
   * @param {string} namespace 命名空间
   * @returns {Promise<ResourceInfo>}
   */
  async loadScriptElement(scriptPath, namespace) {
    return new Promise((resolve, reject) => {
      const resourceInfo = new ResourceInfo({
        url: scriptPath,
        type: ResourceType.SCRIPT,
        status: ResourceStatus.LOADING
      })
      
      const startTime = Date.now()
      const script = document.createElement('script')
      script.src = scriptPath
      script.dataset.namespace = namespace
      script.async = true
      
      script.onload = () => {
        resourceInfo.loadTime = Date.now() - startTime
        resourceInfo.status = ResourceStatus.LOADED
        
        const cacheKey = `script:${scriptPath}`
        this.scriptElements.set(cacheKey, script)
        this.updateCache(cacheKey, resourceInfo)
        
        resolve(resourceInfo)
      }
      
      script.onerror = () => {
        resourceInfo.status = ResourceStatus.ERROR
        resourceInfo.errorCount++
        
        const error = new Error(`Failed to load script: ${scriptPath}`)
        const errorInfo = globalErrorHandler.createResourceError(
          error.message,
          { scriptPath, namespace, attempts: resourceInfo.errorCount }
        )
        
        globalErrorHandler.handleError(errorInfo)
        reject(error)
      }
      
      document.head.appendChild(script)
    })
  }

  /**
   * 预加载资源
   * @param {string[]} urls 资源URL列表
   * @param {string} type 资源类型
   * @returns {Promise<ResourceInfo[]>}
   */
  async preloadResources(urls, type = ResourceType.DATA) {
    const preloadPromises = urls.map(url => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = url
      link.as = this.getPreloadType(type)
      
      return new Promise((resolve) => {
        link.onload = () => resolve(new ResourceInfo({ url, type, status: ResourceStatus.CACHED }))
        link.onerror = () => resolve(new ResourceInfo({ url, type, status: ResourceStatus.ERROR }))
        document.head.appendChild(link)
      })
    })
    
    return Promise.all(preloadPromises)
  }

  /**
   * 获取预加载类型
   * @param {string} resourceType 资源类型
   * @returns {string}
   */
  getPreloadType(resourceType) {
    switch (resourceType) {
      case ResourceType.SCRIPT:
        return 'script'
      case ResourceType.STYLE:
        return 'style'
      case ResourceType.IMAGE:
        return 'image'
      default:
        return 'fetch'
    }
  }

  /**
   * 重试加载资源
   * @param {string} url 资源URL
   * @param {string} type 资源类型
   * @param {number} attempts 尝试次数
   * @returns {Promise<ResourceInfo>}
   */
  async retryLoad(url, type, attempts = 0) {
    if (attempts >= this.maxRetries) {
      throw new Error(`Failed to load resource after ${this.maxRetries} attempts: ${url}`)
    }
    
    try {
      return await this.validateResource(url, type)
    } catch (error) {
      console.warn(`Load attempt ${attempts + 1} failed for ${url}, retrying...`)
      
      // 指数退避
      const delay = this.retryDelay * Math.pow(2, attempts)
      await this.wait(delay)
      
      return this.retryLoad(url, type, attempts + 1)
    }
  }

  /**
   * 等待指定时间
   * @param {number} ms 毫秒数
   * @returns {Promise<void>}
   */
  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * 更新缓存
   * @param {string} key 缓存键
   * @param {ResourceInfo} resourceInfo 资源信息
   */
  updateCache(key, resourceInfo) {
    // 检查缓存大小限制
    if (this.currentCacheSize + resourceInfo.size > this.maxCacheSize) {
      this.cleanupCache()
    }
    
    this.resourceCache.set(key, resourceInfo)
    this.currentCacheSize += resourceInfo.size
  }

  /**
   * 清理缓存
   */
  cleanupCache() {
    // LRU清理策略：移除最久未访问的资源
    const sortedEntries = Array.from(this.resourceCache.entries())
      .sort(([, a], [, b]) => a.lastAccessed - b.lastAccessed)
    
    // 移除最旧的30%
    const toRemove = Math.floor(sortedEntries.length * 0.3)
    
    for (let i = 0; i < toRemove; i++) {
      const [key, resourceInfo] = sortedEntries[i]
      this.resourceCache.delete(key)
      this.currentCacheSize -= resourceInfo.size
    }
    
    console.log(`ResourceManager: Cleaned up ${toRemove} cached resources`)
  }

  /**
   * 清理脚本元素
   * @param {string} namespace 命名空间
   */
  cleanupScripts(namespace = null) {
    const scriptsToRemove = []
    
    this.scriptElements.forEach((script, key) => {
      if (!namespace || script.dataset.namespace === namespace) {
        script.remove()
        scriptsToRemove.push(key)
      }
    })
    
    scriptsToRemove.forEach(key => {
      this.scriptElements.delete(key)
      this.resourceCache.delete(key)
    })
    
    console.log(`ResourceManager: Removed ${scriptsToRemove.length} script elements`)
  }

  /**
   * 清理所有相关的EmulatorJS脚本
   */
  cleanupEmulatorScripts() {
    // 移除所有EmulatorJS相关脚本
    const emulatorScripts = document.querySelectorAll('script[src*="emulatorjs"], script[src*="loader.js"]')
    emulatorScripts.forEach(script => script.remove())
    
    // 清理缓存中的脚本资源
    const keysToRemove = []
    this.scriptElements.forEach((script, key) => {
      if (key.includes('emulatorjs') || key.includes('loader.js')) {
        keysToRemove.push(key)
      }
    })
    
    keysToRemove.forEach(key => {
      this.scriptElements.delete(key)
      this.resourceCache.delete(key)
    })
    
    console.log('ResourceManager: Cleaned up EmulatorJS scripts')
  }

  /**
   * 获取缓存统计信息
   * @returns {Object}
   */
  getCacheStats() {
    const stats = {
      totalItems: this.resourceCache.size,
      totalSize: this.currentCacheSize,
      maxSize: this.maxCacheSize,
      utilization: (this.currentCacheSize / this.maxCacheSize * 100).toFixed(2) + '%',
      scriptElements: this.scriptElements.size,
      loadingItems: this.loadingPromises.size
    }
    
    // 按类型统计
    const typeStats = {}
    this.resourceCache.forEach(resource => {
      typeStats[resource.type] = (typeStats[resource.type] || 0) + 1
    })
    stats.byType = typeStats
    
    return stats
  }

  /**
   * 添加加载监听器
   * @param {function} listener 监听器函数
   */
  addLoadListener(listener) {
    this.loadListeners.add(listener)
  }

  /**
   * 移除加载监听器
   * @param {function} listener 监听器函数
   */
  removeLoadListener(listener) {
    this.loadListeners.delete(listener)
  }

  /**
   * 通知加载监听器
   * @param {string} type 资源类型
   * @param {Object} data 数据
   */
  notifyLoadListeners(type, data) {
    this.loadListeners.forEach(listener => {
      try {
        listener(type, data)
      } catch (error) {
        console.error('Error in load listener:', error)
      }
    })
  }

  /**
   * 清理所有资源
   */
  cleanup() {
    console.log('ResourceManager: Starting cleanup...')
    
    // 清理所有脚本元素
    this.cleanupScripts()
    
    // 清理EmulatorJS脚本
    this.cleanupEmulatorScripts()
    
    // 清理缓存
    this.resourceCache.clear()
    this.loadingPromises.clear()
    this.scriptElements.clear()
    this.currentCacheSize = 0
    
    // 清理监听器
    this.loadListeners.clear()
    
    console.log('ResourceManager: Cleanup completed')
  }

  /**
   * 销毁资源管理器
   */
  destroy() {
    this.cleanup()
    console.log('ResourceManager: Destroyed')
  }
}

// 创建全局资源管理器实例
export const globalResourceManager = new ResourceManager() 