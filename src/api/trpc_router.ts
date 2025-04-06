import { data_add_edit_router } from './routers/add_edit_data';
import { auth_router } from './routers/auth';
import { t } from './trpc_init';

export const router = t.router({
  data: data_add_edit_router,
  auth: auth_router
});

export type Router = typeof router;
