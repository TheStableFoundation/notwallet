"use client";

import * as React from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper";
import HomeIcon from "@mui/icons-material/Home";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import SettingsIcon from "@mui/icons-material/Settings";
import { usePathname, useRouter } from "next/navigation";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";

export default function BottomTabBar() {
  const pathname = usePathname();
  const router = useRouter();
  let value = 0;
  if (
    pathname === "/wallet" ||
    pathname === "/wallet/token" ||
    pathname === "/wallet/settings" ||
    pathname === "/deposit" ||
    pathname === "/create-new-wallet"
  )
    value = 1;
  else if (
    pathname === "/settings" ||
    pathname === "/settings/about" ||
    pathname === "/settings/app-info" ||
    pathname === "/settings/app-preferences"
  )
    value = 2;
  else if (pathname === "/home" || pathname.startsWith("/activity")) value = 0;

  const handleChange = async (_: React.SyntheticEvent, newValue: number) => {
    try {
      await selectionFeedback();
    } catch {}
    if (newValue === 0 && pathname !== "/home") {
      router.push("/home");
    } else if (newValue === 1 && pathname !== "/wallet") {
      router.push("/wallet");
    } else if (newValue === 2 && pathname !== "/settings") {
      router.push("/settings");
    }
  };

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
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
          bgcolor: "#fff",
        }}
      >
        <BottomNavigationAction
          label="Home"
          icon={<HomeIcon />}
          sx={{
            color: value === 0 ? "#AD5AD7" : undefined,
            "&.Mui-selected": { color: "#AD5AD7" },
          }}
        />
        <BottomNavigationAction
          label="Wallet"
          icon={<AccountBalanceWalletIcon />}
          sx={{
            color: value === 1 ? "#AD5AD7" : undefined,
            "&.Mui-selected": { color: "#AD5AD7" },
          }}
        />
        <BottomNavigationAction
          label="Settings"
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
