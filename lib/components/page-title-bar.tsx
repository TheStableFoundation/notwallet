import { Box, Typography } from "@mui/material";
import * as React from "react";
import { checkIfAndroidTv } from "../helper";

interface PageTitleBarProps {
  title: string;
  leftAction?: React.ReactNode;
}

export default function PageTitleBar({ title, leftAction }: PageTitleBarProps) {
  const [isAndroidTv, setIsAndroidTv] = React.useState(false);

  const init = async () => {
    setIsAndroidTv(await checkIfAndroidTv());
  };

  React.useEffect(() => {
    init();
  }, []);

  if (isAndroidTv) {
    // Return invisible spacer to maintain layout spacing
    return <Box sx={{ height: 64 }} />;
  }

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
