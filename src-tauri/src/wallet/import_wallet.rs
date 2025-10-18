use {
    crate::constants::store::{store, STORE_KEYPAIRS, STORE_SEEDS},
    crate::model::{
        keypair::SolanaWallet,
        seed::{Seed, SeedType},
    },
    chrono::Utc,
    serde_json::json,
    smbcloud_wallet_core::derive_keypair::derive_keypair_default,
    solana_signer::Signer,
    tauri::command,
    tauri::AppHandle,
    uuid::Uuid,
};

#[command]
pub fn import_solana_wallet(
    app: AppHandle,
    mnemonic_phrase: String,
) -> Result<SolanaWallet, String> {
    // Derive keypair using the helper function (default account 0, change 0)
    let keypair = derive_keypair_default(&mnemonic_phrase, 0)?;

    let pubkey = keypair.pubkey().to_string();
    let privkey = bs58::encode(keypair.to_bytes()).into_string();

    // Create a new Seed struct with a generated UUID and Imported type
    let seed_id = Uuid::new_v4();
    let seed_struct = Seed {
        id: seed_id,
        phrase: mnemonic_phrase.clone(),
        seed_type: SeedType::Imported {
            timestamp: Utc::now(),
        },
    };

    // Save the seed struct to the store_seeds
    let store = match store(&app) {
        Ok(store) => store,
        Err(_) => {
            return Err("Failed to load store".to_string());
        }
    };
    // Load existing seeds and check for duplicates
    let mut seeds: Vec<Seed> = match store.get(STORE_SEEDS) {
        Some(value) => serde_json::from_value(value).unwrap_or_default(),
        None => Vec::new(),
    };

    // Check if a seed with the same mnemonic phrase already exists
    if let Some(existing_seed) = seeds.iter().find(|seed| seed.phrase == mnemonic_phrase) {
        // Check if there are existing wallets for this seed
        let keypairs: Vec<SolanaWallet> = match store.get(STORE_KEYPAIRS) {
            Some(value) => serde_json::from_value(value).unwrap_or_default(),
            None => Vec::new(),
        };

        let existing_wallets_count = keypairs
            .iter()
            .filter(|wallet| wallet.seed_id == existing_seed.id)
            .count();

        return Err(format!(
            "This seed phrase has already been imported and has {} existing wallet(s). Use the derive function to create additional accounts.",
            existing_wallets_count
        ));
    }

    seeds.push(seed_struct);
    store.set(STORE_SEEDS, json!(seeds));
    store.save().ok();
    let name = format!("Account {}", 0).to_string();
    let wallet = SolanaWallet {
        name,
        username: None,
        id: Uuid::new_v4(),
        account: 0,
        pubkey,
        privkey,
        seed_id: seed_id,
    };

    // Load existing keypairs, append, and save
    let mut keypairs: Vec<SolanaWallet> = match store.get(STORE_KEYPAIRS) {
        Some(value) => serde_json::from_value(value).unwrap_or_default(),
        None => Vec::new(),
    };
    keypairs.push(wallet.clone());
    store.set(STORE_KEYPAIRS, json!(keypairs));
    match store.save() {
        Ok(_) => Ok(wallet),
        Err(_) => Err("Error saving wallet".to_string()),
    }
}

// Add a tauri command to derive a new keypair from a stored seed UUID and account index
#[command]
pub fn derive_new_keypair(
    app: AppHandle,
    seed_uuid: Uuid,
    account: u32,
) -> Result<SolanaWallet, String> {
    // Load store and seeds
    let store = store(&app).map_err(|_| "Failed to load store".to_string())?;
    let seeds: Vec<Seed> = match store.get(STORE_SEEDS) {
        Some(value) => serde_json::from_value(value).unwrap_or_default(),
        None => Vec::new(),
    };
    // Find the seed by UUID
    let seed = seeds
        .iter()
        .find(|s| s.id == seed_uuid)
        .ok_or_else(|| "Seed not found".to_string())?;
    // Derive keypair using the mnemonic and account
    let keypair = derive_keypair_default(&seed.phrase, account)?;
    let pubkey = keypair.pubkey().to_string();
    let privkey = bs58::encode(keypair.to_bytes()).into_string();
    let name = format!("Account {}", account).to_string();
    let wallet = SolanaWallet {
        id: Uuid::new_v4(),
        username: None,
        name,
        account,
        pubkey,
        privkey,
        seed_id: seed_uuid,
    };

    // Load existing keypairs and check for duplicates
    let mut keypairs: Vec<SolanaWallet> = match store.get(STORE_KEYPAIRS) {
        Some(value) => serde_json::from_value(value).unwrap_or_default(),
        None => Vec::new(),
    };

    // Check if a wallet with the same seed_id and account already exists
    if let Some(existing_wallet) = keypairs
        .iter()
        .find(|w| w.seed_id == seed_uuid && w.account == account)
    {
        return Err(format!(
            "Account {} already exists for this seed phrase. Existing wallet ID: {}",
            account, existing_wallet.id
        ));
    }

    keypairs.push(wallet.clone());
    store.set(STORE_KEYPAIRS, json!(keypairs));
    store.save().ok();

    Ok(wallet)
}

// Add a command to list existing seeds and their associated wallets
#[command]
pub fn list_seeds_and_wallets(app: AppHandle) -> Result<Vec<SeedWithWallets>, String> {
    let store = store(&app).map_err(|_| "Failed to load store".to_string())?;

    // Load seeds
    let seeds: Vec<Seed> = match store.get(STORE_SEEDS) {
        Some(value) => serde_json::from_value(value).unwrap_or_default(),
        None => Vec::new(),
    };

    // Load keypairs
    let keypairs: Vec<SolanaWallet> = match store.get(STORE_KEYPAIRS) {
        Some(value) => serde_json::from_value(value).unwrap_or_default(),
        None => Vec::new(),
    };

    // Build the result
    let mut result = Vec::new();
    for seed in seeds {
        let associated_wallets: Vec<SolanaWallet> = keypairs
            .iter()
            .filter(|wallet| wallet.seed_id == seed.id)
            .cloned()
            .collect();

        result.push(SeedWithWallets {
            seed,
            wallets: associated_wallets,
        });
    }

    Ok(result)
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct SeedWithWallets {
    pub seed: Seed,
    pub wallets: Vec<SolanaWallet>,
}
