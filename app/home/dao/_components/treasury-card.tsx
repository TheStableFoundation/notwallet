"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {
  THE_STABLE_FOUNDATION_ADDRESS,
  THE_STABLE_FOUNDATION_TREASURY_ADDRESS,
  THE_STABLE_FOUNDATION_TREASURY_WALLET_FEE,
} from "@app/lib/crate/generated";
import { openDaoExplorer } from "@app/lib/helper";
import { useLang } from "../../../../src/LanguageContext";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";

export default function TreasuryCard() {
  const { t } = useLang();

  const treasuryWallets = [
    THE_STABLE_FOUNDATION_TREASURY_ADDRESS,
    THE_STABLE_FOUNDATION_TREASURY_WALLET_FEE,
  ];

  return (
    <Card
      sx={{
        mb: 3,
        borderRadius: 2,
        boxShadow: "0 2px 16px rgba(153,50,204,0.08)",
        p: 3,
        background:
          "linear-gradient(135deg, rgba(153, 50, 204, 0.85) 0%, rgba(166, 77, 255, 0.8) 100%)",
        color: "#fff",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Typography
        variant="h5"
        fontWeight="bold"
        color="#fff"
        sx={{ mb: 2, textAlign: "center" }}
      >
        {t.treasury}
      </Typography>

      {treasuryWallets.map((address) => (
        <Box
          sx={{
            bgcolor: "#fff",
            borderRadius: 2,
            px: 2,
            py: 1.5,
            mb: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 1px 4px #9932CC11",
          }}
        >
          <Typography
            variant="button"
            sx={{
              display: "block",
              color: "#9932CC",
              fontFamily: "monospace",
              fontWeight: "bold",
              fontSize: "0.9rem",
              flex: 1,
            }}
          >
            {`${address.slice(0, 8)}...${address.slice(-8)}`}
          </Typography>
          <Tooltip title={t.viewOnExplorer} arrow>
            <IconButton
              onClick={async () => {
                await selectionFeedback();
                openDaoExplorer(THE_STABLE_FOUNDATION_ADDRESS + "/treasury");
              }}
              sx={{
                color: "#9932CC",
                ml: 1,
                "&:hover": { bgcolor: "rgba(153, 50, 204, 0.1)" },
              }}
              size="small"
            >
              <OpenInNewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ))}
    </Card>
  );
}
