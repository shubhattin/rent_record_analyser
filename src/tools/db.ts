import { createPool } from 'mysql2'; // do not use 'mysql2/promises'!
import { Kysely, MysqlDialect } from 'kysely';
import { env } from '$env/dynamic/private';
import { type Database } from './db_type';

const dialect = new MysqlDialect({
  // @ts-ignore
  pool: createPool({
    database: env.MYSQL_DB_NAME,
    host: env.MYSQL_HOST,
    user: env.MYSQL_USERNAME,
    password: env.MYSQL_PASSWORD,
    port: 3306,
    connectionLimit: 10
  })
});

export const db = new Kysely<Database>({
  dialect
});
