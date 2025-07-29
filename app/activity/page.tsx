"use client";

import * as React from "react";
import LoadingCard from "@/lib/components/loading-card";
import ActivityDetailContent from "@/app/activity/components/activity_detail";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import { Box } from "@mui/material";
import { ActivityDetailHeader } from "./components/activity_detail_header";

enum State {
  Loading,
  Loaded,
  Error,
}

export default function ActivityDetailPage() {
  const [state, setState] = React.useState(State.Loading);

  const loadActivity = async () => {
    setTimeout(() => {
      setState(State.Loaded);
    }, 2000);
  };

  React.useEffect(() => {
    loadActivity();
  }, []);

  return (
    <Box
      sx={{
        minHeight: "unset",
        height: "auto",
        bgcolor: "#f5f6fa",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 4,
      }}
    >
      <Card
        sx={{
          maxWidth: 400,
          width: "100%",
          px: 2,
          py: 2,
          boxShadow: 3,
          position: "relative",
        }}
      >
        <ActivityDetailHeader />
        <Divider />
        {state === State.Loading && <LoadingCard />}
        {state === State.Loaded && <ActivityDetailContent />}
      </Card>
    </Box>
  );
}
