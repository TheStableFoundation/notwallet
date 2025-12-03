"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import {
  cancel,
  Format,
  requestPermissions,
  scan,
} from "@tauri-apps/plugin-barcode-scanner";
import { debug, error as logError } from "@tauri-apps/plugin-log";
import { Button } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function ScanPage() {
  const router = useNavigate();
  const [searchParams] = useSearchParams();

  const onCameraButtonClicked = async () => {
    try {
      const permission = await requestPermissions();
      debug(`Permission state: ${permission}`);
      const scanned = await scan({ windowed: true, formats: [Format.QRCode] });
      debug(`Scanned: ${scanned}`);
      let url = `/wallet?scannedAddress=${scanned.content}&shouldOpenSendModal=1&`;
      const selectedTokenAddress = searchParams.get("selectedTokenAddress");
      if (selectedTokenAddress) {
        url += `&preSelectedTokenAddress=${selectedTokenAddress}`;
      }
      router(url);
    } catch (e) {
      logError(`Error scanned: ${JSON.stringify(e)}`);
      await cancel();
      router(-1);
    }
  };

  const onCloseButtonClicked = async () => {
    await cancel();
    router(-1);
  };

  React.useEffect(() => {
    onCameraButtonClicked();
    return () => {
      cancel();
    };
  }, []);

  return (
    <React.Suspense>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "linear-gradient(135deg, #FAFBFF 0%, #F8FAFF 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pb: 8,
        }}
      >
        <Button onClick={onCloseButtonClicked}>Close</Button>
      </Box>
    </React.Suspense>
  );
}
