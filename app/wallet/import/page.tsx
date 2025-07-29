"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import WalletHeader from "@/app/wallet/components/wallet-header";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import { invoke } from "@tauri-apps/api/core";
import { debug } from "@tauri-apps/plugin-log";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";

export default function WalletImportPage() {
  const router = useRouter();
  const [seedPhrase, setSeedPhrase] = React.useState("");
  const [error, setError] = React.useState("");
  const [pubkey, setPubkey] = React.useState<string | null>(null);

  const handleImport = async () => {
    await selectionFeedback();
    const words = seedPhrase.trim().split(/\s+/);
    if (words.length < 12) {
      setError("Seed phrase must be at least 12 words.");
      setPubkey(null);
      return;
    }
    setError("");
    try {
      debug(`Invoking import_solana_wallet with seed: ${seedPhrase}`);
      const result = await invoke<{ pubkey: string }>("import_solana_wallet", {
        mnemonicPhrase: seedPhrase,
      });
      debug(`import_solana_wallet result: ${JSON.stringify(result)}`);
      setPubkey(result.pubkey);
      // Redirect to wallet home after successful import
      router.push("/wallet");
    } catch (e: any) {
      debug(`import_solana_wallet error: ${e?.toString()}`);
      setError(e?.toString() || "Failed to import wallet.");
      setPubkey(null);
    }
  };

  return (
    <Box
      sx={{
        height: "auto",
        bgcolor: "#f5f6fa",
        pb: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
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
        <WalletHeader token={"Import"} />
        <Divider />
        <Box sx={{ mt: 3 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Enter your 12 or 24-word seed phrase below to import your wallet.
          </Typography>
          <TextField
            label="Seed Phrase"
            multiline
            minRows={3}
            fullWidth
            value={seedPhrase}
            onChange={(e) => setSeedPhrase(e.target.value)}
            error={!!error}
            helperText={error || "Words separated by spaces"}
            sx={{ mb: 2 }}
            inputProps={{
              style: { fontFamily: "monospace", fontSize: "1.1rem" },
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
            Make sure no one is watching your screen. Never share your seed
            phrase with anyone.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleImport}
            disabled={!seedPhrase.trim()}
            sx={{ py: 1.2, fontWeight: 600 }}
          >
            Import Wallet
          </Button>
        </Box>
      </Card>
    </Box>
  );
}
