"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { store } from "@lib/store/store";
import { useEffect } from "react";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";
import { Seed, STORE_SEEDS } from "@lib/crate/generated";
import { DERIVE_NEXT_KEYPAIR } from "@lib/commands";
import { invoke } from "@tauri-apps/api/core";
import PageChildrenTitleBar from "@lib/components/page-children-title-bar";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import AddIcon from "@mui/icons-material/Add";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useNavigate } from "react-router-dom";

// Fetch all seed phrases from the tauri store
async function fetchSeedsFromStore() {
  // This assumes you store them under a key like "seedPhrases" as an array of objects
  // Adjust the key and structure as needed for your app
  return await store().get<Seed[]>(STORE_SEEDS);
}

export default function WalletCreateNewWalletPage() {
  const router = useNavigate();

  // Add a special id for "create new"
  const CREATE_NEW_ID = "__create_new__";
  const [existingSeeds, setExistingSeeds] = React.useState<Seed[]>([]);
  const [selectedSeed, setSelectedSeed] = React.useState<string>(CREATE_NEW_ID);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  useEffect(() => {
    async function loadSeeds() {
      const seeds = await fetchSeedsFromStore();
      if (Array.isArray(seeds) && seeds.length > 0) {
        setExistingSeeds(seeds);
        // Always default to "create new" option
        setSelectedSeed(CREATE_NEW_ID);
      } else {
        setExistingSeeds([]);
        setSelectedSeed(CREATE_NEW_ID);
      }
    }
    loadSeeds();
  }, []);

  // Derive a new keypair for a given seedUuid and account index
  async function deriveNextKeypair(seedUuid: string) {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const result = await invoke<any>(DERIVE_NEXT_KEYPAIR, { seedUuid });
      // Navigate to done page with pubkey in search params
      router(
        `/wallet/create-new-wallet/done?pubkey=${encodeURIComponent(result.pubkey)}`,
      );
    } catch (e: any) {
      setErrorMsg(e?.toString() || "Failed to derive keypair.");
    } finally {
      setIsLoading(false);
    }
  }

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
      <PageChildrenTitleBar title="Create Wallet" />
      <Box sx={{ width: "100%", maxWidth: 420, px: 2 }}>
        <Typography
          sx={{
            fontSize: "16px",
            color: "#6B7280",
            mb: 3,
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          Select an existing seed phrase or create a new one.
        </Typography>

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
              Select Seed Phrase
            </Typography>
          </Box>
          <FormControl component="fieldset" sx={{ width: "100%" }}>
            <RadioGroup
              value={selectedSeed}
              onChange={async (e) => {
                await selectionFeedback();
                setSelectedSeed(e.target.value);
              }}
            >
              <List sx={{ p: 0, pb: 1 }}>
                {existingSeeds.map((seed, index) => (
                  <React.Fragment key={seed.id}>
                    <ListItem
                      sx={{
                        px: 0,
                        py: 2,
                        cursor: "pointer",
                        borderRadius: "12px",
                        mx: 2,
                        mb: 1,
                        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                        bgcolor:
                          selectedSeed === seed.id
                            ? "rgba(139, 92, 246, 0.04)"
                            : "transparent",
                        "&:hover": {
                          bgcolor: "rgba(139, 92, 246, 0.04)",
                          transform: "scale(1.01)",
                        },
                        "&:active": {
                          transform: "scale(0.99)",
                        },
                      }}
                      component="li"
                      disablePadding
                    >
                      <FormControlLabel
                        value={seed.id}
                        control={
                          <Radio
                            sx={{
                              color: "#8B5CF6",
                              "&.Mui-checked": { color: "#8B5CF6" },
                              ml: 2,
                            }}
                          />
                        }
                        label={
                          <ListItemText
                            primary={
                              seed.phrase
                                ? (() => {
                                    const words = seed.phrase.split(/\s+/);
                                    if (words.length > 1) {
                                      return `${words[0]} ... ${words[words.length - 1]}`;
                                    }
                                    return seed.phrase;
                                  })()
                                : ""
                            }
                            secondary="Existing seed phrase"
                            primaryTypographyProps={{
                              sx: {
                                fontSize: "16px",
                                fontWeight: 500,
                                color: "#1F2937",
                                letterSpacing: "-0.01em",
                                mb: 0.25,
                              },
                            }}
                            secondaryTypographyProps={{
                              sx: {
                                fontSize: "14px",
                                color: "#6B7280",
                              },
                            }}
                          />
                        }
                        sx={{ flex: 1, m: 0 }}
                      />
                      <ChevronRightIcon
                        sx={{
                          color: "#9CA3AF",
                          mr: 4,
                          fontSize: "20px",
                        }}
                      />
                    </ListItem>
                    {index < existingSeeds.length - 1 && (
                      <Divider
                        sx={{
                          mx: 6,
                          borderColor: "rgba(139, 92, 246, 0.08)",
                        }}
                      />
                    )}
                  </React.Fragment>
                ))}
                {existingSeeds.length > 0 && (
                  <Divider
                    sx={{
                      mx: 6,
                      borderColor: "rgba(139, 92, 246, 0.08)",
                    }}
                  />
                )}
                <ListItem
                  sx={{
                    px: 0,
                    py: 2,
                    cursor: "pointer",
                    borderRadius: "12px",
                    mx: 2,
                    mb: 1,
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    bgcolor:
                      selectedSeed === CREATE_NEW_ID
                        ? "rgba(139, 92, 246, 0.04)"
                        : "transparent",
                    "&:hover": {
                      bgcolor: "rgba(139, 92, 246, 0.04)",
                      transform: "scale(1.01)",
                    },
                    "&:active": {
                      transform: "scale(0.99)",
                    },
                  }}
                  component="li"
                  disablePadding
                >
                  <FormControlLabel
                    value={CREATE_NEW_ID}
                    control={
                      <Radio
                        sx={{
                          color: "#8B5CF6",
                          "&.Mui-checked": { color: "#8B5CF6" },
                          ml: 2,
                        }}
                      />
                    }
                    label={
                      <Box
                        sx={{ display: "flex", alignItems: "center", flex: 1 }}
                      >
                        <ListItemIcon
                          sx={{
                            color: "#8B5CF6",
                            minWidth: 48,
                            ml: 0,
                          }}
                        >
                          <AddIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Create New Seed Phrase"
                          secondary="Generate a new wallet"
                          primaryTypographyProps={{
                            sx: {
                              fontSize: "16px",
                              fontWeight: 500,
                              color: "#1F2937",
                              letterSpacing: "-0.01em",
                              mb: 0.25,
                            },
                          }}
                          secondaryTypographyProps={{
                            sx: {
                              fontSize: "14px",
                              color: "#6B7280",
                            },
                          }}
                        />
                      </Box>
                    }
                    sx={{ flex: 1, m: 0 }}
                  />
                  <ChevronRightIcon
                    sx={{
                      color: "#9CA3AF",
                      mr: 4,
                      fontSize: "20px",
                    }}
                  />
                </ListItem>
              </List>
            </RadioGroup>
          </FormControl>
        </Card>

        {errorMsg && (
          <Box
            sx={{
              textAlign: "center",
              mb: 3,
            }}
          >
            <Typography
              sx={{
                fontSize: "14px",
                color: "#EF4444",
                lineHeight: 1.6,
                bgcolor: "rgba(239, 68, 68, 0.04)",
                border: "1px solid rgba(239, 68, 68, 0.08)",
                borderRadius: "12px",
                p: 3,
              }}
            >
              {errorMsg}
            </Typography>
          </Box>
        )}

        <Button
          variant="contained"
          fullWidth
          sx={{
            py: 1.75,
            borderRadius: "12px",
            fontSize: "16px",
            fontWeight: 600,
            textTransform: "none",
            boxShadow: "0 4px 12px rgba(139, 92, 246, 0.3)",
            background: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
              boxShadow: "0 6px 16px rgba(139, 92, 246, 0.4)",
            },
            "&:disabled": {
              background: "#E5E7EB",
              color: "#9CA3AF",
              boxShadow: "none",
            },
          }}
          onClick={async () => {
            await selectionFeedback();
            if (selectedSeed === CREATE_NEW_ID) {
              router("/wallet/onboarding/create-wallet");
            } else {
              const seed = existingSeeds.find((s) => s.id === selectedSeed);
              if (seed) {
                await deriveNextKeypair(seed.id);
              }
            }
          }}
          disabled={!selectedSeed || isLoading}
        >
          {isLoading ? "Processing..." : "Continue"}
        </Button>
      </Box>
    </Box>
  );
}
