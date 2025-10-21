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
import { GET_BACH_BALANCE } from "@app/lib/commands";
import { debug } from "@tauri-apps/plugin-log";
import {
  BACH_TOKEN,
  THE_STABLE_FOUNDATION_ADDRESS,
} from "@app/lib/crate/generated";
import { openExplorer } from "@app/lib/helper";
import { AssetIcon } from "@app/lib/components/token-icons";
import { useLang } from "../../../../src/LanguageContext";

enum LoadingState {
  Loading,
  Loaded,
  Error,
}

export default function DAOInfoCard() {
  const { t } = useLang();
  const [state, setState] = React.useState<LoadingState>(LoadingState.Loading);
  const [lockedBachBalance, setLockedBachBalance] = React.useState<string>("-");

  const loadDAOBalance = async () => {
    try {
      setState(LoadingState.Loading);

      const daoLockedBalance = await invoke<string>(GET_BACH_BALANCE, {
        pubkey: THE_STABLE_FOUNDATION_ADDRESS,
      });

      debug(`DAO locked BACH balance: ${daoLockedBalance}`);
      setLockedBachBalance(daoLockedBalance);
      setState(LoadingState.Loaded);
    } catch (error) {
      console.error("Error fetching DAO balance:", error);
      setState(LoadingState.Error);
    }
  };

  React.useEffect(() => {
    loadDAOBalance();
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
        {t.theStableFoundation}
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
          {`${THE_STABLE_FOUNDATION_ADDRESS.slice(0, 8)}...${THE_STABLE_FOUNDATION_ADDRESS.slice(-8)}`}
        </Typography>
        <Tooltip title={t.viewOnExplorer} arrow>
          <IconButton
            onClick={() => openExplorer(THE_STABLE_FOUNDATION_ADDRESS)}
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
        {t.lockedDaoTokens}
      </Typography>

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
            {t.failedToLoadDaoBalance}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#fff",
              cursor: "pointer",
              textDecoration: "underline",
            }}
            onClick={loadDAOBalance}
          >
            {t.retry}
          </Typography>
        </Box>
      )}

      {state === LoadingState.Loaded && (
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
            <AssetIcon id={BACH_TOKEN} size={28} />
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
              {t.locked}
            </Typography>
          </Box>
        </Stack>
      )}
    </Card>
  );
}
