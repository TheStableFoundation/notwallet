"use client";

import Box from "@mui/material/Box";
import HomeView from "./_components/home-view";

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
      <HomeView />
    </Box>
  );
}
