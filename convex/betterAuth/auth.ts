import { createAuth } from '../auth';
import { getStaticAuth } from '@convex-dev/better-auth';
import { query } from './_generated/server';
import { v } from 'convex/values';

// Export a static instance for Better Auth schema generation
export const auth = getStaticAuth(createAuth);

export const getUserInfo = query({
  args: {
    user_id: v.id('user')
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.user_id);
    return {
      _id: user?._id,
      name: user?.name,
      username: user?.username,
      role: user?.role
    };
  }
});
