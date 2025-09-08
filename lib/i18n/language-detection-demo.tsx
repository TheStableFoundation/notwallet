"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  Stack,
  Chip,
  Divider,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useI18n } from "./provider";
import {
  detectLanguage,
  getSupportedLanguages,
  debugLanguageDetection,
} from "./language-detector";
import LanguageSwitcher from "./language-switcher";

interface BrowserInfo {
  navigatorLanguage: string;
  navigatorLanguages: string[];
  detectedLanguage: string;
  detectionSource: string;
  savedPreference: string | null;
}

export default function LanguageDetectionDemo() {
  const { t, language } = useI18n();
  const [browserInfo, setBrowserInfo] = useState<BrowserInfo | null>(null);

  useEffect(() => {
    // Get browser language information
    const detection = detectLanguage();
    const savedLang =
      typeof localStorage !== "undefined"
        ? localStorage.getItem("notwallet-language")
        : null;

    setBrowserInfo({
      navigatorLanguage: navigator.language || "unknown",
      navigatorLanguages: navigator.languages
        ? [...navigator.languages]
        : [navigator.language || "unknown"],
      detectedLanguage: detection.language,
      detectionSource: detection.source,
      savedPreference: savedLang,
    });

    // Debug language detection in console
    debugLanguageDetection();
  }, []);

  const supportedLanguages = getSupportedLanguages();

  return (
    <Box sx={{ p: 3, maxWidth: 900, mx: "auto" }}>
      <Stack spacing={3}>
        {/* Header */}
        <Card sx={{ p: 3, borderRadius: "16px" }}>
          <Typography variant="h4" gutterBottom>
            🌍 Language Detection Demo
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            This demo shows how NotWallet automatically detects your browser
            language
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Chip
              label={`Current: ${language === "en" ? "English" : "Bahasa Indonesia"}`}
              color="primary"
              variant="filled"
            />
            <LanguageSwitcher variant="minimal" />
          </Box>
        </Card>

        {/* Detection Information */}
        <Card sx={{ p: 3, borderRadius: "16px" }}>
          <Typography variant="h6" gutterBottom>
            Language Detection Results
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {browserInfo && (
            <TableContainer
              component={Paper}
              variant="outlined"
              sx={{ borderRadius: "12px" }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Property</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Value</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>navigator.language</TableCell>
                    <TableCell>
                      <Chip
                        label={browserInfo.navigatorLanguage}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>Primary browser language</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>navigator.languages</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} flexWrap="wrap">
                        {browserInfo.navigatorLanguages
                          .slice(0, 3)
                          .map((lang, index) => (
                            <Chip
                              key={index}
                              label={lang}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        {browserInfo.navigatorLanguages.length > 3 && (
                          <Chip
                            label={`+${browserInfo.navigatorLanguages.length - 3} more`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>All preferred languages</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Detected Language</TableCell>
                    <TableCell>
                      <Chip
                        label={browserInfo.detectedLanguage.toUpperCase()}
                        size="small"
                        color="success"
                      />
                    </TableCell>
                    <TableCell>Final language selection</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Detection Source</TableCell>
                    <TableCell>
                      <Chip
                        label={browserInfo.detectionSource}
                        size="small"
                        color={
                          browserInfo.detectionSource === "saved"
                            ? "primary"
                            : browserInfo.detectionSource === "browser"
                              ? "secondary"
                              : "default"
                        }
                      />
                    </TableCell>
                    <TableCell>
                      {browserInfo.detectionSource === "saved" &&
                        "From localStorage"}
                      {browserInfo.detectionSource === "browser" &&
                        "From browser settings"}
                      {browserInfo.detectionSource === "fallback" &&
                        "Default fallback"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Saved Preference</TableCell>
                    <TableCell>
                      {browserInfo.savedPreference ? (
                        <Chip
                          label={browserInfo.savedPreference.toUpperCase()}
                          size="small"
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          None
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>User&apos;s previous choice</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Card>

        {/* Detection Logic Explanation */}
        <Card sx={{ p: 3, borderRadius: "16px" }}>
          <Typography variant="h6" gutterBottom>
            Detection Priority Logic
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Stack spacing={2}>
            <Alert severity="info" sx={{ borderRadius: "12px" }}>
              <Typography variant="body2">
                NotWallet uses a 3-tier language detection system:
              </Typography>
            </Alert>

            <Box sx={{ pl: 2 }}>
              <Stack spacing={1.5}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Chip label="1" color="primary" size="small" />
                  <Typography variant="body2">
                    <strong>Saved Preference:</strong> Check localStorage for
                    previous user choice
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Chip label="2" color="secondary" size="small" />
                  <Typography variant="body2">
                    <strong>Browser Detection:</strong> Use navigator.language
                    and navigator.languages
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Chip label="3" color="default" size="small" />
                  <Typography variant="body2">
                    <strong>Fallback:</strong> Default to English if no match
                    found
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Card>

        {/* Supported Languages */}
        <Card sx={{ p: 3, borderRadius: "16px" }}>
          <Typography variant="h6" gutterBottom>
            Supported Languages
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Stack spacing={2}>
            {supportedLanguages.map((lang) => (
              <Box
                key={lang.code}
                sx={{
                  p: 2,
                  border: "1px solid",
                  borderColor:
                    language === lang.code ? "primary.main" : "divider",
                  borderRadius: "12px",
                  bgcolor:
                    language === lang.code ? "primary.50" : "background.paper",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Typography variant="h6" sx={{ fontSize: "24px" }}>
                  {lang.flag}
                </Typography>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {lang.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {lang.nativeName} • Code: {lang.code}
                  </Typography>
                </Box>
                {language === lang.code && (
                  <Chip label="Active" color="primary" size="small" />
                )}
              </Box>
            ))}
          </Stack>
        </Card>

        {/* Technical Details */}
        <Card sx={{ p: 3, borderRadius: "16px" }}>
          <Typography variant="h6" gutterBottom>
            Technical Implementation
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Stack spacing={2}>
            <Alert severity="success" sx={{ borderRadius: "12px" }}>
              <Typography variant="body2">
                <strong>Static Export Compatible:</strong> All detection happens
                client-side
              </Typography>
            </Alert>

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Browser Language Examples:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip label="en-US → en" size="small" variant="outlined" />
                <Chip label="id-ID → id" size="small" variant="outlined" />
                <Chip label="en-GB → en" size="small" variant="outlined" />
                <Chip
                  label="ja-JP → fallback"
                  size="small"
                  variant="outlined"
                />
              </Stack>
            </Box>

            <Typography variant="body2" color="text.secondary">
              The system extracts language codes from full locale strings and
              matches them against supported languages. If browser detection
              finds Indonesian (id) or English (en), it automatically selects
              that language and saves it as the user preference.
            </Typography>
          </Stack>
        </Card>

        {/* Test Instructions */}
        <Card sx={{ p: 3, borderRadius: "16px", bgcolor: "grey.50" }}>
          <Typography variant="h6" gutterBottom>
            🧪 Testing Instructions
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Stack spacing={1}>
            <Typography variant="body2">
              1. Clear localStorage and refresh to see browser detection
            </Typography>
            <Typography variant="body2">
              2. Change browser language to Indonesian and refresh
            </Typography>
            <Typography variant="body2">
              3. Use the language switcher above to save preferences
            </Typography>
            <Typography variant="body2">
              4. Check browser console for detailed detection logs
            </Typography>
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}
