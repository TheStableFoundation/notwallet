"use client";

import * as React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { styled } from "@mui/material/styles";

const VerifiedIcon = styled(CheckCircleIcon)(({ theme }) => ({
  color: "#16a34a",
  fontSize: "16px",
  filter: "drop-shadow(0 1px 2px rgba(22, 163, 74, 0.2))",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    color: "#15803d",
    filter: "drop-shadow(0 2px 4px rgba(22, 163, 74, 0.3))",
    transform: "scale(1.05)",
  },
}));

interface VerifiedBadgeProps {
  size?: number;
}

export default function VerifiedBadge({ size = 16 }: VerifiedBadgeProps) {
  return (
    <VerifiedIcon
      sx={{
        fontSize: `${size}px`,
      }}
    />
  );
}
