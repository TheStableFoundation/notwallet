"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Content from "./_components/content";
import PageChildrenTitleBar from "@lib/components/page-children-title-bar";

export default function Page() {
  return (
    <React.Suspense>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "linear-gradient(135deg, #FAFBFF 0%, #F8FAFF 100%)",
          background: "linear-gradient(135deg, #FAFBFF 0%, #F8FAFF 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pb: 8,
        }}
      >
        <PageChildrenTitleBar title="Buy Crypto" />
        <Box sx={{ width: "100%", maxWidth: 480, alignItems: "center" }}>
          <Content />
        </Box>
      </Box>
    </React.Suspense>
  );
}
