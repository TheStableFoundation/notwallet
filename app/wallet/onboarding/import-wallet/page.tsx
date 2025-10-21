"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { invoke } from "@tauri-apps/api/core";
import { debug } from "@tauri-apps/plugin-log";
import { SolanaWallet } from "@app/lib/crate/generated";
import { IMPORT_SOLANA_WALLET } from "@app/lib/commands";
import PageChildrenTitleBar from "@app/lib/components/page-children-title-bar";
import { useNavigate } from "react-router-dom";
import { useLang } from "@src/LanguageContext";

export default function WalletOnboardingImportWalletPage() {
  const [seed, setSeed] = React.useState("");
  const [error, setError] = React.useState("");
  const [pubkey, setPubkey] = React.useState<string | null>(null);
  const router = useNavigate();
  const { t } = useLang();

  const handleImport = async () => {
    if (seed.trim().split(/\s+/).length < 12) {
      setError(t.onboardingPasswordMinLength);
      setPubkey(null);
      return;
    }
    setError("");
    try {
      debug(`Invoking import_solana_wallet with seed: ${seed}`);
      const result = await invoke<SolanaWallet>(IMPORT_SOLANA_WALLET, {
        mnemonicPhrase: seed,
      });
      debug(`import_solana_wallet result: ${JSON.stringify(result)}`);
      setPubkey(result.pubkey);
      // Redirect to import-keypairs page after successful import, passing wallet in state
      router("/wallet/onboarding/import-keypairs");
    } catch (e: any) {
      debug(`import_solana_wallet error: ${e?.toString()}`);
      setError(e?.toString() || t.errorOccurred);
      setPubkey(null);
    }
  };

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
      <PageChildrenTitleBar title={t.onboardingImportWalletTitle} />
      <Box sx={{ width: "100%", maxWidth: 420, px: 2 }}>
        <Typography
          sx={{
            fontSize: "16px",
            color: "#6B7280",
            mb: 3,
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          {t.onboardingImportSeedPhraseDesc}
        </Typography>

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
          <Box sx={{ p: 3 }}>
            <Typography
              variant="h6"
              sx={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#1F2937",
                mb: 3,
                letterSpacing: "-0.02em",
              }}
            >
              {t.onboardingImportWalletButton}
            </Typography>
            <TextField
              label={t.onboardingImportWalletButton}
              multiline
              minRows={4}
              maxRows={6}
              fullWidth
              placeholder={t.onboardingImportSeedPhraseDesc}
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              error={!!error}
              helperText={error || t.onboardingImportWalletButton}
              inputProps={{
                style: {
                  fontFamily: "monospace",
                  fontSize: "14px",
                  lineHeight: 1.6,
                  color: "#1F2937",
                },
              }}
            />
            {pubkey && (
              <Box
                sx={{
                  mb: 3,
                  p: 3,
                  bgcolor: "rgba(34, 197, 94, 0.04)",
                  border: "1px solid rgba(34, 197, 94, 0.08)",
                  borderRadius: "12px",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "#059669",
                    fontWeight: 500,
                    mb: 1,
                  }}
                >
                  {t.onboardingImportSuccess}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "#6B7280",
                    mb: 1,
                  }}
                >
                  Public Key:
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "monospace",
                    fontSize: "12px",
                    wordBreak: "break-all",
                    color: "#1F2937",
                    bgcolor: "rgba(34, 197, 94, 0.08)",
                    borderRadius: "8px",
                    p: 2,
                  }}
                >
                  {pubkey}
                </Typography>
              </Box>
            )}
          </Box>
        </Card>

        <Box
          sx={{
            textAlign: "center",
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
            🔒 {t.onboardingImportWarning}
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
            "&:disabled": {
              background: "#E5E7EB",
              color: "#9CA3AF",
              boxShadow: "none",
            },
          }}
          onClick={handleImport}
          disabled={seed.trim().length === 0}
        >
          {t.onboardingImportWalletButton}
        </Button>
      </Box>
    </Box>
  );
}
