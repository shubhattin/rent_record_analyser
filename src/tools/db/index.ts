import { env } from '$env/dynamic/private';
import { schema } from './types';
import { drizzle } from 'drizzle-orm/postgres-js';
import { neon } from '@neondatabase/serverless';
import { drizzle as drizzle_neon } from 'drizzle-orm/neon-http';
import postgres from 'postgres';

const DB_URL = env.PG_DATABASE_URL;

export const db = import.meta.env.DEV
  ? drizzle(postgres(DB_URL), { schema })
  : drizzle_neon(neon(DB_URL), { schema });
