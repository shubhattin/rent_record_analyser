import { env } from '$env/dynamic/private';
import { schema } from './schema';
import { drizzle } from 'drizzle-orm/postgres-js';
import { drizzle as drizzle_neon } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import postgres from 'postgres';
import { get_db_url } from './db_utils';

const DB_URL = get_db_url(env);

export const db = import.meta.env.DEV
  ? drizzle(postgres(DB_URL), { schema })
  : drizzle_neon(neon(DB_URL), { schema });
