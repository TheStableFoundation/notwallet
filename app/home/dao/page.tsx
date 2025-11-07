"use client";

import Box from "@mui/material/Box";
import DAOInfoCard from "./_components/dao-info-card";
import AMMMarketsMenu from "./_components/amm-markets-menu";
import TreasuryCard from "./_components/treasury-card";
import ProposalsCard from "./_components/proposals-card";
import InfoCard from "./_components/info-card";
import PageChildrenTitleBar from "@app/lib/components/page-children-title-bar";
import { useLang } from "@src/LanguageContext";

export default function DAOPage() {
  const { t } = useLang();
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
      <Box sx={{ width: "100%", maxWidth: 480, px: 2 }}>
        <DAOInfoCard />
        <AMMMarketsMenu />
        <TreasuryCard />
        <ProposalsCard />
        <InfoCard />
      </Box>
    </Box>
  );
}
