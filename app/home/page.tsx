"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import { useState } from "react";
import { feed } from "./components/feed";
import LoadingCard from "@/lib/components/loading-card";
import ActivityListView from "./components/activity_list_view";
import { SolanaWallet, STORE_ACTIVE_KEYPAIR } from "@/lib/crate/generated";
import { store } from "@/lib/store/store";
import PageTitleBar from "@/lib/components/page-title-bar";

enum State {
  Loading,
  Loaded,
  Error,
}

export default function HomeFeedPage() {
  const [state, setState] = useState<State>(State.Loading);
  const [pubkey, setPubkey] = useState<string | undefined>(undefined);

  async function loadActivities() {
    const wallet = await store().get<SolanaWallet>(STORE_ACTIVE_KEYPAIR);
    if (!wallet?.pubkey) {
      setState(State.Error);
      return;
    }

    setPubkey(wallet.pubkey);
    setTimeout(() => {
      setState(State.Loaded);
    }, 1500); // 2 seconds delay
  }

  React.useEffect(() => {
    loadActivities();
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
      <PageTitleBar title="Activity Feed" />
      {state === State.Loading && <LoadingCard />}
      {state === State.Loaded && pubkey && (
        <ActivityListView feed={feed} pubkey={pubkey} />
      )}
    </Box>
  );
}
