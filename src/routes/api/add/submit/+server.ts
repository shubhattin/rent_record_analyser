import { JSONResponse } from '@tools/responses';
import { base_get, base_put, type key_value_type } from '@tools/deta';
import { puShTi } from '@tools/hash';
import { dataSchema } from '$lib/get_data';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const req_parse = dataSchema.safeParse(await request.json());
  if (!req_parse.success) return JSONResponse({ status: 'error_parsing_request' });
  let { key, date, amount, month } = req_parse.data;

  // verifying for correct key
  const verified = puShTi(key, (await base_get<key_value_type<string>>('others', 'passkey')).value);
  if (!verified) return JSONResponse({ status: 'wrong_key' });

  let data = { amount: amount, month: month, date: date };
  await base_put('data', [data]);

  return JSONResponse({ status: 'success' });
};
