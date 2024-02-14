import { db } from '@tools/db';

export const load = async () => {
  // const data_query = db
  //   .select({
  //     date: rent_data.date,
  //     month: rent_data.month,
  //     amount: rent_data.amount
  //   })
  //   .from(rent_data)
  //   .orderBy(desc(rent_data.month), desc(rent_data.date));
  const data_query = db.query.rent_data.findMany({
    columns: {
      amount: true,
      date: true,
      month: true
    },
    orderBy: ({ date, month }, { desc }) => [desc(month), desc(date)]
  });
  // getting pre sorted data
  // sorting with month first and date then will make it easy for us to display data later on
  // as we won't need to sort in then

  const [data] = await Promise.all([data_query]);
  return { rent_data: data };
};
