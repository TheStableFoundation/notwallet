use std::{env, format};

pub const SOLANA_MAINNET_RPC_BASE_URL: &str = "solana-mainnet.quiknode.pro";
pub const SOLANA_TESTNET_RPC_BASE_URL: &str = "solana-testnet.quiknode.pro";
pub const SOLANA_DEVNET_RPC_BASE_URL: &str = "solana-devnet.quiknode.pro";

pub const SOLANA_LOCALHOST_RPC_URL: &str = "http://localhost:8899";

const USE_LOCAL_RPC: bool = false;

pub fn rpc_url() -> String {
    if USE_LOCAL_RPC {
        // Use local IP address when running on a real device.
        // For example, if your local IP address is 192.168.323.188,
        // then replace this line with: 192.168.323.188:8899
        SOLANA_LOCALHOST_RPC_URL.to_string()
    } else {
        mainnet_rpc_url()
    }
}

pub fn mainnet_rpc_url() -> String {
    format!(
        "https://{}.{}/{}",
        env::var("SOLANA_RPC_NAMESPACE").unwrap_or_default(),
        SOLANA_MAINNET_RPC_BASE_URL,
        env::var("SOLANA_RPC_ID").unwrap_or_default()
    )
}

pub fn testnet_rpc_url() -> String {
    format!(
        "https://{}.{}/{}",
        env::var("SOLANA_RPC_NAMESPACE").unwrap_or_default(),
        SOLANA_TESTNET_RPC_BASE_URL,
        env::var("SOLANA_RPC_ID").unwrap_or_default()
    )
}

pub fn devnet_rpc_url() -> String {
    format!(
        "https://{}.{}/{}",
        env::var("SOLANA_RPC_NAMESPACE").unwrap_or_default(),
        SOLANA_DEVNET_RPC_BASE_URL,
        env::var("SOLANA_RPC_ID").unwrap_or_default()
    )
}

pub fn local_rpc_url() -> String {
    SOLANA_LOCALHOST_RPC_URL.to_string()
}
