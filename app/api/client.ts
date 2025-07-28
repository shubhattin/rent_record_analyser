import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { ensure_auth_access_status } from '~/tools/auth_tools';
import transformer from './transformer';
import type { Router } from '~/api/trpc_router';

let access_token: string;
let token_renew_started = false;

export const setAccessToken = (token: string) => {
  // to set the jwt_token while we make trpc request
  access_token = token;
};
export const setTokenRenewStarted = (val: boolean) => {
  token_renew_started = val;
};

export const trpc_client_options = {
  links: [
    httpBatchLink({
      url: '/api/trpc',
      transformer,
      async headers() {
        if (!token_renew_started) await ensure_auth_access_status();
        return {
          Authorization: `Bearer ${access_token}`
        };
      }
    })
  ]
};

export const client = createTRPCClient<Router>(trpc_client_options);
// ^ $client via useNuxtApp()
