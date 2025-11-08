# Release Build

- Regardless of the target, you will need onramp and RPC provider.
- For Apple platform release builds, namely iOS and macOS, you will need a paid developer account.
- For Android platform release builds, you will need a paid PlayStore developer account.

## Onramp provider

Currently only support Stripe crypto onramp. See:

- STRIPE_SECRET_KEY
- STRIPE_PUBLISHABLE_KEY

## RPC URLs

We use `dotenv_codegen` crate in the `smbcloud-wallet-constants` crate to get the RPC URLs for `mainnet`, `testnet`, and `devnet`. See the `.env.example` file to fill your `.env` file for production release. The crate will populate the environment variables during compile time.
