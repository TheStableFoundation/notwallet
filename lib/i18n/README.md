# Internationalization (i18n) Implementation

This document describes the internationalization implementation for NotWallet, supporting English (default) and Indonesian languages with static export compatibility.

## Overview

The i18n implementation is designed specifically for NextJS applications with `output: 'export'` configuration, providing:

- ✅ Client-side language switching
- ✅ Static site generation compatibility
- ✅ Finance-specific localization
- ✅ Indonesian Rupiah and USD currency formatting
- ✅ Locale-aware date and number formatting
- ✅ Persistent language preferences

## Architecture

### Core Files

```
lib/i18n/
├── config.ts           # i18n configuration and formatters
├── provider.tsx        # React context and hooks
├── language-switcher.tsx # UI component for language selection
├── locales/
│   ├── en.json        # English translations
│   └── id.json        # Indonesian translations
└── README.md          # This documentation
```

### Key Components

1. **I18nProvider**: React context provider for language state management
2. **useI18n**: Primary hook for accessing translations and language state
3. **useTranslations**: Helper hook with namespace support
4. **LanguageSwitcher**: UI component for language selection
5. **Format helpers**: Currency, number, and date formatting functions

## Usage

### 1. Basic Setup

The i18n provider is already integrated in the root layout (`app/layout.tsx`):

```tsx
import { I18nProvider } from "@/lib/i18n/provider";

export default function RootLayout({ children }) {
  return (
    <I18nProvider>
      {/* Your app content */}
    </I18nProvider>
  );
}
```

### 2. Using Translations in Components

```tsx
import { useI18n } from "@/lib/i18n/provider";

export default function MyComponent() {
  const { t, language } = useI18n();
  
  return (
    <div>
      <h1>{t("wallet.settings")}</h1>
      <p>{t("security.securityNotice")}</p>
      <p>Current language: {language}</p>
    </div>
  );
}
```

### 3. Using Namespace Helper

```tsx
import { useTranslations } from "@/lib/i18n/provider";

export default function WalletComponent() {
  const { t } = useTranslations("wallet");
  
  return (
    <div>
      <h1>{t("settings")}</h1> {/* Resolves to wallet.settings */}
      <button>{t("addWallet")}</button> {/* Resolves to wallet.addWallet */}
    </div>
  );
}
```

### 4. Language Switcher Component

```tsx
import LanguageSwitcher from "@/lib/i18n/language-switcher";

export default function Header() {
  return (
    <div>
      <LanguageSwitcher />
      {/* or minimal version */}
      <LanguageSwitcher variant="minimal" showLabel={false} />
    </div>
  );
}
```

### 5. Formatting Functions

```tsx
import { 
  formatCurrency, 
  formatNumber, 
  formatDate,
  useI18n 
} from "@/lib/i18n/provider";

export default function BalanceComponent() {
  const { language } = useI18n();
  
  const balance = 1500000;
  const date = new Date();
  
  return (
    <div>
      <p>Balance: {formatCurrency(balance, language)}</p>
      <p>Date: {formatDate(date, language)}</p>
      <p>Number: {formatNumber(12345.67, language)}</p>
    </div>
  );
}
```

## Translation Structure

### English (`en.json`)
```json
{
  "common": {
    "add": "Add",
    "create": "Create",
    "settings": "Settings"
  },
  "wallet": {
    "title": "Wallet",
    "addWallet": "Add Wallet",
    "settings": "Wallet Settings"
  },
  "finance": {
    "balance": "Balance",
    "send": "Send",
    "receive": "Receive"
  }
}
```

### Indonesian (`id.json`)
```json
{
  "common": {
    "add": "Tambah",
    "create": "Buat",
    "settings": "Pengaturan"
  },
  "wallet": {
    "title": "Dompet",
    "addWallet": "Tambah Dompet",
    "settings": "Pengaturan Dompet"
  },
  "finance": {
    "balance": "Saldo",
    "send": "Kirim",
    "receive": "Terima"
  }
}
```

## Localization Features

### Currency Formatting

- **English**: USD format (`$1,234.56`)
- **Indonesian**: IDR format (`Rp1.234.567`)

### Number Formatting

- **English**: US format (`1,234.56`)
- **Indonesian**: Indonesian format (`1.234,56`)

### Date Formatting

- **English**: US format (`January 1, 2024, 10:30 AM`)
- **Indonesian**: Indonesian format (`1 Januari 2024, 10.30`)

## Adding New Languages

1. Create a new translation file in `lib/i18n/locales/[lang].json`
2. Add the language to the `resources` object in `config.ts`
3. Update the `Language` type in `provider.tsx`
4. Add the language option to `language-switcher.tsx`

Example for German:

```typescript
// config.ts
import de from './locales/de.json';

const resources = {
  en: { translation: en },
  id: { translation: id },
  de: { translation: de }, // Add new language
};

// provider.tsx
export type Language = 'en' | 'id' | 'de'; // Update type

// language-switcher.tsx
const languages: LanguageOption[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' }, // Add new option
];
```

## Finance-Specific Considerations

### Currency Support
- Primary currencies: USD (English) and IDR (Indonesian)
- Extensible for additional cryptocurrencies and fiat currencies
- Proper decimal place handling (2 for USD, 0 for IDR)

### Transaction Terms
All finance-related terms are carefully translated:
- Balance → Saldo
- Transaction → Transaksi
- Send → Kirim
- Receive → Terima
- Fee → Biaya

### Security Terms
Security-related translations maintain clarity:
- Seed Phrase → Frasa Benih
- Recovery Phrase → Frasa Pemulihan
- Backup → Cadangan

## Best Practices

1. **Use semantic keys**: `wallet.addWallet` instead of `addWalletButton`
2. **Group related translations**: Use namespaces like `common`, `wallet`, `finance`
3. **Keep translations concise**: Especially important for mobile UI
4. **Test both languages**: Ensure UI layouts work with different text lengths
5. **Use format helpers**: Always use provided formatters for numbers, dates, and currency
6. **Validate translations**: Ensure financial terms are accurate and culturally appropriate

## Testing

Visit `/i18n-test` to see a comprehensive demo of all i18n features including:
- Translation examples for all namespaces
- Currency and number formatting
- Date formatting
- Language switching functionality

## Static Export Compatibility

This implementation is specifically designed for NextJS static export:

- ✅ No server-side dependencies
- ✅ Client-side only language detection
- ✅ localStorage for language persistence
- ✅ Synchronous translation loading
- ✅ No dynamic imports or server routes required

## Performance

- Translations are bundled at build time
- No runtime fetching of translation files
- Minimal bundle size impact (~10KB for both languages)
- Fast language switching (no network requests)