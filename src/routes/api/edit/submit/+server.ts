import type { RequestHandler } from './$types';
import { JSONResponse } from '@tools/responses';
import { z } from 'zod';
import { puShTi } from '@tools/hash';
import { db } from '@tools/db';
import { rent_data_table } from '@tools/db/types';
import { eq, inArray } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request }) => {
  const req_parse = z
    .object({
      to_delete: z.number().int().array(),
      to_change: z
        .object({
          id: z.number().int(),
          date: z.coerce.date(),
          month: z.coerce.date(),
          amount: z.number().int()
        })
        .array(),
      passKey: z.string()
    })
    .safeParse(await request.json());
  if (!req_parse.success) {
    return JSONResponse({ status: 'error_parsing_request' });
  }
  const { to_delete, to_change, passKey } = req_parse.data;

  const verified = puShTi(
    passKey,
    (await db.query.others.findFirst({ where: ({ key }, { eq }) => eq(key, 'passKey') }))!
      .value as string
  );
  if (!verified) return JSONResponse({ status: 'wrong_key' });

  const operations: Promise<any>[] = [];
  for (let dt of to_change)
    operations.push(db.update(rent_data_table).set(dt).where(eq(rent_data_table.id, dt.id)));
  if (to_delete.length !== 0) {
    const delete_resp = db.delete(rent_data_table).where(inArray(rent_data_table.id, to_delete));
    operations.push(delete_resp);
  }
  if (operations.length !== 0) await Promise.all(operations);
  return JSONResponse({ status: 'success' });
};
