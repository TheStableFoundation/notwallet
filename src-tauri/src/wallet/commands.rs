use crate::constants::store::{store, STORE_KEYPAIRS, STORE_SEEDS};
use crate::constants::{
    address::{BACH_TOKEN_ADDRESS, SPL_TOKEN_PROGRAM_ID},
    rpc::rpc_url,
};
use crate::model::keypair::SolanaWallet;
use crate::model::seed::{Seed, SeedType};
use crate::model::wallet::OnboardingCreateWallet;
use bip39::{Language, Mnemonic};
use chrono::Utc;
use log::{debug, error, info};
use solana_sdk::signature::Signer;
use tauri::{command, AppHandle};
use uuid::Uuid;
use wallet_kit::balance::bach_balance;
use wallet_kit::derive_keypair::derive_keypair_default;
use wallet_kit::token_info::token_info;

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
    let mut seeds: Vec<Seed> = match store.get(STORE_SEEDS) {
        Some(value) => serde_json::from_value(value).unwrap_or_default(),
        None => Vec::new(),
    };
    seeds.push(seed_struct);
    store.set(STORE_SEEDS, serde_json::json!(seeds));
    store.save().ok();
    let name = "Account 0".to_string();
    let wallet = SolanaWallet {
        name,
        account: 0,
        pubkey,
        privkey,
        seed_id: seed_id,
        id: Uuid::new_v4(),
    };
    // Load existing keypairs, append, and save
    let mut keypairs: Vec<SolanaWallet> = match store.get(STORE_KEYPAIRS) {
        Some(value) => serde_json::from_value(value).unwrap_or_default(),
        None => Vec::new(),
    };
    keypairs.push(wallet.clone());
    store.set(STORE_KEYPAIRS, serde_json::json!(keypairs));
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

#[command]
pub fn get_bach_balance(pubkey: String) -> String {
    info!("Getting Bach balance for {}", pubkey);
    bach_balance(
        rpc_url(),
        pubkey,
        SPL_TOKEN_PROGRAM_ID.to_string(),
        BACH_TOKEN_ADDRESS.to_string(),
    )
}

#[command]
pub fn get_token_info(id: String) -> String {
    info!("Getting token info for {}", id);
    token_info(id)
}
