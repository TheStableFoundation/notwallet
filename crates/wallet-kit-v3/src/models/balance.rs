#[derive(uniffi::Record)]
pub struct Balance {
    pub mint: String,
    pub symbol: String,
    pub balance: String,
}
