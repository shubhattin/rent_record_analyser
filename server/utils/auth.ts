import { jwtVerify } from 'jose';
import { getCookie } from 'h3';
import { z } from 'zod';
import { JWT_SECRET } from '@/tools/jwt.server';
import { user_info_schema } from '@/api/routers/auth';
import { AUTH_ID_LOC } from '@/tools/auth_tools';
import type { H3Event } from 'h3';

export type User = z.infer<typeof user_info_schema>;

const id_token_payload_schema = z.object({
  user: user_info_schema,
  type: z.literal('login')
});

export async function getCurrentUser(event: H3Event): Promise<User | null> {
  const token = getCookie(event, AUTH_ID_LOC);
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      algorithms: ['HS256']
    });

    const parsed = id_token_payload_schema.parse(payload);
    return parsed.user;
  } catch {
    return null;
  }
}
