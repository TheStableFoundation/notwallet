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
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { getVersion } from "@tauri-apps/api/app";
import { invoke } from "@tauri-apps/api/core";

export default function AppInfoPage() {
  const router = useRouter();
  const [version, setVersion] = React.useState<string | null>(null);
  const [installationId, setInstallationId] = React.useState<string | null>(
    null,
  );

  React.useEffect(() => {
    const fetchVersion = async () => {
      const appVersion = await getVersion();
      setVersion(appVersion);
    };
    const fetchInstallationId = async () => {
      try {
        const id = await invoke<string>("get_installation_id");
        setInstallationId(id);
      } catch (error) {
        console.error("Failed to fetch installation ID:", error);
      }
    };
    Promise.all([fetchVersion(), fetchInstallationId()]);
  }, []);

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
              App Info
            </Typography>
          </Box>
        </Box>
        <Divider />
        <ListItem
          sx={{
            px: 4,
            cursor: "pointer",
            minHeight: 56,
            borderRadius: 2,
            "&:hover": { bgcolor: "#f3f4f6" },
            transition: "background 0.2s",
          }}
          component="li"
          disablePadding
        >
          <ListItemText
            primary={`Version ${version}`}
            primaryTypographyProps={{
              sx: { fontSize: "1rem", fontWeight: 500, py: 1 },
            }}
          />
        </ListItem>
        <Divider />
        <ListItem
          sx={{
            px: 4,
            cursor: "pointer",
            minHeight: 56,
            borderRadius: 2,
            "&:hover": { bgcolor: "#f3f4f6" },
            transition: "background 0.2s",
          }}
          component="li"
          disablePadding
        >
          <ListItemText
            primary={installationId}
            primaryTypographyProps={{
              sx: { fontSize: "0.9rem", fontWeight: 500, py: 1 },
            }}
          />
        </ListItem>
      </Card>
    </Box>
  );
}
