import { JSONResponse } from '@tools/responses';
import { puShTi } from '@tools/hash';
import type { RequestHandler } from './$types';
import { db } from '@tools/db';
import { z } from 'zod';

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
    (await db.selectFrom('others').select('value').where('id', '=', 'passKey').execute())[0].value
  );
  if (!verified) return JSONResponse({ status: 'wrong_key' });

  await db
    .insertInto('rent_data')
    .values({
      amount: amount,
      month: month,
      date: date
    })
    .execute();

  return JSONResponse({ status: 'success' });
};
