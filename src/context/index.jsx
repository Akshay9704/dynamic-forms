"use client";

import { createContext, useState } from "react";

export const GlobalContext = createContext(null);

export default function GlobalState({ children }) {
  const [userData, setUserData] = useState(null);
  const [isAuthUser, setIsAuthUser] = useState(false);

  return (
    <GlobalContext.Provider
      value={{ userData, setUserData, isAuthUser, setIsAuthUser }}
    >
      {children}
    </GlobalContext.Provider>
  );
}