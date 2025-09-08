import * as React from "react";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import { SolanaWallet } from "@/lib/crate/generated";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";
import { invoke } from "@tauri-apps/api/core";
import { UPDATE_USERNAME } from "@/lib/commands";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { useI18n } from "@/lib/i18n/provider";

interface EditKeyPairModalProps {
  open: boolean;
  onClose: (username: string) => void;
  wallet: SolanaWallet;
}

export default function EditKeyPairModal({
  open,
  onClose,
  wallet,
}: EditKeyPairModalProps) {
  const { t } = useI18n();
  const [username, setUsername] = React.useState<string>(
    wallet.username || t("wallet.defaultUsername"),
  );
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<boolean>(false);

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (open) {
      setUsername(wallet.username || "");
      setError(null);
      setSuccess(false);
    }
  }, [open, wallet.username]);

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleUpdateUsername = async () => {
    try {
      setError(null);
      setIsLoading(true);
      await selectionFeedback();
      if (!username) {
        setError(t("wallet.pleaseSelectUsername"));
        return;
      }
      if (username.length > 6) {
        setError(t("wallet.usernameTooLong"));
        return;
      }

      // Here you would invoke the Tauri command to send tokens
      // This is a placeholder - implement the actual invoke call
      await invoke(UPDATE_USERNAME, {
        uid: wallet.id,
        username,
      });

      setSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      console.error("Error updating username:", err);
      setError(
        err instanceof Error ? err.message : t("wallet.updateUsernameFailed"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = async () => {
    await selectionFeedback();
    onClose(username);
  };

  return (
    <Modal
      open={open}
      aria-labelledby="send-modal-title"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: "90%",
          maxWidth: 480,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          outline: "none",
          maxHeight: "90vh",
          overflow: "auto",
        }}
      >
        <Typography
          id="send-modal-title"
          variant="h6"
          sx={{
            mb: 3,
            textAlign: "center",
            fontWeight: "bold",
            color: "transparent",
            background: "linear-gradient(90deg, #9932CC 0%, #A64DFF 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
          }}
        >
          {t("wallet.editWallet")}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {t("wallet.success")}
          </Alert>
        )}

        <Stack spacing={3}>
          <FormControl fullWidth>
            <TextField
              label={t("wallet.username")}
              fullWidth
              value={username}
              onChange={handleUsernameChange}
              disabled={isLoading}
              helperText={`${wallet.name} (${t("wallet.maxCharacters", { count: 6 })})`}
              inputProps={{ maxLength: 6 }}
            />
          </FormControl>
        </Stack>

        <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
          <Button
            variant="outlined"
            onClick={handleClose}
            disabled={isLoading}
            sx={{
              flex: 1,
              borderRadius: 2,
              color: "#9932CC",
              borderColor: "#9932CC",
              "&:hover": {
                borderColor: "#7B2599",
                backgroundColor: "rgba(153, 50, 204, 0.04)",
              },
            }}
          >
            {t("common.cancel")}
          </Button>
          <Button
            variant="contained"
            onClick={handleUpdateUsername}
            disabled={isLoading || success}
            sx={{
              flex: 1,
              borderRadius: 2,
              background: "linear-gradient(90deg, #9932CC 0%, #A64DFF 100%)",
              color: "#fff",
              "&:hover": {
                background: "linear-gradient(90deg, #8A2BE2 0%, #9400D3 100%)",
              },
            }}
            startIcon={
              isLoading ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {isLoading ? t("wallet.saving") : t("common.save")}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}
