import type { RequestEvent } from '@sveltejs/kit';
import type { inferAsyncReturnType } from '@trpc/server';
import { createConvexHttpClient } from '@mmailaender/convex-better-auth-svelte/sveltekit';
import { api } from '$convex/_generated/api';
export async function createContext(event: RequestEvent) {
  const {
    request: { headers }
  } = event;
  const client = createConvexHttpClient({ cookies: event.cookies });
  const currentUser = await client.query(api.auth.getCurrentUser, {});

  const cookie = headers.get('Cookie');

  return {
    user: currentUser,
    cookie
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
