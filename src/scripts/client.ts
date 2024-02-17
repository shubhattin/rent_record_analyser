// import { env } from '$env/dynamic/private';
import { schema } from '@tools/db/types';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import dotenv from 'dotenv';
import { dbMode } from '@tools/kry';

dotenv.config({ path: '../../.env.local' });

const DB_URL = {
  LOCAL: process.env.PG_DATABASE_URL!,
  PROD: process.env.PG_DATABASE_URL1!,
  PREVIEW: process.env.PG_DATABASE_URL2!
}[dbMode];

export const queryClient = postgres(DB_URL!);
export const client = drizzle(queryClient, { schema });
