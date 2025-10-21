"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { store } from "../store/store";
import { error } from "@tauri-apps/plugin-log";

type AppEnvironmentContextType = {
  locked: boolean;
  lock: () => void;
  unlock: () => void;
};

const AppEnvironmentContext = createContext<AppEnvironmentContextType>({
  locked: false,
  lock: () => {},
  unlock: () => {},
});

export function AppEnvironmentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [locked, setLocked] = useState(false);
  const [environment, setEnvironment] = useState("production");

  const init = async () => {
    try {
      const environment = await store().get<string>("app_environment");
      if (environment) setEnvironment(environment);
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
    <AppEnvironmentContext.Provider value={{ locked, lock, unlock }}>
      {children}
    </AppEnvironmentContext.Provider>
  );
}

/// Define application environment.
/// Support local and production.
export function useAppEnvironment() {
  return useContext(AppEnvironmentContext);
}
