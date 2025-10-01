use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Balance {
    pub mint: String,
    pub symbol: String,
    pub balance: f64,
    pub balance_string: String,
    pub decimal: u8,
}
