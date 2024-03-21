import { db } from '@db/db';
import { protectedProcedure } from '../trpc_init';
import { z } from 'zod';
import { users } from '@db/schema';
import { gen_salt, hash_256 } from '@tools/hash';
import { eq } from 'drizzle-orm';

export const reset_pass_router = protectedProcedure
  .input(
    z.object({
      new_password: z.string()
    })
  )
  .mutation(async ({ input: { new_password }, ctx: { user } }) => {
    const salt = gen_salt();
    const hash = (await hash_256(new_password + salt)) + salt;

    await db.update(users).set({ password: hash }).where(eq(users.id, user.id));

    return {
      status: 'success'
    };
  });
