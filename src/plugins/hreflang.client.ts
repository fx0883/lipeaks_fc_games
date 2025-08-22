import { defineNuxtPlugin } from '#app'
import { useRouter, useRuntimeConfig } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
	if (!process.client) return
	const router = useRouter()

	const getLocales = () => {
		const anyI18n: any = (nuxtApp as any).$i18n
		const locs = anyI18n?.locales?.value || anyI18n?.locales || []
		return Array.isArray(locs) ? locs : []
	}

	const updateHreflang = () => {
		const head = document.head
		const existing = head.querySelectorAll('link[rel="alternate"][hreflang]')
		existing.forEach((el) => el.parentElement?.removeChild(el))

		const baseUrl = useRuntimeConfig().public?.baseUrl || 'https://games.espressox.online'
		const path = router.currentRoute.value.fullPath.split('?')[0]

		const locales = getLocales() as Array<{ code: string; iso?: string }>
		locales.forEach((loc: any) => {
			const href = loc.code === 'en' ? `${baseUrl}${path}` : `${baseUrl}/${loc.code}${path}`
			const link = document.createElement('link')
			link.setAttribute('rel', 'alternate')
			link.setAttribute('hreflang', loc.code)
			link.setAttribute('href', href)
			head.appendChild(link)
		})

		const xDefault = document.createElement('link')
		xDefault.setAttribute('rel', 'alternate')
		xDefault.setAttribute('hreflang', 'x-default')
		xDefault.setAttribute('href', `${baseUrl}${path}`)
		head.appendChild(xDefault)
	}

	router.afterEach(() => {
		updateHreflang()
	})

	// initial
	updateHreflang()
})
