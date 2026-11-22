# Spec: Frontend internationalization

| Field        | Value |
| ------------ | ----- |
| Status       | Shipped |
| Owner        | Seto Elkahfi |
| Created      | 2026-11-22 |
| Last updated | 2026-11-22 |
| Services     | notwallet (frontend, `app/`) |

## 1. Summary

The frontend is translated by one typed dictionary and a React context. There is no i18n
library. This spec replaces five implementation summaries that used to live in `docs/`
(`i18n-implementation-complete`, `IMPLEMENTATION_SUMMARY`, `TRANSLATION_IMPLEMENTATION_SUMMARY`,
`LANGUAGE_SETTINGS_MIGRATION`, `NAVIGATOR_LANGUAGE_IMPLEMENTATION`). Those described a
`lib/i18n/` folder with JSON locale files, a `useI18n` hook and `navigator.language` detection.
None of that exists in the tree; they were written for an earlier design.

## 2. Problem & Motivation

Wallet UI text has to be readable in the languages of the people who use the app. Strings
hard-coded in components cannot be translated, and a dictionary that is not type-checked drifts:
one language gets a key the others lack and the screen shows `undefined`.

## 3. Goals

- Every user-visible string comes from the `Translation` interface.
- A missing key in any language is a compile error, not a runtime blank.
- Switching language re-renders the whole tree immediately.

## 4. Non-Goals

- Persisting the language choice across launches (not implemented, see §8).
- Detecting the device language (not implemented, see §8).
- Pluralization and date/number formatting rules. Strings that need a value are functions,
  for example `welcomePersonal(name)`.

## 5. Requirements

- **Locked:** `Translation` in `app/lib/utils/i18n.ts` is the single list of keys, and
  `translations: Record<SupportedLanguages, Translation>` must define all of them for every
  language.
- **Locked:** `SupportedLanguages` is `"en" | "sv" | "id" | "fil" | "ar"`.
- **Locked:** components read text with `useLang()` from `app/lib/context/language-context.tsx`
  (`{ lang, setLang, t }`) and must render inside `LanguageProvider`.
- **Locked:** the initial language is `en`.
- Language is changed from `app/settings/language-preferences/page.tsx` through `setLang`.

## 6. Design / Proposed Solution

`LanguageProvider` holds `lang` in `useState("en")` and exposes `t = translations[lang]`.
Adding a string means adding the key to `Translation`, then to all five language objects; the
compiler lists the ones you missed. Adding a language means extending `SupportedLanguages`,
adding a full object to `translations`, and adding it to the language preferences page.

Store listing text is separate. It lives under `assets/aso/` and is not read by the app.

## 7. Implementation Plan

Shipped. Nothing pending.

## 8. Risks, Tradeoffs & Open Questions

- **Open:** the language resets to `en` on every launch because `lang` is plain component state.
  Persist it through the existing store (`app/lib/store/store`) and read it before first render.
- **Open:** no device-language default. `navigator.language` or the Tauri `os` plugin locale
  could pick the first value.
- **Tradeoff:** one 2,000-line file is easy to type-check and grep but every language ships in
  the bundle. Acceptable at five languages.
- **Open:** `ar` is right-to-left. Nothing in the layout sets `dir`; check Arabic screens by eye.

## 9. Dependencies & Sequencing

None.

## 10. Validation & Success Criteria

- `pnpm build` (runs `tsc`) fails if any language is missing a key.
- Switch each language on the language preferences page and confirm the open screen updates.

## 11. References

- `app/lib/utils/i18n.ts`, `app/lib/context/language-context.tsx`
- `app/settings/language-preferences/page.tsx`
