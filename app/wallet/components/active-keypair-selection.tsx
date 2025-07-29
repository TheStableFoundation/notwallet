import * as React from "react";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { SolanaWallet } from "../../../lib/crate/generated";
import { invoke } from "@tauri-apps/api/core";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";

interface ActiveKeypairSelectionProps {
  open: boolean;
  onClose: () => void;
  keypairs: SolanaWallet[];
  activePubkey?: string;
  onSelect: (wallet: SolanaWallet) => void;
}

export default function ActiveKeypairSelectionModal({
  open,
  onClose,
  keypairs,
  activePubkey,
  onSelect,
}: ActiveKeypairSelectionProps) {
  return (
    <Modal
      open={open}
      onClose={async () => {
        await selectionFeedback();
        onClose();
      }}
      aria-labelledby="switch-keypair-modal"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        m: 0,
        p: 0,
      }}
    >
      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: 4,
          boxShadow: "0 2px 16px rgba(153,50,204,0.12)",
          p: { xs: 2, sm: 3 },
          minWidth: 300,
          maxWidth: 380,
          width: "90vw",
          outline: "none",
          mx: 1,
        }}
      >
        <Typography
          id="switch-keypair-modal"
          variant="h6"
          sx={{
            mb: 2,
            textAlign: "center",
            fontWeight: "bold",
            color: "transparent",
            background: "linear-gradient(90deg, #9932CC 0%, #A64DFF 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "0.02em",
            fontFamily: "Inter, Helvetica Neue, Arial, sans-serif",
          }}
        >
          Switch Keypair
        </Typography>
        <Box
          sx={{
            maxHeight: 320,
            overflowY: "auto",
            overflowX: "hidden",
            pr: 1,
            mb: 2,
          }}
        >
          {keypairs.length === 0 && (
            <Typography color="text.secondary" align="center">
              No keypairs found.
            </Typography>
          )}
          {keypairs.map((kp) => (
            <Box
              key={kp.pubkey}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1,
                p: 1.2,
                borderRadius: 2,
                bgcolor: activePubkey === kp.pubkey ? "#EDE7F6" : "#f5f6fa",
                border:
                  activePubkey === kp.pubkey
                    ? "2px solid #9932CC"
                    : "1px solid #E0E0E0",
                cursor: "pointer",
                transition: "background 0.2s, border 0.2s",
                minWidth: 0,
              }}
              onClick={async () => {
                await selectionFeedback();
                try {
                  await invoke("set_active_keypair", { keypair: kp });
                  onSelect(kp);
                  onClose();
                } catch {
                  // Optionally handle error
                }
              }}
            >
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  variant="body2"
                  component="span"
                  sx={{
                    fontWeight: "bold",
                    color: "#9932CC",
                    fontSize: "1.05rem",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {kp.name}
                </Typography>{" "}
                <Typography
                  variant="body2"
                  component="span"
                  sx={{
                    fontWeight: "regular",
                    color: "#9932CC",
                    fontSize: "0.85rem",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  (Account {kp.account})
                </Typography>
                <Typography
                  variant="caption"
                  component="div"
                  sx={{
                    fontFamily: "monospace",
                    color: "#333",
                    fontSize: "0.98rem",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {kp.pubkey
                    ? `${kp.pubkey.slice(0, 8)}...${kp.pubkey.slice(-8)}`
                    : ""}
                </Typography>
              </Box>
              {activePubkey === kp.pubkey && (
                <Typography
                  variant="caption"
                  color="primary"
                  sx={{
                    fontWeight: "bold",
                    ml: 2,
                    letterSpacing: 1,
                  }}
                >
                  Active
                </Typography>
              )}
            </Box>
          ))}
        </Box>
        <Button
          variant="outlined"
          fullWidth
          sx={{
            mt: 1,
            borderRadius: 2,
            fontWeight: "bold",
            letterSpacing: 1,
            color: "#9932CC",
            borderColor: "#9932CC",
            "&:hover": { background: "#f5f6fa", borderColor: "#A64DFF" },
          }}
          onClick={async () => {
            await selectionFeedback();
            onClose();
          }}
        >
          Cancel
        </Button>
      </Box>
    </Modal>
  );
}
