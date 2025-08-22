import { defineNuxtPlugin } from '#app'
import i18n, { updateHreflangTags } from '@/i18n'

export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.vueApp.use(i18n)
	// Ensure hreflang tags after mount/navigation in client
	if (process.client) {
		updateHreflangTags()
	}
})
