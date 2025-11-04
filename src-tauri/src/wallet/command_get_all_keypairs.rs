use {
    crate::{
        constants::store::{store, STORE_KEYPAIRS},
        model::keypair::SolanaWallet,
    },
    log::info,
    tauri::{command, AppHandle},
};

#[command]
pub fn get_all_keypairs(app: AppHandle) -> Result<Vec<SolanaWallet>, String> {
    info!("Getting all keypairs");
    let store = store(&app).map_err(|_| "Failed to load store".to_string())?;

    // Load existing keypairs
    let keypairs: Vec<SolanaWallet> = match store.get(STORE_KEYPAIRS) {
        Some(value) => serde_json::from_value(value).unwrap_or_default(),
        None => Vec::new(),
    };

    Ok(keypairs)
}
