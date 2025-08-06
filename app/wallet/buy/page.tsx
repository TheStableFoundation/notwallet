"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Content from "./components/content";
import PageTitleBar from "@/lib/components/page-title-bar";

export default function Page() {
  return (
    <React.Suspense>
      <Box
        sx={{
          minHeight: "unset",
          height: "auto",
          bgcolor: "#f5f6fa",
          pb: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <PageTitleBar title="Buy Crypto" />
        <Box sx={{ width: "100%", maxWidth: 480, alignItems: "center" }}>
          <Content />
        </Box>
      </Box>
    </React.Suspense>
  );
}
