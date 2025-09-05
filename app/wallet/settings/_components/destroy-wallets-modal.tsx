"use client";

import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  Alert,
  CircularProgress,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { invoke } from "@tauri-apps/api/core";

interface DestroyWalletsModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function DestroyWalletsModal({
  open,
  onClose,
  onSuccess,
}: DestroyWalletsModalProps) {
  const [confirmationText, setConfirmationText] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const CONFIRMATION_PHRASE = "DELETE ALL WALLETS";

  const handleClose = () => {
    if (!isLoading) {
      setConfirmationText("");
      setError(null);
      onClose();
    }
  };

  const handleDestroy = async () => {
    if (confirmationText !== CONFIRMATION_PHRASE) {
      setError("Confirmation phrase does not match");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await invoke("destroy_all_wallets");

      // Reset form
      setConfirmationText("");

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }

      // Close modal
      handleClose();
    } catch (err) {
      setError(err as string);
    } finally {
      setIsLoading(false);
    }
  };

  const isConfirmationValid = confirmationText === CONFIRMATION_PHRASE;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "20px",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
          border: "1px solid rgba(255, 0, 0, 0.1)",
        },
      }}
    >
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            color: "#DC2626",
          }}
        >
          <WarningAmberIcon sx={{ fontSize: "28px" }} />
          <Typography
            variant="h6"
            sx={{
              fontSize: "20px",
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
          >
            Destroy All Wallets
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: "12px",
            "& .MuiAlert-message": {
              fontSize: "14px",
              lineHeight: 1.5,
            },
          }}
        >
          <Typography sx={{ fontWeight: 600, mb: 1 }}>
            ⚠️ IRREVERSIBLE ACTION
          </Typography>
          This will permanently delete:
          <Box component="ul" sx={{ mt: 1, mb: 0, pl: 2 }}>
            <li>All wallet accounts and private keys</li>
            <li>All seed phrases</li>
            <li>All transaction history</li>
            <li>All stored passwords</li>
            <li>Complete local database</li>
          </Box>
        </Alert>

        <Typography
          sx={{
            fontSize: "14px",
            color: "#6B7280",
            mb: 2,
            lineHeight: 1.5,
          }}
        >
          <strong>Make sure you have backed up your seed phrases</strong> before
          proceeding. Once destroyed, this data cannot be recovered unless you
          have your seed phrases saved elsewhere.
        </Typography>

        <Typography
          sx={{
            fontSize: "14px",
            color: "#374151",
            mb: 2,
            fontWeight: 500,
          }}
        >
          To confirm, type{" "}
          <Box
            component="span"
            sx={{
              fontFamily: "monospace",
              bgcolor: "#FEF2F2",
              color: "#DC2626",
              px: 1,
              py: 0.5,
              borderRadius: "6px",
              fontWeight: 600,
            }}
          >
            {CONFIRMATION_PHRASE}
          </Box>{" "}
          below:
        </Typography>

        <TextField
          fullWidth
          value={confirmationText}
          onChange={(e) => {
            setConfirmationText(e.target.value);
            setError(null);
          }}
          placeholder="Type confirmation phrase here"
          disabled={isLoading}
          error={!!error}
          helperText={error}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              fontFamily: "monospace",
              fontSize: "14px",
              "&.Mui-error": {
                "& fieldset": {
                  borderColor: "#DC2626",
                },
              },
            },
          }}
        />
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button
          onClick={handleClose}
          disabled={isLoading}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 500,
            color: "#6B7280",
            "&:hover": {
              bgcolor: "rgba(107, 114, 128, 0.04)",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleDestroy}
          disabled={!isConfirmationValid || isLoading}
          variant="contained"
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 600,
            bgcolor: "#DC2626",
            color: "white",
            minWidth: "140px",
            "&:hover": {
              bgcolor: "#B91C1C",
            },
            "&:disabled": {
              bgcolor: "#E5E7EB",
              color: "#9CA3AF",
            },
          }}
        >
          {isLoading ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={16} sx={{ color: "white" }} />
              Destroying...
            </Box>
          ) : (
            "Destroy All Wallets"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
