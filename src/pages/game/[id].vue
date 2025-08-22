<template>
  <section style="padding: 2rem">
    <h2>Game Page</h2>
    <p>Game ID: {{ id }}</p>
    <p v-if="game">Game Name: {{ game.name || game.title }}</p>

    <ClientOnlyEmulator
      v-if="game"
      :rom-path="game.romPath || game.rom || ''"
      :game-name="game.name || game.title || id"
      container-id="emulator"
    />
  </section>
</template>

<script setup>
const route = useRoute()
const id = computed(() => String(route.params.id || ''))

const { data: game } = await useFetch(() => `/api/games/${id.value}`)

useHead(() => ({
  title: game.value ? `${game.value.name || game.value.title} - Play Online Free | Lipeaks` : `${id.value} - Play Online Free | Lipeaks`,
  meta: [
    { name: 'description', content: game.value?.description || `Play ${id.value} online for free. Classic retro game in your browser.` }
  ],
  link: [
    { rel: 'canonical', href: `https://games.espressox.online/game/${id.value}` }
  ]
}))

useJsonld(() => ({
  '@context': 'https://schema.org',
  '@type': 'VideoGame',
  name: game.value?.name || game.value?.title || id.value,
  description: game.value?.description || `Play ${id.value} online for free.`,
  url: `https://games.espressox.online/game/${id.value}`,
  gamePlatform: 'Web Browser',
  applicationCategory: 'Game'
}))
</script>
