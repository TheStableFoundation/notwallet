"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import LoadingCard from "@/lib/components/loading-card";
import ErrorCard from "@/lib/components/error-card";
import PageTitleBar from "@/lib/components/page-title-bar";
import { invoke } from "@tauri-apps/api/core";
import {
  GET_TREASURY_BACH_BALANCE,
  GET_TREASURY_SOL_BALANCE,
  GET_BACH_BALANCE,
} from "@/lib/commands";
import { debug } from "@tauri-apps/plugin-log";
import { useRouter } from "next/navigation";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";

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
  const router = useRouter();
  const [state, setState] = React.useState(State.Loading);
  const [bachBalance, setBachBalance] = React.useState<string>("-");
  const [solBalance, setSolBalance] = React.useState<string>("-");
  const [lockedBachBalance, setLockedBachBalance] = React.useState<string>("-");

  const treasuryAddress =
    "3YAyrP4mjiLRuHZQjfskmmVBbF7urtfDLfnRXfu9cUxnvrxj5PvbzTmf";
  const daoTokenAddress = "9DWkPYFKcjpGVjwCjgAnYM8T6H4hssEnW27rLDtfU8y5";

  const handleBack = async () => {
    await selectionFeedback();
    router.push("/home");
  };

  const openExplorer = async (address: string) => {
    await selectionFeedback();
    const url = `https://explorer.solana.com/address/${address}`;
    window.open(url, "_blank");
  };

  const loadTreasuryBalances = async () => {
    try {
      setState(State.Loading);

      // Fetch treasury balances and locked DAO tokens
      const [treasuryBachBalance, treasurySolBalance, daoLockedBalance] =
        await Promise.all([
          invoke<string>(GET_TREASURY_BACH_BALANCE),
          invoke<string>(GET_TREASURY_SOL_BALANCE),
          invoke<string>(GET_BACH_BALANCE, { pubkey: daoTokenAddress }),
        ]);

      debug(`Treasury BACH balance: ${treasuryBachBalance}`);
      debug(`Treasury SOL balance: ${treasurySolBalance}`);
      debug(`DAO locked BACH balance: ${daoLockedBalance}`);

      setBachBalance(treasuryBachBalance);
      setSolBalance(treasurySolBalance);
      setLockedBachBalance(daoLockedBalance);
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
      <PageTitleBar
        title="DAO"
        leftAction={
          <IconButton onClick={handleBack} sx={{ color: "#fff" }}>
            <ArrowBackIcon />
          </IconButton>
        }
      />

      {state === State.Loading && <LoadingCard />}
      {state === State.Error && <ErrorCard />}

      {state === State.Loaded && (
        <Box sx={{ width: "100%", maxWidth: 480, px: 2 }}>
          {/* DAO Info Card */}
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
              The Stable Foundation
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
                justifyContent: "space-between",
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
                  flex: 1,
                }}
              >
                {`${daoTokenAddress.slice(0, 8)}...${daoTokenAddress.slice(-8)}`}
              </Typography>
              <Tooltip title="View on Explorer" arrow>
                <IconButton
                  onClick={() => openExplorer(daoTokenAddress)}
                  sx={{
                    color: "#9932CC",
                    ml: 1,
                    "&:hover": { bgcolor: "rgba(153, 50, 204, 0.1)" },
                  }}
                  size="small"
                >
                  <OpenInNewIcon fontSize="small" />
                </IconButton>
              </Tooltip>
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
              Locked DAO Tokens
            </Typography>

            {/* Locked BACH Balance */}
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              spacing={2}
              sx={{ mb: 2 }}
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
                  {lockedBachBalance}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "rgba(255,255,255,0.8)",
                    fontWeight: "bold",
                  }}
                >
                  Locked
                </Typography>
              </Box>
            </Stack>
          </Card>

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
              Treasury
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
                justifyContent: "space-between",
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
                  flex: 1,
                }}
              >
                {`${treasuryAddress.slice(0, 8)}...${treasuryAddress.slice(-8)}`}
              </Typography>
              <Tooltip title="View on Explorer" arrow>
                <IconButton
                  onClick={() => openExplorer(treasuryAddress)}
                  sx={{
                    color: "#9932CC",
                    ml: 1,
                    "&:hover": { bgcolor: "rgba(153, 50, 204, 0.1)" },
                  }}
                  size="small"
                >
                  <OpenInNewIcon fontSize="small" />
                </IconButton>
              </Tooltip>
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
                  Treasury
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

          {/* Proposals Card */}
          <Card
            sx={{
              mb: 3,
              borderRadius: 2,
              boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
              p: 3,
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ mb: 3, color: "#9932CC" }}
            >
              Active Proposals
            </Typography>

            {/* Proposal Item */}
            <Box
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: 2,
                p: 2,
                mb: 2,
                "&:hover": {
                  bgcolor: "#f9f9f9",
                  borderColor: "#9932CC",
                },
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="start"
                sx={{ mb: 1 }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{ color: "#333" }}
                >
                  Proposal #001: Increase Treasury Fee
                </Typography>
                <Box
                  sx={{
                    bgcolor: "#e3f2fd",
                    color: "#1976d2",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                  }}
                >
                  Active
                </Box>
              </Stack>
              <Typography
                variant="body2"
                sx={{ mb: 2, color: "#666", lineHeight: 1.5 }}
              >
                Proposal to increase the treasury fee from 0.25% to 0.35% to
                fund additional development initiatives and security audits.
              </Typography>
              <Stack direction="row" spacing={3}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Yes Votes
                  </Typography>
                  <Typography variant="body2" fontWeight="bold" color="#43a047">
                    12,500 BACH
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    No Votes
                  </Typography>
                  <Typography variant="body2" fontWeight="bold" color="#e53935">
                    8,200 BACH
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Ends
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    3 days
                  </Typography>
                </Box>
              </Stack>
            </Box>

            {/* Another Proposal Item */}
            <Box
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: 2,
                p: 2,
                mb: 2,
                "&:hover": {
                  bgcolor: "#f9f9f9",
                  borderColor: "#9932CC",
                },
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="start"
                sx={{ mb: 1 }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{ color: "#333" }}
                >
                  Proposal #002: New Feature Funding
                </Typography>
                <Box
                  sx={{
                    bgcolor: "#fff3e0",
                    color: "#f57c00",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                  }}
                >
                  Pending
                </Box>
              </Stack>
              <Typography
                variant="body2"
                sx={{ mb: 2, color: "#666", lineHeight: 1.5 }}
              >
                Allocate 25,000 BACH from treasury to fund development of
                cross-chain swap functionality and mobile app improvements.
              </Typography>
              <Stack direction="row" spacing={3}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Yes Votes
                  </Typography>
                  <Typography variant="body2" fontWeight="bold" color="#43a047">
                    5,800 BACH
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    No Votes
                  </Typography>
                  <Typography variant="body2" fontWeight="bold" color="#e53935">
                    2,100 BACH
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Ends
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    7 days
                  </Typography>
                </Box>
              </Stack>
            </Box>
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
              The Stable Foundation Treasury collects a 0.25% fee on all
              transactions to support the development and maintenance of the
              NotWallet ecosystem.
            </Typography>
            <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.6 }}>
              These funds are used for community development, security audits,
              infrastructure maintenance, and ecosystem growth initiatives.
            </Typography>
          </Card>
        </Box>
      )}
    </Box>
  );
}
