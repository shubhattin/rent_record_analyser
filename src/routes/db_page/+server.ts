import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '@tools/db';
import { eq } from 'drizzle-orm';
import { others_table } from '@tools/db/types';

export const GET: RequestHandler = async () => {
  const link = (await db.query.others.findFirst({ where: eq(others_table.key, 'db_page') }))!
    .value as string;
  return redirect(302, link);
};
