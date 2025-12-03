import React, { createContext, useContext, useState, useEffect } from "react";
import { debug, error } from "@tauri-apps/plugin-log";
import { invoke } from "@tauri-apps/api/core";
import { STORE_ACCESS_TOKEN_KEY } from "../crate/generated";
import { storeAccount } from "../store/store";

/* This file is generated and managed by tsync */

export interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  refresh_token_expires_in?: string;
  scope: string;
  token_type: string;
}

export interface OauthRedirect {
  code: string;
  scope: string;
  authuser: number;
  prompt: string;
}

export interface UserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
}

type AccountContextType = {
  loggedIn: boolean;
  accessToken: string | undefined;
  user: UserInfo | undefined;
  provider: undefined | "google" | "apple";
  onLoggedOut: () => void;
  onLoggedIn: (provider: "google" | "apple", accessToken: string) => void;
};

const AccountContext = createContext<AccountContextType>({
  loggedIn: false,
  accessToken: undefined,
  user: undefined,
  provider: undefined,
  onLoggedOut: () => {},
  onLoggedIn: (_provider, _accessToken) => {},
});

enum State {
  INITIALIZING,
  LOADED,
}

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>(State.INITIALIZING);
  const [loggedIn, setLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState<string>();
  const [user, setUser] = useState<UserInfo>();
  const [provider, setProvider] = useState<"google" | "apple">();

  const onLoggedOut = () => {
    setState(State.INITIALIZING);
    storeAccount().delete(STORE_ACCESS_TOKEN_KEY);
    setLoggedIn(false);
    setAccessToken(undefined);
    setUser(undefined);
    setState(State.LOADED);
  };

  const onLoggedIn = async (
    provider: "google" | "apple",
    accessToken: string,
  ) => {
    setState(State.INITIALIZING);
    storeAccount().set(STORE_ACCESS_TOKEN_KEY, accessToken);
    const user = await invoke<UserInfo>("get_profile", {
      accessToken,
    });
    debug(`User: ${JSON.stringify(user)}`);
    setUser(user);
    setProvider(provider);
    setLoggedIn(true);
    setState(State.LOADED);
  };

  const init = async () => {
    try {
      const accessToken = await storeAccount().get<string>(
        STORE_ACCESS_TOKEN_KEY,
      );
      const user = await invoke<UserInfo>("get_profile", {
        accessToken,
      });
      setUser(user);
      setLoggedIn(!!accessToken);
      setAccessToken(accessToken);
      setState(State.LOADED);
    } catch (e) {
      // Force log out for now
      onLoggedOut();
      error(`AccountProvider: ${e}`);
      setState(State.LOADED);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <AccountContext.Provider
      value={{ loggedIn, accessToken, user, onLoggedOut, onLoggedIn, provider }}
    >
      {state === State.INITIALIZING && (
        <div className="flex items-center justify-center min-h-screen">
          <span>Loading...</span>
        </div>
      )}
      {state === State.LOADED && children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  return useContext(AccountContext);
}
