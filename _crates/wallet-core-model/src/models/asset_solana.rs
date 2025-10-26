use {
    crate::models::{asset_metadata::Metadata, environment::Environment},
    smbcloud_wallet_constants::constants::SPL_TOKEN_PROGRAM_ID,
    smbcloud_wallet_core_network::model::ErrorResponse,
    smbcloud_wallet_core_rpc::balance::{
        aggregate_spl_token_balance::aggregate_spl_token_balance, sol_balance::sol_balance,
    },
    tsync::tsync,
};

#[derive(Debug)]
pub enum SolanaAsset {
    Sol { meta: Metadata },
    BachToken { meta: Metadata },
    ZBtc { meta: Metadata },
    Jupiter { meta: Metadata },
    // US Dollar Stablecoins
    Usdc { meta: Metadata },
    Usdt { meta: Metadata },
    Usdg { meta: Metadata },
    Usds { meta: Metadata },
    Usd1 { meta: Metadata },
    // Euro stablecoins
    Eurc { meta: Metadata },
    // Local token
    BachToken0 { meta: Metadata },
    BachToken1 { meta: Metadata },
}

impl SolanaAsset {
    pub fn metadata(&self) -> Metadata {
        match self {
            Self::Sol { meta } => meta.to_owned(),
            Self::BachToken { meta } => meta.to_owned(),
            Self::ZBtc { meta } => meta.to_owned(),
            Self::Jupiter { meta } => meta.to_owned(),
            // Stablecoins
            Self::Usdc { meta } => meta.to_owned(),
            Self::Usdt { meta } => meta.to_owned(),
            Self::Usdg { meta } => meta.to_owned(),
            Self::Usds { meta } => meta.to_owned(),
            Self::Usd1 { meta } => meta.to_owned(),
            Self::Eurc { meta } => meta.to_owned(),
            // Local token
            Self::BachToken0 { meta } => meta.to_owned(),
            Self::BachToken1 { meta } => meta.to_owned(),
        }
    }
}

#[tsync]
#[allow(dead_code)]
pub const ADDRESS_SOL: &str = "So11111111111111111111111111111111111111112";
#[tsync]
#[allow(dead_code)]
pub const ADDRESS_BACH_TOKEN: &str = "CTQBjyrX8pYyqbNa8vAhQfnRXfu9cUxnvrxj5PvbzTmf";
#[tsync]
#[allow(dead_code)]
pub const ADDRESS_JUPITER: &str = "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN";
#[tsync]
#[allow(dead_code)]
pub const ADDRESS_USDC: &str = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
#[tsync]
#[allow(dead_code)]
pub const ADDRESS_USDT: &str = "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB";
#[tsync]
#[allow(dead_code)]
pub const ADDRESS_USDG: &str = "2u1tszSeqZ3qBWF3uNGPFc8TzMk2tdiwknnRMWGWjGWH";
#[tsync]
#[allow(dead_code)]
pub const ADDRESS_USDS: &str = "USDSwr9ApdHk5bvJKMjzff41FfuX8bSxdKcR81vTwcA";
#[tsync]
#[allow(dead_code)]
pub const ADDRESS_USD1: &str = "USD1ttGY1N17NEEHLmELoaybftRBUSErhqYiQzvEmuB";
#[tsync]
#[allow(dead_code)]
pub const ADDRESS_EURC: &str = "HzwqbKZw8HxMN6bF2yFZNrht3c2iXXzpKcFu7uBEDKtr";
#[tsync]
#[allow(dead_code)]
pub const ADDRESS_ZBTC: &str = "zBTCug3er3tLyffELcvDNrKkCymbPWysGcWihESYfLg";
impl SolanaAsset {
    pub fn native() -> Self {
        Self::Sol {
            meta: Metadata::native(),
        }
    }

    pub fn from_address(address: String) -> Option<Self> {
        match address.as_str() {
            ADDRESS_SOL => Some(Self::Sol {
                meta: Metadata::native(),
            }),
            ADDRESS_BACH_TOKEN => Some(Self::BachToken {
                meta: Metadata {
                    address,
                    name: "BACH Token".to_string(),
                    symbol: "BACH".to_string(),
                    decimal: 12,
                    logo_uri: "https://raw.githubusercontent.com/solana-labs/token-list/badd1dbe8c2d1e38c4f77b77f1d5fd5c60d3cccb/assets/mainnet/CTQBjyrX8pYyqbNa8vAhQfnRXfu9cUxnvrxj5PvbzTmf/bach-token-logo-Est.2022.png".to_string(),
                },
            }),
            "zBTCug3er3tLyffELcvDNrKkCymbPWysGcWihESYfLg" => Some(Self::ZBtc {
                meta: Metadata {
                    address,
                    name: "zBTC (zBTC)".to_string(),
                    symbol: "zBTC".to_string(),
                    decimal: 8,
                    logo_uri: "https://raw.githubusercontent.com/ZeusNetworkHQ/zbtc-metadata/main/lgoo-v2.png".to_string(),
                },
            }),
            ADDRESS_JUPITER => Some(Self::Jupiter{
                meta: Metadata {
                    address,
                    name: "Jupiter".to_string(),
                    symbol: "JUP".to_string(),
                    decimal: 6,
                    logo_uri: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN/logo.png".to_string(),
                },
            }),
            ADDRESS_USDC => Some(Self::Usdc {
                meta: Metadata {
                    address,
                    name: "USD Coin".to_string(),
                    symbol: "USDC".to_string(),
                    decimal: 6,
                    logo_uri: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png".to_string(),
                },
            }),
            ADDRESS_USDT => Some(Self::Usdt {
                meta: Metadata {
                    address,
                    name: "Tether USD".to_string(),
                    symbol: "USDT".to_string(),
                    decimal: 6,
                    logo_uri: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.svg".to_string(),
                },
            }),
            ADDRESS_USDG => Some(Self::Usdg {
                meta: Metadata {
                    address,
                    name: "USDG Stablecoin".to_string(),
                    symbol: "USDG".to_string(),
                    decimal: 9,
                    logo_uri: "https://cdn.glitterpays.com/usdgtoken.png".to_string(),
                },
            }),
            ADDRESS_USDS => Some(Self::Usds {
                meta: Metadata {
                    address,
                    name: "USDS".to_string(),
                    symbol: "USDS".to_string(),
                    decimal: 6,
                    logo_uri: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/USDSwr9ApdHk5bvJKMjzff41FfuX8bSxdKcR81vTwcA/logo.svg".to_string(),
                },
            }),
            ADDRESS_USD1 => Some(Self::Usd1 {
                meta: Metadata {
                    address,
                    name: "USD1".to_string(),
                    symbol: "USD1".to_string(),
                    decimal: 6,
                    logo_uri: "https://cdn.usd1protocol.com/logo.png".to_string(),
                },
            }),
            ADDRESS_EURC => Some(Self::Eurc {
                meta: Metadata {
                    address,
                    name: "Euro Coin".to_string(),
                    symbol: "EURC".to_string(),
                    decimal: 6,
                    logo_uri: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/HzwqbKZw8HxMN6bF2yFZNrht3c2iXXzpKcFu7uBEDKtr/logo.png".to_string(),
                },
            }),
            // Local develoment tokens.
            "38JsCWEZ3dLRzcwxiCbL9rkkZqwwoWLAoCmqu7mWGSwq" => Some(Self::BachToken0 {
                meta: Metadata {
                    address,
                    name: "BACH Token Local 0".to_string(),
                    symbol: "BACHLOCAL0".to_string(),
                    decimal: 9,
                    logo_uri: "https://raw.githubusercontent.com/solana-labs/token-list/badd1dbe8c2d1e38c4f77b77f1d5fd5c60d3cccb/assets/mainnet/CTQBjyrX8pYyqbNa8vAhQfnRXfu9cUxnvrxj5PvbzTmf/bach-token-logo-Est.2022.png".to_string(),
                },
            }),
            "F1DKyNUT1zax4j241GiCPFJ9mG79HJtxeXPXH66L51Tp" => Some(Self::BachToken1 {
                meta: Metadata {
                    address,
                    name: "BACH Token Local 1".to_string(),
                    symbol: "BACHLOCAL1".to_string(),
                    decimal: 9,
                    logo_uri: "https://raw.githubusercontent.com/solana-labs/token-list/badd1dbe8c2d1e38c4f77b77f1d5fd5c60d3cccb/assets/mainnet/CTQBjyrX8pYyqbNa8vAhQfnRXfu9cUxnvrxj5PvbzTmf/bach-token-logo-Est.2022.png".to_string(),
                },
            }),
            _ => {
                println!("Unsupported Solana asset.");
                None
            }
        }
    }

    /// Get address' balance for this current asset.
    pub fn wallet_balance(
        self,
        environment: Environment,
        address: String,
    ) -> Result<(u64, f64), ErrorResponse> {
        match self {
            SolanaAsset::Sol { meta: _ } => sol_balance(environment.rpc_url(), address),
            // All SPL tokens use the same balance aggregation logic
            _ => {
                let meta = self.metadata();
                aggregate_spl_token_balance(
                    environment.rpc_url(),
                    address,
                    SPL_TOKEN_PROGRAM_ID.to_string(),
                    meta.address,
                )
            }
        }
    }
}
