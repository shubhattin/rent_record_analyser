<script setup lang="ts">
interface User {
  id: number;
  name: string;
  email: string;
}

const user = ref<User>({
  id: 1,
  name: 'John Doe',
  email: 'john@example.com'
});

const count = ref<number>(0);
</script>

<template>
  <div>
    <!-- These should cause type errors if template type checking is working: -->

    <!-- 1. Accessing non-existent property -->
    <p>{{ user.nonExistentProperty }}</p>

    <!-- 2. Wrong property type usage -->
    <p>{{ user.id.toUpperCase() }}</p>

    <!-- 3. Wrong argument type -->
    <button @click="count = 'hello'">Invalid assignment</button>

    <!-- These should work fine: -->
    <p>{{ user.name }}</p>
    <p>{{ user.email }}</p>
    <p>{{ count }}</p>
  </div>
</template>
