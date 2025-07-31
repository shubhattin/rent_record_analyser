import { get_rent_data_analysis_page } from '~/api/routers/rent_data.js';

export const load = async ({ parent }) => {
  const { user } = await parent();
  const out = await get_rent_data_analysis_page({ month_limit: 4 }, !!user);
  return out;
};
