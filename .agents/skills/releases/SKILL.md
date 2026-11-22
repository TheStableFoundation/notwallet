---
name: releases
description: "Use when cutting or shipping a NotWallet release: bumping versions, choosing which release/* branch to push, direct download vs Mac App Store, iOS App Store, Google Play or Microsoft Store, or running the local make pipelines. Covers where each channel's version lives and the credentials a release build needs."
---

# Releases (notwallet)

Nothing releases on a push to `main` or `development`. Each CI channel has its own `release/*`
branch plus a manual Run workflow button. Apple and Android store builds can also run locally
through `make`.

## Channels

| Channel | How | Trigger | Version source |
|---|---|---|---|
| Direct desktop (macOS arm64 and x64, Linux, Windows) | CI `release-notwallet-desktop-direct.yml` | push `release/desktop-direct` or Run workflow | `tauri.prod-macos.conf.json`, `tauri.prod-linux.conf.json`, `tauri.prod-windows.conf.json` (must match) |
| Microsoft Store | CI `release-notwallet-desktop-windows-microsoft-store.yml` | push `release/desktop-windows-microsoft-store` or Run workflow | `tauri.prod-windows-microsoftstore.conf.json` |
| Google Play | CI `release-notwallet-mobile-android-playstore.yml` | push `release/mobile-android-playstore` or Run workflow | `tauri.prod-android-playstore.conf.json` (`version` and `versionCode`) |
| iOS App Store | CI `release-notwallet-mobile-ios-appstore.yml`, or local `make asios` | push `release/mobile-ios-appstore` or Run workflow | `tauri.prod-ios-appstore.conf.json` |
| Mac App Store | local `make asmacos` | local | `tauri.prod-macos-appstore.conf.json` and the version string in `Info.plist` |

All files live in `src-tauri/`. Bump every overlay of a channel together; the macOS store needs
a new `Info.plist` version string on every upload, which Tauri does not do for you.

## Local make targets

`make asmacos` (build, sign, upload), `make asios` (clean, init, icons, override, build,
fixplist, upload), `make psmobile` (clean, init, icons, override, keystore, `.aab`),
`make release-macos|release-linux|release-windows|release-windows-msstore`. The step targets
(`asios-build`, `asios-fixplist`, `psmobile-keystore`, ...) run one stage. The header of the
`Makefile` is the list.

The iOS and Mac pipelines read `.env.appstore` (see `.env.appstore.example`). Use the release
Xcode from `.xcode-version`; `asios-fixplist` rewrites beta toolchain stamps if a beta slipped in.

## Credentials a release build needs

- Onramp: `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`.
- RPC URLs for mainnet, testnet and devnet, read at compile time by `dotenv_codegen` in
  `_crates/wallet-constants` from `.env` (see `.env.example`).
- Backend `DEPLOY_KEY` and base URL in `src-tauri/src/constants/network.rs`; Birdeye key in the
  constants crate.
- Android upload keystore: stored encrypted under `secrets/`, decrypted with `scripts/decrypt-keystore.sh`.
  See `docs/android-keystore-encryption.md`.

Details and screenshots for the iOS flow are in `docs/ios-release-appstore.md`.

## iOS icons

The App Store icon must have no alpha channel. `pnpm gim` regenerates icons for mobile.
