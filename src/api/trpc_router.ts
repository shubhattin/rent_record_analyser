import { data_add_edit_router } from './routers/add_edit_data';
import { auth_router } from './routers/auth';
import { t } from './trpc_init';
import { rent_data_router } from './routers/rent_data';

export const router = t.router({
  data: data_add_edit_router,
  auth: auth_router,
  rent_data: rent_data_router
});

export type Router = typeof router;
