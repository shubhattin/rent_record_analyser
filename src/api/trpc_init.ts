import type { Context } from './context';
import { TRPCError, initTRPC } from '@trpc/server';

export const t = initTRPC.context<Context>().create();

export const public_procedure = t.procedure;

export const protected_procedure = public_procedure.use(async function isAuthed({
  next,
  ctx: { user }
}) {
  if (!user) throw new TRPCError({ code: 'UNAUTHORIZED' });
  return next({
    ctx: { user }
  });
});

export const protected_admin_procedure = protected_procedure.use(async function isAuthed({
  next,
  ctx: { user }
}) {
  if (!user.is_admin) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not a Admin User' });
  return next({
    ctx: { user }
  });
});
