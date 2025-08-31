use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum FiatCurrency {
    USD,
    IDR,
    SEK,
}
