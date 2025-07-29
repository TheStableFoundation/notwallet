"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { SolanaWallet, STORE_KEYPAIRS } from "../../../lib/crate/generated";
import { invoke } from "@tauri-apps/api/core";
import { store } from "../../../lib/store/store";
import { error } from "@tauri-apps/plugin-log";
import { useRouter } from "next/navigation";
import { DERIVE_NEW_KEYPAIR } from "../../../lib/commands";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";
import CircularProgress from "@mui/material/CircularProgress";

export default function ImportKeypairsPage() {
  const [keypairs, setKeypairs] = React.useState<SolanaWallet[]>([]);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

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
          bgcolor: "#f5f6fa",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: "#f5f6fa",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        height: "60vh",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 480,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
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
            onClick={() => router.push("/onboarding/import-wallet")}
          >
            Back
          </Button>
          <Typography
            variant="body1"
            fontWeight="bold"
            sx={{ ml: 2, flex: 1, textAlign: "right" }}
          >
            Imported Keypairs
          </Typography>
        </Box>
        <Card sx={{ maxWidth: 480, width: "100%", boxShadow: 3 }}>
          <CardContent>
            {/* Remove the title here, as it's now in the header */}
            <List>
              {keypairs.length === 0 && (
                <ListItem>
                  <ListItemText primary="No keypairs found." />
                </ListItem>
              )}
              {keypairs.map((wallet) => (
                <ListItem key={wallet.pubkey} divider>
                  <ListItemText
                    primary={`Account ${wallet.account}`}
                    secondary={
                      <span style={{ fontFamily: "monospace" }}>
                        {wallet.pubkey.length > 6
                          ? `${wallet.pubkey.slice(
                              0,
                              3,
                            )}...${wallet.pubkey.slice(-3)}`
                          : wallet.pubkey}
                      </span>
                    }
                  />
                </ListItem>
              ))}
            </List>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleGenerateNew}
              disabled={keypairs.length >= 5}
            >
              Generate New Address
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              sx={{
                mt: 2,
                color: "#AD5AD7",
                borderColor: "#AD5AD7",
                "&:hover": { background: "#F5F6FA", borderColor: "#C792EA" },
              }}
              onClick={async () => {
                await selectionFeedback();
                router.replace("/onboarding/create-password");
              }}
            >
              Continue
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
