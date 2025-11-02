import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";
import { useLang } from "../../../src/LanguageContext";
import QRCode from "react-qr-code";

interface ModalQrCodeProps {
  open: boolean;
  onClose: () => void;
  activePubkey?: string;
}

export default function ModalQrCodeModal({
  open,
  onClose,
  activePubkey,
}: ModalQrCodeProps) {
  const { t } = useLang();
  return (
    <Modal
      open={open}
      onClose={async () => {
        await selectionFeedback();
        onClose();
      }}
      aria-labelledby="qrcode-modal"
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
          {t.addressQrCode}
        </Typography>
        {activePubkey && (
          <QRCode
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={activePubkey}
            viewBox={`0 0 256 256`}
          />
        )}
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
          {t.cancel}
        </Button>
      </Box>
    </Modal>
  );
}
