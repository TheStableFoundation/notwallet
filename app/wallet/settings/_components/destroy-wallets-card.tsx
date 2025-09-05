"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useRouter } from "next/navigation";
import DestroyWalletsModal from "./destroy-wallets-modal";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";
import SettingListItem from "./setting-list-item";

export default function DestroyWalletsCard() {
  const router = useRouter();
  const [showDestroyModal, setShowDestroyModal] = React.useState(false);
  const handleClick = async () => {
    await selectionFeedback();
    setShowDestroyModal(true);
  };

  const dangerItems = [
    {
      id: "destroyWallets",
      label: "Destroy All Wallets",
      description: "Permanently delete all wallet data",
      icon: <DeleteForeverIcon />,
      action: () => handleClick(),
      hasChevron: true,
      isDanger: true,
    },
  ];

  return (
    <>
      {/* Danger Zone Section */}
      <Card
        sx={{
          width: "100%",
          borderRadius: "20px",
          boxShadow: "0 4px 20px rgba(220, 38, 38, 0.08)",
          border: "1px solid rgba(220, 38, 38, 0.12)",
          mt: 4,
          mb: 4,
          overflow: "hidden",
          bgcolor: "#FFFFFF",
        }}
      >
        <Box sx={{ p: 3, pb: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontSize: "18px",
              fontWeight: 600,
              color: "#DC2626",
              mb: 1,
              letterSpacing: "-0.02em",
            }}
          >
            Danger Zone
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: "14px",
              color: "#6B7280",
              mb: 1,
            }}
          >
            Irreversible actions that will permanently delete your data
          </Typography>
        </Box>
        <List sx={{ p: 0, pb: 1 }}>
          {dangerItems.map((item, index) =>
            SettingListItem(item, index === dangerItems.length - 1),
          )}
        </List>
      </Card>
      <DestroyWalletsModal
        open={showDestroyModal}
        onClose={() => setShowDestroyModal(false)}
        onSuccess={() => {
          // Optionally redirect to onboarding or show success message
          router.push("/home");
        }}
      />
    </>
  );
}
