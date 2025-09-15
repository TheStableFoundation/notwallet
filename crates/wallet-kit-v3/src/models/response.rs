use crate::models::{seed::Seed, wallet::Wallet};

#[derive(uniffi::Record)]
pub struct CreateWalletResponse {
    pub wallet: Wallet,
    pub seed: Seed,
}
