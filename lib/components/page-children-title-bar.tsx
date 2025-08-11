"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";

export default function PageChildrenTitleBar({ title }: { title: string }) {
  const router = useRouter();
  const handleBack = async () => {
    await selectionFeedback();
    router.back();
  };
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 420,
        px: 2,
        mb: 3,
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          py: 2,
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{
            minWidth: 0,
            py: 1,
            fontSize: "16px",
            fontWeight: 500,
            color: "#8B5CF6",
            borderRadius: "12px",
            textTransform: "none",
            "&:hover": {
              bgcolor: "rgba(139, 92, 246, 0.08)",
            },
          }}
        >
          Back
        </Button>
        <Typography
          variant="h5"
          sx={{
            pr: 1,
            fontSize: "20px",
            fontWeight: 600,
            color: "#1F2937",
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </Typography>
      </Stack>
    </Box>
  );
}
