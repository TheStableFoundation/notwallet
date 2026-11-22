# Working in notwallet

NotWallet Crypto is a non-custodial Solana wallet. The root is a Tauri v2 app (React + Vite
frontend, Rust backend) that ships to iOS, Android, macOS, Windows and Linux. Web sub-projects
live under `apps/`, each with its own `pnpm-workspace.yaml` so it installs and builds in
isolation from the root.

## Layout

| Path | What it is |
|---|---|
| `src/`, `app/` | Frontend. `src/` is the Vite entry, `app/` holds the pages, components and `app/lib` (commands, i18n, stores). |
| `src-tauri/` | Tauri backend, `tauri.conf.json` plus one `tauri.prod-*.conf.json` overlay per release channel. |
| `_crates/` | Rust workspace for the wallet core (`wallet-kit`, `wallet-core-*`, `wallet-constants`) and the UniFFI bindings. |
| `_spm/`, `_gems/` | Swift package and Ruby gem outputs of the wallet core. |
| `watchOSApp/`, `wearOSApp/`, `watchGarmin/` | Companion watch apps. |
| `apps/web`, `apps/extension` | Marketing site and browser extension (see `.agents/specs/monorepo-structure/spec.md`). |
| `assets/aso/` | App Store, Play and Microsoft Store listing assets and the screenshot generator. |
| `.agents/skills/`, `.agents/specs/` | Agent skills and specs. Read the matching one before changing that area. |

## Toolchain

- Node from `.nvmrc`, pnpm 10. Install with `pnpm install` at the root and separately inside each `apps/*`.
- Ruby (the `_gems` crate) always runs through `rv run`, never a bare `ruby` or `bundle`.
- Apple builds use the release Xcode named in `.xcode-version`. Point `DEVELOPER_DIR` at it; a
  beta Xcode makes the Metal and Tauri iOS builds hang or stamp the wrong toolchain.
- Do not set `MACOSX_DEPLOYMENT_TARGET` to 12 or higher for host builds; macOS then rejects the
  proc-macro dylibs.

## Skills

- `releases`: channels, `release/*` branches, `make` targets, where each version lives.
- `wallet-core`: the `_crates` workspace, bindings, and regenerating `app/lib/crate/generated.ts`.
- `run-notwallet`: running the app on desktop, the iOS simulator and Android, plus a local Solana validator.

Run `pnpm check:skills` after editing a skill.

## Before a PR

```sh
pnpm build
pnpm check:tauri-config
pnpm check:skills
cargo check --manifest-path src-tauri/Cargo.toml
```

Keep PRs small and single-purpose. Nothing releases on a push to `main` or `development`; see the
`releases` skill.
