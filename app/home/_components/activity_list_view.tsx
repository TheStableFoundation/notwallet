"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { ActivityItem } from "./activity_component";
import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { debug as tauriDebug } from "@tauri-apps/plugin-log";
import OnboardingCard from "./onboarding_card";
import { CHECK_PUBKEY } from "@/lib/commands";
import { CheckPubkeyResponse } from "@/lib/crate/generated";
import { openUrl } from "@tauri-apps/plugin-opener";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";
import { feed } from "./feed";

enum ActivityState {
  Loading,
  Loaded,
  LoadingMore,
  Error,
}

export default function ActivityListView() {
  const [state, setState] = useState<ActivityState>(ActivityState.Loading);
  const [showOnboardingCard, setShowOnboardingCard] = useState(false);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [hasMore, setHasMore] = useState(true);
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

  async function checkOnboarding() {
    try {
      // Move this call to backend
      const res = await invoke<CheckPubkeyResponse>(CHECK_PUBKEY, {
        pubkey,
      });
      tauriDebug(`check_pubkey exists: ${res.exists}, pubkey: ${pubkey}`);
      setShowOnboardingCard(!res.exists);
    } catch (err) {
      tauriDebug(`check_pubkey error: ${err}`);
    }
  }

  async function loadActivities() {
    try {
      setState(ActivityState.Loading);

      // Simulate loading delay for initial load
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Use the initial feed data
      setActivities(feed);
      setState(ActivityState.Loaded);
    } catch (error) {
      console.error("Error loading activities:", error);
      setState(ActivityState.Error);
    }
  }

  /*async function loadMore() {
    if (!hasMore || state === ActivityState.LoadingMore) return;

    try {
      setState(ActivityState.LoadingMore);

      // Simulate loading more data
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Generate more BACH earning activities
      const taskTemplates = [
        {
          action: "Earned 25 BACH",
          description:
            "Completed task: Fixed tempo metadata for 15 classical music pieces.",
          amount: "+25 BACH",
        },
        {
          action: "Earned 60 BACH",
          description:
            "Completed task: Imported Apple Music playlist 'Hip-Hop Classics' (98 songs) to database.",
          amount: "+60 BACH",
        },
        {
          action: "Earned 45 BACH",
          description:
            "Completed task: Verified song credits for 30 tracks from various indie artists.",
          amount: "+45 BACH",
        },
        {
          action: "Earned 80 BACH",
          description:
            "Completed task: Transcribed lyrics for 5 unreleased Johnny Cash demos.",
          amount: "+80 BACH",
        },
        {
          action: "Earned 35 BACH",
          description:
            "Completed task: Added genre tags to 40 world music recordings.",
          amount: "+35 BACH",
        },
      ];

      const moreActivities = taskTemplates
        .slice(0, 3)
        .map((template, index) => ({
          id: `generated-${activities.length + index}`,
          user: {
            name: `Contributor ${activities.length + index + 1} (demo)`,
            avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=user${activities.length + index}`,
            wallet: `${Math.random().toString(36).substr(2, 4)}...${Math.random().toString(36).substr(2, 4)}`,
          },
          time: `${Math.floor(Math.random() * 12) + 1} hours ago`,
          image:
            "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=480&q=80",
          ...template,
        }));

      setActivities((prev) => [...prev, ...moreActivities]);

      // Simulate reaching end after a few loads
      if (activities.length > 10) {
        setHasMore(false);
      }

      setState(ActivityState.Loaded);
    } catch (error) {
      console.error("Error loading more activities:", error);
      setState(ActivityState.Loaded);
    }
  } */

  React.useEffect(() => {
    checkOnboarding();
    loadActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{ width: "100%", maxWidth: 480, px: 2 }}>
      {showOnboardingCard && (
        <OnboardingCard
          open={showOnboardingCard}
          onClose={() => setShowOnboardingCard(false)}
        />
      )}
      <Typography
        variant="h6"
        sx={{
          color: "#333",
          fontWeight: 600,
          mb: 2,
          fontSize: "1.1rem",
        }}
      >
        Activity Feed
      </Typography>

      {/* BACH Airdrop Banner */}
      <Card
        sx={{
          mb: 3,
          background: "linear-gradient(135deg, #9932CC 0%, #7B1FA2 100%)",
          color: "white",
          borderRadius: 2,
          boxShadow: "0 4px 12px rgba(153, 50, 204, 0.2)",
        }}
      >
        <CardContent sx={{ py: 2.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: "1.1rem",
                mr: 1,
              }}
            >
              🪂 BACH Airdrop Live!
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{
              mb: 2,
              opacity: 0.95,
              lineHeight: 1.5,
            }}
          >
            Multiple ways to earn your BACH tokens! Complete tasks, contribute
            to the music database, and participate in the ecosystem.
          </Typography>
          <Button
            onClick={async () => {
              await selectionFeedback();
              openUrl("https://bach.money/airdrop");
            }}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              bgcolor: "rgba(255, 255, 255, 0.2)",
              color: "white",
              px: 2,
              py: 1,
              borderRadius: 1.5,
              textDecoration: "none",
              fontSize: "0.875rem",
              fontWeight: 600,
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.3)",
                transform: "translateY(-1px)",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            Claim Your Airdrop →
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
