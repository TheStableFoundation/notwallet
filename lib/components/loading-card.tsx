"use client";

import Rive, { Alignment, Fit, Layout } from "@rive-app/react-canvas";
import React from "react";
import { Card } from "@mui/material";

const LoadingCard = () => (
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
    <Rive
      src="animation/purple_loader.riv"
      layout={new Layout({ fit: Fit.FitWidth, alignment: Alignment.Center })}
    />
  </Card>
);

export default LoadingCard;
