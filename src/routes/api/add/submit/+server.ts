import { JSONResponse } from '@tools/responses';
import { puShTi } from '@tools/hash';
import type { RequestHandler } from './$types';
import { z } from 'zod';
import { db } from '@tools/db';
import { rent_data_table } from '@tools/db/types';

export const POST: RequestHandler = async ({ request }) => {
  const req_parse = z
    .object({
      passKey: z.string(),
      date: z.coerce.date(),
      amount: z.number().int(),
      month: z.coerce.date()
    })
    .safeParse(await request.json());
  if (!req_parse.success) return JSONResponse({ status: 'error_parsing_request' });
  let { passKey, date, amount, month } = req_parse.data;

  // verifying for correct key
  const verified = puShTi(
    passKey,
    (await db.query.others.findFirst({ where: ({ id }, { eq }) => eq(id, 'passKey') }))!.value
  );
  if (!verified) return JSONResponse({ status: 'wrong_key' });

  await db.insert(rent_data_table).values({
    amount: amount,
    month: month,
    date: date
  });

  return JSONResponse({ status: 'success' });
};
