import { api } from '$convex/_generated/api';
import { fetchQuery, preloadQuery } from 'convex/nextjs';
import { getToken } from '~/lib/auth-server';
import List from './List';
import { redirect } from 'next/navigation';

export default async function Home() {
  const token = await getToken();
  const user = fetchQuery(api.auth.getCurrentUser, {}, { token });
  if (!user) redirect('/');
  return <List />;
}

export const metadata = {
  title: 'Rent Record Analyzer'
};
