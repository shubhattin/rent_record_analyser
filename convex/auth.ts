import { createClient, type GenericCtx } from '@convex-dev/better-auth';
import { convex } from '@convex-dev/better-auth/plugins';
import { components } from './_generated/api';
import { DataModel } from './_generated/dataModel';
import { query } from './_generated/server';
import { betterAuth } from 'better-auth';
import { admin } from 'better-auth/plugins';
import { username } from 'better-auth/plugins';
import { COOKIE_CACHE_TIME_MS } from '../src/lib/cache-time';
import authSchema from './betterAuth/schema';

const siteUrl = process.env.SITE_URL!;

export const authComponent = createClient<DataModel>(components.betterAuth, {
  local: {
    // @ts-ignore
    schema: authSchema
  }
});

export const createAuth = (
  ctx: GenericCtx<DataModel>,
  { optionsOnly } = { optionsOnly: false }
) => {
  return betterAuth({
    // disable logging when createAuth is called just to generate options.
    // this is not required, but there's a lot of noise in logs without it.
    logger: {
      disabled: optionsOnly
    },
    baseURL: siteUrl,
    database: authComponent.adapter(ctx),
    // Configure simple, non-verified email/password to get started
    emailAndPassword: {
      enabled: true
    },
    plugins: [
      convex(),
      username({
        minUsernameLength: 6,
        maxUsernameLength: 20
      }),
      admin()
    ],
    session: {
      cookieCache: {
        enabled: true,
        maxAge: COOKIE_CACHE_TIME_MS / 1000
      },
      expiresIn: 60 * 60 * 24 * 15, // 15 days
      updateAge: 60 * 60 * 24 * 1 // 1 day (every 1 day the session expiration is updated)
    }
  });
};

// Example function for getting the current user
// Feel free to edit, omit, etc.
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    try {
      const user = authComponent.safeGetAuthUser(ctx);
      return user;
    } catch (error) {
      return null;
    }
  }
});
