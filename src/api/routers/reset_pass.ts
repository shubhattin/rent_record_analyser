import { db } from '@db/db';
import { t } from '../trpc_init';
import { z } from 'zod';
import { users } from '@db/schema';
import { gen_salt, hash_256 } from '@tools/hash';
import { INVALID_USER_ERROR } from './verify_pass';
import { eq } from 'drizzle-orm';

export const reset_pass_router = t.procedure
  .input(
    z.object({
      new_password: z.string()
    })
  )
  .output(
    z.object({
      status: z.union([z.literal('wrong_key'), z.literal('success')])
    })
  )
  .mutation(async ({ input: { new_password }, ctx: { user } }) => {
    if (!user) throw INVALID_USER_ERROR;

    const salt = gen_salt();
    const hash = (await hash_256(new_password + salt)) + salt;

    await db.update(users).set({ password: hash }).where(eq(users.id, user.id));

    return {
      status: 'success'
    };
  });
