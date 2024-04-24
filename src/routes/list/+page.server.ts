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
    where: ({ is_admin }, { eq }) => eq(is_admin, true)
    // only fetching admin details as they are only authorized to make changes
  });
  const electricity_query = db.query.electricity_bills.findMany();

  const [data, pending_requests, users, electricity_data] = await Promise.all([
    data_query,
    pending_requests_query,
    users_query,
    electricity_query
  ]);

  return {
    rent_data: data,
    verification_requests: pending_requests.map((v) => v.id),
    users,
    electricity_data
  };
};
