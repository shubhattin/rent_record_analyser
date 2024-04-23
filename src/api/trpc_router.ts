import { data_add_edit_router } from './routers/add_edit_data';
import { pass_verify_reset_router } from './routers/verify_reset_pass';
import { t } from './trpc_init';

export const router = t.router({
  data: data_add_edit_router,
  pass: pass_verify_reset_router
});

export type Router = typeof router;
