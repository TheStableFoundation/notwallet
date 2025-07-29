"use client";

import { useSearchParams } from "next/navigation";
import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import WalletHeader from "@/app/wallet/components/wallet-header";
import WalletTokenContent from "../components/wallet-token-content";
import * as log from "@tauri-apps/plugin-log";
import { Suspense } from "react";

function WalletToken() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const coin = searchParams.get("coin");
  const totalSupply = searchParams.get("totalSupply");

  // States
  //const [token, setToken] = React.useState("$BACH");

  log.info(`coin: ${coin}`);

  // Functions
  const init = async () => {
    try {
      /*
      setToken(coin as string);
      const response = await invoke<{
        id: string;
        name: string;
        symbol: string;
        decimals: number;
      }>("get_token_info", { id: id });
      setToken(response.name);
      */
    } catch (error) {
      log.error(`Error fetching token info: ${error}`);
    }
  };

  React.useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <Box
      sx={{
        height: "auto",
        bgcolor: "#f5f6fa",
        pb: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Card
        sx={{
          maxWidth: 400,
          width: "100%",
          px: 2,
          py: 2,
          boxShadow: 3,
          position: "relative",
        }}
      >
        <WalletHeader token={coin as string} />
        <Divider />
        <WalletTokenContent
          id={id as string}
          totalSupply={totalSupply as string}
        />
      </Card>
    </Box>
  );
}

export default function WalletTokenPage() {
  return (
    <Suspense>
      <WalletToken />
    </Suspense>
  );
}
