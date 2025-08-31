"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import { SolanaWallet } from "@/lib/crate/generated";
import { invoke } from "@tauri-apps/api/core";

interface Asset {
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
  const [totalBalance, setTotalBalance] = React.useState<string>("$0.00");

  React.useEffect(() => {
    const fetchBalances = async () => {
      try {
        setLoading(true);

        // Fetch SOL balance
        const solBalance = await invoke<string>("get_sol_balance", {
          pubkey: wallet.pubkey,
        });

        // Fetch BACH balance
        const bachBalance = await invoke<string>("get_bach_balance", {
          pubkey: wallet.pubkey,
        });

        // Fetch total wallet balance in USD (optional parameter, defaults to USD)
        let walletBalance = "$0.00";
        try {
          walletBalance = await invoke<string>("get_wallet_balance", {
            pubkey: wallet.pubkey,
            currency: null, // Let backend default to USD
          });
        } catch (error) {
          console.warn("Could not fetch wallet balance in USD:", error);
          // Continue without USD conversion
        }

        const assetsList: Asset[] = [];

        // Parse SOL balance
        if (solBalance && solBalance !== "0.000000000 SOL") {
          const solAmount = solBalance.replace(" SOL", "");
          assetsList.push({
            symbol: "SOL",
            balance: `${parseFloat(solAmount).toFixed(4)} SOL`,
          });
        }

        // Parse BACH balance
        if (bachBalance && bachBalance !== "0" && bachBalance !== "0 BACH") {
          const bachAmount = bachBalance.replace(" BACH", "");
          assetsList.push({
            symbol: "BACH",
            balance: `${parseFloat(bachAmount).toFixed(4)} BACH`,
          });
        }

        setAssets(assetsList);
        setTotalBalance(walletBalance);
      } catch (error) {
        console.error("Error fetching balances:", error);
        setAssets([]);
        setTotalBalance("$0.00");
      } finally {
        setLoading(false);
      }
    };

    fetchBalances();
  }, [wallet.pubkey]);

  const getAssetIcon = (symbol: string) => {
    const iconMap: { [key: string]: string } = {
      SOL: "https://cryptologos.cc/logos/solana-sol-logo.png",
      BACH: "/bach-logo.png", // Assuming you have a BACH logo
    };

    return iconMap[symbol] || "/default-token.png";
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
                  py: 1.5,
                  "&:hover": {
                    backgroundColor: "rgba(153, 50, 204, 0.04)",
                    borderRadius: 1,
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    src={getAssetIcon(asset.symbol)}
                    alt={asset.symbol}
                    sx={{ width: 40, height: 40 }}
                  >
                    {asset.symbol.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
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
                    <Typography variant="body2" color="text.secondary">
                      {asset.usdValue}
                    </Typography>
                  )}
                </Box>
              </ListItem>
              {index < assets.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
}
