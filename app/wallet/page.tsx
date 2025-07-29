"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LoadingCard from "@/lib/components/loading-card";
import { store } from "../../lib/store/store";
import {
  SolanaWallet,
  STORE_ACTIVE_KEYPAIR,
  STORE_KEYPAIRS,
} from "../../lib/crate/generated";
import { debug } from "@tauri-apps/plugin-log";
import { redirect, useRouter } from "next/navigation";
import { useAppLock } from "../../lib/context/app-lock-context";
import WalletCard from "./components/wallet-card";
import ActivityCard from "./components/activity_card";
import { invoke } from "@tauri-apps/api/core";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";
import ActiveKeypairSelectionModal from "./components/active-keypair-selection";

enum State {
  Loading,
  Loaded,
  Error,
}

export default function WalletHome() {
  // Placeholder data
  const [userName, setUserName] = React.useState<string>("Nowhere Man");
  const { lock } = useAppLock();
  const router = useRouter();
  const [wallet, setWallet] = React.useState<SolanaWallet | undefined>(
    undefined,
  );
  const [state, setState] = React.useState(State.Loading);
  const [showSwitchModal, setShowSwitchModal] = React.useState(false);
  const [allKeypairs, setAllKeypairs] = React.useState<SolanaWallet[]>([]);

  const loadWallet = async () => {
    try {
      const keypairs = await store().get<SolanaWallet[]>(STORE_KEYPAIRS);
      let walletActive: SolanaWallet | undefined;
      walletActive = await store().get<SolanaWallet>(STORE_ACTIVE_KEYPAIR);
      let wallet: SolanaWallet | undefined = walletActive;
      if (!wallet && Array.isArray(keypairs) && keypairs.length > 0) {
        wallet = keypairs[0];
        // Set the first wallet as active if none is active
        await invoke("set_active_keypair", { keypair: wallet });
      }
      debug(`wallet: ${wallet?.pubkey}`);
      setWallet(wallet);
      // Load username
      const username = await store().get<string>("username");
      if (username !== undefined) {
        setUserName(username);
      }
      setState(State.Loaded);
    } catch {
      setState(State.Error);
    }
  };

  const onSelectWallet = async (wallet: SolanaWallet) => {
    setState(State.Loading);
    try {
      await invoke("set_active_keypair", { keypair: wallet });
      setTimeout(() => {
        setWallet(wallet);
        setState(State.Loaded);
      }, 500); // 2 seconds delay
    } catch (e) {
      // Optionally handle error
      setState(State.Error);
    }
  };

  React.useEffect(() => {
    loadWallet();
  }, []);

  // Fetch all keypairs for switch modal
  React.useEffect(() => {
    async function fetchKeypairs() {
      try {
        const keypairs = await store().get<SolanaWallet[]>(STORE_KEYPAIRS);
        setAllKeypairs(keypairs || []);
      } catch {
        setAllKeypairs([]);
      }
    }
    fetchKeypairs();
  }, []);

  // Add onDeposit function
  const onDeposit = React.useCallback(async () => {
    await selectionFeedback();
    router.push("/deposit");
  }, [router]);

  if (state === State.Loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#f5f6fa",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LoadingCard />
      </Box>
    );
  }

  if (state === State.Error) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#f5f6fa",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ color: "red" }}>Failed to load wallet.</span>
      </Box>
    );
  }

  if (!wallet) {
    lock();
    return redirect("/");
  }

  return (
    <Box
      sx={{
        minHeight: "unset",
        height: "auto",
        bgcolor: "#f5f6fa",
        pb: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 480 }}>
        <Typography
          variant="h5"
          component="h1"
          fontWeight="bold"
          align="center"
          sx={{ mb: 2 }}
        >
          Wallet
        </Typography>
      </Box>
      <Box sx={{ width: "100%", maxWidth: 480 }}>
        <WalletCard
          userName={userName}
          wallet={wallet}
          onLock={async () => {
            await selectionFeedback();
            lock();
            router.replace("/");
          }}
          onDeposit={onDeposit}
          onSwitchKeypair={async () => {
            await selectionFeedback();
            setShowSwitchModal(true);
          }}
        />
        <ActivityCard />
      </Box>
      <ActiveKeypairSelectionModal
        open={showSwitchModal}
        onClose={() => setShowSwitchModal(false)}
        keypairs={allKeypairs}
        activePubkey={wallet?.pubkey}
        onSelect={onSelectWallet}
      />
    </Box>
  );
}
