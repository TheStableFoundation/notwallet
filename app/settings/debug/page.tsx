"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import { invoke } from "@tauri-apps/api/core";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useLang } from "@src/LanguageContext";
import PageChildrenTitleBar from "@app/lib/components/page-children-title-bar";
import { debug } from "@tauri-apps/plugin-log";
import { AirdropEnvironment } from "@app/lib/crate/generated";

export default function DebugPage() {
  const { t } = useLang();
  const [airdropEnvironment, setAirdropEnvironment] =
    React.useState<AirdropEnvironment>();

  const onSelectedEnvironmentChange = (value: string) => {
    debug(`Selected environment: ${value}`);
    setAirdropEnvironment(value as AirdropEnvironment);
  };

  React.useEffect(() => {
    const fetchAirdropEnvironment = async () => {
      const id = await invoke<AirdropEnvironment>("get_airdrop_environment");
      setAirdropEnvironment(id);
    };
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
                <FormControl fullWidth>
                  <InputLabel id="airdrop-environment-label">
                    Airdrop Environment
                  </InputLabel>
                  <Select
                    labelId="airdrop-environment-label"
                    id="airdrop-environment"
                    defaultValue={airdropEnvironment}
                    onChange={(event) => {
                      const selectedEnvironment = event.target.value;
                      onSelectedEnvironmentChange(selectedEnvironment);
                    }}
                  >
                    <MenuItem value="development">Development</MenuItem>
                    <MenuItem value="production">Production</MenuItem>
                  </Select>
                </FormControl>
              </ListItem>
            </React.Fragment>
          </List>
          <Divider sx={{ borderColor: "rgba(139, 92, 246, 0.08)", mt: 2 }} />
        </Card>
      </Box>
    </Box>
  );
}
