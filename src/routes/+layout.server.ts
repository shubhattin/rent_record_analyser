import type { LayoutServerLoad } from './$types'; // Adjust the path based on your project structure
import { getUserInfoFromCookieIdToken } from '~/api/routers/auth';

export const load: LayoutServerLoad = async ({ cookies }) => {
  return {
    user: await getUserInfoFromCookieIdToken(cookies)
  };
};
