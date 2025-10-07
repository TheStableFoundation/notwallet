use std::fmt::Display;

#[derive(uniffi::Enum)]
pub enum StorageKey {
    Seeds,
    KeyPairs,
    ActiveKeyPair,
}

impl Display for StorageKey {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            StorageKey::Seeds => write!(f, "seeds"),
            StorageKey::KeyPairs => write!(f, "keypairs"),
            StorageKey::ActiveKeyPair => write!(f, "activeKeypair"),
        }
    }
}

#[uniffi::export]
pub fn storage(key: StorageKey) -> String {
    key.to_string()
}
