import { dbClient_ext as db, queryClient } from './client';
import { readFile } from 'fs/promises';
import { dbMode, take_input } from '@tools/kry_server';
import {
  rent_data,
  others,
  RentDataSchemaZod,
  OthersSchemaZod,
  UsersSchemaZod,
  VerficationRequestsSchemaZod,
  users,
  verification_requests
} from '@db/schema';
import { z } from 'zod';
import { sql } from 'drizzle-orm';

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
      others: OthersSchemaZod.array(),
      rent_data: RentDataSchemaZod.array(),
      users: UsersSchemaZod.array(),
      verification_requests: VerficationRequestsSchemaZod.array()
    })
    .parse(JSON.parse((await readFile(`./out/${in_file_name}`)).toString()));

  // insertig users
  try {
    await db.insert(users).values(data.users);
    console.log('Successfully added values into table `users`');
  } catch {}

  // insertig rent_data
  try {
    await db.insert(rent_data).values(data.rent_data);
    console.log('Successfully added values into table `rent_data`');
  } catch {}

  // insertig others
  try {
    data.others.length !== 0 && (await db.insert(others).values(data.others));
    console.log('Successfully added values into table `others`');
  } catch {}

  try {
    // insertig verification requests
    data.verification_requests.length !== 0 &&
      (await db.insert(verification_requests).values(data.verification_requests));
    console.log('Successfully added values into table `verification_requests`');
  } catch {}

  // resetting the SERIAL
  await db.execute(sql`SELECT setval('rent_data_id_seq', (select MAX(id) from rent_data))`);
};
main().then(() => {
  queryClient.end();
});

async function confirm_environemnt() {
  let confirmation: string = await take_input(`Are you sure INSERT in ${dbMode} ? `);
  if (['yes', 'y'].includes(confirmation)) return true;
  return false;
}
