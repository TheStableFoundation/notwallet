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
import { BalanceV1, SolanaWallet } from "@app/lib/crate/generated";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";
import { invoke } from "@tauri-apps/api/core";
import { SEND_TOKEN } from "@app/lib/commands";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { useLang } from "../../../src/LanguageContext";
import { useNetworkEnvironment } from "@app/lib/context/network-environment-context";
import { AssetIcon } from "@app/lib/components/token-icons";
import { debug } from "@tauri-apps/plugin-log";

interface SendModalProps {
  open: boolean;
  onClose: () => void;
  senderAddress: string;
  availableKeypairs: SolanaWallet[];
  availableAssets: BalanceV1[];
}

export default function SendModal({
  open,
  onClose,
  senderAddress,
  availableKeypairs,
  availableAssets,
}: SendModalProps) {
  const { t } = useLang();
  const { environment } = useNetworkEnvironment();
  const [amount, setAmount] = React.useState<string>("");
  const [recipient, setRecipient] = React.useState<string>("");
  const [customAddress, setCustomAddress] = React.useState<string>("");
  const [selectedTokenAddress, setSelectedTokenAddress] =
    React.useState<string>();
  const [selectedBalance, setSelectedBalance] = React.useState<BalanceV1>();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<boolean>(false);

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (open) {
      setAmount("");
      setRecipient("");
      setCustomAddress("");
      setError(null);
      setSuccess(false);
      if (availableAssets.length > 0) {
        updateSelectedToken(availableAssets[0].meta.address);
      }
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

  const handleSelectedBalanceChange = (event: SelectChangeEvent) => {
    updateSelectedToken(event.target.value);
  };

  const updateSelectedToken = (address: string) => {
    setSelectedTokenAddress(address);
    debug(`Selected address: ${selectedTokenAddress}`);
    const selectedBalance = availableAssets.find(
      (p) => p.meta.address == address,
    );
    setSelectedBalance(selectedBalance);
    debug(`Selected balance: ${selectedBalance}`);
  };

  const handleSend = async () => {
    try {
      setError(null);
      setIsLoading(true);
      await selectionFeedback();

      if (!amount || parseFloat(amount) <= 0) {
        setError(t.pleaseEnterValidAmount);
        return;
      }

      const finalRecipient = recipient === "custom" ? customAddress : recipient;
      if (!finalRecipient) {
        setError(t.pleaseSelectRecipient);
        return;
      }

      // Check if balance is sufficient
      if (selectedBalance && parseFloat(amount) > selectedBalance.balance) {
        setError(t.insufficientBalance);
        return;
      }

      // Here you would invoke the Tauri command to send tokens
      // This is a placeholder - implement the actual invoke call
      await invoke(SEND_TOKEN, {
        network: environment,
        from: senderAddress,
        to: finalRecipient,
        amount: parseFloat(amount),
        tokenType: selectedTokenAddress,
      });

      setSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      console.error("Error sending tokens:", err);
      setError(err instanceof Error ? err.message : t.failedToSendTokens);
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
          {t.sendToken}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {t.transactionCompletedSuccessfully}
          </Alert>
        )}

        <Stack spacing={3}>
          <FormControl fullWidth>
            <InputLabel id="token-type-label">{t.tokenType}</InputLabel>
            <Select
              labelId="token-type-label"
              id="token-type"
              value={selectedTokenAddress}
              label={t.tokenType}
              onChange={handleSelectedBalanceChange}
              disabled={isLoading}
            >
              {availableAssets.map((asset, index) => (
                <MenuItem key={index} value={asset.meta.address}>
                  <AssetIcon
                    id={asset.meta.address}
                    logoUrl={asset.meta.logo_uri}
                  />{" "}
                  {asset.meta.name} ({asset.meta.symbol})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label={t.amount}
            fullWidth
            value={amount}
            onChange={handleAmountChange}
            disabled={isLoading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {selectedBalance?.meta.symbol}
                </InputAdornment>
              ),
            }}
            helperText={`${t.available}: ${selectedBalance?.ui_amount} ${selectedBalance?.meta.symbol}`}
          />

          {filteredKeypairs.length > 0 ? (
            <FormControl fullWidth>
              <InputLabel id="recipient-label">{t.recipient}</InputLabel>
              <Select
                labelId="recipient-label"
                id="recipient"
                value={recipient}
                label={t.recipient}
                onChange={handleRecipientChange}
                disabled={isLoading}
              >
                {filteredKeypairs.map((keypair) => (
                  <MenuItem key={keypair.pubkey} value={keypair.pubkey}>
                    {keypair.pubkey.slice(0, 6)}...{keypair.pubkey.slice(-6)}
                  </MenuItem>
                ))}
                <MenuItem value="custom">
                  <em>{t.enterCustomAddress}</em>
                </MenuItem>
              </Select>
            </FormControl>
          ) : (
            <TextField
              label={t.recipientAddress}
              fullWidth
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              disabled={isLoading}
              placeholder={t.enterRecipientPublicKey}
            />
          )}

          {recipient === "custom" && (
            <TextField
              label={t.customAddress}
              fullWidth
              value={customAddress}
              onChange={(e) => setCustomAddress(e.target.value)}
              disabled={isLoading}
              placeholder={t.enterRecipientPublicKey}
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
            {t.cancel}
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
            {isLoading ? t.sending : t.send}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}
