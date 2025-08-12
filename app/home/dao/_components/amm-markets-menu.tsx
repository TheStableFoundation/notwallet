"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";
import { openUrl } from "@tauri-apps/plugin-opener";
import { markets } from "./amm-markets";
import { TokenIcon } from "./amm-token-info";

interface MarketItemProps {
  baseToken: string;
  quoteToken: string;
  platform?: string;
  onClick: () => void;
}

const MarketItem = ({
  baseToken,
  quoteToken,
  platform,
  onClick,
}: MarketItemProps) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      minWidth: 80,
      mx: 0.5,
      my: 1,
    }}
  >
    <Tooltip
      title={`View ${baseToken}/${quoteToken} AMM Pool on Solscan`}
      arrow
    >
      <IconButton
        sx={{
          width: 56,
          height: 56,
          bgcolor: "#fff",
          color: "#9932CC",
          boxShadow: "0 2px 12px rgba(153, 50, 204, 0.15)",
          border: "1px solid rgba(153, 50, 204, 0.1)",
          "&:hover": {
            bgcolor: "#f5f6fa",
            boxShadow: "0 4px 16px rgba(153, 50, 204, 0.25)",
            transform: "translateY(-2px)",
          },
          transition: "all 0.3s ease",
          position: "relative",
          overflow: "visible",
        }}
        onClick={onClick}
      >
        <Stack direction="row" spacing={-0.5} alignItems="center">
          <Box sx={{ position: "relative", zIndex: 2 }}>
            <TokenIcon symbol={baseToken} size={20} />
          </Box>
          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              ml: "-4px !important",
            }}
          >
            <TokenIcon symbol={quoteToken} size={18} />
          </Box>
        </Stack>
      </IconButton>
    </Tooltip>
    <Typography
      variant="caption"
      sx={{
        mt: 1,
        color: "#666",
        fontWeight: 500,
        fontSize: "0.7rem",
        textAlign: "center",
        lineHeight: 1.2,
      }}
    >
      {`${baseToken}/${quoteToken}`}
    </Typography>
    {platform && (
      <Typography
        variant="caption"
        sx={{
          color: "#9932CC",
          fontWeight: 600,
          fontSize: "0.6rem",
          textAlign: "center",
          lineHeight: 1,
          textTransform: "uppercase",
        }}
      >
        {platform}
      </Typography>
    )}
  </Box>
);

export default function AMMMarketsMenu() {
  const handleMarketClick = async (ammId: string) => {
    await selectionFeedback();
    const solscanUrl = `https://solscan.io/account/${ammId}`;
    await openUrl(solscanUrl);
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 480,
        px: 2,
        mb: 3,
      }}
    >
      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: 3,
          p: 3,
          boxShadow: "0 2px 16px rgba(153, 50, 204, 0.08)",
          border: "1px solid rgba(153, 50, 204, 0.05)",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            color: "#333",
            fontWeight: 600,
            mb: 2,
            textAlign: "center",
          }}
        >
          Markets
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            overflowX: "auto",
            px: 1,
            py: 2,
            minHeight: 130,
            alignItems: "flex-start",
            "&::-webkit-scrollbar": {
              height: 6,
            },
            "&::-webkit-scrollbar-track": {
              bgcolor: "rgba(153, 50, 204, 0.1)",
              borderRadius: 3,
            },
            "&::-webkit-scrollbar-thumb": {
              bgcolor: "rgba(153, 50, 204, 0.3)",
              borderRadius: 3,
              "&:hover": {
                bgcolor: "rgba(153, 50, 204, 0.5)",
              },
            },
          }}
        >
          {markets.map((market, index) => (
            <MarketItem
              key={index}
              baseToken={market.base}
              quoteToken={market.quote}
              platform={market.platform}
              onClick={() => handleMarketClick(market.id)}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
