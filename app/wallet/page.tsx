"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import LoadingCard from "@/lib/components/loading-card";
import ErrorCard from "@/lib/components/error-card";
import { store } from "@/lib/store/store";
import {
  SolanaWallet,
  STORE_ACTIVE_KEYPAIR,
  STORE_KEYPAIRS,
  STORE_PASSWORD,
} from "@/lib/crate/generated";
import { debug } from "@tauri-apps/plugin-log";
import { useRouter } from "next/navigation";
import { useAppLock } from "@/lib/context/app-lock-context";
import WalletCard from "./_components/wallet-card";
import ActivityCard from "./_components/activity_card";
import { invoke } from "@tauri-apps/api/core";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";
import ActiveKeypairSelectionModal from "./_components/active-keypair-selection";
import { SET_ACTIVE_KEYPAIR } from "@/lib/commands";
import PageTitleBar from "@/lib/components/page-title-bar";
import { redirect } from "next/navigation";

enum State {
  Loading,
  Loaded,
  Error,
}

export default function WalletHome() {
  const { lock } = useAppLock();
  const router = useRouter();
  const [wallet, setWallet] = React.useState<SolanaWallet | undefined>(
    undefined,
  );
  const [state, setState] = React.useState(State.Loading);
  const [showSwitchModal, setShowSwitchModal] = React.useState(false);
  const [allKeypairs, setAllKeypairs] = React.useState<SolanaWallet[]>([]);
  const [shouldOnboardUser, setShouldOnboardUser] = React.useState(false);
  const [hasPassword, setHasPassword] = React.useState(true);

  const init = async () => {
    try {
      // Decide if we should redirect to onboarding
      const keypairs = await store().get<SolanaWallet[]>(STORE_KEYPAIRS);
      if (!keypairs || keypairs.length === 0) {
        setShouldOnboardUser(true);
        return;
      }

      // Check if we should redirect to create password onboarding
      const passwordCheck = await store().get<string>(STORE_PASSWORD);
      if (!passwordCheck) {
        setHasPassword(false);
        return;
      }

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
      setState(State.Loaded);
    } catch {
      setState(State.Error);
    }
  };

  const onSelectWallet = async (wallet: SolanaWallet) => {
    setState(State.Loading);
    try {
      await invoke(SET_ACTIVE_KEYPAIR, { keypair: wallet });
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
    init();
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

  if (shouldOnboardUser) {
    return redirect("/wallet/onboarding");
  }

  if (!hasPassword) {
    return redirect("/wallet/onboarding/create-password");
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
      <PageTitleBar title="Wallet" />
      {state === State.Loading && <LoadingCard />}
      {state === State.Error && <ErrorCard />}
      {state === State.Loaded && wallet && (
        <>
          <Box sx={{ width: "100%", maxWidth: 480 }}>
            <WalletCard
              wallet={wallet}
              onLock={async () => {
                await selectionFeedback();
                lock();
                router.replace("/");
              }}
              onSwitchKeypair={async () => {
                await selectionFeedback();
                setShowSwitchModal(true);
              }}
            />
            <ActivityCard wallet={wallet} />
          </Box>
          <ActiveKeypairSelectionModal
            open={showSwitchModal}
            onClose={() => setShowSwitchModal(false)}
            keypairs={allKeypairs}
            activePubkey={wallet?.pubkey}
            onSelect={onSelectWallet}
          />
        </>
      )}
    </Box>
  );
}
