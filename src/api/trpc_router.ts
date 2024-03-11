import { add_data_router } from './routers/add_data';
import { edit_data_router } from './routers/edit_data';
import { verify_pass_router } from './routers/verify_pass';
import { reset_pass_router } from './routers/reset_pass';
import { t } from './trpc_init';

export const router = t.router({
  add_data: add_data_router,
  edit_data: edit_data_router,
  verify_pass: verify_pass_router,
  reset_pass: reset_pass_router
});

export type Router = typeof router;
