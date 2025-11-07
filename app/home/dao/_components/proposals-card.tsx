"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CircularProgress from "@mui/material/CircularProgress";
import { useLang } from "../../../../src/LanguageContext";
import { Button } from "@mui/material";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";
import { openDaoExplorer } from "@app/lib/helper";
import { THE_STABLE_FOUNDATION_ADDRESS } from "@app/lib/crate/generated";

enum LoadingState {
  Loading,
  Loaded,
  Error,
}

export default function ProposalsCard() {
  const { t } = useLang();
  const [state, setState] = React.useState<LoadingState>(LoadingState.Loading);

  const loadProposals = async () => {
    try {
      setState(LoadingState.Loading);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setState(LoadingState.Loaded);
    } catch (error) {
      console.error("Error fetching proposals:", error);
      setState(LoadingState.Error);
    }
  };

  const handleOpenProposals = async () => {
    await selectionFeedback();
    openDaoExplorer(THE_STABLE_FOUNDATION_ADDRESS + "/proposals");
  };

  React.useEffect(() => {
    loadProposals();
  }, []);

  return (
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
        {t.activeProposals}
      </Typography>

      {/* Loading State */}
      {state === LoadingState.Loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress size={24} sx={{ color: "#9932CC" }} />
        </Box>
      )}

      {/* Error State */}
      {state === LoadingState.Error && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="body2" color="error" sx={{ mb: 2 }}>
            {t.failedToLoadProposals}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#9932CC",
              cursor: "pointer",
              textDecoration: "underline",
            }}
            onClick={loadProposals}
          >
            {t.retry}
          </Typography>
        </Box>
      )}

      {/* Loaded State */}
      {state === LoadingState.Loaded && (
        <Button
          variant="outlined"
          startIcon={<OpenInNewIcon />}
          onClick={handleOpenProposals}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            borderColor: "#9932CC",
            color: "#9932CC",
            "&:hover": {
              borderColor: "#7B2CBF",
              backgroundColor: "rgba(153, 50, 204, 0.04)",
            },
          }}
        >
          {t.openInRealms}
        </Button>
      )}
    </Card>
  );
}
