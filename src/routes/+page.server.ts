import { db } from '~/db/db';
import { rent_data, verification_requests } from '~/db/schema';
import { desc, eq } from 'drizzle-orm';

export const load = async () => {
  const data_query = db
    .select({
      amount: rent_data.amount,
      date: rent_data.date,
      month: rent_data.month,
      rent_type: rent_data.rent_type,
      is_not_verified: verification_requests.id
    })
    .from(rent_data)
    // .where(eq(rent_data.rent_type, 'rent')) // fetch all
    .orderBy(desc(rent_data.month), desc(rent_data.date))
    .leftJoin(verification_requests, eq(verification_requests.id, rent_data.id));
  // getting pre sorted data
  // sorting with month first and date then will make it easy for us to display data later on
  // as we won't need to sort in then

  const [data] = await Promise.all([data_query]);
  return { rent_data: data };
};
