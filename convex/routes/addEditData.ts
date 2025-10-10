import { mutation } from '../_generated/server';
import { v } from 'convex/values';
import { verifyAuthAdminUser, verifyAuthUser } from './context';
import { z } from 'zod';

const rentDataTypeValidator = v.union(v.literal('rent'), v.literal('electricity'));
const dateMonthAmountSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  month: z.string().regex(/^\d{4}-\d{2}$/),
  amount: z.int().min(100)
});

export const addRentData = mutation({
  args: {
    amount: v.number(),
    rent_type: rentDataTypeValidator,
    date: v.string(),
    month: v.string()
  },
  handler: async (ctx, args) => {
    const user = await verifyAuthUser(ctx);
    const { rent_type } = args;
    const { date, month, amount } = dateMonthAmountSchema.parse(args);

    const rentDataId = await ctx.db.insert('rent_data', {
      amount: amount,
      rent_type,
      date,
      month,
      user_id: user.subject,
      created_at: Date.now(),
      updated_at: Date.now()
    });
    if (user.role !== 'admin')
      await ctx.db.insert('verification_requests', {
        rent_data_id: rentDataId
      });

    return {
      success: true
    };
  }
});

export const editRentData = mutation({
  args: {
    id: v.id('rent_data'),
    amount: v.number(),
    date: v.string(),
    month: v.string()
  },
  handler: async (ctx, args) => {
    await verifyAuthAdminUser(ctx);
    const { id } = args;
    const { date, month, amount } = dateMonthAmountSchema.parse(args);

    await ctx.db.patch(id, {
      amount,
      date,
      month,
      updated_at: new Date().getTime()
    });

    return {
      updated: true
    };
  }
});

export const verifyRentData = mutation({
  args: {
    id: v.id('verification_requests')
  },
  handler: async (ctx, args) => {
    await verifyAuthAdminUser(ctx);

    await ctx.db.delete(args.id);

    return {
      verified: true
    };
  }
});

export const deleteRentData = mutation({
  args: {
    id: v.id('rent_data')
  },
  handler: async (ctx, { id }) => {
    await verifyAuthAdminUser(ctx);

    await ctx.db.delete(id);

    return {
      deleted: true
    };
  }
});
