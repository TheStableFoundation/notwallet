"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { invoke } from "@tauri-apps/api/core";
import { debug } from "@tauri-apps/plugin-log";
import { useRouter } from "next/navigation";
import { SolanaWallet } from "../../../lib/crate/generated";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";
import PageChildrenTitleBar from "@/lib/components/page-children-title-bar";

export default function ImportWalletPage() {
  const [seed, setSeed] = React.useState("");
  const [error, setError] = React.useState("");
  const [pubkey, setPubkey] = React.useState<string | null>(null);
  const router = useRouter();

  const handleImport = async () => {
    if (seed.trim().split(/\s+/).length < 12) {
      setError("Seed phrase must be at least 12 words.");
      setPubkey(null);
      return;
    }
    setError("");
    try {
      debug(`Invoking import_solana_wallet with seed: ${seed}`);
      const result = await invoke<SolanaWallet>("import_solana_wallet", {
        mnemonicPhrase: seed,
      });
      debug(`import_solana_wallet result: ${JSON.stringify(result)}`);
      setPubkey(result.pubkey);
      // Redirect to import-keypairs page after successful import, passing wallet in state
      router.replace("/wallet/onboarding/import-keypairs");
    } catch (e: any) {
      debug(`import_solana_wallet error: ${e?.toString()}`);
      setError(e?.toString() || "Failed to import wallet.");
      setPubkey(null);
    }
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
        pb: 8,
      }}
    >
      <PageChildrenTitleBar title="Import Wallet" />
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
          Enter your 12 or 24-word seed phrase below to import your wallet.
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
              Seed Phrase
            </Typography>
            <TextField
              label="Enter your seed phrase"
              multiline
              minRows={4}
              maxRows={6}
              fullWidth
              placeholder="Enter your 12 or 24 word seed phrase"
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              error={!!error}
              helperText={error || "Words separated by spaces"}
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
                  Import Successful!
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
            🔒 Make sure no one is watching your screen. Never share your seed
            phrase with anyone.
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
          Import Wallet
        </Button>
      </Box>
    </Box>
  );
}
