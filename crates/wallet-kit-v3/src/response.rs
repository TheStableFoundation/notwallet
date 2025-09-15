use crate::model::{Seed, Wallet};

#[derive(uniffi::Record)]
pub struct CreateWalletResponse {
    pub wallet: Wallet,
    pub seed: Seed,
}
