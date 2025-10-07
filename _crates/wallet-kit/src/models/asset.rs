use {
    serde::{Deserialize, Serialize},
    tsync::tsync,
};

#[tsync]
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Asset {
    pub id: String,
    pub name: String,
    pub symbol: String,
    pub decimals: u8,
    pub logo_url: String,
}

impl Asset {
    pub fn new(id: &str, name: &str, symbol: &str, decimals: u8, logo_url: &str) -> Self {
        Self {
            id: id.to_string(),
            name: name.to_string(),
            symbol: symbol.to_string(),
            decimals,
            logo_url: logo_url.to_string(),
        }
    }

    pub fn new_with_default(id: &str, decimals: u8) -> Self {
        Self {
            id: id.to_string(),
            name: "".to_string(),
            symbol: "".to_string(),
            decimals,
            logo_url: "".to_string(),
        }
    }
}

#[tsync]
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct AssetBalance {
    pub id: String,
    pub balance: u64,
}
