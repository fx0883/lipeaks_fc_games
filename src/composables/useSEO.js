/**
 * SEO Composable
 * 用于动态设置页面的SEO标签
 */

import { nextTick } from 'vue'
import { useI18n } from 'vue-i18n'

export function useSEO() {
  const { t } = useI18n()

  // 设置页面标题
  const setTitle = (title) => {
    if (typeof title === 'string') {
      document.title = title
    }
  }

  // 设置meta描述
  const setMetaDescription = (description) => {
    let metaDescription = document.querySelector('meta[name="description"]')
    if (!metaDescription) {
      metaDescription = document.createElement('meta')
      metaDescription.name = 'description'
      document.head.appendChild(metaDescription)
    }
    metaDescription.content = description
  }

  // 设置meta关键词
  const setMetaKeywords = (keywords) => {
    let metaKeywords = document.querySelector('meta[name="keywords"]')
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta')
      metaKeywords.name = 'keywords'
      document.head.appendChild(metaKeywords)
    }
    metaKeywords.content = Array.isArray(keywords) ? keywords.join(', ') : keywords
  }

  // 设置Open Graph标签
  const setOGTags = ({ title, description, image, url, type = 'website' }) => {
    const ogTags = [
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:url', content: url },
      { property: 'og:type', content: type }
    ]

    ogTags.forEach(({ property, content }) => {
      if (content) {
        let metaTag = document.querySelector(`meta[property="${property}"]`)
        if (!metaTag) {
          metaTag = document.createElement('meta')
          metaTag.setAttribute('property', property)
          document.head.appendChild(metaTag)
        }
        metaTag.content = content
      }
    })
  }

  // 设置Twitter Card标签
  const setTwitterCards = ({ title, description, image }) => {
    const twitterTags = [
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image }
    ]

    twitterTags.forEach(({ name, content }) => {
      if (content) {
        let metaTag = document.querySelector(`meta[name="${name}"]`)
        if (!metaTag) {
          metaTag = document.createElement('meta')
          metaTag.name = name
          document.head.appendChild(metaTag)
        }
        metaTag.content = content
      }
    })
  }

  // 设置canonical URL
  const setCanonicalUrl = (url) => {
    let canonicalLink = document.querySelector('link[rel="canonical"]')
    if (!canonicalLink) {
      canonicalLink = document.createElement('link')
      canonicalLink.rel = 'canonical'
      document.head.appendChild(canonicalLink)
    }
    canonicalLink.href = url
  }

  // 添加JSON-LD结构化数据
  const setJSONLD = (data) => {
    // 移除现有的JSON-LD
    const existingScript = document.querySelector('script[type="application/ld+json"][data-dynamic]')
    if (existingScript) {
      existingScript.remove()
    }

    // 添加新的JSON-LD
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-dynamic', 'true')
    script.textContent = JSON.stringify(data)
    document.head.appendChild(script)
  }

  // 综合设置页面SEO
  const setSEO = async (options) => {
    await nextTick()

    const {
      title,
      description,
      keywords,
      image = 'https://games.espressox.online/images/og-image.png',
      url = window.location.href,
      type = 'website',
      jsonLD
    } = options

    if (title) {
      setTitle(title)
    }

    if (description) {
      setMetaDescription(description)
    }

    if (keywords) {
      setMetaKeywords(keywords)
    }

    // 设置社交媒体标签
    if (title || description || image) {
      setOGTags({ title, description, image, url, type })
      setTwitterCards({ title, description, image })
    }

    // 设置canonical URL
    setCanonicalUrl(url)

    // 设置结构化数据
    if (jsonLD) {
      setJSONLD(jsonLD)
    }
  }

  // 为游戏页面设置SEO
  const setGameSEO = (game) => {
    if (!game) return

    const gameTitle = `${game.name || game.title} - Play Online Free | Lipeaks`
    const gameDescription = `Play ${game.name || game.title} online for free. ${game.description || 'Classic retro game available in your browser, no download required.'}`
    const gameKeywords = [
      game.name || game.title,
      game.category || 'classic games',
      'online game',
      'free game',
      'retro gaming',
      'browser game',
      'no download'
    ]

    const gameJsonLD = {
      "@context": "https://schema.org",
      "@type": "VideoGame",
      "name": game.name || game.title,
      "description": game.description || gameDescription,
      "genre": game.category || "Classic",
      "url": window.location.href,
      "image": game.cover || game.image,
      "publisher": {
        "@type": "Organization",
        "name": "Lipeaks"
      },
      "gamePlatform": "Web Browser",
      "applicationCategory": "Game"
    }

    setSEO({
      title: gameTitle,
      description: gameDescription,
      keywords: gameKeywords,
      image: game.cover || game.image,
      type: 'website',
      jsonLD: gameJsonLD
    })
  }

  // 为分类页面设置SEO
  const setCategorySEO = (category, gameCount = 0) => {
    const categoryName = category?.name || category
    const categoryTitle = `${categoryName} Games - Play Online Free | Lipeaks`
    const categoryDescription = `Explore ${gameCount} ${categoryName} games. ${category?.description || `Play classic ${categoryName} games online for free in your browser.`}`
    const categoryKeywords = [
      `${categoryName} games`,
      'classic games',
      'retro gaming',
      'online games',
      'free games',
      'browser games'
    ]

    const categoryJsonLD = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": categoryTitle,
      "description": categoryDescription,
      "url": window.location.href,
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": gameCount,
        "itemListElement": []
      }
    }

    setSEO({
      title: categoryTitle,
      description: categoryDescription,
      keywords: categoryKeywords,
      jsonLD: categoryJsonLD
    })
  }

  // 重置为默认SEO（首页）
  const resetToDefaultSEO = () => {
    setSEO({
      title: 'Lipeaks - Play Classic NES & Arcade Games Online Free',
      description: 'Play hundreds of classic NES and arcade games online for free. No download required. Includes Contra, Super Mario Bros, Pac-Man and more retro favorites.',
      keywords: 'classic games, NES games, arcade games, retro gaming, online emulator, free games, FC games, Nintendo'
    })
  }

  return {
    setSEO,
    setGameSEO,
    setCategorySEO,
    resetToDefaultSEO,
    setTitle,
    setMetaDescription,
    setMetaKeywords,
    setOGTags,
    setTwitterCards,
    setCanonicalUrl,
    setJSONLD
  }
}