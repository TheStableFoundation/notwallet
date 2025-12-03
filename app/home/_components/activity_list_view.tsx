"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import OnboardingCard from "./onboarding_card";
import { CHECK_PUBKEY } from "@app/lib/commands";
import {
  SolanaWallet,
  CheckPubkeyResponse,
  STORE_ACTIVE_KEYPAIR,
} from "@app/lib/crate/generated";
import { store } from "@app/lib/store/store";
import { openUrl } from "@tauri-apps/plugin-opener";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";
import { debug, error, error as logError } from "@tauri-apps/plugin-log";
import { useLang } from "../../../src/LanguageContext";
import { useAirdropEnvironment } from "@app/lib/context/app-environment-context";
import {
  OauthRedirect,
  TokenResponse,
  useAccount,
} from "@app/lib/context/account-context";
import haptics from "@app/lib/utils/haptics";
import { listen } from "@tauri-apps/api/event";

enum ActivityState {
  Loading,
  Loaded,
  LoadingMore,
  Error,
}

export default function ActivityListView() {
  const { t } = useLang();
  const { environment } = useAirdropEnvironment();
  const { onLoggedIn, loggedIn, user, onLoggedOut } = useAccount();
  const [, setState] = useState<ActivityState>(ActivityState.Loading);
  const [showOnboardingCard, setShowOnboardingCard] = useState(false);
  const [pubkey, setPubkey] = useState<string | undefined>(undefined);

  const init = async () => {
    try {
      // Setup listener
      await setupListener();
      // Load wallet
      const wallet = await store().get<SolanaWallet>(STORE_ACTIVE_KEYPAIR);
      if (!wallet?.pubkey) {
        setState(ActivityState.Error);
        return;
      }
      setPubkey(wallet.pubkey);
      // Check onboarding
      // Move this call to backend
      const res = await invoke<CheckPubkeyResponse>(CHECK_PUBKEY, {
        pubkey: wallet.pubkey,
        environment,
      });
      debug(`check_pubkey exists: ${res.exists}, pubkey: ${pubkey}`);
      setShowOnboardingCard(!res.exists);
    } catch (error) {
      logError(`Error initializing: ${error}`);
    }
  };

  const handleOAuthLogin = async (provider: "google" | "apple") => {
    try {
      // Handle all operations in the Rust backend.
      const port = await invoke<number>("start_server");
      debug(`OAuth server started on port ${port}`);
      // Tauri OAuth plugin server.
      const redirectUri = `http://localhost:${port}`;
      if (provider === "google") {
        const baseUrl = await invoke<string>("get_consent_url", {
          redirectUri,
        });
        debug(`Google OAuth URL: ${baseUrl}`);
        await openUrl(baseUrl);
      }
    } catch (e) {
      error(`Error: ${e}`);
    }
  };

  const handleLogout = async () => {
    onLoggedOut();
  };

  const setupListener = async () => {
    try {
      // Listen for OAuth emitted events from the Rust backend.
      await listen<OauthRedirect>("oauth_redirect_uri", async (event) => {
        debug(
          `Received OAuth redirect event: ${JSON.stringify(event.payload)}`,
        );
        const oauthRedirect = event.payload;
        // Handle the redirect event here
        try {
          const res = await invoke<TokenResponse>("get_token", {
            oauthRedirect,
          });
          debug(`OAuth response: ${JSON.stringify(res)}`);
          onLoggedIn("google", res.access_token);
        } catch (e) {
          error(`Error processing OAuth response: ${JSON.stringify(e)}`);
        }
      });
    } catch (e) {
      error(`Error listening OAuth event: ${e}`);
    }
  };

  React.useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{ width: "100%", maxWidth: 480, px: 2 }}>
      {showOnboardingCard && (
        <OnboardingCard
          open={showOnboardingCard}
          onClose={() => setShowOnboardingCard(false)}
        />
      )}
      <Typography
        variant="h6"
        sx={{
          color: "#333",
          fontWeight: 600,
          mb: 2,
          fontSize: "1.1rem",
        }}
      >
        {user ? t.welcomePersonal(user.name) : t.activityFeed}
      </Typography>

      {/* BACH Airdrop Banner */}
      <Card
        sx={{
          mb: 3,
          background: "linear-gradient(135deg, #9932CC 0%, #7B1FA2 100%)",
          color: "white",
          borderRadius: 2,
          boxShadow: "0 4px 12px rgba(153, 50, 204, 0.2)",
        }}
      >
        {loggedIn && (
          <CardContent sx={{ py: 1.5 }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                px: 2,
                py: 1,
                borderRadius: 1.5,
                textDecoration: "none",
                fontSize: "0.875rem",
                fontWeight: 600,
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.3)",
                  transform: "translateY(-1px)",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <button
                onClick={async () => {
                  await haptics.buttonPress();
                  await handleLogout();
                }}
                className="w-full bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-700 font-medium rounded-lg px-4 py-3 flex items-center justify-center gap-3 transition-colors border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm"
                aria-label={t.googleOAuthLogin}
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span className="text-sm font-medium leading-none">
                  {t.logout}
                </span>
              </button>
            </Box>
          </CardContent>
        )}
        <CardContent sx={{ py: 2.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                fontSize: "1.1rem",
                mr: 1,
              }}
            >
              {t.bachAirdropLive}
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{
              mb: 2,
              opacity: 0.95,
              lineHeight: 1.5,
            }}
          >
            {t.airdropDescription}
          </Typography>
          <Button
            onClick={async () => {
              await selectionFeedback();
              openUrl("https://bach.money/airdrop");
            }}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              bgcolor: "rgba(255, 255, 255, 0.2)",
              color: "white",
              px: 2,
              py: 1,
              borderRadius: 1.5,
              textDecoration: "none",
              fontSize: "0.875rem",
              fontWeight: 600,
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.3)",
                transform: "translateY(-1px)",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            {t.claimYourAirdrop}
          </Button>
        </CardContent>
        {!loggedIn && (
          <CardContent sx={{ py: 1.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  mr: 1,
                }}
              >
                {t.oAuthLoginExplanation}
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                mb: 2,
                opacity: 0.95,
                lineHeight: 1.5,
                fontSize: "0.9rem",
              }}
            >
              {t.airdropDescription}
            </Typography>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                px: 2,
                py: 1,
                borderRadius: 1.5,
                textDecoration: "none",
                fontSize: "0.875rem",
                fontWeight: 600,
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.3)",
                  transform: "translateY(-1px)",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <button
                onClick={async () => {
                  await haptics.buttonPress();
                  await handleOAuthLogin("google");
                }}
                className="w-full bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-700 font-medium rounded-lg px-4 py-3 flex items-center justify-center gap-3 transition-colors border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm"
                aria-label={t.googleOAuthLogin}
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span className="text-sm font-medium leading-none">
                  {t.googleOAuthLogin}
                </span>
              </button>
            </Box>
          </CardContent>
        )}
      </Card>
    </Box>
  );
}
