"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import { SolanaWallet } from "@/lib/crate/generated";
import { invoke } from "@tauri-apps/api/core";
import { BachIcon, SolanaIcon } from "@/lib/components/token-icons";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import IconButton from "@mui/material/IconButton";
import { openUrl } from "@tauri-apps/plugin-opener";
import { BACH_MINT_ACCOUNT } from "@/lib/crate/generated";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";
import { GET_BACH_BALANCE, GET_SOL_BALANCE } from "@/lib/commands";
import { error } from "@tauri-apps/plugin-log";

interface Asset {
  logo: React.ReactNode;
  symbol: string;
  balance: string;
  usdValue?: string;
}

interface AssetsViewProps {
  wallet: SolanaWallet;
}

export default function AssetsView({ wallet }: AssetsViewProps) {
  const [assets, setAssets] = React.useState<Asset[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchBalances = async () => {
      try {
        setLoading(true);

        // Fetch SOL balance
        const solBalance = await invoke<string>(GET_SOL_BALANCE, {
          pubkey: wallet.pubkey,
        });

        // Fetch BACH balance
        const bachBalance = await invoke<string>(GET_BACH_BALANCE, {
          pubkey: wallet.pubkey,
        });

        const assetsList: Asset[] = [];

        // Parse SOL balance
        if (solBalance && solBalance !== "0.000000000 SOL") {
          const solAmount = solBalance.replace(" SOL", "");
          assetsList.push({
            logo: <SolanaIcon size={20} />,
            symbol: "SOL",
            balance: `${parseFloat(solAmount).toFixed(4)} SOL`,
          });
        }

        // Parse BACH balance
        if (bachBalance && bachBalance !== "0" && bachBalance !== "0 BACH") {
          const bachAmount = bachBalance.replace(" BACH", "");
          assetsList.push({
            logo: <BachIcon size={20} />,
            symbol: "BACH",
            balance: `${parseFloat(bachAmount).toFixed(4)} BACH`,
          });
        }

        setAssets(assetsList);
      } catch (err) {
        error(`Error fetching balances: ${err}`);
        setAssets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBalances();
  }, [wallet.pubkey]);

  const handleOpenTokenInformation = async (token: "BACH" | "SOL") => {
    await selectionFeedback();
    const url =
      token === "BACH"
        ? `https://birdeye.so/token/${BACH_MINT_ACCOUNT}?chain=solana`
        : "https://solana.org";
    openUrl(url);
  };

  if (loading) {
    return (
      <Box
        sx={{
          p: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 200,
        }}
      >
        <CircularProgress size={32} sx={{ color: "#9932CC" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      {/* Assets List */}
      {assets.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="body2" color="text.secondary">
            No assets found in this wallet
          </Typography>
        </Box>
      ) : (
        <List sx={{ p: 0 }}>
          {assets.map((asset, index) => (
            <React.Fragment key={asset.symbol}>
              <ListItem
                sx={{
                  px: 0,
                  py: 2,
                  "&:hover": {
                    backgroundColor: "rgba(153, 50, 204, 0.04)",
                    borderRadius: 2,
                  },
                }}
              >
                <ListItemAvatar>{asset.logo}</ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="body1" fontWeight="600">
                      {asset.symbol}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      {asset.symbol === "SOL" ? "Solana" : "Bach Token"}
                    </Typography>
                  }
                />
                <Box sx={{ textAlign: "right" }}>
                  <Typography variant="body1" fontWeight="600">
                    {asset.balance}
                  </Typography>
                  {asset.usdValue && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#9932CC",
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        textShadow: "0 1px 2px rgba(153, 50, 204, 0.1)",
                      }}
                    >
                      {asset.usdValue}
                    </Typography>
                  )}
                </Box>
                <IconButton
                  onClick={() =>
                    handleOpenTokenInformation(asset.symbol as "BACH" | "SOL")
                  }
                  sx={{
                    color: "#9932CC",
                    ml: 1,
                    "&:hover": {
                      backgroundColor: "rgba(153, 50, 204, 0.1)",
                    },
                  }}
                >
                  <OpenInNewIcon />
                </IconButton>
              </ListItem>
              {index < assets.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
}
