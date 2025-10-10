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
    const user = ctx.runQuery(components.betterAuth.adapter.findOne, {
      model: 'user',
      where: [
        {
          field: '_id',
          operator: 'eq',
          value: args.user_id
        }
      ]
    });
    return user;
  }
});
