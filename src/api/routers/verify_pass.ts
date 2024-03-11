import { t } from '@api/trpc_init';
import { db } from '@db/db';
import { puShTi } from '@tools/hash';
import { z } from 'zod';
import { JWT_SECRET } from '@tools/jwt';
import jwt from 'jsonwebtoken';
import { UsersSchemaZod } from '@db/schema';

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

export const get_user_info_from_jwt = (jwt_token: string) => {
  const jwt_payload_schema = UsersSchemaZod.pick({
    id: true,
    is_admin: true
  });
  let payload: z.infer<typeof jwt_payload_schema>;
  payload = jwt_payload_schema.parse(jwt.verify(jwt_token, JWT_SECRET));
  return payload;
};

export const verify_pass_router = t.procedure
  .input(z.object({ user_id: z.number().int(), password: z.string() }))
  .output(
    z
      .object({ verified: z.literal(false) })
      .or(z.object({ verified: z.literal(true), jwt_token: z.string() }))
  )
  .query(async ({ input: { password, user_id } }) => {
    const verified = await get_pass_verify_status(user_id, password);
    if (!verified) return { verified };
    const payload = (await db.query.users.findFirst({
      columns: {
        id: true,
        is_admin: true
      },
      where: ({ id }, { eq }) => eq(id, user_id)
    }))!;
    const jwt_token = jwt.sign(payload, JWT_SECRET, { expiresIn: '5min' });
    return { verified, jwt_token };
  });
