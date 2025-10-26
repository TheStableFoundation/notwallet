import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import { useLang } from "@src/LanguageContext";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

export default function CreateOrImportWalletView() {
  const router = useNavigate();
  const { t } = useLang();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#FAFAFA",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        p: 2,
        pt: 4,
      }}
    >
      {/* Logo/Brand Section */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "16px",
            background: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(153, 50, 204, 0.15)",
          }}
        >
          <AccountBalanceWalletIcon
            sx={{
              fontSize: 36,
              background: "linear-gradient(135deg, #9932CC 0%, #7A1FA2 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          />
        </Box>
      </Box>

      {/* Main Card */}
      <Card
        sx={{
          maxWidth: 420,
          width: "100%",
          borderRadius: "20px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
          overflow: "hidden",
          bgcolor: "#FFFFFF",
        }}
      >
        <CardContent sx={{ p: 3, pb: 2 }}>
          <Typography
            variant="h6"
            component="h1"
            sx={{
              fontSize: "20px",
              fontWeight: 600,
              color: "#1F2937",
              textAlign: "center",
              mb: 1,
              letterSpacing: "-0.01em",
            }}
          >
            {t.createYourWallet}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#6B7280",
              textAlign: "center",
              fontSize: "13px",
              lineHeight: 1.5,
            }}
          >
            Get started by creating a new wallet or importing an existing one
          </Typography>
        </CardContent>

        <CardActions sx={{ flexDirection: "column", gap: 1.5, p: 3, pt: 1 }}>
          {/* Import Wallet Button */}
          <Button
            variant="contained"
            fullWidth
            startIcon={<LockOpenIcon />}
            sx={{
              py: 1.5,
              borderRadius: "12px",
              fontSize: "15px",
              fontWeight: 600,
              textTransform: "none",
              boxShadow: "0 4px 12px rgba(153, 50, 204, 0.3)",
              background: "linear-gradient(135deg, #9932CC 0%, #7A1FA2 100%)",
              transition: "all 0.2s ease",
              "&:hover": {
                background: "linear-gradient(135deg, #7A1FA2 0%, #5E1580 100%)",
                boxShadow: "0 6px 16px rgba(153, 50, 204, 0.4)",
              },
              "&:active": {
                transform: "scale(0.98)",
              },
            }}
            onClick={async () => {
              await selectionFeedback();
              router("/wallet/onboarding/import-wallet");
            }}
          >
            {t.importSeedPhrase}
          </Button>

          {/* Divider */}
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              my: 0.5,
            }}
          >
            <Box sx={{ flex: 1, height: "1px", bgcolor: "#E5E7EB" }} />
            <Typography
              variant="caption"
              sx={{ color: "#9CA3AF", fontWeight: 500, fontSize: "11px" }}
            >
              OR
            </Typography>
            <Box sx={{ flex: 1, height: "1px", bgcolor: "#E5E7EB" }} />
          </Box>

          {/* Create New Wallet Button */}
          <Button
            variant="outlined"
            fullWidth
            startIcon={<AddCircleOutlineIcon />}
            sx={{
              py: 1.5,
              borderRadius: "12px",
              fontSize: "15px",
              fontWeight: 600,
              textTransform: "none",
              borderWidth: "2px",
              borderColor: "#9932CC",
              color: "#9932CC",
              background: "rgba(153, 50, 204, 0.04)",
              transition: "all 0.2s ease",
              "&:hover": {
                background: "rgba(153, 50, 204, 0.08)",
                borderWidth: "2px",
                borderColor: "#7A1FA2",
                color: "#7A1FA2",
                boxShadow: "0 4px 12px rgba(153, 50, 204, 0.15)",
              },
              "&:active": {
                transform: "scale(0.98)",
              },
            }}
            onClick={async () => {
              await selectionFeedback();
              router("/wallet/onboarding/create-wallet-disclaimer");
            }}
          >
            {t.createNewWallet}
          </Button>
        </CardActions>

        {/* Footer */}
        <Box
          sx={{
            px: 3,
            pb: 3,
            pt: 2,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: "#9CA3AF",
              textAlign: "center",
              display: "block",
              fontSize: "11px",
              lineHeight: 1.5,
            }}
          >
            🔒 Your keys, your crypto. We never store your seed phrase.
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}
