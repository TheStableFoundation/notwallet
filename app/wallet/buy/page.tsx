"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Content from "./components/content";

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
        <Box sx={{ width: "100%", maxWidth: 480 }}>
          <Typography
            variant="h5"
            component="h1"
            fontWeight="bold"
            align="center"
            sx={{ mb: 2 }}
          >
            Buy Crypto
          </Typography>
        </Box>
        <Box sx={{ width: "100%", maxWidth: 480 }}>
          <Content />
        </Box>
      </Box>
    </React.Suspense>
  );
}
