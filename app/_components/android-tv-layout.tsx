"use client";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Container from "@mui/material/Container";
import Slide from "@mui/material/Slide";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import HomeIcon from "@mui/icons-material/Home";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import SettingsIcon from "@mui/icons-material/Settings";
import { selectionFeedback } from "@tauri-apps/plugin-haptics";
import { useNavigate, useLocation } from "react-router-dom";

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
  children?: React.ReactNode;
}

function HideOnScroll(props: Props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {(children as React.ReactElement) ?? <div />}
    </Slide>
  );
}

export default function AndroidTvLayout(props: Props) {
  const pathname = useLocation().pathname;
  const router = useNavigate();

  const handleNavigation = async (path: string) => {
    try {
      await selectionFeedback();
    } catch {}
    if (pathname !== path) {
      router(path);
    }
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <HideOnScroll {...props}>
        <AppBar>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              NotWallet Crypto
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                color="inherit"
                startIcon={<HomeIcon />}
                onClick={() => handleNavigation("/home")}
                sx={{
                  color:
                    pathname === "/home" || pathname.startsWith("/home/")
                      ? "#AD5AD7"
                      : "inherit",
                  bgcolor:
                    pathname === "/home" || pathname.startsWith("/home/")
                      ? "rgba(173, 90, 215, 0.1)"
                      : "transparent",
                }}
              >
                Home
              </Button>
              <Button
                color="inherit"
                startIcon={<AccountBalanceWalletIcon />}
                onClick={() => handleNavigation("/wallet")}
                sx={{
                  color:
                    pathname === "/wallet" || pathname.startsWith("/wallet/")
                      ? "#AD5AD7"
                      : "inherit",
                  bgcolor:
                    pathname === "/wallet" || pathname.startsWith("/wallet/")
                      ? "rgba(173, 90, 215, 0.1)"
                      : "transparent",
                }}
              >
                Wallet
              </Button>
              <Button
                color="inherit"
                startIcon={<SettingsIcon />}
                onClick={() => handleNavigation("/settings")}
                sx={{
                  color:
                    pathname === "/settings" ||
                    pathname.startsWith("/settings/")
                      ? "#AD5AD7"
                      : "inherit",
                  bgcolor:
                    pathname === "/settings" ||
                    pathname.startsWith("/settings/")
                      ? "rgba(173, 90, 215, 0.1)"
                      : "transparent",
                }}
              >
                Settings
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar />
      <Container>{props.children}</Container>
    </React.Fragment>
  );
}
