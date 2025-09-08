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
import { AssetIcon } from "@/lib/components/token-icons";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import IconButton from "@mui/material/IconButton";
import { openUrl } from "@tauri-apps/plugin-opener";
import { useI18n } from "@/lib/i18n/provider";

import { selectionFeedback } from "@tauri-apps/plugin-haptics";
import {
  GET_BACH_BALANCE,
  GET_SOL_BALANCE,
  GET_OTHER_ASSETS_BALANCE,
} from "@/lib/commands";
import { error } from "@tauri-apps/plugin-log";
import VerifiedBadge from "./verified-badge";
import { isAssetVerified } from "./verified-assets";
import { BACH_TOKEN, SOLANA, AssetBalance } from "@/lib/crate/generated";

interface Asset {
  logo: React.ReactNode;
  symbol: string;
  name: string;
  balance: string;
  usdValue?: string;
  address: string;
}

interface AssetsViewProps {
  wallet: SolanaWallet;
}

export default function AssetsView({ wallet }: AssetsViewProps) {
  const { t } = useI18n();
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
            logo: <AssetIcon id={SOLANA} />,
            symbol: "SOL",
            name: "Solana",
            balance: `${parseFloat(solAmount).toFixed(4)} SOL`,
            address: SOLANA,
          });
        }

        // Parse BACH balance
        if (bachBalance && bachBalance !== "0" && bachBalance !== "0 BACH") {
          const bachAmount = bachBalance.replace(" BACH", "");
          assetsList.push({
            logo: <AssetIcon id={BACH_TOKEN} />,
            symbol: "BACH",
            name: "Bach Token",
            balance: `${parseFloat(bachAmount).toFixed(4)} BACH`,
            address: BACH_TOKEN,
          });
        }

        // Fetch other SPL token balance
        const otherAssetsBalance = await invoke<AssetBalance[]>(
          GET_OTHER_ASSETS_BALANCE,
          {
            pubkey: wallet.pubkey,
          },
        );
        const otherAssets = otherAssetsBalance.map((asset) => ({
          logo: <AssetIcon id={asset.id} />,
          symbol: asset.id,
          name: asset.id,
          balance: `${asset.balance.toFixed(4)}`,
          address: asset.id,
        }));

        assetsList.push(...otherAssets);
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

  const handleOpenTokenInformation = async (token: string) => {
    await selectionFeedback();
    const url =
      token === SOLANA
        ? "https://solana.org"
        : `https://solscan.io/token/${token}`;
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
            {t("wallet.noAssetsFound")}
          </Typography>
        </Box>
      ) : (
        <List sx={{ p: 0 }}>
          {assets.map((asset, index) => (
            <React.Fragment key={asset.symbol}>
              <ListItem
                sx={{
                  px: 0,
                  py: 1,
                  minHeight: "56px",
                  "&:hover": {
                    backgroundColor: "rgba(153, 50, 204, 0.04)",
                    borderRadius: 2,
                  },
                }}
              >
                <ListItemAvatar>{asset.logo}</ListItemAvatar>
                <ListItemText
                  primary={
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <Typography
                        variant="body2"
                        fontWeight="600"
                        fontSize="0.9rem"
                      >
                        {asset.symbol.substring(0, 6)}
                      </Typography>
                      {isAssetVerified(asset.address) && (
                        <VerifiedBadge size={14} />
                      )}
                    </Box>
                  }
                  secondary={
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontSize="0.75rem"
                    >
                      {asset.symbol}
                    </Typography>
                  }
                />
                <Box sx={{ textAlign: "right" }}>
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    fontSize="0.85rem"
                  >
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
                  onClick={() => handleOpenTokenInformation(asset.address)}
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
