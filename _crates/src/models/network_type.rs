use std::fmt::Display;

use smbcloud_wallet_constants::rpc::{
    SOLANA_DEVNET_RPC_BASE_URL, SOLANA_MAINNET_RPC_BASE_URL, SOLANA_RPC_ID, SOLANA_RPC_NAMESPACE,
    SOLANA_TESTNET_RPC_BASE_URL,
};

#[derive(uniffi::Enum)]
pub enum NetworkType {
    SolanaMainnet,
    SolanaTestnet,
    SolanaDevnet,
    Localhost,
}

impl Display for NetworkType {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            NetworkType::SolanaMainnet => write!(f, "Solana Mainnet"),
            NetworkType::SolanaTestnet => write!(f, "Solana Testnet"),
            NetworkType::SolanaDevnet => write!(f, "Solana Devnet"),
            NetworkType::Localhost => write!(f, "Localhost"),
        }
    }
}

pub fn rpc_url(network: NetworkType) -> String {
    let base_url = match network {
        NetworkType::SolanaMainnet => SOLANA_MAINNET_RPC_BASE_URL.to_string(),
        NetworkType::SolanaTestnet => SOLANA_TESTNET_RPC_BASE_URL.to_string(),
        NetworkType::SolanaDevnet => SOLANA_DEVNET_RPC_BASE_URL.to_string(),
        NetworkType::Localhost => return "http://localhost:8899".to_string(),
    };

    let rpc_url = format!(
        "https://{}.{}/{}",
        SOLANA_RPC_NAMESPACE, base_url, SOLANA_RPC_ID
    );

    println!("🦀🦀 RPC URL: {}", rpc_url);

    rpc_url
}
