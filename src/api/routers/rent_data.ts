import z from 'zod';
import { protectedProcedure, publicProcedure, t } from '~/api/trpc_init';
import { rent_data, verification_requests } from '~/db/schema';
import { desc, eq, and, lt, or } from 'drizzle-orm';
import { db } from '~/db/db';
import {
  get_date_list,
  get_month_list,
  get_total_sum_for_type,
  get_year_list
} from './rent_filters';

type GetDataOptions = {
  lastDate?: Date | null;
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
      is_not_verified: verification_requests.id
    })
    .from(rent_data)
    .orderBy(desc(rent_data.date), desc(rent_data.id))
    .leftJoin(verification_requests, eq(verification_requests.id, rent_data.id))
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
  { lastDate = null, listID = null, limit }: GetDataOptions = {},
  is_user_authed: boolean = false
) => {
  const data = await get_rent_data_page({ lastDate, listID, limit });
  const rent_data = data.data;

  const [year_list, amount_yr_list] = get_year_list(rent_data);
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
    const [month_list, amount_mn_list] = get_month_list(rent_data, yr);
    for (let j = 0; j < month_list.length; j++) {
      const mn = month_list[j];
      const amount = amount_mn_list[j];
      const date_records = get_date_list(rent_data, yr, mn);
      const electricity_total = get_total_sum_for_type(date_records, 'electricity');
      const rent_total = get_total_sum_for_type(date_records, 'rent');
      months.set(mn, { amount, electricity_total, rent_total });
    }
    result.set(yr, { amount, months });
  }

  return {
    data: {
      info_analysis: result,
      total: rent_data.reduce(
        (total, item) => total + item.amount * (item.rent_type === 'rent' ? 1 : -1),
        0
      ),
      rent_data: is_user_authed ? rent_data : []
    },
    lastId: data.lastID,
    lastDate: data.lastDate
  };
};
export type RentDataAnalysisPageType = Awaited<ReturnType<typeof get_rent_data_analysis_page>>;

const get_paginated_rent_data_route = protectedProcedure
  .input(
    z.object({
      lastDate: z.coerce.date().nullable().optional().default(null),
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
      lastDate: z.coerce.date().nullable().optional().default(null),
      lastID: z.coerce.number().int().nullable().optional().default(null),
      limit: z.coerce.number().int().nullable().optional().default(null)
    })
  )
  .query(async ({ input: { lastDate, lastID, limit }, ctx: { user } }) => {
    const out = await get_rent_data_analysis_page({ lastDate, listID: lastID, limit }, !!user);
    return out;
  });

export const rent_data_router = t.router({
  get_paginated_rent_data: get_paginated_rent_data_route,
  get_paginated_rent_data_anlysis: get_paginated_rent_data_analysis_route
});
