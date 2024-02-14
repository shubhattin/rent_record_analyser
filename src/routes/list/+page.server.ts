import { db } from '@tools/db';

export const load = async () => {
  // const data = await db.select().from(rent_data).orderBy(desc(rent_data.date));
  const data = await db.query.rent_data.findMany({
    orderBy: ({ date }, { desc }) => [desc(date)]
  });
  return { rent_data: data };
};
