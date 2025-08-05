import { protectedProcedure, publicProcedure, t } from '~/api/trpc_init';
import { z } from 'zod';
import { JWT_SECRET } from '~/tools/jwt.server';
import { jwtVerify, SignJWT, errors, jwtDecrypt } from 'jose';
import { UsersSchemaZod } from '~/db/schema_zod';
import { db } from '~/db/db';
import { users } from '~/db/schema';
import { eq } from 'drizzle-orm';
import { delay } from '~/tools/delay';
import { puShTi_256, hash_256, gen_salt } from '~/tools/hash_tools';
import ms from 'ms';
import type { Cookies } from '@sveltejs/kit';

export const user_info_schema = UsersSchemaZod.pick({
  id: true,
  name: true,
  user_type: true
});
type user_info_type = z.infer<typeof user_info_schema>;

const ID_TOKEN_EXPIRE = '10d' as const;
const ACCESS_TOKEN_EXPIRE = '15mins' as const;

export const AUTH_ID_LOC = 'server_auth_id' as const; // id token
export const ACCESS_ID_LOC = 'server_access_id' as const;
export const COOKIE_LOC = '/' as const;

const get_id_and_aceess_token = async (user_info: user_info_type) => {
  // ID Token will be used for authentication, i.e. to verify the user's identity.
  // in our case will also act as refresh tokens
  const id_token = await new SignJWT({ user: user_info, type: 'login' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(ID_TOKEN_EXPIRE)
    .sign(JWT_SECRET);

  // Access Token will be used for authorization, i.e. to access the user's resources.
  const access_token = await new SignJWT({
    user: {
      id: user_info.id,
      user_type: user_info.user_type
    },
    type: 'api'
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRE)
    .sign(JWT_SECRET);

  return {
    id_token,
    access_token
  };
};

const setCookiesFromTokens = (cookies: Cookies, id_token: string, access_token: string) => {
  // setting cookies
  cookies.set(AUTH_ID_LOC, id_token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    expires: new Date(Date.now() + ms(ID_TOKEN_EXPIRE)),
    path: COOKIE_LOC
  });
  cookies.set(ACCESS_ID_LOC, access_token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    expires: new Date(Date.now() + ms(ACCESS_TOKEN_EXPIRE)),
    path: COOKIE_LOC
  });
};

export const access_token_payload_schema = z.object({
  user: UsersSchemaZod.pick({
    id: true,
    user_type: true
  }),
  type: z.literal('api')
});

export const getUserInfoFromCookieIdToken = async (cookies: Cookies) => {
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

  return user;
};

export async function getUserFromCookieAccessToken(cookies: Cookies) {
  try {
    const access_token = cookies.get(ACCESS_ID_LOC);
    if (access_token) {
      const jwt_data = await jwtVerify(access_token, JWT_SECRET, {
        algorithms: ['HS256']
      });
      const payload = access_token_payload_schema.parse(jwt_data.payload);
      const user = payload.user;
      return user;
    } else {
      const user_info = await getUserInfoFromCookieIdToken(cookies);
      if (user_info) {
        const { id_token, access_token } = await get_id_and_aceess_token({
          name: user_info.name,
          id: user_info.id,
          user_type: user_info.user_type
        });
        setCookiesFromTokens(cookies, id_token, access_token);
        return {
          id: user_info.id,
          user_type: user_info.user_type
        };
      }
    }
  } catch (e) {}
  return null;
}

const verify_pass_router = publicProcedure
  .input(
    z.object({
      id: z.number().int(),
      password: z.string()
    })
  )
  .output(
    z.union([
      z.object({
        verified: z.literal(false),
        err_code: z.enum(['user_not_found', 'wrong_password'])
      }),
      z.object({
        verified: z.literal(true),
        user: user_info_schema
      })
    ])
  )
  .mutation(async ({ input: { password, id }, ctx: { cookies } }) => {
    let verified = false;
    await delay(600);

    const user_info = await db.query.users.findFirst({
      where: (tbl, { eq }) => eq(tbl.id, id)
    });
    if (!user_info) return { verified, err_code: 'user_not_found' };

    verified = await puShTi_256(password, user_info.password);
    if (!verified) return { verified, err_code: 'wrong_password' };
    const { id_token, access_token } = await get_id_and_aceess_token({
      name: user_info.name,
      id: user_info.id,
      user_type: user_info.user_type
    });

    setCookiesFromTokens(cookies, id_token, access_token);

    return {
      verified,
      user: {
        id: user_info.id,
        name: user_info.name,
        user_type: user_info.user_type
      }
    };
  });

const id_token_payload_schema = z.object({
  user: user_info_schema,
  type: z.literal('login')
});

const renew_access_token = publicProcedure
  .input(
    z.object({
      id_token: z.string()
    })
  )
  .output(
    z.union([
      z.object({
        verified: z.literal(false)
      }),
      z.object({
        verified: z.literal(true),
        user: user_info_schema
      })
    ])
  )
  .query(async ({ input: { id_token }, ctx: { cookies } }) => {
    async function get_user_from_id_token() {
      let payload: z.infer<typeof id_token_payload_schema>;
      try {
        payload = id_token_payload_schema.parse((await jwtVerify(id_token, JWT_SECRET)).payload);
        return payload;
      } catch {}
      return null;
    }
    const user = await get_user_from_id_token();
    if (!user)
      return {
        verified: false
      };

    const updated_tokens = await get_id_and_aceess_token(user.user);

    setCookiesFromTokens(cookies, updated_tokens.id_token, updated_tokens.access_token);

    return {
      verified: true,
      user: user.user
    };
  });

const update_password_router = protectedProcedure
  .input(
    z.object({
      current_password: z.string(),
      new_password: z.string()
    })
  )
  .mutation(async ({ input: { current_password, new_password }, ctx: { user } }) => {
    const user_info = (await db.query.users.findFirst({
      columns: {
        password: true
      },
      where: ({ id }, { eq }) => eq(id, user.id)
    }))!;
    await delay(500);
    const verified = await puShTi_256(current_password, user_info.password);
    if (!verified) return { success: false };
    const salt = gen_salt();
    const hashed_password = (await hash_256(new_password + salt)) + salt;
    await db.update(users).set({ password: hashed_password }).where(eq(users.id, user.id));
    return { success: true };
  });

const logout_router = protectedProcedure.mutation(async ({ ctx: { cookies } }) => {
  cookies.delete(AUTH_ID_LOC, { path: COOKIE_LOC });
  cookies.delete(ACCESS_ID_LOC, { path: COOKIE_LOC });
});

const get_user_info_router = protectedProcedure.query(async ({ ctx: { user } }) => {
  return user;
});

export const auth_router = t.router({
  verify_pass: verify_pass_router,
  renew_access_token: renew_access_token,
  update_password: update_password_router,
  logout: logout_router,
  get_user_info: get_user_info_router
});
