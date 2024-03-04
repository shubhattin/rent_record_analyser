import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '@db/db';
import { eq } from 'drizzle-orm';
import { others } from '@db/schema';

export const GET: RequestHandler = async () => {
  const link = (await db.query.others.findFirst({ where: eq(others.key, 'db_page') }))!.value;
  return redirect(302, link);
};
