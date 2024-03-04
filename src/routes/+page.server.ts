import prisma from '$lib/server/prisma';

export const load = async () => {
  const data_query = prisma.rent_data.findMany({
    select: {
      amount: true,
      date: true,
      month: true
    },
    orderBy: [
      {
        month: 'desc'
      },
      {
        date: 'desc'
      }
    ]
  });
  // getting pre sorted data
  // sorting with month first and date then will make it easy for us to display data later on
  // as we won't need to sort in then

  const [data] = await Promise.all([data_query]);
  return { rent_data: data };
};
