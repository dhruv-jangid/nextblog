"use client";

import React, {
  createContext,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

interface User {
  isLoggedIn: boolean;
  name: string;
}

export const UserContext = createContext<
  { user: User; setUser: React.Dispatch<SetStateAction<User>> } | undefined
>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>({
    isLoggedIn: false,
    name: "Toxic Lmao",
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
