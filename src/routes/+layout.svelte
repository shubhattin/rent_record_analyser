<script lang="ts">
  import { ModeWatcher } from 'mode-watcher';
  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
  import { browser } from '$app/environment';
  import type { Snippet } from 'svelte';
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
</script>

<ModeWatcher />
<div class="contaiiner mx-auto mb-1 max-w-screen-lg">
  <QueryClientProvider client={queryClient}>
    {@render children()}
  </QueryClientProvider>
</div>
