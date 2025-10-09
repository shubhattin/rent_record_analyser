'use client';

import { api } from '$convex/_generated/api';
import { Preloaded, useConvexAuth, usePreloadedQuery, useQuery } from 'convex/react';
import { useEffect, useState } from 'react';

export default function Page({
  preloadedRecords
}: {
  preloadedRecords: Preloaded<typeof api.routes.rentData.getRentData>;
}) {
  const data_ = usePreloadedQuery(preloadedRecords);
  const convexAuth = useConvexAuth();
  const [data, setData] = useState(data_);

  useEffect(() => {
    if (convexAuth.isLoading) return;
    setData(data_);
  }, [data_, convexAuth]);

  return <div>{data.length}</div>;
}
