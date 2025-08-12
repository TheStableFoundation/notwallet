"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import GitHubIcon from "@mui/icons-material/GitHub";
import LanguageIcon from "@mui/icons-material/Language";
import ForumIcon from "@mui/icons-material/Forum";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";
import { openUrl } from "@tauri-apps/plugin-opener";
import PageChildrenTitleBar from "@/lib/components/page-children-title-bar";

const links = [
  {
    title: "GitHub",
    icon: <GitHubIcon />,
    url: "https://github.com/TheStableFoundation",
  },
  {
    title: "Discord",
    icon: <ForumIcon />,
    url: "https://discord.gg/TaqewTFBmb",
  },
  {
    title: "X",
    icon: <LanguageIcon />,
    url: "https://x.com/STBLfoundation",
  },
  {
    title: "Website",
    icon: <LanguageIcon />,
    url: "https://bach.money",
  },
  {
    title: "Telegram",
    icon: <ForumIcon />,
    url: "https://t.me/thestablefoundation",
  },
];

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

            {/* Social Links */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {links.map((link, index) => (
                <Button
                  key={index}
                  onClick={() => handleExternal(link.url)}
                  sx={{
                    minWidth: 48,
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    p: 0,
                    bgcolor: "#FFFFFF",
                    border: "2px solid #E5E7EB",
                    boxShadow: "0 2px 8px rgba(139, 92, 246, 0.1)",
                    color: "#6B7280",
                    "&:hover": {
                      bgcolor: "#8B5CF6",
                      borderColor: "#8B5CF6",
                      color: "#FFFFFF",
                      boxShadow: "0 4px 12px rgba(139, 92, 246, 0.3)",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.2s ease-in-out",
                  }}
                  aria-label={link.title}
                >
                  {link.icon}
                </Button>
              ))}
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
