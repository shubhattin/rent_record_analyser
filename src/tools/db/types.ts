import { int, mysqlTable, serial, date, varchar } from 'drizzle-orm/mysql-core';

export const rent_data_table = mysqlTable('rent_data', {
  id: serial('id').primaryKey(),
  amount: int('amount').notNull(),
  date: date('date').notNull(),
  month: date('month').notNull()
});

export const others_table = mysqlTable('others', {
  id: varchar('id', { length: 20 }).primaryKey(),
  value: varchar('value', { length: 100 }).notNull()
});

export const schema = {
  others: others_table,
  rent_data: rent_data_table
};
