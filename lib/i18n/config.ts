import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { detectLanguage } from "./language-detector";

// Import translation files
import en from "./locales/en.json";
import id from "./locales/id.json";

const resources = {
  en: {
    translation: en,
  },
  id: {
    translation: id,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: detectLanguage().language, // use language detector for default
  fallbackLng: "en",
  debug: false,

  interpolation: {
    escapeValue: false, // react already does escaping
  },

  // Configuration for static export compatibility
  load: "languageOnly", // don't load region-specific variants
  cleanCode: true, // clean up language codes

  // Load translations synchronously for static export
  initImmediate: false,

  // Custom formatting for finance app
  ns: ["translation"],
  defaultNS: "translation",

  // React specific options
  react: {
    useSuspense: false, // Important for SSG/static export
    bindI18n: "languageChanged loaded",
    bindI18nStore: false,
    transEmptyNodeValue: "",
    transSupportBasicHtmlNodes: true,
    transKeepBasicHtmlNodesFor: ["br", "strong", "i"],
  },
});

// Custom formatter for Indonesian Rupiah
i18n.services.formatter?.add(
  "currency",
  (value: number, lng: string | undefined) => {
    if (lng === "id") {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    }

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  },
);

// Custom formatter for numbers
i18n.services.formatter?.add(
  "number",
  (value: number, lng: string | undefined) => {
    if (lng === "id") {
      return new Intl.NumberFormat("id-ID").format(value);
    }

    return new Intl.NumberFormat("en-US").format(value);
  },
);

export default i18n;
