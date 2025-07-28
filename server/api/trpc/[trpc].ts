import { createNuxtApiHandler } from 'trpc-nuxt';
import { router } from '~/api/trpc_router';
import { createContext } from '~/api/context';
// export API handler
export default createNuxtApiHandler({
  router,
  createContext
});
