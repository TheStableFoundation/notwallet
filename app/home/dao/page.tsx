"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import ErrorCard from "@app/lib/components/error-card";
import DAOInfoCard from "./_components/dao-info-card";
import AMMMarketsMenu from "./_components/amm-markets-menu";
import TreasuryCard from "./_components/treasury-card";
import ProposalsCard from "./_components/proposals-card";
import InfoCard from "./_components/info-card";
import PageChildrenTitleBar from "@app/lib/components/page-children-title-bar";
import { useLang } from "@src/LanguageContext";
import { CircularProgress } from "@mui/material";

enum State {
  Loading,
  Loaded,
  Error,
}

export default function DAOPage() {
  const { t } = useLang();
  const [state, setState] = React.useState(State.Loading);

  // Simple initialization - just check if we can load the page
  React.useEffect(() => {
    // Minimal delay to show loading state briefly
    const timer = setTimeout(() => {
      setState(State.Loaded);
    }, 500);

    return () => clearTimeout(timer);
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
      <PageChildrenTitleBar title={t.daoTitle} />

      {state === State.Loading && (
        <CircularProgress className="bg-primary-light" />
      )}
      {state === State.Error && <ErrorCard />}

      {state === State.Loaded && (
        <Box sx={{ width: "100%", maxWidth: 480, px: 2 }}>
          <AMMMarketsMenu />
          <DAOInfoCard />
          <TreasuryCard />
          <ProposalsCard />
          <InfoCard />
        </Box>
      )}
    </Box>
  );
}
