"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import LoadingCard from "@lib/components/loading-card";
import ErrorCard from "@lib/components/error-card";
import { store } from "@lib/store/store";
import {
  SolanaWallet,
  STORE_ACTIVE_KEYPAIR,
  STORE_KEYPAIRS,
  STORE_PASSWORD,
} from "@lib/crate/generated";
import { debug } from "@tauri-apps/plugin-log";
import { useAppLock } from "@lib/context/app-lock-context";
import WalletCard from "./_components/wallet-card";
import ActivityCard from "./_components/activity_card";
import { invoke } from "@tauri-apps/api/core";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";
import ActiveKeypairSelectionModal from "./_components/active-keypair-selection";
import { SET_ACTIVE_KEYPAIR } from "@lib/commands";
import PageTitleBar from "@lib/components/page-title-bar";
import { useI18n } from "@lib/i18n/provider";
import { useNavigate } from "react-router-dom";

enum State {
  Loading,
  Loaded,
  Error,
}

export default function WalletHome() {
  const { lock } = useAppLock();
  const router = useNavigate();
  const { t } = useI18n();
  const [wallet, setWallet] = React.useState<SolanaWallet | undefined>(
    undefined,
  );
  const [state, setState] = React.useState(State.Loading);
  const [showSwitchModal, setShowSwitchModal] = React.useState(false);
  const [allKeypairs, setAllKeypairs] = React.useState<SolanaWallet[]>([]);

  const init = async () => {
    try {
      // Decide if we should redirect to onboarding
      const keypairs = await store().get<SolanaWallet[]>(STORE_KEYPAIRS);
      if (!keypairs || keypairs.length === 0) {
        router("/wallet/onboarding");
        return;
      }

      // Check if we should redirect to create password onboarding
      const passwordCheck = await store().get<string>(STORE_PASSWORD);
      if (!passwordCheck) {
        router("/wallet/onboarding/create-password");
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

  return (
    <Box
      sx={{
        minHeight: "unset",
        height: "auto",
        pb: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <PageTitleBar title={t("wallet.title")} />
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
                router("/");
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
