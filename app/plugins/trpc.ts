import { createTRPCNuxtClient, httpBatchLink } from 'trpc-nuxt/client';
import type { Router } from '~/api/trpc_router';
import { trpc_client_options } from '~/api/client';

export default defineNuxtPlugin(() => {
  const trpc = createTRPCNuxtClient<Router>(trpc_client_options);

  return {
    provide: {
      client: trpc
    }
  };
});
