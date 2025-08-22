<template>
  <section style="padding: 2rem">
    <h2>Category Page</h2>
    <p>Category ID: {{ id }}</p>
    <p v-if="games">Games loaded: {{ games.length }}</p>
  </section>
</template>

<script setup>
const route = useRoute()
const id = computed(() => String(route.params.id || ''))

const { data: games } = await useFetch(() => `/api/games/category/${id.value}`, { default: () => [] })

useHead(() => ({
	title: `${id.value} Games - Play Online Free | Lipeaks`,
	meta: [
		{ name: 'description', content: `Explore ${id.value} games. Play classic ${id.value} games online for free.` }
	],
	link: [
		{ rel: 'canonical', href: `https://games.espressox.online/category/${id.value}` }
	]
}))

useJsonld(() => ({
	'@context': 'https://schema.org',
	'@type': 'CollectionPage',
	name: `${id.value} Games - Play Online Free | Lipeaks`,
	description: `Explore ${id.value} games. Play classic ${id.value} games online for free.`,
	url: `https://games.espressox.online/category/${id.value}`
}))
</script>
