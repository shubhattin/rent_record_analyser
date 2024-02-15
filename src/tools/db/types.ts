import { pgTable, serial, date, varchar, integer, json } from 'drizzle-orm/pg-core';

export const rent_data_table = pgTable('rent_data', {
  id: serial('id').primaryKey(),
  amount: integer('amount').notNull(),
  date: date('date', { mode: 'date' }).notNull(),
  month: date('month', { mode: 'date' }).notNull()
});

export const others_table = pgTable('others', {
  key: varchar('key', { length: 20 }).primaryKey(),
  value: json('value').notNull()
});

export const schema = {
  others: others_table,
  rent_data: rent_data_table
};

export type RentData = typeof rent_data_table.$inferSelect;
