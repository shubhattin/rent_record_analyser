import { writable } from 'svelte/store';
import { authClient } from '$lib/auth-client';

export type user_info_type =
  | (Omit<(typeof authClient.$Infer.Session)['user'], 'id'> & {
      _id: string;
      _creationTime: number;
    })
  | null
  | undefined;
export const user_info = writable<user_info_type>(null);
