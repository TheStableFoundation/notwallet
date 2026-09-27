# iOS App Store screenshot plan

Written after the three-tab navigation change (Chat / Wallet / Profile) and the
addition of Amethyst, the on-device crypto educator.

## Why the current set is stale

The live 6.5" set on App Store Version 1.2.0 (`en-US`) is six images:

| # | File | Problem |
|---|---|---|
| 1 | `iphone-wallet-love.png` | Fine as a wallet shot, but no longer the lead story |
| 2 | `iphone-dao-own-it.png` | Leads on DAO — demoted out of the tab bar by the nav change |
| 3 | `iphone-wallet-scan.png` | Still valid |
| 4 | `iphone-dao-claim-your-fees.png` | DAO again; two of six frames on a now-secondary feature |
| 5 | `iphone-settings-language.png` | Still valid, belongs later in the arc |
| 6 | `iphone-wallet-switch.png` | Still valid, belongs later in the arc |

Nothing in the set shows Amethyst — the single biggest new reason to download —
and the first three frames (the only ones rendered in search results) do not
mention it at all.

## Required dimensions

App Store Connect accepts **only** the exact size its upload panel names for
this app record. The existing assets are `1242×2688` portrait, which pins this
record to the **iPhone 6.5"** class. Generate `1242×2688`; do not substitute a
newer 6.9" size — it will be rejected with "The dimensions of one or more
screenshots are wrong."

iPad set (`APP_IPAD_PRO_3GEN_129`) is `2048×2732` portrait.

## The arc

One idea per frame. Frames 1–3 carry the listing; everything after is for
someone who already tapped through. Slugs match the generated filenames.

| # | Slug | Screen | Caption (en-US) | Job |
|---|---|---|---|---|
| 1 | `chat-learn` | Amethyst empty state with starter chips | **Learn crypto, privately.** | Core promise — the new lead |
| 2 | `chat-answers` | Amethyst answering stablecoin + fees | **Plain answers, not hype.** | Proof the promise is real |
| 3 | `chat-on-device` | Chat with the offline status dot | **Runs on your device. Always.** | The differentiator |
| 4 | `wallet-keys` | Balance card + token list | **Your keys. Your crypto.** | Core wallet value |
| 5 | `wallet-receive` | QR receive sheet | **Move tokens in seconds.** | Feature breadth |
| 6 | `profile-privacy` | Profile list | **Five languages, zero tracking.** | Trust + reach |

**Every frame shows the new three-tab bar**, so none of the old images can be
reused — the previous set predates the nav change.

## Caption localization

Captions ship per storefront; all four are generated, none are left in English.

| # | sv | id | ar-SA |
|---|---|---|---|
| 1 | Lär dig krypto, privat. | Belajar kripto, privat. | تعلّم الكريبتو بخصوصية. |
| 2 | Raka svar, ingen hype. | Jawaban jelas, tanpa hype. | إجابات واضحة بلا مبالغة. |
| 3 | Körs på din enhet. Alltid. | Berjalan di perangkatmu. Selalu. | يعمل على جهازك. دائماً. |
| 4 | Dina nycklar. Din krypto. | Kuncimu. Kriptomu. | مفاتيحك. عملاتك. |
| 5 | Flytta tokens på sekunder. | Pindahkan token dalam detik. | حرّك الرموز في ثوانٍ. |
| 6 | Fem språk, noll spårning. | Lima bahasa, tanpa pelacakan. | خمس لغات، بلا تتبّع. |

The Arabic frames render right-to-left end to end — mirrored layout, reversed
tab order, flipped bubbles — matching the app's own RTL mode.

## Frame design system

- Real UI only. No invented screens, no fabricated balances that imply returns.
- One quiet background tint carried across all eight frames — the brand
  fuchsia→sky gradient at low saturation, so the set reads as one object.
- Caption at the top, device screenshot below, generous margin. Same type scale,
  same caption position, same device treatment in every frame.
- Restrained palette: brand purple `#9932CC` plus neutrals. No neon, no 3D blobs.
- Show a plausible, modest wallet balance. Do not imply investment returns —
  it is a compliance risk on a financial listing and off-brand besides.

## How to generate

Rendered programmatically from the app's real Tailwind markup and the built
production stylesheet — no simulator or device needed:

```sh
pnpm build                                                    # dist/assets/*.css
(cd .ds-sync && npm i playwright@1.61.0)                      # matches cached chromium
node assets/aso/appstore/screenshots/generator/generate.mjs   # all devices + locales
node assets/aso/appstore/screenshots/generator/generate.mjs --device mac --locale sv
```

Output: `assets/aso/appstore/screenshots/<device>/[<locale>/]NN-slug.png`
(`en` sits at the flat path; `sv`/`id`/`ar` in subfolders).

72 files: 3 devices × 4 locales × 6 shots.

### Why a separate Tailwind sheet

The app bundle only contains utilities Tailwind found in `src/` and `app/`. A
class Tailwind never emitted renders as *nothing*, silently — which is how the
wallet balance card first came out squashed. The generator therefore builds the
handful of marketing-only utilities it needs (`p-5`, `text-3xl`, `divide-y`, …)
into a separate sheet from the same theme (`tailwind.gen.config.js`), rather
than widening the app's content glob and shipping marketing CSS to every user.
That build runs automatically inside `generate.mjs`.

## Upload

```sh
ascapi app-screenshots upload <screenshot-set-id> --file <png>
```

Existing set ids on version 1.2.0 `en-US`:
- `APP_IPHONE_65` → `3b6cf48c-b8c3-4217-9041-66a6d490b323`
- `APP_IPAD_PRO_3GEN_129` → `96b9637f-219a-47e4-a4fc-b415a2239fce`

The six stale images already in those sets must be deleted first — ASC appends
rather than replaces, and the old set still leads on DAO.
