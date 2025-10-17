# smbCloud Web3

This is the root package of the `smbCloud Web3` (I hate this term) crate workspace. The sole purpose of this package is to provide the core functionality and dependencies required for building and running the Xcode project. Running this command on this directory on a macOS machine will give you a `WalletKitV3` Swift package:

```bash
$ WATCHOS_DEPLOYMENT_TARGET=9 cargo run --manifest-path ../../cargo-swift/Cargo.toml swift package -p watchos -n WalletKitV3 -r
```
