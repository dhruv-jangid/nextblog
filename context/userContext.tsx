"use client";

import { createContext, ReactNode, SetStateAction, useState } from "react";

interface User {
  isLoggedIn: boolean;
  userData: object;
}

export const UserContext = createContext<
  { user: User; setUser: React.Dispatch<SetStateAction<User>> } | undefined
>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>({
    isLoggedIn: false,
    userData: {},
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
