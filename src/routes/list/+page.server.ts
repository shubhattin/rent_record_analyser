import { redirect } from '@sveltejs/kit';
import { get_rent_data_page } from '~/api/routers/rent_data.js';

export const load = async ({ parent }) => {
  const { user_info } = await parent();
  if (!user_info || !user_info.is_approved) throw redirect(302, '/');

  const data = await get_rent_data_page({
    limit: 20
  });

  return {
    rent_data: data.data,
    lastId: data.lastID,
    lastDate: data.lastDate
  };
};
