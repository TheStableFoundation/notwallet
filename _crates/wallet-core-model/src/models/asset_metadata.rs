use serde::{Deserialize, Serialize};

use crate::models::asset_solana::SolanaAsset;

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Metadata {
    pub address: String,
    pub name: String,
    pub symbol: String,
    pub decimal: u8,
    pub logo_uri: String,
}

impl Metadata {
    pub fn into_asset(self) -> Option<SolanaAsset> {
        SolanaAsset::from_address(self.address)
    }
    pub fn native() -> Self {
        Metadata {
            address: "So11111111111111111111111111111111111111112".to_string(),
            name: "Solana".to_string(),
            symbol: "SOL".to_string(),
            decimal: 9,
            logo_uri: "https://raw.githubusercontent.com/TheStableFoundation/notwallet/refs/heads/development/public/images/solana-coin.svg".to_string(),
        }
    }
}
