import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import prisma from '$lib/server/prisma';

export const GET: RequestHandler = async () => {
  const link = (await prisma.others.findFirst({ where: { key: { equals: 'db_page' } } }))!.value;
  return redirect(302, link);
};
