"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import LanguageIcon from "@mui/icons-material/Language";
import { useColorScheme } from "@mui/material/styles";
import PageChildrenTitleBar from "@lib/components/page-children-title-bar";
import { useI18n } from "@lib/i18n/provider";
import type { Language } from "@lib/i18n/provider";

export default function AppPreferences() {
  const { mode, setMode } = useColorScheme();
  const { t, language, setLanguage } = useI18n();

  const handleThemeChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    await selectionFeedback();
    setMode(event.target.value as "system" | "light" | "dark");
  };

  const handleLanguageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    await selectionFeedback();
    await setLanguage(event.target.value as Language);
  };

  if (!mode) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "linear-gradient(135deg, #FAFBFF 0%, #F8FAFF 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography sx={{ color: "#6B7280" }}>
          {t("common.loading")}...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "linear-gradient(135deg, #FAFBFF 0%, #F8FAFF 100%)",
        background: "linear-gradient(135deg, #FAFBFF 0%, #F8FAFF 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 4,
      }}
    >
      <PageChildrenTitleBar title={t("common.preferences")} />

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
              {t("common.preferences")}
            </Typography>
          </Box>

          <List sx={{ p: 0, pb: 1 }}>
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
                  <PaletteOutlinedIcon />
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
                    {t("common.theme")}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      color: "#6B7280",
                    }}
                  >
                    {t("common.chooseAppearance")}
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
                <FormControl component="fieldset" sx={{ width: "100%" }}>
                  <RadioGroup
                    aria-labelledby="theme-selection"
                    name="theme-selection"
                    value={mode}
                    onChange={handleThemeChange}
                    sx={{ gap: 1 }}
                  >
                    <FormControlLabel
                      value="system"
                      control={
                        <Radio
                          sx={{
                            color: "#D1D5DB",
                            "&.Mui-checked": {
                              color: "#8B5CF6",
                            },
                          }}
                        />
                      }
                      label={
                        <Box>
                          <Typography
                            sx={{
                              fontSize: "15px",
                              fontWeight: 500,
                              color: "#1F2937",
                            }}
                          >
                            {t("common.system")}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "13px",
                              color: "#6B7280",
                              mt: 0.25,
                            }}
                          >
                            {t("common.matchDevice")}
                          </Typography>
                        </Box>
                      }
                      sx={{
                        mx: 0,
                        py: 1.5,
                        px: 2,
                        borderRadius: "12px",
                        border: "1px solid transparent",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          bgcolor: "rgba(139, 92, 246, 0.04)",
                          border: "1px solid rgba(139, 92, 246, 0.1)",
                        },
                        "& .MuiFormControlLabel-label": {
                          flex: 1,
                        },
                      }}
                    />
                    <FormControlLabel
                      value="light"
                      control={
                        <Radio
                          sx={{
                            color: "#D1D5DB",
                            "&.Mui-checked": {
                              color: "#8B5CF6",
                            },
                          }}
                        />
                      }
                      label={
                        <Box>
                          <Typography
                            sx={{
                              fontSize: "15px",
                              fontWeight: 500,
                              color: "#1F2937",
                            }}
                          >
                            {t("common.light")}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "13px",
                              color: "#6B7280",
                              mt: 0.25,
                            }}
                          >
                            {t("common.cleanBright")}
                          </Typography>
                        </Box>
                      }
                      sx={{
                        mx: 0,
                        py: 1.5,
                        px: 2,
                        borderRadius: "12px",
                        border: "1px solid transparent",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          bgcolor: "rgba(139, 92, 246, 0.04)",
                          border: "1px solid rgba(139, 92, 246, 0.1)",
                        },
                        "& .MuiFormControlLabel-label": {
                          flex: 1,
                        },
                      }}
                    />
                    <FormControlLabel
                      value="dark"
                      control={
                        <Radio
                          sx={{
                            color: "#D1D5DB",
                            "&.Mui-checked": {
                              color: "#8B5CF6",
                            },
                          }}
                        />
                      }
                      label={
                        <Box>
                          <Typography
                            sx={{
                              fontSize: "15px",
                              fontWeight: 500,
                              color: "#1F2937",
                            }}
                          >
                            {t("common.dark")}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "13px",
                              color: "#6B7280",
                              mt: 0.25,
                            }}
                          >
                            {t("common.easyEyes")}
                          </Typography>
                        </Box>
                      }
                      sx={{
                        mx: 0,
                        py: 1.5,
                        px: 2,
                        borderRadius: "12px",
                        border: "1px solid transparent",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          bgcolor: "rgba(139, 92, 246, 0.04)",
                          border: "1px solid rgba(139, 92, 246, 0.1)",
                        },
                        "& .MuiFormControlLabel-label": {
                          flex: 1,
                        },
                      }}
                    />
                  </RadioGroup>
                </FormControl>
              </Box>
            </ListItem>

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
                    {t("language.language")}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      color: "#6B7280",
                    }}
                  >
                    {t("language.selectLanguage")}
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
                <FormControl component="fieldset" sx={{ width: "100%" }}>
                  <RadioGroup
                    aria-labelledby="language-selection"
                    name="language-selection"
                    value={language}
                    onChange={handleLanguageChange}
                    sx={{ gap: 1 }}
                  >
                    <FormControlLabel
                      value="en"
                      control={
                        <Radio
                          sx={{
                            color: "#D1D5DB",
                            "&.Mui-checked": {
                              color: "#8B5CF6",
                            },
                          }}
                        />
                      }
                      label={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <span style={{ fontSize: "16px" }}>🇺🇸</span>
                          <Box>
                            <Typography
                              sx={{
                                fontSize: "15px",
                                fontWeight: 500,
                                color: "#1F2937",
                              }}
                            >
                              {t("language.english")}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "13px",
                                color: "#6B7280",
                                mt: 0.25,
                              }}
                            >
                              English
                            </Typography>
                          </Box>
                        </Box>
                      }
                      sx={{
                        mx: 0,
                        py: 1.5,
                        px: 2,
                        borderRadius: "12px",
                        border: "1px solid transparent",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          bgcolor: "rgba(139, 92, 246, 0.04)",
                          border: "1px solid rgba(139, 92, 246, 0.1)",
                        },
                        "& .MuiFormControlLabel-label": {
                          flex: 1,
                        },
                      }}
                    />
                    <FormControlLabel
                      value="id"
                      control={
                        <Radio
                          sx={{
                            color: "#D1D5DB",
                            "&.Mui-checked": {
                              color: "#8B5CF6",
                            },
                          }}
                        />
                      }
                      label={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <span style={{ fontSize: "16px" }}>🇮🇩</span>
                          <Box>
                            <Typography
                              sx={{
                                fontSize: "15px",
                                fontWeight: 500,
                                color: "#1F2937",
                              }}
                            >
                              {t("language.indonesian")}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "13px",
                                color: "#6B7280",
                                mt: 0.25,
                              }}
                            >
                              Bahasa Indonesia
                            </Typography>
                          </Box>
                        </Box>
                      }
                      sx={{
                        mx: 0,
                        py: 1.5,
                        px: 2,
                        borderRadius: "12px",
                        border: "1px solid transparent",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          bgcolor: "rgba(139, 92, 246, 0.04)",
                          border: "1px solid rgba(139, 92, 246, 0.1)",
                        },
                        "& .MuiFormControlLabel-label": {
                          flex: 1,
                        },
                      }}
                    />
                  </RadioGroup>
                </FormControl>
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
              {t("common.changesApplyImmediately")}
            </Typography>
          </Box>
        </Card>
      </Box>
    </Box>
  );
}
