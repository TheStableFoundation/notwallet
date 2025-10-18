"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { SolanaWallet, STORE_KEYPAIRS } from "@lib/crate/generated";
import { invoke } from "@tauri-apps/api/core";
import { store } from "@lib/store/store";
import { error } from "@tauri-apps/plugin-log";
import { DERIVE_NEW_KEYPAIR } from "@lib/commands";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";
import CircularProgress from "@mui/material/CircularProgress";
import PageChildrenTitleBar from "@lib/components/page-children-title-bar";
import { useNavigate } from "react-router-dom";
import { useLang } from "@src/LanguageContext";

export default function WalletOnboardingImportKeypairsPage() {
  const [keypairs, setKeypairs] = React.useState<SolanaWallet[]>([]);
  const [loading, setLoading] = React.useState(true);
  const router = useNavigate();
  const { t } = useLang();

  // Fetch keypairs from store on mount
  React.useEffect(() => {
    async function fetchKeypairs() {
      try {
        const storeInstance = store();
        const result = await storeInstance.get<SolanaWallet[]>(STORE_KEYPAIRS);
        // Only show keypair(s) with account === 0
        setKeypairs(
          (result || []).filter((kp: SolanaWallet) => kp.account === 0),
        );
      } catch {
        setKeypairs([]);
      }
      setLoading(false);
    }
    fetchKeypairs();
  }, []);

  const handleGenerateNew = async () => {
    await selectionFeedback();
    // Only allow up to 5 keypairs
    if (keypairs.length >= 5) return;
    try {
      const seedUuid = keypairs[0]?.seed_id;
      if (!seedUuid) {
        error("No seed UUID found in keypairs.");
        return;
      }
      const newWallet = await invoke<SolanaWallet>(DERIVE_NEW_KEYPAIR, {
        seedUuid,
        account: keypairs.length,
      });
      setKeypairs([...keypairs, newWallet]);
    } catch (e) {
      error(`${e}`);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "linear-gradient(135deg, #FAFBFF 0%, #F8FAFF 100%)",
          background: "linear-gradient(135deg, #FAFBFF 0%, #F8FAFF 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress sx={{ color: "#A78BFA" }} />
      </Box>
    );
  }

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
      <PageChildrenTitleBar title={t.onboardingKeypairsTitle} />
      <Box sx={{ width: "100%", maxWidth: 420, px: 2 }}>
        <Card
          sx={{
            width: "100%",
            borderRadius: "20px",
            boxShadow: "0 4px 20px rgba(139, 92, 246, 0.08)",
            border: "1px solid rgba(139, 92, 246, 0.06)",
            mb: 3,
            overflow: "hidden",
            bgcolor: "#FFFFFF",
          }}
        >
          <Box sx={{ p: 3, pb: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#1F2937",
                mb: 1,
                letterSpacing: "-0.02em",
              }}
            >
              {t.onboardingKeypairsTitle}
            </Typography>
          </Box>
          <List sx={{ p: 0, pb: 1 }}>
            {keypairs.length === 0 && (
              <ListItem
                sx={{
                  px: 0,
                  py: 2,
                  borderRadius: "12px",
                  mx: 2,
                  mb: 1,
                }}
              >
                <ListItemText
                  primary={t.onboardingNoKeypairs}
                  primaryTypographyProps={{
                    sx: {
                      fontSize: "16px",
                      fontWeight: 500,
                      color: "#6B7280",
                      textAlign: "center",
                    },
                  }}
                />
              </ListItem>
            )}
            {keypairs.map((wallet, index) => (
              <React.Fragment key={wallet.pubkey}>
                <ListItem
                  sx={{
                    px: 0,
                    py: 2,
                    borderRadius: "12px",
                    mx: 2,
                    mb: 1,
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      bgcolor: "rgba(139, 92, 246, 0.04)",
                      transform: "scale(1.01)",
                    },
                  }}
                >
                  <Box sx={{ ml: 2, flex: 1 }}>
                    <ListItemText
                      primary={`Account ${wallet.account}`}
                      secondary={
                        wallet.pubkey.length > 6
                          ? `${wallet.pubkey.slice(0, 6)}...${wallet.pubkey.slice(-6)}`
                          : wallet.pubkey
                      }
                      primaryTypographyProps={{
                        sx: {
                          fontSize: "16px",
                          fontWeight: 500,
                          color: "#1F2937",
                          letterSpacing: "-0.01em",
                          mb: 0.25,
                        },
                      }}
                      secondaryTypographyProps={{
                        sx: {
                          fontSize: "14px",
                          color: "#6B7280",
                          fontFamily: "monospace",
                        },
                      }}
                    />
                  </Box>
                </ListItem>
                {index < keypairs.length - 1 && (
                  <Box
                    sx={{
                      height: "1px",
                      bgcolor: "rgba(139, 92, 246, 0.08)",
                      mx: 6,
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </List>
        </Card>

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
            "&:disabled": {
              background: "#E5E7EB",
              color: "#9CA3AF",
              boxShadow: "none",
            },
            mb: 2,
          }}
          onClick={handleGenerateNew}
          disabled={keypairs.length >= 5}
        >
          {t.onboardingGenerateNewAddress}
        </Button>
        <Button
          variant="outlined"
          fullWidth
          sx={{
            py: 1.75,
            borderRadius: "12px",
            fontSize: "16px",
            fontWeight: 600,
            textTransform: "none",
            borderColor: "#A78BFA",
            color: "#A78BFA",
            "&:hover": {
              background: "rgba(167, 139, 250, 0.04)",
              borderColor: "#8B5CF6",
              color: "#8B5CF6",
            },
          }}
          onClick={async () => {
            await selectionFeedback();
            router("/wallet/onboarding/create-password");
          }}
        >
          {t.onboardingContinue}
        </Button>
      </Box>
    </Box>
  );
}
