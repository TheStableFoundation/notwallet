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
import { useNavigate } from "react-router-dom";
import { SolanaWallet } from "@app/lib/crate/generated";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";
import { useLang } from "@src/LanguageContext";

export default function WalletOnboardingImportPage() {
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
      const result = await invoke<SolanaWallet>("import_solana_wallet", {
        mnemonicPhrase: seed,
      });
      debug(`import_solana_wallet result: ${JSON.stringify(result)}`);
      setPubkey(result.pubkey);
      // Redirect to import-keypairs page after successful import, passing wallet in state
      router("/import/import-keypairs");
    } catch (e: any) {
      debug(`import_solana_wallet error: ${e?.toString()}`);
      setError(e?.toString() || t.errorOccurred);
      setPubkey(null);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "60vh",
        bgcolor: "#f5f6fa",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "auto",
          width: "100%",
          maxWidth: 480,
        }}
      >
        <Box
          sx={{
            width: "100%",
            mb: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Button
            startIcon={<ArrowBackIcon />}
            variant="text"
            color="primary"
            sx={{ mb: 0 }}
            onClick={async () => {
              await selectionFeedback();
              router("/");
            }}
          >
            {t.back}
          </Button>
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            sx={{ ml: 2, flex: 1, textAlign: "right" }}
          >
            {t.onboardingImportWalletTitle}
          </Typography>
        </Box>
        <Card sx={{ maxWidth: 480, width: "100%", boxShadow: 3 }}>
          <CardContent>
            <Typography
              variant="subtitle1"
              align="center"
              fontWeight="medium"
              sx={{ mb: 2 }}
            >
              {t.onboardingImportSeedPhraseDesc}
            </Typography>
            <TextField
              multiline
              minRows={3}
              maxRows={6}
              fullWidth
              placeholder={t.onboardingImportSeedPhraseDesc}
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              error={!!error}
              helperText={error}
              sx={{ mb: 2, bgcolor: "#f3f4f6", borderRadius: 2 }}
              inputProps={{
                style: { fontFamily: "monospace" },
              }}
            />
            {pubkey && (
              <Typography
                variant="body2"
                color="text.secondary"
                align="center"
                sx={{ mb: 1 }}
              >
                Public Key:{" "}
                <span style={{ fontFamily: "monospace" }}>{pubkey}</span>
              </Typography>
            )}
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ mb: 1 }}
            >
              {t.onboardingImportWarning}
            </Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: "center", pb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleImport}
              disabled={seed.trim().length === 0}
            >
              {t.onboardingImportWalletButton}
            </Button>
          </CardActions>
        </Card>
      </Box>
    </Box>
  );
}
