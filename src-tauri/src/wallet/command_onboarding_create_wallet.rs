use {
    crate::{
        constants::store::store,
        model::{
            keypair::SolanaWallet,
            seed::{Seed, SeedType},
            wallet::OnboardingCreateWallet,
        },
    },
    bip39::{Language, Mnemonic},
    chrono::Utc,
    log::{debug, error, info},
    smbcloud_wallet_core::derive_keypair::derive_keypair_default,
    smbcloud_wallet_kit_v3::models::storage_key::{
        storage,
        StorageKey::{KeyPairs, Seeds},
    },
    solana_signer::Signer,
    tauri::{command, AppHandle},
    uuid::Uuid,
};

#[command]
pub fn onboarding_create_wallet(app: AppHandle) -> Result<OnboardingCreateWallet, String> {
    debug!("Starting Solana wallet creation");

    // Generate a new 12-word mnemonic
    let mnemonic = Mnemonic::generate_in(Language::English, 12)
        .map_err(|e| format!("Mnemonic generation failed: {:?}", e))?;
    let mnemonic_phrase = mnemonic.to_string();

    // Derive keypair using helper (account 0)
    let keypair = derive_keypair_default(&mnemonic_phrase, 0)?;

    let pubkey = keypair.pubkey().to_string();
    let privkey = bs58::encode(keypair.to_bytes()).into_string();
    debug!("Wallet pubkey: {}", pubkey);
    debug!("Wallet privkey (bs58, truncated): {}...", &privkey[..8]);

    // Create Seed struct
    let seed_id = Uuid::new_v4();
    let seed_struct = Seed {
        id: seed_id,
        phrase: mnemonic_phrase.clone(),
        seed_type: SeedType::Created {
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
    let mut seeds: Vec<Seed> = match store.get(storage(Seeds)) {
        Some(value) => serde_json::from_value(value).unwrap_or_default(),
        None => Vec::new(),
    };
    seeds.push(seed_struct);
    store.set(storage(Seeds), serde_json::json!(seeds));
    store.save().ok();
    let name = "Account 0".to_string();
    let wallet = SolanaWallet {
        name,
        username: None,
        account: 0,
        pubkey,
        privkey,
        seed_id: seed_id,
        id: Uuid::new_v4(),
    };
    // Load existing keypairs, append, and save
    let mut keypairs: Vec<SolanaWallet> = match store.get(storage(KeyPairs)) {
        Some(value) => serde_json::from_value(value).unwrap_or_default(),
        None => Vec::new(),
    };
    keypairs.push(wallet.clone());
    store.set(storage(KeyPairs), serde_json::json!(keypairs));
    match store.save() {
        Ok(_) => {
            info!("Wallet stored successfully.");
            Ok(OnboardingCreateWallet {
                seed: mnemonic_phrase.clone(),
                keypair: wallet,
            })
        }
        Err(e) => {
            error!("Failed to save wallet: {:?}", e);
            Err("Error saving wallet".to_string())
        }
    }
}
