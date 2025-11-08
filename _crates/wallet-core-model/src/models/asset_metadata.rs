use {
    crate::models::asset_solana::SolanaAsset,
    serde::{Deserialize, Serialize},
    smbcloud_wallet_constants::assets_solana::{
        ADDRESS_BACH_TOKEN, ADDRESS_EURC, ADDRESS_JUPITER, ADDRESS_SOL, ADDRESS_USD1, ADDRESS_USDC,
        ADDRESS_USDG, ADDRESS_USDS, ADDRESS_USDT, ADDRESS_ZBTC,
    },
    tsync::tsync,
};

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[tsync]
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
            address: ADDRESS_SOL.to_string(),
            name: "Solana".to_string(),
            symbol: "SOL".to_string(),
            decimal: 9,
            logo_uri: "https://raw.githubusercontent.com/TheStableFoundation/notwallet/refs/heads/development/public/images/solana-coin.svg".to_string(),
        }
    }
    pub fn bach_token() -> Self {
        Metadata {
            address: ADDRESS_BACH_TOKEN.to_string(),
            name: "BACH Token".to_string(),
            symbol: "BACH".to_string(),
            decimal: 12,
            logo_uri: "https://raw.githubusercontent.com/solana-labs/token-list/badd1dbe8c2d1e38c4f77b77f1d5fd5c60d3cccb/assets/mainnet/CTQBjyrX8pYyqbNa8vAhQfnRXfu9cUxnvrxj5PvbzTmf/bach-token-logo-Est.2022.png".to_string(),
        }
    }
    pub fn zbtc() -> Self {
        Metadata {
            address: ADDRESS_ZBTC.to_string(),
            name: "zBTC (zBTC)".to_string(),
            symbol: "zBTC".to_string(),
            decimal: 8,
            logo_uri:
                "https://raw.githubusercontent.com/ZeusNetworkHQ/zbtc-metadata/main/lgoo-v2.png"
                    .to_string(),
        }
    }
    pub fn jupiter() -> Self {
        Metadata {
            address: ADDRESS_JUPITER.to_string(),
            name: "Jupiter".to_string(),
            symbol: "JUP".to_string(),
            decimal: 6,
            logo_uri: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN/logo.png".to_string(),
        }
    }
    pub fn usdc() -> Self {
        Metadata {
            address: ADDRESS_USDC.to_string(),
            name: "USD Coin".to_string(),
            symbol: "USDC".to_string(),
            decimal: 6,
            logo_uri: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png".to_string(),
        }
    }
    pub fn usdt() -> Self {
        Metadata {
            address: ADDRESS_USDT.to_string(),
            name: "Tether USD".to_string(),
            symbol: "USDT".to_string(),
            decimal: 6,
            logo_uri: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.svg".to_string(),
        }
    }
    pub fn usdg() -> Self {
        Metadata {
            address: ADDRESS_USDG.to_string(),
            name: "Global Dollar".to_string(),
            symbol: "USDG".to_string(),
            decimal: 6,
            logo_uri: "https://424565.fs1.hubspotusercontent-na1.net/hubfs/424565/GDN-USDG-Token-512x512.png".to_string(),
        }
    }
    pub fn usds() -> Self {
        Metadata {
            address: ADDRESS_USDS.to_string(),
            name: "USDS".to_string(),
            symbol: "USDS".to_string(),
            decimal: 6,
            logo_uri: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/USDSwr9ApdHk5bvJKMjzff41FfuX8bSxdKcR81vTwcA/logo.svg".to_string(),
        }
    }
    pub fn usd1() -> Self {
        Metadata {
            address: ADDRESS_USD1.to_string(),
            name: "USD1".to_string(),
            symbol: "USD1".to_string(),
            decimal: 6,
            logo_uri: "https://cdn.usd1protocol.com/logo.png".to_string(),
        }
    }
    pub fn eurc() -> Self {
        Metadata {
            address: ADDRESS_EURC.to_string(),
            name: "Euro Coin".to_string(),
            symbol: "EURC".to_string(),
            decimal: 6,
            logo_uri: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/HzwqbKZw8HxMN6bF2yFZNrht3c2iXXzpKcFu7uBEDKtr/logo.png".to_string(),
        }
    }
}
