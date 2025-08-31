"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";

export default function WalletHeader({ token }: { token: string }) {
  const router = useRouter();
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        pl: 2,
        pt: 2,
        pb: 1,
        bgcolor: "transparent",
      }}
    >
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={async () => {
          await selectionFeedback();
          router.back();
        }}
        sx={{
          minWidth: 0,
          px: 1,
          py: 0.5,
          fontSize: "0.95rem",
          mr: 1,
        }}
      >
        Back
      </Button>
      <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
        <Typography variant="h5" fontWeight="bold" paddingRight={2}>
          {token}
        </Typography>
      </Box>
    </Box>
  );
}
