import { env } from '$env/dynamic/private';
import { schema } from './types';
import { drizzle } from 'drizzle-orm/postgres-js';
import { neon } from '@neondatabase/serverless';
import { drizzle as drizzle_neon } from 'drizzle-orm/neon-http';
import postgres from 'postgres';

export const db = import.meta.env.DEV
  ? drizzle(postgres(env.PG_DATABASE_URL), { schema })
  : drizzle_neon(neon(env.PG_DATABASE_URL), { schema });
