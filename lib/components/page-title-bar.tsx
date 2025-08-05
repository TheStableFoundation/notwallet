import { Box, Typography } from "@mui/material";

export default function PageTitleBar({ title }: { title: string }) {
  return (
    <Box sx={{ width: "100%", maxWidth: 480 }}>
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
