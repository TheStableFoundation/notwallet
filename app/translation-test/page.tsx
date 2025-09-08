"use client";

import React from "react";
import {
  Box,
  Typography,
  Card,
  Stack,
  Chip,
  Divider,
  Button,
  Alert,
} from "@mui/material";
import { useI18n } from "@/lib/i18n/provider";
import LanguageSwitcher from "@/lib/i18n/language-switcher";
import PageChildrenTitleBar from "@/lib/components/page-children-title-bar";
import { useRouter } from "next/navigation";

export default function TranslationTestPage() {
  const { t, language } = useI18n();
  const router = useRouter();

  // Test translation categories
  const translationTests = [
    {
      category: "Common UI Elements",
      namespace: "common",
      keys: [
        "add",
        "create",
        "import",
        "export",
        "delete",
        "settings",
        "save",
        "cancel",
        "back",
        "preferences",
      ],
    },
    {
      category: "Wallet Operations",
      namespace: "wallet",
      keys: [
        "title",
        "settings",
        "addWallet",
        "showSeedPhrase",
        "importSeedPhrase",
        "createNew",
        "management",
        "importRecovery",
      ],
    },
    {
      category: "Financial Terms",
      namespace: "finance",
      keys: [
        "balance",
        "amount",
        "send",
        "receive",
        "transfer",
        "transaction",
        "fee",
        "total",
        "available",
        "pending",
        "confirmed",
      ],
    },
    {
      category: "Security",
      namespace: "security",
      keys: ["seedPhrase", "recoveryPhrase", "backupWallet", "storeOffline"],
    },
    {
      category: "Language Settings",
      namespace: "language",
      keys: ["language", "english", "indonesian", "selectLanguage"],
    },
    {
      category: "About Page",
      namespace: "about",
      keys: [
        "title",
        "appName",
        "description",
        "developedBy",
        "stableFoundation",
      ],
    },
    {
      category: "App Info Page",
      namespace: "appInfo",
      keys: [
        "title",
        "applicationInformation",
        "version",
        "installationId",
        "loading",
        "supportNote",
      ],
    },
  ];

  const currentYear = new Date().getFullYear();

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
      <PageChildrenTitleBar title="Translation Test" />
      <Box sx={{ width: "100%", maxWidth: 1200, px: 2 }}>
        {/* Header */}
        <Card sx={{ p: 3, mb: 3, borderRadius: "20px" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Translation Verification
            </Typography>
            <LanguageSwitcher />
          </Stack>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Testing all translated strings across the application. Current
            language:{" "}
            <Chip
              label={
                language === "en"
                  ? t("language.english")
                  : t("language.indonesian")
              }
              color="primary"
              size="small"
            />
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Button
              variant="outlined"
              size="small"
              onClick={() => router.push("/settings/about")}
            >
              View About Page
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => router.push("/settings/app-info")}
            >
              View App Info Page
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => router.push("/settings/app-preferences")}
            >
              View Preferences
            </Button>
          </Stack>
        </Card>

        {/* Special Translations with Interpolation */}
        <Card sx={{ p: 3, mb: 3, borderRadius: "20px" }}>
          <Typography variant="h6" gutterBottom>
            Special Translations (with variables)
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={2}>
            <Box
              sx={{
                p: 2,
                bgcolor: "rgba(139, 92, 246, 0.04)",
                borderRadius: "12px",
                border: "1px solid rgba(139, 92, 246, 0.08)",
              }}
            >
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Copyright with year interpolation:
              </Typography>
              <Typography variant="body1" sx={{ fontFamily: "monospace" }}>
                {t("about.copyright", { year: currentYear })}
              </Typography>
            </Box>
          </Stack>
        </Card>

        {/* Translation Cards */}
        <Stack spacing={3}>
          {translationTests.map((testGroup) => (
            <Card key={testGroup.category} sx={{ p: 3, borderRadius: "20px" }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                {testGroup.category}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mb: 2, display: "block" }}
              >
                Namespace: {testGroup.namespace}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack direction="row" spacing={1.5} flexWrap="wrap">
                {testGroup.keys.map((key) => {
                  const fullKey = `${testGroup.namespace}.${key}`;
                  const translation = t(fullKey);
                  const hasTranslation = translation !== fullKey;

                  return (
                    <Box
                      key={key}
                      sx={{
                        p: 1.5,
                        borderRadius: "8px",
                        bgcolor: hasTranslation
                          ? "rgba(34, 197, 94, 0.04)"
                          : "rgba(239, 68, 68, 0.04)",
                        border: `1px solid ${
                          hasTranslation
                            ? "rgba(34, 197, 94, 0.1)"
                            : "rgba(239, 68, 68, 0.1)"
                        }`,
                        minWidth: "200px",
                        maxWidth: "300px",
                        flex: "1 1 200px",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: "11px",
                          color: "text.secondary",
                          fontFamily: "monospace",
                          mb: 0.5,
                        }}
                      >
                        {fullKey}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: hasTranslation ? "success.main" : "error.main",
                        }}
                      >
                        {translation}
                      </Typography>
                    </Box>
                  );
                })}
              </Stack>
            </Card>
          ))}
        </Stack>

        {/* Long Text Translations */}
        <Card sx={{ p: 3, mt: 3, borderRadius: "20px" }}>
          <Typography variant="h6" gutterBottom>
            Long Text Translations
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={3}>
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                gutterBottom
                sx={{ fontSize: "11px", fontFamily: "monospace" }}
              >
                security.securityNotice
              </Typography>
              <Alert
                severity="warning"
                sx={{
                  borderRadius: "12px",
                  "& .MuiAlert-message": { lineHeight: 1.6 },
                }}
              >
                {t("security.securityNotice")}
              </Alert>
            </Box>
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                gutterBottom
                sx={{ fontSize: "11px", fontFamily: "monospace" }}
              >
                about.description
              </Typography>
              <Box
                sx={{
                  p: 2,
                  bgcolor: "rgba(139, 92, 246, 0.04)",
                  borderRadius: "12px",
                  border: "1px solid rgba(139, 92, 246, 0.08)",
                }}
              >
                <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                  {t("about.description")}
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Card>

        {/* Translation Statistics */}
        <Card sx={{ p: 3, mt: 3, borderRadius: "20px" }}>
          <Typography variant="h6" gutterBottom>
            Translation Statistics
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Stack
            direction="row"
            spacing={4}
            justifyContent="center"
            flexWrap="wrap"
          >
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
                {translationTests.reduce(
                  (total, group) => total + group.keys.length,
                  0,
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Translation Keys
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h4"
                color="success.main"
                sx={{ fontWeight: 700 }}
              >
                {translationTests.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Translation Categories
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h4"
                color="secondary.main"
                sx={{ fontWeight: 700 }}
              >
                2
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Supported Languages
              </Typography>
            </Box>
          </Stack>
        </Card>

        {/* Test Instructions */}
        <Card sx={{ p: 3, mt: 3, borderRadius: "20px", bgcolor: "grey.50" }}>
          <Typography variant="h6" gutterBottom>
            🧪 Testing Instructions
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={1}>
            <Typography variant="body2">
              1. Use the language switcher above to toggle between English and
              Indonesian
            </Typography>
            <Typography variant="body2">
              2. Verify that all translation keys show proper translations
              (green boxes)
            </Typography>
            <Typography variant="body2">
              3. Check that red boxes indicate missing translations that need
              attention
            </Typography>
            <Typography variant="body2">
              4. Test the About and App Info pages using the buttons above
            </Typography>
            <Typography variant="body2">
              5. Verify long text translations maintain proper formatting and
              meaning
            </Typography>
            <Typography variant="body2">
              6. Check that variable interpolation works correctly (copyright
              year)
            </Typography>
          </Stack>
        </Card>
      </Box>
    </Box>
  );
}
