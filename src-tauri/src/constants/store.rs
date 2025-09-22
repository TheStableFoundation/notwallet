use std::path::PathBuf;
use std::sync::Arc;
use tauri::{AppHandle, Wry};
use tauri_plugin_store::{Error, Store, StoreExt};
use tsync::tsync;

/// Generate:
/// tsync -i src-tauri/src/ crates/wallet-kit/src/ -o lib/crate/generated.ts

#[tsync]
pub const STORE: &str = ".notwallet.dat";
#[tsync]
pub const STORE_KEYPAIRS: &str = "keypairs";
#[tsync]
pub const STORE_SEEDS: &str = "seeds";
#[tsync]
pub const STORE_ACTIVE_KEYPAIR: &str = "activeKeypair";
#[tsync]
#[allow(dead_code)]
pub const STORE_PASSWORD: &str = "password";

/// Legacy store for the wallet.
/// This is used to store the wallet in the old format.
#[allow(dead_code)]
#[tsync]
pub const STORE_WALLET: &str = "wallet.json";

pub fn store(app: &AppHandle) -> Result<Arc<Store<Wry>>, Error> {
    // Should use app data dir
    let path = PathBuf::from(STORE);
    app.store(path.clone())
}
