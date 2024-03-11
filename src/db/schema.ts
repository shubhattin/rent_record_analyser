import { pgTable, serial, date, varchar, integer, text, boolean, char } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const rent_data = pgTable('rent_data', {
  id: serial('id').primaryKey(),
  amount: integer('amount').notNull(),
  date: date('date', { mode: 'date' }).notNull(),
  month: date('month', { mode: 'date' }).notNull(),
  user_id: integer('user_id').references(() => users.id, { onDelete: 'set null' })
});

export const others = pgTable('others', {
  key: varchar('key', { length: 20 }).primaryKey(),
  value: text('value').notNull()
});

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 15 }).notNull(),
  password: char('password', { length: 96 }).notNull(), // SHA-256 hash + salt of length 32
  is_admin: boolean('is_admin').notNull().default(false)
});

export const verification_requests = pgTable('verification_requests', {
  id: integer('id')
    .primaryKey()
    .references(() => rent_data.id, { onDelete: 'cascade' })
});

export const schema = {
  others: others,
  rent_data: rent_data,
  users: users,
  verification_requests: verification_requests
};

export const RentDataSchemaZod = createSelectSchema(rent_data, {
  date: z.coerce.date(),
  month: z.coerce.date()
});
export const OthersSchemaZod = createSelectSchema(others);
export const UsersSchemaZod = createSelectSchema(users);
export const VerficationRequestsSchemaZod = createSelectSchema(verification_requests);
