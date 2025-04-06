import { z } from 'zod';
import type { LayoutServerLoad } from './$types'; // Adjust the path based on your project structure
import { JWT_SECRET } from '~/tools/jwt.server';
import { jwtVerify } from 'jose';
import { user_info_schema } from '~/api/routers/auth';
import { AUTH_ID_LOC } from '~/tools/auth_tools';

export const load: LayoutServerLoad = async ({ cookies }) => {
  let user: z.infer<typeof user_info_schema> | null = null!;
  try {
    // this is for verifying the user's identity and not the authorization
    const id_token = cookies.get(AUTH_ID_LOC);
    const id_token_payload_schema = z.object({
      user: user_info_schema,
      type: z.literal('login')
    });
    if (id_token) {
      const jwt_data = await jwtVerify(id_token, JWT_SECRET, {
        algorithms: ['HS256']
      });
      const payload = id_token_payload_schema.parse(jwt_data.payload);
      user = payload.user;
    }
  } catch {}

  return {
    user
  };
};
