import { db } from '@tools/db';

export const load = async () => {
  const data_query = db
    .selectFrom('rent_data')
    .select(['date', 'amount', 'month'])
    .orderBy('month desc')
    .orderBy('date desc')
    .execute(); // getting pre sorted data
  // sorting with month first and date then will make it easy for us to display data later on
  // as we won't need to sort in then

  const [data] = await Promise.all([data_query]);
  return { rent_data: data };
};
