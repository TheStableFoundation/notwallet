import * as React from "react";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import {
  SolanaWallet,
  SwapQuoteResponse,
  SwapTransactionPayload,
  SwapTransactionResponse,
  PriorityLevelWithMaxLamports,
  PrioritizationFeeLamports,
  SOLANA,
  SOL_DECIMALS,
  BACH_DECIMALS,
  BACH_TOKEN,
} from "@lib/crate/generated";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";
import { invoke } from "@tauri-apps/api/core";
import { GET_SWAP_QUOTE, BUILD_SWAP_TRANSACTION } from "@lib/commands";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { AssetIcon } from "@lib/components/token-icons";
import { info, debug } from "@tauri-apps/plugin-log";
import { useLang } from "../../../src/LanguageContext";

interface SwapModalProps {
  open: boolean;
  onClose: () => void;
  senderAddress: string;
  availableKeypairs: SolanaWallet[];
}

export default function SwapModal({
  open,
  onClose,
  senderAddress,
}: SwapModalProps) {
  const { t } = useLang();
  const [inputAmount, setInputAmount] = React.useState<string>("");
  const [fromToken, setFromToken] = React.useState<"SOL" | "BACH">("SOL");
  const [toToken, setToToken] = React.useState<"SOL" | "BACH">("BACH");
  const [isLoadingQuote, setIsLoadingQuote] = React.useState<boolean>(false);
  const [isSwapping, setIsSwapping] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [quote, setQuote] = React.useState<SwapQuoteResponse | null>(null);
  const [transactionResponse, setTransactionResponse] =
    React.useState<SwapTransactionResponse | null>(null);
  const [slippage, setSlippage] = React.useState<number>(50); // 0.5% default slippage
  const [bachBalance, _setBachBalance] = React.useState<string>("-");
  const [solBalance, _setSolBalance] = React.useState<string>("-");

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (open) {
      setInputAmount("");
      setFromToken("SOL");
      setToToken("BACH");
      setError(null);
      setSuccess(false);
      setQuote(null);
      setTransactionResponse(null);
      setSlippage(50);
    }
  }, [open]);

  // Get quote when input amount changes
  React.useEffect(() => {
    const getQuote = async () => {
      if (!inputAmount || parseFloat(inputAmount) <= 0) {
        setQuote(null);
        return;
      }

      try {
        setIsLoadingQuote(true);
        setError(null);

        const fromMint = fromToken === "SOL" ? SOLANA : BACH_TOKEN;
        const toMint = toToken === "SOL" ? SOLANA : BACH_TOKEN;

        const amount = parseFloat(inputAmount);
        const quoteResult = await invoke<SwapQuoteResponse>(GET_SWAP_QUOTE, {
          fromToken: fromMint,
          toToken: toMint,
          amount: amount,
          slippageBps: slippage,
        });

        setQuote(quoteResult);
      } catch (err) {
        console.error("Error getting swap quote:", err);
        setError(err instanceof Error ? err.message : t.failedToGetQuote);
        setQuote(null);
      } finally {
        setIsLoadingQuote(false);
      }
    };

    // Debounce the quote request
    const timeoutId = setTimeout(getQuote, 500);
    return () => clearTimeout(timeoutId);
  }, [inputAmount, fromToken, toToken, slippage]);

  const handleInputAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and decimal points
    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setInputAmount(value);
    }
  };

  const handleSwapTokens = async () => {
    await selectionFeedback();
    // Swap the from and to tokens
    const newFromToken = toToken;
    const newToToken = fromToken;
    setFromToken(newFromToken);
    setToToken(newToToken);
    setInputAmount("");
    setQuote(null);
  };

  const handleSlippageChange = (event: SelectChangeEvent) => {
    setSlippage(parseInt(event.target.value));
  };

  const getOutputAmount = () => {
    if (!quote) return "0";
    const amount = parseInt(quote.outAmount);
    const decimals = toToken === "SOL" ? SOL_DECIMALS : BACH_DECIMALS;
    return (amount / Math.pow(10, decimals)).toFixed(6);
  };

  const getFeeAmount = () => {
    if (!quote || !quote.routePlan[0]) return "0";
    const feeAmount = parseInt(quote.routePlan[0].swapInfo.feeAmount);
    const feeMint = quote.routePlan[0].swapInfo.feeMint;
    const decimals = feeMint === SOLANA ? SOL_DECIMALS : BACH_DECIMALS;
    return (feeAmount / Math.pow(10, decimals)).toFixed(6);
  };

  const getFeeMintSymbol = () => {
    if (!quote || !quote.routePlan[0]) return "";
    const feeMint = quote.routePlan[0].swapInfo.feeMint;
    return feeMint === SOLANA ? "SOL" : "BACH";
  };

  const createOptimalSwapTransactionPayload = (
    quote: SwapQuoteResponse,
    userPublicKey: string,
    priorityLevel: "low" | "medium" | "high" | "veryHigh" = "veryHigh",
    maxLamports: number = 1000000,
  ): SwapTransactionPayload => {
    const priorityLevelConfig: PriorityLevelWithMaxLamports = {
      maxLamports: maxLamports,
      priorityLevel: priorityLevel,
    };

    const prioritizationFee: PrioritizationFeeLamports = {
      priorityLevelWithMaxLamports: priorityLevelConfig,
    };

    return {
      quoteResponse: quote,
      userPublicKey: userPublicKey,
      dynamicComputeUnitLimit: true, // Automatically optimize compute units
      dynamicSlippage: true, // Automatically adjust slippage if needed
      prioritizationFeeLamports: prioritizationFee,
    };
  };

  const handleResetTransaction = () => {
    setTransactionResponse(null);
    setError(null);
    setSuccess(false);
  };

  const handleSwap = async () => {
    try {
      setError(null);
      setIsSwapping(true);
      await selectionFeedback();

      // If transaction is already built, execute it
      if (transactionResponse) {
        info(
          `Executing swap transaction: ${transactionResponse.swapTransaction}`,
        );
        const signature = await invoke("send_swap_transaction", {
          swapTransaction: transactionResponse.swapTransaction,
        });
        debug(`Transaction executed successfully: ${signature}`);

        return;
      }

      if (!inputAmount || parseFloat(inputAmount) <= 0) {
        setError("Please enter a valid amount");
        return;
      }

      if (!quote) {
        setError("Please wait for quote to load");
        return;
      }

      // Check if balance is sufficient
      const currentBalance = fromToken === "SOL" ? solBalance : bachBalance;
      if (
        currentBalance !== "-" &&
        parseFloat(inputAmount) > parseFloat(currentBalance)
      ) {
        setError(`Insufficient ${fromToken} balance`);
        return;
      }

      // Build the swap transaction with optimal parameters
      const payload = createOptimalSwapTransactionPayload(
        quote,
        senderAddress,
        "veryHigh", // Use high priority for better transaction landing
        1000000, // Max 1 SOL (1M lamports) for priority fees
      );
      try {
        const transactionData = await invoke<SwapTransactionResponse>(
          BUILD_SWAP_TRANSACTION,
          {
            payload,
          },
        );

        console.log("Swap transaction built successfully:", transactionData);
        setTransactionResponse(transactionData);
      } catch (buildError) {
        console.error("Error building swap transaction:", buildError);
        setError(
          buildError instanceof Error
            ? `Transaction build failed: ${buildError.message}`
            : "Failed to build swap transaction. Please try again.",
        );
        return;
      }
    } catch (err) {
      console.error("Error executing swap:", err);
      setError(err instanceof Error ? err.message : t.failedToSwap);
    } finally {
      setIsSwapping(false);
    }
  };

  const handleClose = async () => {
    await selectionFeedback();
    onClose();
  };

  const getTokenIcon = (token: "SOL" | "BACH") => {
    const id = token === "SOL" ? SOLANA : BACH_TOKEN;
    return <AssetIcon id={id} size={20} />;
  };

  return (
    <Modal
      open={open}
      aria-labelledby="swap-modal-title"
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
          id="swap-modal-title"
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
          {t.swapTokens}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {t.swapCompleted}
          </Alert>
        )}

        <Stack spacing={2}>
          <Box
            sx={{
              p: 2,
              border: "1px solid #E0E0E0",
              borderRadius: 2,
              bgcolor: "#FAFAFA",
            }}
          >
            {/* Two columns */}
            <Stack spacing={2} direction="row" alignItems="center">
              <Stack spacing={1.5}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ minWidth: 80 }}
                  >
                    <Typography variant="subtitle2" sx={{ color: "#666" }}>
                      {t.from}
                    </Typography>
                    {getTokenIcon(fromToken)}
                    <Typography variant="body1" fontWeight="bold">
                      {fromToken}
                    </Typography>
                  </Stack>
                  <TextField
                    value={inputAmount}
                    onChange={handleInputAmountChange}
                    placeholder="0.0"
                    variant="outlined"
                    size="small"
                    sx={{ flex: 1 }}
                    InputProps={{
                      sx: { fontSize: "1.1rem", fontWeight: "bold" },
                    }}
                    disabled={isSwapping}
                  />
                </Stack>

                <Typography variant="caption" sx={{ color: "#666", ml: 9 }}>
                  {t.available}:{" "}
                  {fromToken === "SOL" ? solBalance : bachBalance} {fromToken}
                </Typography>

                <Stack direction="row" alignItems="center" spacing={2}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ minWidth: 80 }}
                  >
                    <Typography variant="subtitle2" sx={{ color: "#666" }}>
                      {t.to}
                    </Typography>
                    {getTokenIcon(toToken)}
                    <Typography variant="body1" fontWeight="bold">
                      {toToken}
                    </Typography>
                  </Stack>
                  <Box
                    sx={{
                      flex: 1,
                      textAlign: "right",
                      pr: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                    }}
                  >
                    {isLoadingQuote ? (
                      <CircularProgress size={20} />
                    ) : (
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        sx={{ color: "#333" }}
                      >
                        {quote ? getOutputAmount() : "0.0"}
                      </Typography>
                    )}
                  </Box>
                </Stack>
              </Stack>
              <Tooltip title={t.swapTokensTooltip}>
                <IconButton
                  onClick={handleSwapTokens}
                  disabled={isSwapping}
                  size="small"
                  sx={{
                    bgcolor: "#9932CC",
                    color: "#fff",
                    "&:hover": { bgcolor: "#7B2599" },
                    "&:disabled": { bgcolor: "#E0E0E0" },
                  }}
                >
                  <SwapVertIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>

          {/* Quote Details */}
          {quote && (
            <Box
              sx={{
                p: 2,
                bgcolor: "#F5F5F5",
                borderRadius: 2,
                border: "1px solid #E0E0E0",
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, fontWeight: "bold" }}
              >
                {t.quoteDetails}
              </Typography>
              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="#666">
                    {t.outputAmount}:
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {getOutputAmount()} {toToken}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="#666">
                    {t.fee}:
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {getFeeAmount()} {getFeeMintSymbol()}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="#666">
                    {t.priceImpact}:
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {quote.priceImpactPct}%
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="#666">
                    {t.route}:
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {quote.routePlan[0]?.swapInfo.label || t.direct}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          )}

          {/* Transaction Details */}
          {transactionResponse && (
            <Box
              sx={{
                p: 2,
                bgcolor: "#E8F5E8",
                borderRadius: 2,
                border: "1px solid #4CAF50",
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, fontWeight: "bold", color: "#2E7D32" }}
              >
                {t.transactionReady}
              </Typography>
              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="#666">
                    {t.blockHeight}:
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {transactionResponse.lastValidBlockHeight.toLocaleString()}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="#666">
                    {t.priorityFee}:
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {(
                      transactionResponse.prioritizationFeeLamports / 1e9
                    ).toFixed(6)}{" "}
                    SOL
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="#666">
                    {t.computeUnits}:
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {transactionResponse.computeUnitLimit.toLocaleString()}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="#666">
                    {t.finalSlippage}:
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {(
                      transactionResponse.dynamicSlippageReport.slippageBps /
                      100
                    ).toFixed(2)}
                    %
                  </Typography>
                </Stack>
                {transactionResponse.simulationError && (
                  <Alert severity="warning" sx={{ mt: 1 }}>
                    {t.simulationWarning}: {transactionResponse.simulationError}
                  </Alert>
                )}
              </Stack>
              <Button
                variant="outlined"
                size="small"
                onClick={handleResetTransaction}
                sx={{
                  mt: 2,
                  color: "#666",
                  borderColor: "#E0E0E0",
                  "&:hover": {
                    borderColor: "#9932CC",
                    color: "#9932CC",
                  },
                }}
              >
                {t.buildNewTransaction}
              </Button>
            </Box>
          )}

          {/* Slippage Setting */}
          <FormControl fullWidth>
            <InputLabel id="slippage-label">{t.slippage}</InputLabel>
            <Select
              labelId="slippage-label"
              id="slippage"
              value={slippage.toString()}
              label={t.slippage}
              onChange={handleSlippageChange}
              disabled={isSwapping}
            >
              <MenuItem value={10}>0.1%</MenuItem>
              <MenuItem value={50}>0.5%</MenuItem>
              <MenuItem value={100}>1%</MenuItem>
              <MenuItem value={300}>3%</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            onClick={handleClose}
            disabled={isSwapping}
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
            onClick={handleSwap}
            disabled={isSwapping || success || !quote || isLoadingQuote}
            sx={{
              flex: 1,
              borderRadius: 2,
              background: transactionResponse
                ? "linear-gradient(90deg, #4CAF50 0%, #66BB6A 100%)"
                : "linear-gradient(90deg, #9932CC 0%, #A64DFF 100%)",
              color: "#fff",
              "&:hover": {
                background: transactionResponse
                  ? "linear-gradient(90deg, #388E3C 0%, #4CAF50 100%)"
                  : "linear-gradient(90deg, #8A2BE2 0%, #9400D3 100%)",
              },
            }}
            startIcon={
              isSwapping ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {isSwapping
              ? t.buildingTransaction
              : transactionResponse
                ? t.executeSwap
                : t.prepareSwap}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}
