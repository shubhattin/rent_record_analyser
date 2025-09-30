import { query } from '../_generated/server';
import { v } from 'convex/values';
import { verifyAuthAdminUser } from './contex';

export const getTask = query({
  args: {},
  handler: async (ctx, args) => {
    // await verifyAuthAdminUser(ctx);
    const data = await ctx.db.query('rent_data').collect();
    return data;
  }
});
