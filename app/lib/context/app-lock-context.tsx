"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { store } from "../store/store";
import { error } from "@tauri-apps/plugin-log";

type AppLockContextType = {
  locked: boolean;
  lock: () => void;
  unlock: () => void;
};

const AppLockContext = createContext<AppLockContextType>({
  locked: false,
  lock: () => {},
  unlock: () => {},
});

export function AppLockProvider({ children }: { children: React.ReactNode }) {
  const [locked, setLocked] = useState(false);

  const init = async () => {
    try {
      const locked = await store().get<boolean>("wallet_locked");
      setLocked(locked ?? false);
    } catch (e) {
      error(`AppLockProvider: ${e}`);
    }
  };

  useEffect(() => {
    init();
  }, []);

  const lock = async () => {
    setLocked(true);
    await store().set("wallet_locked", true);
  };

  const unlock = async () => {
    setLocked(false);
    await store().set("wallet_locked", false);
  };

  return (
    <AppLockContext.Provider value={{ locked, lock, unlock }}>
      {children}
    </AppLockContext.Provider>
  );
}

export function useAppLock() {
  return useContext(AppLockContext);
}
