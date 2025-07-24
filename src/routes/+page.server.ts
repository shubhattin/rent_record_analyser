import { db } from '~/db/db';
import { rent_data, verification_requests } from '~/db/schema';
import { desc, eq } from 'drizzle-orm';
import {
  get_date_list,
  get_month_list,
  get_total_sum_for_type,
  get_year_list
} from '~/routes/rent_filters';

export const load = async ({ parent }) => {
  const data_query = db
    .select({
      amount: rent_data.amount,
      date: rent_data.date,
      month: rent_data.month,
      rent_type: rent_data.rent_type,
      is_not_verified: verification_requests.id
    })
    .from(rent_data)
    // .where(eq(rent_data.rent_type, 'rent')) // fetch all
    .orderBy(desc(rent_data.month), desc(rent_data.date))
    .leftJoin(verification_requests, eq(verification_requests.id, rent_data.id));
  // getting pre sorted data
  // sorting with month first and date then will make it easy for us to display data later on
  // as we won't need to sort in then

  const [data, { user }] = await Promise.all([data_query, parent()]);

  const [year_list, amount_yr_list] = get_year_list(data);
  const result = new Map<
    number,
    {
      amount: number;
      months: Map<
        number,
        {
          amount: number;
          electricity_total: number;
          rent_total: number;
        }
      >;
    }
  >();

  for (let i = 0; i < year_list.length; i++) {
    const yr = year_list[i];
    const amount = amount_yr_list[i];
    const months = new Map<
      number,
      { amount: number; electricity_total: number; rent_total: number }
    >();
    const [month_list, amount_mn_list] = get_month_list(data, yr);
    for (let j = 0; j < month_list.length; j++) {
      const mn = month_list[j];
      const amount = amount_mn_list[j];
      const date_records = get_date_list(data, yr, mn);
      const electricity_total = get_total_sum_for_type(date_records, 'electricity');
      const rent_total = get_total_sum_for_type(date_records, 'rent');
      months.set(mn, { amount, electricity_total, rent_total });
    }
    result.set(yr, { amount, months });
  }

  return {
    info_analysis: result,
    total: data.reduce((total, item) => total + item.amount, 0),
    rent_data: !!user ? data : []
  };
};
