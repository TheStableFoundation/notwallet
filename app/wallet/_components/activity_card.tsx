"use client";

import * as React from "react";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { SolanaWallet } from "@lib/crate/generated";
import AssetsView from "./assets_view";
import ActivityView from "./activity_view";
import { useLang } from "../../../src/LanguageContext";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`wallet-tabpanel-${index}`}
      aria-labelledby={`wallet-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `wallet-tab-${index}`,
    "aria-controls": `wallet-tabpanel-${index}`,
  };
}

interface ActivityCardProps {
  wallet: SolanaWallet;
}

export default function ActivityCard({ wallet }: ActivityCardProps) {
  const { t } = useLang();
  const [value, setValue] = React.useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 2,
        boxShadow: 2,
        background: "linear-gradient(135deg, #f5f6fa 60%, #e3f2fd 100%)",
        overflow: "hidden",
      }}
    >
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="wallet tabs"
          sx={{
            px: 2,
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              minHeight: 48,
              color: "#666",
            },
            "& .Mui-selected": {
              color: "#9932CC",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#9932CC",
            },
          }}
        >
          <Tab label={t.assets} {...a11yProps(0)} />
          <Tab label={t.activity} {...a11yProps(1)} />
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
        <AssetsView wallet={wallet} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ActivityView wallet={wallet} />
      </TabPanel>
    </Card>
  );
}
