import {
  pgTable,
  serial,
  date,
  varchar,
  integer,
  text,
  char,
  pgEnum,
  index,
  timestamp,
  check
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { user } from './auth-schema';

export * from './auth-schema';

export const rentTypeEnum = pgEnum('rent_type', ['rent', 'electricity']);

export const rent_data = pgTable(
  'rent_data',
  {
    id: serial().primaryKey(),
    amount: integer().notNull(),
    month: char({ length: 7 }).notNull(), // YYYY-MM
    created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp({ withTimezone: true })
      .notNull()
      .$onUpdate(() => new Date()),
    date: date({ mode: 'string' }).notNull(),
    user_id: text().references(() => user.id, { onDelete: 'set null' }),
    rent_type: rentTypeEnum().default('rent').notNull()
  },
  ({ date, month }) => [
    index().on(date),
    index().on(month),
    check('rent_data_month_format_check', sql`${month} ~ '^[0-9]{4}-[0-9]{2}$'`)
  ]
);

export const others = pgTable('others', {
  key: varchar({ length: 20 }).primaryKey(),
  value: text().notNull()
});

export const verification_requests = pgTable('verification_requests', {
  id: integer()
    .primaryKey()
    .references(() => rent_data.id, { onDelete: 'cascade' })
});

/* The relations defined below are only for the `query` API of drizzle */

export const dataRelation = relations(rent_data, ({ one }) => ({
  user_info: one(user, { fields: [rent_data.user_id], references: [user.id] }),
  verification_requests: one(verification_requests)
}));

export const userRelation = relations(user, ({ many }) => ({
  rent_data: many(rent_data)
  // here relation was auto-inferred as rent_data.user_id -> users.id
}));

export const verificationRelation = relations(verification_requests, ({ one }) => ({
  rent_data: one(rent_data, { fields: [verification_requests.id], references: [rent_data.id] })
}));
