'use client';

import { createContext } from 'react';
import { api } from '$convex/_generated/api';
import { useQuery } from 'convex/react';

type user_info_type = (typeof api.auth.getCurrentUser)['_returnType'];
export const AppContext = createContext<{
  user_info: user_info_type;
}>({
  user_info: null
});

export const AppContextProvider = ({
  children,
  initialSession
}: {
  children: React.ReactNode;
  initialSession: user_info_type | null;
}) => {
  const currentUserResponse = useQuery(api.auth.getCurrentUser, {});
  const user = currentUserResponse ?? initialSession;

  return <AppContext.Provider value={{ user_info: user }}>{children}</AppContext.Provider>;
};
