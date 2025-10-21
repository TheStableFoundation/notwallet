"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import List from "@mui/material/List";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import { getVersion } from "@tauri-apps/api/app";
import { invoke } from "@tauri-apps/api/core";
import PageChildrenTitleBar from "@app/lib/components/page-children-title-bar";
import { useLang } from "../../../src/LanguageContext";

export default function AppInfoPage() {
  const { t } = useLang();
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

  const appInfoItems = [
    {
      id: "version",
      label: t.version,
      value: version ? `${version}` : t.loading,
      icon: <InfoOutlinedIcon />,
    },
    {
      id: "installationId",
      label: t.installationId,
      value: installationId || t.loading,
      icon: <FingerprintIcon />,
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "linear-gradient(135deg, #FAFBFF 0%, #F8FAFF 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 4,
      }}
    >
      <PageChildrenTitleBar title={t.appInfo} />

      {/* Main Content Card */}
      <Box sx={{ width: "100%", maxWidth: 420, px: 2 }}>
        <Card
          sx={{
            width: "100%",
            borderRadius: "20px",
            boxShadow: "0 4px 20px rgba(139, 92, 246, 0.08)",
            border: "1px solid rgba(139, 92, 246, 0.06)",
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
              {t.applicationInformation}
            </Typography>
          </Box>

          <List sx={{ p: 0, pb: 1 }}>
            {appInfoItems.map((item, index) => (
              <React.Fragment key={item.id}>
                <ListItem
                  sx={{
                    pl: 0,
                    pr: 8,
                    py: 2,
                    borderRadius: "12px",
                    mx: 2,
                    mb: 1,
                  }}
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
                    secondary={item.value}
                    primaryTypographyProps={{
                      sx: {
                        fontSize: "16px",
                        fontWeight: 500,
                        color: "#1F2937",
                        letterSpacing: "-0.01em",
                        mb: 0.5,
                      },
                    }}
                    secondaryTypographyProps={{
                      sx: {
                        fontSize: "14px",
                        fontWeight: 400,
                        color: "#6B7280",
                        fontFamily: "monospace",
                        wordBreak: "break-all",
                        lineHeight: 1.4,
                      },
                    }}
                  />
                </ListItem>
                {index < appInfoItems.length - 1 && (
                  <Divider
                    sx={{
                      mx: 6,
                      borderColor: "rgba(139, 92, 246, 0.08)",
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </List>

          <Divider sx={{ borderColor: "rgba(139, 92, 246, 0.08)", mt: 2 }} />

          {/* Footer Note */}
          <Box
            sx={{
              p: 3,
              textAlign: "center",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontSize: "12px",
                color: "#9CA3AF",
                lineHeight: 1.5,
              }}
            >
              {t.supportNote}
            </Typography>
          </Box>
        </Card>
      </Box>
    </Box>
  );
}
