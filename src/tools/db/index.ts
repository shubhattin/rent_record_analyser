import { env } from '$env/dynamic/private';
import { schema } from './types';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

/*
Note :-  Currenly not using the serverless neon library as we are not using it in edge

import { neon } from '@neondatabase/serverless';
import { drizzle as drizzle_neon } from 'drizzle-orm/neon-http';
export const db = drizzle_neon(neon(env.PG_DATABASE_URL), { schema });

OR

export const db = import.meta.env.DEV
  ? drizzle(postgres(env.PG_DATABASE_URL), { schema })
  : drizzle_neon(neon(env.PG_DATABASE_URL), { schema });

*/

const queryClient = postgres(env.PG_DATABASE_URL);
export const db = drizzle(queryClient, { schema });
