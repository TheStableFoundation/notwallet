"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";
import PageChildrenTitleBar from "@lib/components/page-children-title-bar";
import { useNavigate } from "react-router-dom";
import { useLang } from "@src/LanguageContext";

export default function WalletOnboardingCreateWalletDisclaimerPage() {
  const router = useNavigate();
  const { t } = useLang();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "linear-gradient(135deg, #FAFBFF 0%, #F8FAFF 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pb: 8,
      }}
    >
      <PageChildrenTitleBar title={t.onboardingCreateWalletTitle} />
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
              {t.onboardingDisclaimerTitle}
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
              {t.onboardingDisclaimerDesc1}
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
              {t.onboardingDisclaimerDesc2}
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
              {t.onboardingDisclaimerDesc3}
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
              {t.onboardingDisclaimerDesc4.split("{red}")[0]}
              <Box
                component="span"
                sx={{
                  color: "#EF4444",
                  fontWeight: 600,
                }}
              >
                {t.onboardingDisclaimerDesc4.split("{red}")[1] || ""}
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
            🔒 {t.onboardingDisclaimerNonCustodial}
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
            router("/wallet/onboarding/create-wallet?onboarding=1");
          }}
        >
          {t.onboardingUnderstandContinue}
        </Button>
      </Box>
    </Box>
  );
}
