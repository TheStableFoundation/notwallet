"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./config"; // Initialize i18n
import {
  detectLanguage,
  saveLanguagePreference,
  debugLanguageDetection,
} from "./language-detector";

export type Language = "en" | "id";

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, options?: any) => string;
  isLoading: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: React.ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguageState] = useState<Language>("en");

  // Initialize language from multiple sources (saved preference, browser, fallback)
  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        // Use the language detector to determine the best language
        const detection = detectLanguage();

        // Debug in development
        debugLanguageDetection();

        // Set the language
        setLanguageState(detection.language);
        await i18n.changeLanguage(detection.language);

        // If this came from browser detection, save it as preference
        if (detection.source === "browser") {
          saveLanguagePreference(detection.language);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing language:", error);
        setIsLoading(false);
      }
    };

    initializeLanguage();
  }, [i18n]);

  const setLanguage = async (lang: Language) => {
    try {
      setLanguageState(lang);
      await i18n.changeLanguage(lang);
      saveLanguagePreference(lang);
    } catch (error) {
      console.error("Error changing language:", error);
    }
  };

  const contextValue: I18nContextType = {
    language,
    setLanguage,
    t,
    isLoading,
  };

  return (
    <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

// Helper hook for translations with namespace support
export function useTranslations(namespace?: string) {
  const { t, language } = useI18n();

  return {
    t: (key: string, options?: any) => {
      const fullKey = namespace ? `${namespace}.${key}` : key;
      return t(fullKey, options);
    },
    language,
  };
}

// Helper function to format currency based on locale
export function formatCurrency(amount: number, language: Language): string {
  if (language === "id") {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Helper function to format numbers based on locale
export function formatNumber(value: number, language: Language): string {
  if (language === "id") {
    return new Intl.NumberFormat("id-ID").format(value);
  }

  return new Intl.NumberFormat("en-US").format(value);
}

// Helper function to format dates based on locale
export function formatDate(date: Date, language: Language): string {
  if (language === "id") {
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
