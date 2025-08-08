"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { invoke } from "@tauri-apps/api/core";
import {
  GET_TREASURY_BACH_BALANCE,
  GET_TREASURY_SOL_BALANCE,
} from "@/lib/commands";
import { debug } from "@tauri-apps/plugin-log";
import { THE_STABLE_FOUNDATION_TREASURY_ADDRESS } from "@/lib/crate/generated";
import { openExplorer } from "@/lib/helper";
import { SolanaIcon, BachIcon } from "@/lib/components/token-icons";

enum LoadingState {
  Loading,
  Loaded,
  Error,
}

export default function TreasuryCard() {
  const [state, setState] = React.useState<LoadingState>(LoadingState.Loading);
  const [bachBalance, setBachBalance] = React.useState<string>("-");
  const [solBalance, setSolBalance] = React.useState<string>("-");

  const loadTreasuryBalances = async () => {
    try {
      setState(LoadingState.Loading);

      const [treasuryBachBalance, treasurySolBalance] = await Promise.all([
        invoke<string>(GET_TREASURY_BACH_BALANCE),
        invoke<string>(GET_TREASURY_SOL_BALANCE),
      ]);

      debug(`Treasury BACH balance: ${treasuryBachBalance}`);
      debug(`Treasury SOL balance: ${treasurySolBalance}`);

      setBachBalance(treasuryBachBalance);
      setSolBalance(treasurySolBalance);
      setState(LoadingState.Loaded);
    } catch (error) {
      console.error("Error fetching treasury balances:", error);
      setState(LoadingState.Error);
    }
  };

  React.useEffect(() => {
    loadTreasuryBalances();
  }, []);

  return (
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
          {`${THE_STABLE_FOUNDATION_TREASURY_ADDRESS.slice(0, 8)}...${THE_STABLE_FOUNDATION_TREASURY_ADDRESS.slice(-8)}`}
        </Typography>
        <Tooltip title="View on Explorer" arrow>
          <IconButton
            onClick={() => openExplorer(THE_STABLE_FOUNDATION_TREASURY_ADDRESS)}
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

      {/* Loading State */}
      {state === LoadingState.Loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress size={32} sx={{ color: "#fff" }} />
        </Box>
      )}

      {/* Error State */}
      {state === LoadingState.Error && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography
            variant="body2"
            sx={{ color: "rgba(255,255,255,0.8)", mb: 2 }}
          >
            Failed to load treasury balances
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#fff",
              cursor: "pointer",
              textDecoration: "underline",
            }}
            onClick={loadTreasuryBalances}
          >
            Retry
          </Typography>
        </Box>
      )}

      {/* Loaded State */}
      {state === LoadingState.Loaded && (
        <>
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
            </Box>
          </Stack>
        </>
      )}
    </Card>
  );
}
