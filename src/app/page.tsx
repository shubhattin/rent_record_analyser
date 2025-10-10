import { api } from '$convex/_generated/api';
import Main from './Main';
import { preloadQuery } from 'convex/nextjs';
import { getToken } from '~/lib/auth-server';

export default async function Home() {
  const token = await getToken();
  const preloadedRecords = await preloadQuery(
    api.routes.rentData.getRentDataAnalysis,
    {},
    { token }
  );
  return <Main preloadedRecords={preloadedRecords} />;
}

export const metadata = {
  title: 'Rent Record Analyzer'
};
