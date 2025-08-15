import * as React from "react";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";
import LockIcon from "@mui/icons-material/Lock";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";
import { SolanaWallet } from "@/lib/crate/generated";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import { useRouter } from "next/navigation";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { invoke } from "@tauri-apps/api/core";
import {
  GET_BACH_BALANCE,
  GET_SOL_BALANCE,
  GET_ALL_KEYPAIRS,
} from "@/lib/commands";
import SendModal from "./send-modal";
import SwapModal from "./swap-modal";
import EditKeyPairModal from "./edit-keypair-modal";
import { SolanaIcon, BachIcon } from "@/lib/components/token-icons";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { openUrl } from "@tauri-apps/plugin-opener";
import { BACH_MINT_ACCOUNT } from "@/lib/crate/generated";

interface WalletCardProps {
  wallet: SolanaWallet;
  onLock: () => void;
  onSwitchKeypair: () => void;
}

export default function WalletCard({
  wallet,
  onLock,
  onSwitchKeypair,
}: WalletCardProps) {
  const router = useRouter();
  const [bachBalance, setBachBalance] = React.useState<string>("-");
  const [solBalance, setSolBalance] = React.useState<string>("-");
  const [walletUsername, setWalletUsername] = React.useState<string>(
    wallet.username || "NowhereMan",
  );
  const [sendModalOpen, setSendModalOpen] = React.useState<boolean>(false);
  const [swapModalOpen, setSwapModalOpen] = React.useState<boolean>(false);
  const [editKeyPairModalOpen, setEditKeyPairModalOpen] =
    React.useState<boolean>(false);
  const [availableKeypairs, setAvailableKeypairs] = React.useState<
    SolanaWallet[]
  >([]);

  // Update walletUsername when wallet.username changes
  React.useEffect(() => {
    setWalletUsername(wallet.username || "NowhereMan");
  }, [wallet.username]);

  const handleWalletSettings = async () => {
    await selectionFeedback();
    router.push("/wallet/settings");
  };

  const handleSend = async () => {
    await selectionFeedback();
    // Get all available keypairs for the dropdown
    try {
      const keypairs = await invoke<SolanaWallet[]>(GET_ALL_KEYPAIRS);
      setAvailableKeypairs(keypairs || []);
    } catch (error) {
      console.error("Error fetching keypairs:", error);
      setAvailableKeypairs([]);
    }
    setSendModalOpen(true);
  };

  const handleSwap = async () => {
    await selectionFeedback();
    // Get all available keypairs for the dropdown
    try {
      const keypairs = await invoke<SolanaWallet[]>(GET_ALL_KEYPAIRS);
      setAvailableKeypairs(keypairs || []);
    } catch (error) {
      console.error("Error fetching keypairs:", error);
      setAvailableKeypairs([]);
    }
    setSwapModalOpen(true);
  };

  const handleCloseSendModal = () => {
    setSendModalOpen(false);
    // Refresh balances after sending
    init();
  };

  const handleCloseSwapModal = () => {
    setSwapModalOpen(false);
    // Refresh balances after swapping
    init();
  };

  const handleCloseEditKeyPairModal = (updatedUsername: string) => {
    setEditKeyPairModalOpen(false);
    if (updatedUsername && updatedUsername !== walletUsername) {
      setWalletUsername(updatedUsername);
    }
  };

  const onBuySol = React.useCallback(async () => {
    await selectionFeedback();
    router.push("/wallet/buy?address=" + wallet.pubkey);
  }, [router, wallet]);

  const onEditKeypair = async () => {
    await selectionFeedback();
    setEditKeyPairModalOpen(true);
  };

  const handleOpenTokenInformation = async (token: "BACH" | "SOL") => {
    await selectionFeedback();
    const url =
      token === "BACH"
        ? `https://birdeye.so/token/${BACH_MINT_ACCOUNT}?chain=solana`
        : "https://solana.org";
    openUrl(url);
  };

  const init = async () => {
    try {
      const balance = await invoke<string>(GET_BACH_BALANCE, {
        pubkey: wallet.pubkey,
      });
      setBachBalance(`${balance}`);
      const solBalance = await invoke<string>(GET_SOL_BALANCE, {
        pubkey: wallet.pubkey,
      });
      setSolBalance(`${solBalance}`);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  React.useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 2,
        boxShadow: "0 2px 16px rgba(153,50,204,0.08)",
        p: 2,
        background:
          "linear-gradient(135deg, rgba(153, 50, 204, 0.85) 0%, rgba(166, 77, 255, 0.8) 100%)",
        color: "#fff",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Stack
        direction="row"
        alignItems="start"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Stack direction="row" spacing={1}>
          <Typography
            variant="h6"
            fontWeight="bold"
            color="#fff"
            sx={{ fontSize: 16 }}
          >
            {walletUsername}
          </Typography>
          <IconButton
            size="small"
            onClick={onEditKeypair}
            sx={{
              fontWeight: "bold",
              background: "#fff",
              color: "#9932CC",
              boxShadow: "0 1px 6px #9932CC22",
              "&:hover": { background: "#f5f6fa" },
            }}
          >
            <BorderColorRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Toggle Lock Wallet" arrow>
            <IconButton
              size="small"
              sx={{
                minWidth: 0,
                px: 1.5,
                borderRadius: 2,
                fontWeight: "bold",
                background: "#fff",
                color: "#9932CC",
                boxShadow: "0 1px 6px #9932CC22",
                "&:hover": { background: "#f5f6fa" },
              }}
              onClick={onLock}
            >
              <LockIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Wallet settings" arrow>
            <IconButton
              sx={{
                color: "#9932CC",
                bgcolor: "#f5f6fa",
                "&:hover": { bgcolor: "#EDE7F6" },
                borderRadius: 2,
              }}
              onClick={handleWalletSettings}
              size="small"
            >
              <SettingsIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
        <Avatar sx={{ width: 56, height: 56, bgcolor: "#fff" }}>
          <Typography variant="h5" color="#9932CC">
            {walletUsername[0]}
            {walletUsername[1]}
          </Typography>
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Box
            sx={{
              mt: 1,
              mb: 1,
              bgcolor: "#fff",
              borderRadius: 2,
              px: 2,
              py: 1,
              display: "flex",
              alignItems: "center",
              gap: 1,
              boxShadow: "0 1px 4px #9932CC11",
            }}
          >
            <Tooltip title="Copy pubkey" arrow>
              <Typography
                variant="body2"
                sx={{
                  color: "#9932CC",
                  fontFamily: "monospace",
                  fontWeight: "bold",
                  fontSize: "1.05rem",
                  wordBreak: "break-all",
                  whiteSpace: "pre-wrap",
                  flex: 1,
                  userSelect: "all",
                  cursor: "pointer",
                }}
                onClick={async () => {
                  if (wallet?.pubkey) {
                    await writeText(wallet.pubkey);
                  }
                }}
              >
                {wallet?.pubkey
                  ? `${wallet.pubkey.slice(0, 3)}...${wallet.pubkey.slice(-3)}`
                  : ""}
              </Typography>
            </Tooltip>
            <Tooltip title="Switch keypair" arrow>
              <IconButton
                sx={{
                  color: "#9932CC",
                  bgcolor: "#f5f6fa",
                  "&:hover": { bgcolor: "#EDE7F6" },
                  ml: 1,
                  borderRadius: 2,
                }}
                onClick={onSwitchKeypair}
                size="small"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M16 17L21 12L16 7"
                    stroke="#9932CC"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 12H9"
                    stroke="#9932CC"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 7L3 12L8 17"
                    stroke="#9932CC"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Stack>
      <Stack
        direction="row"
        alignItems="start"
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 2 }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ mb: 2, color: "#212529" }}
        >
          Balance
        </Typography>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ flex: 1, justifyContent: "flex-end" }}
        >
          <Tooltip title="Send">
            <IconButton
              sx={{
                color: "#9932CC",
                bgcolor: "#f5f6fa",
                "&:hover": { bgcolor: "#EDE7F6" },
                borderRadius: 2,
              }}
              onClick={handleSend}
              size="small"
            >
              <SendIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Swap">
            <IconButton
              sx={{
                color: "#9932CC",
                bgcolor: "#f5f6fa",
                "&:hover": { bgcolor: "#EDE7F6" },
                borderRadius: 2,
              }}
              onClick={handleSwap}
              size="small"
            >
              <SwapHorizIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
      {/* BACH Balance with Token Icon */}
      <Stack
        direction="row"
        alignItems="start"
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 2 }}
      >
        <Stack direction="row" alignItems="center" spacing={1} sx={{ flex: 1 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              bgcolor: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <BachIcon size={20} />
          </Box>
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{
              color: "#fff",
              textShadow: "0 2px 12px #9932CC55",
              fontFamily: "Inter, Helvetica Neue, Arial, sans-serif",
              fontSize: 24,
            }}
          >
            {bachBalance}
          </Typography>
          <IconButton
            onClick={() => handleOpenTokenInformation("BACH")}
            sx={{
              color: "#fff",
              textShadow: "0 2px 12px #9932CC55",
              fontFamily: "Inter, Helvetica Neue, Arial, sans-serif",
              fontSize: 16,
            }}
          >
            <OpenInNewIcon />
          </IconButton>
        </Stack>
      </Stack>
      {/* SOL Balance with Solana Icon */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            bgcolor: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <SolanaIcon size={20} />
        </Box>
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{
            color: "#fff",
            textShadow: "0 2px 12px #9932CC55",
            fontFamily: "Inter, Helvetica Neue, Arial, sans-serif",
            fontSize: 16,
          }}
        >
          {solBalance}
        </Typography>
      </Stack>
      <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            background:
              "linear-gradient(90deg, rgba(153, 50, 204, 0.9) 0%, rgba(166, 77, 255, 0.85) 100%)",
            color: "#fff",
            fontWeight: "bold",
            borderRadius: 2,
            boxShadow: "0 2px 10px rgba(153, 50, 204, 0.3)",
            backdropFilter: "blur(8px)",
            transition: "all 0.3s ease",
            position: "relative",
            overflow: "hidden",
            "&:before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "40%",
              background:
                "linear-gradient(180deg, rgba(255, 255, 255, 0.15), transparent)",
              borderRadius: "2px 2px 0 0",
            },
            "&:hover": {
              background:
                "linear-gradient(90deg, rgba(166, 77, 255, 0.9) 0%, rgba(153, 50, 204, 0.85) 100%)",
              boxShadow: "0 4px 15px rgba(153, 50, 204, 0.4)",
            },
          }}
          fullWidth
          onClick={onBuySol}
        >
          Buy SOL
        </Button>
      </Stack>

      {/* Send Modal */}
      <SendModal
        open={sendModalOpen}
        onClose={handleCloseSendModal}
        senderAddress={wallet.pubkey}
        availableKeypairs={availableKeypairs}
        bachBalance={bachBalance}
        solBalance={solBalance}
      />

      {/* Swap Modal */}
      <SwapModal
        open={swapModalOpen}
        onClose={handleCloseSwapModal}
        senderAddress={wallet.pubkey}
        availableKeypairs={availableKeypairs}
        bachBalance={bachBalance}
        solBalance={solBalance}
      />
      <EditKeyPairModal
        open={editKeyPairModalOpen}
        onClose={handleCloseEditKeyPairModal}
        wallet={wallet}
      />
    </Card>
  );
}
