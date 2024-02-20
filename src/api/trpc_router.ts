import { addDataRouter } from './routers/add_data';
import { editDataRouter } from './routers/edit_data';
import { t } from './trpc_init';

export const router = t.router({
  add_data: addDataRouter,
  edit_data: editDataRouter
});

export type Router = typeof router;
