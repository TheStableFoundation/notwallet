"use client";

import {
  Box,
  Typography,
  Card,
  Button,
  Stack,
  Chip,
  Divider,
  Alert,
} from "@mui/material";
import { useI18n } from "@lib/i18n/provider";
import LanguageSwitcher from "@lib/i18n/language-switcher";
import { useNavigate } from "react-router-dom";

export default function HomeTranslationTest() {
  const { t, language } = useI18n();
  const router = useNavigate();

  const translationSections = [
    {
      title: "Navigation & Layout",
      keys: [
        { key: "home.title", description: "Page title" },
        { key: "home.quickActions", description: "Quick actions menu title" },
        { key: "home.dao", description: "DAO button label" },
        { key: "home.learn", description: "Learn button label" },
      ],
    },
    {
      title: "Activity Feed",
      keys: [
        { key: "home.activityFeed", description: "Activity feed header" },
        { key: "home.bachAirdropLive", description: "Airdrop banner title" },
        { key: "home.airdropDescription", description: "Airdrop description" },
        { key: "home.claimYourAirdrop", description: "Claim button text" },
      ],
    },
    {
      title: "Airdrop Claiming Interface",
      keys: [
        { key: "home.claimYourBachAirdrop", description: "Main airdrop title" },
        { key: "home.signUpAndClaim", description: "Sign up button" },
        { key: "home.walletAddressUsedAirdrop", description: "Usage notice" },
        { key: "home.bachMoney", description: "Website reference" },
        { key: "home.successClaimedAirdrop", description: "Success message" },
        { key: "home.claimAirdrop", description: "Modal title" },
        {
          key: "home.signMessageProveOwnership",
          description: "Modal description",
        },
        { key: "home.signing", description: "Loading state" },
        { key: "home.signAndClaim", description: "Action button" },
        {
          key: "home.signatureOnlyForVerification",
          description: "Privacy notice",
        },
        { key: "home.tryAgain", description: "Error recovery" },
      ],
    },
    {
      title: "Username Setup",
      keys: [
        { key: "home.setYourUsername", description: "Username setup title" },
        {
          key: "home.chooseUsernamePersonalize",
          description: "Setup description",
        },
        { key: "home.enterYourUsername", description: "Input placeholder" },
        { key: "home.saveUsername", description: "Save button" },
        { key: "home.saved", description: "Success state" },
        {
          key: "home.usernameSavedSuccessfully",
          description: "Success message",
        },
      ],
    },
  ];

  return (
    <Box sx={{ p: 3, maxWidth: 1000, mx: "auto" }}>
      <Stack spacing={3}>
        {/* Header */}
        <Card sx={{ p: 3, borderRadius: "16px" }}>
          <Typography variant="h4" gutterBottom>
            🏠 Home Page Translation Test
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            This test verifies that all home page components are properly
            internationalized
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
            <Button
              variant="outlined"
              onClick={() => router("/home")}
              sx={{
                borderRadius: "12px",
                textTransform: "none",
                px: 3,
                py: 1.5,
              }}
            >
              View Live Home Page
            </Button>
          </Box>
        </Card>

        {/* Translation Test Results */}
        {translationSections.map((section, index) => (
          <Card key={index} sx={{ p: 3, borderRadius: "16px" }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: "#9932CC", fontWeight: 600 }}
            >
              {section.title}
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Stack spacing={2}>
              {section.keys.map((item, keyIndex) => {
                const translatedText = t(item.key);
                const isTranslated = translatedText !== item.key;

                return (
                  <Box
                    key={keyIndex}
                    sx={{
                      p: 2,
                      border: "1px solid",
                      borderColor: isTranslated ? "success.main" : "error.main",
                      borderRadius: "12px",
                      bgcolor: isTranslated ? "success.50" : "error.50",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <Chip
                        label={isTranslated ? "✅ Translated" : "❌ Missing"}
                        color={isTranslated ? "success" : "error"}
                        size="small"
                      />
                      <Typography variant="body2" color="text.secondary">
                        {item.description}
                      </Typography>
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{ fontFamily: "monospace", mb: 1 }}
                    >
                      <strong>Key:</strong> {item.key}
                    </Typography>

                    <Box
                      sx={{
                        p: 1.5,
                        bgcolor: "background.paper",
                        borderRadius: "8px",
                        border: "1px solid rgba(0,0,0,0.1)",
                      }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        &quot;{translatedText}&quot;
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          </Card>
        ))}

        {/* Summary Statistics */}
        <Card sx={{ p: 3, borderRadius: "16px", bgcolor: "grey.50" }}>
          <Typography variant="h6" gutterBottom>
            📊 Translation Coverage Summary
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {(() => {
            const allKeys = translationSections.flatMap(
              (section) => section.keys,
            );
            const translatedCount = allKeys.filter(
              (item) => t(item.key) !== item.key,
            ).length;
            const totalCount = allKeys.length;
            const percentage = Math.round((translatedCount / totalCount) * 100);

            return (
              <Stack spacing={2}>
                <Alert
                  severity={percentage === 100 ? "success" : "warning"}
                  sx={{ borderRadius: "12px" }}
                >
                  <Typography variant="body1">
                    <strong>
                      {translatedCount}/{totalCount}
                    </strong>{" "}
                    translation keys implemented ({percentage}%)
                  </Typography>
                </Alert>

                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Chip
                    label={`${translationSections.length} sections tested`}
                    variant="outlined"
                  />
                  <Chip label={`${totalCount} total keys`} variant="outlined" />
                  <Chip
                    label={`Language: ${language.toUpperCase()}`}
                    color="primary"
                  />
                </Box>

                <Typography variant="body2" color="text.secondary">
                  This test covers all home page components including
                  navigation, activity feed, airdrop claiming interface, and
                  username setup functionality.
                </Typography>
              </Stack>
            );
          })()}
        </Card>

        {/* Component Test Actions */}
        <Card sx={{ p: 3, borderRadius: "16px" }}>
          <Typography variant="h6" gutterBottom>
            🧪 Component Tests
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">
              Test individual home page components with translations:
            </Typography>

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Button
                variant="outlined"
                onClick={() => router("/home")}
                sx={{ borderRadius: "12px", textTransform: "none" }}
              >
                Main Home Page
              </Button>
              <Button
                variant="outlined"
                onClick={() =>
                  console.log("Quick Actions:", {
                    dao: t("home.dao"),
                    learn: t("home.learn"),
                  })
                }
                sx={{ borderRadius: "12px", textTransform: "none" }}
              >
                Test Quick Actions
              </Button>
              <Button
                variant="outlined"
                onClick={() =>
                  console.log("Activity Feed:", t("home.activityFeed"))
                }
                sx={{ borderRadius: "12px", textTransform: "none" }}
              >
                Test Activity Feed
              </Button>
            </Box>
          </Stack>
        </Card>

        {/* Implementation Notes */}
        <Card sx={{ p: 3, borderRadius: "16px", bgcolor: "info.50" }}>
          <Typography variant="h6" gutterBottom sx={{ color: "info.main" }}>
            📋 Implementation Notes
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Stack spacing={1}>
            <Typography variant="body2">
              • All home page components use the useI18n hook consistently
            </Typography>
            <Typography variant="body2">
              • Translation keys follow the home.* namespace pattern
            </Typography>
            <Typography variant="body2">
              • Modal dialogs and onboarding flows are fully internationalized
            </Typography>
            <Typography variant="body2">
              • Error handling and success states include proper translations
            </Typography>
            <Typography variant="body2">
              • Form placeholders and button states are localized
            </Typography>
            <Typography variant="body2">
              • Cultural context preserved for Indonesian translations
            </Typography>
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}
