use {
    crate::{
        constants::store::{store, STORE_ACTIVE_KEYPAIR},
        model::keypair::SolanaWallet,
    },
    serde_json::json,
    tauri::{command, AppHandle},
};

#[command]
pub fn set_active_keypair(app: AppHandle, keypair: SolanaWallet) -> Result<(), String> {
    let store = store(&app).map_err(|_| "Failed to load store".to_string())?;
    store.set(STORE_ACTIVE_KEYPAIR, json!(keypair));
    store
        .save()
        .map_err(|_| "Failed to save active keypair".to_string())?;
    Ok(())
}
