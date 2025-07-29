# wallet-kit

Solana toolkit for Not Wallet. This crate generates Swift package for wallet-kit and only used by watchOS target in the watchApp target.

## Build Swift Package

```
cargo install cargo-swift
cargo swift package
```

## Build Kotlin Package

```
cargo build --release
cargo run --bin uniffi-bindgen generate --library target/release/libwallet_kit.dylib --language kotlin --out-dir out
```
 Or use the `cargo ndk`:
 ```
cargo install cargo-ndk
cargo ndk build --release
cargo run --bin uniffi-bindgen generate --library target/release/libwallet_kit.dylib --language kotlin --out-dir out
```
