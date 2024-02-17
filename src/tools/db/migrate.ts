import dotenv from 'dotenv';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { get_db_url } from './types';

dotenv.config({ path: '../../../.env.local' });

export const migrationClient = postgres(get_db_url(process.env), { max: 1 });

// This will run migrations on the database, skipping the ones already applied
await migrate(drizzle(migrationClient), { migrationsFolder: '../../../drizzle' });

await migrationClient.end();
