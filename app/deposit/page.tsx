"use client";

import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import * as React from "react";
import { QRCodeCanvas } from "qrcode.react";
import { store } from "../../lib/store/store";
import { SolanaWallet, STORE_ACTIVE_KEYPAIR } from "../../lib/crate/generated";

// Add State enum
enum State {
  Loading = "Loading",
  Loaded = "Loaded",
  Error = "Error",
}

export default function DepositPage() {
  const [selectedDenom, setSelectedDenom] = React.useState("USD");
  const denominationOptions = ["USD", "EUR"];
  const [pubkey, setPubkey] = React.useState<string | null>(null);
  const [state, setState] = React.useState<State>(State.Loading);

  React.useEffect(() => {
    (async () => {
      try {
        const wallet = await store().get<SolanaWallet>(STORE_ACTIVE_KEYPAIR);
        setPubkey(wallet?.pubkey ?? null);
        setState(State.Loaded);
      } catch {
        setPubkey(null);
        setState(State.Error);
      }
    })();
  }, []);

  if (state === State.Loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#f5f6fa",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  if (state === State.Error) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#f5f6fa",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card sx={{ maxWidth: 400, width: "100%", boxShadow: 3, p: 4 }}>
          <Typography variant="h5" color="error" align="center" gutterBottom>
            Error
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 2 }}>
            Failed to load your wallet address. Please try again later.
          </Typography>
        </Card>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f6fa",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Card
        sx={{
          maxWidth: 480,
          width: "100%",
          boxShadow: 3,
          borderRadius: 4,
          px: { xs: 2, sm: 4 },
          py: { xs: 2, sm: 4 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          align="center"
          fontWeight="bold"
          gutterBottom
          sx={{ mb: 2 }}
        >
          Deposit
        </Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="denom-select-label">Stablecoin</InputLabel>
          <Select
            labelId="denom-select-label"
            value={selectedDenom}
            label="Stablecoin"
            onChange={(e) => setSelectedDenom(e.target.value)}
            sx={{
              borderRadius: 3,
              bgcolor: "#fff",
              fontWeight: "bold",
            }}
          >
            {denominationOptions.map((denom) => (
              <MenuItem key={denom} value={denom}>
                {denom}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 2,
            width: "100%",
          }}
        >
          <QRCodeCanvas value={pubkey ?? ""} size={160} />
          <Typography variant="caption" sx={{ mt: 1, color: "#888" }}>
            Scan to get address
          </Typography>
          <Box
            sx={{
              mt: 2,
              bgcolor: "#f3f4f6",
              borderRadius: 2,
              p: 2,
              width: "100%",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: "1.1rem",
              wordBreak: "break-word",
              userSelect: "all",
              color: "#222",
            }}
          >
            {pubkey || "No wallet address found"}
          </Box>
          <Button
            size="small"
            variant="outlined"
            sx={{ minWidth: 0, px: 1, mt: 1 }}
            onClick={() => pubkey && navigator.clipboard.writeText(pubkey)}
            disabled={!pubkey}
          >
            Copy Address
          </Button>
        </Box>
        <Box
          sx={{
            bgcolor: "#fff",
            borderRadius: 2,
            p: 2,
            mb: 2,
            boxShadow: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
            width: "100%",
          }}
        >
          <Typography variant="subtitle2" sx={{ color: "#AD5AD7", mb: 1 }}>
            Pay with Card
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{
              borderRadius: 2,
              fontWeight: "bold",
              px: 4,
              py: 1,
              bgcolor: "#9932CC",
              color: "#fff",
              boxShadow: 2,
              "&:hover": { bgcolor: "#AD5AD7" },
            }}
            disabled
          >
            Card Payment (Coming Soon)
          </Button>
        </Box>
        <Typography
          variant="body1"
          sx={{ mb: 2, width: "100%", textAlign: "center" }}
        >
          To deposit funds, send your {selectedDenom} stablecoins to your wallet
          address.
        </Typography>
      </Card>
    </Box>
  );
}
