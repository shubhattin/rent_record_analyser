import { db } from '@tools/db';

export const load = async () => {
  const data = await db.selectFrom('rent_data').selectAll().orderBy('date desc').execute();
  return { rent_data: data };
};
