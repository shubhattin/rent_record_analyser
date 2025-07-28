<script setup lang="ts">
import { ref, watch } from 'vue';
import { get_id_token_info, storeAuthInfo } from '~/tools/auth_tools';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '~/components/ui/select';
import { cn } from '~/lib/utils';
import { useMutation } from '@tanstack/vue-query';

interface User {
  id: number;
  name: string;
}

interface Props {
  usersData: User[];
}

const props = defineProps<Props>();
const { $client } = useNuxtApp();
const { user_info } = useAuth();

const selectedUserId = ref<string | undefined>(undefined);
const password = ref('');
const wrongPassStatus = ref(false);
const passInputElement = ref<HTMLInputElement>();

// Auto-hide wrong password status after 1 second
watch(wrongPassStatus, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      wrongPassStatus.value = false;
    }, 1000);
  }
});

const { isPending, mutate } = useMutation({
  mutationFn: $client.auth.verify_pass.mutate,
  onSuccess(data) {
    if (!data.verified) {
      password.value = '';
      passInputElement.value?.focus();
      wrongPassStatus.value = true;
    } else {
      storeAuthInfo(data);
      user_info.value = get_id_token_info().user;
    }
  },
  onError(error) {
    console.error('Authentication error:', error);
    wrongPassStatus.value = true;
  }
});

const check_password_func = async (e: Event) => {
  e.preventDefault();
  if (!selectedUserId.value || password.value === '' || isPending.value) return;

  mutate({
    id: parseInt(selectedUserId.value),
    password: password.value
  });
};
</script>

<template>
  <div class="text-lg font-bold text-orange-600 dark:text-yellow-500">Authentication</div>

  <form @submit.prevent="check_password_func" class="mt-2 space-y-2.5">
    <div class="space-y-2">
      <Select v-model="selectedUserId">
        <SelectTrigger class="font-bold">
          <SelectValue :placeholder="'Select user...'" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            v-for="user in usersData"
            :key="user.id"
            :value="user.id.toString()"
            class="font-semibold"
          >
            {{ user.id }} → {{ user.name }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div class="space-y-2">
      <Input
        id="password"
        ref="passInputElement"
        v-model="password"
        type="password"
        placeholder="गूढपद"
        required
        :class="cn('w-full', wrongPassStatus && 'border-red-500 bg-red-50 dark:bg-red-950')"
      />
    </div>

    <Button type="submit" :disabled="isPending" class="gap-2 px-4 py-1 font-semibold">
      <Icon v-if="isPending" name="lucide:loader-2" class="h-4 w-4 animate-spin" />
      Submit
    </Button>
  </form>
</template>
