import { db } from '@db/db';

export const load = async () => {
  const data_query = db.query.rent_data.findMany({
    columns: {
      amount: true,
      date: true,
      month: true,
      id: true
    },
    orderBy: ({ date, month }, { desc }) => [desc(month), desc(date)]
  });
  // getting pre sorted data
  // sorting with month first and date then will make it easy for us to display data later on
  // as we won't need to sort in then

  const pending_query = db.query.verification_requests.findMany();

  const [data, pending_data] = await Promise.all([data_query, pending_query]);
  return { rent_data: data, verifaction_requests: pending_data.map((v) => v.id) };
};
