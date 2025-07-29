"use client";
import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Confetti from "react-confetti";

// Move the main content to a separate component
function DoneContent() {
  const searchParams = useSearchParams();
  const pubkey = searchParams.get("pubkey");
  const router = useRouter();
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    function update() {
      setDimensions({
        width: typeof window !== "undefined" ? window.innerWidth : 0,
        height: typeof window !== "undefined" ? window.innerHeight : 0,
      });
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f6fa",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        p: 2,
      }}
    >
      <Confetti width={dimensions.width} height={dimensions.height} />
      <Box
        sx={{
          maxWidth: 420,
          width: "100%",
          p: 4,
          boxShadow: 4,
          borderRadius: 3,
          background: "#fff",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ mb: 2, color: "#AD5AD7" }}
        >
          🎉 New Address Created!
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Your new public key:
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontFamily: "monospace",
            fontSize: "1.2rem",
            wordBreak: "break-all",
            bgcolor: "#f3f4f6",
            borderRadius: 2,
            p: 2,
            mb: 3,
            color: "#333",
          }}
        >
          {pubkey}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push("/wallet")}
        >
          Go to Wallet
        </Button>
      </Box>
    </Box>
  );
}

export default function DonePage() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <DoneContent />
    </React.Suspense>
  );
}
