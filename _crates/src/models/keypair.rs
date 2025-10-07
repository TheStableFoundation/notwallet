use std::fmt::Display;

#[derive(uniffi::Record)]
pub struct KeyPair {
    pub pubkey: String,
    pub privkey: String,
}

#[derive(uniffi::Error, Debug)]
pub enum KeyPairError {
    MnemonicError(String),
    InvalidAddress(String),
    AssetPrice(String),
}

impl Display for KeyPairError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::InvalidAddress(addr) => write!(f, "Invalid address: {}", addr),
            Self::MnemonicError(err) => write!(f, "Mnemonic error: {}", err),
            Self::AssetPrice(err) => write!(f, "Asset price error: {}", err),
        }
    }
}
