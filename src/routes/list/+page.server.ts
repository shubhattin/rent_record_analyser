import prisma from '$lib/server/prisma';

export const load = async () => {
  const data = await prisma.rent_data.findMany({
    orderBy: {
      date: 'desc'
    }
  });
  return { rent_data: data };
};
