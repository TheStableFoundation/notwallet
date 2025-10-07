use serde::{Deserialize, Serialize};

pub enum Asset {
    Solana(SolanaAsset),
}

#[derive(Debug)]
pub enum SolanaAsset {
    Sol { meta: Metadata },
    BachToken { meta: Metadata },
    // Local token
    BachToken0 { meta: Metadata },
    BachToken1 { meta: Metadata },
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Metadata {
    pub address: String,
    pub name: String,
    pub symbol: String,
    pub decimal: u8,
    pub logo_uri: String,
}
