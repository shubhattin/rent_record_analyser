'use client';

import { createContext, useEffect, useState } from 'react';
import { api } from '$convex/_generated/api';

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
  return <AppContext.Provider value={{ user_info: null }}>{children}</AppContext.Provider>;
};
