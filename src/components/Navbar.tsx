import React from "react";
import { Link, useLocation } from "react-router-dom";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useLang } from "../LanguageContext";
import { SupportedLanguages } from "../i18n";

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
    path: "/profile",
    key: "profile",
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="4" stroke="#a21caf" strokeWidth="1.5" />
        <path
          d="M4 20v-1a7 7 0 0 1 14 0v1"
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
  const isRTL = lang === "fa";

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setLang(event.target.value as SupportedLanguages);
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
            onChange={handleLanguageChange}
            aria-label="Change language"
          >
            <option value="en">English</option>
            <option value="sv">Svenska</option>
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
                  className={`flex flex-col items-center justify-center gap-1 px-3 py-1 rounded transition-all duration-200
                    ${
                      location.pathname === item.path
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
