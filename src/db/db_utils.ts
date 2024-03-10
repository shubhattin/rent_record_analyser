import { z } from 'zod';
import { env } from '$env/dynamic/private';

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
  if (!url_parse.success) throw new Error('Please set `PG_DATABASE_URL`');
  return url_parse.data;
};

export const JWT_SECRET = (() => {
  const token = env.JWT_SECRET;
  const jwt_token_parse = z.string().safeParse(token);
  if (!jwt_token_parse.success) throw new Error('Please set `JWT_SECRET`');
  return jwt_token_parse.data;
})();
