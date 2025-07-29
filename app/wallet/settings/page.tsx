"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import WalletHeader from "@/app/wallet/components/wallet-header";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import AddIcon from "@mui/icons-material/Add";
import EyeIcon from "@mui/icons-material/Visibility";
import { useRouter } from "next/navigation";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";
import { ListItemIcon } from "@mui/material";
import WalletSettingsSeedPhraseModal from "../components/wallet-settings-seed-phrase-modal";

export default function WalletSettingsPage() {
  const router = useRouter();
  const [showSeedPhraseModal, setShowSeedPhraseModal] = React.useState(false);

  const handleClick = async (type: "addWallet" | "showSeedPhrase") => {
    await selectionFeedback();
    if (type === "addWallet") {
      router.push("/create-new-wallet");
    } else if (type === "showSeedPhrase") {
      setShowSeedPhraseModal(true);
    }
  };

  return (
    <Box
      sx={{
        height: "auto",
        bgcolor: "#f5f6fa",
        pb: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
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
        <WalletHeader token={"Settings"} />
        <Divider />
        <List sx={{ p: 0 }}>
          <ListItem
            sx={{
              px: 4,
              cursor: "pointer",
              minHeight: 56,
              borderRadius: 2,
              "&:hover": { bgcolor: "#f3f4f6" },
              transition: "background 0.2s",
            }}
            onClick={() => handleClick("addWallet")}
            component="li"
            disablePadding
          >
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText
              primary="Add Wallet"
              sx={{ fontSize: "1.08rem", fontWeight: 500, py: 1 }}
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
            onClick={() => handleClick("showSeedPhrase")}
            component="li"
            disablePadding
          >
            <ListItemIcon>
              <EyeIcon />
            </ListItemIcon>
            <ListItemText
              primary="Show Seed Phrase"
              sx={{ fontSize: "1.08rem", fontWeight: 500, py: 1 }}
            />
          </ListItem>
        </List>
        <Divider sx={{ mt: 2, mb: 1 }} />
        <List sx={{ p: 0 }}>
          <ListItem
            sx={{
              px: 4,
              cursor: "pointer",
              minHeight: 56,
              borderRadius: 2,
              "&:hover": { bgcolor: "#f3f4f6" },
              transition: "background 0.2s",
            }}
            onClick={() => router.push("/wallet/import")}
            component="li"
            disablePadding
          >
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText
              primary="Import Seed Phrase"
              sx={{ fontSize: "1.08rem", fontWeight: 500, py: 1 }}
            />
          </ListItem>
        </List>
      </Card>
      <WalletSettingsSeedPhraseModal
        open={showSeedPhraseModal}
        onClose={() => setShowSeedPhraseModal(false)}
      />
    </Box>
  );
}
