"use client";

import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { invoke } from "@tauri-apps/api/core";
import { debug } from "@tauri-apps/plugin-log";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ONBOARDING_CREATE_WALLET } from "@lib/commands";
import {
  OnboardingCreateWallet,
  STORE_ACTIVE_KEYPAIR,
} from "@lib/crate/generated";
import WalletCreated from "./components/wallet-created";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";
import Confetti from "react-confetti";
import { store } from "@lib/store/store";
import { Suspense } from "react";
import PageChildrenTitleBar from "@lib/components/page-children-title-bar";

// Add State enum
enum State {
  Idle = "Idle",
  Creating = "Creating",
  Created = "Created",
  Error = "Error",
}

function DetailContent() {
  const [searchParams, _] = useSearchParams();
  const isOnboarding = Number(searchParams.get("onboarding"));

  const [mnemonic, setMnemonic] = React.useState("");
  const [pubkey, setPubkey] = React.useState("");
  const [privkey, setPrivkey] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState<State>(State.Idle);
  const router = useNavigate();

  // Handler function for wallet creation
  const createWalletHandler = React.useCallback(
    async (cancelledRef: { current: boolean }) => {
      setState(State.Creating);
      debug("Invoking create_solana_wallet");
      try {
        const result = await invoke<OnboardingCreateWallet>(
          ONBOARDING_CREATE_WALLET,
          {
            account: 0,
          },
        );
        if (!cancelledRef.current) {
          debug(`create_solana_wallet result: ${JSON.stringify(result)}`);
          await store().set(STORE_ACTIVE_KEYPAIR, result.keypair);
          await store().save();
          setMnemonic(result.seed);
          setPubkey(result.keypair.pubkey);
          setPrivkey(result.keypair.privkey);
          setState(State.Created);
        }
      } catch (e) {
        if (!cancelledRef.current) {
          debug(`create_solana_wallet error: ${e?.toString()}`);
          setMnemonic("Error generating wallet");
          setPubkey("");
          setState(State.Error);
        }
      }
    },
    [],
  );
  // Move this handler outside of the render to avoid closure issues
  const handleDialogClose = React.useCallback(async () => {
    await selectionFeedback();
    setOpen(false);
    // Use setTimeout to ensure dialog closes before navigation
    setTimeout(() => {
      if (isOnboarding) {
        router("/wallet/onboarding/create-password");
      } else {
        router("/wallet");
      }
    }, 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

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
      {/* Show confetti when wallet is created */}
      {state === State.Created && <Confetti />}
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
          <CardContent sx={{ p: 4 }}>
            {state === State.Created && (
              <WalletCreated
                mnemonic={mnemonic}
                pubkey={pubkey}
                privkey={privkey}
              />
            )}
            {state === State.Error && (
              <Box
                sx={{
                  textAlign: "center",
                  mb: 3,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "#EF4444",
                    lineHeight: 1.6,
                    bgcolor: "rgba(239, 68, 68, 0.04)",
                    border: "1px solid rgba(239, 68, 68, 0.08)",
                    borderRadius: "12px",
                    p: 3,
                  }}
                >
                  Failed to create wallet. Please try again.
                </Typography>
              </Box>
            )}
          </CardContent>
          <CardActions sx={{ justifyContent: "center", p: 4, pt: 0 }}>
            {(state === State.Idle || state == State.Creating) && (
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
                  background:
                    "linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
                    boxShadow: "0 6px 16px rgba(167, 139, 250, 0.4)",
                  },
                  "&:disabled": {
                    background: "#E5E7EB",
                    color: "#9CA3AF",
                    boxShadow: "none",
                  },
                }}
                onClick={() => {
                  const cancelledRef = { current: false };
                  createWalletHandler(cancelledRef);
                }}
                disabled={state === State.Creating}
              >
                {state === State.Creating ? "Creating..." : "Create my wallet"}
              </Button>
            )}
            {state === State.Created && (
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
                  background:
                    "linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
                    boxShadow: "0 6px 16px rgba(167, 139, 250, 0.4)",
                  },
                }}
                onClick={() => setOpen(true)}
              >
                I have saved my seed phrase
              </Button>
            )}
          </CardActions>
        </Card>
      </Box>
      <Dialog
        open={open}
        onClose={async () => {
          await selectionFeedback();
          setOpen(false);
        }}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            boxShadow: "0 8px 32px rgba(139, 92, 246, 0.12)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "18px",
            fontWeight: 600,
            color: "#1F2937",
            letterSpacing: "-0.02em",
          }}
        >
          Important!
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{
              fontSize: "16px",
              color: "#6B7280",
              lineHeight: 1.6,
            }}
          >
            Your seed phrase is the <strong>only</strong> way to recover your
            wallet. If you lose it, you will lose access to your funds forever.
            Make sure you have securely saved your seed phrase before
            continuing.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={handleDialogClose}
            autoFocus
            fullWidth
            sx={{
              py: 1.5,
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
          >
            I understand
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default function WalletOnboardingCreateWalletPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DetailContent />
    </Suspense>
  );
}
