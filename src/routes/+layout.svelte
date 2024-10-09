<script lang="ts">
  import { ModeWatcher } from 'mode-watcher';
  import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
  import { storePopup } from '@skeletonlabs/skeleton';
  import '@fontsource/roboto/latin.css';
  import type { Snippet } from 'svelte';
  import { browser } from '$app/environment';
  import '../app.pcss';

  let { children }: { children: Snippet } = $props();

  // set up the floating UI for popups
  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

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
