import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
	if (process.dev) {
		try {
			// Lazy import to avoid including in server bundle
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			import('@stagewise/toolbar').then(({ initToolbar }) => {
				initToolbar({ plugins: [] })
			}).catch(() => {
				// ignore if not available
			})
		} catch (_) {
			// no-op
		}
	}
})
