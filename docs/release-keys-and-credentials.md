# Release Keys and Credentials

These are non comprehensive keys and credentials that are used in the backend service for a fully functional release deployment.

## Deploy Key

This is a secret key that the backend service uses to authenticate airdrop claims. Find it in the `src-tauri/src/network/airdrop.rs` file.

```rust
let req_body = AirdropRequest {
    pubkey: &pubkey,
    signature: &signature,
    deploy_key: "your_deploy_key",
};

let url = format!("{}/api/v1/airdrop", API_BASE_URL);

```

### Base URL

This is the base URL for the backend service we deployed to the [smbCloud cloud deployment platform](https://smbcloud.xyz). Find it in the `src-tauri/src/constants/network.rs` file.

```rust
API_BASE_URL: "https://your-backend-identifier.5mb.app"
```

### Wallet Related Keys

Price data and swap APIs are from Jupiter and Birdeye. Find them in the

`crates/constants/src/constants.rs`

```rust
pub const BIRDEYE_API_KEY: &str = "YOUR_API_KEY_HERE";
```

### Solana RPC Servers

We are using Quiknode. Contact us if you want to sponsor us.

`src-tauri/src/constants/rpc.rs`
```rust
const SOLANA_RPC_NAMESPACE: &str = "your_namespace";
const SOLANA_RPC_ID: &str = "your_id";
```

### Fiat-to-crypto Services

We are using Stripe and Onramper.

Stripe secret key in the `src-tauri/src/constants/onramp.rs`.

```toml
STRIPE_SECRET_KEY = "your_stripe_secret_key"
```

Other keys are in the `lib/crate/generated.ts`.

```typescript
/* This file is generated and managed by tsync */

export const STRIPE_PUBLISHABLE_KEY = "your_stripe_publishable_key";

export const ONRAMPER_KEY = "your_onramper_key";

export const ONRAMPER_SIGNER_KEY = "your_onramper_signer_key";
```

Now you are ready to build [NotWallet Crypto non-custodial Solana crypto wallet](https://github.com/TheStableFoundation/not) for production release.
