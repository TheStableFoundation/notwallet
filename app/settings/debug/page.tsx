"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import { invoke } from "@tauri-apps/api/core";
import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useLang } from "@src/LanguageContext";
import PageChildrenTitleBar from "@app/lib/components/page-children-title-bar";
import { debug, error } from "@tauri-apps/plugin-log";
import { AirdropEnvironment, XlpEnvironment } from "@app/lib/crate/generated";
import { useAirdropEnvironment } from "@app/lib/context/app-environment-context";
import { useXlpEnvironment } from "@app/lib/context/xlp-environment-context";

enum State {
  Loading,
  Loaded,
  Error,
}

export default function DebugPage() {
  const { t } = useLang();
  const { environment, setEnvironment } = useAirdropEnvironment();
  const { xlpEnvironment, setXlpEnvironment } = useXlpEnvironment();
  const [state, setState] = React.useState<State>(State.Loading);

  const onSelectedEnvironmentChange = async (value: string) => {
    try {
      setState(State.Loading);
      debug(`Selected airdrop environment: ${value}`);
      const env = await invoke<AirdropEnvironment>("set_airdrop_environment", {
        environment: value,
      });
      setEnvironment(env);
      setState(State.Loaded);
    } catch (e) {
      error(`Failed to set airdrop environment: ${e}`);
      setState(State.Loaded);
    }
  };

  const onSelectedXlpEnvironmentChange = async (value: string) => {
    try {
      setState(State.Loading);
      debug(`Selected xlp environment: ${value}`);
      const env = await invoke<XlpEnvironment>("set_xlp_environment", {
        environment: value,
      });
      setXlpEnvironment(env);
      setState(State.Loaded);
    } catch (e) {
      error(`Failed to set xlp environment: ${e}`);
      setState(State.Loaded);
    }
  };

  const fetchAirdropEnvironment = async () => {
    try {
      const env = await invoke<AirdropEnvironment>("get_airdrop_environment");
      setEnvironment(env);
      setState(State.Loaded);
    } catch (e) {
      error(`Failed to fetch airdrop environment: ${e}`);
      setState(State.Loaded);
    }
  };

  React.useEffect(() => {
    Promise.all([fetchAirdropEnvironment()]);
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "linear-gradient(135deg, #FAFBFF 0%, #F8FAFF 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 4,
      }}
    >
      <PageChildrenTitleBar title={t.debug} />
      <Box sx={{ width: "100%", maxWidth: 420, px: 2 }}>
        <Card
          sx={{
            width: "100%",
            borderRadius: "20px",
            boxShadow: "0 4px 20px rgba(139, 92, 246, 0.08)",
            border: "1px solid rgba(139, 92, 246, 0.06)",
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
              Airdrop environment
            </Typography>
          </Box>
          <List sx={{ p: 0, pb: 1 }}>
            <React.Fragment>
              <ListItem>
                {state === State.Loading && <CircularProgress />}
                {state === State.Loaded && (
                  <FormControl fullWidth>
                    <InputLabel id="airdrop-environment-label">
                      Airdrop Environment
                    </InputLabel>
                    <Select
                      labelId="airdrop-environment-label"
                      id="airdrop-environment"
                      defaultValue={environment}
                      onChange={async (event) => {
                        const selectedEnvironment = event.target.value;
                        await onSelectedEnvironmentChange(selectedEnvironment);
                      }}
                    >
                      <MenuItem value="development">Development</MenuItem>
                      <MenuItem value="production">Production</MenuItem>
                    </Select>
                  </FormControl>
                )}
              </ListItem>
            </React.Fragment>
          </List>
          <Divider sx={{ borderColor: "rgba(139, 92, 246, 0.08)", mt: 2 }} />
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
              Xlp environment
            </Typography>
          </Box>
          <List sx={{ p: 0, pb: 1 }}>
            <React.Fragment>
              <ListItem>
                {state === State.Loading && <CircularProgress />}
                {state === State.Loaded && (
                  <FormControl fullWidth>
                    <InputLabel id="airdrop-environment-label">
                      Xlp Environment
                    </InputLabel>
                    <Select
                      labelId="airdrop-environment-label"
                      id="airdrop-environment"
                      defaultValue={xlpEnvironment}
                      onChange={async (event) => {
                        const selectedEnvironment = event.target.value;
                        await onSelectedXlpEnvironmentChange(
                          selectedEnvironment,
                        );
                      }}
                    >
                      <MenuItem value="development">Development</MenuItem>
                      <MenuItem value="production">Production</MenuItem>
                    </Select>
                  </FormControl>
                )}
              </ListItem>
            </React.Fragment>
          </List>
        </Card>
      </Box>
    </Box>
  );
}
