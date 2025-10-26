use serde::{Deserialize, Serialize};
use tsync::tsync;

use crate::models::asset_metadata::Metadata;

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[tsync]
pub struct BalanceV1 {
    pub meta: Metadata,
    /// Balance in its smallest nomimal. For example, a 0.01 SOL balance will return 10000000,
    /// 0.010000000 * 1_000_000_000.
    pub balance: u64,
    /// Balance in its easy-to-read form. For example, a 0.01 SOL.
    pub ui_amount: f64,
}
