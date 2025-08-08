"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import LoadingCard from "@/lib/components/loading-card";
import ErrorCard from "@/lib/components/error-card";
import PageTitleBar from "@/lib/components/page-title-bar";
import { invoke } from "@tauri-apps/api/core";
import { GET_TREASURY_BACH_BALANCE, GET_TREASURY_SOL_BALANCE } from "@/lib/commands";
import { debug } from "@tauri-apps/plugin-log";

// Solana Icon Component
const SolanaIcon = ({ size = 24 }: { size?: number }) => (
  <img
    src="/images/solana-coin.svg"
    width={size}
    height={size}
    alt="Solana"
    style={{ borderRadius: "50%" }}
  />
);

// BACH Token Icon Component
const BachIcon = ({ size = 24 }: { size?: number }) => (
  <img
    src="https://raw.githubusercontent.com/solana-labs/token-list/badd1dbe8c2d1e38c4f77b77f1d5fd5c60d3cccb/assets/mainnet/CTQBjyrX8pYyqbNa8vAhQfnRXfu9cUxnvrxj5PvbzTmf/bach-token-logo-Est.2022.png"
    width={size}
    height={size}
    alt="BACH Token"
    style={{ borderRadius: "50%" }}
  />
);

enum State {
  Loading,
  Loaded,
  Error,
}

export default function DAOPage() {
  const [state, setState] = React.useState(State.Loading);
  const [bachBalance, setBachBalance] = React.useState<string>("-");
  const [solBalance, setSolBalance] = React.useState<string>("-");

  const treasuryAddress = "3YAyrP4mjiLRuHZQjfskmmVBbF7urtfDLfnLtW2jzgx3";

  const loadTreasuryBalances = async () => {
    try {
      setState(State.Loading);

      // Fetch treasury balances
      const [treasuryBachBalance, treasurySolBalance] = await Promise.all([
        invoke<string>(GET_TREASURY_BACH_BALANCE),
        invoke<string>(GET_TREASURY_SOL_BALANCE),
      ]);

      debug(`Treasury BACH balance: ${treasuryBachBalance}`);
      debug(`Treasury SOL balance: ${treasurySolBalance}`);

      setBachBalance(treasuryBachBalance);
      setSolBalance(treasurySolBalance);
      setState(State.Loaded);
    } catch (error) {
      console.error("Error fetching treasury balances:", error);
      setState(State.Error);
    }
  };

  React.useEffect(() => {
    loadTreasuryBalances();
  }, []);

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
      <PageTitleBar title="DAO Treasury" />

      {state === State.Loading && <LoadingCard />}
      {state === State.Error && <ErrorCard />}

      {state === State.Loaded && (
        <Box sx={{ width: "100%", maxWidth: 480, px: 2 }}>
          {/* Treasury Info Card */}
          <Card
            sx={{
              mb: 3,
              borderRadius: 2,
              boxShadow: "0 2px 16px rgba(153,50,204,0.08)",
              p: 3,
              background:
                "linear-gradient(135deg, rgba(153, 50, 204, 0.85) 0%, rgba(166, 77, 255, 0.8) 100%)",
              color: "#fff",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              color="#fff"
              sx={{ mb: 2, textAlign: "center" }}
            >
              The Stable Foundation Treasury
            </Typography>

            <Box
              sx={{
                bgcolor: "#fff",
                borderRadius: 2,
                px: 2,
                py: 1.5,
                mb: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 1px 4px #9932CC11",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "#9932CC",
                  fontFamily: "monospace",
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                  textAlign: "center",
                  wordBreak: "break-all",
                }}
              >
                {treasuryAddress}
              </Typography>
            </Box>

            <Typography
              variant="subtitle2"
              sx={{
                color: "#000",
                fontFamily: "Inter, Helvetica Neue, Arial, sans-serif",
                mb: 2,
                letterSpacing: 1,
                textAlign: "center",
              }}
            >
              Treasury Balances
            </Typography>

            {/* BACH Balance */}
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              spacing={2}
              sx={{ mb: 3 }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  bgcolor: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <BachIcon size={28} />
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h3"
                  fontWeight="bold"
                  sx={{
                    color: "#fff",
                    textShadow: "0 2px 12px #9932CC55",
                    fontFamily: "Inter, Helvetica Neue, Arial, sans-serif",
                    fontSize: 28,
                  }}
                >
                  {bachBalance}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "rgba(255,255,255,0.8)",
                    fontWeight: "bold",
                  }}
                >
                  BACH
                </Typography>
              </Box>
            </Stack>

            {/* SOL Balance */}
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              spacing={2}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  bgcolor: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <SolanaIcon size={28} />
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{
                    color: "#fff",
                    textShadow: "0 2px 12px #9932CC55",
                    fontFamily: "Inter, Helvetica Neue, Arial, sans-serif",
                    fontSize: 20,
                  }}
                >
                  {solBalance}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "rgba(255,255,255,0.8)",
                    fontWeight: "bold",
                  }}
                >
                  SOL
                </Typography>
              </Box>
            </Stack>
          </Card>

          {/* Info Card */}
          <Card
            sx={{
              borderRadius: 2,
              boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
              p: 3,
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ mb: 2, color: "#9932CC" }}
            >
              About Treasury Fees
            </Typography>
            <Typography
              variant="body2"
              sx={{ mb: 2, color: "#666", lineHeight: 1.6 }}
            >
              The Stable Foundation Treasury collects a 0.25% fee on all transactions
              to support the development and maintenance of the NotWallet ecosystem.
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#666", lineHeight: 1.6 }}
            >
              These funds are used for community development, security audits,
              infrastructure maintenance, and ecosystem growth initiatives.
            </Typography>
          </Card>
        </Box>
      )}
    </Box>
  );
}
