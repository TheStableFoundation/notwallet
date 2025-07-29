import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import LockIcon from "@mui/icons-material/Lock";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import { store } from "../store/store";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { STORE_PASSWORD } from "../crate/generated";
import bcrypt from "bcryptjs";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";

type LockedWalletViewProps = {
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  onUnlock: () => void;
};

export default function LockedWalletView({
  showPassword,
  setShowPassword,
  onUnlock,
}: LockedWalletViewProps) {
  const [passwordInput, setPasswordInput] = React.useState<string>("");
  const [error, setError] = React.useState<string | null>(null);

  const handleUnlock = async () => {
    setError(null);
    const hash = await store().get<string>(STORE_PASSWORD);
    // Check if passwordInput matches the hash in the db
    if (hash && bcrypt.compareSync(passwordInput, hash)) {
      setPasswordInput("");
      await selectionFeedback();
      onUnlock();
      return;
    }
    setError("Incorrect password. Please try again.");
  };

  return (
    <Box
      sx={{
        minHeight: "unset",
        bgcolor: "#f5f6fa",
        pb: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 480, pt: 3, pb: 2 }}>
        <Typography
          variant="h6"
          component="h1"
          fontWeight="bold"
          align="center"
        >
          NotWallet
        </Typography>
        <Typography
          variant="body1"
          component="p"
          fontWeight="bold"
          align="center"
        >
          A Crypto Dollar Wallet
        </Typography>
      </Box>
      <Card sx={{ maxWidth: 400, width: "100%", boxShadow: 3 }}>
        <CardContent>
          <Box
            sx={{
              mt: 3,
              mb: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <LockIcon sx={{ fontSize: 40, color: "#AD5AD7", mb: 1 }} />
            <Typography variant="subtitle1" align="center" sx={{ mb: 1 }}>
              Wallet Locked
            </Typography>
            <TextField
              label="Enter Password"
              type={showPassword ? "text" : "password"}
              value={passwordInput}
              onChange={(e) => {
                setPasswordInput(e.target.value);
                setError(null);
              }}
              sx={{ mb: 1, bgcolor: "#f3f4f6", borderRadius: 2, width: "100%" }}
              error={!!error}
              helperText={error}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? (
                        <Visibility color="primary" />
                      ) : (
                        <VisibilityOff />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 1 }}
              disabled={!passwordInput}
              onClick={handleUnlock}
            >
              Unlock Wallet
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
