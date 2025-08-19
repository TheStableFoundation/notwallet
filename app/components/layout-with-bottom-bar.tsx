"use client";
import { Container } from "@mui/material";
import BottomTabBar from "@/lib/components/create-or-import-wallet-view";
import { useAppLock } from "@/lib/context/app-lock-context";
import React from "react";
import { check } from "tauri-plugin-android-tv-check-api";
import { info } from "@tauri-apps/plugin-log";

export default function LayoutWithBottomBar({
  children,
}: {
  children: React.ReactNode;
}) {
  const { locked } = useAppLock();
  const [initialized, setInitialized] = React.useState(false);
  const [isAndroidTv, setIsAndroidTv] = React.useState(false);

  const init = async () => {
    setInitialized(true);
    // Shouldn't rely on locked status whether to show bottom tab bar
    // because we don't show it if a user need onboarding

    const checkResult = await check();
    info(`Android TV: ${JSON.stringify(checkResult)}`);
    setIsAndroidTv(checkResult.isAndroidTv);
  };

  React.useEffect(() => {
    init();
  }, [locked]);

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
        {children}
      </Container>
      {!isAndroidTv && initialized && !locked && <BottomTabBar />}
    </>
  );
}
