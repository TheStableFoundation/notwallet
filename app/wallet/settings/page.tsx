"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import AddIcon from "@mui/icons-material/Add";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useRouter } from "next/navigation";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";
import WalletSettingsSeedPhraseModal from "../components/wallet-settings-seed-phrase-modal";
import PageChildrenTitleBar from "@/lib/components/page-children-title-bar";

export default function WalletSettingsPage() {
  const router = useRouter();
  const [showSeedPhraseModal, setShowSeedPhraseModal] = React.useState(false);

  const handleClick = async (
    type: "addWallet" | "showSeedPhrase" | "importSeedPhrase",
  ) => {
    await selectionFeedback();
    if (type === "addWallet") {
      router.push("/create-new-wallet");
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

  const renderListItem = (item: any, isLast: boolean = false) => (
    <React.Fragment key={item.id}>
      <ListItem
        sx={{
          px: 0,
          py: 2,
          cursor: "pointer",
          borderRadius: "12px",
          mx: 2,
          mb: 1,
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            bgcolor: "rgba(139, 92, 246, 0.04)",
            transform: "scale(1.01)",
          },
          "&:active": {
            transform: "scale(0.99)",
          },
        }}
        onClick={item.action}
        component="li"
        disablePadding
      >
        <ListItemIcon
          sx={{
            color: "#8B5CF6",
            minWidth: 48,
            ml: 2,
          }}
        >
          {item.icon}
        </ListItemIcon>
        <ListItemText
          primary={item.label}
          secondary={item.description}
          primaryTypographyProps={{
            sx: {
              fontSize: "16px",
              fontWeight: 500,
              color: "#1F2937",
              letterSpacing: "-0.01em",
              mb: 0.25,
            },
          }}
          secondaryTypographyProps={{
            sx: {
              fontSize: "14px",
              color: "#6B7280",
            },
          }}
        />
        {item.hasChevron && (
          <ChevronRightIcon
            sx={{
              color: "#9CA3AF",
              mr: 4,
              fontSize: "20px",
            }}
          />
        )}
      </ListItem>
      {!isLast && (
        <Divider
          sx={{
            mx: 6,
            borderColor: "rgba(139, 92, 246, 0.08)",
          }}
        />
      )}
    </React.Fragment>
  );

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
              renderListItem(item, index === walletItems.length - 1),
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
              renderListItem(item, index === importItems.length - 1),
            )}
          </List>
        </Card>

        {/* Security Notice */}
        <Box
          sx={{
            textAlign: "center",
            mt: 4,
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
      </Box>

      <WalletSettingsSeedPhraseModal
        open={showSeedPhraseModal}
        onClose={() => setShowSeedPhraseModal(false)}
      />
    </Box>
  );
}
