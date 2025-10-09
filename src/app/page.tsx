import { api } from '$convex/_generated/api';
import Main from './Main';
import { preloadQuery } from 'convex/nextjs';

export default async function Home() {
  const preloadedRecords = await preloadQuery(api.routes.rentData.getRentData, {});
  return <Main preloadedRecords={preloadedRecords} />;
}

export const metadata = {
  title: 'Rent Record Analyzer'
};
