---
name: run-notwallet
description: "Use when asked to run, start or see NotWallet working: the Vite dev server, the Tauri desktop app, the iOS simulator or an Android device, and a local Solana validator."
---

# Run NotWallet

Install once with `pnpm install` (Node from `.nvmrc`).

| Goal | Command |
|---|---|
| Frontend only, in a browser | `pnpm dev` |
| Desktop app | `make dev` (Tauri dev server) |
| iOS | set `bundle.iOS.developmentTeam` in `tauri.conf.json`, then `rm -rf src-tauri/gen/apple && cargo tauri ios init && pnpm gim && cargo tauri ios dev` |
| Android | `cargo tauri android init && cargo tauri android dev` |

Frontend-only mode has no Tauri commands, so anything that calls `invoke` fails there. Use the
desktop app for wallet behavior.

For local Solana, run `solana-test-validator` in a terminal and point the app at devnet or the
local RPC URL from `.env`.

iOS builds need the release Xcode from `.xcode-version`, with `DEVELOPER_DIR` set to it.
