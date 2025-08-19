"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";
import PageChildrenTitleBar from "@/lib/components/page-children-title-bar";

export default function CreateWalletDisclaimerPage() {
  const router = useRouter();

  return (
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
      <PageChildrenTitleBar title="Create Wallet" />
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
          <Box sx={{ p: 4 }}>
            <Typography
              variant="h5"
              sx={{
                fontSize: "20px",
                fontWeight: 600,
                color: "#1F2937",
                mb: 3,
                textAlign: "center",
                letterSpacing: "-0.02em",
              }}
            >
              Important Disclaimer
            </Typography>
            <Typography
              sx={{
                fontSize: "16px",
                color: "#1F2937",
                lineHeight: 1.6,
                textAlign: "center",
                mb: 1,
              }}
            >
              You are about to create a self-custody wallet.
            </Typography>
            <Typography
              sx={{
                fontSize: "16px",
                color: "#1F2937",
                fontWeight: 600,
                lineHeight: 1.6,
                textAlign: "center",
                mb: 1,
              }}
            >
              You are the only one who controls your wallet and funds.
            </Typography>
            <Typography
              sx={{
                fontSize: "16px",
                color: "#1F2937",
                fontWeight: 600,
                lineHeight: 1.6,
                textAlign: "center",
                mb: 1,
              }}
            >
              Your seed phrase is the ONLY way to recover your wallet and
              assets.
            </Typography>
            <Typography
              sx={{
                fontSize: "16px",
                color: "#1F2937",
                lineHeight: 1.6,
                textAlign: "center",
                mb: 3,
              }}
            >
              If you lose your seed phrase,{" "}
              <Box
                component="span"
                sx={{
                  color: "#EF4444",
                  fontWeight: 600,
                }}
              >
                your funds cannot be recovered.
              </Box>
            </Typography>
          </Box>
        </Card>

        <Box
          sx={{
            textAlign: "center",
            mt: 3,
            mb: 3,
          }}
        >
          <Typography
            sx={{
              fontSize: "14px",
              color: "#6B7280",
              lineHeight: 1.6,
              bgcolor: "rgba(239, 68, 68, 0.04)",
              border: "1px solid rgba(239, 68, 68, 0.08)",
              borderRadius: "12px",
              p: 3,
            }}
          >
            🔒 This is a non-custodial wallet. Only you have access to your
            private keys and funds.
          </Typography>
        </Box>

        <Button
          variant="contained"
          fullWidth
          sx={{
            py: 1.75,
            borderRadius: "12px",
            fontSize: "16px",
            fontWeight: 600,
            textTransform: "none",
            boxShadow: "0 4px 12px rgba(167, 139, 250, 0.3)",
            background: "linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
              boxShadow: "0 6px 16px rgba(167, 139, 250, 0.4)",
            },
          }}
          onClick={async () => {
            await selectionFeedback();
            router.push("/wallet/onboarding/create-wallet?onboarding=1");
          }}
        >
          I Understand, Continue
        </Button>
      </Box>
    </Box>
  );
}
