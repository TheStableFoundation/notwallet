"use client";

import { Container } from "@mui/material";
import BottomTabBar from "@/lib/components/bottom-tab-bar";
import { useAppLock } from "@/lib/context/app-lock-context";
import React from "react";
import { check } from "@smbcloud/tauri-plugin-android-tv-check-api";
import { info } from "@tauri-apps/plugin-log";
import AndroidTvLayout from "./android-tv-layout";
import LoadingCard from "@/lib/components/loading-card";

enum State {
  INITIALIZING,
  INITIALIZED,
}

export default function LayoutWithMenuBar({
  children,
}: {
  children: React.ReactNode;
}) {
  const { locked } = useAppLock();
  const [initialized, setInitialized] = React.useState(false);
  const [isAndroidTv, setIsAndroidTv] = React.useState(false);
  const [state, setState] = React.useState(State.INITIALIZING);

  const init = async () => {
    setInitialized(true);
    // Shouldn't rely on locked status whether to show bottom tab bar
    // because we don't show it if a user need onboarding

    const checkResult = await check();
    info(`Android TV: ${JSON.stringify(checkResult)}`);
    setIsAndroidTv(true);
    setState(State.INITIALIZED);
  };

  React.useEffect(() => {
    init();
  }, [locked]);

  if (state === State.INITIALIZING) {
    return <LoadingCard />;
  }
  if (state === State.INITIALIZED) {
    return (
      <>
        <Container
          sx={{
            height: "auto",
            minHeight: "unset",
            display: "block",
            flex: "none",
          }}
        >
          {isAndroidTv ? <AndroidTvLayout children={children} /> : children}
        </Container>
        {initialized && !locked && !isAndroidTv && <BottomTabBar />}
      </>
    );
  }
}
