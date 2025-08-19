"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import { useState } from "react";

import LoadingCard from "@/lib/components/loading-card";
import HomeView from "./_components/home-view";
import { SolanaWallet, STORE_ACTIVE_KEYPAIR } from "@/lib/crate/generated";
import { store } from "@/lib/store/store";
import PageTitleBar from "@/lib/components/page-title-bar";

export default function HomePage() {
  return (
    <Box
      sx={{
        minHeight: "unset",
        bgcolor: "#f5f6fa",
        pb: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <PageTitleBar title="Home" />
      <HomeView />
    </Box>
  );
}
