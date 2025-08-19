"use client";

import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { useAppLock } from "@/lib/context/app-lock-context";
import { debug, error as logError } from "@tauri-apps/plugin-log";
import LockedWalletView from "@/lib/components/locked-wallet-view";
import CreateOrImportWalletView from "@/lib/components/create-or-import-wallet-view";

export default function Page() {
  return <CreateOrImportWalletView />;
}
