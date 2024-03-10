import { db } from '@db/db';

export const load = async () => {
  const users_query = db.query.users.findMany({
    columns: {
      id: true,
      name: true
    }
  });

  const [users] = await Promise.all([users_query]);
  return { users };
};
