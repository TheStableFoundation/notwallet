"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import ActivityComponent, { ActivityItem } from "./activity_component";
import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { debug as tauriDebug } from "@tauri-apps/plugin-log";
import OnboardingCard from "./onboarding_card";

// Define the props type
interface ActivityListViewProps {
  feed: ActivityItem[];
  pubkey: string;
}

export default function ActivityListView({
  feed,
  pubkey,
}: ActivityListViewProps) {
  const [showOnboardingCard, setShowOnboardingCard] = useState(false);

  async function checkOnboarding() {
    try {
      const exists = await invoke<boolean>("check_pubkey", { pubkey });
      tauriDebug(`check_pubkey exists: ${exists}, pubkey: ${pubkey}`);
      setShowOnboardingCard(!exists);
    } catch (err) {
      tauriDebug(`check_pubkey error: ${err}`);
    }
  }
  React.useEffect(() => {
    checkOnboarding();
  }, [pubkey]);

  return (
    <Box sx={{ width: "100%", maxWidth: 480 }}>
      {showOnboardingCard && (
        <OnboardingCard
          open={showOnboardingCard}
          onClose={() => setShowOnboardingCard(false)}
        />
      )}
      {feed.map((item) => (
        <ActivityComponent key={item.id} item={item} />
      ))}
    </Box>
  );
}
