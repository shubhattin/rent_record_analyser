import { redirect } from '@sveltejs/kit';
import { get_rent_data_page } from '~/api/routers/rent_data.js';
import { db } from '~/db/db';

export const load = async ({ parent }) => {
  const { user } = await parent();
  if (!user) throw redirect(302, '/');

  const data = await get_rent_data_page();

  return {
    rent_data: data.data,
    lastId: data.lastID,
    lastDate: data.lastDate
  };
};
