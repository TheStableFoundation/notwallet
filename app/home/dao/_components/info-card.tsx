"use client";
import * as React from "react";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";

export default function InfoCard() {
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
  );
}
