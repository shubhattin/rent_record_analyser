export const get_db_url = (env: any): string => {
  if (process.env.DB_MODE === 'PROD') return env.PG_DATABASE_URL1;
  else if (process.env.DB_MODE === 'PREVIEW') return env.PG_DATABASE_URL2;
  return env.PG_DATABASE_URL;
};
