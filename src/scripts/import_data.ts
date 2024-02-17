import { client, queryClient } from './client';
import { writeFile } from 'fs/promises';
import { dbMode, make_dir } from '@tools/kry';

const main = async () => {
  console.log(`Fetching Data from ${dbMode} Database...`);
  const rent_data = await client.query.rent_data.findMany();
  const others = await client.query.others.findMany();

  const json_data = {
    rent_data,
    others
  };

  await make_dir('./out');
  const out_file_name = {
    PROD: 'db_data_prod.json',
    PREVIEW: 'db_data_preview.json',
    LOCAL: 'db_data.json'
  }[dbMode];
  await writeFile(`./out/${out_file_name}`, JSON.stringify(json_data, null, 2));
};
main().then(() => {
  queryClient.end();
});
