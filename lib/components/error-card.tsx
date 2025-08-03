"use client";

import React from "react";
import { Card } from "@mui/material";
import Typography from "@mui/material/Typography";

const ErrorCard = () => (
  <Card
    sx={{
      maxWidth: 400,
      height: 400,
      width: "100%",
      p: 0,
      boxShadow: 3,
      position: "relative",
    }}
  >
    <Typography variant="h6" align="center">
      Error Occurred
    </Typography>
  </Card>
);

export default ErrorCard;
