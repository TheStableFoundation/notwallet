"use client";

import { Container } from "@mui/material";
import BottomTabBar from "@/lib/components/bottom-tab-bar";
import { useAppLock } from "@/lib/context/app-lock-context";
import React from "react";
import { check } from "@smbcloud/tauri-plugin-android-tv-check-api";
import { info } from "@tauri-apps/plugin-log";
import AndroidTvLayout from "./android-tv-layout";
import { platform } from "@tauri-apps/plugin-os";

export default function LayoutWithMenuBar({
  children,
}: {
  children: React.ReactNode;
}) {
  const { locked } = useAppLock();
  const [initialized, setInitialized] = React.useState(false);
  const [isAndroidTv, setIsAndroidTv] = React.useState(false);
  const paddingTop = ["ios", "android"].includes(platform()) ? 6 : 0;

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
          paddingTop: paddingTop,
          height: "auto",
          minHeight: "unset",
          display: "block",
          flex: "none",
        }}
      >
        {isAndroidTv ? <AndroidTvLayout>{children}</AndroidTvLayout> : children}
      </Container>
      {initialized && !locked && !isAndroidTv && <BottomTabBar />}
    </>
  );
}
