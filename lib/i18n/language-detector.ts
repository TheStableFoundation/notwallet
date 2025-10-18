import type { Language } from './provider';

export interface LanguageDetectionResult {
  language: Language;
  source: 'saved' | 'browser' | 'fallback';
}

const LANGUAGE_STORAGE_KEY = 'notwallet-language';
const SUPPORTED_LANGUAGES: Language[] = ['en', 'id'];

/**
 * Detects the user's preferred language from multiple sources
 * Priority: 1. Saved preference 2. Browser language 3. Default fallback
 */
export function detectLanguage(): LanguageDetectionResult {
  // First, check if user has a saved preference
  if (typeof localStorage !== 'undefined') {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language;
    if (savedLanguage && SUPPORTED_LANGUAGES.includes(savedLanguage)) {
      return {
        language: savedLanguage,
        source: 'saved'
      };
    }
  }

  // Second, check browser language
  if (typeof navigator !== 'undefined' && navigator.language) {
    const browserLang = getBrowserLanguage();
    if (browserLang && SUPPORTED_LANGUAGES.includes(browserLang)) {
      return {
        language: browserLang,
        source: 'browser'
      };
    }
  }

  // Fallback to English
  return {
    language: 'en',
    source: 'fallback'
  };
}

/**
 * Extracts supported language code from browser language
 * Handles cases like: 'en-US' -> 'en', 'id-ID' -> 'id', 'ja-JP' -> null
 */
function getBrowserLanguage(): Language | null {
  if (typeof navigator === 'undefined') return null;

  const languages = [
    navigator.language,
    ...(navigator.languages || [])
  ];

  for (const lang of languages) {
    const langCode = lang.split('-')[0].toLowerCase();
    if (SUPPORTED_LANGUAGES.includes(langCode as Language)) {
      return langCode as Language;
    }
  }

  return null;
}

/**
 * Checks if a language code is supported
 */
export function isSupportedLanguage(lang: string): lang is Language {
  return SUPPORTED_LANGUAGES.includes(lang as Language);
}

/**
 * Gets all supported languages with their display names
 */
export function getSupportedLanguages() {
  return [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' }
  ] as const;
}

/**
 * Saves language preference to localStorage
 */
export function saveLanguagePreference(language: Language): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }
}

/**
 * Gets the display name for a language in the current locale
 */
export function getLanguageDisplayName(language: Language, currentLanguage: Language): string {
  const languages = getSupportedLanguages();
  const lang = languages.find(l => l.code === language);

  if (!lang) return language;

  // Return localized name based on current language
  if (currentLanguage === 'id') {
    return language === 'en' ? 'Bahasa Inggris' : 'Bahasa Indonesia';
  }

  return lang.name;
}

/**
 * Debug function to log language detection process
 */
export function debugLanguageDetection(): void {
  if (process.env.NODE_ENV === 'development') {
    const result = detectLanguage();
    const browserLang = getBrowserLanguage();
    const savedLang = typeof localStorage !== 'undefined'
      ? localStorage.getItem(LANGUAGE_STORAGE_KEY)
      : null;

    console.group('🌍 Language Detection Debug');
    console.log('Browser languages:', navigator.languages || [navigator.language]);
    console.log('Detected browser language:', browserLang);
    console.log('Saved language preference:', savedLang);
    console.log('Final language selection:', result);
    console.log('Supported languages:', SUPPORTED_LANGUAGES);
    console.groupEnd();
  }
}
