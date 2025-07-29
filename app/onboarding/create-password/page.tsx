"use client";
import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { debug, error as logError } from "@tauri-apps/plugin-log";
import { useRouter } from "next/navigation";
import { store } from "@/lib/store/store";
import { STORE_PASSWORD } from "@/lib/crate/generated";
import bcrypt from "bcryptjs";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";

enum State {
  Loading,
  Loaded,
  Error,
}

export default function CreatePasswordPage() {
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [state, setState] = React.useState(State.Loading);
  const [showDialog, setShowDialog] = React.useState(false);
  const [, setStoredPassword] = React.useState<string | null>(null);
  const router = useRouter();

  const handleContinue = async () => {
    await selectionFeedback();
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      // Encrypt password before storing
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt); // Use the actual password, not a hardcoded string
      await store().set(STORE_PASSWORD, hash);
      await store().save();

      debug("Password stored successfully in tauri plugin store.");

      router.replace("/wallet");
    } catch (e: any) {
      logError(`Failed to store password securely: ${e?.toString?.() ?? e}`);
      setError("Failed to store password securely.");
    } finally {
      setLoading(false);
    }
  };

  const checkPassword = async () => {
    try {
      const result = await store().get<string>(STORE_PASSWORD);
      debug(`Found stored password: ${result}`);
      if (result && result.length > 0) {
        setStoredPassword(result);
        setShowDialog(true);
        setState(State.Loaded);
      } else {
        setState(State.Loaded);
      }
    } catch {
      setState(State.Error);
    }
  };

  React.useEffect(() => {
    checkPassword();
  }, []);

  if (state === State.Loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          bgcolor: "#f5f6fa",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Dialog
        open={showDialog}
        onClose={async () => {
          await selectionFeedback();
          setShowDialog(false);
        }}
      >
        <DialogTitle>Password Found</DialogTitle>
        <DialogContent>
          A password already exists for this wallet. Would you like to use the
          existing password or create a new one?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={async () => {
              await selectionFeedback();
              setShowDialog(false);
              router.replace("/wallet");
            }}
            color="primary"
            variant="contained"
          >
            Use Existing Password
          </Button>
          <Button
            onClick={async () => {
              await selectionFeedback();
              setShowDialog(false);
              setPassword("");
              setConfirm("");
              setError("");
              setLoading(false);
              // Optionally clear the stored password if you want to force new creation
              // await store().delete("password");
            }}
            color="secondary"
            variant="outlined"
            sx={{
              borderColor: "#AD5AD7",
              color: "#AD5AD7",
              "&:hover": { background: "#F5F6FA", borderColor: "#C792EA" },
            }}
          >
            Create New Password
          </Button>
        </DialogActions>
      </Dialog>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          bgcolor: "#f5f6fa",
        }}
      >
        <Card sx={{ maxWidth: 480, width: "100%", boxShadow: 3 }}>
          <CardContent>
            <Typography
              variant="h4"
              component="h1"
              align="center"
              fontWeight="bold"
              gutterBottom
            >
              Create Password
            </Typography>
            <Typography
              variant="subtitle1"
              align="center"
              fontWeight="medium"
              sx={{ mb: 2 }}
            >
              Set a strong password to protect your wallet.
            </Typography>
            <TextField
              label="Password"
              type="password"
              fullWidth
              sx={{ mb: 2, bgcolor: "#f3f4f6", borderRadius: 2 }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              sx={{ mb: 2, bgcolor: "#f3f4f6", borderRadius: 2 }}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              error={!!error}
              helperText={error}
            />
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ mb: 1 }}
            >
              This password will be required to access your wallet on this
              device.
            </Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: "center", pb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleContinue}
              disabled={!password || !confirm || loading}
              startIcon={
                loading ? <CircularProgress size={22} color="inherit" /> : null
              }
            >
              {loading ? "Processing..." : "Continue"}
            </Button>
          </CardActions>
        </Card>
      </Box>
    </>
  );
}
