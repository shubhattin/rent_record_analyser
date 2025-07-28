<template>
  <div class="flex items-center space-x-2">
    <Button
      variant="ghost"
      size="icon"
      @click="() => (colorMode.preference = 'system')"
      :class="['group h-8 w-8', colorMode.preference === 'system' ? 'bg-accent' : '']"
    >
      <Icon
        name="lucide:monitor"
        class="h-4 w-4 group-hover:text-blue-500 dark:group-hover:text-sky-500"
      />
    </Button>

    <Button
      variant="ghost"
      size="icon"
      @click="() => (colorMode.preference = 'light')"
      :class="['group h-8 w-8', colorMode.preference === 'light' ? 'bg-accent' : '']"
    >
      <Icon name="lucide:sun" class="h-4 w-4 group-hover:text-yellow-500" />
    </Button>

    <Button
      variant="ghost"
      size="icon"
      @click="() => (colorMode.preference = 'dark')"
      :class="['group h-8 w-8', colorMode.preference === 'dark' ? 'bg-accent' : '']"
    >
      <Icon
        name="lucide:moon"
        class="h-4 w-4 group-hover:text-purple-600 dark:group-hover:text-white"
      />
    </Button>
  </div>
</template>

<script setup lang="ts">
import { Button } from '~/components/ui/button';

const colorMode = useColorMode();
</script>
