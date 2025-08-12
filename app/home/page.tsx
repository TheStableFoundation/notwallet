"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import { useState } from "react";

import LoadingCard from "@/lib/components/loading-card";
import HomeView from "./_components/home-view";
import { SolanaWallet, STORE_ACTIVE_KEYPAIR } from "@/lib/crate/generated";
import { store } from "@/lib/store/store";
import PageTitleBar from "@/lib/components/page-title-bar";

enum State {
  Loading,
  Loaded,
  Error,
}

export default function HomePage() {
  const [state, setState] = useState<State>(State.Loading);
  const [pubkey, setPubkey] = useState<string | undefined>(undefined);

  async function loadWallet() {
    const wallet = await store().get<SolanaWallet>(STORE_ACTIVE_KEYPAIR);
    if (!wallet?.pubkey) {
      setState(State.Error);
      return;
    }

    setPubkey(wallet.pubkey);
    setState(State.Loaded);
  }

  React.useEffect(() => {
    loadWallet();
  }, []);

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
      {state === State.Loading && <LoadingCard />}
      {state === State.Loaded && pubkey && <HomeView pubkey={pubkey} />}
    </Box>
  );
}
