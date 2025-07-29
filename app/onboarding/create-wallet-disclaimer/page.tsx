"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";

export default function CreateWalletDisclaimerPage() {
  const router = useRouter();

  return (
    <Box
      sx={{
        minHeight: "60vh",
        bgcolor: "#f5f6fa",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Box
        sx={{
          width: "100%",
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          variant="text"
          color="primary"
          sx={{ mb: 0 }}
          onClick={async () => {
            await selectionFeedback();
            router.push("/");
          }}
        >
          Back
        </Button>
        <Typography
          variant="body1"
          fontWeight="bold"
          sx={{ ml: 2, flex: 1, textAlign: "right" }}
        >
          Create Wallet
        </Typography>
      </Box>
      <Card
        sx={{
          maxWidth: 420,
          width: "100%",
          p: 4,
          boxShadow: 4,
          background: "#fff",
          color: "#212529",
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ mb: 2, textAlign: "center" }}
        >
          Important Disclaimer
        </Typography>
        <Typography
          variant="body1"
          sx={{ mb: 3, color: "#333", textAlign: "center" }}
        >
          You are about to create a self-custody wallet. <br />
          <br />
          <b>You are the only one who controls your wallet and funds.</b> <br />
          <br />
          <b>
            Your seed phrase is the ONLY way to recover your wallet and assets.
          </b>{" "}
          <br />
          <br />
          If you lose your seed phrase,{" "}
          <span style={{ color: "#e53935", fontWeight: "bold" }}>
            your funds cannot be recovered.
          </span>
        </Typography>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            mt: 2,
            fontWeight: "bold",
            borderRadius: 2,
            boxShadow: 2,
            "&:hover": { bgcolor: "#e3f2fd" },
          }}
          onClick={async () => {
            await selectionFeedback();
            router.push("/onboarding/create-wallet?onboarding=1");
          }}
        >
          I Understand, Continue
        </Button>
      </Card>
    </Box>
  );
}
