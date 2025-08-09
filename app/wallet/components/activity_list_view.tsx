import * as React from "react";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Avatar,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import InfoIcon from "@mui/icons-material/Info";

import type { Activity } from "./transactions";

enum ActivityState {
  Loading,
  Loaded,
  LoadingMore,
  Error,
}

interface ActivityListViewProps {
  activities: Activity[];
}

export default function ActivityListView({
  activities: initialActivities,
}: ActivityListViewProps) {
  const [state, setState] = React.useState<ActivityState>(ActivityState.Loaded);
  const [activities, setActivities] = React.useState<Activity[]>(
    initialActivities.slice(0, 5),
  ); // Show first 5 initially
  const [hasMore, setHasMore] = React.useState(true);

  React.useEffect(() => {
    setActivities(initialActivities.slice(0, 5));
    setHasMore(initialActivities.length > 5);
  }, [initialActivities]);

  const loadMore = async () => {
    if (!hasMore || state === ActivityState.LoadingMore) return;

    try {
      setState(ActivityState.LoadingMore);

      // Simulate loading delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Load next 5 activities
      const currentCount = activities.length;
      const nextActivities = initialActivities.slice(0, currentCount + 5);

      setActivities(nextActivities);

      // Check if we've loaded all activities
      if (nextActivities.length >= initialActivities.length) {
        setHasMore(false);
      }

      setState(ActivityState.Loaded);
    } catch (error) {
      console.error("Error loading more activities:", error);
      setState(ActivityState.Loaded);
    }
  };

  return (
    <Stack spacing={2}>
      {activities.map((activity) => (
        <Card
          key={activity.id}
          sx={{
            borderRadius: 3,
            boxShadow: "0 2px 12px rgba(173, 90, 215, 0.08)",
            bgcolor: "#f7f2fa",
            border: "1px solid #e1c8f7",
            display: "flex",
            alignItems: "center",
            px: 2,
          }}
        >
          <Avatar
            sx={{
              bgcolor:
                activity.type === "received"
                  ? "#AD5AD7"
                  : activity.type === "airdrop"
                    ? "#FFD700"
                    : "#fff",
              color:
                activity.type === "received"
                  ? "#fff"
                  : activity.type === "airdrop"
                    ? "#AD5AD7"
                    : "#AD5AD7",
              mr: 2,
              boxShadow:
                activity.type === "received"
                  ? "0 0 8px #AD5AD7"
                  : activity.type === "airdrop"
                    ? "0 0 8px #FFD700"
                    : "none",
            }}
          >
            {activity.type === "received" ? (
              <ArrowDownwardIcon />
            ) : activity.type === "sent" ? (
              <ArrowUpwardIcon />
            ) : (
              <InfoIcon />
            )}
          </Avatar>
          <CardContent sx={{ flex: 1, py: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <InfoIcon sx={{ color: "#AD5AD7" }} />
              <Typography
                variant="subtitle1"
                sx={{ color: "#AD5AD7", fontWeight: 600 }}
              >
                {activity.coin}
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ mt: 1, color: "#212529" }}>
              {activity.type === "received"
                ? "Received"
                : activity.type === "sent"
                  ? "Sent"
                  : "Airdrop"}{" "}
              {activity.coin}
            </Typography>
            <Typography variant="h6" sx={{ color: "#AD5AD7", fontWeight: 700 }}>
              {activity.type === "received"
                ? "+"
                : activity.type === "sent"
                  ? "-"
                  : "+"}
              ${activity.amount.toLocaleString()}
            </Typography>
            <Typography variant="caption" sx={{ color: "#90a4ae" }}>
              {activity.date}
            </Typography>
          </CardContent>
        </Card>
      ))}

      {hasMore && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3, mb: 2 }}>
          <Button
            variant="outlined"
            onClick={loadMore}
            disabled={state === ActivityState.LoadingMore}
            sx={{
              borderColor: "#AD5AD7",
              color: "#AD5AD7",
              "&:hover": {
                borderColor: "#7B1FA2",
                bgcolor: "rgba(173, 90, 215, 0.04)",
              },
              borderRadius: 2,
              px: 4,
              py: 1,
            }}
          >
            {state === ActivityState.LoadingMore ? (
              <>
                <CircularProgress size={16} sx={{ color: "#AD5AD7", mr: 1 }} />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </Box>
      )}
    </Stack>
  );
}
