import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";
import Box from "@mui/material/Box";

export default function CreateOrImportWalletView() {
  const router = useRouter();

  return (
    <Box
      sx={{
        bgcolor: "linear-gradient(135deg, #FAFBFF 0%, #F8FAFF 100%)",
        background: "linear-gradient(135deg, #FAFBFF 0%, #F8FAFF 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        pb: 8,
      }}
    >
      <Card
        sx={{
          maxWidth: 420,
          width: "100%",
          borderRadius: "20px",
          boxShadow: "0 4px 20px rgba(139, 92, 246, 0.08)",
          border: "1px solid rgba(139, 92, 246, 0.06)",
          overflow: "hidden",
          bgcolor: "#FFFFFF",
        }}
      >
        <Box sx={{ p: 4, bgcolor: "#fff" }}>
          <CardMedia
            component="img"
            height="120"
            image="/images/app-icon-v4.svg"
            alt="Stablecoin Wallet"
            sx={{ objectFit: "contain", bgcolor: "#fff" }}
          />
        </Box>
        <CardContent>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontSize: "28px",
              fontWeight: 700,
              color: "#1F2937",
              textAlign: "center",
              mb: 2,
              letterSpacing: "-0.02em",
            }}
          >
            NotWallet Crypto
          </Typography>
        </CardContent>
        <CardActions sx={{ flexDirection: "column", gap: 2, p: 4, pt: 2 }}>
          <Button
            variant="contained"
            fullWidth
            sx={{
              py: 1.75,
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: 600,
              textTransform: "none",
              boxShadow: "0 4px 12px rgba(167, 139, 250, 0.3)",
              background: "linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
                boxShadow: "0 6px 16px rgba(167, 139, 250, 0.4)",
              },
            }}
            onClick={async () => {
              await selectionFeedback();
              router.push("/wallet/onboarding/import-wallet");
            }}
          >
            Import Seed Phrase
          </Button>
          <Button
            variant="outlined"
            fullWidth
            sx={{
              py: 1.75,
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: 600,
              textTransform: "none",
              borderColor: "#A78BFA",
              color: "#A78BFA",
              "&:hover": {
                background: "rgba(167, 139, 250, 0.04)",
                borderColor: "#8B5CF6",
                color: "#8B5CF6",
              },
            }}
            onClick={async () => {
              await selectionFeedback();
              router.push("/wallet/onboarding/create-wallet-disclaimer");
            }}
          >
            Create New Wallet
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}
