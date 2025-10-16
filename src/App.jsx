import { Routes, Route, useLocation } from "react-router-dom";
import * as Tooltip from "@radix-ui/react-tooltip";
import Navbar from "./components/Navbar";
import AnimatedPage from "./components/AnimatedPage";
import Lessons from "./pages/Lessons";
import HomePage from "@app/home/page";
import DAOPage from "@app/home/dao/page";
import LearnPage from "@app/home/learn/page";
import SettingsPage from "@app/settings/page";
import AboutPage from "@app/settings/about/page";
import AppInfoPage from "@app/settings/app-info/page";
import { I18nProvider } from "@lib/i18n/provider";

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
                path="/lessons"
                element={
                  <AnimatedPage>
                    <Lessons />
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
