import { others, rent_data, verification_requests, users } from './schema';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const RentDataSchemaZod = createSelectSchema(rent_data, {
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  month: z.string().regex(/^\d{4}-\d{2}$/)
});
export const OthersSchemaZod = createSelectSchema(others);
export const UsersSchemaZod = createSelectSchema(users);
export const VerficationRequestsSchemaZod = createSelectSchema(verification_requests);
