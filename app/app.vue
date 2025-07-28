<template>
  <main class="contaiiner mx-auto mb-1 max-w-screen-lg">
    <TopAppBar />
    <NuxtPage />
  </main>
</template>

<script setup lang="ts">
useHead({
  htmlAttrs: {
    class: 'dark'
  },
  bodyAttrs: {
    class: 'container mx-auto mb-1 px-2'
  }
});
</script>
