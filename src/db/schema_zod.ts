import { others, rent_data, verification_requests, user, account, verification } from './schema';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// User

export const UserSchemaZod = createSelectSchema(user, {
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  banExpires: z.coerce.date().nullable()
});
export const AccountSchemaZod = createSelectSchema(account, {
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  accessTokenExpiresAt: z.coerce.date().nullable(),
  refreshTokenExpiresAt: z.coerce.date().nullable()
});
export const VerificationSchemaZod = createSelectSchema(verification, {
  createdAt: z.coerce.date().nullable(),
  updatedAt: z.coerce.date().nullable(),
  expiresAt: z.coerce.date()
});

// Main

export const RentDataSchemaZod = createSelectSchema(rent_data, {
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  month: z.string().regex(/^\d{4}-\d{2}$/)
});
export const OthersSchemaZod = createSelectSchema(others);
export const VerficationRequestsSchemaZod = createSelectSchema(verification_requests);
