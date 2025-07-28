<script setup lang="ts">
import { ref } from 'vue';
import { useAuth } from '~/composables/useAuth';
import { deleteAuthCookies } from '~/tools/auth_tools';
import { Button } from '~/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '~/components/ui/alert-dialog';

const { user_info } = useAuth();
const userInfoPopoverOpen = ref(false);
const logoutDialogOpen = ref(false);

const logOut = async () => {
  deleteAuthCookies();
  logoutDialogOpen.value = false;
  userInfoPopoverOpen.value = false;
  user_info.value = null;
};
</script>

<template>
  <Popover v-model:open="userInfoPopoverOpen">
    <PopoverTrigger as-child>
      <Button
        variant="ghost"
        size="icon"
        class="h-10 w-10 outline-none select-none hover:text-gray-600 dark:hover:text-gray-400"
      >
        <Icon name="lucide:user" class="h-6 w-6" />
      </Button>
    </PopoverTrigger>

    <PopoverContent class="w-64 p-2" align="end">
      <div class="space-y-2 select-none">
        <!-- User Info -->
        <div class="border-b pb-2 text-center">
          <div class="flex items-center justify-center gap-2 text-base font-bold">
            <Icon name="lucide:user" class="h-5 w-5" />
            {{ user_info?.name }}
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400">#{{ user_info?.id }}</div>
        </div>

        <!-- Logout Button -->
        <div class="pt-1">
          <AlertDialog v-model:open="logoutDialogOpen">
            <AlertDialogTrigger as-child>
              <Button variant="destructive" class="w-full gap-2 font-bold">
                <Icon name="lucide:log-out" class="h-4 w-4" />
                Logout
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure to logout?</AlertDialogTitle>
                <AlertDialogDescription>
                  You will need to authenticate again to access the application.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction @click="logOut"> Confirm </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>
