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
import { SolanaWallet } from "@/lib/crate/generated";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";

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
      router.replace("/import/import-keypairs");
    } catch (e: any) {
      debug(`import_solana_wallet error: ${e?.toString()}`);
      setError(e?.toString() || "Failed to import wallet.");
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
              router.push("/");
            }}
          >
            Back
          </Button>
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            sx={{ ml: 2, flex: 1, textAlign: "right" }}
          >
            Import Wallet
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
              Enter your seed phrase:
            </Typography>
            <TextField
              multiline
              minRows={3}
              maxRows={6}
              fullWidth
              placeholder="Enter your 12 or 24 word seed phrase"
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              error={!!error}
              helperText={error}
              sx={{ mb: 2, bgcolor: "#f3f4f6", borderRadius: 2 }}
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
          </CardContent>
          <CardActions sx={{ justifyContent: "center", pb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleImport}
              disabled={seed.trim().length === 0}
            >
              Import Wallet
            </Button>
          </CardActions>
        </Card>
        {/* <BottomTabBar /> */}
      </Box>
    </Box>
  );
}
