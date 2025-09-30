'use client';

import { ReactNode } from 'react';
import { ConvexReactClient } from 'convex/react';
import { authClient } from '@/lib/auth-client';
import { ConvexBetterAuthProvider } from '@convex-dev/better-auth/react';
import { queryClient } from '~/state/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!, {
  // Optionally pause queries until the user is authenticated
  // expectAuth: true
});

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ConvexBetterAuthProvider client={convex} authClient={authClient}>
        {children}
      </ConvexBetterAuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
