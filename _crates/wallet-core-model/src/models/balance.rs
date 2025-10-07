use {
    serde::{Deserialize, Serialize},
    uniffi::Record,
};

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize, Record)]
pub struct Balance {
    pub mint: String,
    pub symbol: String,
    pub balance: f64,
    pub balance_string: String,
    pub decimal: u8,
}
