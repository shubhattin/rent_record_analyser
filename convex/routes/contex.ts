import { type QueryCtx } from '../_generated/server';

export const verifyAuthUser = async (ctx: QueryCtx) => {
  const user = await ctx.auth.getUserIdentity();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
};

export const verifyAuthAdminUser = async (ctx: QueryCtx) => {
  const user = await verifyAuthUser(ctx);
  if (user?.role !== 'admin') {
    throw new Error('Unauthorized');
  }
  return user;
};
