"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { store } from "../../lib/store/store";
import { useEffect } from "react";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";
import { Seed, STORE_SEEDS } from "../../lib/crate/generated";
import { DERIVE_NEXT_KEYPAIR } from "../../lib/commands";
import { invoke } from "@tauri-apps/api/core";

// Fetch all seed phrases from the tauri store
async function fetchSeedsFromStore() {
  // This assumes you store them under a key like "seedPhrases" as an array of objects
  // Adjust the key and structure as needed for your app
  return await store().get<Seed[]>(STORE_SEEDS);
}

export default function CreateNewWalletPage() {
  const router = useRouter();

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
      router.replace(
        `/create-new-wallet/done?pubkey=${encodeURIComponent(result.pubkey)}`,
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
        minHeight: "unset",
        height: "auto",
        bgcolor: "#f5f6fa",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 420,
          width: "100%",
          p: 4,
          boxShadow: 4,
          background: "linear-gradient(135deg, #9932CC 0%, #AD5AD7 100%)",
          color: "#fff",
        }}
      >
        <Stack direction="row" alignItems="center" sx={{ mb: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={async () => {
              await selectionFeedback();
              router.back();
            }}
            sx={{
              minWidth: 0,
              color: "#9932CC",
              bgcolor: "#fff",
              "&:hover": { bgcolor: "#F5F6FA" },
            }}
          >
            Back
          </Button>
          <Box sx={{ flex: 1 }} />
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ textAlign: "right", color: "#fff" }}
          >
            Create New Wallet
          </Typography>
        </Stack>
        <Typography sx={{ mb: 3, color: "#fff" }}>
          Select an existing seed phrase or create a new one.
        </Typography>
        <FormControl component="fieldset" sx={{ width: "100%" }}>
          <RadioGroup
            value={selectedSeed}
            onChange={async (e) => {
              await selectionFeedback();
              setSelectedSeed(e.target.value);
            }}
          >
            <List sx={{ bgcolor: "transparent", color: "#fff", p: 0 }}>
              {existingSeeds.map((seed) => (
                <ListItem
                  key={seed.id}
                  disableGutters
                  sx={{
                    bgcolor:
                      selectedSeed === seed.id ? "#9932CC" : "transparent",
                    borderRadius: 2,
                    mb: 1,
                    px: 1,
                  }}
                >
                  <FormControlLabel
                    value={seed.id}
                    control={
                      <Radio
                        sx={{
                          color: "#fff",
                          "&.Mui-checked": { color: "#fff" },
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
                      />
                    }
                    sx={{ flex: 1, m: 0, color: "#fff" }}
                  />
                </ListItem>
              ))}
              {/* Always show the create new option */}
              <ListItem
                key={CREATE_NEW_ID}
                disableGutters
                sx={{
                  bgcolor:
                    selectedSeed === CREATE_NEW_ID ? "#9932CC" : "transparent",
                  borderRadius: 2,
                  mb: 1,
                  px: 1,
                }}
              >
                <FormControlLabel
                  value={CREATE_NEW_ID}
                  control={
                    <Radio
                      sx={{
                        color: "#fff",
                        "&.Mui-checked": { color: "#fff" },
                      }}
                    />
                  }
                  label={<ListItemText primary="+ Create New Seed Phrase" />}
                  sx={{ flex: 1, m: 0, color: "#fff" }}
                />
              </ListItem>
            </List>
          </RadioGroup>
        </FormControl>
        {errorMsg && (
          <Typography sx={{ color: "#ff5252", mb: 2 }}>{errorMsg}</Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            mt: 2,
            bgcolor: "#fff",
            color: "#9932CC",
            fontWeight: "bold",
            borderRadius: 2,
            boxShadow: 2,
            "&:hover": { bgcolor: "#F5F6FA" },
          }}
          onClick={async () => {
            await selectionFeedback();
            if (selectedSeed === CREATE_NEW_ID) {
              router.push("/onboarding/create-wallet");
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
      </Card>
    </Box>
  );
}
