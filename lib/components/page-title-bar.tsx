import { Box, Typography } from "@mui/material";
import * as React from "react";

interface PageTitleBarProps {
  title: string;
  leftAction?: React.ReactNode;
}

export default function PageTitleBar({ title, leftAction }: PageTitleBarProps) {
  return (
    <Box sx={{ width: "100%", maxWidth: 480, position: "relative" }}>
      {leftAction && (
        <Box
          sx={{
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 1,
          }}
        >
          {leftAction}
        </Box>
      )}
      <Typography
        variant="h5"
        component="h1"
        fontWeight="bold"
        align="center"
        sx={{ my: 2 }}
      >
        {title}
      </Typography>
    </Box>
  );
}
