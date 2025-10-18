"use client";

import * as React from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper";
import HomeIcon from "@mui/icons-material/Home";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import SettingsIcon from "@mui/icons-material/Settings";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";
import { useLang } from "../../src/LanguageContext";
import { useLocation, useNavigate } from "react-router-dom";

export default function BottomTabBar({ isMobile }: { isMobile: boolean }) {
  const pathname = useLocation().pathname;
  const router = useNavigate();
  const { t } = useLang();

  // Determine active tab based on pathname
  const getActiveTab = () => {
    if (
      pathname === "/wallet" ||
      pathname === "/wallet/token" ||
      pathname === "/wallet/settings" ||
      pathname === "/wallet/buy" ||
      pathname === "/wallet/buy/onramper" ||
      pathname === "/wallet/buy/stripe" ||
      pathname === "/wallet/create-new-wallet" ||
      pathname === "/wallet/import" ||
      pathname.startsWith("/wallet/onboarding") ||
      pathname.startsWith("/wallet/")
    ) {
      return 1; // Wallet tab
    } else if (
      pathname === "/settings" ||
      pathname === "/settings/about" ||
      pathname === "/settings/app-info" ||
      pathname === "/settings/app-preferences" ||
      pathname.startsWith("/settings/")
    ) {
      return 2; // Settings tab
    } else if (
      pathname === "/home" ||
      pathname.startsWith("/home/activity") ||
      pathname.startsWith("/home/dao") ||
      pathname.startsWith("/home/learn") ||
      pathname.startsWith("/home/meme") ||
      pathname.startsWith("/home/")
    ) {
      return 0; // Home tab
    } else {
      // Default to home for any unmatched paths
      return 0;
    }
  };

  const value = getActiveTab();

  const handleChange = async (_: React.SyntheticEvent, newValue: number) => {
    try {
      await selectionFeedback();
    } catch {}
    if (newValue === 0 && pathname !== "/home") {
      router("/home");
    } else if (newValue === 1 && pathname !== "/wallet") {
      router("/wallet");
    } else if (newValue === 2 && pathname !== "/settings") {
      router("/settings");
    }
  };

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: isMobile ? 8 : 0,
        left: 0,
        width: "100vw",
        zIndex: 100,
        boxShadow: "0 -2px 12px #0001",
      }}
      elevation={3}
    >
      <BottomNavigation
        value={value}
        onChange={handleChange}
        showLabels
        sx={{
          width: "100%",
          maxWidth: 420,
          margin: "0 auto",
          bgcolor: "#f5f6fa",
        }}
      >
        <BottomNavigationAction
          label={t.home}
          icon={<HomeIcon />}
          sx={{
            color: value === 0 ? "#AD5AD7" : undefined,
            "&.Mui-selected": { color: "#AD5AD7" },
          }}
        />
        <BottomNavigationAction
          label={t.wallet}
          icon={<AccountBalanceWalletIcon />}
          sx={{
            color: value === 1 ? "#AD5AD7" : undefined,
            "&.Mui-selected": { color: "#AD5AD7" },
          }}
        />
        <BottomNavigationAction
          label={t.settings}
          icon={<SettingsIcon />}
          sx={{
            color: value === 2 ? "#AD5AD7" : undefined,
            "&.Mui-selected": { color: "#AD5AD7" },
          }}
        />
      </BottomNavigation>
    </Paper>
  );
}
