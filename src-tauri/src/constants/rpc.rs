use std::format;

/// Not sponsored by Quiknode.
/// Default RPC URL for Solana mainnet on production.
/// Testnet on debug build.
#[cfg(debug_assertions)]
const SOLANA_RPC_BASE_URL: &str = "solana-testnet.quiknode.pro";
#[cfg(not(debug_assertions))]
const SOLANA_RPC_BASE_URL: &str = "solana-mainnet.quiknode.pro";

const SOLANA_RPC_NAMESPACE: &str = "your_namespace";
const SOLANA_RPC_ID: &str = "your_id";

pub fn rpc_url() -> String {
    format!(
        "https://{}.{}/{}",
        SOLANA_RPC_NAMESPACE, SOLANA_RPC_BASE_URL, SOLANA_RPC_ID
    )
}
