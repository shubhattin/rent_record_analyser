import { UsersSchemaZod } from '~/db/schema_zod';
import { jwtVerify } from 'jose';
import { JWT_SECRET } from '~/tools/jwt.server';
import { z } from 'zod';
import { H3Event } from 'h3';

const access_token_payload_schema = z.object({
  user: UsersSchemaZod.pick({
    id: true,
    user_type: true
  }),
  type: z.literal('api')
});

export async function createContext(event: H3Event) {
  const request = event.node.req;

  async function getUserFromHeader() {
    try {
      const jwt_token = request.headers.authorization?.split(' ')[1]!;
      const jwt_data = await jwtVerify(jwt_token, JWT_SECRET, {
        algorithms: ['HS256']
      });
      const payload = access_token_payload_schema.parse(jwt_data.payload);
      return payload.user;
    } catch {}
    return null;
  }

  const user = await getUserFromHeader();
  return {
    user
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
