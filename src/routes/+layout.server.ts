import type { LayoutServerLoad } from './$types'; // Adjust the path based on your project structure
import { createConvexHttpClient } from '@mmailaender/convex-better-auth-svelte/sveltekit';
import { api } from '$convex/_generated/api';

export const load: LayoutServerLoad = async ({ request, cookies }) => {
  const client = createConvexHttpClient({ cookies });
  try {
    return {
      currentUser: await client.query(api.auth.getCurrentUser, {})
    };
  } catch (error) {
    console.error(error);
    return { currentUser: null };
  }
};
