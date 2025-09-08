"use client";

import React from "react";
import {
  Box,
  Typography,
  Card,
  Button,
  Stack,
  Divider,
  Chip,
} from "@mui/material";
import {
  useI18n,
  formatCurrency,
  formatNumber,
  formatDate,
} from "@/lib/i18n/provider";
import LanguageDetectionDemo from "@/lib/i18n/language-detection-demo";
import PageChildrenTitleBar from "@/lib/components/page-children-title-bar";
import { useRouter } from "next/navigation";

export default function I18nTestPage() {
  const { t, language } = useI18n();
  const router = useRouter();

  // Sample financial data for demonstration
  const sampleBalance = 1234567.89;
  const sampleAmount = 999.99;
  const sampleDate = new Date();

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
      <PageChildrenTitleBar title="i18n Test & Demo" />
      <Box sx={{ width: "100%", maxWidth: 1000, px: 2 }}>
        {/* Navigation Card */}
        <Card sx={{ p: 3, mb: 3, borderRadius: "20px" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              i18n Implementation Test
            </Typography>
            <Button
              variant="outlined"
              onClick={() => router.push("/settings/app-preferences")}
              sx={{
                borderRadius: "12px",
                textTransform: "none",
                px: 3,
                py: 1.5,
              }}
            >
              {t("common.preferences")} → {t("language.language")}
            </Button>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Language settings have been moved to Settings → Language for better
            organization. This page demonstrates the automatic browser language
            detection feature.
          </Typography>
        </Card>

        {/* Language Detection Demo */}
        <LanguageDetectionDemo />

        {/* Quick Translation Tests */}
        <Stack spacing={3} mt={3}>
          {/* Common Translations */}
          <Card sx={{ p: 3, borderRadius: "16px" }}>
            <Typography variant="h6" gutterBottom>
              {t("common.settings")} - Quick Translation Test
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip label={t("common.add")} variant="outlined" />
              <Chip label={t("common.create")} variant="outlined" />
              <Chip label={t("common.import")} variant="outlined" />
              <Chip label={t("common.export")} variant="outlined" />
              <Chip label={t("common.delete")} variant="outlined" />
              <Chip label={t("common.security")} variant="outlined" />
            </Stack>
          </Card>

          {/* Wallet Translations */}
          <Card sx={{ p: 3, borderRadius: "16px" }}>
            <Typography variant="h6" gutterBottom>
              {t("wallet.title")} - Financial Terms
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip label={t("wallet.addWallet")} variant="outlined" />
              <Chip label={t("wallet.showSeedPhrase")} variant="outlined" />
              <Chip label={t("finance.balance")} variant="outlined" />
              <Chip label={t("finance.send")} variant="outlined" />
              <Chip label={t("finance.receive")} variant="outlined" />
              <Chip label={t("finance.transaction")} variant="outlined" />
            </Stack>
          </Card>

          {/* Financial Formatting */}
          <Card sx={{ p: 3, borderRadius: "16px" }}>
            <Typography variant="h6" gutterBottom>
              Currency & Number Formatting
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={2}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Large Amount:
                </Typography>
                <Typography variant="h6" color="primary">
                  {formatCurrency(sampleBalance, language)}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Token Amount:
                </Typography>
                <Typography variant="body1">
                  {formatNumber(sampleAmount, language)} {t("finance.tokens")}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Current Date:
                </Typography>
                <Typography variant="body1">
                  {formatDate(sampleDate, language)}
                </Typography>
              </Box>
            </Stack>
          </Card>

          {/* Security Notice */}
          <Card
            sx={{
              p: 3,
              borderRadius: "16px",
              bgcolor: "rgba(139, 92, 246, 0.04)",
              border: "1px solid rgba(139, 92, 246, 0.08)",
            }}
          >
            <Typography variant="h6" gutterBottom>
              {t("security.seedPhrase")} - Security Notice
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" sx={{ lineHeight: 1.6, mb: 2 }}>
              {t("security.securityNotice")}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#8B5CF6",
                fontWeight: 500,
              }}
            >
              {t("security.storeOffline")}
            </Typography>
          </Card>
        </Stack>
      </Box>
    </Box>
  );
}
