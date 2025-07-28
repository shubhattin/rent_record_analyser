<script setup lang="ts">
import { useAuth } from '~/composables/useAuth';
import AuthenticatePassword from '~/components/pages/add/AuthenticatePassword.vue';
import UserControls from '~/components/pages/add/UserControls.vue';
import AddRentData from '~/components/pages/add/AddRentData.vue';

// Set page title
useHead({
  title: 'Add Record'
});

const { isLoggedIn } = useAuth();

const { data } = await useFetch('/api/get_users_list');
const users_list = computed(() => data.value?.users ?? []);
</script>

<template>
  <div class="mt-4">
    <div v-if="!isLoggedIn" class="space-y-4">
      <AuthenticatePassword :users-data="users_list" />
    </div>

    <div v-else class="space-y-4">
      <div class="flex justify-end">
        <UserControls />
      </div>

      <AddRentData />
    </div>
  </div>
</template>
