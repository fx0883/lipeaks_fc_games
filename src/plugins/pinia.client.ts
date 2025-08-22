import { defineNuxtPlugin } from '#app'
import { createPinia } from 'pinia'

export default defineNuxtPlugin((nuxtApp) => {
	// @pinia/nuxt auto registers, but we keep this to ease progressive migration
	// and to support any custom plugin registration if needed later.
	if (!nuxtApp.$pinia) {
		const pinia = createPinia()
		nuxtApp.vueApp.use(pinia)
	}
})
