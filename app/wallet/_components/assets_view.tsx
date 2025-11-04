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
import Avatar from "@mui/material/Avatar";
import { BalanceV1, SolanaWallet } from "@app/lib/crate/generated";
import { invoke } from "@tauri-apps/api/core";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import IconButton from "@mui/material/IconButton";
import { openUrl } from "@tauri-apps/plugin-opener";
import { useLang } from "../../../src/LanguageContext";

import { selectionFeedback } from "@tauri-apps/plugin-haptics";
import { error } from "@tauri-apps/plugin-log";
import VerifiedBadge from "./verified-badge";
import { isAssetVerified } from "./verified-assets";
import { SOLANA } from "@app/lib/crate/generated";
import { useXlpEnvironment } from "@app/lib/context/xlp-environment-context";
import { useNetworkEnvironment } from "@app/lib/context/network-environment-context";

interface AssetsViewProps {
  wallet: SolanaWallet;
  onAvailableAssetsUpdated: (assets: BalanceV1[]) => void;
}

export default function AssetsView({
  wallet,
  onAvailableAssetsUpdated,
}: AssetsViewProps) {
  const { t } = useLang();
  const { xlpEnvironment } = useXlpEnvironment();
  const { environment } = useNetworkEnvironment();
  const [assets, setAssets] = React.useState<BalanceV1[]>([]);
  const [loading, setLoading] = React.useState(true);
  const fetchWalletAssetsBalance = async () => {
    try {
      setLoading(true);
      // Fetch BACH balance
      const tokenList = await invoke<BalanceV1[]>("get_wallet_assets_balance", {
        network: environment,
        pubkey: wallet.pubkey,
        environment: xlpEnvironment,
      });
      setAssets(tokenList);
      onAvailableAssetsUpdated(tokenList);
    } catch (err) {
      error(`Error fetching balances: ${err}`);
      setAssets([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchWalletAssetsBalance();
  }, [wallet.pubkey]);

  const handleOpenTokenInformation = async (token: string) => {
    await selectionFeedback();
    const url =
      token === SOLANA
        ? "https://notwallet.eu/t/solana"
        : `https://notwallet.eu/t/solana/${token}`;
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
            {t.noAssetsFound}
          </Typography>
        </Box>
      ) : (
        <List sx={{ p: 0 }}>
          {assets.map((asset, index) => (
            <React.Fragment key={asset.meta.address}>
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
                <ListItemAvatar>
                  <Avatar
                    src={asset.meta.logo_uri}
                    alt={asset.meta.symbol}
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: "#f5f6fa",
                      color: "#9932CC",
                    }}
                  >
                    {asset.meta.symbol.slice(0, 2)}
                  </Avatar>
                </ListItemAvatar>
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
                        {asset.meta.symbol}
                      </Typography>
                      {isAssetVerified(asset.meta.address) && (
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
                      {asset.meta.name}
                    </Typography>
                  }
                />
                <Box sx={{ textAlign: "right" }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#9932CC",
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      textShadow: "0 1px 2px rgba(153, 50, 204, 0.1)",
                    }}
                  >
                    {asset.ui_amount?.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6,
                    }) ?? "0"}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontSize="0.7rem"
                  >
                    {asset.meta.symbol}
                  </Typography>
                </Box>
                <IconButton
                  onClick={() => handleOpenTokenInformation(asset.meta.address)}
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
