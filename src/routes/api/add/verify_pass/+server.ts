import { puShTi } from '@tools/hash';
import { JSONResponse } from '@tools/responses';
import { z } from 'zod';
import type { RequestHandler } from './$types';
import { db } from '@tools/db';

export const POST: RequestHandler = async ({ request }) => {
  const body_parse = z.object({ key: z.string().min(4) }).safeParse(await request.json());
  if (!body_parse.success)
    return JSONResponse({ verified: false, detail: 'error_parsing_request' });
  const { key } = body_parse.data;
  // const hash = (await db.select().from(others).where(eq(others.id, 'passKey')))[0].value;
  const hash = (await db.query.others.findFirst({
    where: ({ key }, { eq }) => eq(key, 'passKey')
  }))!.value;
  const verified = puShTi(key, hash);
  const data: {
    verified: boolean;
  } = { verified: verified };
  return JSONResponse(data);
};
