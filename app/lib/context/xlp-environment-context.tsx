"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { store } from "../store/store";
import { error } from "@tauri-apps/plugin-log";
import { XlpEnvironment, KEY_XLP_ENVIRONMENT } from "@app/lib/crate/generated";

type XlpEnvironmentContextType = {
  xlpEnvironment: XlpEnvironment;
  setXlpEnvironment: (environment: XlpEnvironment) => void;
  isInitialized: boolean;
};

const XlpEnvironmentContext = createContext<XlpEnvironmentContextType>({
  xlpEnvironment: "production",
  setXlpEnvironment: () => {},
  isInitialized: false,
});

export function XlpEnvironmentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [xlpEnvironment, setXlpEnvironment] =
    useState<XlpEnvironment>("production");
  const [isInitialized, setIsInitialized] = useState(false);

  const init = async () => {
    try {
      const environment =
        await store().get<XlpEnvironment>(KEY_XLP_ENVIRONMENT);
      if (environment) setXlpEnvironment(environment);
    } catch (e) {
      error(`XlpEnvironmentProvider: ${e}`);
    } finally {
      setIsInitialized(true);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <XlpEnvironmentContext.Provider
      value={{ xlpEnvironment, setXlpEnvironment, isInitialized }}
    >
      {children}
    </XlpEnvironmentContext.Provider>
  );
}

/// Define application environment.
/// Support local and production.
export function useXlpEnvironment() {
  return useContext(XlpEnvironmentContext);
}
