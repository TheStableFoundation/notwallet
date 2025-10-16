"use client";

import { Container } from "@mui/material";
import BottomTabBar from "@lib/components/bottom-tab-bar";
import { useAppLock } from "@lib/context/app-lock-context";
import React from "react";
import AndroidTvLayout from "./android-tv-layout";
import { checkIfAndroidTv, checkIfMobileDevice } from "@lib/helper";

export default function LayoutWithMenuBar({
  children,
}: {
  children: React.ReactNode;
}) {
  const { locked } = useAppLock();
  const [initialized, setInitialized] = React.useState(false);
  const [isAndroidTv, setIsAndroidTv] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  const init = async () => {
    setInitialized(true);
    // Shouldn't rely on locked status whether to show bottom tab bar
    // because we don't show it if a user need onboarding

    setIsAndroidTv(await checkIfAndroidTv());
    setIsMobile(await checkIfMobileDevice());
  };

  React.useEffect(() => {
    init();
  }, [locked]);

  return (
    <>
      <Container
        sx={{
          paddingTop: isMobile ? 6 : 0,
          height: "auto",
          minHeight: "unset",
          display: "block",
          flex: "none",
        }}
      >
        {isAndroidTv ? <AndroidTvLayout>{children}</AndroidTvLayout> : children}
      </Container>
      {initialized && !locked && <BottomTabBar isMobile={isMobile} />}
    </>
  );
}
