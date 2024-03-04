import { pgTable, serial, date, varchar, integer, text } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const rent_data = pgTable('rent_data', {
  id: serial('id').primaryKey(),
  amount: integer('amount').notNull(),
  date: date('date', { mode: 'date' }).notNull(),
  month: date('month', { mode: 'date' }).notNull()
});

export const others = pgTable('others', {
  key: varchar('key', { length: 20 }).primaryKey(),
  value: text('value').notNull()
});

export const schema = {
  others: others,
  rent_data: rent_data
};

export type RentData = typeof rent_data.$inferSelect;

export const selectRentDataSchema = createSelectSchema(rent_data, {
  date: z.coerce.date(),
  month: z.coerce.date()
});
export const selectOthersSchema = createSelectSchema(others);
