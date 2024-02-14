import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '@tools/db';

export const GET: RequestHandler = async () => {
  const link = (
    await db.selectFrom('others').select('value').where('id', '=', 'db_page').execute()
  )[0].value;
  return redirect(302, link);
};
