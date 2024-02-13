import { db } from '@tools/db';

export const load = async () => {
  const data = await db.selectFrom('rent_data').selectAll().orderBy('date desc').execute(); // getting pre sorted data
  return { rent_data: data };
};
