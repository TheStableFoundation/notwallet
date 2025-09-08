"use client";

import React from "react";
import {
  Button,
  Menu,
  MenuItem,
  Box,
  Typography,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import CheckIcon from "@mui/icons-material/Check";
import { useI18n } from "./provider";
import type { Language } from "./provider";
import {
  getSupportedLanguages,
  getLanguageDisplayName,
} from "./language-detector";

const languages = getSupportedLanguages();

interface LanguageSwitcherProps {
  variant?: "button" | "minimal";
  showLabel?: boolean;
}

export default function LanguageSwitcher({
  variant = "button",
  showLabel = true,
}: LanguageSwitcherProps) {
  const { language, setLanguage, t } = useI18n();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageSelect = async (selectedLanguage: Language) => {
    await setLanguage(selectedLanguage);
    handleClose();
  };

  const currentLanguage = languages.find((lang) => lang.code === language);

  if (variant === "minimal") {
    return (
      <>
        <Button
          onClick={handleClick}
          sx={{
            minWidth: "auto",
            p: 1,
            borderRadius: "12px",
            color: "#6B7280",
            "&:hover": {
              bgcolor: "rgba(139, 92, 246, 0.04)",
              color: "#8B5CF6",
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <span style={{ fontSize: "16px" }}>{currentLanguage?.flag}</span>
            {showLabel && (
              <Typography
                variant="body2"
                sx={{ fontSize: "14px", fontWeight: 500 }}
              >
                {currentLanguage?.code.toUpperCase()}
              </Typography>
            )}
          </Box>
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          PaperProps={{
            sx: {
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(139, 92, 246, 0.15)",
              border: "1px solid rgba(139, 92, 246, 0.08)",
              minWidth: "160px",
              mt: 1,
            },
          }}
        >
          {languages.map((lang) => (
            <MenuItem
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              selected={language === lang.code}
              sx={{
                px: 2,
                py: 1.5,
                "&.Mui-selected": {
                  bgcolor: "rgba(139, 92, 246, 0.08)",
                  "&:hover": {
                    bgcolor: "rgba(139, 92, 246, 0.12)",
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: "32px" }}>
                <span style={{ fontSize: "18px" }}>{lang.flag}</span>
              </ListItemIcon>
              <ListItemText
                primary={getLanguageDisplayName(lang.code, language)}
                primaryTypographyProps={{
                  fontSize: "14px",
                  fontWeight: language === lang.code ? 600 : 400,
                  color: language === lang.code ? "#8B5CF6" : "#374151",
                }}
              />
              {language === lang.code && (
                <CheckIcon
                  sx={{
                    fontSize: "16px",
                    color: "#8B5CF6",
                    ml: 1,
                  }}
                />
              )}
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  }

  return (
    <>
      <Button
        onClick={handleClick}
        startIcon={<LanguageIcon />}
        sx={{
          borderRadius: "12px",
          px: 3,
          py: 1.5,
          border: "1px solid rgba(139, 92, 246, 0.12)",
          color: "#6B7280",
          bgcolor: "rgba(255, 255, 255, 0.8)",
          "&:hover": {
            bgcolor: "rgba(139, 92, 246, 0.04)",
            borderColor: "rgba(139, 92, 246, 0.2)",
            color: "#8B5CF6",
          },
          transition: "all 0.2s ease",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <span style={{ fontSize: "16px" }}>{currentLanguage?.flag}</span>
          {showLabel && (
            <Typography
              variant="body2"
              sx={{ fontSize: "14px", fontWeight: 500 }}
            >
              {t("language.language")}
            </Typography>
          )}
        </Box>
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            boxShadow: "0 8px 32px rgba(139, 92, 246, 0.15)",
            border: "1px solid rgba(139, 92, 246, 0.08)",
            minWidth: "200px",
            mt: 1,
            overflow: "hidden",
          },
        }}
      >
        <Box sx={{ p: 2, pb: 1 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontSize: "12px",
              fontWeight: 600,
              color: "#8B5CF6",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              mb: 1,
            }}
          >
            {t("language.selectLanguage")}
          </Typography>
        </Box>

        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => handleLanguageSelect(lang.code)}
            selected={language === lang.code}
            sx={{
              px: 2,
              py: 1.5,
              mx: 1,
              mb: 0.5,
              borderRadius: "8px",
              "&.Mui-selected": {
                bgcolor: "rgba(139, 92, 246, 0.08)",
                "&:hover": {
                  bgcolor: "rgba(139, 92, 246, 0.12)",
                },
              },
              "&:hover": {
                bgcolor: "rgba(139, 92, 246, 0.04)",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: "36px" }}>
              <span style={{ fontSize: "20px" }}>{lang.flag}</span>
            </ListItemIcon>
            <ListItemText
              primary={getLanguageDisplayName(lang.code, language)}
              primaryTypographyProps={{
                fontSize: "14px",
                fontWeight: language === lang.code ? 600 : 400,
                color: language === lang.code ? "#8B5CF6" : "#374151",
              }}
            />
            {language === lang.code && (
              <CheckIcon
                sx={{
                  fontSize: "18px",
                  color: "#8B5CF6",
                  ml: 1,
                }}
              />
            )}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
