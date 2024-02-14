import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { env } from '$env/dynamic/private';
import { schema } from './types';

const poolConnection = mysql.createPool({
  database: env.MYSQL_DB_NAME,
  host: env.MYSQL_HOST,
  user: env.MYSQL_USERNAME,
  password: env.MYSQL_PASSWORD,
  port: 3306
});

export const db = drizzle(poolConnection, { schema, mode: 'default' });
