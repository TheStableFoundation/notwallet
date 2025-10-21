"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import { useState } from "react";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import WarningIcon from "@mui/icons-material/Warning";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";
import { invoke } from "@tauri-apps/api/core";
import { GET_BACH_BALANCE, GET_SOL_BALANCE } from "@app/lib/commands";
import { SolanaWallet, STORE_ACTIVE_KEYPAIR } from "@app/lib/crate/generated";
import { store } from "@app/lib/store/store";
import PageChildrenTitleBar from "@app/lib/components/page-children-title-bar";

interface MemeToken {
  id: string;
  name: string;
  symbol: string;
  description: string;
  image: string;
  creator: string;
  marketCap: string;
  price: string;
  change24h: string;
  isHot: boolean;
}

const mockTokens: MemeToken[] = [
  {
    id: "1",
    name: "Doge to the Moon",
    symbol: "MOON",
    description: "Such wow, much moon, very crypto! 🚀",
    image: "🐕",
    creator: "DogeWarrior",
    marketCap: "$420K",
    price: "$0.0069",
    change24h: "+420%",
    isHot: true,
  },
  {
    id: "2",
    name: "Pepe's Paradise",
    symbol: "PEPE",
    description: "Feels good man! The ultimate meme token 🐸",
    image: "🐸",
    creator: "PepeKing",
    marketCap: "$69K",
    price: "$0.0042",
    change24h: "+169%",
    isHot: true,
  },
  {
    id: "3",
    name: "Cat Vibes Only",
    symbol: "VIBES",
    description: "Purr-fect vibes for the community! 😸",
    image: "😸",
    creator: "CatLover",
    marketCap: "$33K",
    price: "$0.0013",
    change24h: "+88%",
    isHot: false,
  },
];

export default function MemePage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenDescription, setTokenDescription] = useState("");
  const [bachBalance, setBachBalance] = useState<string>("-");
  const [solBalance, setSolBalance] = useState<string>("-");
  const [, setUserWallet] = useState<SolanaWallet | null>(null);
  const [displayedTokens, setDisplayedTokens] = useState<MemeToken[]>(
    mockTokens.slice(0, 3),
  );
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreTokens, setHasMoreTokens] = useState(true);

  const handleCreateToken = async () => {
    await selectionFeedback();
    setShowCreateForm(true);
  };

  const handleLaunchToken = async () => {
    await selectionFeedback();
    // TODO: Implement actual token launch with BACH payment
    console.log("Launching token:", {
      tokenName,
      tokenSymbol,
      tokenDescription,
    });
    setShowCreateForm(false);
    setTokenName("");
    setTokenSymbol("");
    setTokenDescription("");
  };

  const handleTokenClick = async (token: MemeToken) => {
    await selectionFeedback();
    // TODO: Navigate to token detail page
    console.log("Viewing token:", token.name);
  };

  const handleLoadMore = async () => {
    await selectionFeedback();
    setIsLoadingMore(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock loading more tokens (in real app, this would be an API call)
    const timestamp = Date.now();
    const newTokens = [
      {
        id: `token_${timestamp}_1`,
        name: "Rocket Ship",
        symbol: "ROCKET",
        description: "To the moon and beyond! 🚀",
        image: "🚀",
        creator: "SpaceExplorer",
        marketCap: "$15K",
        price: "$0.0008",
        change24h: "+55%",
        isHot: false,
      },
      {
        id: `token_${timestamp}_2`,
        name: "Diamond Hands",
        symbol: "DIAMOND",
        description: "Hold strong, never let go! 💎",
        image: "💎",
        creator: "DiamondHolder",
        marketCap: "$8K",
        price: "$0.0003",
        change24h: "+22%",
        isHot: false,
      },
    ];

    setDisplayedTokens((prev) => [...prev, ...newTokens]);
    setIsLoadingMore(false);

    // Simulate no more tokens after this load
    if (displayedTokens.length >= 5) {
      setHasMoreTokens(false);
    }
  };

  const loadWalletAndBalances = async () => {
    try {
      // Get the active wallet
      const wallet = await store().get<SolanaWallet>(STORE_ACTIVE_KEYPAIR);
      if (!wallet?.pubkey) {
        console.error("No active wallet found");
        return;
      }

      setUserWallet(wallet);

      // Fetch BACH balance
      const bachBal = await invoke<string>(GET_BACH_BALANCE, {
        pubkey: wallet.pubkey,
      });
      setBachBalance(bachBal);

      // Fetch SOL balance
      const solBal = await invoke<string>(GET_SOL_BALANCE, {
        pubkey: wallet.pubkey,
      });
      setSolBalance(solBal);
    } catch (error) {
      console.error("Error fetching wallet and balances:", error);
    }
  };

  React.useEffect(() => {
    loadWalletAndBalances();
  }, []);

  return (
    <Box
      sx={{
        minHeight: "unset",
        height: "auto",
        bgcolor: "#f5f6fa",
        pb: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <PageChildrenTitleBar title="m3m3 (soon)" />

      <Box sx={{ px: 2, maxWidth: 480, mx: "auto" }}>
        {/* Header Section */}
        <Card
          sx={{
            mb: 3,
            borderRadius: 3,
            background: "linear-gradient(135deg, #9932CC 0%, #8A2BE2 100%)",
            color: "white",
            boxShadow: "0 8px 32px rgba(153, 50, 204, 0.3)",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <RocketLaunchIcon sx={{ fontSize: 32, mr: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Launch Your Meme Token
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
              Create and launch meme tokens on Solana. You&apos;ll need SOL and
              BACH tokens to execute smart contracts!
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AttachMoneyIcon sx={{ fontSize: 18 }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                BACH: {bachBalance} | SOL: {solBalance}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Create Token Section */}
        {!showCreateForm ? (
          <Card
            sx={{
              mb: 3,
              borderRadius: 3,
              boxShadow: "0 2px 16px rgba(153, 50, 204, 0.08)",
            }}
          >
            <CardContent sx={{ p: 3, textAlign: "center" }}>
              <RocketLaunchIcon
                sx={{ fontSize: 48, color: "#9932CC", mb: 2 }}
              />
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 1, color: "#333" }}
              >
                Ready to Launch?
              </Typography>
              <Typography variant="body2" sx={{ color: "#666", mb: 3 }}>
                Create your own meme token and join the revolution!
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={handleCreateToken}
                sx={{
                  bgcolor: "#9932CC",
                  borderRadius: 2,
                  py: 1.5,
                  px: 4,
                  fontWeight: 600,
                  "&:hover": { bgcolor: "#8A2BE2" },
                }}
              >
                Create Token
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card
            sx={{
              mb: 3,
              borderRadius: 3,
              boxShadow: "0 2px 16px rgba(153, 50, 204, 0.08)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 3, color: "#333" }}
              >
                Launch Your Meme Token
              </Typography>

              <TextField
                fullWidth
                label="Token Name"
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
                sx={{ mb: 2 }}
                placeholder="e.g., Doge to the Moon"
              />

              <TextField
                fullWidth
                label="Symbol"
                value={tokenSymbol}
                onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())}
                sx={{ mb: 2 }}
                placeholder="e.g., MOON"
                inputProps={{ maxLength: 10 }}
              />

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={tokenDescription}
                onChange={(e) => setTokenDescription(e.target.value)}
                sx={{ mb: 3 }}
                placeholder="Tell the world about your meme! 🚀"
              />

              <Box sx={{ mb: 3, p: 2, bgcolor: "#f5f6fa", borderRadius: 2 }}>
                <Typography variant="body2" sx={{ color: "#666", mb: 1 }}>
                  Launch Cost: <strong>100 BACH</strong>
                </Typography>
                <Typography variant="caption" sx={{ color: "#999" }}>
                  This covers smart contract execution on Solana
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => setShowCreateForm(false)}
                  sx={{ flex: 1, borderColor: "#9932CC", color: "#9932CC" }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleLaunchToken}
                  disabled={!tokenName || !tokenSymbol || !tokenDescription}
                  sx={{
                    flex: 1,
                    bgcolor: "#9932CC",
                    "&:hover": { bgcolor: "#8A2BE2" },
                  }}
                >
                  Launch Token
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Trending Tokens */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 2,
            color: "#333",
            display: "flex",
            alignItems: "center",
          }}
        >
          <TrendingUpIcon sx={{ mr: 1, color: "#9932CC" }} />
          Trending Memes
        </Typography>

        {displayedTokens.map((token) => (
          <Card
            key={token.id}
            sx={{
              mb: 2,
              borderRadius: 3,
              boxShadow: "0 2px 16px rgba(153, 50, 204, 0.08)",
              border: "1px solid rgba(153, 50, 204, 0.05)",
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 4px 20px rgba(153, 50, 204, 0.15)",
              },
            }}
            onClick={() => handleTokenClick(token)}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: "#f5f6fa",
                    fontSize: "1.5rem",
                  }}
                >
                  {token.image}
                </Avatar>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, color: "#333" }}
                    >
                      {token.name}
                    </Typography>
                    {token.isHot && (
                      <Chip
                        icon={<LocalFireDepartmentIcon sx={{ fontSize: 16 }} />}
                        label="Hot"
                        size="small"
                        sx={{
                          bgcolor: "#ff6b35",
                          color: "white",
                          "& .MuiChip-icon": { color: "white" },
                        }}
                      />
                    )}
                  </Box>

                  <Typography variant="body2" sx={{ color: "#666", mb: 1 }}>
                    ${token.symbol} • by {token.creator}
                  </Typography>

                  <Typography variant="body2" sx={{ color: "#888", mb: 2 }}>
                    {token.description}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{ color: "#666", display: "block" }}
                      >
                        Market Cap
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: "#333" }}
                      >
                        {token.marketCap}
                      </Typography>
                    </Box>

                    <Box sx={{ textAlign: "right" }}>
                      <Typography
                        variant="caption"
                        sx={{ color: "#666", display: "block" }}
                      >
                        Price
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: "#333" }}
                        >
                          {token.price}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: token.change24h.startsWith("+")
                              ? "#4caf50"
                              : "#f44336",
                            fontWeight: 600,
                          }}
                        >
                          {token.change24h}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}

        {/* Load More Button */}
        {hasMoreTokens && (
          <Box sx={{ textAlign: "center", my: 3 }}>
            <Button
              variant="outlined"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              sx={{
                borderColor: "#9932CC",
                color: "#9932CC",
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                "&:hover": {
                  borderColor: "#8A2BE2",
                  bgcolor: "rgba(153, 50, 204, 0.04)",
                },
                "&:disabled": {
                  borderColor: "#ccc",
                  color: "#999",
                },
              }}
            >
              {isLoadingMore ? "Loading..." : "Load More Memes"}
            </Button>
          </Box>
        )}

        {!hasMoreTokens && displayedTokens.length > 3 && (
          <Box sx={{ textAlign: "center", my: 3 }}>
            <Typography variant="body2" sx={{ color: "#666" }}>
              That&apos;s all the trending memes for now! 🎉
            </Typography>
          </Box>
        )}

        {/* Risk Disclaimer */}
        <Card
          sx={{
            mt: 4,
            mb: 3,
            borderRadius: 3,
            boxShadow: "0 2px 16px rgba(255, 152, 0, 0.08)",
            border: "2px solid #ff9800",
            bgcolor: "#fff8e1",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
              <WarningIcon sx={{ color: "#ff9800", mt: 0.5 }} />
              <Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, mb: 2, color: "#e65100" }}
                >
                  ⚠️ Important Risk Disclaimer
                </Typography>

                <Typography variant="body2" sx={{ color: "#bf360c", mb: 2 }}>
                  <strong>High Risk Investment:</strong> Cryptocurrency trading
                  and meme token creation involve substantial risk of loss and
                  are not suitable for all investors.
                </Typography>

                <Typography variant="body2" sx={{ color: "#bf360c", mb: 2 }}>
                  <strong>Extreme Volatility:</strong> Meme tokens are highly
                  speculative and can lose their entire value rapidly. Prices
                  can fluctuate dramatically within minutes.
                </Typography>

                <Typography variant="body2" sx={{ color: "#bf360c", mb: 2 }}>
                  <strong>No Guarantees:</strong> Past performance does not
                  indicate future results. There is no guarantee of profits and
                  you may lose all invested funds.
                </Typography>

                <Typography variant="body2" sx={{ color: "#bf360c", mb: 2 }}>
                  <strong>Regulatory Risk:</strong> Cryptocurrency regulations
                  are evolving and may impact token value and legality.
                </Typography>

                <Typography variant="body2" sx={{ color: "#bf360c", mb: 2 }}>
                  <strong>Technology Risk:</strong> Smart contracts may contain
                  bugs or vulnerabilities that could result in total loss of
                  funds.
                </Typography>

                <Typography
                  variant="caption"
                  sx={{ color: "#8d4e00", fontStyle: "italic" }}
                >
                  Only invest what you can afford to lose completely. Consider
                  consulting with a financial advisor before participating in
                  cryptocurrency speculation.
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
