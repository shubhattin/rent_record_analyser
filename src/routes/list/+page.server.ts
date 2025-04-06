import { db } from '~/db/db';

export const load = async () => {
  // const data = await db.select().from(rent_data).orderBy(desc(rent_data.date));
  const data_query = db.query.rent_data.findMany({
    orderBy: ({ date }, { desc }) => [desc(date)]
  });
  const pending_requests_query = db.query.verification_requests.findMany();

  const [data, pending_requests] = await Promise.all([data_query, pending_requests_query]);

  return {
    rent_data: data,
    verification_requests: pending_requests.map((v) => v.id)
  };
};
