import { defineNuxtPlugin } from '#app';
import { getCurrentUser, type User } from '../../server/utils/auth';
import type { H3Event } from 'h3';

export default defineNuxtPlugin(async (nuxtApp) => {
  // on SSR, before rendering, fetch the user & prime the state
  const userState = useState<User | null>('auth_user', () => null);
  if (import.meta.server) {
    const user = await getCurrentUser(nuxtApp.ssrContext?.event as H3Event);
    userState.value = user;
  }
});
