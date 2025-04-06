<script lang="ts">
  import { ModeWatcher } from 'mode-watcher';
  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
  import { browser } from '$app/environment';
  import { onMount, type Snippet } from 'svelte';
  import TopAppBar from '~/components/TopAppBar.svelte';
  import { pwa_state } from '~/state/main.svelte';
  import '@fontsource/roboto/latin.css';
  import '../app.css';
  import '../app.scss';

  let { children }: { children: Snippet } = $props();

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: browser
      }
    }
  });
  onMount(() => {
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      pwa_state.event_triggerer = event;
      pwa_state.install_event_fired = true;
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
