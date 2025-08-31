"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import AddIcon from "@mui/icons-material/Add";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { useRouter } from "next/navigation";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";
import WalletSettingsSeedPhraseModal from "./_components/wallet-settings-seed-phrase-modal";
import PageChildrenTitleBar from "@/lib/components/page-children-title-bar";
import SettingListItem from "./_components/setting-list-item";
import DestroyWalletsCard from "./_components/destroy-wallets-card";

export default function WalletSettingsPage() {
  const router = useRouter();
  const [showSeedPhraseModal, setShowSeedPhraseModal] = React.useState(false);

  const handleClick = async (
    type:
      | "addWallet"
      | "showSeedPhrase"
      | "importSeedPhrase"
      | "destroyWallets",
  ) => {
    await selectionFeedback();
    if (type === "addWallet") {
      router.push("/wallet/create-new-wallet");
    } else if (type === "showSeedPhrase") {
      setShowSeedPhraseModal(true);
    } else if (type === "importSeedPhrase") {
      router.push("/wallet/import");
    }
  };

  const walletItems = [
    {
      id: "addWallet",
      label: "Add Wallet",
      description: "Create a new wallet",
      icon: <AddIcon />,
      action: () => handleClick("addWallet"),
      hasChevron: true,
    },
    {
      id: "showSeedPhrase",
      label: "Show Seed Phrase",
      description: "View your recovery phrase",
      icon: <VisibilityOutlinedIcon />,
      action: () => handleClick("showSeedPhrase"),
      hasChevron: true,
    },
  ];

  const importItems = [
    {
      id: "importSeedPhrase",
      label: "Import Seed Phrase",
      description: "Import an existing wallet",
      icon: <FileDownloadOutlinedIcon />,
      action: () => handleClick("importSeedPhrase"),
      hasChevron: true,
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "linear-gradient(135deg, #FAFBFF 0%, #F8FAFF 100%)",
        background: "linear-gradient(135deg, #FAFBFF 0%, #F8FAFF 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pb: 8,
      }}
    >
      <PageChildrenTitleBar title="Wallet Settings" />
      <Box sx={{ width: "100%", maxWidth: 420, px: 2 }}>
        {/* Security Notice */}
        <Box
          sx={{
            textAlign: "center",
            mb: 4,
            px: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontSize: "14px",
              color: "#6B7280",
              lineHeight: 1.6,
              bgcolor: "rgba(139, 92, 246, 0.04)",
              border: "1px solid rgba(139, 92, 246, 0.08)",
              borderRadius: "12px",
              p: 3,
            }}
          >
            🔒 Your seed phrase is the key to your wallet. Keep it secure and
            never share it with anyone.
            <br />
            <Box
              component="span"
              sx={{
                color: "#8B5CF6",
                fontWeight: 500,
                mt: 1,
                display: "block",
              }}
            >
              Store it safely offline
            </Box>
          </Typography>
        </Box>

        {/* Wallet Management Section */}
        <Card
          sx={{
            width: "100%",
            borderRadius: "20px",
            boxShadow: "0 4px 20px rgba(139, 92, 246, 0.08)",
            border: "1px solid rgba(139, 92, 246, 0.06)",
            mb: 3,
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
                color: "#1F2937",
                mb: 1,
                letterSpacing: "-0.02em",
              }}
            >
              Wallet Management
            </Typography>
          </Box>
          <List sx={{ p: 0, pb: 1 }}>
            {walletItems.map((item, index) =>
              SettingListItem(item, index === walletItems.length - 1),
            )}
          </List>
        </Card>

        {/* Import & Recovery Section */}
        <Card
          sx={{
            width: "100%",
            borderRadius: "20px",
            boxShadow: "0 4px 20px rgba(139, 92, 246, 0.08)",
            border: "1px solid rgba(139, 92, 246, 0.06)",
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
                color: "#1F2937",
                mb: 1,
                letterSpacing: "-0.02em",
              }}
            >
              Import & Recovery
            </Typography>
          </Box>
          <List sx={{ p: 0, pb: 1 }}>
            {importItems.map((item, index) =>
              SettingListItem(item, index === importItems.length - 1),
            )}
          </List>
        </Card>
        <DestroyWalletsCard />
      </Box>
      <WalletSettingsSeedPhraseModal
        open={showSeedPhraseModal}
        onClose={() => setShowSeedPhraseModal(false)}
      />
    </Box>
  );
}
