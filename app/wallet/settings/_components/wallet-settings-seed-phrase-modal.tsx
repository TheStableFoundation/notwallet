import * as React from "react";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";
import { store } from "@/lib/store/store";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import {
  Seed,
  SolanaWallet,
  STORE_ACTIVE_KEYPAIR,
  STORE_SEEDS,
} from "@/lib/crate/generated";
import { debug } from "@tauri-apps/plugin-log";

interface WalletSettingsSeedPhraseModalProps {
  open: boolean;
  onClose: () => void;
}

enum State {
  Loading,
  Loaded,
  Error,
}

export default function WalletSettingsSeedPhraseModal({
  open,
  onClose,
}: WalletSettingsSeedPhraseModalProps) {
  const [showSeedPhrase, setShowSeedPhrase] = React.useState(false);
  const [seedPhrase, setSeedPhrase] = React.useState("");
  const [seconds, setSeconds] = React.useState(5);
  const [state, setState] = React.useState(State.Loading);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const onSetShowSeedPhrase = async () => {
    try {
      setState(State.Loading);
      const walletActive =
        await store().get<SolanaWallet>(STORE_ACTIVE_KEYPAIR);
      debug(`wallet: ${walletActive?.seed_id}`);
      if (!walletActive) throw new Error("No active wallet");

      const seeds = await store().get<Seed[]>(STORE_SEEDS);
      // Filter seeds by wallet active seed_id, get the first one
      const filteredSeed = seeds?.filter(
        (seed) => seed.id === walletActive?.seed_id,
      )[0];
      // Sanity check
      if (!filteredSeed) throw new Error("No seed found");
      if (!filteredSeed.phrase) throw new Error("Seed phrase not found");

      setSeedPhrase(filteredSeed.phrase);
      setState(State.Loaded);
    } catch {
      setState(State.Error);
    }
  };

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleClose = () => {
    clearTimer();
    setShowSeedPhrase(false);
    setSeconds(5);
    onClose();
  };

  // Reset state when component unmounts
  React.useEffect(() => {
    return () => {
      clearTimer();
    };
  }, []);

  // Reset state when modal open state changes
  React.useEffect(() => {
    if (!open) {
      handleClose();
    }
  }, [open]);

  const onShowSeedPhrase = async () => {
    await selectionFeedback();
    await onSetShowSeedPhrase();
    setShowSeedPhrase(true);
    setSeconds(5);

    // Clear any existing timer first
    clearTimer();

    // Set new timer
    timerRef.current = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds <= 1) {
          handleClose();
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);
  };

  return (
    <Modal
      open={open}
      onClose={async () => {
        await selectionFeedback();
        handleClose();
      }}
      aria-labelledby="wallet-settings-seed-phrase-modal"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        m: 0,
        p: 0,
      }}
    >
      <Box
        sx={{
          bgcolor: "background.paper",
          borderRadius: 3,
          boxShadow: 24,
          p: { xs: 2, sm: 3 },
          minWidth: 300,
          maxWidth: 380,
          width: "90vw",
          outline: "none",
          mx: 1,
        }}
      >
        <Typography
          id="switch-keypair-modal"
          variant="h6"
          sx={{
            mb: 2,
            textAlign: "center",
            fontWeight: "bold",
            color: "transparent",
            background: "linear-gradient(90deg, #9932CC 0%, #AD5AD7 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "0.02em",
            fontFamily: "Inter, Helvetica Neue, Arial, sans-serif",
          }}
        >
          Show Seed Phrase
        </Typography>
        <Box
          sx={{
            maxHeight: 320,
            overflowY: "auto",
            overflowX: "hidden",
            pr: 1,
            mb: 2,
          }}
        >
          {showSeedPhrase && (
            <Box>
              <Box
                sx={{
                  position: "relative",
                  p: 2,
                  mb: 2,
                  border: "1px solid #AD5AD7",
                  borderRadius: 1,
                  backgroundColor: "#F5F6FA",
                }}
              >
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "#AD5AD7",
                    letterSpacing: 1,
                    wordBreak: "break-word",
                  }}
                >
                  {state === State.Loading && "Loading ..."}
                  {state === State.Error && "Error"}
                  {state === State.Loaded && seedPhrase}
                </Typography>
                {state === State.Loaded && (
                  <IconButton
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      backgroundColor: "rgba(255, 255, 255, 0.5)",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                      },
                    }}
                    onClick={async () => {
                      await selectionFeedback();
                      await writeText(seedPhrase);
                    }}
                    aria-label="copy seed phrase"
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
              <Typography variant="body2" color="warning">
                Will close in {seconds} seconds.
              </Typography>
            </Box>
          )}
          {!showSeedPhrase && (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                mb: 2,
                textAlign: "center",
                fontWeight: "bold",
                color: "#AD5AD7",
                letterSpacing: 1,
              }}
            >
              Please note that your seed phrase is the only way to recover your
              wallet. If you lose it, you will lose access to your funds.
            </Typography>
          )}
        </Box>
        {!showSeedPhrase && (
          <Button
            variant="outlined"
            color="warning"
            fullWidth
            sx={{
              mt: 1,
              borderRadius: 2,
              fontWeight: "bold",
              letterSpacing: 1,
            }}
            onClick={onShowSeedPhrase}
          >
            I understand
          </Button>
        )}
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          sx={{
            mt: 1,
            borderRadius: 2,
            fontWeight: "bold",
            letterSpacing: 1,
            color: "#AD5AD7",
            borderColor: "#AD5AD7",
            "&:hover": { background: "#F5F6FA", borderColor: "#C792EA" },
          }}
          onClick={async () => {
            await selectionFeedback();
            handleClose();
          }}
        >
          {showSeedPhrase ? "Close" : "Cancel"}
        </Button>
      </Box>
    </Modal>
  );
}
