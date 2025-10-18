"use client";

import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { useLang } from "../../../../src/LanguageContext";

export default function InfoCard() {
  const { t } = useLang();
  return (
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
        {t.aboutTreasuryFees}
      </Typography>
      <Typography
        variant="body2"
        sx={{ mb: 2, color: "#666", lineHeight: 1.6 }}
      >
        {t.treasuryFeeDescription}
      </Typography>
      <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.6 }}>
        {t.treasuryFundsUsage}
      </Typography>
    </Card>
  );
}
