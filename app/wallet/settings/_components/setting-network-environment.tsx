"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import { useLang } from "../../../../src/LanguageContext";
import { Environment } from "@app/lib/crate/generated";
import { CircularProgress, FormControl, MenuItem, Select } from "@mui/material";
import React from "react";
import { useNetworkEnvironment } from "@app/lib/context/network-environment-context";
import { debug, error } from "@tauri-apps/plugin-log";
import { invoke } from "@tauri-apps/api/core";

enum State {
  Loading,
  Loaded,
  Error,
}

export default function NetworkEnvironmentSetting() {
  const { t } = useLang();
  const { environment, setEnvironment } = useNetworkEnvironment();
  const [state, setState] = React.useState<State>(State.Loading);
  const onSelectedEnvironmentChange = async (value: string) => {
    try {
      setState(State.Loading);
      debug(`Selected Network environment: ${value}`);
      const env = await invoke<Environment>("set_network_environment", {
        environment: value,
      });
      setEnvironment(env);
      setState(State.Loaded);
    } catch (e) {
      error(`Failed to set Network environment: ${e}`);
      setState(State.Loaded);
    }
  };

  const fetchNetworkEnvironment = async () => {
    try {
      const env = await invoke<Environment>("get_network_environment");
      setEnvironment(env);
      setState(State.Loaded);
    } catch (e) {
      error(`Failed to fetch Network environment: ${e}`);
      setState(State.Loaded);
    }
  };

  React.useEffect(() => {
    Promise.all([fetchNetworkEnvironment()]);
  }, []);

  return (
    <Card
      sx={{
        width: "100%",
        borderRadius: "20px",
        boxShadow: "0 4px 20px rgba(139, 92, 246, 0.08)",
        border: "1px solid rgba(139, 92, 246, 0.06)",
        mb: 3,
        overflow: "hidden",
        bgcolor: "#FFFFFF",
      }}
    >
      <Box sx={{ p: 3, pb: 1 }}>
        <Typography
          variant="h6"
          sx={{
            fontSize: "18px",
            fontWeight: 600,
            color: "#1F2937",
            mb: 1,
            letterSpacing: "-0.02em",
          }}
        >
          {t.network}
        </Typography>
      </Box>
      <List
        sx={{
          cursor: "pointer",
          borderRadius: "12px",
          mx: 2,
          mb: 1,
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            bgcolor: "rgba(139, 92, 246, 0.04)",
            transform: "scale(1.01)",
          },
          "&:active": {
            transform: "scale(0.99)",
          },
        }}
      >
        {state === State.Loading && <CircularProgress />}
        {state === State.Loaded && (
          <FormControl fullWidth>
            <Select
              labelId="network-environment-label"
              id="network-environment"
              defaultValue={environment}
              onChange={async (event) => {
                const selectedEnvironment = event.target.value;
                await onSelectedEnvironmentChange(selectedEnvironment);
              }}
            >
              <MenuItem value="Devnet">Devnet</MenuItem>
              <MenuItem value="Testnet">Testnet</MenuItem>
              <MenuItem value="Mainnet">Mainnet</MenuItem>
            </Select>
          </FormControl>
        )}
      </List>
    </Card>
  );
}
