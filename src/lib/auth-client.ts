import { createAuthClient } from 'better-auth/react';
import { adminClient, usernameClient } from 'better-auth/client/plugins';
import { convexClient } from '@convex-dev/better-auth/client/plugins';

export const authClient = createAuthClient({
  plugins: [usernameClient(), adminClient(), convexClient()]
});

export const { useSession, signIn, signOut, signUp } = authClient;

export type UserInfoSession = (typeof authClient.$Infer.Session)['user'] | null;
