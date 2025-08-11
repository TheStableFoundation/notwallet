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
import { useRouter, useSearchParams } from "next/navigation";
import { ONBOARDING_CREATE_WALLET } from "@/lib/commands";
import {
  OnboardingCreateWallet,
  STORE_ACTIVE_KEYPAIR,
} from "@/lib/crate/generated";
import WalletCreated from "./components/wallet-created";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";
import Confetti from "react-confetti";
import { store } from "@/lib/store/store";
import { Suspense } from "react";

// Add State enum
enum State {
  Idle = "Idle",
  Creating = "Creating",
  Created = "Created",
  Error = "Error",
}

function DetailContent() {
  const searchParams = useSearchParams();
  const isOnboarding = Number(searchParams.get("onboarding"));

  const [mnemonic, setMnemonic] = React.useState("");
  const [pubkey, setPubkey] = React.useState("");
  const [privkey, setPrivkey] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState<State>(State.Idle);
  const router = useRouter();

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
        router.replace("/onboarding/create-password");
      } else {
        router.replace("/wallet");
      }
    }, 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        bgcolor: "#f5f6fa",
      }}
    >
      {/* Show confetti when wallet is created */}
      {state === State.Created && <Confetti />}
      <Card sx={{ maxWidth: 480, width: "100%", boxShadow: 3 }}>
        <CardContent>
          <Typography
            variant="h4"
            component="h1"
            align="center"
            fontWeight="bold"
            gutterBottom
          >
            Create Wallet
          </Typography>
          {state === State.Created && (
            <WalletCreated
              mnemonic={mnemonic}
              pubkey={pubkey}
              privkey={privkey}
            />
          )}
          {state === State.Error && (
            <Typography color="error" align="center" sx={{ mb: 2 }}>
              Failed to create wallet. Please try again.
            </Typography>
          )}
        </CardContent>
        <CardActions sx={{ justifyContent: "center", pb: 2 }}>
          {(state === State.Idle || state == State.Creating) && (
            <Button
              variant="contained"
              color="primary"
              size="large"
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
              color="primary"
              size="large"
              onClick={() => setOpen(true)}
            >
              I have saved my seed phrase
            </Button>
          )}
        </CardActions>
      </Card>
      <Dialog
        open={open}
        onClose={async () => {
          await selectionFeedback();
          setOpen(false);
        }}
      >
        <DialogTitle>Important!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your seed phrase is the <b>only</b> way to recover your wallet. If
            you lose it, you will lose access to your funds forever. Make sure
            you have securely saved your seed phrase before continuing.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary" autoFocus>
            I understand
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DetailContent />
    </Suspense>
  );
}
