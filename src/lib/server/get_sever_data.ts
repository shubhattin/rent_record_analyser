import { type dtType, dataSchema, sort_data_based_on_date } from '$lib/get_data';
import { base_fetch_all, base_fetch } from '@tools/deta';

export const get_rent_record_data = async () => {
  const filter_items = (lst: any[]): dtType[] => {
    const filtered: dtType[] = [];
    for (let x of lst) {
      const parse = dataSchema.safeParse(x);
      if (parse.success) filtered.push(parse.data);
    }
    return filtered;
  };
  const data = sort_data_based_on_date(filter_items(await base_fetch_all<dtType>('data')));
  return data;
};
