import React from "react";
import { Link, useLocation } from "react-router-dom";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useLang } from "../LanguageContext";
import { SupportedLanguages } from "../i18n";
import { debug } from "@tauri-apps/plugin-log";
import { haptics } from "@app/lib/utils/haptics";

interface NavItem {
  path: string;
  key: string;
  icon: React.ReactElement;
}

const navItems: NavItem[] = [
  {
    path: "/",
    key: "home",
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path
          d="M3 10.5L12 4l9 6.5V20a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1v-4h-4v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10.5z"
          stroke="#a21caf"
          strokeWidth="1.5"
          strokeLinejoin="round"
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
    key: "settings",
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

export default function Navbar() {
  const location = useLocation();
  const { t, lang, setLang } = useLang();
  const isRTL = false;

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setLang(event.target.value as SupportedLanguages);
  };

  const isActivePath = (path: string) => {
    debug(`Current path: ${location.pathname}`);
    if (path === "/") {
      return (
        location.pathname === "/" ||
        location.pathname === "/home" ||
        location.pathname === "/home/dao" ||
        location.pathname === "/home/learn"
      );
    }
    if (path === "/wallet") {
      return (
        location.pathname === "/wallet" ||
        location.pathname === "/wallet/buy" ||
        location.pathname === "/wallet/buy/stripe" ||
        location.pathname === "/wallet/create-new-wallet" ||
        location.pathname === "/wallet/create-new-wallet/done" ||
        location.pathname === "/wallet/import" ||
        location.pathname === "/wallet/onboarding" ||
        location.pathname === "/wallet/onboarding/create-password" ||
        location.pathname === "/wallet/onboarding/create-wallet" ||
        location.pathname === "/wallet/onboarding/create-wallet-disclaimer" ||
        location.pathname === "/wallet/onboarding/import" ||
        location.pathname === "/wallet/onboarding/import-keypairs" ||
        location.pathname === "/wallet/onboarding/import-wallet" ||
        location.pathname === "/wallet/sell" ||
        location.pathname === "/wallet/settings" ||
        location.pathname === "/wallet/token"
      );
    }
    if (path === "/settings") {
      return (
        location.pathname === "/settings" ||
        location.pathname === "/settings/about" ||
        location.pathname === "/settings/app-info"
      );
    }
    return false;
  };

  const handleNavClick = async () => {
    await haptics.navigation();
  };

  return (
    <>
      {/* Top bar with app name and language switcher, matching bottom bar width */}
      <div
        className={`fixed top-0 left-0 w-full bg-white/70 backdrop-blur-lg z-50 shadow top-nav-safe`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="max-w-2xl mx-auto flex flex-row justify-between items-center px-4 py-3 w-full">
          <span className="font-bold text-xl text-primary-main">
            {t.appName}
          </span>
          <select
            className="rounded border px-2 py-1 bg-white text-sm text-primay-light cursor-pointer shadow"
            value={lang}
            onClick={handleNavClick}
            onChange={handleLanguageChange}
            aria-label="Change language"
          >
            <option value="en">English</option>
            <option value="sv">Svenska</option>
            <option value="id">Bahasa Indonesia</option>
          </select>
        </div>
      </div>

      {/* Bottom tab navigation */}
      <nav className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t z-40 shadow-lg bottom-nav-safe">
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
                        ? "bg-fuchsia-100 text-primay-main shadow font-semibold"
                        : "hover:bg-fuchsia-50 text-slate-800"
                    }`}
                  style={{ minWidth: 60 }}
                >
                  {item.icon}
                  <span className="text-xs">
                    {t[item.key as keyof typeof t]}
                  </span>
                </Link>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content className="text-xs bg-white border px-2 py-1 rounded shadow">
                  {t[item.key as keyof typeof t]}
                  <Tooltip.Arrow className="fill-white" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          ))}
        </div>
      </nav>
      {/* Add top and bottom padding to main content to prevent overlap */}
      <div className="h-16" aria-hidden="true"></div>
    </>
  );
}
