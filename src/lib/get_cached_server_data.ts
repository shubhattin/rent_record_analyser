import { fetchQuery } from 'convex/nextjs';
import { api } from '$convex/_generated/api';
import { getToken } from '~/lib/auth-server';
import { cache } from 'react';

export const getCachedUser = cache(async () => {
  const token = await getToken();
  const user = await fetchQuery(api.auth.getCurrentUser, {}, { token });
  return user;
});
