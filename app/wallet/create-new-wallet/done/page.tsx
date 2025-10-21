"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Confetti from "react-confetti";
import Card from "@mui/material/Card";
import PageChildrenTitleBar from "@app/lib/components/page-children-title-bar";
import { useNavigate, useSearchParams } from "react-router-dom";

// Move the main content to a separate component
function DoneContent() {
  const [searchParams] = useSearchParams();
  const pubkey = searchParams.get("pubkey");
  const router = useNavigate();
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    function update() {
      setDimensions({
        width: typeof window !== "undefined" ? window.innerWidth : 0,
        height: typeof window !== "undefined" ? window.innerHeight : 0,
      });
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "linear-gradient(135deg, #FAFBFF 0%, #F8FAFF 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        pb: 8,
      }}
    >
      <Confetti width={dimensions.width} height={dimensions.height} />
      <PageChildrenTitleBar title="Wallet Created" />
      <Box sx={{ width: "100%", maxWidth: 420, px: 2 }}>
        <Card
          sx={{
            width: "100%",
            borderRadius: "20px",
            boxShadow: "0 4px 20px rgba(139, 92, 246, 0.08)",
            border: "1px solid rgba(139, 92, 246, 0.06)",
            overflow: "hidden",
            bgcolor: "#FFFFFF",
            textAlign: "center",
            p: 4,
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              mb: 3,
              color: "#8B5CF6",
              fontSize: "24px",
              letterSpacing: "-0.02em",
            }}
          >
            🎉 New Address Created!
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              mb: 3,
              fontSize: "16px",
              color: "#6B7280",
              fontWeight: 500,
            }}
          >
            Your new public key:
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: "monospace",
              fontSize: "14px",
              wordBreak: "break-all",
              bgcolor: "rgba(139, 92, 246, 0.04)",
              border: "1px solid rgba(139, 92, 246, 0.08)",
              borderRadius: "12px",
              p: 3,
              mb: 4,
              color: "#1F2937",
              lineHeight: 1.6,
            }}
          >
            {pubkey}
          </Typography>
          <Button
            variant="contained"
            fullWidth
            sx={{
              py: 1.75,
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: 600,
              textTransform: "none",
              boxShadow: "0 4px 12px rgba(139, 92, 246, 0.3)",
              background: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
                boxShadow: "0 6px 16px rgba(139, 92, 246, 0.4)",
              },
            }}
            onClick={() => router("/wallet")}
          >
            Go to Wallet
          </Button>
        </Card>
      </Box>
    </Box>
  );
}

export default function WalletCreateNewWalletDonePage() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <DoneContent />
    </React.Suspense>
  );
}
