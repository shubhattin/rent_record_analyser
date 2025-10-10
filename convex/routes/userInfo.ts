import { v } from 'convex/values';
import { query } from '../_generated/server';
import { components } from '../_generated/api';
import { verifyAuthUser } from './context';

export const getUserInfo = query({
  args: {
    user_id: v.string()
  },
  handler: async (ctx, args) => {
    await verifyAuthUser(ctx);
    const user = ctx.runQuery(components.betterAuth.auth.getUserInfo, {
      user_id: args.user_id
    });
    return user;
  }
});
