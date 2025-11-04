import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";
import { useLang } from "../../../src/LanguageContext";
import { Stack } from "@mui/material";

interface NoSolModalProps {
  open: boolean;
  onClose: () => void;
}

export default function NoSolModal({ open, onClose }: NoSolModalProps) {
  const { t } = useLang();

  return (
    <Modal
      open={open}
      onClose={async () => {
        await selectionFeedback();
        onClose();
      }}
      aria-labelledby="no-sol-modal"
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
          {t.noSolWarningTitle}
        </Typography>
        <Typography
          id="switch-keypair-modal"
          variant="caption"
          sx={{
            mb: 2,
            textAlign: "center",
            color: "transparent",
            background: "linear-gradient(90deg, #9932CC 0%, #A64DFF 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "0.02em",
            fontFamily: "Inter, Helvetica Neue, Arial, sans-serif",
          }}
        >
          {t.noSolWarningDescription}
        </Typography>
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
