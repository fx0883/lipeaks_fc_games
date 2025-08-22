<template>
  <section style="padding: 2rem">
    <h2>Search</h2>
    <p v-if="query">Query: {{ query }}</p>
    <p v-else>Type your query in the search box above.</p>
    <p v-if="results && results.length">Found: {{ results.length }}</p>
  </section>
</template>

<script setup>
const route = useRoute()
const query = computed(() => String(route.query.q || ''))

const { data: results } = await useFetch(() => query.value ? `/api/games/search?q=${encodeURIComponent(query.value)}` : null, { default: () => [] })

useHead(() => ({
  title: query.value ? `Search: ${query.value} | Lipeaks` : 'Search | Lipeaks',
  meta: [
    { name: 'description', content: query.value ? `Search results for ${query.value}.` : 'Search classic games.' }
  ],
  link: [
    { rel: 'canonical', href: query.value ? `https://games.espressox.online/search?q=${encodeURIComponent(query.value)}` : 'https://games.espressox.online/search' }
  ]
}))

useJsonld(() => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Lipeaks',
  potentialAction: {
    '@type': 'SearchAction',
    target: `https://games.espressox.online/search?q={search_term_string}`,
    'query-input': 'required name=search_term_string'
  }
}))
</script>
