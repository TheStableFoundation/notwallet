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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh",
        background: "#f5f6fa",
      }}
    >
      <Card
        sx={{ maxWidth: 400, width: "100%", boxShadow: 3, bgcolor: "#fff" }}
      >
        <Box sx={{ p: 3, bgcolor: "#fff" }}>
          <CardMedia
            component="img"
            height="120"
            image="/images/usd-coin-usdc-logo.png"
            alt="Stablecoin Wallet"
            sx={{ objectFit: "contain", bgcolor: "#fff" }}
          />
        </Box>
        <CardContent>
          <Typography
            gutterBottom
            variant="h3"
            component="h1"
            fontWeight="bold"
            align="center"
          >
            Not
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Crypto Dollar Wallet: Secure & easy USD stablecoin wallet
          </Typography>
        </CardContent>
        <CardActions sx={{ flexDirection: "column", gap: 2, pb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              background: "linear-gradient(90deg, #9932CC 0%, #AD5AD7 100%)",
              color: "#fff",
              fontWeight: "bold",
              borderRadius: 2,
              boxShadow: "0 1px 6px #9932CC22",
              "&:hover": { background: "#AD5AD7" },
            }}
            onClick={async () => {
              await selectionFeedback();
              router.push("/onboarding/import-wallet");
            }}
          >
            Import Seed Phrase
          </Button>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            sx={{
              borderColor: "#AD5AD7",
              color: "#AD5AD7",
              fontWeight: "bold",
              borderRadius: 2,
              "&:hover": { background: "#F5F6FA", borderColor: "#C792EA" },
            }}
            onClick={async () => {
              await selectionFeedback();
              router.push("/onboarding/create-wallet-disclaimer");
            }}
          >
            Create New Wallet
          </Button>
        </CardActions>
      </Card>
    </div>
  );
}
