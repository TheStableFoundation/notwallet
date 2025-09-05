import * as React from "react";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import { SolanaWallet } from "@/lib/crate/generated";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";
import { invoke } from "@tauri-apps/api/core";
import { SEND_TOKEN } from "@/lib/commands";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

interface SendModalProps {
  open: boolean;
  onClose: () => void;
  senderAddress: string;
  availableKeypairs: SolanaWallet[];
}

export default function SendModal({
  open,
  onClose,
  senderAddress,
  availableKeypairs,
}: SendModalProps) {
  const [amount, setAmount] = React.useState<string>("");
  const [recipient, setRecipient] = React.useState<string>("");
  const [customAddress, setCustomAddress] = React.useState<string>("");
  const [tokenType, setTokenType] = React.useState<"BACH" | "SOL">("BACH");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [bachBalance, setBachBalance] = React.useState<string>("-");
  const [solBalance, setSolBalance] = React.useState<string>("-");

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (open) {
      setAmount("");
      setRecipient("");
      setCustomAddress("");
      setTokenType("BACH");
      setError(null);
      setSuccess(false);
    }
  }, [open]);

  // Filter out the sender address from the available keypairs for the dropdown
  const filteredKeypairs = availableKeypairs.filter(
    (keypair) => keypair.pubkey !== senderAddress,
  );

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and decimal points
    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleRecipientChange = (event: SelectChangeEvent) => {
    setRecipient(event.target.value);
  };

  const handleTokenTypeChange = (event: SelectChangeEvent) => {
    setTokenType(event.target.value as "BACH" | "SOL");
  };

  const handleSend = async () => {
    try {
      setError(null);
      setIsLoading(true);
      await selectionFeedback();

      if (!amount || parseFloat(amount) <= 0) {
        setError("Please enter a valid amount");
        return;
      }

      const finalRecipient = recipient === "custom" ? customAddress : recipient;
      if (!finalRecipient) {
        setError("Please select a recipient");
        return;
      }

      // Check if balance is sufficient
      const currentBalance = tokenType === "BACH" ? bachBalance : solBalance;
      if (
        currentBalance !== "-" &&
        parseFloat(amount) > parseFloat(currentBalance)
      ) {
        setError(`Insufficient ${tokenType} balance`);
        return;
      }

      // Here you would invoke the Tauri command to send tokens
      // This is a placeholder - implement the actual invoke call
      await invoke(SEND_TOKEN, {
        from: senderAddress,
        to: finalRecipient,
        amount: parseFloat(amount),
        tokenType: tokenType,
      });

      setSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      console.error("Error sending tokens:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send tokens. Try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = async () => {
    await selectionFeedback();
    onClose();
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
          Send {tokenType}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Transaction completed successfully!
          </Alert>
        )}

        <Stack spacing={3}>
          <FormControl fullWidth>
            <InputLabel id="token-type-label">Token Type</InputLabel>
            <Select
              labelId="token-type-label"
              id="token-type"
              value={tokenType}
              label="Token Type"
              onChange={handleTokenTypeChange}
              disabled={isLoading}
            >
              <MenuItem value="BACH">BACH</MenuItem>
              <MenuItem value="SOL">SOL</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Amount"
            fullWidth
            value={amount}
            onChange={handleAmountChange}
            disabled={isLoading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">{tokenType}</InputAdornment>
              ),
            }}
            helperText={
              tokenType === "BACH"
                ? `Available: ${bachBalance} BACH`
                : `Available: ${solBalance} SOL`
            }
          />

          {filteredKeypairs.length > 0 ? (
            <FormControl fullWidth>
              <InputLabel id="recipient-label">Recipient</InputLabel>
              <Select
                labelId="recipient-label"
                id="recipient"
                value={recipient}
                label="Recipient"
                onChange={handleRecipientChange}
                disabled={isLoading}
              >
                {filteredKeypairs.map((keypair) => (
                  <MenuItem key={keypair.pubkey} value={keypair.pubkey}>
                    {keypair.pubkey.slice(0, 6)}...{keypair.pubkey.slice(-6)}
                  </MenuItem>
                ))}
                <MenuItem value="custom">
                  <em>Enter custom address...</em>
                </MenuItem>
              </Select>
            </FormControl>
          ) : (
            <TextField
              label="Recipient Address"
              fullWidth
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              disabled={isLoading}
              placeholder="Enter recipient's public key"
            />
          )}

          {recipient === "custom" && (
            <TextField
              label="Custom Address"
              fullWidth
              value={customAddress}
              onChange={(e) => setCustomAddress(e.target.value)}
              disabled={isLoading}
              placeholder="Enter recipient's public key"
            />
          )}
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
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSend}
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
            {isLoading ? "Sending..." : "Send"}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}
