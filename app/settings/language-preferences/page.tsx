"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import LanguageIcon from "@mui/icons-material/Language";
import { useLang } from "../../../src/LanguageContext";
import PageChildrenTitleBar from "@app/lib/components/page-children-title-bar";
import { haptics } from "@app/lib/utils/haptics";
import { SupportedLanguages } from "@src/i18n";

export default function LanguagePreferencesPage() {
  const { t, lang, setLang } = useLang();

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setLang(event.target.value as SupportedLanguages);
  };

  const handleNavClick = async () => {
    await haptics.navigation();
  };

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
      <PageChildrenTitleBar title={t.languagePreferences} />
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
          <List sx={{ p: 0, pb: 1 }}>
            {/* Language Selection */}
            <ListItem
              sx={{
                px: 0,
                py: 3,
                borderRadius: "12px",
                mx: 2,
                mb: 1,
                flexDirection: "column",
                alignItems: "flex-start",
              }}
              component="li"
              disablePadding
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  mb: 2,
                }}
              >
                <ListItemIcon
                  sx={{
                    color: "#8B5CF6",
                    minWidth: 48,
                    ml: 2,
                  }}
                >
                  <LanguageIcon />
                </ListItemIcon>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: 500,
                      color: "#1F2937",
                      letterSpacing: "-0.01em",
                      mb: 0.5,
                    }}
                  >
                    {t.language}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      color: "#6B7280",
                    }}
                  >
                    {t.selectLanguage}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  width: "100%",
                  pl: 6,
                  pr: 2,
                }}
              >
                <select
                  className="rounded border px-2 py-1 bg-white text-sm text-primay-light cursor-pointer shadow"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    fontSize: "15px",
                    borderRadius: "12px",
                    border: "1px solid rgba(139, 92, 246, 0.2)",
                    backgroundColor: "#FFFFFF",
                    color: "#1F2937",
                    cursor: "pointer",
                    outline: "none",
                  }}
                  value={lang}
                  onChange={handleLanguageChange}
                  onClick={handleNavClick}
                  aria-label="Change language"
                >
                  <option value="en">English</option>
                  <option value="sv">Svenska</option>
                  <option value="id">Bahasa Indonesia</option>
                </select>
              </Box>
            </ListItem>
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
              {t.changesApplyImmediately}
            </Typography>
          </Box>
        </Card>
      </Box>
    </Box>
  );
}
