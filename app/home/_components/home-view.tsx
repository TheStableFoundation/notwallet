"use client";

import Box from "@mui/material/Box";
import HorizontalMenu from "./horizontal-menu";
import ActivityListView from "./activity_list_view";

export default function HomeView() {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <HorizontalMenu />
      <ActivityListView />
    </Box>
  );
}
