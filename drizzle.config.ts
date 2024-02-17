import type { Config } from 'drizzle-kit';
import { get_db_url } from './src/tools/db/types';
import dotenv from 'dotenv';

dotenv.config({ path: './.env.local' });

export default {
  schema: './src/tools/db/types.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: get_db_url(process.env)
  }
} satisfies Config;
