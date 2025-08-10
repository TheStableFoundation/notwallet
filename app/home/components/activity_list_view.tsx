"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import ActivityComponent, { ActivityItem } from "./activity_component";
import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { debug as tauriDebug } from "@tauri-apps/plugin-log";
import OnboardingCard from "./onboarding_card";
import { CHECK_PUBKEY } from "@/lib/commands";
import { CheckPubkeyResponse } from "@/lib/crate/generated";

enum ActivityState {
  Loading,
  Loaded,
  LoadingMore,
  Error,
}

// Define the props type
interface ActivityListViewProps {
  feed: ActivityItem[];
  pubkey: string;
}

export default function ActivityListView({
  feed: initialFeed,
  pubkey,
}: ActivityListViewProps) {
  const [state, setState] = useState<ActivityState>(ActivityState.Loading);
  const [showOnboardingCard, setShowOnboardingCard] = useState(false);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [hasMore, setHasMore] = useState(true);

  async function checkOnboarding() {
    try {
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
      setActivities(initialFeed);
      setState(ActivityState.Loaded);
    } catch (error) {
      console.error("Error loading activities:", error);
      setState(ActivityState.Error);
    }
  }

  async function loadMore() {
    if (!hasMore || state === ActivityState.LoadingMore) return;

    try {
      setState(ActivityState.LoadingMore);

      // Simulate loading more data
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo purposes, we'll duplicate some activities with new IDs
      const moreActivities = initialFeed.slice(0, 3).map((item, index) => ({
        ...item,
        id: `${item.id}-more-${activities.length + index}`,
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
  }

  React.useEffect(() => {
    checkOnboarding();
    loadActivities();
  }, [pubkey]);

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

      {state === ActivityState.Loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress size={24} sx={{ color: "#9932CC" }} />
        </Box>
      )}

      {(state === ActivityState.Loaded ||
        state === ActivityState.LoadingMore) && (
        <>
          {activities.map((item) => (
            <ActivityComponent key={item.id} item={item} />
          ))}

          {hasMore && (
            <Box
              sx={{ display: "flex", justifyContent: "center", mt: 3, mb: 2 }}
            >
              <Button
                variant="outlined"
                onClick={loadMore}
                disabled={state === ActivityState.LoadingMore}
                sx={{
                  borderColor: "#9932CC",
                  color: "#9932CC",
                  "&:hover": {
                    borderColor: "#7B1FA2",
                    bgcolor: "rgba(153, 50, 204, 0.04)",
                  },
                  borderRadius: 2,
                  px: 4,
                  py: 1,
                }}
              >
                {state === ActivityState.LoadingMore ? (
                  <>
                    <CircularProgress
                      size={16}
                      sx={{ color: "#9932CC", mr: 1 }}
                    />
                    Loading...
                  </>
                ) : (
                  "Load More"
                )}
              </Button>
            </Box>
          )}
        </>
      )}

      {state === ActivityState.Error && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="body2" color="error">
            Failed to load activities
          </Typography>
          <Button
            variant="text"
            onClick={loadActivities}
            sx={{ mt: 1, color: "#9932CC" }}
          >
            Retry
          </Button>
        </Box>
      )}
    </Box>
  );
}
