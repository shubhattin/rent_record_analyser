import { z } from 'zod';

export const get_db_url = (env: any): string => {
  let url: string = null!;
  if (process.env.DB_MODE === 'PROD') url = env.PG_DATABASE_URL1;
  else if (process.env.DB_MODE === 'PREVIEW') url = env.PG_DATABASE_URL2;
  url = env.PG_DATABASE_URL;
  const url_parse = z
    .string({
      description: 'Connection string for PostgreSQL'
    })
    .safeParse(url);
  if (!url_parse.success) throw new Error('Please set `PG_DATABASE_URL` in .env.local');
  return url_parse.data;
};
