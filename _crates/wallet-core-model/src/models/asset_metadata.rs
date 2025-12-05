use {
    crate::models::asset_solana::SolanaAsset,
    serde::{Deserialize, Serialize},
    smbcloud_wallet_constants::assets_solana::{
        ADDRESS_AAPLX, ADDRESS_AMZNX, ADDRESS_BACH_TOKEN, ADDRESS_CBBTC, ADDRESS_EURC,
        ADDRESS_GOOGLX, ADDRESS_JUPITER, ADDRESS_METAX, ADDRESS_MSFTX, ADDRESS_NVDAX, ADDRESS_SOL,
        ADDRESS_TSLAX, ADDRESS_USD1, ADDRESS_USDC, ADDRESS_USDG, ADDRESS_USDS, ADDRESS_USDT,
        ADDRESS_XBTC, ADDRESS_ZBTC,
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
    /// Bitcoin
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
    pub fn cbbtc() -> Self {
        Metadata {
            address: ADDRESS_CBBTC.to_string(),
            name: "Coinbase Wrapped BTC".to_string(),
            symbol: "cbBTC".to_string(),
            decimal: 8,
            logo_uri: "https://ipfs.io/ipfs/QmZ7L8yd5j36oXXydUiYFiFsRHbi3EdgC4RuFwvM7dcqge"
                .to_string(),
        }
    }
    pub fn xbtc() -> Self {
        Metadata {
            address: ADDRESS_XBTC.to_string(),
            name: "OKX Wrapped BTC".to_string(),
            symbol: "xBTC".to_string(),
            decimal: 8,
            logo_uri: "https://assets.coingecko.com/coins/images/66627/standard/xbtc.png"
                .to_string(),
        }
    }
    /// End Bitcoin
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
    pub fn msftx() -> Self {
        Metadata {
            address: ADDRESS_MSFTX.to_string(),
            name: "Microsoft xStock".to_string(),
            symbol: "MSFTx".to_string(),
            decimal: 8,
            logo_uri: "https://cdn.prod.website-files.com/655f3efc4be468487052e35a/68497bdc918924ea97fd8211_Ticker%3DMSFT%2C%20Company%20Name%3DMicrosoft%20Inc.%2C%20size%3D256x256.svg".to_string(),
        }
    }
    pub fn amznx() -> Self {
        Metadata {
            address: ADDRESS_AMZNX.to_string(),
            name: "Amazon xStock".to_string(),
            symbol: "AMZNx".to_string(),
            decimal: 8,
            logo_uri: "https://cdn.prod.website-files.com/655f3efc4be468487052e35a/68497d354d7140b01657a793_Ticker%3DAMZN%2C%20Company%20Name%3DAmazon.com%20Inc.%2C%20size%3D256x256.svg".to_string(),
        }
    }
    pub fn metax() -> Self {
        Metadata {
            address: ADDRESS_METAX.to_string(),
            name: "Meta xStock".to_string(),
            symbol: "METAx".to_string(),
            decimal: 8,
            logo_uri: "https://cdn.prod.website-files.com/655f3efc4be468487052e35a/68497dee3db1bae97b91ac05_Ticker%3DMETA%2C%20Company%20Name%3DMeta%20Platforms%20Inc.%2C%20size%3D256x256.svg".to_string(),
        }
    }
    pub fn aaplx() -> Self {
        Metadata {
            address: ADDRESS_AAPLX.to_string(),
            name: "Apple xStock".to_string(),
            symbol: "AAPLx".to_string(),
            decimal: 8,
            logo_uri: "https://cdn.prod.website-files.com/655f3efc4be468487052e35a/6849799260ee65bf38841f90_Ticker%3DAAPL%2C%20Company%20Name%3DApple%20Inc.%2C%20size%3D256x256.svg".to_string(),
        }
    }
    pub fn googlx() -> Self {
        Metadata {
            address: ADDRESS_GOOGLX.to_string(),
            name: "Alphabet xStock".to_string(),
            symbol: "GOOGLx".to_string(),
            decimal: 8,
            logo_uri: "https://cdn.prod.website-files.com/655f3efc4be468487052e35a/684aae04a3d8452e0ae4bad8_Ticker%3DGOOG%2C%20Company%20Name%3DAlphabet%20Inc.%2C%20size%3D256x256.svg".to_string(),
        }
    }
    pub fn nvdax() -> Self {
        Metadata {
            address: ADDRESS_NVDAX.to_string(),
            name: "NVIDIA xStock".to_string(),
            symbol: "NVDAx".to_string(),
            decimal: 8,
            logo_uri: "https://cdn.prod.website-files.com/655f3efc4be468487052e35a/684961bfb45e3c4d777b9997_Ticker%3DNVDA%2C%20Company%20Name%3DNVIDIA%20Corp%2C%20size%3D256x256.svg".to_string(),
        }
    }
    pub fn tslax() -> Self {
        Metadata {
            address: ADDRESS_TSLAX.to_string(),
            name: "Tesla xStock".to_string(),
            symbol: "TSLAx".to_string(),
            decimal: 8,
            logo_uri: "https://cdn.prod.website-files.com/655f3efc4be468487052e35a/684aaf9559b2312c162731f5_Ticker%3DTSLA%2C%20Company%20Name%3DTesla%20Inc.%2C%20size%3D256x256.svg".to_string(),
        }
    }
}
