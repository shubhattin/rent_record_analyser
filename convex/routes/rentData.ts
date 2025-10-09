import { query } from '../_generated/server';
import {
  get_year_list,
  get_month_list,
  get_date_list,
  get_total_sum_for_type
} from './rent_filters';

export const getRentData = query({
  args: {},
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    const is_user_authed = !!user;

    const verification_requests = await ctx.db.query('verification_requests').collect();
    const rent_data_ = (await ctx.db.query('rent_data').collect()).map((item) => ({
      ...item,
      is_verification_request: verification_requests.some(
        (request) => request.rent_data_id === item._id
      )
    }));

    const [year_list, amount_yr_list] = get_year_list(rent_data_);

    type resultType = {
      [x in number]: {
        amount: number;
        months: {
          [x in number]: {
            amount: number;
            electricity_total: number;
            rent_total: number;
          };
        };
      };
    };
    const result: resultType = {};

    for (let i = 0; i < year_list.length; i++) {
      const yr = year_list[i];
      const amount = amount_yr_list[i];
      const months: resultType[number]['months'] = {};
      const [month_list, amount_mn_list] = get_month_list(rent_data_, yr);
      for (let j = 0; j < month_list.length; j++) {
        const mn = month_list[j];
        const amount = amount_mn_list[j];
        const date_records = get_date_list(rent_data_, yr, mn);
        const electricity_total = get_total_sum_for_type(date_records, 'electricity');
        const rent_total = get_total_sum_for_type(date_records, 'rent');
        months[mn] = { amount, electricity_total, rent_total };
      }
      result[yr] = { amount, months };
    }

    return {
      data: {
        info_analysis: result,
        total: rent_data_.reduce(
          (total, item) => total + item.amount * (item.rent_type === 'rent' ? 1 : -1),
          0
        ),
        rent_data: is_user_authed ? rent_data_ : []
      },
      month_fetched: 0,
      all_months_fetched: true
    };
  }
});
