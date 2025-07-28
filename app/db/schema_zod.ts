import { others, rent_data, verification_requests, users } from './schema';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const RentDataSchemaZod = createSelectSchema(rent_data, {
  date: z.coerce.date(),
  month: z.coerce.date()
});
export const OthersSchemaZod = createSelectSchema(others);
export const UsersSchemaZod = createSelectSchema(users);
export const VerficationRequestsSchemaZod = createSelectSchema(verification_requests);
