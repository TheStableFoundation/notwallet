"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import { useColorScheme } from "@mui/material/styles";

export default function AppPreferences() {
  const router = useRouter();
  const { mode, setMode } = useColorScheme();

  if (!mode) {
    return <p>No mode</p>;
  }

  return (
    <Box
      sx={{
        minHeight: "unset",
        height: "auto",
        bgcolor: "#f5f6fa",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 4,
      }}
    >
      <Card
        sx={{
          maxWidth: 400,
          width: "100%",
          px: 2,
          py: 2,
          boxShadow: 3,
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            pl: 2,
            pt: 2,
            pb: 1,
            bgcolor: "transparent",
          }}
        >
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={async () => {
              await selectionFeedback();
              router.back();
            }}
            sx={{
              minWidth: 0,
              px: 1,
              py: 0.5,
              fontSize: "0.95rem",
              mr: 1,
            }}
          >
            Back
          </Button>
          <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
            <Typography variant="h5" fontWeight="bold" paddingRight={2}>
              Preferences
            </Typography>
          </Box>
        </Box>
        <Divider />
        <Box
          sx={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "background.default",
            color: "text.primary",
            borderRadius: 1,
            p: 3,
            minHeight: "56px",
          }}
        >
          <FormControl>
            <FormLabel id="demo-theme-toggle">Theme (beta)</FormLabel>
            <RadioGroup
              aria-labelledby="demo-theme-toggle"
              name="theme-toggle"
              row
              value={mode}
              onChange={async (event) => {
                await selectionFeedback();
                setMode(event.target.value as "system" | "light" | "dark");
              }}
            >
              <FormControlLabel
                value="system"
                control={<Radio />}
                label="System"
              />
              <FormControlLabel
                value="light"
                control={<Radio />}
                label="Light"
              />
              <FormControlLabel value="dark" control={<Radio />} label="Dark" />
            </RadioGroup>
          </FormControl>
        </Box>
      </Card>
    </Box>
  );
}
