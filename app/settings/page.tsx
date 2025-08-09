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
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PrivacyTipOutlinedIcon from "@mui/icons-material/PrivacyTipOutlined";
import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import PhoneAndroidOutlinedIcon from "@mui/icons-material/PhoneAndroidOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { openUrl } from "@tauri-apps/plugin-opener";
import { useRouter } from "next/navigation";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";
import PageTitleBar from "@/lib/components/page-title-bar";

export default function SettingsPage() {
  const router = useRouter();

  // Centralized click handler for all links
  const handleClick = async (
    type:
      | "about"
      | "openSource"
      | "footer"
      | "privacyPolicy"
      | "termsOfService"
      | "appInfo"
      | "appPreferences",
  ) => {
    await selectionFeedback();
    if (type === "about") {
      router.push("/settings/about");
    } else if (type === "privacyPolicy") {
      openUrl("https://bach.money/privacy-policy");
    } else if (type === "termsOfService") {
      openUrl("https://bach.money/terms-of-service");
    } else if (type === "openSource") {
      openUrl("https://github.com/TheStableFoundation/not");
    } else if (type === "footer") {
      openUrl("https://bach.money/");
    } else if (type === "appInfo") {
      router.push("/settings/app-info");
    } else if (type === "appPreferences") {
      router.push("/settings/app-preferences");
    }
  };

  const settingsItems = [
    {
      id: "about",
      label: "About",
      icon: <InfoOutlinedIcon />,
      action: () => handleClick("about"),
      hasChevron: true,
    },
    {
      id: "appPreferences",
      label: "App Preferences",
      icon: <TuneOutlinedIcon />,
      action: () => handleClick("appPreferences"),
      hasChevron: true,
    },
    {
      id: "appInfo",
      label: "App Info",
      icon: <PhoneAndroidOutlinedIcon />,
      action: () => handleClick("appInfo"),
      hasChevron: true,
    },
  ];

  const legalItems = [
    {
      id: "termsOfService",
      label: "Terms of Service",
      icon: <DescriptionOutlinedIcon />,
      action: () => handleClick("termsOfService"),
      hasChevron: true,
    },
    {
      id: "privacyPolicy",
      label: "Privacy Policy",
      icon: <PrivacyTipOutlinedIcon />,
      action: () => handleClick("privacyPolicy"),
      hasChevron: true,
    },
    {
      id: "openSource",
      label: "Open Source",
      icon: <CodeOutlinedIcon />,
      action: () => handleClick("openSource"),
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
          primaryTypographyProps={{
            sx: {
              fontSize: "16px",
              fontWeight: 500,
              color: "#1F2937",
              letterSpacing: "-0.01em",
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
      <PageTitleBar title="Settings" />

      <Box sx={{ width: "100%", maxWidth: 420, px: 2, mt: 2 }}>
        {/* App Settings Section */}
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
              App
            </Typography>
          </Box>
          <List sx={{ p: 0, pb: 1 }}>
            {settingsItems.map((item, index) =>
              renderListItem(item, index === settingsItems.length - 1),
            )}
          </List>
        </Card>

        {/* Legal & Support Section */}
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
              Legal & Support
            </Typography>
          </Box>
          <List sx={{ p: 0, pb: 1 }}>
            {legalItems.map((item, index) =>
              renderListItem(item, index === legalItems.length - 1),
            )}
          </List>
        </Card>

        {/* Footer */}
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
              cursor: "pointer",
              transition: "color 0.2s ease",
              "&:hover": {
                color: "#8B5CF6",
              },
            }}
            onClick={() => handleClick("footer")}
          >
            NotWallet - A Crypto Dollar Wallet
            <br />
            <Box
              component="span"
              sx={{
                color: "#8B5CF6",
                fontWeight: 500,
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              bach.money
            </Box>
            <br />© {new Date().getFullYear()} The Stable Foundation
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
