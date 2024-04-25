import { db } from '@db/db';

export const load = async () => {
  // const data = await db.select().from(rent_data).orderBy(desc(rent_data.date));
  const data_query = db.query.rent_data.findMany({
    orderBy: ({ date }, { desc }) => [desc(date)]
  });
  const pending_requests_query = db.query.verification_requests.findMany();
  const users_query = db.query.users.findMany({
    columns: {
      id: true,
      name: true
    },
    where: ({ user_type }, { eq }) => eq(user_type, 'admin')
    // only fetching admin details as they are only authorized to make changes
  });

  const [data, pending_requests, users] = await Promise.all([
    data_query,
    pending_requests_query,
    users_query
  ]);

  return {
    rent_data: data,
    verification_requests: pending_requests.map((v) => v.id),
    users
  };
};
