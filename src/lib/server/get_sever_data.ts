import { type dtType, dataSchema, sort_data_based_on_date } from '$lib/get_data';
import { base_fetch } from '@tools/deta';

export const get_rent_record_data = async () => {
  const filter_items = (lst: any[]): dtType[] => {
    const filtered: dtType[] = [];
    for (let x of lst) {
      const parse = dataSchema.safeParse(x);
      if (parse.success) filtered.push(parse.data);
    }
    return filtered;
  };
  let lst: any[] = [];
  let last: string = null!;
  while (true) {
    const dt = await base_fetch('data', last);
    lst = lst.concat(filter_items(dt.items));
    last = dt.paging.last!;
    if (!last) break;
  }
  lst = sort_data_based_on_date(lst, -1);
  return lst as dtType[];
};
