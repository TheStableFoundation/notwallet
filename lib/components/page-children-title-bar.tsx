"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";
import { useI18n } from "@lib/i18n/provider";
import { useNavigate } from "react-router-dom";

export default function PageChildrenTitleBar({ title }: { title: string }) {
  const router = useNavigate();
  const { t } = useI18n();
  const handleBack = async () => {
    await selectionFeedback();
    router(-1);
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
          {t("common.back")}
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
