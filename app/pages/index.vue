<script setup lang="ts">
const { $client_q } = useNuxtApp();

// Set page title
useHead({
  title: 'Home - Rent Record Manager'
});
</script>
<template>
  <div class="space-y-6">
    <div class="text-center">
      <h1 class="text-4xl font-bold tracking-tight">Rent Record Manager</h1>
      <p class="text-muted-foreground mt-2 text-xl">
        Track and manage your rental records efficiently
      </p>
    </div>
  </div>
</template>
