import {
  pgTable,
  serial,
  date,
  varchar,
  integer,
  text,
  char,
  pgEnum,
  index
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const rentTypeEnum = pgEnum('rent_type', ['rent', 'electricity']);

export const rent_data = pgTable(
  'rent_data',
  {
    id: serial().primaryKey(),
    amount: integer().notNull(),
    date: date({ mode: 'date' }).notNull(),
    month: date({ mode: 'date' }).notNull(),
    user_id: integer().references(() => users.id, { onDelete: 'set null' }),
    rent_type: rentTypeEnum().default('rent').notNull()
  },
  ({ date, month }) => [index().on(date), index().on(month)]
);

export const others = pgTable('others', {
  key: varchar({ length: 20 }).primaryKey(),
  value: text().notNull()
});

export const userTypeEnum = pgEnum('user_type', ['admin', 'non-admin']);

export const users = pgTable('users', {
  id: serial().primaryKey(),
  name: varchar({ length: 15 }).notNull(),
  password: char({ length: 96 }).notNull(), // SHA-256 hash + salt of length 32
  user_type: userTypeEnum().default('non-admin').notNull()
});

export const verification_requests = pgTable('verification_requests', {
  id: integer()
    .primaryKey()
    .references(() => rent_data.id, { onDelete: 'cascade' })
});

/* The relations defined below are only for the `query` API of drizzle */

export const dataRelation = relations(rent_data, ({ one }) => ({
  user_info: one(users, { fields: [rent_data.user_id], references: [users.id] }),
  verification_requests: one(verification_requests)
}));

export const userRelation = relations(users, ({ many }) => ({
  rent_data: many(rent_data)
  // here relation was auto-inferred as rent_data.user_id -> users.id
}));

export const verificationRelation = relations(verification_requests, ({ one }) => ({
  rent_data: one(rent_data, { fields: [verification_requests.id], references: [rent_data.id] })
}));
