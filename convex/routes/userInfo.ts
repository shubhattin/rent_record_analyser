import { v } from 'convex/values';
import { query } from '../_generated/server';
import { authComponent, createAuth } from '../auth';

export const getUserInfo = query({
  args: {
    user_id: v.string()
  },
  handler: async (ctx, args) => {
    const user = await createAuth(ctx).api.getUser({
      headers: await authComponent.getHeaders(ctx),
      query: {
        id: args.user_id
      }
    });
    return user;
  }
});
