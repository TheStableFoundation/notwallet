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
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PrivacyTipOutlinedIcon from "@mui/icons-material/PrivacyTipOutlined";
import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import PhoneAndroidOutlinedIcon from "@mui/icons-material/PhoneAndroidOutlined";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SettingsIcon from "@mui/icons-material/Settings";
import { openUrl } from "@tauri-apps/plugin-opener";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";
import Confetti from "react-confetti";
import { invoke } from "@tauri-apps/api/core";
import { useNavigate } from "react-router-dom";
import { useLang } from "@src/LanguageContext";

type SettingItem = {
  id: string;
  label: string;
  icon: React.ReactElement;
  action: () => void;
  hasChevron: boolean;
};

export default function SettingsPage() {
  const router = useNavigate();
  const { t } = useLang();
  const [footerClickCount, setFooterClickCount] = React.useState(0);
  const [showModal, setShowModal] = React.useState(false);
  const [showConfetti, setShowConfetti] = React.useState(false);
  const [windowDimensions, setWindowDimensions] = React.useState({
    width: 0,
    height: 0,
  });
  const [isDebug, setIsDebug] = React.useState(false);

  React.useEffect(() => {
    const updateDimensions = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Centralized click handler for all links
  const handleClick = async (
    type:
      | "about"
      | "openSource"
      | "footer"
      | "privacyPolicy"
      | "termsOfService"
      | "appInfo"
      | "debugSetting"
      | "appPreferences"
      | "languagePreferences",
  ) => {
    await selectionFeedback();
    if (type === "about") {
      router("/settings/about");
    } else if (type === "privacyPolicy") {
      openUrl("https://notwallet.eu/privacy");
    } else if (type === "termsOfService") {
      openUrl("https://notwallet.eu/terms");
    } else if (type === "openSource") {
      openUrl("https://github.com/TheStableFoundation/notwallet");
    } else if (type === "footer") {
      const newCount = footerClickCount + 1;
      setFooterClickCount(newCount);
      if (newCount === 3) {
        setShowConfetti(true);
        setShowModal(true);
        setTimeout(() => {
          setShowConfetti(false);
        }, 5000);
      }
    } else if (type === "appInfo") {
      router("/settings/app-info");
    } else if (type === "appPreferences") {
      router("/settings/app-preferences");
    } else if (type === "languagePreferences") {
      router("/settings/language-preferences");
    } else if (type === "debugSetting") {
      router("/settings/debug");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFooterClickCount(0); // Reset counter after showing modal
  };

  const settingsItems = (isDebug: boolean) => {
    let settings: SettingItem[] = [
      {
        id: "about",
        label: t.about,
        icon: <InfoOutlinedIcon />,
        action: () => handleClick("about"),
        hasChevron: true,
      },
      {
        id: "appInfo",
        label: t.appInfo,
        icon: <PhoneAndroidOutlinedIcon />,
        action: () => handleClick("appInfo"),
        hasChevron: true,
      },
      {
        id: "languagePreferences",
        label: t.languagePreferences,
        icon: <SettingsApplicationsIcon />,
        action: () => handleClick("languagePreferences"),
        hasChevron: true,
      },
    ];

    if (isDebug) {
      settings.push({
        id: "debugSetting",
        label: "Debug Settings",
        icon: <SettingsIcon />,
        action: () => handleClick("debugSetting"),
        hasChevron: true,
      });
    }

    return settings;
  };

  const legalItems = [
    {
      id: "termsOfService",
      label: t.termsOfService,
      icon: <DescriptionOutlinedIcon />,
      action: () => handleClick("termsOfService"),
      hasChevron: true,
    },
    {
      id: "privacyPolicy",
      label: t.privacyPolicy,
      icon: <PrivacyTipOutlinedIcon />,
      action: () => handleClick("privacyPolicy"),
      hasChevron: true,
    },
    {
      id: "openSource",
      label: t.openSource,
      icon: <CodeOutlinedIcon />,
      action: () => handleClick("openSource"),
      hasChevron: true,
    },
  ];

  const init = async () => {
    const isDebug = await invoke<boolean>("is_debug");
    setIsDebug(isDebug);
  };

  React.useEffect(() => {
    init();
  }, []);

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
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pb: 8,
      }}
    >
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
              {t.app}
            </Typography>
          </Box>
          <List sx={{ p: 0, pb: 1 }}>
            {settingsItems(isDebug).map((item, index) =>
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
              {t.legalSupport}
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
            fontWeight="bold"
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
            {t.stableFoundationCopyright.replace(
              "{year}",
              new Date().getFullYear().toString(),
            )}
          </Typography>
        </Box>
      </Box>

      {/* Confetti */}
      {showConfetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          numberOfPieces={200}
          recycle={false}
          gravity={0.3}
        />
      )}

      {/* Congratulations Modal */}
      <Modal
        open={showModal}
        onClose={handleCloseModal}
        aria-labelledby="congratulations-modal-title"
        aria-describedby="congratulations-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 400 },
            bgcolor: "background.paper",
            borderRadius: "20px",
            boxShadow: "0 8px 32px rgba(139, 92, 246, 0.2)",
            p: 4,
            border: "1px solid rgba(139, 92, 246, 0.1)",
          }}
        >
          <Typography
            id="congratulations-modal-title"
            variant="h5"
            component="h2"
            sx={{
              mb: 2,
              fontWeight: 700,
              color: "#1F2937",
              textAlign: "center",
              fontSize: { xs: "1.3rem", sm: "1.5rem" },
            }}
          >
            {t.congratulations}
          </Typography>
          <Typography
            id="congratulations-modal-description"
            sx={{
              mb: 3,
              color: "#6B7280",
              lineHeight: 1.6,
              textAlign: "center",
            }}
          >
            {t.congratulationsMessage
              .split("info@bach.money")
              .map((part, index) =>
                index === 0 ? (
                  part
                ) : (
                  <>
                    <strong style={{ color: "#8B5CF6" }}>
                      info@bach.money
                    </strong>
                    {part
                      .split("SETTINGS_EASTER_EGG")
                      .map((subpart, subindex) =>
                        subindex === 0 ? (
                          subpart
                        ) : (
                          <>
                            <strong style={{ color: "#8B5CF6" }}>
                              SETTINGS_EASTER_EGG
                            </strong>
                            {subpart}
                          </>
                        ),
                      )}
                  </>
                ),
              )}
          </Typography>
          <Button
            fullWidth
            variant="contained"
            onClick={handleCloseModal}
            sx={{
              mt: 2,
              py: 1.5,
              borderRadius: "12px",
              bgcolor: "#8B5CF6",
              "&:hover": {
                bgcolor: "#7C3AED",
              },
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            {t.gotIt}
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
