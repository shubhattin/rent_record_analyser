'use client';

import { api } from '$convex/_generated/api';
import { AuthLoading, Authenticated, usePaginatedQuery, useQuery } from 'convex/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Skeleton } from '~/components/ui/skeleton';
import { DataTable } from './data-table';
import { columns } from './columns';
import { Button } from '~/components/ui/button';

export default function Page() {
  return (
    <>
      <AuthLoading>
        <LoadingSkeleton />
      </AuthLoading>
      <Authenticated>
        <List />
      </Authenticated>
    </>
  );
}

const FETCH_LIMIT = 20;
const List = () => {
  const fetchIndexRef = useRef(0);

  const verification_request_ids = useQuery(api.routes.rentData.getRentDataVerificationRequest);
  const { results, status, loadMore } = usePaginatedQuery(
    api.routes.rentData.getRentData,
    {},
    { initialNumItems: FETCH_LIMIT }
  );

  // React Compiler can over-memoize when array identity is stable (e.g. pagination mutates in place).
  // Derive a fresh array when length changes so downstream memoization (react-table) sees updates.
  const tableData = useMemo(() => results.slice(), [results.length]);
  if (!verification_request_ids || results.length === 0) return <LoadingSkeleton />;

  return (
    <div className="space-y-4">
      <DataTable key={results.length} columns={columns} data={tableData} />
      <div className="item-center flex justify-center">
        {status !== 'Exhausted' && (
          <Button
            disabled={status === 'LoadingMore'}
            onClick={() => loadMore(FETCH_LIMIT + fetchIndexRef.current++ * 4)}
          >
            Load More
          </Button>
        )}
      </div>
    </div>
  );
};

const LoadingSkeleton = () => {
  return <Skeleton className="h-[80vh] w-full" />;
};
