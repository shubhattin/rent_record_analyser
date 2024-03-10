import { db } from '@db/db';

export const load = async () => {
  const data_query = db.query.users.findMany({
    columns: {
      id: true,
      name: true
    }
  });

  const [data] = await Promise.all([data_query]);
  return { rent_data: data };
};
