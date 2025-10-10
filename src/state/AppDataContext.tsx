'use client';

import { createContext, useEffect, useState } from 'react';
import { type UserInfoSession, useSession } from '~/lib/auth-client';

type user_info_type = UserInfoSession;
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
  const session = useSession();

  const [userInfoFetched, setUserInfoFetched] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !session.isPending && session.data) {
      setUserInfoFetched(true);
    }
  }, [session]);

  const user = (!userInfoFetched ? initialSession : session.data?.user) ?? null;

  return <AppContext.Provider value={{ user_info: user }}>{children}</AppContext.Provider>;
};
