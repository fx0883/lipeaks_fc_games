<template>
  <div class="home-container">
    <div class="search-and-filter">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search for games..."
        class="search-input"
      />
      <select v-model="selectedCategory" class="filter-select">
        <option value="all">All Categories</option>
        <option v-for="category in categories" :key="category" :value="category">
          {{ category.replace('fc-', '').toUpperCase() }}
        </option>
      </select>
    </div>

    <div v-if="loading" class="loading-message">Loading games...</div>
    <div v-if="error" class="error-message">Failed to load games. Please try again later.</div>

    <div v-if="!loading && !error" class="game-grid">
      <div v-for="game in filteredGames" :key="game.id" class="game-card">
        <router-link :to="`/game/${game.id}`">
          <img :src="game.cover" :alt="game.name" class="game-cover" />
          <div class="game-name">{{ game.name }}</div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useHead } from '#imports';

const games = ref([]);
const loading = ref(true);
const error = ref(null);
const searchQuery = ref('');
const selectedCategory = ref('all');

// Fetch game data
onMounted(async () => {
  try {
    const response = await fetch('/fc_new.json');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    games.value = await response.json();
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
});

// Get unique categories
const categories = computed(() => {
  if (!games.value) return [];
  const allCategories = games.value.map(game => game.subCategory);
  return [...new Set(allCategories)].sort();
});

// Filter games based on search and category
const filteredGames = computed(() => {
  if (!games.value) return [];
  return games.value.filter(game => {
    const matchesCategory = selectedCategory.value === 'all' || game.subCategory === selectedCategory.value;
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchesCategory && matchesSearch;
  });
});

// SEO Head
useHead({
  title: 'Lipeaks - Play Classic NES & Arcade Games Online Free',
  meta: [
    { name: 'description', content: 'Play hundreds of classic NES and arcade games online for free.' }
  ],
  link: [
    { rel: 'canonical', href: 'https://games.espressox.online/' }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Lipeaks',
        alternateName: 'Lipeaks Classic Games',
        url: 'https://games.espressox.online/',
        description: 'Play classic NES and arcade games online for free'
      })
    }
  ]
});
</script>

<style scoped>
.home-container {
  padding: 2rem;
}
.search-and-filter {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}
.search-input, .filter-select {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.game-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1.5rem;
}
.game-card {
  text-align: center;
}
.game-cover {
  width: 100%;
  height: auto;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  border-radius: 8px;
  transition: transform 0.2s;
}
.game-card:hover .game-cover {
  transform: scale(1.05);
}
.game-name {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #333;
}
</style>