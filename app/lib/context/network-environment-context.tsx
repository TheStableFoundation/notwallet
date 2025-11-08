"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { store } from "../store/store";
import { error } from "@tauri-apps/plugin-log";
import { Environment, KEY_NETWORK_ENVIRONMENT } from "@app/lib/crate/generated";

type NetworkEnvironmentContextType = {
  environment: Environment;
  setEnvironment: (environment: Environment) => void;
  isInitialized: boolean;
};

const NetworkEnvironmentContext = createContext<NetworkEnvironmentContextType>({
  environment: "Mainnet",
  setEnvironment: () => {},
  isInitialized: false,
});

export function NetworkEnvironmentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [environment, setEnvironment] = useState<Environment>("Mainnet");
  const [isInitialized, setIsInitialized] = useState(false);

  const init = async () => {
    try {
      const environment = await store().get<Environment>(
        KEY_NETWORK_ENVIRONMENT,
      );
      if (environment) setEnvironment(environment);
    } catch (e) {
      error(`NetworkEnvironmentProvider: ${e}`);
    } finally {
      setIsInitialized(true);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <NetworkEnvironmentContext.Provider
      value={{ environment, setEnvironment, isInitialized }}
    >
      {children}
    </NetworkEnvironmentContext.Provider>
  );
}

/// Define network environment.
/// Support Mainnet, Testnet, Devnet, and Local if debug.
export function useNetworkEnvironment() {
  return useContext(NetworkEnvironmentContext);
}
