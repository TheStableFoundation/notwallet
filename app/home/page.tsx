"use client";

import Box from "@mui/material/Box";
import HomeView from "./_components/home-view";
import PageTitleBar from "@lib/components/page-title-bar";

export default function HomePage() {
  return (
    <Box
      sx={{
        minHeight: "unset",
        pb: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <PageTitleBar title={""} />
      <HomeView />
    </Box>
  );
}
