import { client, queryClient } from './client';
import { readFile } from 'fs/promises';
import { dbMode, take_input } from '@tools/kry';
import {
  rent_data_table,
  others_table,
  selectRentDataSchema,
  selectOthersSchema
} from '@tools/db/types';
import { z } from 'zod';
import { sql } from 'drizzle-orm';

const main = async () => {
  if (!(await confirm_environemnt())) return;
  console.log(`Insering Data into ${dbMode} Database...`);

  const in_file_name = {
    PROD: 'db_data_prod.json',
    PREVIEW: 'db_data_preview.json',
    LOCAL: 'db_data.json'
  }[dbMode];

  const data = z
    .object({
      others: selectOthersSchema.array(),
      rent_data: selectRentDataSchema.array()
    })
    .parse(JSON.parse((await readFile(`./out/${in_file_name}`)).toString()));

  await client.insert(rent_data_table).values(data.rent_data);
  console.log('Successfully added values into table `rent_data`');
  await client.insert(others_table).values(data.others);
  console.log('Successfully added values into table `others`');

  // resetting the SERIAL
  await client.execute(sql`SELECT setval('rent_data_id_seq', (select MAX(id) from rent_data))`);
};
main().then(() => {
  queryClient.end();
});

async function confirm_environemnt() {
  let confirmation: string = '';
  if (dbMode === 'PROD') {
    confirmation = await take_input('Are you sure INSERT in PROD ? ');
  } else if (dbMode === 'PREVIEW') {
    confirmation = await take_input('Are you sure to INSERT in PREVIEW ? ');
  }
  if (dbMode === 'LOCAL' || ['yes', 'y'].includes(confirmation)) return true;
  return false;
}
