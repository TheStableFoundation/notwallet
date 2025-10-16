import { Routes, Route, useLocation } from "react-router-dom";
import * as Tooltip from "@radix-ui/react-tooltip";
import Navbar from "@src/components/Navbar";
import AnimatedPage from "@src/components/AnimatedPage";
import HomePage from "@app/home/page";
import DAOPage from "@app/home/dao/page";
import LearnPage from "@app/home/learn/page";
import WalletHome from "@app/wallet/page";
import WalletOnboardingPage from "@app/wallet/onboarding/page";
import CreatePasswordPage from "@app/wallet/onboarding/create-password/page";
import SettingsPage from "@app/settings/page";
import AboutPage from "@app/settings/about/page";
import AppInfoPage from "@app/settings/app-info/page";
import { I18nProvider } from "@lib/i18n/provider";
import WalletBuyPage from "@app/wallet/buy/page";
import WalletBuyStripePage from "@app/wallet/buy/stripe/page";
import WalletCreateNewWalletPage from "@app/wallet/create-new-wallet/page";
import WalletCreateNewWalletDonePage from "@app/wallet/create-new-wallet/done/page";
import WalletImportPage from "@app/wallet/import/page";
import WalletOnboardingCreateWalletPage from "@app/wallet/onboarding/create-wallet/page";
import WalletOnboardingImportPage from "@app/wallet/onboarding/import/page";
import WalletOnboardingImportKeypairsPage from "@app/wallet/onboarding/import-keypairs/page";
import WalletOnboardingCreateWalletDisclaimerPage from "@app/wallet/onboarding/create-wallet-disclaimer/page";
import WalletOnboardingImportWalletPage from "@app/wallet/onboarding/import-wallet/page";
import WalletSellPage from "@app/wallet/sell/page";
import WalletSettingsPage from "@app/wallet/settings/page";
import WalletTokenPage from "@app/wallet/token/page";

export default function App() {
  const location = useLocation();

  return (
    <I18nProvider>
      <Tooltip.Provider>
        <div className="bg-gradient-to-tr from-fuchsia-100 to-sky-100 min-h-screen w-full font-sans relative safe-area">
          <Navbar />
          <main className="py-4 bottom-nav-safe max-w-2xl mx-auto px-4">
            <Routes location={location} key={location.pathname}>
              <Route
                path="/"
                element={
                  <AnimatedPage>
                    <HomePage />
                  </AnimatedPage>
                }
              />
              <Route
                path="/home/dao"
                element={
                  <AnimatedPage>
                    <DAOPage />
                  </AnimatedPage>
                }
              />
              <Route
                path="/home/learn"
                element={
                  <AnimatedPage>
                    <LearnPage />
                  </AnimatedPage>
                }
              />
              <Route
                path="/wallet"
                element={
                  <AnimatedPage>
                    <WalletHome />
                  </AnimatedPage>
                }
              />
              <Route
                path="/wallet/buy"
                element={
                  <AnimatedPage>
                    <WalletBuyPage />
                  </AnimatedPage>
                }
              />
              <Route
                path="/wallet/buy/stripe"
                element={
                  <AnimatedPage>
                    <WalletBuyStripePage />
                  </AnimatedPage>
                }
              />
              <Route
                path="/wallet/create-new-wallet"
                element={
                  <AnimatedPage>
                    <WalletCreateNewWalletPage />
                  </AnimatedPage>
                }
              />
              <Route
                path="/wallet/create-new-wallet/done"
                element={
                  <AnimatedPage>
                    <WalletCreateNewWalletDonePage />
                  </AnimatedPage>
                }
              />
              <Route
                path="/wallet/import"
                element={
                  <AnimatedPage>
                    <WalletImportPage />
                  </AnimatedPage>
                }
              />
              <Route
                path="/wallet/onboarding"
                element={
                  <AnimatedPage>
                    <WalletOnboardingPage />
                  </AnimatedPage>
                }
              />
              <Route
                path="/wallet/onboarding/create-password"
                element={
                  <AnimatedPage>
                    <CreatePasswordPage />
                  </AnimatedPage>
                }
              />
              <Route
                path="/wallet/onboarding/create-wallet"
                element={
                  <AnimatedPage>
                    <WalletOnboardingCreateWalletPage />
                  </AnimatedPage>
                }
              />
              <Route
                path="/wallet/onboarding/create-wallet-disclaimer"
                element={
                  <AnimatedPage>
                    <WalletOnboardingCreateWalletDisclaimerPage />
                  </AnimatedPage>
                }
              />
              <Route
                path="/wallet/onboarding/import"
                element={
                  <AnimatedPage>
                    <WalletOnboardingImportPage />
                  </AnimatedPage>
                }
              />
              <Route
                path="/wallet/onboarding/import-keypairs"
                element={
                  <AnimatedPage>
                    <WalletOnboardingImportKeypairsPage />
                  </AnimatedPage>
                }
              />
              <Route
                path="/wallet/onboarding/import-wallet"
                element={
                  <AnimatedPage>
                    <WalletOnboardingImportWalletPage />
                  </AnimatedPage>
                }
              />
              <Route
                path="/wallet/sell"
                element={
                  <AnimatedPage>
                    <WalletSellPage />
                  </AnimatedPage>
                }
              />
              <Route
                path="/wallet/settings"
                element={
                  <AnimatedPage>
                    <WalletSettingsPage />
                  </AnimatedPage>
                }
              />
              <Route
                path="/wallet/token"
                element={
                  <AnimatedPage>
                    <WalletTokenPage />
                  </AnimatedPage>
                }
              />
              <Route
                path="/profile"
                element={
                  <AnimatedPage>
                    <SettingsPage />
                  </AnimatedPage>
                }
              />
              <Route
                path="/profile/about"
                element={
                  <AnimatedPage>
                    <AboutPage />
                  </AnimatedPage>
                }
              />
              <Route
                path="/profile/app-info"
                element={
                  <AnimatedPage>
                    <AppInfoPage />
                  </AnimatedPage>
                }
              />
            </Routes>
          </main>
        </div>
      </Tooltip.Provider>
    </I18nProvider>
  );
}
