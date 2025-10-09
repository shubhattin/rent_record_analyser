import { api } from '$convex/_generated/api';
import { preloadQuery } from 'convex/nextjs';
import { getToken } from '~/lib/auth-server';
import List from './List';

export default async function Home() {
  const token = await getToken();
  const preloadedRecords = await preloadQuery(api.routes.rentData.getRentData, {}, { token });
  return <List preloadedRecords={preloadedRecords} />;
}

export const metadata = {
  title: 'Rent Record Analyzer'
};
