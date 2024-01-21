import type { APIRoute } from 'astro';
import { JSONResponse } from '@tools/responses';
import { z } from 'zod';
import { base_delete, base_get, base_put } from '@tools/deta';
import { puShTi } from '@tools/hash';
import { dataSchema } from '@components/get_data';

export const POST: APIRoute = async ({ request }) => {
  const req_parse = z
    .object({
      to_delete: z.string().array(),
      to_change: dataSchema.array(),
      passKey: z.string()
    })
    .safeParse(await request.json());
  if (!req_parse.success) {
    return JSONResponse({ status: 'error_parsing_request' });
  }
  const { to_delete, to_change, passKey } = req_parse.data;

  const verified = puShTi(passKey, (await base_get('others', 'passkey'))['value']);
  if (!verified) return JSONResponse({ status: 'wrong_key' });

  base_put('data', to_change);

  base_delete('data', to_delete);

  return JSONResponse({ status: 'success' });
};
