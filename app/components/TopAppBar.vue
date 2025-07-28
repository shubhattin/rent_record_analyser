<script setup lang="ts">
import { Button } from '~/components/ui/button';
import Popover from '~/components/ui/popover/Popover.vue';
import PopoverContent from '~/components/ui/popover/PopoverContent.vue';
import PopoverTrigger from '~/components/ui/popover/PopoverTrigger.vue';
import ThemeChanger from '~/components/ThemeChanger.vue';

const route = useRoute();
const { currentPageTitle } = usePageTitles();
const pwa = usePWA();

const isMenuOpen = ref(false);

const handlePWAInstall = async () => {
  isMenuOpen.value = false;
  await pwa.promptInstall();
};

// Setup PWA listener on mount
onMounted(() => {
  pwa.setupPWAInstallListener();
});
</script>

<template>
  <header
    class="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-slate-100 via-stone-100 to-zinc-100 backdrop-blur supports-[backdrop-filter]:bg-gradient-to-r supports-[backdrop-filter]:from-slate-100/90 supports-[backdrop-filter]:via-stone-100/90 supports-[backdrop-filter]:to-zinc-100/90 dark:bg-gradient-to-r dark:from-slate-800 dark:via-stone-800 dark:to-zinc-800 dark:supports-[backdrop-filter]:from-slate-800/90 dark:supports-[backdrop-filter]:via-stone-800/90 dark:supports-[backdrop-filter]:to-zinc-800/90"
  >
    <div class="container flex h-14 items-center justify-between px-4">
      <!-- Left side - Back button and title -->
      <div class="flex items-center space-x-3">
        <NuxtLink
          v-if="route.path !== '/'"
          to="/"
          class="hover:bg-accent hover:text-accent-foreground inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors"
        >
          <Icon
            name="lucide:arrow-left"
            class="size-6 hover:text-red-600 dark:hover:text-sky-400"
          />
        </NuxtLink>

        <!-- Page title -->
        <h1 :class="currentPageTitle[1]">
          {{ currentPageTitle[0] }}
        </h1>
      </div>

      <!-- Right side - Navigation and menu -->
      <div class="flex items-center space-x-2">
        <!-- Quick navigation buttons -->
        <NuxtLink
          v-if="route.path !== '/add'"
          to="/add"
          class="hover:bg-accent group hover:text-accent-foreground inline-flex size-9 items-center justify-center rounded-md transition-colors"
        >
          <Icon name="lucide:plus" class="size-5 group-hover:text-green-400" />
        </NuxtLink>

        <!-- <NuxtLink
          v-if="route.path !== '/list'"
          to="/list"
          class="hover:bg-accent group hover:text-accent-foreground inline-flex size-9 items-center justify-center rounded-md transition-colors"
        >
          <Icon name="lucide:edit" class="size-6 group-hover:text-blue-400" />
        </NuxtLink> -->

        <!-- Menu popover -->
        <Popover v-model:open="isMenuOpen">
          <PopoverTrigger as-child>
            <Button variant="ghost">
              <Icon name="lucide:menu" class="size-10" />
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-56 p-0">
            <div class="flex flex-col space-y-1 p-2">
              <!-- GitHub link -->
              <a
                href="https://github.com/shubhattin/rent_record_analyser"
                target="_blank"
                rel="noopener noreferrer"
                class="hover:bg-accent hover:text-accent-foreground flex items-center space-x-2 rounded-md px-2 py-2 text-sm transition-colors"
                @click="isMenuOpen = false"
              >
                <Icon name="lucide:github" class="h-4 w-4" />
                <span>GitHub</span>
              </a>

              <!-- PWA Install button -->
              <Button
                v-if="pwa.installEventFired.value"
                variant="ghost"
                class="h-auto w-full justify-start p-2 text-sm"
                @click="handlePWAInstall"
              >
                <Icon name="lucide:download" class="mr-2 size-6" />
                Install App
              </Button>

              <!-- Theme changer -->
              <div class="flex items-center justify-between px-2 py-2">
                <span class="text-sm">Theme</span>
                <ThemeChanger />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  </header>
</template>
