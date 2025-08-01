import type { RequestEvent } from '@sveltejs/kit';
import type { inferAsyncReturnType } from '@trpc/server';
import { getUserFromCookieAccessToken } from './routers/auth';

export async function createContext(event: RequestEvent) {
  const { cookies } = event;

  const user = await getUserFromCookieAccessToken(cookies);
  return {
    user,
    cookies
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
