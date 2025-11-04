use {
    crate::constants::store::{
        store, STORE_ACTIVE_KEYPAIR, STORE_KEYPAIRS, STORE_PASSWORD, STORE_SEEDS, STORE_WALLET,
    },
    log::info,
    tauri::{command, AppHandle},
};

#[command]
pub fn destroy_all_wallets(app: AppHandle) -> Result<String, String> {
    info!("Destroying all wallets and local database");

    let store = store(&app).map_err(|_| "Failed to load store".to_string())?;

    // Clear all wallet-related data from the store
    store.delete(STORE_KEYPAIRS);
    store.delete(STORE_SEEDS);
    store.delete(STORE_ACTIVE_KEYPAIR);
    store.delete(STORE_PASSWORD);
    store.delete(STORE_WALLET);

    // Save the cleared store
    store
        .save()
        .map_err(|_| "Failed to save cleared store".to_string())?;

    info!("All wallet data has been destroyed");
    Ok("All wallet data has been successfully destroyed".to_string())
}
