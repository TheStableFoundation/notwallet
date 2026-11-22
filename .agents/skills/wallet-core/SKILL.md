---
name: wallet-core
description: "Use when changing the Rust wallet core in _crates, its Swift or Ruby bindings, or the Rust models shared with the frontend. Covers the crate layout, regenerating app/lib/crate/generated.ts with pnpm ts, and building the WalletKit Swift package for watchOS and tvOS."
---

# Wallet core

`_crates/` is a Cargo workspace: `wallet-kit`, `wallet-core`, `wallet-core-http`,
`wallet-core-model`, `wallet-core-network`, `wallet-core-rpc`, `wallet-constants`, and
`WalletKitV3`, the UniFFI target for watchOS and tvOS. `src-tauri` depends on these crates.

## Shared types

Rust models marked for `tsync` become TypeScript in `app/lib/crate/generated.ts`. Never edit that
file by hand. After changing a model in `src-tauri/src/`, `wallet-kit`, `wallet-constants` or
`wallet-core-model`:

```sh
pnpm ts        # same as make ts
```

Commit the regenerated file with the Rust change.

## Swift package

`_crates/README.md` has the `cargo swift` command that produces `WalletKitV3` (needs a local
`cargo-swift` checkout and `WATCHOS_DEPLOYMENT_TARGET=9`). `_spm/WalletKit` is the package the
Xcode projects consume.

## Ruby gem

`_gems/wallet_core` is a native-extension gem and is not tracked in this repo. Run its Ruby
commands through `rv run` (`rv run bundle exec rake`), not a bare `ruby`.

## Check

```sh
cargo check --manifest-path src-tauri/Cargo.toml
cargo check --manifest-path _crates/Cargo.toml
```
