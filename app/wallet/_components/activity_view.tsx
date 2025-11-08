"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { SolanaWallet } from "@app/lib/crate/generated";
import { openUrl } from "@tauri-apps/plugin-opener";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";
import { useLang } from "../../../src/LanguageContext";

interface ActivityViewProps {
  wallet: SolanaWallet;
}

export default function ActivityView({ wallet }: ActivityViewProps) {
  const { t } = useLang();
  const handleOpenSolscan = async () => {
    await selectionFeedback();
    const solscanUrl = `https://notwallet.eu/a/solana/${wallet.pubkey}`;
    await openUrl(solscanUrl);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{ mb: 2, color: "#212529" }}
      >
        {t.transactionHistory}
      </Typography>

      <Box sx={{ textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t.viewWalletActivity}
        </Typography>

        <Button
          variant="outlined"
          startIcon={<OpenInNewIcon />}
          onClick={handleOpenSolscan}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            borderColor: "#9932CC",
            color: "#9932CC",
            "&:hover": {
              borderColor: "#7B2CBF",
              backgroundColor: "rgba(153, 50, 204, 0.04)",
            },
          }}
        >
          {t.openInSolscan}
        </Button>
      </Box>
    </Box>
  );
}
