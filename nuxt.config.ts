// Nuxt 3 progressive migration config
// Keep existing Vue app intact while enabling Nuxt SSR and SEO features
import { defineNuxtConfig } from 'nuxt/config'
const publicBaseUrl = process.env.NUXT_PUBLIC_BASE_URL || 'https://games.espressox.online'

export default defineNuxtConfig({
	ssr: true,
	// Use existing src directory
	srcDir: 'src',
	// Keep current structure by pointing to our existing folders where applicable
	dir: {
		// We'll progressively move views to pages; for now, keep default
		// pages: 'src/views', // enable later when converting views to pages
		layouts: 'src/layouts',
		// components defaults to 'components' under srcDir
	},
	app: {
		head: {
			title: 'Lipeaks - Play Classic NES & Arcade Games Online Free',
			titleTemplate: '%s',
			meta: [
				{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
				{ name: 'robots', content: 'index, follow' },
				{ name: 'description', content: 'Play hundreds of classic NES and arcade games online for free. No download required. Includes Contra, Super Mario Bros, Pac-Man and more retro favorites.' },
				{ name: 'keywords', content: 'classic games, NES games, arcade games, retro gaming, online emulator, free games, FC games, Nintendo' },
				{ name: 'author', content: 'Lipeaks' },
				// Open Graph
				{ property: 'og:title', content: 'Lipeaks - Play Classic NES & Arcade Games Online Free' },
				{ property: 'og:description', content: 'Play hundreds of classic NES and arcade games online for free. No download required.' },
				{ property: 'og:image', content: 'https://games.espressox.online/images/og-image.png' },
				{ property: 'og:url', content: 'https://games.espressox.online/' },
				{ property: 'og:type', content: 'website' },
				{ property: 'og:site_name', content: 'Lipeaks' },
				// Twitter Card
				{ name: 'twitter:card', content: 'summary_large_image' },
				{ name: 'twitter:title', content: 'Lipeaks - Play Classic NES & Arcade Games Online Free' },
				{ name: 'twitter:description', content: 'Play hundreds of classic NES and arcade games online for free. No download required.' },
				{ name: 'twitter:image', content: 'https://games.espressox.online/images/twitter-card.png' }
			],
			link: [
				{ rel: 'icon', href: '/favicon.ico' },
				{ rel: 'canonical', href: `${publicBaseUrl}/` },
				{ rel: 'preconnect', href: publicBaseUrl },
				{ rel: 'dns-prefetch', href: publicBaseUrl }
			],
		},
		pageTransition: { name: 'fade', mode: 'out-in' }
	},
	runtimeConfig: {
		public: {
			baseUrl: publicBaseUrl
		}
	},
	modules: [
		'@pinia/nuxt',
		'@nuxtjs/i18n',
		'@nuxtjs/robots',
		'@nuxtjs/sitemap',
	],
	pinia: {
		autoImports: ['defineStore']
	},
	// Basic i18n scaffold mirroring current locales; detailed config to be refined in Phase 3
	i18n: {
		baseUrl: publicBaseUrl,
		langDir: 'locales',
		locales: [
			{ code: 'en', iso: 'en-US', file: 'en-US.json', name: 'English' },
			{ code: 'zh', iso: 'zh-CN', file: 'zh-CN.json', name: '简体中文' },
			{ code: 'ja', iso: 'ja-JP', file: 'ja-JP.json', name: '日本語' },
			{ code: 'ar', iso: 'ar-AR', file: 'ar-AR.json', name: 'العربية', dir: 'rtl' },
		],
		defaultLocale: 'en',
		strategy: 'prefix_except_default',
		lazy: true,
		langDir: 'i18n/locales',
		seo: true,
		detectBrowserLanguage: {
			useCookie: true,
			cookieKey: 'fc-game-language',
			fallbackLocale: 'en',
			onlyOnRoot: true,
			redirectOn: 'root'
		}
	},
	// Keep emulator-related packages transpiled for compatibility
	build: {
		transpile: ['@emulatorjs/core-fbalpha2012_cps2', '@nuxtjs/i18n', 'vue-i18n']
	},
	nitro: {
		routeRules: {
			'/api/**': { cache: { maxAge: 300, swr: true } },
			'/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
			'/emulatorjs/**': { headers: { 'cache-control': 'public, max-age=31536000' } }
		},
		prerender: {
			routes: ['/', '/sitemap.xml'],
			failOnError: false
		}
	},
	vite: {
		resolve: {
			dedupe: ['vue', 'vue-i18n']
		},
		build: {
			rollupOptions: {
				output: {
					manualChunks: {
						'vue-core': ['vue'],
						'i18n': ['vue-i18n'],
						'pinia': ['pinia']
					}
				}
			}
		}
	}
})
