<template>
  <ClientOnly>
    <FCEmulator v-bind="$attrs" />
    <template #fallback>
      <div style="padding: 1rem; text-align: center;">
        Loading emulator...
      </div>
    </template>
  </ClientOnly>
</template>

<script setup>
import FCEmulator from './FCEmulator.vue'
</script>
