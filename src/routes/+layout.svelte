<script lang="ts">
  import { ModeWatcher } from 'mode-watcher';
  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
  import { browser } from '$app/environment';
  import { onMount, type Snippet } from 'svelte';
  import TopAppBar from '~/components/TopAppBar.svelte';
  import '@fontsource/roboto/latin.css';
  import '../app.pcss';

  let { children }: { children: Snippet } = $props();

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: browser
      }
    }
  });
  onMount(() => {
    console.log('omn');
    window.addEventListener('beforeinstallprompt', (event) => {
      // event_fired = true;
      event.preventDefault();
      // install_prompt = event;
      console.log('PWA Install Prompt event fired', [event]);
    });
  });
</script>

<ModeWatcher />
<div class="contaiiner mx-auto mb-1 max-w-screen-lg">
  <QueryClientProvider client={queryClient}>
    <TopAppBar />
    {@render children()}
  </QueryClientProvider>
</div>
