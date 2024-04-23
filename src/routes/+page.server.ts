import { db } from '@db/db';
import { rent_data, verification_requests } from '@db/schema';
import { desc, eq } from 'drizzle-orm';

export const load = async () => {
  const data_query = db
    .select({
      amount: rent_data.amount,
      date: rent_data.date,
      month: rent_data.month,
      is_not_verified: verification_requests.id
    })
    .from(rent_data)
    .orderBy(desc(rent_data.month), desc(rent_data.date))
    .leftJoin(verification_requests, eq(verification_requests.id, rent_data.id));
  const electricity_query = db.query.electricity_bills.findMany();
  // getting pre sorted data
  // sorting with month first and date then will make it easy for us to display data later on
  // as we won't need to sort in then

  const [data, electricity_data] = await Promise.all([data_query, electricity_query]);
  return { rent_data: data, electricity_data };
};
