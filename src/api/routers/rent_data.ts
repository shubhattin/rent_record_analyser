import z from 'zod';
import { protectedProcedure, publicProcedure, t } from '~/api/trpc_init';
import { rent_data, user, verification_requests } from '~/db/schema';
import { desc, eq, and, lt, or, count } from 'drizzle-orm';
import { db } from '~/db/db';
import {
  get_date_list,
  get_month_list,
  get_total_sum_for_type,
  get_year_list
} from './rent_filters';

type GetDataOptions = {
  lastDate?: string | null;
  listID?: number | null;
  limit?: number | null;
};

const DEFAULT_LIMIT = 20;
export const get_rent_data_page = async ({
  lastDate = null,
  listID = null,
  limit
}: GetDataOptions = {}) => {
  const LIMIT = limit ?? DEFAULT_LIMIT;
  let cursorCondition = undefined;
  if (lastDate !== null && listID !== null) {
    cursorCondition = or(
      lt(rent_data.date, lastDate),
      and(eq(rent_data.date, lastDate), lt(rent_data.id, listID))
    );
  }

  const query = db
    .select({
      id: rent_data.id,
      amount: rent_data.amount,
      date: rent_data.date,
      month: rent_data.month,
      rent_type: rent_data.rent_type,
      user_id: rent_data.user_id,
      user_name: user.name,
      is_not_verified: verification_requests.id
    })
    .from(rent_data)
    .orderBy(desc(rent_data.date), desc(rent_data.id))
    .leftJoin(verification_requests, eq(verification_requests.id, rent_data.id))
    .innerJoin(user, eq(rent_data.user_id, user.id))
    .limit(LIMIT);

  const data = cursorCondition ? await query.where(cursorCondition) : await query;

  return {
    data,
    lastID: data.length > 0 ? data[data.length - 1].id : null,
    lastDate: data.length > 0 ? data[data.length - 1].date : null
  };
};

export type RentDataPageType = Awaited<ReturnType<typeof get_rent_data_page>>;

export const get_rent_data_analysis_page = async (
  { month_fetched, next_month_limit }: { month_fetched: number; next_month_limit: number },
  is_user_authed: boolean = false
) => {
  const group_by_month = await db
    .select({
      month: rent_data.month,
      count: count(rent_data.id)
    })
    .from(rent_data)
    .orderBy(desc(rent_data.month))
    .groupBy(rent_data.month);

  const month_fetch_limit = group_by_month
    .slice(month_fetched, month_fetched + next_month_limit)
    .reduce((val, item) => val + item.count, 0);
  const months_record_fetched = group_by_month
    .slice(0, month_fetched)
    .reduce((val, item) => val + item.count, 0);

  const rent_data_ = await db
    .select({
      id: rent_data.id,
      amount: rent_data.amount,
      date: rent_data.date,
      month: rent_data.month,
      rent_type: rent_data.rent_type,
      user_id: rent_data.user_id,
      is_not_verified: verification_requests.id
    })
    .from(rent_data)
    .orderBy(desc(rent_data.month), desc(rent_data.date))
    .leftJoin(verification_requests, eq(verification_requests.id, rent_data.id))
    .offset(months_record_fetched)
    .limit(month_fetch_limit);

  const [year_list, amount_yr_list] = get_year_list(rent_data_);
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
    const [month_list, amount_mn_list] = get_month_list(rent_data_, yr);
    for (let j = 0; j < month_list.length; j++) {
      const mn = month_list[j];
      const amount = amount_mn_list[j];
      const date_records = get_date_list(rent_data_, yr, mn);
      const electricity_total = get_total_sum_for_type(date_records, 'electricity');
      const rent_total = get_total_sum_for_type(date_records, 'rent');
      months.set(mn, { amount, electricity_total, rent_total });
    }
    result.set(yr, { amount, months });
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
    month_fetched: month_fetched + next_month_limit,
    all_months_fetched: month_fetched + next_month_limit >= group_by_month.length
  };
};
export type RentDataAnalysisPageType = Awaited<ReturnType<typeof get_rent_data_analysis_page>>;

const get_paginated_rent_data_route = protectedProcedure
  .input(
    z.object({
      lastDate: z.string().date().nullable().optional().default(null),
      lastID: z.coerce.number().int().nullable().optional().default(null),
      limit: z.coerce.number().int().nullable().optional().default(null)
    })
  )
  .query(async ({ input: { lastDate, lastID, limit } }) => {
    const out = await get_rent_data_page({ lastDate, listID: lastID, limit });
    return out;
  });

const get_paginated_rent_data_analysis_route = publicProcedure
  .input(
    z.object({
      month_fetched: z.coerce.number().int(),
      next_month_limit: z.coerce.number().int()
    })
  )
  .query(async ({ input: { month_fetched, next_month_limit }, ctx: { user } }) => {
    const out = await get_rent_data_analysis_page({ month_fetched, next_month_limit }, !!user);
    return out;
  });

export const rent_data_router = t.router({
  get_paginated_rent_data: get_paginated_rent_data_route,
  get_paginated_rent_data_anlysis: get_paginated_rent_data_analysis_route
});
