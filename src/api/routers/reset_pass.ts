import { db } from '@db/db';
import { t } from '../trpc_init';
import { z } from 'zod';
import { users } from '@db/schema';
import { gen_salt, hash_256 } from '@tools/hash';
import { get_user_info_from_jwt } from './verify_pass';
import { eq } from 'drizzle-orm';

export const reset_pass_router = t.procedure
  .input(
    z.object({
      jwt_token: z.string(),
      new_password: z.string()
    })
  )
  .output(
    z.object({
      status: z.union([z.literal('wrong_key'), z.literal('success')])
    })
  )
  .mutation(async ({ input: { jwt_token, new_password } }) => {
    let user_info: ReturnType<typeof get_user_info_from_jwt>;
    try {
      user_info = get_user_info_from_jwt(jwt_token);
    } catch {
      return {
        status: 'wrong_key'
      };
    }

    const salt = gen_salt();
    const hash = (await hash_256(new_password + salt)) + salt;

    await db.update(users).set({ password: hash }).where(eq(users.id, user_info.id));

    return {
      status: 'success'
    };
  });
