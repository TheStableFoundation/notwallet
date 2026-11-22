import React from "react";
import { Link, useLocation } from "react-router-dom";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useLang } from "@app/lib/context/language-context";
import { debug } from "@tauri-apps/plugin-log";
import { haptics } from "@app/lib/utils/haptics";
import { useNetworkEnvironment } from "@app/lib/context/network-environment-context";
import { Typography } from "@mui/material";

interface NavItem {
  path: string;
  key: "chat" | "wallet" | "profile";
  icon: React.ReactElement;
}

const navItems: NavItem[] = [
  {
    path: "/",
    key: "chat",
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path
          d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-4.5 4.2c-.5.47-1.3.12-1.3-.57V5z"
          stroke="#a21caf"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M8 9h8M8 12.5h5"
          stroke="#a21caf"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    path: "/wallet",
    key: "wallet",
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path
          d="M4 19V6a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v13M9 6v13"
          stroke="#a21caf"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    path: "/settings",
    key: "profile",
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3" stroke="#a21caf" strokeWidth="1.5" />
        <path
          d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"
          stroke="#a21caf"
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
];

// The bars are laid out as flex children of the app shell, not position:fixed
// over a scrolling document — see the note in index.css.
export function TopNav() {
  const { t, lang } = useLang();
  const { environment } = useNetworkEnvironment();
  const isRTL = lang === "ar";

  return (
    <header
      className="shrink-0 bg-white/70 backdrop-blur-lg shadow top-nav-safe"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-2xl mx-auto flex flex-row justify-center items-center px-4 py-3 w-full">
        <span className="font-bold text-xl text-primary-main">
          {t.appName}
          {environment != "Mainnet" && (
            <Typography
              component="span"
              color="warning"
              fontWeight="bold"
              sx={{ fontSize: 16, fontStyle: "italic" }}
            >
              {" "}
              ({environment})
            </Typography>
          )}
        </span>
      </div>
    </header>
  );
}

export function BottomNav() {
  const location = useLocation();
  const { t, lang } = useLang();
  const isRTL = lang === "ar";

  const isActivePath = (path: string) => {
    debug(`Current path: ${location.pathname}`);
    if (path === "/") {
      return location.pathname === "/";
    }
    if (path === "/wallet") {
      return location.pathname.startsWith("/wallet");
    }
    if (path === "/settings") {
      // The activity dashboard lives under /home and is reached from Profile,
      // so it keeps the Profile tab highlighted.
      return (
        location.pathname.startsWith("/settings") ||
        location.pathname.startsWith("/home")
      );
    }
    return false;
  };

  const handleNavClick = async () => {
    await haptics.navigation();
  };

  return (
    <nav
      className="shrink-0 bg-white/90 backdrop-blur-md border-t shadow-lg bottom-nav-safe"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-2xl mx-auto flex justify-around items-center px-4 py-2 w-full">
        {navItems.map((item) => (
          <Tooltip.Root key={item.path} delayDuration={100}>
            <Tooltip.Trigger asChild>
              <Link
                to={item.path}
                onClick={handleNavClick}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-1 rounded transition-all duration-200
                    ${
                      isActivePath(item.path)
                        ? "bg-fuchsia-100 text-primary-main shadow font-semibold"
                        : "hover:bg-fuchsia-50 text-slate-800"
                    }`}
                style={{ minWidth: 60 }}
              >
                {item.icon}
                <span className="text-xs">{t[item.key]}</span>
              </Link>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content className="text-xs bg-white border px-2 py-1 rounded shadow">
                {t[item.key]}
                <Tooltip.Arrow className="fill-white" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        ))}
      </div>
    </nav>
  );
}
