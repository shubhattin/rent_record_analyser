import { UsersSchemaZod } from '~/db/schema_zod';
import { jwtVerify } from 'jose';
import { JWT_SECRET } from '~/tools/jwt.server';
import type { RequestEvent } from '@sveltejs/kit';
import type { inferAsyncReturnType } from '@trpc/server';
import { z } from 'zod';
import { ACCESS_ID_LOC } from './routers/auth';

const access_token_payload_schema = z.object({
  user: UsersSchemaZod.pick({
    id: true,
    user_type: true
  }),
  type: z.literal('api')
});

export async function createContext(event: RequestEvent) {
  const { cookies } = event;

  async function getUserFromHeader() {
    try {
      const access_token = cookies.get(ACCESS_ID_LOC);
      if (access_token) {
        const jwt_data = await jwtVerify(access_token, JWT_SECRET, {
          algorithms: ['HS256']
        });
        const payload = access_token_payload_schema.parse(jwt_data.payload);
        const user = payload.user;
        return user;
      }
    } catch {}
    return null;
  }

  const user = await getUserFromHeader();
  return {
    user,
    cookies
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
