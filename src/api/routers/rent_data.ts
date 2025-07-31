import z from 'zod';
import { protectedProcedure, t } from '~/api/trpc_init';
import { rent_data, verification_requests } from '~/db/schema';
import { desc, eq, and, lt, or } from 'drizzle-orm';
import { db } from '~/db/db';

type GetDataOptions = {
  lastDate?: Date | null;
  listID?: number | null;
  limit?: number | null;
};

const DEFAULT_LIMIT = 25;
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

export const rent_data_router = t.router({});
