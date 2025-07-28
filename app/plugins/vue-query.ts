import { VueQueryPlugin, QueryClient, hydrate, dehydrate } from '@tanstack/vue-query';

export default defineNuxtPlugin((nuxtApp) => {
  // 1) create a client with your defaults
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // e.g. 5 minutes
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false
      }
    }
  });

  // 2) install the VueQuery plugin
  nuxtApp.vueApp.use(VueQueryPlugin, { queryClient });

  // 3) SSR: after rendering on server, inject the dehydrated state
  if (import.meta.server) {
    nuxtApp.hook('app:rendered', () => {
      nuxtApp.payload.vueQueryState = dehydrate(queryClient);
    });
  }

  // 4) CSR: on client, rehydrate the state
  if (import.meta.client) {
    const state = nuxtApp.payload.vueQueryState;
    if (state) {
      hydrate(queryClient, state);
    }
  }
});
