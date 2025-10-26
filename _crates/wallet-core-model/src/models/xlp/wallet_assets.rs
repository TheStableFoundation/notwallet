use crate::models::balance_v1::BalanceV1;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WalletAssetsBalanceResponse {
    pub data: Vec<BalanceV1>,
}
