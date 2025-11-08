pub fn mainnet_rpc_url() -> String {
    dotenv!("SOLANA_MAINNET_RPC_BASE_URL").to_string()
}

pub fn testnet_rpc_url() -> String {
    dotenv!("SOLANA_TESTNET_RPC_BASE_URL").to_string()
}

pub fn devnet_rpc_url() -> String {
    dotenv!("SOLANA_DEVNET_RPC_BASE_URL").to_string()
}

pub fn local_rpc_url() -> String {
    "http://localhost:8899".to_string()
}
