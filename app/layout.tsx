"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { AppLockProvider } from "../lib/context/app-lock-context";
import React from "react";
import LayoutWithBottomBar from "./components/layout-with-bottom-bar";
import {
  ThemeProvider,
  createTheme,
  useColorScheme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { mode, setMode } = useColorScheme();

  if (!mode) {
    setMode("light");
  }

  const nordicTheme = createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "#9932CC", // Main purple
        light: "#A64DFF",
        dark: "#800080",
        contrastText: "#fff",
      },
      secondary: {
        main: "#AD5AD7", // Updated secondary color
        light: "#C792EA",
        dark: "#9932CC",
        contrastText: "#fff",
      },
      background: {
        default: "#f5f6fa", // Soft gray
        paper: "#fff",
      },
      text: {
        primary: "#222",
        secondary: "#5E81AC",
      },
      info: {
        main: "#ECEFF4", // Extra neutral
      },
    },
    shape: {
      borderRadius: 8,
    },
    typography: {
      fontFamily: "Inter, Helvetica Neue, Arial, sans-serif",
      fontWeightBold: 700,
      fontWeightRegular: 400,
    },
  });

  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <style>{`
          html, body {
            touch-action: pan-x pan-y;
            overscroll-behavior: none;
          }
        `}</style>
      </head>
      <body>
        <ThemeProvider theme={nordicTheme} defaultMode="light">
          <CssBaseline />
          <AppRouterCacheProvider>
            <AppLockProvider>
              <LayoutWithBottomBar>{children}</LayoutWithBottomBar>
            </AppLockProvider>
          </AppRouterCacheProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
