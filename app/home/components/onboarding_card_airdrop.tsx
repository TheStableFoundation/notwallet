"use client";
import * as React from "react";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { openUrl } from "@tauri-apps/plugin-opener";
import { invoke } from "@tauri-apps/api/core";
import Confetti from "react-confetti";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";

type OnboardingCardAirdropProps = {
  open: boolean;
  onSuccess: () => void;
  onClose: () => void;
};

export default function OnboardingCardAirdrop({
  open,
  onSuccess,
  onClose,
}: OnboardingCardAirdropProps) {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [signing, setSigning] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [showConfetti, setShowConfetti] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSign = async () => {
    setSigning(true);
    setError(null);
    try {
      const now = Date.now();
      const message = `I want my $BACH ${now}`;
      await invoke<string>("sign_message", { message });
      setModalOpen(false);
      setShowConfetti(true);
      setSuccess(true);
      setTimeout(() => {
        setShowConfetti(false);
        onSuccess();
      }, 1800);
    } catch (e: any) {
      setError(e?.toString() || "Failed to sign and claim airdrop.");
    }
    setSigning(false);
  };

  if (!open) return null;

  return (
    <>
      {showConfetti && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}
      <Card
        sx={{
          width: "100%",
          maxWidth: 480,
          mb: 3,
          borderRadius: 4,
          boxShadow: 6,
          background: "linear-gradient(135deg, #9932CC 0%, #AD5AD7 100%)",
          color: "#fff",
          position: "relative",
          overflow: "visible",
          border: "2px solid #AD5AD7",
        }}
      >
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            color: "#AD5AD7",
            bgcolor: "#fff",
            "&:hover": { bgcolor: "#F5F6FA" },
            zIndex: 2,
          }}
        >
          <CloseIcon />
        </IconButton>
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
              mb: 1,
              color: "#fff",
              textShadow: "0 2px 8px #AD5AD799",
              letterSpacing: 1,
            }}
          >
            🎉 Claim Your $BACH Airdrop!
          </Typography>
          {error ? (
            <Box sx={{ mt: 2 }}>
              <Typography
                variant="body1"
                color="error"
                sx={{
                  mb: 2,
                  fontWeight: "bold",
                  background: "#fff2f2",
                  color: "#e53935",
                  borderRadius: 2,
                  p: 2,
                  fontSize: "1.05rem",
                  boxShadow: 1,
                }}
              >
                {error}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setError(null);
                  setModalOpen(true);
                }}
                sx={{
                  mt: 1,
                  px: 4,
                  borderRadius: 2,
                  bgcolor: "#fff",
                  color: "#1e88e5",
                  fontWeight: "bold",
                  "&:hover": { bgcolor: "#e3f2fd", color: "#1565c0" },
                }}
              >
                Try Again
              </Button>
            </Box>
          ) : !success ? (
            <>
              <Button
                variant="contained"
                size="large"
                sx={{
                  bgcolor: "#fff",
                  color: "#AD5AD7",
                  fontWeight: "bold",
                  borderRadius: 2,
                  boxShadow: 2,
                  px: 4,
                  py: 1.5,
                  transition: "all 0.2s",
                  "&:hover": { bgcolor: "#F5F6FA", color: "#9932CC" },
                }}
                onClick={() => setModalOpen(true)}
              >
                Sign Up &amp; Claim
              </Button>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  mt: 2,
                  color: "#b0bec5",
                  cursor: "pointer",
                }}
                onClick={async () => {
                  await selectionFeedback();
                  openUrl("https://bach.money/");
                }}
              >
                Your wallet address will be used for the airdrop.
                <br />
                <span style={{ color: "#AD5AD7", textDecoration: "underline" }}>
                  bach.money
                </span>
              </Typography>
            </>
          ) : (
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{
                mt: 2,
                color: "#fff",
                textShadow: "0 2px 8px #AD5AD799",
                letterSpacing: 1,
              }}
            >
              🎊 Success! You have claimed your airdrop.
            </Typography>
          )}
        </Box>
      </Card>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="sign-modal-title"
        aria-describedby="sign-modal-desc"
      >
        <Card
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "linear-gradient(135deg, #9932CC 0%, #AD5AD7 100%)",
            borderRadius: 4,
            boxShadow: 8,
            minWidth: 340,
            maxWidth: "90vw",
            textAlign: "center",
            color: "#fff",
            p: 0,
            overflow: "visible",
            border: "2px solid #AD5AD7",
          }}
        >
          <Box sx={{ p: 4, pb: 3 }}>
            <Typography
              id="sign-modal-title"
              variant="h5"
              fontWeight="bold"
              sx={{
                mb: 1,
                color: "#212529",
                textShadow: "0 2px 8px #AD5AD799",
                letterSpacing: 1,
              }}
            >
              Claim Airdrop
            </Typography>
            <Typography
              id="sign-modal-desc"
              variant="body1"
              sx={{
                mb: 3,
                color: "#b0bec5",
                fontWeight: 500,
              }}
            >
              Sign this message to prove wallet ownership and claim your
              airdrop.
            </Typography>
            <Button
              variant="contained"
              size="large"
              color="primary"
              onClick={handleSign}
              sx={{
                bgcolor: "#fff",
                color: "#AD5AD7",
                fontWeight: "bold",
                fontSize: "1.1rem",
                borderRadius: 3,
                boxShadow: 2,
                px: 4,
                py: 1.5,
                transition: "all 0.2s",
                mt: 1,
                "&:hover": { bgcolor: "#F5F6FA", color: "#9932CC" },
              }}
              disabled={signing}
            >
              {signing ? "Signing..." : "Sign & Claim"}
            </Button>
            <Typography
              variant="caption"
              sx={{
                display: "block",
                mt: 2,
                color: "#b0bec5",
              }}
            >
              Your signature is only used to verify your wallet address.
            </Typography>
          </Box>
        </Card>
      </Modal>
    </>
  );
}
