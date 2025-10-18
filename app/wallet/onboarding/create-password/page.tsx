"use client";

import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
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
import { store } from "@lib/store/store";
import { STORE_PASSWORD } from "@lib/crate/generated";
import bcrypt from "bcryptjs";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";
import { useNavigate } from "react-router-dom";
import { useLang } from "@src/LanguageContext";

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
  const router = useNavigate();
  const { t } = useLang();

  const handleContinue = async () => {
    await selectionFeedback();
    if (password.length < 6) {
      setError(t.onboardingPasswordMinLength);
      return;
    }
    if (password !== confirm) {
      setError(t.onboardingPasswordMismatch);
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

      router("/wallet");
    } catch (e: any) {
      logError(`Failed to store password securely: ${e?.toString?.() ?? e}`);
      setError(t.errorOccurred);
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
          minHeight: "100vh",
          bgcolor: "linear-gradient(135deg, #FAFBFF 0%, #F8FAFF 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress sx={{ color: "#A78BFA" }} />
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
        PaperProps={{
          sx: {
            borderRadius: "16px",
            boxShadow: "0 8px 32px rgba(139, 92, 246, 0.12)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "18px",
            fontWeight: 600,
            color: "#1F2937",
            letterSpacing: "-0.02em",
          }}
        >
          {t.onboardingPasswordFoundTitle}
        </DialogTitle>
        <DialogContent>
          <Typography
            sx={{
              fontSize: "16px",
              color: "#6B7280",
              lineHeight: 1.6,
            }}
          >
            {t.onboardingPasswordFoundDesc}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1, flexDirection: "column", gap: 2 }}>
          <Button
            onClick={async () => {
              await selectionFeedback();
              setShowDialog(false);
              router("/wallet");
            }}
            variant="contained"
            fullWidth
            sx={{
              py: 1.5,
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
          >
            {t.onboardingUseExistingPassword}
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
            variant="outlined"
            fullWidth
            sx={{
              py: 1.5,
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
          >
            {t.onboardingCreateNewPassword}
          </Button>
        </DialogActions>
      </Dialog>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "linear-gradient(135deg, #FAFBFF 0%, #F8FAFF 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pb: 8,
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 420, px: 2 }}>
          <Typography
            sx={{
              fontSize: "16px",
              color: "#6B7280",
              mb: 3,
              textAlign: "center",
              lineHeight: 1.5,
            }}
          >
            {t.onboardingSetPasswordDesc}
          </Typography>
          <Card
            sx={{
              width: "100%",
              borderRadius: "20px",
              boxShadow: "0 4px 20px rgba(139, 92, 246, 0.08)",
              border: "1px solid rgba(139, 92, 246, 0.06)",
              overflow: "hidden",
              bgcolor: "#FFFFFF",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <TextField
                label={t.onboardingCreatePasswordTitle}
                type="password"
                fullWidth
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "rgba(139, 92, 246, 0.02)",
                    border: "1px solid rgba(139, 92, 246, 0.08)",
                    "&:hover": {
                      border: "1px solid rgba(139, 92, 246, 0.2)",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "rgba(139, 92, 246, 0.04)",
                    },
                    "& fieldset": {
                      border: "none",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#6B7280",
                    "&.Mui-focused": {
                      color: "#8B5CF6",
                    },
                  },
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
              <TextField
                label={`${t.confirm} ${t.onboardingCreatePasswordTitle}`}
                type="password"
                fullWidth
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "rgba(139, 92, 246, 0.02)",
                    border: "1px solid rgba(139, 92, 246, 0.08)",
                    "&:hover": {
                      border: "1px solid rgba(139, 92, 246, 0.2)",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "rgba(139, 92, 246, 0.04)",
                    },
                    "& fieldset": {
                      border: "none",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#6B7280",
                    "&.Mui-focused": {
                      color: "#8B5CF6",
                    },
                  },
                }}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
                error={!!error}
                helperText={error}
              />
            </CardContent>
          </Card>

          {error && (
            <Box
              sx={{
                textAlign: "center",
                mt: 3,
                mb: 3,
              }}
            >
              <Typography
                sx={{
                  fontSize: "14px",
                  color: "#EF4444",
                  lineHeight: 1.6,
                  bgcolor: "rgba(239, 68, 68, 0.04)",
                  border: "1px solid rgba(239, 68, 68, 0.08)",
                  borderRadius: "12px",
                  p: 3,
                }}
              >
                {error}
              </Typography>
            </Box>
          )}

          <Box
            sx={{
              textAlign: "center",
              mt: 3,
              mb: 3,
            }}
          >
            <Typography
              sx={{
                fontSize: "14px",
                color: "#6B7280",
                lineHeight: 1.6,
                bgcolor: "rgba(139, 92, 246, 0.04)",
                border: "1px solid rgba(139, 92, 246, 0.08)",
                borderRadius: "12px",
                p: 3,
              }}
            >
              🔒 {t.onboardingPasswordRequired}
            </Typography>
          </Box>

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
              "&:disabled": {
                background: "#E5E7EB",
                color: "#9CA3AF",
                boxShadow: "none",
              },
            }}
            onClick={handleContinue}
            disabled={!password || !confirm || loading}
            startIcon={
              loading ? <CircularProgress size={22} color="inherit" /> : null
            }
          >
            {loading ? t.processing : t.onboardingContinue}
          </Button>
        </Box>
      </Box>
    </>
  );
}
