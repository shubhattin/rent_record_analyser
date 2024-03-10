import { db } from '@db/db';
import { rent_data, users, verification_requests } from '@db/schema';
import { eq } from 'drizzle-orm';

export const load = async () => {
  // const data = await db.select().from(rent_data).orderBy(desc(rent_data.date));
  const data_query = db.query.rent_data.findMany({
    orderBy: ({ date }, { desc }) => [desc(date)]
  });
  const pending_requests_query = db
    .select({
      id: verification_requests.id,
      user_id: rent_data.user_id,
      is_admin: users.is_admin
    })
    .from(verification_requests)
    .innerJoin(rent_data, eq(rent_data.id, verification_requests.id))
    .leftJoin(users, eq(users.id, rent_data.user_id));

  const [data, pending_requests] = await Promise.all([data_query, pending_requests_query]);

  return { rent_data: data, verification_requests: pending_requests };
};
