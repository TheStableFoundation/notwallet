use std::format;

pub const SOLANA_MAINNET_RPC_BASE_URL: &str = "solana-mainnet.quiknode.pro";
pub const SOLANA_TESTNET_RPC_BASE_URL: &str = "solana-testnet.quiknode.pro";
pub const SOLANA_DEVNET_RPC_BASE_URL: &str = "solana-devnet.quiknode.pro";
pub const SOLANA_LOCALHOST_RPC_URL: &str = "http://localhost:8899";

pub const SOLANA_RPC_NAMESPACE: &str = "your_namespace";
pub const SOLANA_RPC_ID: &str = "your_id";

const USE_LOCAL_RPC: bool = false;

pub fn rpc_url() -> String {
    if USE_LOCAL_RPC {
        // Use local IP address when running on a real device.
        // For example, if your local IP address is 192.168.323.188,
        // then replace this line with: 192.168.323.188:8899
        SOLANA_LOCALHOST_RPC_URL.to_string()
    } else {
        format!(
            "https://{}.{}/{}",
            SOLANA_RPC_NAMESPACE, SOLANA_MAINNET_RPC_BASE_URL, SOLANA_RPC_ID
        )
    }
}
