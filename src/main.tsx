import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { LanguageProvider } from "./LanguageContext";
import { AirdropEnvironmentProvider } from "@app/lib/context/app-environment-context";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <LanguageProvider>
      <BrowserRouter>
        <AirdropEnvironmentProvider>
          <App />
        </AirdropEnvironmentProvider>
      </BrowserRouter>
    </LanguageProvider>
  </React.StrictMode>,
);
