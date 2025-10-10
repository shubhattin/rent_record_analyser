import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  rent_data: defineTable({
    amount: v.number(),
    month: v.string(), // Format: YYYY-MM, validate in app logic if needed
    created_at: v.number(), // You may want to use Convex's createdAt system field instead
    updated_at: v.number(),
    date: v.string(), // yyyy-mm-dd format to auto handle ordering by this key
    user_id: v.string(),
    rent_type: v.union(v.literal('rent'), v.literal('electricity'))
  })
    .index('month_date', ['month', 'date'])
    .index('date', ['date']),
  others: defineTable({
    key: v.string(),
    value: v.string()
  }).index('key', ['key']),

  verification_requests: defineTable({
    rent_data_id: v.id('rent_data')
  })
});
