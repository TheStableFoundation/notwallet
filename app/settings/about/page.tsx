"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import GitHubIcon from "@mui/icons-material/GitHub";
import LanguageIcon from "@mui/icons-material/Language";
import { useRouter } from "next/navigation";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";
import { openUrl } from "@tauri-apps/plugin-opener";

export default function AboutPage() {
  const router = useRouter();

  const handleExternal = async (url: string) => {
    await selectionFeedback();
    await openUrl(url);
  };

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
              About
            </Typography>
          </Box>
        </Box>
        <Divider />
        <Box sx={{ px: 4, py: 3, pr: 5 }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ mb: 1, color: "#1e88e5" }}
          >
            NotWallet - A Crypto Dollar Wallet
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            A modern, community-owned, non-custodial open-source Solana wallet
            app built for privacy, simplicity, and security.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Developed and maintained by The Stable Foundation.
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<LanguageIcon />}
              onClick={() => handleExternal("https://bach.money")}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Website
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<GitHubIcon />}
              onClick={() =>
                handleExternal("https://github.com/TheStableFoundation/not")
              }
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              GitHub
            </Button>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} The Stable Foundation
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}
