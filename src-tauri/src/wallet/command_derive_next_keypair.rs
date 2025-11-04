use {
    crate::{
        constants::store::{store, STORE_KEYPAIRS, STORE_SEEDS},
        model::{keypair::SolanaWallet, seed::Seed},
    },
    log::{debug, info},
    smbcloud_wallet_core::derive_keypair::derive_keypair_default,
    solana_signer::Signer,
    tauri::{command, AppHandle},
    uuid::Uuid,
};

#[command]
pub async fn derive_next_keypair(app: AppHandle, seed_uuid: Uuid) -> Result<SolanaWallet, String> {
    let store = store(&app).map_err(|_| "Failed to load store".to_string())?;
    let seeds: Vec<Seed> = match store.get(STORE_SEEDS) {
        Some(value) => serde_json::from_value(value).unwrap_or_default(),
        None => Vec::new(),
    };
    // Get the seed phrase for this give seed uuid
    let seed = seeds
        .iter()
        .find(|s| s.id == seed_uuid)
        .ok_or_else(|| format!("Seed with UUID {} not found", seed_uuid))?;
    debug!("Deriving keypair for seed {}", seed.id);

    // Get all keypairs to determine the next account index
    let count = match store.get(STORE_KEYPAIRS) {
        Some(value) => {
            let keypairs: Vec<SolanaWallet> = serde_json::from_value(value).unwrap_or_default();
            keypairs.iter().filter(|k| k.seed_id == seed_uuid).count()
        }
        None => 0,
    };

    // Derive new keypair for this account index
    let keypair = derive_keypair_default(&seed.phrase, count as u32)
        .map_err(|e| format!("Failed to derive keypair: {:?}", e))?;

    let pubkey = keypair.pubkey().to_string();
    let privkey = bs58::encode(keypair.to_bytes()).into_string();
    let name = format!("Account {}", count as u32).to_string();
    let wallet = SolanaWallet {
        id: Uuid::new_v4(),
        username: None,
        name,
        account: count as u32,
        pubkey,
        privkey,
        seed_id: seed_uuid,
    };
    // Load existing keypairs, append, and save
    let mut keypairs: Vec<SolanaWallet> = match store.get(STORE_KEYPAIRS) {
        Some(value) => serde_json::from_value(value).unwrap_or_default(),
        None => Vec::new(),
    };
    keypairs.push(wallet.clone());
    store.set(STORE_KEYPAIRS, serde_json::json!(keypairs));
    store
        .save()
        .map_err(|_| "Failed to save keypair".to_string())?;
    debug!("Derived keypair: {}", wallet.pubkey);
    info!("Derived keypair for seed {}: {}", seed.id, wallet.pubkey);
    Ok(wallet)
}
