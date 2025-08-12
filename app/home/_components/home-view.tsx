"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import HorizontalMenu from "./horizontal-menu";
import ActivityListView from "./activity_list_view";
import { feed } from "./feed";

interface HomeViewProps {
  pubkey: string;
}

export default function HomeView({ pubkey }: HomeViewProps) {
  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <HorizontalMenu />
      <ActivityListView feed={feed} pubkey={pubkey} />
    </Box>
  );
}
