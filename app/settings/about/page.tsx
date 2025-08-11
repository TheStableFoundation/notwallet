"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import GitHubIcon from "@mui/icons-material/GitHub";
import LanguageIcon from "@mui/icons-material/Language";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";
import { openUrl } from "@tauri-apps/plugin-opener";
import PageChildrenTitleBar from "@/lib/components/page-children-title-bar";

export default function AboutPage() {
  const handleExternal = async (url: string) => {
    await selectionFeedback();
    await openUrl(url);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "linear-gradient(135deg, #FAFBFF 0%, #F8FAFF 100%)",
        background: "linear-gradient(135deg, #FAFBFF 0%, #F8FAFF 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 4,
      }}
    >
      <PageChildrenTitleBar title="About" />
      <Box sx={{ width: "100%", maxWidth: 420, px: 2 }}>
        <Card
          sx={{
            width: "100%",
            borderRadius: "20px",
            boxShadow: "0 4px 20px rgba(139, 92, 246, 0.08)",
            border: "1px solid rgba(139, 92, 246, 0.06)",
            overflow: "hidden",
            bgcolor: "#FFFFFF",
          }}
        >
          {/* App Icon & Name */}
          <Box
            sx={{
              textAlign: "center",
              pt: 6,
              pb: 4,
              px: 4,
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "20px",
                mx: "auto",
                mb: 3,
                boxShadow: "0 8px 32px rgba(139, 92, 246, 0.3)",
                overflow: "hidden",
              }}
            >
              <img
                src="/images/app-icon-v2.png"
                alt="NotWallet App Icon"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>
            <Typography
              variant="h5"
              sx={{
                fontSize: "24px",
                fontWeight: 700,
                color: "#1F2937",
                mb: 1,
                letterSpacing: "-0.02em",
              }}
            >
              NotWallet
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                fontSize: "16px",
                fontWeight: 500,
                color: "#8B5CF6",
                mb: 3,
              }}
            >
              A Crypto Dollar Wallet
            </Typography>
          </Box>

          <Divider sx={{ borderColor: "rgba(139, 92, 246, 0.08)" }} />

          {/* Description */}
          <Box sx={{ p: 4 }}>
            <Typography
              variant="body1"
              sx={{
                fontSize: "16px",
                lineHeight: 1.6,
                color: "#4B5563",
                mb: 3,
                textAlign: "center",
              }}
            >
              A modern, community-owned, non-custodial open-source Solana wallet
              app built for privacy, simplicity, and security.
            </Typography>

            <Typography
              variant="body2"
              sx={{
                fontSize: "14px",
                color: "#6B7280",
                textAlign: "center",
                mb: 4,
              }}
            >
              Developed and maintained by The Stable Foundation.
            </Typography>

            {/* Action Buttons */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Button
                variant="contained"
                startIcon={<LanguageIcon />}
                onClick={() => handleExternal("https://bach.money")}
                sx={{
                  px: 3,
                  py: 1.5,
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "15px",
                  bgcolor: "#8B5CF6",
                  boxShadow: "0 4px 16px rgba(139, 92, 246, 0.3)",
                  "&:hover": {
                    bgcolor: "#7C3AED",
                    boxShadow: "0 6px 20px rgba(139, 92, 246, 0.4)",
                  },
                }}
              >
                Website
              </Button>
              <Button
                variant="outlined"
                startIcon={<GitHubIcon />}
                onClick={() =>
                  handleExternal("https://github.com/TheStableFoundation/not")
                }
                sx={{
                  px: 3,
                  py: 1.5,
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "15px",
                  color: "#8B5CF6",
                  borderColor: "#8B5CF6",
                  "&:hover": {
                    bgcolor: "rgba(139, 92, 246, 0.08)",
                    borderColor: "#7C3AED",
                  },
                }}
              >
                GitHub
              </Button>
            </Box>
          </Box>

          <Divider sx={{ borderColor: "rgba(139, 92, 246, 0.08)" }} />

          {/* Footer */}
          <Box
            sx={{
              p: 3,
              textAlign: "center",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontSize: "12px",
                color: "#9CA3AF",
                fontWeight: 500,
              }}
            >
              © {new Date().getFullYear()} The Stable Foundation
            </Typography>
          </Box>
        </Card>
      </Box>
    </Box>
  );
}
