use crate::model::StorageKey;

#[uniffi::export]
pub fn storage(key: StorageKey) -> String {
    key.to_string()
}
