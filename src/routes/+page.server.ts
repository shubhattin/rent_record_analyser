import { get_rent_record_data } from '$lib/server/get_sever_data';

export const load = async () => {
  return { rent_data: await get_rent_record_data() };
};
