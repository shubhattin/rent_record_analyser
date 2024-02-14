import type { RequestHandler } from './$types';
import { JSONResponse } from '@tools/responses';
import { z } from 'zod';
import { puShTi } from '@tools/hash';
import { db } from '@tools/db';

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
    (await db.selectFrom('others').select('value').where('id', '=', 'passKey').execute())[0].value
  );
  if (!verified) return JSONResponse({ status: 'wrong_key' });

  const operations: Promise<any>[] = [];
  for (let dt of to_change)
    operations.push(db.updateTable('rent_data').set(dt).where('id', '=', dt.id).execute());
  if (to_delete.length !== 0) {
    const delete_resp = db.deleteFrom('rent_data').where('id', 'in', to_delete).execute();
    operations.push(delete_resp);
  }
  if (operations.length !== 0) await Promise.all(operations);
  return JSONResponse({ status: 'success' });
};
