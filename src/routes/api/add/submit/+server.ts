import { JSONResponse } from '@tools/responses';
import { puShTi } from '@tools/hash';
import type { RequestHandler } from './$types';
import { z } from 'zod';
import { db } from '@tools/db';
import { sql } from 'drizzle-orm';
import { get_date_string } from '@tools/date';

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
    (await db.query.others.findFirst({ where: ({ key }, { eq }) => eq(key, 'passKey') }))!
      .value as string
  );
  if (!verified) return JSONResponse({ status: 'wrong_key' });

  await db.execute(
    sql.raw(`INSERT INTO rent_data(amount, month, date)
        VALUES (${amount}, '${get_date_string(month, 'yyyy-mm-dd')}', '${get_date_string(date, 'yyyy-mm-dd')}')`)
  );
  // not using built in ORM's insert as it causing dates to be of 1 day before indended

  // await db.insert(rent_data_table).values({
  //   amount: amount,
  //   month: month,
  //   date: date
  // });

  return JSONResponse({ status: 'success' });
};
