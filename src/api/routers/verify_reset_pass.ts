import { protectedProcedure, publicProcedure, t } from '../trpc_init';
import { users } from '~/db/schema';
import { gen_salt, hash_256, puShTi } from '~/tools/hash';
import { eq } from 'drizzle-orm';
import { db } from '~/db/db';
import { z } from 'zod';
import { JWT_SECRET } from '~/tools/jwt';
import { SignJWT } from 'jose';
import { delay } from '~/tools/delay';

const JWT_EXPIRATION_TIME = '10min';

const get_pass_verify_status = async (user_id: number, password: string) => {
  const query = await db.query.users.findFirst({
    columns: { password: true },
    where: ({ id }, { eq }) => eq(id, user_id)
  });
  if (!query) return false;
  const hash = query.password;
  const verified = puShTi(password, hash);
  return verified;
};

export const verify_pass_router = publicProcedure
  .input(z.object({ user_id: z.number().int(), password: z.string() }))
  .output(
    z
      .object({ verified: z.literal(false) })
      .or(z.object({ verified: z.literal(true), jwt_token: z.string() }))
  )
  .mutation(async ({ input: { password, user_id } }) => {
    await delay(500);
    const verified = await get_pass_verify_status(user_id, password);
    if (!verified) return { verified };
    const payload = (await db.query.users.findFirst({
      columns: {
        id: true,
        user_type: true
      },
      where: ({ id }, { eq }) => eq(id, user_id)
    }))!;
    // const jwt_token = jwt.sign(payload, JWT_SECRET, { expiresIn: '5min' });
    const jwt_token = await new SignJWT(payload)
      .setProtectedHeader({
        alg: 'HS256'
      })
      .setIssuedAt()
      .setExpirationTime(JWT_EXPIRATION_TIME)
      .sign(JWT_SECRET);
    return { verified, jwt_token };
  });

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

export const pass_verify_reset_router = t.router({
  verify_pass: verify_pass_router,
  reset_pass: reset_pass_router
});
