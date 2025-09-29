use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Balance {
    pub mint: String,
    pub symbol: String,
    pub balance: f64,
}
