import { dbClient_ext as db, queryClient } from './client';
import { readFile } from 'fs/promises';
import { dbMode, take_input } from '~/tools/kry_server';
import { rent_data, others, users, verification_requests } from '~/db/schema';
import {
  RentDataSchemaZod,
  OthersSchemaZod,
  UsersSchemaZod,
  VerficationRequestsSchemaZod
} from '~/db/schema_zod';
import { z } from 'zod';
import { sql } from 'drizzle-orm';
import chalk from 'chalk';

const main = async () => {
  /*
   Better backup & restore tools like `pg_dump` and `pg_restore` should be used.
  
   Although Here the foriegn key relations are not that complex so we are doing it manually
  */
  if (!(await confirm_environemnt())) return;

  console.log(`Insering Data into ${dbMode} Database...`);

  const in_file_name = {
    PROD: 'db_data_prod.json',
    PREVIEW: 'db_data_preview.json',
    LOCAL: 'db_data.json'
  }[dbMode];

  const data = z
    .object({
      rent_data: RentDataSchemaZod.array(),
      others: OthersSchemaZod.array(),
      users: UsersSchemaZod.array(),
      verification_requests: VerficationRequestsSchemaZod.array()
    })
    .parse(JSON.parse((await readFile(`./out/${in_file_name}`)).toString()));

  // deleting all the tables initially
  try {
    await db.delete(rent_data);
    await db.delete(others);
    await db.delete(users);
    await db.delete(verification_requests);
    console.log(chalk.green('✓ Deleted All Tables Successfully'));
  } catch (e) {
    console.log(chalk.red('✗ Error while deleting tables:'), chalk.yellow(e));
  }

  // inserting users
  try {
    await db.insert(users).values(data.users);
    console.log(chalk.green('✓ Successfully added values into table'), chalk.blue('`users`'));
  } catch (e) {
    console.log(chalk.red('✗ Error while inserting users:'), chalk.yellow(e));
  }

  // inserting rent_data
  try {
    await db.insert(rent_data).values(data.rent_data);
    console.log(chalk.green('✓ Successfully added values into table'), chalk.blue('`rent_data`'));
  } catch (e) {
    console.log(chalk.red('✗ Error while inserting rent_data:'), chalk.yellow(e));
  }

  // inserting verification_requests
  try {
    await db.insert(verification_requests).values(data.verification_requests);
    console.log(
      chalk.green('✓ Successfully added values into table'),
      chalk.blue('`verification_requests`')
    );
  } catch (e) {
    console.log(chalk.red('✗ Error while inserting verification_requests:'), chalk.yellow(e));
  }

  // inserting others
  try {
    await db.insert(others).values(data.others);
    console.log(chalk.green('✓ Successfully added values into table'), chalk.blue('`others`'));
  } catch (e) {
    console.log(chalk.red('✗ Error while inserting others:'), chalk.yellow(e));
  }

  // resetting SERIAL
  try {
    await db.execute(sql`SELECT setval('"rent_data_id_seq"', (select MAX(id) from "rent_data"))`);
    await db.execute(sql`SELECT setval('"users_id_seq"', (select MAX(id) from "users"))`);
    console.log(chalk.green('✓ Successfully resetted ALL SERIAL'));
  } catch (e) {
    console.log(chalk.red('✗ Error while resetting SERIAL:'), chalk.yellow(e));
  }
};
main().then(() => {
  queryClient.end();
});

async function confirm_environemnt() {
  let confirmation: string = await take_input(`Are you sure INSERT in ${dbMode} ? `);
  if (['yes', 'y'].includes(confirmation)) return true;
  return false;
}
