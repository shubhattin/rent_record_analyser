import { query } from '../_generated/server';
import { v } from 'convex/values';

export const getTask = query({
  args: {},
  handler: async (ctx, args) => {
    const auth = await ctx.auth.getUserIdentity();
    const data = await ctx.db.query('rent_data').collect();
    return data;
  }
});
