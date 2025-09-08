"use client";

import React from "react";
import { Box, Typography, Card, Button, Stack, Chip } from "@mui/material";
import { useI18n, formatCurrency, formatNumber, formatDate } from "./provider";
import { useRouter } from "next/navigation";

export default function I18nDemo() {
  const { t, language } = useI18n();
  const router = useRouter();

  // Sample financial data for demonstration
  const sampleBalance = 1234567.89;
  const sampleAmount = 999.99;
  const sampleDate = new Date();

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
      <Stack spacing={3}>
        {/* Header */}
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h4" gutterBottom>
            i18n Demo
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Current Language:{" "}
            {language === "en" ? "English" : "Bahasa Indonesia"}
          </Typography>
          <Box sx={{ mt: 2 }}>
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
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Language settings moved to /settings/app-preferences
          </Typography>
        </Box>

        {/* Common Translations */}
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t("common.settings")}
          </Typography>
          <Stack spacing={1}>
            <Typography>• {t("common.add")}</Typography>
            <Typography>• {t("common.create")}</Typography>
            <Typography>• {t("common.import")}</Typography>
            <Typography>• {t("common.delete")}</Typography>
            <Typography>• {t("common.security")}</Typography>
          </Stack>
        </Card>

        {/* Wallet Translations */}
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t("wallet.title")}
          </Typography>
          <Stack spacing={1}>
            <Typography>• {t("wallet.settings")}</Typography>
            <Typography>• {t("wallet.addWallet")}</Typography>
            <Typography>• {t("wallet.showSeedPhrase")}</Typography>
            <Typography>• {t("wallet.importSeedPhrase")}</Typography>
          </Stack>
        </Card>

        {/* Financial Formatting */}
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t("finance.balance")} & Formatting
          </Typography>
          <Stack spacing={2}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Currency Formatting:
              </Typography>
              <Typography variant="h6">
                {formatCurrency(sampleBalance, language)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Number Formatting:
              </Typography>
              <Typography variant="body1">
                {formatNumber(sampleAmount, language)} {t("finance.tokens")}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Date Formatting:
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
            bgcolor: "rgba(139, 92, 246, 0.04)",
            border: "1px solid rgba(139, 92, 246, 0.08)",
          }}
        >
          <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
            {t("security.securityNotice")}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#8B5CF6",
              fontWeight: 500,
              mt: 1,
            }}
          >
            {t("security.storeOffline")}
          </Typography>
        </Card>

        {/* Action Buttons */}
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="contained" color="primary">
            {t("common.save")}
          </Button>
          <Button variant="outlined" color="secondary">
            {t("common.cancel")}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
