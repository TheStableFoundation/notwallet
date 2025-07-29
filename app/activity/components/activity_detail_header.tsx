import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";
import { useRouter } from "next/navigation";

export const ActivityDetailHeader = () => {
  const router = useRouter();

  const handleBack = async () => {
    try {
      await selectionFeedback();
    } catch {}
    router.back();
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", pl: 1, pt: 2, pb: 1 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleBack}
        sx={{
          minWidth: 0,
          px: 1,
          py: 0.5,
          fontSize: "0.95rem",
          mr: 1,
        }}
      >
        Back
      </Button>
      <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
        <Typography variant="h5" fontWeight="bold" paddingRight={2}>
          Activity
        </Typography>
      </Box>
    </Box>
  );
};
